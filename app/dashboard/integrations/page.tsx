'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Integration = {
  id: string;
  type: "slack" | "discord";
  name: string;
  webhookUrl: string;
  createdAt: string;
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"slack" | "discord">("slack");
  const [name, setName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/integrations");
      if (!res.ok) throw new Error("Failed to load");
      setIntegrations(await res.json());
    } catch {
      toast.error("Could not load integrations");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !webhookUrl.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, name: name.trim(), webhookUrl: webhookUrl.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to add integration");
      }
      const created: Integration = await res.json();
      setIntegrations((prev) => [created, ...prev]);
      setName("");
      setWebhookUrl("");
      toast.success(`Integration "${created.name}" added`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add integration");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (integ: Integration) => {
    if (!confirm(`Delete integration "${integ.name}"?\n\nAny aliases using this integration will lose their target.`)) return;
    setDeletingId(integ.id);
    try {
      const res = await fetch(`/api/integrations/${integ.id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete");
      }
      setIntegrations((prev) => prev.filter((i) => i.id !== integ.id));
      toast.success(`Integration "${integ.name}" deleted`);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete integration");
    } finally {
      setDeletingId(null);
    }
  };

  const truncate = (s: string, max = 40) => s.length > max ? s.slice(0, max) + "…" : s;

  const typeIcon = (t: string) => t === "discord" ? "🎮" : "💬";
  const typeBadge = (t: string) => t === "discord"
    ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Integrations</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Connect Slack or Discord via webhook URLs — used as routing targets for aliases.
        </p>
      </div>

      {/* Add form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Add Integration</h2>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value === "discord" ? "discord" : "slack")}
            className="rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100"
          >
            <option value="slack">💬 Slack webhook</option>
            <option value="discord">🎮 Discord webhook</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Support channel"
            className="rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Webhook URL</label>
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder={type === "discord" ? "https://discord.com/api/webhooks/..." : "https://hooks.slack.com/services/..."}
            className="rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <Button
          type="submit"
          disabled={submitting || !name.trim() || !webhookUrl.trim()}
          className="mt-1 self-start bg-indigo-600 hover:bg-indigo-700"
        >
          {submitting ? "Adding..." : "Add Integration"}
        </Button>
      </form>

      {/* Table */}
      <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-400">Name</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-400">Type</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-400">Webhook URL</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-400">Added</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-neutral-500">Loading integrations...</td></tr>
            ) : integrations.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-neutral-500">No integrations yet — add a Slack or Discord webhook above.</td></tr>
            ) : (
              integrations.map((i) => (
                <tr key={i.id} className="border-t border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{i.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${typeBadge(i.type)}`}>
                      {typeIcon(i.type)} {i.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 font-mono text-xs">
                    {truncate(i.webhookUrl)}
                  </td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 text-xs tabular-nums">
                    {new Date(i.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(i)}
                      disabled={deletingId === i.id}
                      className="text-xs px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                    >
                      {deletingId === i.id ? "..." : "Delete"}
                    </button>
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
