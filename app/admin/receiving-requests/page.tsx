"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RequestStatus = "all" | "pending" | "approved" | "rejected";

type ReceivingRequestData = {
  id: string;
  domain: string;
  domainId: string | null;
  requestedBy: string;
  workspace: string;
  status: string;
  requestedAt: string;
  reviewedAt: string | null;
};

export default function AdminReceivingRequestsPage() {
  const [requests, setRequests] = useState<ReceivingRequestData[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ReceivingRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<RequestStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, statusFilter, searchTerm]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/receiving-requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            ⏳ Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            ✅ Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            ❌ Rejected
          </span>
        );
      default:
        return <span className="text-neutral-500">{status}</span>;
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Receiving Requests
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Manage domain receiving access requests
          </p>
        </div>
        <Button onClick={fetchRequests} variant="outline" size="sm">
          🔄 Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Status Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All ({requests.length})
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("pending")}
          >
            Pending ({requests.filter((r) => r.status === "pending").length})
          </Button>
          <Button
            variant={statusFilter === "approved" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("approved")}
          >
            Approved ({requests.filter((r) => r.status === "approved").length})
          </Button>
          <Button
            variant={statusFilter === "rejected" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("rejected")}
          >
            Rejected ({requests.filter((r) => r.status === "rejected").length})
          </Button>
        </div>

        {/* Search */}
        <Input
          type="text"
          placeholder="Search domain or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Requests Table */}
      {loading ? (
        <div className="text-center py-12 text-neutral-500">Loading requests...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          {searchTerm || statusFilter !== "all"
            ? "No requests match your filters"
            : "No receiving requests yet"}
        </div>
      ) : (
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">
                  Domain
                </th>
                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">
                  Requested By
                </th>
                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">
                  Status
                </th>
                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">
                  Date
                </th>
                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                  <td className="p-3">
                    <div className="font-mono text-neutral-900 dark:text-neutral-100">
                      {request.domain}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">{request.workspace}</div>
                  </td>
                  <td className="p-3 text-neutral-700 dark:text-neutral-300">
                    {request.requestedBy}
                  </td>
                  <td className="p-3">{getStatusBadge(request.status)}</td>
                  <td className="p-3 text-neutral-600 dark:text-neutral-400">
                    <div>{getTimeAgo(request.requestedAt)}</div>
                    <div className="text-xs text-neutral-500">
                      {new Date(request.requestedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/receiving-requests/${request.id}`}>
                      <Button size="sm" variant="outline">
                        {request.status === "pending" ? "Review" : "View Details"}
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
