"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Heading } from "@/components/Heading";
import { Container } from "@/components/Container";
import { IconMail } from "@/constants/icons";
import { RefreshCw, Inbox } from "lucide-react";

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

  // Status badge helper
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: {
        label: "Open",
        className: "bg-amber-100 text-amber-700 font-schibsted font-medium",
      },
      in_progress: {
        label: "In Progress",
        className: "bg-sky-100 text-sky-700 font-schibsted font-medium",
      },
      waiting: {
        label: "Waiting",
        className: "bg-purple-100 text-purple-700 font-schibsted font-medium",
      },
      resolved: {
        label: "Resolved",
        className: "bg-green-100 text-green-700 font-schibsted font-medium",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;

    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // Time ago helper
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Heading as="h1" className="text-neutral-900">
            My Tickets
          </Heading>
          <p className="mt-2 text-base text-neutral-600 font-schibsted font-normal">
            Tickets assigned to you
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild className="font-schibsted font-medium">
            <Link href="/dashboard/tickets/unassigned">
              <Inbox className="mr-2 size-4" />
              Unassigned
            </Link>
          </Button>
          <Button 
            onClick={fetchMyTickets} 
            variant="outline" 
            className="font-schibsted font-medium"
            disabled={loading}
          >
            <RefreshCw className={`mr-2 size-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800 font-schibsted font-normal">{error}</p>
        </div>
      )}

      {/* Status Filter Tabs */}
      {!loading && (
        <div className="mb-6 flex gap-2 border-b border-neutral-200 pb-4">
          {[
            { key: 'all', label: 'All' },
            { key: 'open', label: 'Open' },
            { key: 'in_progress', label: 'In Progress' },
            { key: 'waiting', label: 'Waiting' },
            { key: 'resolved', label: 'Resolved' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setCurrentFilter(filter.key)}
              className={`rounded-lg px-4 py-2 text-sm font-schibsted font-medium transition-all ${
                currentFilter === filter.key
                  ? 'bg-sky-100 text-sky-800 font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              {filter.label}
              <span className="ml-2 text-xs">
                ({statusCounts[filter.key as keyof typeof statusCounts]})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <RefreshCw className="size-8 text-neutral-400 animate-spin mb-4" />
          <p className="text-neutral-600 font-schibsted font-normal">
            Loading your tickets...
          </p>
        </div>
      ) : (
        /* Tickets List */
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-schibsted font-semibold text-neutral-900">
              {currentFilter === 'all' ? 'All Tickets' : `${currentFilter.replace('_', ' ')} Tickets`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-neutral-100 p-4">
                  <IconMail size={32} className="text-neutral-400" isAnimating={false} />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-neutral-900 font-schibsted">
                  No tickets found
                </h3>
                <p className="text-sm text-neutral-600 font-schibsted font-normal">
                  {currentFilter === 'all' 
                    ? "You don't have any assigned tickets yet"
                    : `No ${currentFilter.replace('_', ' ')} tickets`}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {filteredTickets.map((ticket) => (
                  <Link
                    key={ticket.id}
                    href={`/dashboard/tickets/${ticket.id}`}
                    className="block py-4 transition-colors hover:bg-neutral-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* From */}
                        <p className="text-sm font-medium text-neutral-900 font-schibsted truncate">
                          {ticket.fromName || ticket.from}
                        </p>
                        {/* Subject */}
                        <p className="mt-1 text-sm text-neutral-600 font-schibsted font-normal truncate">
                          {ticket.subject}
                        </p>
                        {/* Meta info */}
                        <div className="mt-2 flex items-center gap-3 flex-wrap">
                          {getStatusBadge(ticket.status)}
                          <span className="text-xs text-neutral-500 font-schibsted font-normal">
                            {getTimeAgo(ticket.receivedAt)}
                          </span>
                          {ticket.claimedAt && (
                            <span className="text-xs text-neutral-600 font-schibsted font-normal">
                              Claimed {getTimeAgo(ticket.claimedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Arrow icon */}
                      <svg
                        className="size-5 shrink-0 text-neutral-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}