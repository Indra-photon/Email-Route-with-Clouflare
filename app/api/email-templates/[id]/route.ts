import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailTemplate } from "@/app/api/models/EmailTemplateModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";

// PUT /api/email-templates/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { name, subject, body, htmlWrapper } = await req.json();

    await dbConnect();

    const workspace = await Workspace.findOne({ ownerUserId: userId });
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    const template = await EmailTemplate.findOneAndUpdate(
      { _id: id, workspaceId: workspace._id },
      {
        ...(name !== undefined && { name: name.trim() }),
        ...(subject !== undefined && { subject: subject.trim() }),
        ...(body !== undefined && { body: body.trim() }),
        ...(htmlWrapper !== undefined && { htmlWrapper: htmlWrapper.trim() }),
      },
      { new: true }
    );

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("PUT /api/email-templates/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/email-templates/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await dbConnect();

    const workspace = await Workspace.findOne({ ownerUserId: userId });
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    await EmailTemplate.findOneAndDelete({ _id: id, workspaceId: workspace._id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/email-templates/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
