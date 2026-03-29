import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailTemplate } from "@/app/api/models/EmailTemplateModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";

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

    const { name, subject, body, htmlWrapper } = await req.json();

    if (!name || !body) {
      return NextResponse.json(
        { error: "name and body are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const workspace = await Workspace.findOne({ ownerUserId: userId });
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    const template = await EmailTemplate.create({
      workspaceId: workspace._id,
      name: name.trim(),
      subject: (subject || "").trim(),
      body: body.trim(),
      htmlWrapper: (htmlWrapper || "").trim(),
      createdBy: userId,
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("POST /api/email-templates error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
