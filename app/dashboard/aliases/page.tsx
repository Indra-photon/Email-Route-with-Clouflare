'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type DomainOption = {
  id: string;
  domain: string;
};

type Alias = {
  id: string;
  localPart: string;
  email: string;
  status: string;
  domain: string;
  createdAt: string;
  integrationName?: string | null;
  integrationType?: string | null;
};

type IntegrationOption = {
  id: string;
  name: string;
  type: "slack" | "discord";
};

export default function AliasesPage() {
  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [aliases, setAliases] = useState<Alias[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDomainId, setSelectedDomainId] = useState<string>("");
  const [localPart, setLocalPart] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [integrations, setIntegrations] = useState<IntegrationOption[]>([]);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string>("");

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        setError(null);

        const [domainsRes, aliasesRes, integrationsRes] = await Promise.all([
          fetch("/api/domains"),
          fetch("/api/aliases"),
          fetch("/api/integrations"),
        ]);

        if (!domainsRes.ok) {
          throw new Error("Failed to load domains");
        }
        if (!aliasesRes.ok) {
          throw new Error("Failed to load aliases");
        }
        if (!integrationsRes.ok) {
          throw new Error("Failed to load integrations");
        }

        const domainsData = await domainsRes.json();
        const aliasesData = await aliasesRes.json();
        const integrationsData = await integrationsRes.json();

        setDomains(
          domainsData.map((d: any) => ({
            id: d.id,
            domain: d.domain,
          }))
        );
        setAliases(aliasesData);

        if (domainsData.length > 0) {
          setSelectedDomainId(domainsData[0].id);
        }
        setIntegrations(
          integrationsData.map((i: any) => ({
            id: i.id,
            name: i.name,
            type: i.type,
          }))
        );
        if (integrationsData.length > 0) {
          setSelectedIntegrationId(integrationsData[0].id);
        }
      } catch (err) {
        console.error(err);
        setError("Could not load aliases or domains. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDomainId || !localPart.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch("/api/aliases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domainId: selectedDomainId,
          localPart: localPart.trim(),
          integrationId: selectedIntegrationId || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create alias");
      }

      const created: Alias = await res.json();
      setAliases((prev) => [created, ...prev]);
      setLocalPart("");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to create alias."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Aliases</h1>
        <p className="text-sm text-neutral-600">
          Create aliases for your domains. Each alias is stored in MongoDB and
          linked to a domain. Email routing will be wired up in the next task.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
        <label className="text-sm font-medium text-neutral-700">
          Domain
        </label>
        <select
          value={selectedDomainId}
          onChange={(e) => setSelectedDomainId(e.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          {domains.length === 0 ? (
            <option value="">No domains available</option>
          ) : (
            domains.map((d) => (
              <option key={d.id} value={d.id}>
                {d.domain}
              </option>
            ))
          )}
        </select>

        <label className="mt-3 text-sm font-medium text-neutral-700">
          Local part
        </label>
        <input
          type="text"
          value={localPart}
          onChange={(e) => setLocalPart(e.target.value)}
          placeholder="support"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />

        <label className="mt-3 text-sm font-medium text-neutral-700">
          Target integration (optional)
        </label>
        <select
          value={selectedIntegrationId}
          onChange={(e) => setSelectedIntegrationId(e.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          {integrations.length === 0 ? (
            <option value="">No integrations configured</option>
          ) : (
            integrations.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} ({i.type})
              </option>
            ))
          )}
        </select>

        <Button
          type="submit"
          disabled={submitting || domains.length === 0}
          className="mt-3 self-start"
        >
          {submitting ? "Adding..." : "Add Alias"}
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
                Email
              </th>
              <th className="px-4 py-2 text-left font-medium text-neutral-700">
                Local part
              </th>
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
                Integration
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                  Loading aliases...
                </td>
              </tr>
            ) : aliases.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                  No aliases yet. Create one using the form above.
                </td>
              </tr>
            ) : (
              aliases.map((a) => (
                <tr key={a.id} className="border-t border-neutral-200">
                  <td className="px-4 py-2">{a.email}</td>
                  <td className="px-4 py-2">{a.localPart}</td>
                  <td className="px-4 py-2">{a.domain}</td>
                  <td className="px-4 py-2 capitalize">{a.status}</td>
                <td className="px-4 py-2 text-neutral-500">
                  {new Date(a.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {a.integrationName
                    ? `${a.integrationName} (${a.integrationType})`
                    : "—"}
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

