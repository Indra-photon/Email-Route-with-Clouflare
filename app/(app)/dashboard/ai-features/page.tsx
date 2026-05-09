"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  IconSparkles,
  IconTag,
  IconTrash,
  IconPlus,
  IconRefresh,
  IconInfoCircle,
  IconBook2,
} from "@tabler/icons-react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { AnimatedSubmitButton } from "@/components/ui/AnimatedSubmitButton";
import { CustomLink } from "@/components/CustomLink";

const DEFAULT_TAGS = [
  "pricing-issue",
  "login-issue",
  "product-issue",
  "subscription-issue",
  "bug-report",
  "feature-request",
  "billing-inquiry",
  "account-access",
];

// ─── Easing ───────────────────────────────────────────────────────────────────

const easeOutQuint = [0.23, 1, 0.32, 1] as const;
const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type PageTab = "tags" | "add";

const PAGE_TABS: { id: PageTab; label: string; icon: React.ReactNode }[] = [
  { id: "tags", label: "AI Tags", icon: <IconTag size={13} /> },
  { id: "add", label: "Add Tag", icon: <IconPlus size={13} /> },
];

// ─── Tag pill ─────────────────────────────────────────────────────────────────
function TagPill({
  tag,
  isDefault,
  onRemove,
  removing,
}: {
  tag: string;
  isDefault: boolean;
  onRemove: (tag: string) => void;
  removing: string | null;
}) {
  return (
    <div
      className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-150
        ${
          isDefault
            ? "bg-sky-50 border-sky-200 text-sky-700"
            : "bg-violet-50 border-violet-200 text-violet-700"
        }
      `}
    >
      <span className="leading-none">{tag}</span>
      <button
        onClick={() => onRemove(tag)}
        disabled={removing === tag}
        aria-label={`Remove tag ${tag}`}
        className={`flex items-center justify-center w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150
          ${
            isDefault
              ? "hover:bg-sky-200 text-sky-500"
              : "hover:bg-violet-200 text-violet-500"
          }
          ${
            removing === tag
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }
        `}
      >
        {removing === tag ? (
          <span className="w-2.5 h-2.5 border border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <IconTrash size={11} />
        )}
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AiFeaturesPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePageTab, setActivePageTab] = useState<PageTab>("tags");

  // Add form state
  const [input, setInput] = useState("");
  const [addStatus, setAddStatus] = useState<"idle" | "loading" | "success">(
    "idle",
  );
  
  // Remove state
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // ── Fetch tags ──────────────────────────────────────────────────────────────
  const fetchTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/workspace/ai-tags");
      if (!res.ok) throw new Error("Failed to load tags");
      const data = await res.json();
      setTags(data.tags ?? []);
    } catch {
      toast.error("Could not load tags. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // ── Add tag ─────────────────────────────────────────────────────────────────
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim().toLowerCase().replace(/\s+/g, "-");
    if (!trimmed || trimmed.length < 2) return;
    
    setAddStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/workspace/ai-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to add tag");
      }
      
      setTags(data.tags ?? []);
      
      setTimeout(() => {
        setAddStatus("success");
        toast.success(`"${data.added}" added successfully`);
        setInput("");
        
        setTimeout(() => {
          setAddStatus("idle");
          setActivePageTab("tags");
        }, 1500);
      }, 500);
    } catch (err: any) {
      setAddStatus("idle");
      toast.error(err.message || "Network error. Please try again.");
    }
  };

  // ── Remove tag ──────────────────────────────────────────────────────────────
  const handleRemove = async (tag: string) => {
    setRemoving(tag);
    try {
      const res = await fetch("/api/workspace/ai-tags", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to remove tag");
      }
      setTags(data.tags ?? []);
      toast.success(`"${data.removed}" removed`);
    } catch (err: any) {
      toast.error(err.message || "Network error. Please try again.");
    } finally {
      setRemoving(null);
    }
  };

  const defaultTags = tags.filter((t) => DEFAULT_TAGS.includes(t));
  const customTags = tags.filter((t) => !DEFAULT_TAGS.includes(t));

  return (
    <div className="space-y-6 border border-neutral-400 rounded-lg p-4 h-[calc(100dvh-56px-48px)]">
      {/* Page heading */}
      <div>
        <Heading variant="dashboardHeader" className="">
          AI Features & Tagging
        </Heading>
        <Paragraph variant="dashboard-subHeading" className="">
          Manage tags the AI uses to classify incoming emails automatically.
        </Paragraph>
      </div>

      {/* Main tabbed card */}
      <Card className="min-h-[300px] overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center justify-between pb-4 pt-4 border-t border-b border-neutral-500 dark:border-neutral-800 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {PAGE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePageTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-schibsted font-semibold tracking-tighter transition-all duration-150 focus:outline-none cursor-pointer ${
                  activePageTab === tab.id
                    ? "text-white"
                    : "text-neutral-800 tracking-tighter dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                {activePageTab === tab.id && (
                  <motion.span
                    layoutId="ai-features-page-tab-bg"
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
                  {tab.id === "tags" && <IconTag size={15} />}
                  {tab.id === "add" && <IconPlus size={15} />}
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-schibsted font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 focus:outline-none shrink-0">
            <CustomLink
              href="/docs/ai-tagging"
              className="text-sm text-neutral-700 hover:text-sky-900 transition-colors underline"
            >
              <IconBook2 size={14} />
              <span>Read our Docs</span>
            </CustomLink>
          </div>
        </div>

        {/* Tab content */}
        <div className="pt-4">
          <AnimatePresence mode="wait" initial={false}>
            {/* ── AI Tags tab ── */}
            {activePageTab === "tags" && (
              <motion.div
                key="tags"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
                className="space-y-6"
              >
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6 gap-3">
                    <div className="w-10 h-10 rounded-full border-4 border-sky-100 border-t-sky-600 animate-spin" />
                    <Paragraph variant="muted" className="text-center mt-2">
                      Loading tags...
                    </Paragraph>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-3 p-4 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800">
                      <IconInfoCircle size={17} className="text-sky-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-sky-800 dark:text-sky-200 leading-relaxed font-schibsted">
                        Every new inbound email is automatically classified by AI using these tags.
                        The AI picks the <strong>single most relevant tag</strong> and attaches it to
                        the ticket — visible in Slack and the dashboard.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Default tags */}
                      <div>
                        <div className="flex items-center justify-between mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                          <div className="flex items-center gap-2">
                            <IconTag size={15} className="text-sky-500" />
                            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 font-schibsted">Default Tags</span>
                            <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                              {defaultTags.length}
                            </span>
                          </div>
                          <button
                            onClick={fetchTags}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
                            aria-label="Refresh tags"
                          >
                            <IconRefresh size={14} />
                          </button>
                        </div>
                        {defaultTags.length === 0 ? (
                          <p className="text-xs text-neutral-400 italic font-schibsted">All default tags have been removed.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {defaultTags.map((tag) => (
                              <TagPill
                                key={tag}
                                tag={tag}
                                isDefault
                                onRemove={handleRemove}
                                removing={removing}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Custom tags */}
                      <div>
                        <div className="flex items-center gap-2 mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                          <IconSparkles size={15} className="text-violet-500" />
                          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 font-schibsted">Custom Tags</span>
                          <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                            {customTags.length}
                          </span>
                        </div>
                        {customTags.length === 0 ? (
                          <p className="text-xs text-neutral-400 italic font-schibsted">
                            No custom tags yet. Switch to the Add Tag tab to extend AI classification.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {customTags.map((tag) => (
                              <TagPill
                                key={tag}
                                tag={tag}
                                isDefault={false}
                                onRemove={handleRemove}
                                removing={removing}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-neutral-400 text-center mt-8 font-schibsted">
                      {tags.length} tag{tags.length !== 1 ? "s" : ""} total · Max 20 tags recommended
                    </p>
                  </>
                )}
              </motion.div>
            )}

            {/* ── Add Tag tab ── */}
            {activePageTab === "add" && (
              <motion.div
                key="add"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                <form onSubmit={handleAddSubmit} className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-3 items-end">
                      <div className="flex flex-col space-y-1">
                        <label className="text-sm font-schibsted text-neutral-800 ml-1 tracking-tighter dark:text-neutral-400">
                          Custom Tag Name
                        </label>
                        <input
                          ref={inputRef}
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="e.g. priority-request"
                          maxLength={40}
                          required
                          disabled={addStatus !== "idle"}
                          className="w-64 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-transparent dark:bg-neutral-800 px-3 py-2 text-sm tracking-tighter font-schibsted text-neutral-800 dark:text-neutral-100 placeholder-neutral-500 transition-colors duration-100 focus:border-sky-800 dark:focus:border-neutral-400 outline-none focus:outline-none [box-shadow:none] focus:[box-shadow:none]"
                        />
                      </div>
                      
                      <AnimatedSubmitButton
                        idleLabel="Add Tag"
                        loadingLabel="Adding..."
                        successLabel="Added!"
                        idleIcon={<IconPlus size={16} strokeWidth={2.5} />}
                        state={addStatus}
                        idleWidth={110}
                        loadingWidth={110}
                        successWidth={90}
                        className="font-schibsted px-4 py-2 rounded-md bg-gradient-to-b from-sky-900 to-cyan-700 text-white border-0 focus:outline-none cursor-pointer flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                    
                    <p className="text-xs text-neutral-500 ml-1 font-schibsted max-w-md">
                      Spaces are auto-converted to hyphens. Tags help the AI categorize tickets to speed up triage.
                    </p>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
