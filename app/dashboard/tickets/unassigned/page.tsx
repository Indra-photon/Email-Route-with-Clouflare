"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import TicketsList from "@/components/tickets/TicketsList";
import Link from "next/link";

interface Ticket {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  status: string;
  receivedAt: string;
  repliedAt?: string | null;
}

export default function UnassignedTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnassignedTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/emails/tickets/unassigned");

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error("Error fetching unassigned tickets:", err);
      setError(err instanceof Error ? err.message : "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnassignedTickets();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Unassigned Tickets
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Tickets waiting to be claimed
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/tickets/mine">
            <Button variant="outline">My Tickets</Button>
          </Link>
          <Button onClick={fetchUnassignedTickets} variant="outline" size="default">
            🔄 Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-neutral-500">
          Loading unassigned tickets...
        </div>
      ) : (
        <TicketsList
          tickets={tickets}
          type="unassigned"
          onRefresh={fetchUnassignedTickets}
        />
      )}
    </div>
  );
}
