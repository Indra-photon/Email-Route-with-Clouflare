"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import MarkResolvedButton from "@/components/MarkResolvedButton";
import ClaimButton from "./ClaimButton";
import UnclaimButton from "./UnclaimButton";

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

interface TicketsListProps {
  tickets: Ticket[];
  type: "mine" | "unassigned";
  onRefresh?: () => void;
}

export default function TicketsList({
  tickets,
  type,
  onRefresh,
}: TicketsListProps) {
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (tickets.length === 0) {
    return (
      <div className="border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-12 text-center">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          {type === "mine" ? "No tickets assigned to you" : "No unassigned tickets"}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {type === "mine"
            ? "Claim tickets from the unassigned list to get started"
            : "All tickets have been claimed. Great work team!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">
                From
              </th>
              <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">
                Subject
              </th>
              <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">
                Status
              </th>
              <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">
                Received
              </th>
              {type === "mine" && (
                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">
                  Claimed
                </th>
              )}
              <th className="text-right p-3 font-medium text-neutral-700 dark:text-neutral-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-t border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              >
                <td className="p-3">
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">
                      {ticket.fromName || ticket.from}
                    </div>
                    {ticket.fromName && (
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {ticket.from}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <div className="max-w-md truncate text-neutral-700 dark:text-neutral-300">
                    {ticket.subject}
                  </div>
                </td>
                <td className="p-3">
                  <StatusBadge status={ticket.status as any} size="sm" />
                </td>
                <td className="p-3 text-neutral-600 dark:text-neutral-400">
                  <div>{getTimeAgo(ticket.receivedAt)}</div>
                  <div className="text-xs text-neutral-500">
                    {new Date(ticket.receivedAt).toLocaleDateString()}
                  </div>
                </td>
                {type === "mine" && (
                  <td className="p-3 text-neutral-600 dark:text-neutral-400">
                    {ticket.claimedAt && (
                      <div className="text-xs">
                        {getTimeAgo(ticket.claimedAt)}
                      </div>
                    )}
                  </td>
                )}
                <td className="p-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/reply/${ticket.id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                    {type === "unassigned" && (
                      <ClaimButton threadId={ticket.id} onClaimed={onRefresh} />
                    )}
                    {type === "mine" && (
                      <>
                        <MarkResolvedButton
                          threadId={ticket.id}
                          currentStatus={ticket.status}
                          onResolved={onRefresh}
                        />
                        <UnclaimButton
                          threadId={ticket.id}
                          onUnclaimed={onRefresh}
                        />
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
        Showing {tickets.length} {type === "mine" ? "assigned" : "unassigned"} tickets
      </div>
    </div>
  );
}
