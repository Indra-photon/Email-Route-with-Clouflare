import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get workspace
    const workspace = await getOrCreateWorkspaceForCurrentUser();
    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // Connect to database
    await dbConnect();

    // Fetch all inbound threads for this workspace
    const allInbound = await EmailThread.find({
      workspaceId: workspace._id,
      direction: "inbound",
    })
      .sort({ receivedAt: -1 })
      .limit(200)
      .lean();

    // Build a set of all known inbound messageIds so we can detect reply emails
    const allInboundMessageIds = new Set(
      allInbound.map((t) => t.messageId).filter(Boolean)
    );

    // Only keep ROOT threads — those whose inReplyTo doesn't point to another
    // known inbound message in this workspace. This prevents customer reply emails
    // from appearing as separate kanban cards alongside the original ticket.
    const rootTickets = allInbound.filter((t) => {
      if (!t.inReplyTo) return true; // no parent → definitely a root
      if (allInboundMessageIds.has(t.inReplyTo)) return false;
      if (t.references?.some((ref) => allInboundMessageIds.has(ref))) return false;
      return true;
    });

    // For each root ticket, load the full conversation chain to derive:
    //  • repliedAt          — most recent outbound message timestamp
    //  • lastMessageDirection — direction of the chronologically last message
    //  • attachmentCount    — attachments on the root inbound message
    const formattedTickets = await Promise.all(
      rootTickets.map(async (ticket) => {
        // Fetch all messages linked to this root (same logic as threads/[id])
        const chainMessages = await EmailThread.find({
          workspaceId: workspace._id,
          $or: [
            { _id: ticket._id },
            { inReplyTo: ticket.messageId },
            { references: ticket.messageId },
          ],
        })
          .sort({ createdAt: 1 })
          .lean();

        const lastMsg = chainMessages[chainMessages.length - 1];
        const lastMessageDirection = lastMsg?.direction ?? ticket.direction;

        // repliedAt = most recent outbound message in the chain
        const outboundMsgs = chainMessages.filter((m) => m.direction === "outbound");
        const latestOutbound = outboundMsgs[outboundMsgs.length - 1];
        const repliedAt =
          latestOutbound?.receivedAt ?? ticket.repliedAt ?? null;

        return {
          id: ticket._id.toString(),
          from: ticket.from,
          fromName: ticket.fromName,
          subject: ticket.subject,
          status: ticket.status,
          receivedAt: ticket.receivedAt,
          repliedAt,
          lastMessageDirection,
          assignedTo: ticket.assignedTo,
          assignedToEmail: ticket.assignedToEmail,
          assignedToName: ticket.assignedToName,
          claimedAt: ticket.claimedAt,
          attachmentCount: (ticket.attachments ?? []).length,
        };
      })
    );

    return NextResponse.json(
      {
        tickets: formattedTickets,
        total: formattedTickets.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching my tickets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
