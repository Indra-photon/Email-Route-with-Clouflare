import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { ChatConversation } from "@/app/api/models/ChatConversationModel";
import { ChatMessage } from "@/app/api/models/ChatMessageModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await dbConnect();
    const workspace = await getOrCreateWorkspaceForCurrentUser();

    // Fetch recent conversations (open first, then closed)
    const conversations = await ChatConversation.find({
      workspaceId: workspace._id,
    })
      .populate("widgetId", "name")
      .sort({ lastMessageAt: -1 })
      .limit(5)
      .lean();

    const now = new Date();

    const chats = await Promise.all(
      conversations.map(async (c: any) => {
        // Get last message for preview
        const lastMsg = await ChatMessage.findOne({
          conversationId: c._id,
          sender: "visitor",
        })
          .sort({ createdAt: -1 })
          .select("body createdAt")
          .lean() as any;

        const lastMessageAt = new Date(c.lastMessageAt);
        const diffMs = now.getTime() - lastMessageAt.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours   = Math.floor(diffMinutes / 60);

        let time = "";
        if (diffMinutes < 1)      time = "just now";
        else if (diffMinutes < 60) time = `${diffMinutes}m ago`;
        else if (diffHours < 24)  time = `${diffHours}h ago`;
        else                       time = `${Math.floor(diffHours / 24)}d ago`;

        // Map status: ChatConversation uses "open"|"closed"
        // We map "open" → "active", "closed" → "resolved"
        // We check if lastMessageAt > 30min ago + closed → "missed"
        let status: "active" | "missed" | "resolved" = "resolved";
        if (c.status === "open") {
          if (diffMinutes > 30) {
            status = "missed";
          } else {
            status = "active";
          }
        }

        const widgetName = (c.widgetId as any)?.name ?? "Widget";

        return {
          id:      c._id.toString(),
          visitor: c.visitorId.startsWith("visitor_") ? `Visitor #${c.visitorId.slice(-4)}` : c.visitorId,
          widget:  `${widgetName}`,
          message: (lastMsg as any)?.body ?? "No messages yet",
          status,
          time,
        };
      })
    );

    return NextResponse.json(chats);
  } catch (err) {
    console.error("[dashboard/live-chats]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
