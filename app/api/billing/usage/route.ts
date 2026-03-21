import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { Subscription } from "@/app/api/models/SubscriptionModel";
import { EmailThread } from "@/app/api/models/EmailThreadModel";

export async function GET() {
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
    const periodStart = sub?.usagePeriodStart ?? new Date(0);

    const [inbound, outbound] = await Promise.all([
      EmailThread.countDocuments({
        workspaceId: workspace._id,
        direction: "inbound",
        receivedAt: { $gte: periodStart },
      }),
      EmailThread.countDocuments({
        workspaceId: workspace._id,
        direction: "outbound",
        createdAt: { $gte: periodStart },
      }),
    ]);

    return NextResponse.json({
      inbound,
      outbound,
      periodStart,
      limit: sub ? undefined : 200, // show default limit if no subscription
    });
  } catch (error) {
    console.error("❌ Usage fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
