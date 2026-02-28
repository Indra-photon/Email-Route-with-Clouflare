import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { ChatConversation } from "@/app/api/models/ChatConversationModel";
import { ChatMessage } from "@/app/api/models/ChatMessageModel";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        const body = await request.json();
        const { message } = body as { message?: string };

        if (!message?.trim()) {
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
            body: message.trim(),
        });

        conversation.lastMessageAt = new Date();
        await conversation.save();

        // Push to Render server for real-time delivery to the visitor
        try {
            const renderUrl = process.env.RENDER_CHAT_SERVER_URL;
            const pushSecret = process.env.RENDER_PUSH_SECRET;

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
                            sender: "agent",
                            body: chatMessage.body,
                            createdAt: chatMessage.createdAt,
                        },
                    }),
                });
            }
        } catch (pushErr) {
            // Don't fail the reply if Render push fails
            console.error("Render push error:", pushErr);
        }

        return NextResponse.json({
            success: true,
            message: {
                id: chatMessage._id.toString(),
                sender: chatMessage.sender,
                body: chatMessage.body,
                createdAt: chatMessage.createdAt,
            },
        });
    } catch (error) {
        console.error("POST /api/chat/conversations/[id]/reply error:", error);
        return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
    }
}
