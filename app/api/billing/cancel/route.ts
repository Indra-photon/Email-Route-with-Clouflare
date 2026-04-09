import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { Subscription } from "@/app/api/models/SubscriptionModel";
import { cancelSubscriptionAtPeriodEnd, DodoError } from "@/lib/dodo";
import { getPostHogClient } from "@/lib/posthog-server";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const workspace = await Workspace.findOne({ ownerUserId: userId }).lean();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const sub = await Subscription.findOne({ workspaceId: workspace._id });
    if (!sub || !sub.dodoSubscriptionId) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    await cancelSubscriptionAtPeriodEnd(sub.dodoSubscriptionId);

    sub.cancelAtPeriodEnd = true;
    await sub.save();

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: userId,
      event: "subscription_cancelled",
      properties: {
        plan_id: sub.planId,
        workspace_id: workspace._id.toString(),
        current_period_end: sub.currentPeriodEnd,
      },
    });

    const endDate = sub.currentPeriodEnd
      ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "end of billing period";

    return NextResponse.json({
      cancelAtPeriodEnd: true,
      currentPeriodEnd: sub.currentPeriodEnd,
      message: `Your plan will remain active until ${endDate}.`,
    });
  } catch (error) {
    console.error("❌ Cancel subscription error:", error);
    const message =
      error instanceof DodoError ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
