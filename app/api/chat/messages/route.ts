import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ChatWidget } from "@/app/api/models/ChatWidgetModel";
import { ChatConversation } from "@/app/api/models/ChatConversationModel";
import { ChatMessage } from "@/app/api/models/ChatMessageModel";
import { Integration } from "@/app/api/models/IntegrationModel";

// PUBLIC endpoint — no Clerk auth (visitor's browser calls this)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { key, conversationId, visitorId, message, visitorPage } = body as {
            key?: string;
            conversationId?: string;
            visitorId?: string;
            message?: string;
            visitorPage?: string;
        };

        if (!key || !visitorId || !message?.trim()) {
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
        if (conversationId) {
            conversation = await ChatConversation.findOne({
                _id: conversationId,
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
            body: message.trim(),
        });

        // 4. Forward to Slack/Discord
        try {
            const integration = await Integration.findById(widget.integrationId).lean();
            if (integration?.webhookUrl) {
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
                                text: `💬 *New chat message from \`${domain}\`*\n\n> ${message.trim()}`,
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
                    content: `💬 **New chat from \`${domain}\`**\n> ${message.trim()}\n\n[View Conversation](${dashboardUrl})`,
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

        return NextResponse.json({
            success: true,
            conversationId: conversation._id.toString(),
            messageId: chatMessage._id.toString(),
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

        if (!key || !conversationId || !visitorId) {
            return NextResponse.json(
                { error: "key, cid, and vid are required" },
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
                createdAt: m.createdAt,
            })),
            widgetConfig: {
                welcomeMessage: widget.welcomeMessage,
                accentColor: widget.accentColor,
            },
        });
    } catch (error) {
        console.error("GET /api/chat/messages error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
