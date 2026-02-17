"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import TicketsList from "@/components/tickets/TicketsList";
import StatusFilter from "@/components/StatusFilter";
import Link from "next/link";

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

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    open: 0,
    in_progress: 0,
    waiting: 0,
    resolved: 0
  });

  const fetchMyTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/emails/tickets/mine");

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data.tickets || []);

      // Calculate status counts
      const counts = {
        all: data.tickets.length,
        open: data.tickets.filter((t: Ticket) => t.status === 'open').length,
        in_progress: data.tickets.filter((t: Ticket) => t.status === 'in_progress').length,
        waiting: data.tickets.filter((t: Ticket) => t.status === 'waiting').length,
        resolved: data.tickets.filter((t: Ticket) => t.status === 'resolved').length,
      };
      setStatusCounts(counts);
    } catch (err) {
      console.error("Error fetching my tickets:", err);
      setError(err instanceof Error ? err.message : "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  // Filter tickets based on current filter
  const filteredTickets = currentFilter === 'all'
    ? tickets
    : tickets.filter(t => t.status === currentFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            My Tickets
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Tickets assigned to you
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/tickets/unassigned">
            <Button variant="outline">View Unassigned</Button>
          </Link>
          <Button onClick={fetchMyTickets} variant="outline" size="default">
            🔄 Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {!loading && (
        <StatusFilter
          currentFilter={currentFilter}
          counts={statusCounts}
          onFilterChange={setCurrentFilter}
        />
      )}

      {loading ? (
        <div className="text-center py-12 text-neutral-500">
          Loading your tickets...
        </div>
      ) : (
        <TicketsList tickets={filteredTickets} type="mine" onRefresh={fetchMyTickets} />
      )}
    </div>
  );
}
