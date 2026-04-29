import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";

const STATUS_PRIORITY: Record<string, number> = {
  open: 0,
  in_progress: 1,
  waiting: 2,
  resolved: 3,
};

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

    // Fetch all inbound threads to deduplicate by conversation chain
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

    // For each root ticket, derive the effective status from its chain
    // (same logic as mine/route.ts) so counts match the kanban columns
    await Promise.all(
      rootTickets.map(async (ticket) => {
        const chainMessages = await EmailThread.find({
          workspaceId: workspace._id,
          $or: [
            { _id: ticket._id },
            { inReplyTo: ticket.messageId },
            { references: ticket.messageId },
          ],
        })
          .select("status")
          .lean();

        const effectiveStatus = chainMessages.reduce(
          (best, msg) => {
            const p = STATUS_PRIORITY[msg.status] ?? 0;
            return p > (STATUS_PRIORITY[best] ?? 0) ? msg.status : best;
          },
          ticket.status as string
        );

        const s = effectiveStatus as keyof typeof result;
        if (s in result) {
          result[s]++;
          result.total++;
        }
      })
    );

    return NextResponse.json({ counts: result });
  } catch (error) {
    console.error("Error getting status counts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
