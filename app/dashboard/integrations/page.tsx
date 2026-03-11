


"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  IconCheck,
  IconPlus,
  IconX,
  IconChevronDown,
  IconBrandSlack,
  IconBrandDiscord,
  IconPlugConnected,
} from "@tabler/icons-react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { AnimatedSubmitButton } from "@/components/ui/AnimatedSubmitButton";
import { AnimatedDeleteButton } from "@/components/ui/AnimatedDeleteButton";
import { CopyIconButton } from "@/components/ui/CopyIconButton";
import { CustomLink } from "@/components/CustomLink";
import { RefreshCw } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Integration = {
  id: string;
  type: "slack" | "discord";
  name: string;
  webhookUrl: string;
  authMethod: "webhook" | "oauth";
  slackChannelName: string | null;
  slackTeamName: string | null;
  createdAt: string;
};

// ─── Easing ───────────────────────────────────────────────────────────────────

const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;
const easeOutQuint = [0.23, 1, 0.32, 1] as const;
const easeOutQuart = [0.165, 0.84, 0.44, 1] as const;

// ─── Type Selector ────────────────────────────────────────────────────────────

function TypeSelector({
  value,
  onChange,
  disabled,
}: {
  value: "slack" | "discord";
  onChange: (v: "slack" | "discord") => void;
  disabled?: boolean;
}) {
  const options: { value: "slack" | "discord"; label: string; Icon: React.ElementType }[] = [
    { value: "slack", label: "Slack", Icon: IconBrandSlack },
    { value: "discord", label: "Discord", Icon: IconBrandDiscord },
  ];

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-lg font-schibsted text-neutral-700 dark:text-neutral-300">Type</label>
      <div className="flex gap-2">
        {options.map(({ value: v, label, Icon }) => {
          const isSelected = value === v;
          return (
            <button
              key={v}
              type="button"
              disabled={disabled}
              onClick={() => onChange(v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-schibsted font-medium transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                isSelected
                  ? "border-sky-600 bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:border-sky-700 dark:text-sky-400"
                  : "border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Add Integration Form ─────────────────────────────────────────────────────

type FormStatus = "idle" | "loading" | "success";

function IntegrationAddForm({
  onIntegrationAdded,
}: {
  onIntegrationAdded: (integration: Integration) => void;
}) {
  const [type, setType] = useState<"slack" | "discord">("slack");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [name, setName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  const isBusy = status !== "idle";

  // Reset form fields when switching type
  const handleTypeChange = (v: "slack" | "discord") => {
    setType(v);
    setName("");
    setWebhookUrl("");
  };

  const handleDiscordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !webhookUrl.trim() || isBusy) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "discord", name: name.trim(), webhookUrl: webhookUrl.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to add integration");
      }

      const created: Integration = await res.json();

      setTimeout(() => {
        setStatus("success");
        toast.success(`Integration "${created.name}" added`);
        setName("");
        setWebhookUrl("");
        onIntegrationAdded(created);
        setTimeout(() => setStatus("idle"), 100);
      }, 1000);
    } catch (err) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Failed to add integration");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-end">
        <TypeSelector value={type} onChange={handleTypeChange} disabled={isBusy} />
      </div>

      <AnimatePresence mode="wait" initial={false}>

        {/* ── Slack OAuth ── */}
        {type === "slack" && (
          <motion.div
            key="slack"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: easeOutCubic }}
            className="flex flex-wrap gap-2 items-end"
          >
            <div className="flex flex-col space-y-1">
              <label className="text-lg font-schibsted text-neutral-700 dark:text-neutral-300">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Support channel"
                disabled={isBusy}
                className="w-48 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors duration-100 focus:border-sky-800 dark:focus:border-neutral-400 outline-none focus:outline-none [box-shadow:none] focus:[box-shadow:none] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <a
              href={name.trim() ? `/api/integrations/slack/oauth?name=${encodeURIComponent(name.trim())}` : "#"}
              onClick={(e) => { if (!name.trim()) e.preventDefault(); }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-schibsted text-sm text-white bg-gradient-to-t from-sky-900 to-cyan-600 transition-opacity duration-150 ${
                !name.trim() ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              <IconBrandSlack size={15} />
              Add to Slack
            </a>

            <CustomLink
              href="/docs/integrations/slack"
              className="text-sm font-schibsted text-sky-700 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300 transition-colors underline pb-2"
            >
              Read our docs
            </CustomLink>
          </motion.div>
        )}

        {/* ── Discord Webhook ── */}
        {type === "discord" && (
          <motion.div
            key="discord"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: easeOutCubic }}
          >
            <form onSubmit={handleDiscordSubmit} className="space-y-3">
              <div className="flex flex-wrap gap-2 items-end">
                <div className="flex flex-col space-y-1">
                  <label className="text-lg font-schibsted text-neutral-700 dark:text-neutral-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Support channel"
                    required
                    disabled={isBusy}
                    className="w-48 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors duration-100 focus:border-sky-800 dark:focus:border-neutral-400 outline-none focus:outline-none [box-shadow:none] focus:[box-shadow:none] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-lg font-schibsted text-neutral-700 dark:text-neutral-300">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                    required
                    disabled={isBusy}
                    className="w-80 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors duration-100 focus:border-sky-800 dark:focus:border-neutral-400 outline-none focus:outline-none [box-shadow:none] focus:[box-shadow:none] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <AnimatedSubmitButton
                  idleLabel="Add"
                  loadingLabel="Adding..."
                  successLabel="Added"
                  idleIcon={<IconPlus size={16} strokeWidth={2.5} />}
                  state={status}
                  idleWidth={170}
                  loadingWidth={110}
                  successWidth={200}
                  className="font-schibsted w-32 px-4 py-2 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 text-white border-0 shadow-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 cursor-pointer flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                />

                <CustomLink
                  href="/docs/integrations/discord"
                  className="text-sm font-schibsted text-sky-700 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300 transition-colors underline pb-2"
                >
                  Read our docs
                </CustomLink>
              </div>
            </form>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

// ─── Integration Card ─────────────────────────────────────────────────────────

function IntegrationCard({
  integration,
  onDelete,
}: {
  integration: Integration;
  onDelete: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const isSlack = integration.type === "slack";
  const isOAuth = integration.authMethod === "oauth";

  const displayTarget = isOAuth && integration.slackTeamName && integration.slackChannelName
    ? `${integration.slackTeamName} · #${integration.slackChannelName}`
    : integration.webhookUrl.length > 50
    ? integration.webhookUrl.slice(0, 50) + "…"
    : integration.webhookUrl;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: -2 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -2 }}
      transition={{ duration: 0.15, ease: easeOutCubic }}
    >
      <Card className="bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors duration-150">
        <CardContent className="p-4 flex items-center gap-4">
          {/* Icon */}
          <div className="shrink-0 w-8 h-8 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center">
            {isSlack
              ? <IconBrandSlack size={15} className="text-white" />
              : <IconBrandDiscord size={15} className="text-white" />
            }
          </div>

          {/* Name + type — clickable */}
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            className="flex-1 min-w-0 text-left cursor-pointer focus:outline-none"
          >
            <p className="font-schibsted font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
              {integration.name}
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              <Badge className={`border-0 font-schibsted tracking-tight capitalize rounded-sm ${
                isSlack
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
              }`}>
                {integration.type}
                {isOAuth && " · OAuth"}
              </Badge>
            </div>
          </button>

          {/* Chevron */}
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex items-center justify-center"
            >
              <IconChevronDown size={15} className="text-neutral-500" />
            </motion.span>
          </button>

          {/* Delete */}
          <AnimatedDeleteButton
            onDelete={async () => {
              setIsOpen(false);
              try {
                const res = await fetch(`/api/integrations/${integration.id}`, { method: "DELETE" });
                if (!res.ok) {
                  const body = await res.json().catch(() => ({}));
                  throw new Error(body.error || "Failed to delete");
                }
                toast.success(`Integration "${integration.name}" deleted`);
                setTimeout(() => onDelete(integration.id), 400);
                return "success";
              } catch (err: any) {
                toast.error(err.message || "Failed to delete integration");
                return "error";
              }
            }}
          />
        </CardContent>

        {/* Expanded panel — always mounted */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: easeOutQuint }}
          style={{ overflow: "hidden" }}
        >
          <div className="px-4 pb-4 pt-1 border-t border-neutral-100 dark:border-neutral-800 mt-1 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Name</p>
                <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">{integration.name}</p>
              </div>
              <div>
                <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Type</p>
                <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100 capitalize">
                  {integration.type}{isOAuth ? " (OAuth)" : " (Webhook)"}
                </p>
              </div>
              {isOAuth && integration.slackTeamName && (
                <div>
                  <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Workspace</p>
                  <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">{integration.slackTeamName}</p>
                </div>
              )}
              {isOAuth && integration.slackChannelName && (
                <div>
                  <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Channel</p>
                  <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">#{integration.slackChannelName}</p>
                </div>
              )}
              <div className={isOAuth && (integration.slackTeamName || integration.slackChannelName) ? "" : "col-span-2"}>
                <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Created</p>
                <p className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300 tabular-nums">
                  {new Date(integration.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Webhook URL — only for non-OAuth */}
            {!isOAuth && (
              <div className="space-y-2">
                <p className="text-xs font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">Webhook URL</p>
                <div className="flex items-center gap-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 px-3 py-2">
                  <code className="flex-1 text-xs font-mono text-neutral-700 dark:text-neutral-300 truncate">
                    {integration.webhookUrl}
                  </code>
                  <CopyIconButton value={integration.webhookUrl} />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2, ease: easeOutCubic }}
      className="flex flex-col items-center justify-center py-12 px-6 gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center opacity-40">
        <IconPlugConnected size={18} className="text-white" />
      </div>
      <Paragraph variant="muted" className="text-center max-w-lg">
        No integrations yet. Add a Slack or Discord integration above to start routing emails.
      </Paragraph>
    </motion.div>
  );
}

// ─── Loading State ────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: easeOutCubic }}
      className="flex items-center justify-center py-12 gap-2"
    >
      <RefreshCw className="size-8 text-neutral-400 animate-spin" />
      <Paragraph variant="muted" className="text-xs">Loading integrations...</Paragraph>
    </motion.div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const searchParams = useSearchParams();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  // Handle Slack OAuth callback toasts
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    if (success === "slack_connected") {
      toast.success("Slack connected! Your channel is ready.");
      fetchIntegrations();
    } else if (error === "slack_denied") {
      toast.error("Slack connection was cancelled.");
    } else if (error) {
      toast.error(`Slack connection failed: ${error}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/integrations");
      if (!res.ok) throw new Error("Failed to load");
      setIntegrations(await res.json());
    } catch {
      toast.error("Could not load integrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleDelete = (id: string) => {
    setIntegrations((prev) => prev.filter((i) => i.id !== id));
  };

  const handleIntegrationAdded = (integration: Integration) => {
    setIntegrations((prev) => [integration, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div>
        <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
          Connect Your Team Workspace
        </Heading>
        <Paragraph variant="default" className="text-neutral-600 dark:text-neutral-400 mt-1">
          Add Slack or Discord integrations to route incoming emails directly to your team channels. Each integration can be linked to multiple email aliases.
        </Paragraph>
      </div>

      <IntegrationAddForm onIntegrationAdded={handleIntegrationAdded} />

      <div className="border-2 border-dashed border-neutral-200 rounded-xl px-4 pt-3 pb-3">
      <Card className="min-h-[120px] overflow-hidden">
           <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
             Your Integrations
           </Heading>
           <Paragraph variant="small" className="text-neutral-600 dark:text-neutral-400 mt-1 pb-5">
             Your Current Slack and Discord Integrations. Click on an integration to see details, copy the webhook URL, or delete it.
         </Paragraph>

        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingState key="loading" />
          ) : integrations.length === 0 ? (
            <EmptyState key="empty" />
          ) : (
            <motion.div
              key="list"
              layout
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.7 }}
              transition={{ duration: 0.15, type: "spring", stiffness: 300, damping: 20 }}
              className="space-y-2"
            >
              {integrations.map((i) => (
                <IntegrationCard
                  key={i.id}
                  integration={i}
                  onDelete={handleDelete}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      </div>
    </div>
  );
}