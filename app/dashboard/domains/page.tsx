'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Domain = {
  id: string;
  domain: string;
  status: string;
  verifiedForSending?: boolean;
  receivingEnabled?: boolean;
  createdAt: string;
};

export default function DomainsPage() {
  const router = useRouter();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/domains");
      if (!res.ok) throw new Error("Failed to load");
      setDomains(await res.json());
    } catch {
      toast.error("Could not load domains");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: newDomain.trim() }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || (res.status === 409 ? "Domain already exists" : "Failed to add domain"));
      }
      const created: Domain = body;
      setDomains((prev) => [created, ...prev]);
      setNewDomain("");
      toast.success(`Domain "${created.domain}" added`);

      try {
        const addRes = await fetch("/api/domains/add-to-resend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domainId: created.id }),
        });
        const addData = await addRes.json();
        if (addRes.ok && addData.domain) {
          setDomains((prev) =>
            prev.map((d) => d.id === created.id ? { ...d, status: addData.domain?.status ?? d.status } : d)
          );
        }
      } catch { /* continue */ } finally {
        router.push(`/dashboard/domains/${created.id}/verify`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add domain");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (domain: Domain) => {
    if (!confirm(`Delete domain "${domain.domain}"?\n\nThis will also remove all aliases for this domain.`)) return;
    setDeletingId(domain.id);
    try {
      const res = await fetch(`/api/domains/${domain.id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete");
      }
      setDomains((prev) => prev.filter((d) => d.id !== domain.id));
      toast.success(`Domain "${domain.domain}" deleted`);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete domain");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (domain: Domain) => {
    if (domain.verifiedForSending || domain.status === "verified") {
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">✅ Verified</span>;
    }
    if (domain.status === "active") {
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Active</span>;
    }
    return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">⏳ Pending</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Domains</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Add and verify your domains to use for email aliases.
        </p>
      </div>

      {/* Add domain form */}
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
        <input
          type="text"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          placeholder="example.com"
          className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Button type="submit" disabled={submitting || !newDomain.trim()} className="shrink-0 bg-indigo-600 hover:bg-indigo-700">
          {submitting ? "Adding..." : "Add Domain"}
        </Button>
      </form>

      {/* Table */}
      <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-400">Domain</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-400">Status</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-400">Receiving</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-400">Added</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-neutral-500">Loading domains...</td></tr>
            ) : domains.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-neutral-500">No domains yet — add your first domain above.</td></tr>
            ) : (
              domains.map((d) => (
                <tr key={d.id} className="border-t border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-4 py-3 font-mono font-medium text-neutral-900 dark:text-neutral-100">{d.domain}</td>
                  <td className="px-4 py-3">{getStatusBadge(d)}</td>
                  <td className="px-4 py-3">
                    {d.receivingEnabled ? (
                      <span className="text-green-600 dark:text-green-400 text-xs font-medium">✅ Enabled</span>
                    ) : (
                      <span className="text-neutral-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 text-xs tabular-nums">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/domains/${d.id}/verify`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          {d.verifiedForSending ? "Details" : "Verify"}
                        </Button>
                      </Link>
                      <button
                        onClick={() => handleDelete(d)}
                        disabled={deletingId === d.id}
                        className="text-xs px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                      >
                        {deletingId === d.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
