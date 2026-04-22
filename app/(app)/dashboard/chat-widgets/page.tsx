"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  IconPlus,
  IconMessageCircle,
  IconChevronDown,
  IconCopy,
  IconCheck,
  IconCode,
  IconPalette,
  IconTrash,
  IconTable,
  IconX,
} from "@tabler/icons-react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import AnimatedDropdown from "@/components/ui/AnimatedDropdown";
import { AnimatedSubmitButton } from "@/components/ui/AnimatedSubmitButton";
import { AnimatedDeleteButton } from "@/components/ui/AnimatedDeleteButton";
import { CopyIconButton } from "@/components/ui/CopyIconButton";
import { CustomLink } from "@/components/CustomLink";
import AliasesPageSkeleton from "@/components/dashboard/AliasesPageSkeleton";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Integration {
  id: string;
  type: "slack" | "discord";
  name: string;
}

interface Domain {
  id: string;
  domain: string;
  status: string;
  verifiedForSending?: boolean;
}

interface ChatWidget {
  id: string;
  activationKey: string;
  domain: string;
  integrationId: string;
  welcomeMessage: string;
  accentColor: string;
  status: "active" | "inactive";
  createdAt: string;
  embedScript?: string;
}

type PageTab = "widgets" | "create" | "delete";

// ─── Easing ───────────────────────────────────────────────────────────────────

