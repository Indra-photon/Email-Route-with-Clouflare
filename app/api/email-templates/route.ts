import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailTemplate } from "@/app/api/models/EmailTemplateModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { getSubscriptionGuard } from "@/lib/checkSubscriptionStatus";

// GET /api/email-templates  — list all templates for the caller's workspace
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const workspace = await Workspace.findOne({ ownerUserId: userId });
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    const templates = await EmailTemplate.find({ workspaceId: workspace._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(templates);
  } catch (error) {
    console.error("GET /api/email-templates error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/email-templates  — create a new template
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, subject, body, htmlBody } = await req.json();

    if (!name || (!body && !htmlBody)) {
      return NextResponse.json(
        { error: "name and at least a plain text body or HTML body are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const workspace = await Workspace.findOne({ ownerUserId: userId });
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    const { isExpired, hasNoPlan } = await getSubscriptionGuard(workspace._id);
    if (hasNoPlan) return NextResponse.json({ error: "No active plan. Please purchase a plan.", upgradeRequired: true }, { status: 403 });
    if (isExpired) return NextResponse.json({ error: "Your plan has expired. Please renew.", upgradeRequired: true }, { status: 403 });

    const template = await EmailTemplate.create({
      workspaceId: workspace._id,
      name: name.trim(),
      subject: (subject || "").trim(),
      body: (body || "").trim(),
      htmlBody: "", // Force clear deprecated field
      createdBy: userId,
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("POST /api/email-templates error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
