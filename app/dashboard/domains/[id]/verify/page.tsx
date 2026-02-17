"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DomainVerificationInstructions } from "@/components/DomainVerificationInstructions";
import { VerificationStatusBadge } from "@/components/VerificationStatusBadge";
import ReceivingRequestButton from "@/components/ReceivingRequestButton";

type DomainDetail = {
  id: string;
  domain: string;
  status: string;
  verifiedForSending?: boolean;
  resendDomainId?: string | null;
  dnsRecords?: { record: string; name: string; type: string; value?: string; status: string; priority?: number }[];
  receivingEnabled?: boolean;
  receivingEnabledAt?: string | null;
  receivingRequestId?: string | null;
  receivingMxRecords?: { type: string; name: string; value: string; priority: number; ttl: string }[];
  lastCheckedAt?: string | null;
};

type ReceivingRequestStatus = {
  status: "not_requested" | "pending" | "approved" | "rejected";
  requestedAt?: string;
  reviewedAt?: string;
  mxRecords?: { type: string; name: string; value: string; priority: number; ttl: string }[];
  rejectionReason?: string;
};

export default function DomainVerifyPage() {
  const params = useParams();
  const id = params?.id as string;

  const [domain, setDomain] = useState<DomainDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [addingToResend, setAddingToResend] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receivingRequest, setReceivingRequest] = useState<ReceivingRequestStatus | null>(null);
  const [loadingRequest, setLoadingRequest] = useState(false);

  const fetchDomain = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const res = await fetch(`/api/domains/${id}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Domain not found");
        throw new Error("Failed to load domain");
      }
      const data = await res.json();
      setDomain(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load domain");
      setDomain(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchReceivingRequestStatus = useCallback(async () => {
    if (!id) return;
    try {
      setLoadingRequest(true);
      const res = await fetch(`/api/receiving-requests/${id}`);
      if (res.ok) {
        const data = await res.json();
        setReceivingRequest(data);
      }
    } catch (err) {
      console.error("Failed to fetch receiving request status:", err);
    } finally {
      setLoadingRequest(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDomain();
    fetchReceivingRequestStatus();
  }, [fetchDomain, fetchReceivingRequestStatus]);

  // Poll every 30s when not verified
  useEffect(() => {
    if (!domain || domain.status === "verified") return;
    const interval = setInterval(fetchDomain, 30000);
    return () => clearInterval(interval);
  }, [domain?.status, fetchDomain]);

  const handleAddToResend = async () => {
    if (!id) return;
    try {
      setAddingToResend(true);
      setError(null);
      const res = await fetch("/api/domains/add-to-resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to Resend");
      await fetchDomain();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add to Resend");
    } finally {
      setAddingToResend(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!id) return;
    try {
      setChecking(true);
      setError(null);
      const res = await fetch("/api/domains/check-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId: id }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.error || (res.status === 400 ? "Add domain to Resend first" : "Verification check failed");
        throw new Error(msg);
      }
      setDomain(data.domain ?? domain);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification check failed");
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <p className="text-neutral-500">Loading domain...</p>
      </div>
    );
  }

  if (error && !domain) {
    return (
      <div className="space-y-6">
        <p className="text-red-600" role="alert">{error}</p>
        <Link href="/dashboard/domains">
          <Button variant="outline">Back to Domains</Button>
        </Link>
      </div>
    );
  }

  if (!domain) {
    return (
      <div className="space-y-6">
        <p className="text-neutral-500">Domain not found.</p>
        <Link href="/dashboard/domains">
          <Button variant="outline">Back to Domains</Button>
        </Link>
      </div>
    );
  }

  const isVerified = domain.status === "verified" || domain.verifiedForSending;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/domains" className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 mb-2 inline-block">
          ← Back to Domains
        </Link>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 text-balance">
          Verify domain: {domain.domain}
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 text-pretty">
          Add the DNS records below at your domain provider, then click Check Verification.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <VerificationStatusBadge status={domain.status} />
        {domain.lastCheckedAt && (
          <span className="text-sm text-neutral-500 tabular-nums">
            Last checked: {new Date(domain.lastCheckedAt).toLocaleString()}
          </span>
        )}
      </div>

      {/* Receiving Status Badge */}
      {domain.verifiedForSending && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Receiving Status:
          </span>
          {domain.receivingEnabled ? (
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              ✅ Enabled
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
              ⏳ Not Enabled
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4" role="alert">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {isVerified && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-800 dark:text-green-200 font-medium">Domain verified. You can send emails from this domain.</p>
        </div>
      )}

      <DomainVerificationInstructions
        domainName={domain.domain}
        dnsRecords={domain.dnsRecords || []}
        className="mt-4"
      />

      {/* Receiving Email Section */}
        <div className="mt-8 border-t pt-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                📬 Receiving Emails (Optional)
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                To receive emails at this domain, admin verification is required for security.
              </p>
            </div>

            {/* Not Requested */}
            {(!receivingRequest || receivingRequest.status === "not_requested") && !domain.receivingEnabled && (
              <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
                  <strong>Status:</strong> ⏳ Not Requested
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Request admin approval to enable email receiving for this domain. Typically approved within 1-2 hours.
                </p>
                <ReceivingRequestButton
                  domainId={domain.id}
                  onRequestCreated={fetchReceivingRequestStatus}
                />
              </div>
            )}

            {/* Pending Approval */}
            {receivingRequest?.status === "pending" && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                  <strong>Status:</strong> ⏳ Pending Admin Approval
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                  Your request has been submitted. You'll receive an email when approved (typically 1-2 hours).
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Requested: {receivingRequest.requestedAt ? new Date(receivingRequest.requestedAt).toLocaleString() : "N/A"}
                </p>
              </div>
            )}

            {/* Approved */}
            {receivingRequest?.status === "approved" && receivingRequest.mxRecords && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                  <strong>Status:</strong> ✅ Receiving Enabled
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                  Add these MX records at your DNS provider to start receiving emails.
                </p>

                {/* MX Records Table */}
                <div className="bg-white dark:bg-neutral-950 rounded-lg border border-green-200 dark:border-green-800 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-green-100 dark:bg-green-900/30">
                      <tr>
                        <th className="text-left p-3 font-medium text-green-900 dark:text-green-100">Type</th>
                        <th className="text-left p-3 font-medium text-green-900 dark:text-green-100">Name</th>
                        <th className="text-left p-3 font-medium text-green-900 dark:text-green-100">Value</th>
                        <th className="text-left p-3 font-medium text-green-900 dark:text-green-100">Priority</th>
                        <th className="text-left p-3 font-medium text-green-900 dark:text-green-100">TTL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receivingRequest.mxRecords.map((record, index) => (
                        <tr key={index} className="border-t border-green-100 dark:border-green-900">
                          <td className="p-3 font-mono text-neutral-900 dark:text-neutral-100">{record.type}</td>
                          <td className="p-3 font-mono text-neutral-900 dark:text-neutral-100">{record.name}</td>
                          <td className="p-3 font-mono text-neutral-900 dark:text-neutral-100">{record.value}</td>
                          <td className="p-3 font-mono text-neutral-900 dark:text-neutral-100">{record.priority}</td>
                          <td className="p-3 font-mono text-neutral-900 dark:text-neutral-100">{record.ttl}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-green-600 dark:text-green-400 mt-3">
                  Enabled: {receivingRequest.reviewedAt ? new Date(receivingRequest.reviewedAt).toLocaleString() : "N/A"}
                </p>
              </div>
            )}

            {/* Rejected */}
            {receivingRequest?.status === "rejected" && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                  <strong>Status:</strong> ❌ Request Rejected
                </p>
                {receivingRequest.rejectionReason && (
                  <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                    <strong>Reason:</strong> {receivingRequest.rejectionReason}
                  </p>
                )}
                <p className="text-sm text-red-600 dark:text-red-400">
                  Please contact support for more information.
                </p>
              </div>
            )}
          </div>
        </div>

      {/* {(!domain.dnsRecords?.length || domain.dnsRecords.length === 0) && !domain.resendDomainId && (
        <div className="mt-4">
          <Button onClick={handleAddToResend} disabled={addingToResend}>
            {addingToResend ? "Adding to Resend..." : "Add to Resend"}
          </Button>
          <p className="text-sm text-neutral-500 mt-2">Get DNS records from Resend to add at your domain provider.</p>
        </div>
      )} */}
      {(!domain.dnsRecords?.length || domain.dnsRecords.length === 0) && (
        <div className="mt-4">
          <Button onClick={handleAddToResend} disabled={addingToResend}>
            {addingToResend
              ? "Loading..."
              : domain.resendDomainId
                ? "Refresh DNS Records"
                : "Add to Resend"}
          </Button>
          <p className="text-sm text-neutral-500 mt-2">
            {domain.resendDomainId
              ? "Domain is registered but DNS records are missing. Click to refresh."
              : "Get DNS records from Resend to add at your domain provider."}
          </p>
        </div>
      )}

      {!isVerified && domain.resendDomainId && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>Next steps:</strong> Add the DNS records below at your domain provider. 
            Verification typically takes 5-30 minutes. This page auto-checks every 30 seconds.
          </p>
        </div>
      )}

      {/* <div className="flex gap-3 mt-4">
        <Button
          onClick={handleCheckVerification}
          disabled={checking}
        >
          {checking ? "Checking..." : "Check Verification"}
        </Button>
        <Link href="/dashboard/domains">
          <Button variant="outline">Back to Domains</Button>
        </Link>
      </div> */}
      <div className="flex gap-3 mt-4">
        {domain.resendDomainId && (
          <Button
            onClick={handleCheckVerification}
            disabled={checking || !domain.resendDomainId}
          >
            {checking ? "Checking..." : "Check Verification"}
          </Button>
        )}
        <Link href="/dashboard/domains">
          <Button variant="outline">Back to Domains</Button>
        </Link>
      </div>
    </div>
  );
}
