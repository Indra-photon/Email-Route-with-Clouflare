import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { CannedResponse } from "@/app/api/models/CannedResponseModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";

// PUT /api/canned-responses/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, body } = await req.json();
    if (!title && !body) {
      return NextResponse.json({ error: "title or body is required" }, { status: 400 });
    }

    await dbConnect();

    const workspace = await Workspace.findOne({ ownerUserId: userId });
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    const updated = await CannedResponse.findOneAndUpdate(
      { _id: params.id, workspaceId: workspace._id },
      { ...(title && { title: title.trim() }), ...(body && { body: body.trim() }) },
      { new: true }
    );

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/canned-responses/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/canned-responses/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const workspace = await Workspace.findOne({ ownerUserId: userId });
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    const deleted = await CannedResponse.findOneAndDelete({
      _id: params.id,
      workspaceId: workspace._id,
    });

    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/canned-responses/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}