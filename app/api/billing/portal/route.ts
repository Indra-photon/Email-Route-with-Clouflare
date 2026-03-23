import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { Subscription } from "@/app/api/models/SubscriptionModel";
import { createPortalSession, DodoError } from "@/lib/dodo";

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
    if (!sub?.dodoCustomerId) {
      return NextResponse.json(
        { error: "No billing account found. Please subscribe first." },
        { status: 404 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const session = await createPortalSession(
      sub.dodoCustomerId,
      `${appUrl}/dashboard/billing`
    );

    return NextResponse.json({ portalUrl: session.url });
  } catch (error) {
    console.error("❌ Portal session error:", error);
    const message =
      error instanceof DodoError ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
