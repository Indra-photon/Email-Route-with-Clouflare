import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = request.nextUrl.searchParams.get("email");
    if (!email) return NextResponse.json({ error: "email param required" }, { status: 400 });

    const workspace = await getOrCreateWorkspaceForCurrentUser();
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    await dbConnect();

    const threads = await EmailThread.find({
      workspaceId: workspace._id,
      direction: "inbound",
      from: email,
    })
      .sort({ receivedAt: -1 })
      .limit(20)
      .lean();

    const total = threads.length;
    const resolved = threads.filter((t) => t.status === "resolved").length;
    const open = threads.filter((t) => t.status === "open").length;
    const in_progress = threads.filter((t) => t.status === "in_progress").length;
    const waiting = threads.filter((t) => t.status === "waiting").length;

    const tickets = threads.slice(0, 5).map((t) => ({
      id: t._id.toString(),
      subject: t.subject,
      status: t.status,
      receivedAt: t.receivedAt,
      from: t.from,
      fromName: t.fromName,
      assignedTo: t.assignedTo,
      assignedToName: t.assignedToName,
      assignedToEmail: t.assignedToEmail,
    }));

    return NextResponse.json({ total, resolved, open, in_progress, waiting, tickets });
  } catch (err) {
    console.error("sender-history error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
