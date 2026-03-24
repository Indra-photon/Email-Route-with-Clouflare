"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type RequestStatus = "all" | "pending" | "approved" | "rejected";
type SortField = "requestedAt" | "domain" | "status";
type SortDir = "asc" | "desc";

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

const PAGE_SIZE = 20;

export default function AdminReceivingRequestsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [requests, setRequests] = useState<ReceivingRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<RequestStatus>(
    () => (searchParams.get("status") as RequestStatus) || "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("requestedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Quick-action modal state
  const [rejectModal, setRejectModal] = useState<{ id: string; domain: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/receiving-requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Sync URL param to filter tab
  useEffect(() => {
    const param = searchParams.get("status") as RequestStatus;
    if (param && ["pending", "approved", "rejected"].includes(param)) {
      setStatusFilter(param);
    }
  }, [searchParams]);

  // Update URL when filter changes
  const handleStatusFilter = (status: RequestStatus) => {
    setStatusFilter(status);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.replace(`/admin/receiving-requests?${params.toString()}`);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(1);
  };

  // Filter → sort → paginate
  const filtered = requests
    .filter((r) => statusFilter === "all" || r.status === statusFilter)
    .filter(
      (r) =>
        !searchTerm ||
        r.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "requestedAt") {
        cmp = new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime();
      } else if (sortField === "domain") {
        cmp = a.domain.localeCompare(b.domain);
      } else if (sortField === "status") {
        cmp = a.status.localeCompare(b.status);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

  const handleDelete = async (id: string, domain: string) => {
    if (!confirm(`Delete request for "${domain}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/receiving-requests/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to delete");
      toast.success(`Request for "${domain}" deleted`);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete request");
    } finally {
      setDeletingId(null);
    }
  };

  const handleQuickReject = async () => {
    if (!rejectModal || !rejectReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/receiving-requests/${rejectModal.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to reject");
      toast.success(`Request for "${rejectModal.domain}" rejected`);
      setRejectModal(null);
      setRejectReason("");
      await fetchRequests();
    } catch (err: any) {
      toast.error(err.message || "Failed to reject");
    } finally {
      setActionLoading(false);
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-neutral-300 ml-1">↕</span>;
    return <span className="text-purple-600 ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
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
          {(["all", "pending", "approved", "rejected"] as RequestStatus[]).map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusFilter(s)}
            >
              {s === "all" && `All (${requests.length})`}
              {s === "pending" && `Pending (${requests.filter((r) => r.status === "pending").length})`}
              {s === "approved" && `Approved (${requests.filter((r) => r.status === "approved").length})`}
              {s === "rejected" && `Rejected (${requests.filter((r) => r.status === "rejected").length})`}
            </Button>
          ))}
        </div>

        {/* Search */}
        <Input
          type="text"
          placeholder="Search domain or email..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
      </div>

      {/* Requests Table */}
      {loading ? (
        <div className="text-center py-12 text-neutral-500">Loading requests...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          {searchTerm || statusFilter !== "all"
            ? "No requests match your filters"
            : "No receiving requests yet"}
        </div>
      ) : (
        <>
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th
                    className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-purple-600 select-none"
                    onClick={() => handleSort("domain")}
                  >
                    Domain <SortIcon field="domain" />
                  </th>
                  <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">
                    Requested By
                  </th>
                  <th
                    className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-purple-600 select-none"
                    onClick={() => handleSort("status")}
                  >
                    Status <SortIcon field="status" />
                  </th>
                  <th
                    className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-purple-600 select-none"
                    onClick={() => handleSort("requestedAt")}
                  >
                    Date <SortIcon field="requestedAt" />
                  </th>
                  <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((request) => (
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/admin/receiving-requests/${request.id}`}>
                          <Button size="sm" variant="outline" className="text-xs">
                            {request.status === "pending" ? "Review" : "View"}
                          </Button>
                        </Link>

                        {/* Quick Reject for pending only */}
                        {request.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => { setRejectModal({ id: request.id, domain: request.domain }); setRejectReason(""); }}
                          >
                            ❌ Reject
                          </Button>
                        )}

                        {/* Delete */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs text-neutral-500 border-neutral-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-900/20"
                          disabled={deletingId === request.id}
                          onClick={() => handleDelete(request.id, request.domain)}
                        >
                          {deletingId === request.id ? "..." : "🗑️"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Prev
                </Button>
                <span className="flex items-center px-3 text-sm text-neutral-600 dark:text-neutral-400">
                  Page {page} of {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Quick Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Reject Request
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Rejecting request for <span className="font-mono font-semibold">{rejectModal.domain}</span>
            </p>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Rejection Reason (Required)
              </label>
              <textarea
                className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg p-3 text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
                placeholder="Explain why this request is being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setRejectModal(null); setRejectReason(""); }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={actionLoading || !rejectReason.trim()}
                onClick={handleQuickReject}
              >
                {actionLoading ? "Rejecting..." : "❌ Reject Request"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
