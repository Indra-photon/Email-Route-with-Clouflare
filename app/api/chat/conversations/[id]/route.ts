import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { ChatConversation } from "@/app/api/models/ChatConversationModel";
import { ChatMessage } from "@/app/api/models/ChatMessageModel";
import { ChatWidget } from "@/app/api/models/ChatWidgetModel";
import { deleteFromR2 } from "@/lib/r2";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        await dbConnect();
        const workspace = await getOrCreateWorkspaceForCurrentUser();

        const conversation = await ChatConversation.findOne({
            _id: id,
            workspaceId: workspace._id,
        }).lean();

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const [messages, widget] = await Promise.all([
            ChatMessage.find({ conversationId: id })
                .sort({ createdAt: 1 })
                .lean()
                .exec(),
            ChatWidget.findById(conversation.widgetId).lean(),
        ]);

        return NextResponse.json({
            id: conversation._id.toString(),
            widgetId: conversation.widgetId.toString(),
            visitorId: conversation.visitorId,
            visitorPage: conversation.visitorPage,
            status: conversation.status,
            lastMessageAt: conversation.lastMessageAt,
            createdAt: conversation.createdAt,
            widget: widget
                ? {
                    domain: widget.domain,
                    accentColor: widget.accentColor,
                    welcomeMessage: widget.welcomeMessage,
                }
                : null,
            widgetKey: widget?.activationKey || null,
            messages: messages.map((m) => ({
                id: m._id.toString(),
                sender: m.sender,
                body: m.body,
                type: m.type || "text",
                mediaUrl: m.mediaUrl || "",
                createdAt: m.createdAt,
            })),
        });
    } catch (error) {
        console.error("GET /api/chat/conversations/[id] error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        await dbConnect();
        const workspace = await getOrCreateWorkspaceForCurrentUser();

        // 1. Verify the conversation belongs to the user
        const conversation = await ChatConversation.findOne({
            _id: id,
            workspaceId: workspace._id,
        });

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        // 2. Find all messages with media to delete from R2
        const messagesWithMedia = await ChatMessage.find({
            conversationId: id,
            mediaUrl: { $exists: true, $ne: "" }
        }).lean();

        // 3. Delete files from R2
        if (messagesWithMedia.length > 0) {
            const deletePromises = messagesWithMedia.map(msg => {
                if (msg.mediaUrl) {
                    return deleteFromR2(msg.mediaUrl).catch(e =>
                        console.error(`Failed to delete R2 asset for ${msg.mediaUrl}:`, e)
                    );
                }
                return Promise.resolve();
            });

            await Promise.allSettled(deletePromises);
        }

        // 4. Delete all messages from the database
        await ChatMessage.deleteMany({ conversationId: id });

        // 5. Delete the conversation itself
        await ChatConversation.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/chat/conversations/[id] error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
