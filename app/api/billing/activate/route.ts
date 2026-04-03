import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { Subscription } from "@/app/api/models/SubscriptionModel";
import { Alias } from "@/app/api/models/AliasModel";
import { getSubscription } from "@/lib/dodo";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subscriptionId } = body as { subscriptionId?: string };

    if (!subscriptionId) {
      return NextResponse.json({ error: "subscriptionId is required" }, { status: 400 });
    }

    // Fetch subscription details from Dodo
    let dodoSub;
    try {
      dodoSub = await getSubscription(subscriptionId);
    } catch (err) {
      console.error("❌ Failed to fetch subscription from Dodo:", err);
      return NextResponse.json({ error: "Could not verify subscription with payment provider" }, { status: 502 });
    }

    console.log("✅ Dodo subscription fetched:", JSON.stringify(dodoSub, null, 2));

    // Accept both active and trialing — both mean the user has a valid subscription
    const dodoStatus = (dodoSub.status as string) ?? "";
    const isValidSubscription = dodoStatus === "active" || dodoStatus === "trialing";
    if (!isValidSubscription) {
      console.log(`⚠️ Subscription status is "${dodoStatus}" — not activating yet`);
      return NextResponse.json({ success: false, status: dodoStatus });
    }

    // Extract metadata set during checkout creation
    const { workspaceId, planId } = (dodoSub.metadata ?? {}) as {
      workspaceId?: string;
      planId?: string;
    };

    if (!workspaceId || !planId) {
      console.error("❌ Missing metadata on Dodo subscription:", dodoSub.metadata);
      return NextResponse.json({ error: "Subscription metadata missing" }, { status: 422 });
    }

    await dbConnect();

    // Security: ensure the workspace belongs to the requesting user
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace || workspace.ownerUserId !== userId) {
      return NextResponse.json({ error: "Workspace not found or not authorized" }, { status: 403 });
    }

    const now = new Date();
    const periodStart = dodoSub.current_period_start
      ? new Date(dodoSub.current_period_start)
      : now;
    const periodEnd = dodoSub.current_period_end
      ? new Date(dodoSub.current_period_end)
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Determine DB status — map Dodo's status to our enum
    const dbStatus: "active" | "trialing" = dodoStatus === "trialing" ? "trialing" : "active";

    // Upsert subscription record
    await Subscription.findOneAndUpdate(
      { workspaceId: workspace._id },
      {
        $set: {
          planId,
          status: dbStatus,
          dodoCustomerId: dodoSub.customer_id ?? null,
          dodoSubscriptionId: subscriptionId,
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: dodoSub.cancel_at_period_end ?? false,
          pendingPlanId: null,
        },
      },
      { upsert: true, new: true }
    );

    // Update workspace plan (give full plan access even during trial)
    workspace.planId = planId as "starter" | "growth" | "scale";
    await workspace.save();

    // Re-activate all aliases that were paused due to an inbound limit
    const aliasResult = await Alias.updateMany(
      { workspaceId: workspace._id },
      { $set: { status: "active" } }
    );
    console.log(`✅ Reactivated ${aliasResult.modifiedCount} aliases for workspace ${workspaceId}`);

    console.log(`✅ Subscription ${dbStatus}: workspace=${workspaceId}, plan=${planId}`);

    return NextResponse.json({ success: true, planId, status: dbStatus });
  } catch (error) {
    console.error("❌ Billing activate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
