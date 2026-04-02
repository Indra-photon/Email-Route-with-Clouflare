"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Card } from "@/components/ui/card";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";
import { AnimatedButton } from "@/components/dashboard/DomainsTable";
import { Palette } from "lucide-react";
import { IconCheck, IconX } from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Domain = {
  id: string;
  domain: string;
  botName?: string | null;
  botAvatar?: string | null;
  botDescription?: string | null;
};

type SaveState = "idle" | "loading" | "success" | "error";

// ─── Easing ───────────────────────────────────────────────────────────────────

const easeOutQuint = [0.23, 1, 0.32, 1] as const;
const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-10 w-48 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
      <div className="h-10 w-72 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
      <div className="h-32 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
    </div>
  );
}

// ─── Empty State (no domains) ─────────────────────────────────────────────────

function NoDomains() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15, ease: easeOutCubic }}
      className="flex flex-col items-center justify-center py-12 px-6 gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center opacity-40">
        <Palette className="size-4 text-white" />
      </div>
      <Paragraph variant="muted" className="text-center max-w-sm">
        No domains found. Add a domain first before customising the app.{" "}
        <a
          href="/dashboard/domains"
          className="text-sky-800 underline font-schibsted font-bold hover:text-sky-900 transition-colors"
        >
          Go to Domains
        </a>
      </Paragraph>
    </motion.div>
  );
}

// ─── Input class (shared) ─────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors focus:border-sky-600 outline-none disabled:opacity-50 disabled:cursor-not-allowed";

// ─── Root Export ──────────────────────────────────────────────────────────────

export default function CustomizeAppPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  // Form fields
  const [botName, setBotName] = useState("");
  const [botAvatar, setBotAvatar] = useState<string | null>(null);
  const [botDescription, setBotDescription] = useState("");

  const isBusy = saveState === "loading";

  // Load domains
  useEffect(() => {
    fetch("/api/domains")
      .then((r) => r.json())
      .then((data) => {
        setDomains(data);
        if (data.length > 0) setSelectedDomainId(data[0].id);
      })
      .catch(() => toast.error("Failed to load domains"))
      .finally(() => setLoading(false));
  }, []);

  // Load customisation when domain changes
  useEffect(() => {
    if (!selectedDomainId) {
      setBotName(""); setBotAvatar(null); setBotDescription("");
      return;
    }
    fetch(`/api/domains/update-customization?domainId=${selectedDomainId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setBotName(data?.domain?.botName || "");
        setBotAvatar(data?.domain?.botAvatar || null);
        setBotDescription(data?.domain?.botDescription || "");
      })
      .catch(() => {});
  }, [selectedDomainId]);

  const handleSave = async () => {
    if (!selectedDomainId) { toast.error("Please select a domain"); return; }
    setSaveState("loading");
    try {
      const res = await fetch("/api/domains/update-customization", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domainId: selectedDomainId,
          botName: botName.trim() || null,
          botAvatar: botAvatar || null,
          botDescription: botDescription.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSaveState("success");
      toast.success("Customisation saved!");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      toast.error("Failed to save customisation");
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 2000);
    }
  };

  const selectedDomain = domains.find((d) => d.id === selectedDomainId);
  const hasValues = !!(botName || botAvatar || botDescription);

  return (
    <div className="space-y-6 border border-neutral-400 rounded-lg p-4 min-h-screen">

      {/* Page Heading */}
      <div>
        <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
          Customize App
        </Heading>
        <Paragraph className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Customize how your Slack bot appears when posting email notifications to your channels.
        </Paragraph>
      </div>

      {/* Main Card */}
      <Card className="min-h-[300px] overflow-hidden">

        {/* Domain selector tab bar */}
        {!loading && domains.length > 0 && (
          <div className="flex items-center gap-1.5 pb-4 border-b border-neutral-100 dark:border-neutral-800 flex-wrap">
            {domains.map((domain) => (
              <button
                key={domain.id}
                type="button"
                onClick={() => setSelectedDomainId(domain.id)}
                disabled={isBusy}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-schibsted font-semibold transition-all duration-150 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedDomainId === domain.id
                    ? "text-white"
                    : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                {selectedDomainId === domain.id && (
                  <motion.span
                    layoutId="domain-tab-bg"
                    className="absolute inset-0 bg-gradient-to-r from-sky-800 to-cyan-700 rounded-lg z-0 shadow-sm"
                    transition={{ type: "spring", stiffness: 280, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{domain.domain}</span>
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="pt-4">
          <AnimatePresence mode="wait" initial={false}>

            {/* Loading */}
            {loading && (
              <motion.div key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <PageSkeleton />
              </motion.div>
            )}

            {/* No domains */}
            {!loading && domains.length === 0 && (
              <motion.div key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <NoDomains />
              </motion.div>
            )}

            {/* Form */}
            {!loading && selectedDomain && (
              <motion.div
                key={selectedDomainId}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
                className="max-w-2xl space-y-6"
              >

                {/* Bot Name */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400">
                    Bot Name
                  </label>
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    disabled={isBusy}
                    placeholder="e.g. Customer Support Bot"
                    className={inputClass}
                  />
                  <p className="text-xs font-schibsted text-neutral-400 dark:text-neutral-500">
                    The name shown when the bot posts messages to Slack.
                  </p>
                </div>

                {/* Bot Avatar */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400">
                    Bot Avatar
                  </label>
                  <ImageUploadField
                    value={botAvatar}
                    onChange={setBotAvatar}
                    disabled={isBusy}
                  />
                  <p className="text-xs font-schibsted text-neutral-400 dark:text-neutral-500">
                    The avatar image shown when the bot posts messages to Slack.
                  </p>
                </div>

                {/* Bot Description */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400">
                    Description
                  </label>
                  <textarea
                    value={botDescription}
                    onChange={(e) => setBotDescription(e.target.value)}
                    disabled={isBusy}
                    placeholder="e.g. Handles customer support emails for acme.com"
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                  <p className="text-xs font-schibsted text-neutral-400 dark:text-neutral-500">
                    Optional — for your reference only, not shown in Slack.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <AnimatedButton
                    idleLabel="Save Changes"
                    loadingLabel="Saving..."
                    successLabel="Saved!"
                    errorLabel="Failed"
                    idleIcon={<IconCheck size={13} />}
                    state={saveState}
                    onClick={handleSave}
                    idleWidth={120}
                    loadingWidth={100}
                    successWidth={90}
                    errorWidth={80}
                    className="px-4 py-2 rounded-md text-xs font-schibsted text-white bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center gap-1.5 overflow-hidden border-0 focus:outline-none cursor-pointer disabled:opacity-60"
                  />

                  <AnimatePresence>
                    {hasValues && (
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.15, ease: easeOutCubic }}
                        disabled={isBusy}
                        onClick={() => { setBotName(""); setBotAvatar(null); setBotDescription(""); }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-schibsted text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer focus:outline-none disabled:opacity-50"
                      >
                        <IconX size={12} /> Clear All
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}