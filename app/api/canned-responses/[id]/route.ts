import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { CannedResponse } from "@/app/api/models/CannedResponseModel";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await dbConnect();
    const body = await req.json();
    const { title, body: responseBody } = body;

    const updated = await CannedResponse.findByIdAndUpdate(
      id,
      { ...(title && { title }), ...(responseBody && { body: responseBody }) },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ PUT /api/canned-responses/[id]:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await dbConnect();

    const deleted = await CannedResponse.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ DELETE /api/canned-responses/[id]:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}