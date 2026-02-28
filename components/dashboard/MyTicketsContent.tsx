import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import MyTicketsClient from "./MyTicketsClient";

interface Ticket {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  status: string;
  receivedAt: string;
  repliedAt?: string | null;
  assignedTo?: string;
  assignedToEmail?: string;
  assignedToName?: string;
  claimedAt?: string;
}

export default async function MyTicketsContent() {
  const { userId } = await auth();
  
  if (!userId) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 text-center">
        <p className="text-neutral-600 font-schibsted font-normal">
          Please sign in to view your tickets
        </p>
      </div>
    );
  }

  await dbConnect();
  const workspace = await getOrCreateWorkspaceForCurrentUser();

  // ✅ OPTIMIZATION: Server-side query with .lean() for performance
  const ticketsData = await EmailThread.find({
    workspaceId: workspace._id,
    direction: "inbound",
    assignedTo: userId,
  })
    .select("from fromName subject status receivedAt repliedAt assignedTo assignedToEmail assignedToName claimedAt")
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
    assignedTo: ticket.assignedTo,
    assignedToEmail: ticket.assignedToEmail,
    assignedToName: ticket.assignedToName,
    claimedAt: ticket.claimedAt?.toISOString(),
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
  return <MyTicketsClient tickets={tickets} statusCounts={statusCounts} />;
}