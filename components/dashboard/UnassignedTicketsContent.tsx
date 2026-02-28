import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import UnassignedTicketsClient from "./UnassignedTicketsClient";

interface Ticket {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  status: string;
  receivedAt: string;
  repliedAt?: string | null;
}

export default async function UnassignedTicketsContent() {
  const { userId } = await auth();
  
  if (!userId) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 text-center">
        <p className="text-neutral-600 font-schibsted font-normal">
          Please sign in to view unassigned tickets
        </p>
      </div>
    );
  }

  await dbConnect();
  const workspace = await getOrCreateWorkspaceForCurrentUser();

  // ✅ OPTIMIZATION: Server-side query with .lean() for performance
  // Find all unassigned inbound threads
  const ticketsData = await EmailThread.find({
    workspaceId: workspace._id,
    direction: "inbound",
    $or: [
      { assignedTo: null },
      { assignedTo: { $exists: false } },
    ],
  })
    .select("from fromName subject status receivedAt repliedAt")
    .sort({ receivedAt: -1 })
    .limit(100)
    .lean();

  // Transform to plain objects
  const tickets: Ticket[] = ticketsData.map((ticket) => ({
    id: ticket._id.toString(),
    from: ticket.from,
    fromName: ticket.fromName,
    subject: ticket.subject,
    status: ticket.status,
    receivedAt: ticket.receivedAt.toISOString(),
    repliedAt: ticket.repliedAt?.toISOString() || null,
  }));

  // Calculate status counts on server
  const statusCounts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    waiting: tickets.filter((t) => t.status === "waiting").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  // ✅ Pass data to client component for interactivity
  return <UnassignedTicketsClient tickets={tickets} statusCounts={statusCounts} />;
}