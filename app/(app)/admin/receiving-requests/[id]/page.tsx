"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type RequestDetail = {
  id: string;
  domain: string;
  domainId: string | null;
  requestedBy: string;
  workspace: string;
  status: string;
  requestedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
  mxRecords: any[];
  notes: string | null;
  domainInfo: {
    verifiedForSending: boolean;
    receivingEnabled: boolean;
  };
};

export default function AdminReviewRequestPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reopening, setReopening] = useState(false);

  // Form states for approval
  const [mxPriority1, setMxPriority1] = useState("10");
  const [mxValue1, setMxValue1] = useState("");
  const [mxPriority2, setMxPriority2] = useState("20");
  const [mxValue2, setMxValue2] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  // Form state for rejection
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (id) fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    setLoading(true);
    try {
      // Use the dedicated single-request endpoint
      const res = await fetch(`/api/admin/receiving-requests/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          setRequest(null);
          return;
        }
        throw new Error("Failed to fetch request");
      }
      const data = await res.json();
      setRequest(data.request);
      setAdminNotes(data.request.notes || "");

      // Pre-fill MX records if already approved
      if (data.request.mxRecords?.length > 0) {
        setMxPriority1(String(data.request.mxRecords[0]?.priority ?? "10"));
        setMxValue1(data.request.mxRecords[0]?.value ?? "");
        if (data.request.mxRecords[1]) {
          setMxPriority2(String(data.request.mxRecords[1]?.priority ?? "20"));
          setMxValue2(data.request.mxRecords[1]?.value ?? "");
        }
      }
    } catch (error) {
      console.error("Failed to fetch request:", error);
      toast.error("Failed to load request details");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!mxValue1.trim()) {
      toast.error("Please enter at least one MX record value");
      return;
    }

    setSubmitting(true);
    try {
      const mxRecords = [
        { type: "MX", name: "@", value: mxValue1.trim(), priority: parseInt(mxPriority1), ttl: "Auto" },
      ];
      if (mxValue2.trim()) {
        mxRecords.push({ type: "MX", name: "@", value: mxValue2.trim(), priority: parseInt(mxPriority2), ttl: "Auto" });
      }

      const res = await fetch(`/api/admin/receiving-requests/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mxRecords, notes: adminNotes }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve request");

      toast.success("Request approved successfully!");
      router.push("/admin/receiving-requests");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/receiving-requests/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reject request");

      toast.success("Request rejected");
      router.push("/admin/receiving-requests");
    } catch (error: any) {
      toast.error(error.message || "Failed to reject request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete this request for "${request?.domain}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/receiving-requests/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      toast.success("Request deleted");
      router.push("/admin/receiving-requests");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete request");
    } finally {
      setDeleting(false);
    }
  };

  const handleReopen = async () => {
    if (!confirm("Re-open this request and reset it to pending? This will also disable receiving on the domain.")) return;
    setReopening(true);
    try {
      const res = await fetch(`/api/admin/receiving-requests/${id}/reopen`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to re-open");
      toast.success("Request reset to pending");
      await fetchRequest();
    } catch (error: any) {
      toast.error(error.message || "Failed to re-open request");
    } finally {
      setReopening(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-neutral-500">Loading request details...</div>;
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 mb-4">Request not found</p>
        <Link href="/admin/receiving-requests">
          <Button variant="outline">← Back to Requests</Button>
        </Link>
      </div>
    );
  }

  const isPending = request.status === "pending";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/receiving-requests"
            className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 mb-2 inline-block"
          >
            ← Back to Requests
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Review Receiving Request
          </h1>
        </div>

        {/* Header action buttons */}
        <div className="flex gap-2 mt-6">
          {!isPending && (
            <Button
              variant="outline"
              size="sm"
              disabled={reopening}
              onClick={handleReopen}
              className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              {reopening ? "Re-opening..." : "🔄 Re-open"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={deleting}
            onClick={handleDelete}
            className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            {deleting ? "Deleting..." : "🗑️ Delete"}
          </Button>
        </div>
      </div>

      {/* Request Details */}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Request Information
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Domain</dt>
            <dd className="text-base font-mono text-neutral-900 dark:text-neutral-100 mt-1">
              {request.domain}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Requested By</dt>
            <dd className="text-base text-neutral-900 dark:text-neutral-100 mt-1">{request.requestedBy}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Workspace</dt>
            <dd className="text-base text-neutral-900 dark:text-neutral-100 mt-1">{request.workspace}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Requested Date</dt>
            <dd className="text-base text-neutral-900 dark:text-neutral-100 mt-1">
              {new Date(request.requestedAt).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Status</dt>
            <dd className="mt-1">
              {request.status === "pending" && (
                <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  ⏳ Pending
                </span>
              )}
              {request.status === "approved" && (
                <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  ✅ Approved
                </span>
              )}
              {request.status === "rejected" && (
                <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  ❌ Rejected
                </span>
              )}
            </dd>
          </div>
        </dl>

        {/* Domain Info */}
        <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Domain Status
          </h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              {request.domainInfo.verifiedForSending ? (
                <span className="text-green-600 dark:text-green-400">✅</span>
              ) : (
                <span className="text-red-600 dark:text-red-400">❌</span>
              )}
              <span className="text-sm text-neutral-700 dark:text-neutral-300">Verified for Sending</span>
            </div>
            <div className="flex items-center gap-2">
              {request.domainInfo.receivingEnabled ? (
                <span className="text-green-600 dark:text-green-400">✅</span>
              ) : (
                <span className="text-neutral-400">⬜</span>
              )}
              <span className="text-sm text-neutral-700 dark:text-neutral-300">Receiving Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Approval/Rejection Forms — only for pending */}
      {isPending && (
        <>
          {/* Approve Form */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              Approve & Enable Receiving
            </h2>

            <div className="space-y-4">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 text-sm text-green-800 dark:text-green-300">
                <p className="font-medium mb-2">📋 Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Open Resend dashboard and go to Domains</li>
                  <li>Find and click on {request.domain}</li>
                  <li>Enable "Receiving" in the settings</li>
                  <li>Copy the MX record values shown</li>
                  <li>Paste them below and approve</li>
                </ol>
                <a
                  href="https://resend.com/domains"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-green-700 dark:text-green-400 underline hover:no-underline"
                >
                  Open Resend Dashboard →
                </a>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  MX Record 1 (Required)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    type="number"
                    placeholder="Priority"
                    value={mxPriority1}
                    onChange={(e) => setMxPriority1(e.target.value)}
                    className="col-span-1"
                  />
                  <Input
                    type="text"
                    placeholder="MX record value (e.g., inbound-smtp.us-east-1.amazonaws.com)"
                    value={mxValue1}
                    onChange={(e) => setMxValue1(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  MX Record 2 (Optional)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    type="number"
                    placeholder="Priority"
                    value={mxPriority2}
                    onChange={(e) => setMxPriority2(e.target.value)}
                    className="col-span-1"
                  />
                  <Input
                    type="text"
                    placeholder="MX record value (optional)"
                    value={mxValue2}
                    onChange={(e) => setMxValue2(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Admin Notes (Optional)
                </label>
                <Textarea
                  placeholder="Add any notes about this approval..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleApprove}
                disabled={submitting || !mxValue1.trim()}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {submitting ? "Approving..." : "✅ Approve & Enable Receiving"}
              </Button>
            </div>
          </div>

          {/* Reject Form */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">
              Reject Request
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Rejection Reason (Required)
                </label>
                <Textarea
                  placeholder="Explain why this request is being rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleReject}
                disabled={submitting || !rejectionReason.trim()}
                variant="destructive"
                className="w-full"
              >
                {submitting ? "Rejecting..." : "❌ Reject Request"}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Already Reviewed Info */}
      {!isPending && (
        <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Review Details
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Reviewed At</dt>
              <dd className="text-base text-neutral-900 dark:text-neutral-100 mt-1">
                {request.reviewedAt ? new Date(request.reviewedAt).toLocaleString() : "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Reviewed By</dt>
              <dd className="text-base text-neutral-900 dark:text-neutral-100 mt-1">
                {request.reviewedBy || "N/A"}
              </dd>
            </div>
            {request.status === "rejected" && request.rejectionReason && (
              <div>
                <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Rejection Reason</dt>
                <dd className="text-base text-neutral-900 dark:text-neutral-100 mt-1">
                  {request.rejectionReason}
                </dd>
              </div>
            )}
            {request.status === "approved" && request.mxRecords.length > 0 && (
              <div>
                <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">MX Records</dt>
                <dd className="space-y-2">
                  {request.mxRecords.map((record: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-neutral-900 rounded p-2 text-sm font-mono"
                    >
                      <span className="text-neutral-500">Priority {record.priority}:</span>{" "}
                      {record.value}
                    </div>
                  ))}
                </dd>
              </div>
            )}
            {request.notes && (
              <div>
                <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Admin Notes</dt>
                <dd className="text-base text-neutral-900 dark:text-neutral-100 mt-1">{request.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
