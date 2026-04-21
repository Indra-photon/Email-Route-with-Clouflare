import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { CannedResponse } from "@/app/api/models/CannedResponseModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { getSubscriptionGuard } from "@/lib/checkSubscriptionStatus";

// GET /api/canned-responses?aliasId=xxx
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const aliasId = req.nextUrl.searchParams.get("aliasId");
    if (!aliasId) return NextResponse.json({ error: "aliasId is required" }, { status: 400 });

    await dbConnect();

    const workspace = await Workspace.findOne({ ownerUserId: userId });
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    const responses = await CannedResponse.find({
      workspaceId: workspace._id,
      aliasId,
    }).sort({ createdAt: -1 });

    return NextResponse.json(responses);
  } catch (error) {
    console.error("GET /api/canned-responses error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/canned-responses
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { aliasId, title, body } = await req.json();

    if (!aliasId || !title || !body) {
      return NextResponse.json({ error: "aliasId, title, and body are required" }, { status: 400 });
    }

    await dbConnect();

    const workspace = await Workspace.findOne({ ownerUserId: userId });
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    const { isExpired, hasNoPlan } = await getSubscriptionGuard(workspace._id);
    if (hasNoPlan) return NextResponse.json({ error: "No active plan. Please purchase a plan.", upgradeRequired: true }, { status: 403 });
    if (isExpired) return NextResponse.json({ error: "Your plan has expired. Please renew.", upgradeRequired: true }, { status: 403 });

    const cannedResponse = await CannedResponse.create({
      workspaceId: workspace._id,
      aliasId,
      title: title.trim(),
      body: body.trim(),
      createdBy: userId,
    });

    return NextResponse.json(cannedResponse, { status: 201 });
  } catch (error) {
    console.error("POST /api/canned-responses error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}