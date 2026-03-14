import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { ChatConversation } from "@/app/api/models/ChatConversationModel";
import { ChatMessage } from "@/app/api/models/ChatMessageModel";
import { ChatWidget } from "@/app/api/models/ChatWidgetModel";
import { Integration } from "@/app/api/models/IntegrationModel";
import { postAgentReplyToSlack } from "@/lib/slackLiveChat";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        const body = await request.json();
        const { message, type, mediaUrl, socketId } = body;

        if (!message?.trim() && !mediaUrl) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        await dbConnect();
        const workspace = await getOrCreateWorkspaceForCurrentUser();

        // Verify conversation belongs to this workspace
        const conversation = await ChatConversation.findOne({
            _id: id,
            workspaceId: workspace._id,
        });

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        // Save agent message to DB
        const chatMessage = await ChatMessage.create({
            conversationId: conversation._id,
            widgetId: conversation.widgetId,
            sender: "agent",
            body: message?.trim() || '',
            type: type || 'text',
            mediaUrl: mediaUrl || '',
        });

        conversation.lastMessageAt = new Date();
        await conversation.save();

        // Post to Slack thread if this conversation has Slack integration
        try {
            if (conversation.slackThreadTs && conversation.slackChannelId) {
                const widget = await ChatWidget.findById(conversation.widgetId).lean();
                if (widget) {
                    const integration = await Integration.findById(widget.integrationId).lean();
                    if (
                        integration?.type === "slack" &&
                        integration.authMethod === "oauth" &&
                        integration.slackAccessToken
                    ) {
                        const slackResult = await postAgentReplyToSlack({
                            channelId: conversation.slackChannelId,
                            botToken: integration.slackAccessToken,
                            threadTs: conversation.slackThreadTs,
                            message: message?.trim() || "[file attachment]",
                            mediaUrl: mediaUrl || undefined,
                            mediaType: (type as 'text' | 'image' | 'pdf') || 'text',
                        });
                        if (slackResult.ok && slackResult.ts) {
                            await chatMessage.updateOne({ slackMessageTs: slackResult.ts });
                        }
                    }
                }
            }
        } catch (slackErr) {
            console.error("⚠️ Failed to post agent reply to Slack:", slackErr);
        }

        // Push to Render Chat Server
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
                        excludeSocketId: socketId,
                    }),
                });
            }
        } catch (pushErr) {
            console.error("Failed to push agent reply to chat server:", pushErr);
        }

        return NextResponse.json({
            success: true,
            message: {
                id: chatMessage._id.toString(),
                sender: chatMessage.sender,
                body: chatMessage.body,
                type: chatMessage.type || 'text',
                mediaUrl: chatMessage.mediaUrl || '',
                createdAt: chatMessage.createdAt,
            },
        });
    } catch (error) {
        console.error("POST /api/chat/conversations/[id]/reply error:", error);
        return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
    }
}
