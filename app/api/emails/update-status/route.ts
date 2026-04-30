import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { getPostHogClient } from "@/lib/posthog-server";
import { getSubscriptionGuard } from "@/lib/checkSubscriptionStatus";

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

    const { isExpired, hasNoPlan } = await getSubscriptionGuard(workspace._id);
    if (hasNoPlan) return NextResponse.json({ error: "No active plan. Please purchase a plan.", upgradeRequired: true }, { status: 403 });
    if (isExpired) return NextResponse.json({ error: "Your plan has expired. Please renew.", upgradeRequired: true }, { status: 403 });

    // Find root thread and verify access
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

    const now = new Date();
    const statusFields: Record<string, unknown> = {
      status,
      statusUpdatedAt: now,
    };

    if (status === 'resolved') {
      statusFields.resolvedAt = now;
      statusFields.resolvedBy = userId;
    } else {
      statusFields.resolvedAt = null;
      statusFields.resolvedBy = null;
    }

    // ── Walk UP the reference chain to find the true root inbound ticket ──
    // The threadId we receive is always the root in normal kanban usage, but
    // we walk up anyway so the cascade is correct in all cases.
    let rootThread: typeof thread = thread;
    const refsToCheck = [
      thread.inReplyTo,
      ...(thread.references || []),
    ].filter(Boolean) as string[];

    if (refsToCheck.length > 0) {
      const ancestor = await EmailThread.findOne({
        workspaceId: workspace._id,
        messageId: { $in: refsToCheck },
        direction: "inbound",
      })
        .sort({ createdAt: 1 })
        .lean();
      if (ancestor && ancestor.workspaceId.toString() === workspace._id.toString()) {
        rootThread = await EmailThread.findById(ancestor._id) as typeof thread;
      }
    }

    // ── Cascade status to ALL messages in this conversation chain ──────────
    // Covers: root ticket + all reply emails in both directions.
    await EmailThread.updateMany(
      {
        workspaceId: workspace._id,
        $or: [
          { _id: rootThread._id },
          { inReplyTo: rootThread.messageId },
          { references: rootThread.messageId },
        ],
      },
      { $set: statusFields }
    );

    // Re-fetch the root thread to return accurate data
    const updated = await EmailThread.findById(rootThread._id).lean();

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: userId,
      event: "ticket_status_updated",
      properties: {
        thread_id: threadId,
        new_status: status,
        workspace_id: workspace._id.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      thread: {
        id: updated!._id.toString(),
        status: updated!.status,
        statusUpdatedAt: updated!.statusUpdatedAt,
        resolvedAt: updated!.resolvedAt,
        resolvedBy: updated!.resolvedBy,
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
