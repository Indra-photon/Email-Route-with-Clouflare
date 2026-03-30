"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconMessageCircle, IconArrowRight, IconChevronDown, IconVideo } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionSkeleton } from "./SectionSkeleton";
import { useRefreshStore } from "./useRefresh";

function PanelCTAButton({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      className="relative flex items-center justify-start w-fit gap-5 overflow-hidden rounded-full bg-gradient-to-b from-sky-900 to-cyan-700 shadow-sm cursor-pointer px-7 py-2"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
        }}
        animate={hovered ? { backgroundPositionX: ["200%", "-200%"] } : { backgroundPositionX: "200%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <span className="relative z-10 font-schibsted font-semibold text-white text-[11px] uppercase tracking-wide select-none">
        {label}
      </span>
      <motion.span
        className="relative z-10 flex items-center"
        animate={{ x: hovered ? 2 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <IconArrowRight size={12} className="text-white/70" />
      </motion.span>
    </motion.div>
  );
}

const SECTION_KEY = "live-chats";

interface LiveChat {
  id:      string;
  visitor: string;
  widget:  string;
  message: string;
  status:  "active" | "missed" | "resolved";
  time:    string;
}

const STATUS_CONFIG: Record<"active" | "missed" | "resolved", { label: string; dot: string; text: string; pulse: boolean }> = {
  active:   { label: "Active",   dot: "bg-sky-400",     text: "text-sky-600",     pulse: true  },
  missed:   { label: "Missed",   dot: "bg-red-400",     text: "text-red-500",     pulse: false },
  resolved: { label: "Resolved", dot: "bg-neutral-300", text: "text-neutral-400", pulse: false },
};

async function fetchChats(): Promise<LiveChat[]> {
  const res = await fetch("/api/dashboard/live-chats");
  if (!res.ok) throw new Error("Failed to fetch live chats");
  return res.json();
}

export function LiveChatNotifications() {
  const [chats, setChats] = useState<LiveChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { refreshCount, setLoading } = useRefreshStore();

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoading(SECTION_KEY, true);

    fetchChats()
      .then((data) => {
        if (!cancelled) {
          setChats(data);
          setIsLoading(false);
          setLoading(SECTION_KEY, false);
        }
      })
      .catch((err) => {
        console.error("LiveChatNotifications fetch error:", err);
        if (!cancelled) {
          setIsLoading(false);
          setLoading(SECTION_KEY, false);
        }
      });

    return () => { cancelled = true; };
  }, [refreshCount]);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const activeCount = chats.filter((c) => c.status === "active").length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-7 py-3">
        <div className="flex items-center gap-2">
          <IconMessageCircle size={13} className="text-neutral-400" strokeWidth={2} />
          <span className="font-schibsted text-[11px] font-semibold tracking-[0.055em] uppercase text-neutral-400">
            Live Chats
          </span>
        </div>
        {!isLoading && activeCount > 0 && (
          <div className="flex items-center gap-1.5">
            {/* Pulsing live indicator */}
            <span className="relative flex size-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-1.5 bg-sky-500" />
            </span>
            <span className="font-schibsted text-[10px] font-semibold text-sky-600 tabular-nums">
              {activeCount} active
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <SectionSkeleton rows={3} />
      ) : (
        <ul>
          {chats.map((chat) => {
            const status = STATUS_CONFIG[chat.status];
            const isExpanded = expandedId === chat.id;

            return (
              <li
                key={chat.id}
                className="relative border-t border-neutral-100 first:border-t-0"
              >
                {/* Expanded tint — sky family, distinct from sky in RecentTickets */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      key="expanded-bg"
                      className="absolute inset-0 bg-sky-50/50 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>

                {/* ── Collapsed row ── */}
                <button
                  onClick={() => toggleExpand(chat.id)}
                  className="relative z-10 w-full px-7 py-3 flex items-start justify-between gap-3 text-left cursor-pointer group"
                >
                  {/* Left */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-schibsted text-[10px] font-medium text-neutral-500 bg-neutral-100 px-1.5 py-px rounded shrink-0">
                        {chat.widget}
                      </span>
                    </div>
                    <p className={`font-schibsted text-[13.5px] font-medium truncate leading-snug transition-colors duration-150 ${isExpanded ? "text-sky-900" : "text-neutral-700"}`}>
                      {chat.visitor}
                    </p>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0 pt-px">
                    <div className="flex items-center gap-1.5">
                      {/* Pulsing dot for active */}
                      {status.pulse ? (
                        <span className="relative flex size-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-60" />
                          <span className={`relative inline-flex rounded-full size-1.5 ${status.dot}`} />
                        </span>
                      ) : (
                        <span className={`size-1.5 rounded-full shrink-0 ${status.dot}`} />
                      )}
                      <span className={`font-schibsted text-[10px] font-medium ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-schibsted text-[10px] text-neutral-400 tabular-nums">
                        {chat.time}
                      </span>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="flex items-center"
                      >
                        <IconChevronDown size={11} strokeWidth={2.5} className={`transition-colors duration-150 ${isExpanded ? "text-sky-500" : "text-neutral-300"}`} />
                      </motion.span>
                    </div>
                  </div>
                </button>

                {/* ── Expanded panel ── */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="expanded-panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden relative z-10"
                    >
                      <div className="px-7 pb-4 space-y-3">
                        {/* Speech bubble — distinct from RecentTickets email card */}
                        <div className="relative">
                          {/* Bubble tail */}
                          <div className="absolute -top-1.5 left-4 size-3 bg-white border-l border-t border-sky-100 rotate-45" />
                          <div className="bg-white rounded-xl rounded-tl-sm border border-sky-100 px-3 py-2.5 shadow-[0_1px_4px_0_rgba(0,0,0,0.05)]">
                            <p className="font-schibsted text-[11.5px] text-neutral-600 leading-relaxed line-clamp-3">
                              {chat.message}
                            </p>
                          </div>
                        </div>

                        {/* Action */}
                        {chat.status === "active" ? (
                          <Link
                            href="/dashboard/live-chats"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 font-schibsted text-[11px] font-semibold text-sky-700 hover:text-sky-900 transition-colors duration-150"
                          >
                            <IconVideo size={11} strokeWidth={2} />
                            Join chat
                          </Link>
                        ) : (
                          <Link
                            href="/dashboard/live-chats"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 font-schibsted text-[11px] font-semibold text-neutral-500 hover:text-neutral-700 transition-colors duration-150"
                          >
                            <IconMessageCircle size={11} strokeWidth={2} />
                            View transcript
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      )}

      {/* Footer */}
      {!isLoading && (
        <div className="px-7 py-3 border-t border-neutral-100">
          <Link href="/dashboard/live-chats" className="block">
            <PanelCTAButton label="View all chats" />
          </Link>
        </div>
      )}
    </div>
  );
}
