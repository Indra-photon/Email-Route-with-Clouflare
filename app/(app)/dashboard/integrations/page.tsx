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
  IconTrash,
  IconTable,
} from "@tabler/icons-react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { AnimatedSubmitButton } from "@/components/ui/AnimatedSubmitButton";
import { AnimatedDeleteButton } from "@/components/ui/AnimatedDeleteButton";
import { CopyIconButton } from "@/components/ui/CopyIconButton";
import { CustomLink } from "@/components/CustomLink";
import AliasesPageSkeleton from "@/components/dashboard/AliasesPageSkeleton";

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

type PageTab = "integrations" | "add" | "delete";

// ─── Easing ───────────────────────────────────────────────────────────────────

const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;
const easeOutQuint = [0.23, 1, 0.32, 1] as const;

// ─── Page Tabs Config ─────────────────────────────────────────────────────────

const PAGE_TABS: { id: PageTab; label: string }[] = [
  { id: "add", label: "Add Integrations" },
  { id: "integrations", label: "Integrations" },
  { id: "delete", label: "Delete" },
];

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
  const options: {
    value: "slack" | "discord";
    label: string;
    Icon: React.ElementType;
  }[] = [
    { value: "slack", label: "Slack", Icon: IconBrandSlack },
    // { value: "discord", label: "Discord", Icon: IconBrandDiscord },
  ];

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300">
        Type
      </label>
      <div className="flex gap-2">
        {options.map(({ value: v, label, Icon }) => {
          const isSelected = value === v;
          return (
            <button
              key={v}
              type="button"
              disabled={disabled}
              onClick={() => onChange(v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-schibsted font-medium transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
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
  onSuccess,
}: {
  onIntegrationAdded: (integration: Integration) => void;
  onSuccess: () => void;
}) {
  const [type, setType] = useState<"slack" | "discord">("slack");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [name, setName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  const isBusy = status !== "idle";

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
        body: JSON.stringify({
          type: "discord",
          name: name.trim(),
          webhookUrl: webhookUrl.trim(),
        }),
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
        onSuccess();
        setTimeout(() => setStatus("idle"), 2500);
      }, 1000);
    } catch (err) {
      setStatus("idle");
      toast.error(
        err instanceof Error ? err.message : "Failed to add integration",
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-end">
        <TypeSelector
          value={type}
          onChange={handleTypeChange}
          disabled={isBusy}
        />
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
              <label className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Support channel"
                disabled={isBusy}
                className="w-48 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors focus:border-sky-800 outline-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <a
              href={
                name.trim()
                  ? `/api/integrations/slack/oauth?name=${encodeURIComponent(name.trim())}`
                  : "#"
              }
              onClick={(e) => {
                if (!name.trim()) e.preventDefault();
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-schibsted text-sm text-white bg-gradient-to-t from-sky-900 to-cyan-600 transition-opacity duration-150 ${
                !name.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90"
              }`}
            >
              <IconBrandSlack size={15} />
              Add to Slack
            </a>
            <CustomLink
              href="/docs/integrations/slack"
              className="text-sm font-schibsted text-sky-700 hover:text-sky-900 dark:text-sky-400 transition-colors underline pb-2"
            >
              Read our docs
            </CustomLink>
          </motion.div>
        )}

        {/* ── Discord Webhook ── */}
        {/* {type === "discord" && (
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
                  <label className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Support channel"
                    required
                    disabled={isBusy}
                    className="w-48 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors focus:border-sky-800 outline-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300">Webhook URL</label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                    required
                    disabled={isBusy}
                    className="w-80 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors focus:border-sky-800 outline-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="font-schibsted w-32 px-4 py-2 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 text-white border-0 focus:outline-none cursor-pointer flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <CustomLink href="/docs/integrations/discord" className="text-sm font-schibsted text-sky-700 hover:text-sky-900 dark:text-sky-400 transition-colors underline pb-2">
                  Read our docs
                </CustomLink>
              </div>
            </form>
          </motion.div>
        )} */}
      </AnimatePresence>
    </div>
  );
}

// ─── Integration Card ─────────────────────────────────────────────────────────

function IntegrationCard({
  integration,
  onDelete,
  deleteMode,
}: {
  integration: Integration;
  onDelete: (id: string) => void;
  deleteMode?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const isSlack = integration.type === "slack";
  const isOAuth = integration.authMethod === "oauth";

  return (
    <motion.div
      layout
      style={{ transformOrigin: "top center" }}
      variants={{
        hidden: { opacity: 0, scaleY: 0 },
        show: { opacity: 1, scaleY: 1 },
      }}
      animate="show"
      exit={{ opacity: 0, scaleY: 0.85 }}
      transition={{
        layout: { type: "spring", stiffness: 400, damping: 28 },
        opacity: { duration: 0.15, ease: [0.4, 0, 1, 1] },
        scaleY: { type: "spring", stiffness: 400, damping: 28 },
      }}
    >
      <Card className="bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors duration-150">
        <CardContent className="p-4 flex items-center gap-4">
          {/* Icon */}
          <div className="shrink-0 w-8 h-8 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center">
            {isSlack ? (
              <IconBrandSlack size={15} className="text-white" />
            ) : (
              <IconBrandDiscord size={15} className="text-white" />
            )}
          </div>

          {/* Name + type — clickable (only when not in delete mode) */}
          <button
            type="button"
            onClick={() => !deleteMode && setIsOpen((o) => !o)}
            className={`flex-1 min-w-0 text-left focus:outline-none ${deleteMode ? "cursor-default" : "cursor-pointer"}`}
          >
            <p className="font-schibsted font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
              {integration.name}
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              <Badge
                className={`border-0 font-schibsted tracking-tight capitalize rounded-sm ${
                  isSlack
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
                }`}
              >
                {integration.type}
                {isOAuth && " · OAuth"}
              </Badge>
            </div>
          </button>

          {/* Chevron — hidden in delete mode */}
          {!deleteMode && (
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
          )}

          {/* Delete */}
          <AnimatedDeleteButton
            onDelete={async () => {
              setIsOpen(false);
              try {
                const res = await fetch(`/api/integrations/${integration.id}`, {
                  method: "DELETE",
                });
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

        {/* Expanded panel — hidden in delete mode */}
        {!deleteMode && (
          <motion.div
            initial={false}
            animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3, ease: easeOutQuint }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4 pt-1 border-t border-neutral-100 dark:border-neutral-800 mt-1 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                    Name
                  </p>
                  <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">
                    {integration.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                    Type
                  </p>
                  <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100 capitalize">
                    {integration.type}
                    {isOAuth ? " (OAuth)" : " (Webhook)"}
                  </p>
                </div>
                {isOAuth && integration.slackTeamName && (
                  <div>
                    <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                      Workspace
                    </p>
                    <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">
                      {integration.slackTeamName}
                    </p>
                  </div>
                )}
                {isOAuth && integration.slackChannelName && (
                  <div>
                    <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                      Channel
                    </p>
                    <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">
                      #{integration.slackChannelName}
                    </p>
                  </div>
                )}
                <div
                  className={
                    isOAuth &&
                    (integration.slackTeamName || integration.slackChannelName)
                      ? ""
                      : "col-span-2"
                  }
                >
                  <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                    Created
                  </p>
                  <p className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300 tabular-nums">
                    {new Date(integration.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {!isOAuth && (
                <div className="space-y-2">
                  <p className="text-xs font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">
                    Webhook URL
                  </p>
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
        )}
      </Card>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15, ease: easeOutCubic }}
      className="flex flex-col items-center justify-center py-12 px-6 gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center opacity-40">
        <IconPlugConnected size={18} className="text-white" />
      </div>
      <Paragraph variant="muted" className="text-center max-w-lg">
        No integrations yet. Go to Add Integration to connect Slack or Discord.
      </Paragraph>
    </motion.div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const searchParams = useSearchParams();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePageTab, setActivePageTab] = useState<PageTab>("add");

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
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    if (success === "slack_connected") {
      toast.success("Slack connected! Your channel is ready.");
      fetchIntegrations();
      setActivePageTab("integrations");
    } else if (error === "slack_denied") {
      toast.error("Slack connection was cancelled.");
    } else if (error) {
      toast.error(`Slack connection failed: ${error}`);
    }
  }, []);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleDelete = (id: string) =>
    setIntegrations((prev) => prev.filter((i) => i.id !== id));
  const handleIntegrationAdded = (integration: Integration) =>
    setIntegrations((prev) => [integration, ...prev]);

  return (
    <div className="space-y-6 border border-neutral-400 rounded-lg p-4 h-[calc(100dvh-56px-48px)]">
      {/* Page heading */}
      <div>
        <Heading
          variant="muted"
          className="font-bold text-neutral-900 dark:text-neutral-100"
        >
          Connect Your Team Workspace
        </Heading>
        <Paragraph
          variant="default"
          className="text-neutral-600 dark:text-neutral-400 mt-1"
        >
          Add Slack or Discord integrations to route incoming emails directly to
          your team channels.
        </Paragraph>
      </div>

      {/* Main tabbed card */}
      <Card className="min-h-[300px] overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center gap-1.5 pb-4 border-b border-neutral-100 dark:border-neutral-800 flex-wrap">
          {PAGE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePageTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-schibsted font-semibold transition-all duration-150 focus:outline-none cursor-pointer ${
                activePageTab === tab.id
                  ? "text-white"
                  : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              {activePageTab === tab.id && (
                <motion.span
                  layoutId="integrations-tab-bg"
                  className="absolute inset-0 bg-gradient-to-r from-sky-800 to-cyan-700 rounded-lg z-0 shadow-sm"
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 30,
                    duration: 0.3,
                  }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.id === "integrations" && <IconTable size={15} />}
                {tab.id === "add" && <IconPlus size={15} />}
                {tab.id === "delete" && <IconTrash size={15} />}
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="pt-4">
          <AnimatePresence mode="wait" initial={false}>
            {/* ── Integrations tab ── */}
            {activePageTab === "integrations" && (
              <motion.div
                key="integrations"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                {loading ? (
                  <AliasesPageSkeleton />
                ) : integrations.length === 0 ? (
                  <EmptyState />
                ) : (
                  <motion.div layout className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {integrations.map((i) => (
                        <IntegrationCard
                          key={i.id}
                          integration={i}
                          onDelete={handleDelete}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── Add Integration tab ── */}
            {activePageTab === "add" && (
              <motion.div
                key="add"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                <IntegrationAddForm
                  onIntegrationAdded={handleIntegrationAdded}
                  onSuccess={() => setActivePageTab("integrations")}
                />
              </motion.div>
            )}

            {/* ── Delete tab ── */}
            {activePageTab === "delete" && (
              <motion.div
                key="delete"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                {loading ? (
                  <AliasesPageSkeleton />
                ) : integrations.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    <p className="text-xs font-schibsted text-neutral-400 mb-3">
                      Select an integration to delete it permanently.
                    </p>
                    <motion.div layout className="space-y-2">
                      <AnimatePresence mode="popLayout">
                        {integrations.map((i) => (
                          <IntegrationCard
                            key={i.id}
                            integration={i}
                            onDelete={handleDelete}
                            deleteMode
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
