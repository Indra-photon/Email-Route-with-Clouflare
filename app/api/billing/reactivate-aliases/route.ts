import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { Subscription } from "@/app/api/models/SubscriptionModel";
import { Alias } from "@/app/api/models/AliasModel";

/**
 * POST /api/billing/reactivate-aliases
 *
 * Called after a successful checkout or from the billing dashboard.
 * Reactivates ALL aliases for the workspace IF the subscription is active.
 *
 * This is a safety net for when the Dodo webhook (subscription.activated)
 * fires but aliases weren't reactivated (e.g. test mode, webhook delivery lag).
 */
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

    const sub = await Subscription.findOne({ workspaceId: workspace._id }).lean();

    // Only reactivate if the subscription is actually active
    const now = new Date();
    const isActive =
      sub?.status === "active" &&
      (sub.currentPeriodEnd === null || now <= sub.currentPeriodEnd);

    if (!isActive) {
      return NextResponse.json(
        { error: "No active subscription found. Please upgrade your plan first." },
        { status: 403 }
      );
    }

    const result = await Alias.updateMany(
      { workspaceId: workspace._id },
      { $set: { status: "active" } }
    );

    console.log(
      `✅ Reactivated ${result.modifiedCount} aliases for workspace ${workspace._id.toString()}`
    );

    return NextResponse.json({
      success: true,
      reactivated: result.modifiedCount,
      message: `${result.modifiedCount} alias(es) reactivated successfully.`,
    });
  } catch (error) {
    console.error("❌ Reactivate aliases error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
