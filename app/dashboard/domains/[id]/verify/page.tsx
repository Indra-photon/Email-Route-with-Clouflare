"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DomainVerificationInstructions } from "@/components/DomainVerificationInstructions";
import { VerificationStatusBadge } from "@/components/VerificationStatusBadge";

type DomainDetail = {
  id: string;
  domain: string;
  status: string;
  verifiedForSending?: boolean;
  resendDomainId?: string | null;
  dnsRecords?: { record: string; name: string; type: string; value?: string; status: string; priority?: number }[];
  lastCheckedAt?: string | null;
};

export default function DomainVerifyPage() {
  const params = useParams();
  const id = params?.id as string;

  const [domain, setDomain] = useState<DomainDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [addingToResend, setAddingToResend] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchDomain();
  }, [fetchDomain]);

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
      setDomain(data.domain ?? domain);
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

      {(!domain.dnsRecords?.length || domain.dnsRecords.length === 0) && !domain.resendDomainId && (
        <div className="mt-4">
          <Button onClick={handleAddToResend} disabled={addingToResend}>
            {addingToResend ? "Adding to Resend..." : "Add to Resend"}
          </Button>
          <p className="text-sm text-neutral-500 mt-2">Get DNS records from Resend to add at your domain provider.</p>
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <Button
          onClick={handleCheckVerification}
          disabled={checking}
        >
          {checking ? "Checking..." : "Check Verification"}
        </Button>
        <Link href="/dashboard/domains">
          <Button variant="outline">Back to Domains</Button>
        </Link>
      </div>
    </div>
  );
}
