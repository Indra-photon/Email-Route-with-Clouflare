import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { ChatConversation } from "@/app/api/models/ChatConversationModel";
import { ChatMessage } from "@/app/api/models/ChatMessageModel";
import { ChatWidget } from "@/app/api/models/ChatWidgetModel";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        await dbConnect();
        const workspace = await getOrCreateWorkspaceForCurrentUser();

        const conversations = await ChatConversation.find({
            workspaceId: workspace._id,
        })
            .sort({ lastMessageAt: -1 })
            .limit(50)
            .lean()
            .exec();

        // Get last message preview for each conversation
        const withPreviews = await Promise.all(
            conversations.map(async (conv) => {
                const lastMsg = await ChatMessage.findOne({
                    conversationId: conv._id,
                })
                    .sort({ createdAt: -1 })
                    .lean();

                const widget = await ChatWidget.findById(conv.widgetId)
                    .lean()
                    .select("domain accentColor");

                return {
                    id: conv._id.toString(),
                    widgetId: conv.widgetId.toString(),
                    visitorId: conv.visitorId,
                    visitorPage: conv.visitorPage,
                    status: conv.status,
                    lastMessageAt: conv.lastMessageAt,
                    createdAt: conv.createdAt,
                    lastMessage: lastMsg
                        ? { body: lastMsg.body, sender: lastMsg.sender }
                        : null,
                    widget: widget
                        ? { domain: widget.domain, accentColor: widget.accentColor }
                        : null,
                };
            })
        );

        return NextResponse.json(withPreviews);
    } catch (error) {
        console.error("GET /api/chat/conversations error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
