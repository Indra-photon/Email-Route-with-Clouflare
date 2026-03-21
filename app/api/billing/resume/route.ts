import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { Subscription } from "@/app/api/models/SubscriptionModel";
import { resumeSubscription, DodoError } from "@/lib/dodo";

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

    await resumeSubscription(sub.dodoSubscriptionId);

    sub.cancelAtPeriodEnd = false;
    sub.pendingPlanId = null;
    await sub.save();

    return NextResponse.json({
      cancelAtPeriodEnd: false,
      message: "Your subscription has been resumed successfully.",
    });
  } catch (error) {
    console.error("❌ Resume subscription error:", error);
    const message =
      error instanceof DodoError ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
