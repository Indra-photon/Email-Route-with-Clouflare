'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<"slack" | "discord">("slack");
  const [name, setName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/integrations");
        if (!res.ok) {
          throw new Error("Failed to load integrations");
        }
        const data = await res.json();
        setIntegrations(data);
      } catch (err) {
        console.error(err);
        setError("Could not load integrations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !webhookUrl.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          name: name.trim(),
          webhookUrl: webhookUrl.trim(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create integration");
      }

      const created: Integration = await res.json();
      setIntegrations((prev) => [created, ...prev]);
      setName("");
      setWebhookUrl("");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to create integration."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const truncate = (value: string, max = 32) =>
    value.length > max ? value.slice(0, max) + "…" : value;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Integrations</h1>
        <p className="text-sm text-neutral-600">
          Connect Slack and Discord via webhook URLs. These integrations can be
          used as routing targets for aliases.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">Type</label>
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value === "discord" ? "discord" : "slack")
            }
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="slack">Slack webhook</option>
            <option value="discord">Discord webhook</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Support channel"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">
            Webhook URL
          </label>
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="mt-2 self-start"
        >
          {submitting ? "Adding..." : "Add integration"}
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
                Name
              </th>
              <th className="px-4 py-2 text-left font-medium text-neutral-700">
                Type
              </th>
              <th className="px-4 py-2 text-left font-medium text-neutral-700">
                Webhook
              </th>
              <th className="px-4 py-2 text-left font-medium text-neutral-700">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-neutral-500">
                  Loading integrations...
                </td>
              </tr>
            ) : integrations.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-neutral-500">
                  No integrations yet. Add a Slack or Discord webhook above.
                </td>
              </tr>
            ) : (
              integrations.map((i) => (
                <tr key={i.id} className="border-top border-neutral-200">
                  <td className="px-4 py-2">{i.name}</td>
                  <td className="px-4 py-2 capitalize">{i.type}</td>
                  <td className="px-4 py-2 text-neutral-500">
                    {truncate(i.webhookUrl)}
                  </td>
                  <td className="px-4 py-2 text-neutral-500">
                    {new Date(i.createdAt).toLocaleString()}
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

