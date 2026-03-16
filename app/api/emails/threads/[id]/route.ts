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
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const workspace = await getOrCreateWorkspaceForCurrentUser();
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    await dbConnect();

    const { id } = await params;

    // Get the root inbound thread
    const root = await EmailThread.findOne({
      _id: id,
      workspaceId: workspace._id,
    }).lean();

    if (!root) return NextResponse.json({ error: "Thread not found" }, { status: 404 });

    // Get all messages in this conversation chain
    const allThreads = await EmailThread.find({
      workspaceId: workspace._id,
      $or: [
        { _id: root._id },
        { inReplyTo: root.messageId },
        { references: root.messageId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    const messages = allThreads.map((t) => ({
      id: t._id.toString(),
      direction: t.direction,
      from: t.from,
      fromName: t.fromName,
      to: t.to,
      subject: t.subject,
      textBody: t.textBody,
      attachments: t.attachments || [],
      createdAt: t.createdAt,
      receivedAt: t.receivedAt,
    }));

    return NextResponse.json({
      thread: {
        id: root._id.toString(),
        from: root.from,
        fromName: root.fromName,
        to: root.to,
        subject: root.subject,
        status: root.status,
        direction: root.direction,
        assignedTo: root.assignedTo,
        assignedToEmail: root.assignedToEmail,
        assignedToName: root.assignedToName,
        claimedAt: root.claimedAt,
        receivedAt: root.receivedAt,
        repliedAt: root.repliedAt,
      },
      messages,
    });
  } catch (err) {
    console.error("Error fetching thread:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
