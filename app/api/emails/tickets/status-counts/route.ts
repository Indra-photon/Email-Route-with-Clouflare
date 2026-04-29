import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";

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

    // ── Fetch only inbound threads so we can filter to root tickets only ──
    // Counting all EmailThread docs would double-count reply emails that were
    // stored as separate documents in the same conversation chain.
    const allInbound = await EmailThread.find({
      workspaceId: workspace._id,
      direction: "inbound",
    })
      .select("messageId inReplyTo references status")
      .lean();

    // Build a set of all inbound messageIds to detect which are replies
    const allInboundMessageIds = new Set(
      allInbound.map((t) => t.messageId).filter(Boolean)
    );

    // Keep only ROOT tickets
    const rootTickets = allInbound.filter((t) => {
      if (!t.inReplyTo) return true;
      if (allInboundMessageIds.has(t.inReplyTo)) return false;
      if (t.references?.some((ref) => allInboundMessageIds.has(ref))) return false;
      return true;
    });

    const result = {
      open: 0,
      in_progress: 0,
      waiting: 0,
      resolved: 0,
      total: 0,
    };

    for (const ticket of rootTickets) {
      const s = ticket.status as keyof typeof result;
      if (s in result) {
        result[s]++;
        result.total++;
      }
    }

    return NextResponse.json({ counts: result });
  } catch (error) {
    console.error("Error getting status counts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
