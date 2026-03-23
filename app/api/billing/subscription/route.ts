import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { Subscription } from "@/app/api/models/SubscriptionModel";
import { PricingPlan } from "@/app/api/models/PricingPlanModel";
import { Domain } from "@/app/api/models/DomainModel";
import { Alias } from "@/app/api/models/AliasModel";
import { ChatWidget } from "@/app/api/models/ChatWidgetModel";
import { seedPricingPlans } from "@/lib/seedPricingPlans";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    await seedPricingPlans();

    const workspace = await Workspace.findOne({ ownerUserId: userId }).lean();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const sub = await Subscription.findOne({ workspaceId: workspace._id }).lean();

    const now = new Date();
    const planId = workspace.planId ?? null;
    const plan = planId ? await PricingPlan.findOne({ id: planId }).lean() : null;

    // Compute derived values
    let daysUntilExpiry: number | null = null;
    let isExpiringSoon = false;

    if (sub?.currentPeriodEnd) {
      const msLeft = sub.currentPeriodEnd.getTime() - now.getTime();
      daysUntilExpiry = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
      isExpiringSoon = daysUntilExpiry <= 5 && daysUntilExpiry > 0;
    }

    const isExpired =
      sub?.status === "cancelled" ||
      sub?.status === "inactive" ||
      (sub?.currentPeriodEnd != null && now > sub.currentPeriodEnd);

    const ticketLimit = plan?.limits.ticketsPerMonth ?? null;
    const percentUsed =
      ticketLimit === null || ticketLimit === -1
        ? 0
        : Math.round(((sub?.ticketCountInbound ?? 0) / ticketLimit) * 100);

    // Query real resource counts for usage tab
    const [domainCount, aliasCount, chatWidgetCount] = await Promise.all([
      Domain.countDocuments({ workspaceId: workspace._id }),
      Alias.countDocuments({ workspaceId: workspace._id }),
      ChatWidget.countDocuments({ workspaceId: workspace._id }),
    ]);

    return NextResponse.json({
      planId,
      status: sub?.status ?? (planId ? "inactive" : "no_plan"),
      currentPeriodStart: sub?.currentPeriodStart ?? null,
      currentPeriodEnd: sub?.currentPeriodEnd ?? null,
      cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
      pendingPlanId: sub?.pendingPlanId ?? null,
      daysUntilExpiry,
      isExpiringSoon,
      isExpired,
      usage: {
        ticketCountInbound: sub?.ticketCountInbound ?? 0,
        ticketCountOutbound: sub?.ticketCountOutbound ?? 0,
        ticketLimit,
        percentUsed,
        domainCount,
        aliasCount,
        chatWidgetCount,
      },
      limits: plan?.limits ?? null,
    });
  } catch (error) {
    console.error("❌ Subscription fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
