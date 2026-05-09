"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  IconUsers,
  IconUserPlus,
  IconTrash,
  IconPlus,
  IconBook2,
  IconInfoCircle,
} from "@tabler/icons-react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { AnimatedSubmitButton } from "@/components/ui/AnimatedSubmitButton";
import { CustomLink } from "@/components/CustomLink";

// ─── Easing ───────────────────────────────────────────────────────────────────

const easeOutQuint = [0.23, 1, 0.32, 1] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type PageTab = "members" | "add";

const PAGE_TABS: { id: PageTab; label: string; icon: React.ReactNode }[] = [
  { id: "members", label: "Team Members", icon: <IconUsers size={13} /> },
  { id: "add", label: "Add Member", icon: <IconUserPlus size={13} /> },
];

// ─── Member Row ───────────────────────────────────────────────────────────────

function MemberRow({
  name,
  onRemove,
  removing,
}: {
  name: string;
  onRemove: (name: string) => void;
  removing: string | null;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15, ease: easeOutQuint }}
      className="group flex items-center justify-between px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-150"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-600 to-cyan-500 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-white font-schibsted">{initials}</span>
        </div>
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 font-schibsted">
          {name}
        </span>
      </div>
      <button
        onClick={() => onRemove(name)}
        disabled={removing === name}
        aria-label={`Remove member ${name}`}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-schibsted font-semibold border transition-all duration-150 focus:outline-none
          ${
            removing === name
              ? "opacity-50 cursor-not-allowed text-neutral-400 border-neutral-200"
              : "text-red-500 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer opacity-0 group-hover:opacity-100"
          }
        `}
      >
        {removing === name ? (
          <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <IconTrash size={12} />
        )}
        Remove
      </button>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MembersPage() {
  const [members, setMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePageTab, setActivePageTab] = useState<PageTab>("members");

  // Add form state
  const [input, setInput] = useState("");
  const [addStatus, setAddStatus] = useState<"idle" | "loading" | "success">(
    "idle"
  );

  // Remove state
  const [removing, setRemoving] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // ── Fetch members ────────────────────────────────────────────────────────────
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/workspace/members");
      if (!res.ok) throw new Error("Failed to load members");
      const data = await res.json();
      setMembers(data.members ?? []);
    } catch {
      toast.error("Could not load members. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ── Add member ───────────────────────────────────────────────────────────────
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || trimmed.length < 2) return;

    setAddStatus("loading");
    try {
      const res = await fetch("/api/workspace/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to add member");

      setMembers(data.members ?? []);

      setTimeout(() => {
        setAddStatus("success");
        toast.success(`"${data.added}" added successfully`);
        setInput("");

        setTimeout(() => {
          setAddStatus("idle");
          setActivePageTab("members");
        }, 1500);
      }, 500);
    } catch (err: any) {
      setAddStatus("idle");
      toast.error(err.message || "Network error. Please try again.");
    }
  };

  // ── Remove member ────────────────────────────────────────────────────────────
  const handleRemove = async (name: string) => {
    setRemoving(name);
    try {
      const res = await fetch("/api/workspace/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to remove member");
      setMembers(data.members ?? []);
      toast.success(`"${data.removed}" removed`);
    } catch (err: any) {
      toast.error(err.message || "Network error. Please try again.");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="space-y-6 border border-neutral-400 rounded-lg p-4 h-[calc(100dvh-56px-48px)]">
      {/* Page heading */}
      <div>
        <Heading variant="dashboardHeader" className="">
          Team Members
        </Heading>
        <Paragraph variant="dashboard-subHeading" className="">
          Add team members who can be assigned to tickets directly from Slack.
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
                    layoutId="members-page-tab-bg"
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
                  {tab.id === "members" && <IconUsers size={15} />}
                  {tab.id === "add" && <IconUserPlus size={15} />}
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-schibsted font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 focus:outline-none shrink-0">
            <CustomLink
              href="/docs/members"
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
            {/* ── Members tab ── */}
            {activePageTab === "members" && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
                className="space-y-5"
              >
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6 gap-3">
                    <div className="w-10 h-10 rounded-full border-4 border-sky-100 border-t-sky-600 animate-spin" />
                    <Paragraph variant="muted" className="text-center mt-2">
                      Loading members...
                    </Paragraph>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-3 p-4 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800">
                      <IconInfoCircle
                        size={17}
                        className="text-sky-500 shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-sky-800 dark:text-sky-200 leading-relaxed font-schibsted">
                        Members added here appear as options in an{" "}
                        <strong>Assign</strong> dropdown in Slack — right next to
                        the status selector. Assigning a member saves it to the
                        ticket record.
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                        <div className="flex items-center gap-2">
                          <IconUsers size={15} className="text-sky-500" />
                          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 font-schibsted">
                            Team Members
                          </span>
                          <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                            {members.length}
                          </span>
                        </div>
                      </div>

                      {members.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center opacity-40">
                            <IconUsers size={18} className="text-white" />
                          </div>
                          <Paragraph variant="muted" className="text-center">
                            No members yet. Switch to{" "}
                            <button
                              onClick={() => setActivePageTab("add")}
                              className="text-sky-700 underline font-schibsted font-bold cursor-pointer"
                            >
                              Add Member
                            </button>{" "}
                            to get started.
                          </Paragraph>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <AnimatePresence>
                            {members.map((name) => (
                              <MemberRow
                                key={name}
                                name={name}
                                onRemove={handleRemove}
                                removing={removing}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-neutral-400 text-center mt-8 font-schibsted">
                      {members.length} member{members.length !== 1 ? "s" : ""}{" "}
                      total · Max 50
                    </p>
                  </>
                )}
              </motion.div>
            )}

            {/* ── Add Member tab ── */}
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
                          Member Name
                        </label>
                        <input
                          ref={inputRef}
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="e.g. Aditya Singh"
                          maxLength={50}
                          required
                          disabled={addStatus !== "idle"}
                          className="w-64 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-transparent dark:bg-neutral-800 px-3 py-2 text-sm tracking-tighter font-schibsted text-neutral-800 dark:text-neutral-100 placeholder-neutral-500 transition-colors duration-100 focus:border-sky-800 dark:focus:border-neutral-400 outline-none focus:outline-none [box-shadow:none] focus:[box-shadow:none]"
                        />
                      </div>

                      <AnimatedSubmitButton
                        idleLabel="Add Member"
                        loadingLabel="Adding..."
                        successLabel="Added!"
                        idleIcon={<IconPlus size={16} strokeWidth={2.5} />}
                        state={addStatus}
                        idleWidth={125}
                        loadingWidth={125}
                        successWidth={90}
                        className="font-schibsted px-4 py-2 rounded-md bg-gradient-to-b from-sky-900 to-cyan-700 text-white border-0 focus:outline-none cursor-pointer flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    <p className="text-xs text-neutral-500 ml-1 font-schibsted max-w-md">
                      Enter the full name as you want it to appear in the Slack
                      assign dropdown. Max 50 characters.
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
