import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspace = await getOrCreateWorkspaceForCurrentUser();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    await dbConnect();

    const { id } = await params;

    // Find the root inbound ticket
    const rootThread = await EmailThread.findOne({
      _id: id,
      workspaceId: workspace._id,
      direction: "inbound",
    }).lean();

    if (!rootThread) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Fetch all messages in the conversation:
    // - The root inbound itself
    // - Any message that replies to it (inReplyTo = root messageId)
    // - Any message that includes it in references (deeper chain)
    const messages = await EmailThread.find({
      workspaceId: workspace._id,
      $or: [
        { _id: rootThread._id },
        { inReplyTo: rootThread.messageId },
        { references: rootThread.messageId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    const formatted = messages.map((m) => ({
      id: m._id.toString(),
      direction: m.direction,
      from: m.from,
      fromName: m.fromName,
      to: m.to,
      subject: m.subject,
      textBody: m.textBody,
      htmlBody: m.htmlBody,
      attachments: m.attachments || [],
      status: m.status,
      createdAt: m.createdAt,
      receivedAt: m.receivedAt,
    }));

    return NextResponse.json({ messages: formatted, ticket: {
      id: rootThread._id.toString(),
      from: rootThread.from,
      fromName: rootThread.fromName,
      subject: rootThread.subject,
      status: rootThread.status,
      assignedToName: rootThread.assignedToName,
      assignedToEmail: rootThread.assignedToEmail,
    }});
  } catch (err) {
    console.error("❌ Error fetching thread:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
