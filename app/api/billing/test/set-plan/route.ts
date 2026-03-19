import { NextResponse } from "next/server";

// POST /api/billing/test/set-plan
// DEV ONLY — bypasses Dodo, directly sets subscription state in MongoDB.
// Use this to test expired plan popups, limit enforcement, Slack blocks etc.

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const { planId, workspaceId, status = "active", daysUntilExpiry } = await request.json();

  if (!planId || !workspaceId) {
    return NextResponse.json({ error: "planId and workspaceId required" }, { status: 400 });
  }

  const dbConnect = (await import("@/lib/dbConnect")).default;
  await dbConnect();

  const { Workspace } = await import("@/app/api/models/WorkspaceModel");
  const { Subscription } = await import("@/app/api/models/SubscriptionModel");

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const now = new Date();
  const periodStart = new Date(now);
  const periodEnd = daysUntilExpiry !== undefined
    ? new Date(now.getTime() + daysUntilExpiry * 24 * 60 * 60 * 1000)
    : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const sub = await Subscription.findOneAndUpdate(
    { workspaceId },
    {
      planId,
      status,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      pendingPlanId: null,
      ticketCountInbound: 0,
      ticketCountOutbound: 0,
      usagePeriodStart: now,
      dodoCustomerId: "test_customer",
      dodoSubscriptionId: "test_sub",
    },
    { upsert: true, new: true }
  );

  workspace.planId = planId;
  workspace.subscriptionId = sub._id;
  await workspace.save();

  return NextResponse.json({
    success: true,
    planId,
    status,
    currentPeriodEnd: periodEnd,
    message: `Set plan to ${planId} (status: ${status})`,
  });
}
