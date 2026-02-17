'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Domain = {
  id: string;
  domain: string;
  status: string;
  createdAt: string;
};

export default function DomainsPage() {
  const router = useRouter();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newDomain, setNewDomain] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/domains");
        if (!res.ok) {
          throw new Error("Failed to load domains");
        }
        const data = await res.json();
        setDomains(data);
      } catch (err) {
        console.error(err);
        setError("Could not load domains. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch("/api/domains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: newDomain.trim() }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          body.error ||
          (res.status === 400 ? "Invalid domain" : res.status === 409 ? "Domain already exists" : "Failed to create domain");
        throw new Error(msg);
      }

      const created: Domain = body as Domain;
      setDomains((prev) => [created, ...prev]);
      setNewDomain("");

      // Add domain to Resend and redirect to verification page
      // try {
      //   const addRes = await fetch("/api/domains/add-to-resend", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ domainId: created.id }),
      //   });
      //   const addData = await addRes.json();
      //   if (addRes.ok && addData.domain) {
      //     setDomains((prev) =>
      //       prev.map((d) =>
      //         d.id === created.id
      //           ? { ...d, status: addData.domain?.status ?? d.status }
      //           : d
      //       )
      //     );
      //     router.push(`/dashboard/domains/${created.id}/verify`);
      //     return;
      //   }
      //   if (!addRes.ok && addData.error?.toLowerCase().includes("already")) {
      //     router.push(`/dashboard/domains/${created.id}/verify`);
      //     return;
      //   }
      // } catch {
      //   // Still redirect so user can add to Resend manually or retry
      //   router.push(`/dashboard/domains/${created.id}/verify`);
      // }

      try {
        const addRes = await fetch("/api/domains/add-to-resend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domainId: created.id }),
        });
        const addData = await addRes.json();
        if (addRes.ok && addData.domain) {
          setDomains((prev) =>
            prev.map((d) =>
              d.id === created.id
                ? { ...d, status: addData.domain?.status ?? d.status }
                : d
            )
          );
        }
      } catch {
        // ignore, still redirect
      } finally {
        router.push(`/dashboard/domains/${created.id}/verify`);
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to create domain."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Domains</h1>
        <p className="text-sm text-neutral-600">
          Add the domains you want to use for email aliases. For now, domains
          are stored only in the database; DNS verification will come later.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
        <input
          type="text"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          placeholder="acme-test.com"
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <Button type="submit" disabled={submitting} className="shrink-0">
          {submitting ? "Adding..." : "Add Domain"}
        </Button>
      </form>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-neutral-700">
                Domain
              </th>
              <th className="px-4 py-2 text-left font-medium text-neutral-700">
                Status
              </th>
              <th className="px-4 py-2 text-left font-medium text-neutral-700">
                Created
              </th>
              <th className="px-4 py-2 text-left font-medium text-neutral-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-neutral-500">
                  Loading domains...
                </td>
              </tr>
            ) : domains.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-neutral-500">
                  No domains yet. Add your first domain above.
                </td>
              </tr>
            ) : (
              domains.map((d) => (
                <tr key={d.id} className="border-t border-neutral-200">
                  <td className="px-4 py-2">{d.domain}</td>
                  <td className="px-4 py-2 capitalize">{d.status}</td>
                  <td className="px-4 py-2 text-neutral-500 tabular-nums">
                    {new Date(d.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <Link href={`/dashboard/domains/${d.id}/verify`}>
                      <Button variant="outline" size="sm">
                        Verify
                      </Button>
                    </Link>
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

