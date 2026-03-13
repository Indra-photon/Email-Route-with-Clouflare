import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ChatWidget } from "@/app/api/models/ChatWidgetModel";
import { ChatConversation } from "@/app/api/models/ChatConversationModel";
import { ChatMessage } from "@/app/api/models/ChatMessageModel";
import { Integration } from "@/app/api/models/IntegrationModel";
import { postToSlackLiveChat } from "@/lib/slackLiveChat";

// PUBLIC endpoint — no Clerk auth (visitor's browser calls this)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { key, conversationId: reqConvId, visitorId, message, visitorPage, type, mediaUrl } = body as {
            key?: string;
            conversationId?: string;
            visitorId?: string;
            message?: string;
            visitorPage?: string;
            type?: 'text' | 'image' | 'pdf';
            mediaUrl?: string;
        };

        if (!key || !visitorId || (!message?.trim() && !mediaUrl)) {
            return NextResponse.json(
                { error: "key, visitorId, and message are required" },
                { status: 400 }
            );
        }

        await dbConnect();

        // 1. Validate key
        const widget = await ChatWidget.findOne({
            activationKey: key,
            status: "active",
        }).lean();

        if (!widget) {
            return NextResponse.json(
                { error: "Invalid or inactive activation key" },
                { status: 401 }
            );
        }

        // 2. Upsert conversation
        let conversation;
        if (reqConvId) {
            conversation = await ChatConversation.findOne({
                _id: reqConvId,
                widgetId: widget._id,
                visitorId,
            });
        }

        if (!conversation) {
            conversation = await ChatConversation.findOneAndUpdate(
                { widgetId: widget._id, visitorId },
                {
                    $setOnInsert: {
                        workspaceId: widget.workspaceId,
                        visitorPage: visitorPage || "",
                        status: "open",
                    },
                    $set: { lastMessageAt: new Date() },
                },
                { upsert: true, new: true }
            );
        } else {
            conversation.lastMessageAt = new Date();
            await conversation.save();
        }

        // 3. Save message
        const chatMessage = await ChatMessage.create({
            conversationId: conversation._id,
            widgetId: widget._id,
            sender: "visitor",
            body: message?.trim() || '',
            type: type || 'text',
            mediaUrl: mediaUrl || '',
        });



        // 4. Forward to Slack/Discord
        try {
            const integration = await Integration.findById(widget.integrationId).lean();
            
            // 4a. Slack OAuth Live Chat (bidirectional threads)
            if (integration?.type === "slack" && integration.authMethod === "oauth" && integration.slackAccessToken) {
                const slackResult = await postToSlackLiveChat({
                    channelId: integration.slackChannelId || "",
                    botToken: integration.slackAccessToken,
                    message: message?.trim() || "[file attachment]",
                    threadTs: conversation.slackThreadTs || undefined,
                    visitorId,
                    domain: widget.domain,
                    mediaUrl: mediaUrl || undefined,
                    mediaType: (type as 'text' | 'image' | 'pdf') || 'text',
                });

                if (slackResult.ok && slackResult.threadTs) {
                    // Save thread_ts for first message, or keep existing
                    if (!conversation.slackThreadTs) {
                        conversation.slackThreadTs = slackResult.threadTs;
                        conversation.slackChannelId = integration.slackChannelId || null;
                        await conversation.save();
                        console.log(`✅ Slack live chat thread created: ${slackResult.threadTs}`);
                    }
                } else {
                    console.error("⚠️ Failed to post to Slack live chat:", slackResult.error);
                }
            }
            // 4b. Webhook-based integration (legacy notification-only)
            else if (integration?.webhookUrl) {
                const domain = widget.domain;
                const convId = conversation._id.toString();
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
                const dashboardUrl = `${baseUrl}/dashboard/live-chats/${convId}`;

                const slackPayload = {
                    text: `💬 *New chat message from ${domain}*`,
                    blocks: [
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: `💬 *New chat message from \`${domain}\`*\n\n> ${(message || '').trim() || '[file attachment]'}`,
                            },
                        },
                        {
                            type: "section",
                            fields: [
                                { type: "mrkdwn", text: `*Visitor ID:*\n${visitorId}` },
                                { type: "mrkdwn", text: `*Page:*\n${visitorPage || "unknown"}` },
                            ],
                        },
                        {
                            type: "actions",
                            elements: [
                                {
                                    type: "button",
                                    text: { type: "plain_text", text: "View Conversation →" },
                                    url: dashboardUrl,
                                    style: "primary",
                                },
                            ],
                        },
                    ],
                };

                // Discord uses a different format
                const discordPayload = {
                    content: `💬 **New chat from \`${domain}\`**\n> ${(message || '').trim() || '[file attachment]'}\n\n[View Conversation](${dashboardUrl})`,
                };

                const webhookPayload =
                    integration.type === "discord" ? discordPayload : slackPayload;

                await fetch(integration.webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(webhookPayload),
                });
            }
        } catch (webhookErr) {
            // Don't fail the request if webhook fails
            console.error("Webhook forward error:", webhookErr);
        }

        // 5. Push to Render Chat Server to ensure agent dashboard receives it 
        // We include excludeSocketId (if provided) so the render server doesn't broadcast back to the sender
        const { socketId } = body;
        try {
            const pushSecret = process.env.RENDER_PUSH_SECRET;
            const renderUrl = process.env.NEXT_PUBLIC_RENDER_CHAT_SERVER_URL;
            if (renderUrl && pushSecret) {
                await fetch(`${renderUrl}/push`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-push-secret": pushSecret,
                    },
                    body: JSON.stringify({
                        conversationId: conversation._id.toString(),
                        message: {
                            id: chatMessage._id.toString(),
                            sender: chatMessage.sender,
                            body: chatMessage.body,
                            type: chatMessage.type,
                            mediaUrl: chatMessage.mediaUrl,
                            createdAt: chatMessage.createdAt,
                        },
                        excludeSocketId: socketId, // Exclude the sender's socket from receiving the broadcast loop
                    }),
                });
            }
        } catch (pushErr) {
            console.error("Failed to push message to chat server:", pushErr);
        }

        return NextResponse.json({
            success: true,
            conversationId: conversation._id.toString(),
            messageId: chatMessage._id.toString(),
            message: {
                id: chatMessage._id.toString(),
                sender: chatMessage.sender,
                body: chatMessage.body,
                type: chatMessage.type,
                mediaUrl: chatMessage.mediaUrl,
                createdAt: chatMessage.createdAt,
            },
        });
    } catch (error) {
        console.error("POST /api/chat/messages error:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}

// GET messages for a conversation (visitor polling)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get("key");
        const conversationId = searchParams.get("cid");
        const visitorId = searchParams.get("vid");
        const after = searchParams.get("after"); // ISO timestamp for incremental fetch

        if (!key || !visitorId) {
            return NextResponse.json(
                { error: "key and vid are required" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Validate key
        const widget = await ChatWidget.findOne({
            activationKey: key,
            status: "active",
        }).lean();

        if (!widget) {
            return NextResponse.json({ error: "Invalid key" }, { status: 401 });
        }

        const widgetConfig = {
            welcomeMessage: widget.welcomeMessage,
            accentColor: widget.accentColor,
        };

        // ── vid-only mode: discover active conversation ─────────────────────
        // Called by the embed page on mount to check if this visitor has
        // an existing open conversation (without needing a cid from localStorage).
        if (!conversationId) {
            const activeConv = await ChatConversation.findOne({
                widgetId: widget._id,
                visitorId,
                status: "open",
            })
                .sort({ lastMessageAt: -1 })
                .lean();

            return NextResponse.json({
                conversationId: activeConv ? activeConv._id.toString() : null,
                widgetConfig,
            });
        }

        // ── cid + vid mode: return messages for the conversation ──────────
        // Verify conversation belongs to this visitor & widget
        const conversation = await ChatConversation.findOne({
            _id: conversationId,
            widgetId: widget._id,
            visitorId,
        }).lean();

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        // Fetch messages
        const query: Record<string, unknown> = { conversationId };
        if (after) {
            query.createdAt = { $gt: new Date(after) };
        }

        const messages = await ChatMessage.find(query)
            .sort({ createdAt: 1 })
            .lean()
            .exec();

        return NextResponse.json({
            messages: messages.map((m) => ({
                id: m._id.toString(),
                sender: m.sender,
                body: m.body,
                type: m.type || 'text',
                mediaUrl: m.mediaUrl || '',
                createdAt: m.createdAt,
            })),
            widgetConfig,
        });
    } catch (error) {
        console.error("GET /api/chat/messages error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
