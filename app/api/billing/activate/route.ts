import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { Subscription } from "@/app/api/models/SubscriptionModel";
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

    // Upsert subscription record
    await Subscription.findOneAndUpdate(
      { workspaceId: workspace._id },
      {
        $set: {
          planId,
          status: "active",
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

    // Update workspace plan
    workspace.planId = planId as "starter" | "growth" | "scale";
    await workspace.save();

    console.log(`✅ Subscription activated: workspace=${workspaceId}, plan=${planId}`);

    return NextResponse.json({ success: true, planId, status: "active" });
  } catch (error) {
    console.error("❌ Billing activate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
