import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { Subscription } from "@/app/api/models/SubscriptionModel";
import { PricingPlan } from "@/app/api/models/PricingPlanModel";
import {
  createCheckoutSession,
  cancelSubscriptionImmediately,
  DodoError,
} from "@/lib/dodo";
import { seedPricingPlans } from "@/lib/seedPricingPlans";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId, downgrade = false } = body as {
      planId?: string;
      downgrade?: boolean;
    };

    if (!planId || !["starter", "growth", "scale"].includes(planId)) {
      return NextResponse.json({ error: "Invalid planId" }, { status: 400 });
    }

    await dbConnect();
    await seedPricingPlans();

    const workspace = await Workspace.findOne({ ownerUserId: userId });
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const plan = await PricingPlan.findOne({ id: planId, isVisible: true });
    if (!plan) {
      console.log(`❌ Plan not found in DB for planId: "${planId}"`);
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    console.log(`✅ Plan found: id=${plan.id}, name=${plan.name}, dodoPriceId="${plan.dodoPriceId}"`);

    // Pick correct product ID based on environment
    const isLive = process.env.DODO_ENV === "live";
    const activePriceId = isLive
      ? (plan.dodoPriceIdLive || plan.dodoPriceId)
      : (plan.dodoPriceIdTest || plan.dodoPriceId);

    console.log(`🔑 DODO_ENV=${isLive ? "live" : "test"} — using priceId="${activePriceId}" for plan "${planId}"`);

    if (!activePriceId) {
      const missingField = isLive ? "dodoPriceIdLive" : "dodoPriceIdTest";
      console.log(`❌ ${missingField} is empty for plan "${planId}"`);
      return NextResponse.json(
        { error: `Plan is not yet configured for ${isLive ? "live" : "test"} payments. Set the ${isLive ? "live" : "test"} Product ID in the admin panel.` },
        { status: 503 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const existingSub = await Subscription.findOne({ workspaceId: workspace._id });

    // ── Downgrade: cancel at period end + record pendingPlanId ───────────────
    if (downgrade && existingSub?.dodoSubscriptionId) {
      const { cancelSubscriptionAtPeriodEnd } = await import("@/lib/dodo");
      await cancelSubscriptionAtPeriodEnd(existingSub.dodoSubscriptionId);
      existingSub.cancelAtPeriodEnd = true;
      existingSub.pendingPlanId = planId as "starter" | "growth" | "scale";
      await existingSub.save();

      return NextResponse.json({
        scheduled: true,
        message: `Your plan will switch to ${plan.name} at the end of your current billing period.`,
        currentPeriodEnd: existingSub.currentPeriodEnd,
      });
    }

    // ── Upgrade / new subscription: cancel existing immediately ──────────────
    if (existingSub?.dodoSubscriptionId && !existingSub.cancelAtPeriodEnd) {
      try {
        await cancelSubscriptionImmediately(existingSub.dodoSubscriptionId);
      } catch (err) {
        if (!(err instanceof DodoError && err.status === 404)) {
          throw err; // Re-throw unexpected errors
        }
      }
      existingSub.dodoSubscriptionId = null;
      await existingSub.save();
    }

    // ── Create new Dodo checkout session ─────────────────────────────────────
    const session = await createCheckoutSession({
      priceId: activePriceId,
      successUrl: `${appUrl}/billing/success`,
      cancelUrl: `${appUrl}/billing/cancelled`,
      metadata: {
        workspaceId: workspace._id.toString(),
        planId,
        userId,
      },
      ...(existingSub?.dodoCustomerId
        ? { customerId: existingSub.dodoCustomerId }
        : {}),
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("❌ Billing checkout error:", error);
    const message =
      error instanceof DodoError ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
