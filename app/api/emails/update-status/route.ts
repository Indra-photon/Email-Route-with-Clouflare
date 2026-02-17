import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";

const VALID_STATUSES = ['open', 'in_progress', 'waiting', 'resolved'];

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId, status } = await request.json();

    // Validate inputs
    if (!threadId || !status) {
      return NextResponse.json(
        { error: "threadId and status are required" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get user's workspace
    const workspace = await Workspace.findOne({ ownerUserId: userId }).lean();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Find thread and verify access
    const thread = await EmailThread.findById(threadId);
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    if (thread.workspaceId.toString() !== workspace._id.toString()) {
      return NextResponse.json(
        { error: "You don't have access to this thread" },
        { status: 403 }
      );
    }

    // Update status
    thread.status = status;
    thread.statusUpdatedAt = new Date();

    // If resolved, track who and when
    if (status === 'resolved') {
      thread.resolvedAt = new Date();
      thread.resolvedBy = userId;
    }

    await thread.save();

    return NextResponse.json({
      success: true,
      thread: {
        id: thread._id.toString(),
        status: thread.status,
        statusUpdatedAt: thread.statusUpdatedAt,
        resolvedAt: thread.resolvedAt,
        resolvedBy: thread.resolvedBy,
      }
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