const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;
const easeOutQuint = [0.23, 1, 0.32, 1] as const;

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = [
  "#0ea5e9",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

const PAGE_TABS: { id: PageTab; label: string }[] = [
  { id: "create", label: "Create Widget" },
  { id: "widgets", label: "Widgets" },
  { id: "delete", label: "Delete" },
];

// ─── New Key Banner ───────────────────────────────────────────────────────────

function NewKeyBanner({
  activationKey,
  script,
  onDismiss,
}: {
  activationKey: string;
  script: string;
  onDismiss: () => void;
}) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Auto-dismiss after 60 seconds
  useEffect(() => {
    const t = setTimeout(onDismiss, 60000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const handleCopy = (text: string, type: "key" | "script") => {
    navigator.clipboard.writeText(text);
    if (type === "key") {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
    toast.success("Copied!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: easeOutCubic }}
      className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 p-5 space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-schibsted font-semibold text-sm text-green-900 dark:text-green-300">
            Widget created — copy your embed script
          </p>
          <p className="text-xs font-schibsted text-green-700 dark:text-green-400 mt-0.5">
            Paste this before{" "}
            <code className="bg-green-100 dark:bg-green-900/30 px-1 rounded font-mono">{`</body>`}</code>{" "}
            on your website. This banner auto-dismisses in 60 seconds.
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="w-6 h-6 flex items-center justify-center rounded-md text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer focus:outline-none shrink-0"
        >
          <IconX size={14} />
        </button>
      </div>

      {/* Activation Key */}
      <div className="space-y-1.5">
        <p className="text-xs font-schibsted font-semibold text-green-800 dark:text-green-400">
          Activation Key
        </p>
        <div className="flex items-center gap-2 rounded-md border border-green-200 dark:border-green-800 bg-white dark:bg-neutral-900 px-3 py-2">
          <code className="flex-1 text-xs font-mono text-neutral-700 dark:text-neutral-300 truncate">
            {activationKey}
          </code>
          <button
            type="button"
            onClick={() => handleCopy(activationKey, "key")}
            className="shrink-0 text-green-600 hover:text-green-800 transition-colors cursor-pointer focus:outline-none"
          >
            {copiedKey ? <IconCheck size={14} /> : <IconCopy size={14} />}
          </button>
        </div>
      </div>

      {/* Embed Script */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-schibsted font-semibold text-green-800 dark:text-green-400">
            Embed Script
          </p>
          <button
            type="button"
            onClick={() => handleCopy(script, "script")}
            className="flex items-center gap-1 text-xs font-schibsted text-green-700 hover:text-green-900 dark:hover:text-green-300 transition-colors cursor-pointer focus:outline-none"
          >
            {copiedScript ? <IconCheck size={12} /> : <IconCode size={12} />}
            {copiedScript ? "Copied!" : "Copy script"}
          </button>
        </div>
        <pre className="rounded-md border border-green-200 dark:border-green-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs font-mono text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap overflow-auto max-h-28">
          {script}
        </pre>
      </div>
    </motion.div>
  );
}

// ─── Widget Card ──────────────────────────────────────────────────────────────

function WidgetCard({
  widget,
  onDelete,
  deleteMode,
}: {
  widget: ChatWidget;
  onDelete: (id: string) => void;
  deleteMode?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = widget.status === "active";

  const script =
    widget.embedScript ||
    `<script>window.CHAT_KEY = '${widget.activationKey}';</script>\n<script async src="${process.env.NEXT_PUBLIC_BASE_URL || ""}/chat/widget.js"></script>`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: -2 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -2 }}
      transition={{ duration: 0.15, ease: easeOutCubic }}
      style={{ transformOrigin: "top left" }}
    >
      <Card className="bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors duration-300 ease-out">
        <CardContent className="p-4 flex items-center gap-4">
          {/* Icon with accent color dot */}
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center">
              <IconMessageCircle size={15} className="text-white" />
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
              style={{ background: widget.accentColor }}
            />
          </div>

          {/* Domain + status */}
          <button
            type="button"
            onClick={() => !deleteMode && setIsOpen((o) => !o)}
            className={`flex-1 min-w-0 text-left focus:outline-none ${deleteMode ? "cursor-default" : "cursor-pointer"}`}
          >
            <p className="font-schibsted font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
              {widget.domain}
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              <Badge
                className={`border-0 font-schibsted tracking-tight rounded-sm ${
                  isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
              <span className="text-xs font-schibsted text-neutral-500 truncate">
                {widget.welcomeMessage}
              </span>
            </div>
          </button>

          {/* Chevron — hidden in delete mode */}
          {!deleteMode && (
            <button
              type="button"
              onClick={() => setIsOpen((o) => !o)}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
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
              try {
                const res = await fetch(`/api/chat/widgets/${widget.id}`, {
                  method: "DELETE",
                });
                if (!res.ok) throw new Error("Failed to delete");
                toast.success("Widget deleted");
                setTimeout(() => onDelete(widget.id), 400);
                return "success";
              } catch (err: any) {
                toast.error(err.message || "Failed to delete widget");
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
            <div className="px-4 pb-4 pt-1 border-t border-neutral-200 dark:border-neutral-800 mt-1 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                    Domain
                  </p>
                  <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">
                    {widget.domain}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                    Status
                  </p>
                  <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100 capitalize">
                    {widget.status}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                    Welcome Message
                  </p>
                  <p className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300">
                    {widget.welcomeMessage}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                    Accent Color
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-neutral-200"
                      style={{ background: widget.accentColor }}
                    />
                    <p className="text-sm font-schibsted font-mono text-neutral-700 dark:text-neutral-300">
                      {widget.accentColor}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                    Created
                  </p>
                  <p className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300 tabular-nums">
                    {new Date(widget.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Activation Key */}
              <div className="space-y-1.5">
                <p className="text-xs font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">
                  Activation Key
                </p>
                <div className="flex items-center gap-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 px-3 py-2">
                  <code className="flex-1 text-xs font-mono text-neutral-700 dark:text-neutral-300 truncate">
                    {widget.activationKey}
                  </code>
                  <CopyIconButton value={widget.activationKey} />
                </div>
              </div>

              {/* Embed Script */}
              <div className="space-y-1.5">
                <p className="text-xs font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">
                  Embed Script
                </p>
                <div className="flex items-between justify-between rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 px-3 py-2 text-xs font-mono text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap overflow-auto max-h-28">
                  {script}
                  <CopyIconButton value={script} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}

// ─── Add Widget Form ──────────────────────────────────────────────────────────

type FormStatus = "idle" | "loading" | "success";

function WidgetAddForm({
  domains,
  integrations,
  onWidgetAdded,
}: {
  domains: Domain[];
  integrations: Integration[];
  onWidgetAdded: (widget: ChatWidget) => void;
}) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [selectedDomain, setSelectedDomain] = useState(
    domains[0]?.domain ?? "",
  );
  const [selectedIntegrationId, setSelectedIntegrationId] = useState(
    integrations[0]?.id ?? "",
  );
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Hi! How can we help you today? 👋",
  );
  const [accentColor, setAccentColor] = useState("#0ea5e9");

  useEffect(() => {
    if (!selectedDomain && domains.length > 0)
      setSelectedDomain(domains[0].domain);
  }, [domains, selectedDomain]);

  useEffect(() => {
    if (!selectedIntegrationId && integrations.length > 0)
      setSelectedIntegrationId(integrations[0].id);
  }, [integrations, selectedIntegrationId]);

  const isBusy = status !== "idle";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDomain || !selectedIntegrationId || isBusy) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/chat/widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: selectedDomain,
          integrationId: selectedIntegrationId,
          welcomeMessage: welcomeMessage.trim(),
          accentColor,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create widget");
      }
      const created: ChatWidget = await res.json();
      setTimeout(() => {
        setStatus("success");
        toast.success(`Widget for ${created.domain} created`);
        onWidgetAdded(created);
        setTimeout(() => setStatus("idle"), 100);
      }, 1000);
    } catch (err) {
      setStatus("idle");
      toast.error(
        err instanceof Error ? err.message : "Failed to create widget",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        <AnimatedDropdown
          label="Domain"
          options={domains.map((d) => ({ value: d.domain, label: d.domain }))}
          value={selectedDomain}
          onChange={setSelectedDomain}
          placeholder="No verified domains"
          disabled={isBusy || domains.length === 0}
          width="w-52"
        />
        <AnimatedDropdown
          label="Integration"
          options={integrations.map((i) => ({
            value: i.id,
            label: `${i.name} (${i.type})`,
          }))}
          value={selectedIntegrationId}
          onChange={setSelectedIntegrationId}
          placeholder="No integrations"
          disabled={isBusy || integrations.length === 0}
          width="w-52"
        />
        <div className="flex flex-col space-y-1">
          <label className="block text-lg font-schibsted font-regular text-neutral-700 dark:text-neutral-300 mb-1">
            Welcome Message
          </label>
          <input
            type="text"
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            placeholder="Hi! How can we help?"
            disabled={isBusy}
            className="w-64 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors focus:border-sky-800 outline-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="block text-lg font-schibsted font-regular text-neutral-700 dark:text-neutral-300 mb-1">
            Your Brand Color
          </label>
          <div className="flex items-center gap-1.5 h-[38px]">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                disabled={isBusy}
                onClick={() => setAccentColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-150 focus:outline-none cursor-pointer disabled:opacity-50 ${
                  accentColor === c
                    ? "border-neutral-800 dark:border-neutral-200 scale-110"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ background: c }}
              />
            ))}
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              disabled={isBusy}
              className="w-6 h-6 rounded-full border border-neutral-300 cursor-pointer disabled:opacity-50"
              title="Custom color"
            />
          </div>
        </div>
        <AnimatedSubmitButton
          idleLabel="Create Widget"
          loadingLabel="Creating..."
          successLabel="Created!"
          idleIcon={<IconPlus size={16} strokeWidth={2.5} />}
          state={status}
          idleWidth={130}
          loadingWidth={120}
          successWidth={110}
          disabled={isBusy || domains.length === 0 || integrations.length === 0}
          className="font-schibsted px-4 py-2 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 text-white border-0 focus:outline-none cursor-pointer flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <CustomLink
          href="/docs/chatbot"
          className="text-sm font-schibsted text-sky-700 hover:text-sky-900 dark:text-sky-400 transition-colors underline pb-2"
        >
          Read our docs
        </CustomLink>
      </div>
    </form>
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
        <IconMessageCircle size={18} className="text-white" />
      </div>
      <Paragraph variant="muted" className="text-center max-w-lg">
        No chat widgets yet. Go to Create Widget to add one.
      </Paragraph>
    </motion.div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export default function ChatWidgetsDashboard() {
  const [widgets, setWidgets] = useState<ChatWidget[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePageTab, setActivePageTab] = useState<PageTab>("create");
  const [newKey, setNewKey] = useState<{ key: string; script: string } | null>(
    null,
  );

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [wRes, iRes, dRes] = await Promise.all([
        fetch("/api/chat/widgets"),
        fetch("/api/integrations"),
        fetch("/api/domains"),
      ]);
      if (wRes.ok) setWidgets(await wRes.json());
      if (iRes.ok) setIntegrations(await iRes.json());
      if (dRes.ok) {
        const allDomains = await dRes.json();
        setDomains(
          allDomains.filter(
            (d: Domain) =>
              d.verifiedForSending ||
              d.status === "verified" ||
              d.status === "active",
          ),
        );
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Dismiss banner when switching away from create tab
  useEffect(() => {
    if (activePageTab !== "create") setNewKey(null);
  }, [activePageTab]);

  const handleDelete = (id: string) =>
    setWidgets((prev) => prev.filter((w) => w.id !== id));

  const handleWidgetAdded = (widget: ChatWidget) => {
    setWidgets((prev) => [widget, ...prev]);
    setActivePageTab("widgets");
    if (widget.activationKey) {
      const script =
        widget.embedScript ||
        `<script>window.CHAT_KEY = '${widget.activationKey}';</script>\n<script async src="${process.env.NEXT_PUBLIC_BASE_URL || ""}/chat/widget.js"></script>`;
      setNewKey({ key: widget.activationKey, script });
    }
  };

  return (
    <div className="space-y-6 border border-neutral-400 rounded-lg p-4 h-[calc(100dvh-56px-48px)]">
      {/* Page heading */}
      <div>
        <Heading
          variant="muted"
          className="font-bold text-neutral-900 dark:text-neutral-100"
        >
          Chat Widgets
        </Heading>
        <Paragraph
          variant="default"
          className="text-neutral-600 dark:text-neutral-400 mt-1"
        >
          Create embeddable live chat widgets for your verified domains. Each
          widget routes conversations to a Slack or Discord integration.
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
                  layoutId="widgets-tab-bg"
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
                {tab.id === "widgets" && <IconTable size={15} />}
                {tab.id === "create" && <IconPlus size={15} />}
                {tab.id === "delete" && <IconTrash size={15} />}
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="pt-4">
          <AnimatePresence mode="wait" initial={false}>
            {/* ── Widgets tab ── */}
            {activePageTab === "widgets" && (
              <motion.div
                key="widgets"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                {loading ? (
                  <AliasesPageSkeleton />
                ) : widgets.length === 0 ? (
                  <EmptyState />
                ) : (
                  <motion.div layout className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {widgets.map((w) => (
                        <WidgetCard
                          key={w.id}
                          widget={w}
                          onDelete={handleDelete}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── Create tab ── */}
            {activePageTab === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
                className="space-y-4"
              >
                <WidgetAddForm
                  domains={domains}
                  integrations={integrations}
                  onWidgetAdded={handleWidgetAdded}
                />

                {/* New key banner appears inline after creation */}
                <AnimatePresence>
                  {newKey && (
                    <NewKeyBanner
                      activationKey={newKey.key}
                      script={newKey.script}
                      onDismiss={() => setNewKey(null)}
                    />
                  )}
                </AnimatePresence>
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
                ) : widgets.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    <p className="text-xs font-schibsted text-neutral-400 mb-3">
                      Select a widget to delete it permanently.
                    </p>
                    <motion.div layout className="space-y-2">
                      <AnimatePresence mode="popLayout">
                        {widgets.map((w) => (
                          <WidgetCard
                            key={w.id}
                            widget={w}
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
