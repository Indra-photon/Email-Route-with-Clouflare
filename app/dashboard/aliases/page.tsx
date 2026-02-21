'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  integrationId: string | null;
  integrationName?: string | null;
  integrationType?: string | null;
  createdAt: string;
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

  // Inline editing state: aliasId → selected integrationId
  const [editingIntegration, setEditingIntegration] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

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

        if (!domainsRes.ok) throw new Error("Failed to load domains");
        if (!aliasesRes.ok) throw new Error("Failed to load aliases");
        if (!integrationsRes.ok) throw new Error("Failed to load integrations");

        const domainsData = await domainsRes.json();
        const aliasesData: Alias[] = await aliasesRes.json();
        const integrationsData = await integrationsRes.json();

        setDomains(domainsData.map((d: any) => ({ id: d.id, domain: d.domain })));
        setAliases(aliasesData);

        if (domainsData.length > 0) setSelectedDomainId(domainsData[0].id);

        const mapped = integrationsData.map((i: any) => ({
          id: i.id,
          name: i.name,
          type: i.type,
        }));
        setIntegrations(mapped);
        if (mapped.length > 0) setSelectedIntegrationId(mapped[0].id);

        // Pre-fill edit dropdowns to current integration per alias
        const editState: Record<string, string> = {};
        aliasesData.forEach((a) => { editState[a.id] = a.integrationId ?? ""; });
        setEditingIntegration(editState);
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
        headers: { "Content-Type": "application/json" },
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
      setEditingIntegration((prev) => ({ ...prev, [created.id]: created.integrationId ?? "" }));
      setLocalPart("");
      toast.success(`Alias ${created.email} created`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create alias.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (alias: Alias) => {
    if (!confirm(`Delete alias "${alias.email}"? This cannot be undone.`)) return;
    setDeletingId(alias.id);
    try {
      const res = await fetch(`/api/aliases/${alias.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to delete");
      setAliases((prev) => prev.filter((a) => a.id !== alias.id));
      toast.success(`Alias "${alias.email}" deleted`);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete alias");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveIntegration = async (alias: Alias) => {
    const newIntegrationId = editingIntegration[alias.id] ?? "";
    setSavingId(alias.id);
    try {
      const res = await fetch(`/api/aliases/${alias.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integrationId: newIntegrationId || null }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to update");
      const updated: Alias = await res.json();
      setAliases((prev) => prev.map((a) => (a.id === alias.id ? updated : a)));
      toast.success("Integration updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update integration");
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleStatus = async (alias: Alias) => {
    const newStatus = alias.status === "active" ? "inactive" : "active";
    setTogglingId(alias.id);
    try {
      const res = await fetch(`/api/aliases/${alias.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to update status");
      const updated: Alias = await res.json();
      setAliases((prev) => prev.map((a) => (a.id === alias.id ? updated : a)));
      toast.success(`Alias ${newStatus === "active" ? "enabled" : "disabled"}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Aliases</h1>
        <p className="text-sm text-neutral-600">
          Create aliases for your domains. Each alias is stored in MongoDB and linked to a domain.
        </p>
      </div>

      {/* Create form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
        <label className="text-sm font-medium text-neutral-700">Domain</label>
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

        <label className="mt-3 text-sm font-medium text-neutral-700">Local part</label>
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
          <option value="">None</option>
          {integrations.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name} ({i.type})
            </option>
          ))}
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

      {/* Aliases table */}
      <div className="border border-neutral-200 rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-neutral-700">Email</th>
              <th className="px-4 py-2 text-left font-medium text-neutral-700">Local part</th>
              <th className="px-4 py-2 text-left font-medium text-neutral-700">Domain</th>
              <th className="px-4 py-2 text-left font-medium text-neutral-700">Status</th>
              <th className="px-4 py-2 text-left font-medium text-neutral-700">Created</th>
              <th className="px-4 py-2 text-left font-medium text-neutral-700">Integration</th>
              <th className="px-4 py-2 text-left font-medium text-neutral-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
                  Loading aliases...
                </td>
              </tr>
            ) : aliases.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
                  No aliases yet. Create one using the form above.
                </td>
              </tr>
            ) : (
              aliases.map((a) => {
                const currentEdit = editingIntegration[a.id] ?? a.integrationId ?? "";
                const isDirty = currentEdit !== (a.integrationId ?? "");

                return (
                  <tr key={a.id} className={`border-t border-neutral-200 ${a.status === "inactive" ? "opacity-50" : ""}`}>
                    <td className="px-4 py-2 font-mono">{a.email}</td>
                    <td className="px-4 py-2">{a.localPart}</td>
                    <td className="px-4 py-2">{a.domain}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${a.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-neutral-100 text-neutral-600"
                          }`}
                      >
                        {a.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-neutral-500">
                      {new Date(a.createdAt).toLocaleString()}
                    </td>

                    {/* Editable integration dropdown */}
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={currentEdit}
                          onChange={(e) =>
                            setEditingIntegration((prev) => ({
                              ...prev,
                              [a.id]: e.target.value,
                            }))
                          }
                          className="rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-700"
                          disabled={savingId === a.id}
                        >
                          <option value="">None</option>
                          {integrations.map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.name} ({i.type})
                            </option>
                          ))}
                        </select>
                        {isDirty && (
                          <button
                            onClick={() => handleSaveIntegration(a)}
                            disabled={savingId === a.id}
                            className="text-xs text-blue-600 hover:underline font-medium disabled:opacity-50"
                          >
                            {savingId === a.id ? "Saving..." : "Save"}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        {/* Enable / Disable toggle */}
                        <button
                          onClick={() => handleToggleStatus(a)}
                          disabled={togglingId === a.id}
                          className={`text-xs font-medium px-2 py-1 rounded border transition-colors disabled:opacity-50 ${a.status === "active"
                              ? "border-neutral-300 text-neutral-600 hover:bg-neutral-100"
                              : "border-green-300 text-green-700 hover:bg-green-50"
                            }`}
                        >
                          {togglingId === a.id
                            ? "..."
                            : a.status === "active"
                              ? "Disable"
                              : "Enable"}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(a)}
                          disabled={deletingId === a.id}
                          className="text-xs font-medium px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {deletingId === a.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
