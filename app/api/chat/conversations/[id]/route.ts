import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { ChatConversation } from "@/app/api/models/ChatConversationModel";
import { ChatMessage } from "@/app/api/models/ChatMessageModel";
import { ChatWidget } from "@/app/api/models/ChatWidgetModel";

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
            messages: messages.map((m) => ({
                id: m._id.toString(),
                sender: m.sender,
                body: m.body,
                createdAt: m.createdAt,
            })),
        });
    } catch (error) {
        console.error("GET /api/chat/conversations/[id] error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
