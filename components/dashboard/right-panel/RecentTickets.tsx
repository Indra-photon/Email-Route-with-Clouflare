"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconMail, IconArrowRight, IconChevronDown, IconExternalLink } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionSkeleton } from "./SectionSkeleton";
import { useRefreshStore } from "./useRefresh";
import { useAuth } from "@clerk/nextjs";

const SECTION_KEY = "recent-tickets";

interface RecentTicket {
  id:      string;
  from:    string;
  subject: string;
  alias:   string;
  status:  "open" | "in_progress" | "waiting" | "resolved";
  time:    string;
  preview: string;
}

const STATUS_CONFIG: Record<"open" | "in_progress" | "waiting" | "resolved", { label: string; dot: string; text: string }> = {
  open:        { label: "Open",        dot: "bg-sky-400",   text: "text-sky-600" },
  in_progress: { label: "In Progress", dot: "bg-amber-400", text: "text-amber-600" },
  waiting:     { label: "Waiting",     dot: "bg-amber-900", text: "text-amber-900" },
  resolved:    { label: "Resolved",    dot: "bg-green-400", text: "text-green-600" },
};

function TicketsCTAButton() {
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
        View all tickets
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

async function fetchTickets(): Promise<RecentTicket[]> {
  const res = await fetch("/api/dashboard/recent-tickets");
  if (!res.ok) throw new Error("Failed to fetch recent tickets");
  return res.json();
}

export function RecentTickets() {
  const [tickets, setTickets] = useState<RecentTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { refreshCount, setLoading } = useRefreshStore();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    // Wait for Clerk to finish hydrating before fetching
    if (!isLoaded || !isSignedIn) return;

    let cancelled = false;
    setIsLoading(true);
    setLoading(SECTION_KEY, true);

    fetchTickets()
      .then((data) => {
        if (!cancelled) {
          setTickets(data);
          setIsLoading(false);
          setLoading(SECTION_KEY, false);
        }
      })
      .catch((err) => {
        console.error("RecentTickets fetch error:", err);
        if (!cancelled) {
          setIsLoading(false);
          setLoading(SECTION_KEY, false);
        }
      });

    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn, refreshCount]);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-7 py-3">
        <div className="flex items-center gap-2">
          <IconMail size={13} className="text-neutral-400" strokeWidth={2} />
          <span className="font-schibsted text-[11px] font-semibold tracking-[0.055em] uppercase text-neutral-400">
            Recent Tickets
          </span>
        </div>
        {!isLoading && (
          <span className="font-schibsted text-[10px] font-semibold tabular-nums text-neutral-400">
            {tickets.length}
          </span>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <SectionSkeleton rows={4} />
      ) : (
        <ul onMouseLeave={() => setHoveredId(null)}>
          {tickets.map((ticket) => {
            const status = STATUS_CONFIG[ticket.status];
            const isExpanded = expandedId === ticket.id;

            return (
              <li
                key={ticket.id}
                onMouseEnter={() => setHoveredId(ticket.id)}
                className="relative border-t border-neutral-100 first:border-t-0"
              >
                {/* Shared hover background */}
                <AnimatePresence>
                  {hoveredId === ticket.id && !isExpanded && (
                    <motion.div
                      layoutId="ticket-hover-bg"
                      className="absolute inset-0 bg-neutral-50 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    />
                  )}
                </AnimatePresence>

                {/* Expanded background — stays while open */}
                {isExpanded && (
                  <div className="absolute inset-0 pointer-events-none" />
                )}

                {/* ── Collapsed row (always visible) ── */}
                <button
                  onClick={() => toggleExpand(ticket.id)}
                  className="relative z-10 w-full px-7 py-3 flex items-start justify-between gap-3 text-left cursor-pointer"
                >
                  {/* Left */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-schibsted bg-sky-900 text-[10px] font-medium text-neutral-50 px-1.5 py-px rounded shrink-0">
                        {ticket.alias}
                      </span>
                    </div>
                    <p className={`font-schibsted text-[13.5px] font-medium truncate leading-snug transition-colors duration-150 ${isExpanded ? "text-sky-900" : "text-neutral-700"}`}>
                      {ticket.subject}
                    </p>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0 pt-px">
                    <div className="flex items-center gap-1.5">
                      <span className={`size-1.5 rounded-full shrink-0 ${status.dot}`} />
                      <span className={`font-schibsted text-[10px] font-medium ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-schibsted text-[10px] text-neutral-400 tabular-nums">
                        {ticket.time}
                      </span>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="flex items-center"
                      >
                        <IconChevronDown size={11} strokeWidth={2.5} className={`transition-colors duration-150 ${isExpanded ? "text-sky-600" : "text-neutral-300"}`} />
                      </motion.span>
                    </div>
                  </div>
                </button>

                {/* ── Expanded panel ── */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="expanded"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden relative z-10"
                    >
                      <div className="px-7 pb-4 space-y-3">
                        {/* From line */}
                        <div className="flex items-center gap-2">
                          <span className="font-schibsted text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                            From
                          </span>
                          <span className="font-schibsted text-[11px] text-neutral-900 truncate">
                            {ticket.from}
                          </span>
                        </div>

                        {/* Email preview body */}
                        <div className="bg-neutral-50 rounded-lg px-3 py-2.5">
                          <span className="font-schibsted text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                            Ticket:
                          </span>
                          <p className="font-schibsted text-[11.5px] text-neutral-800 leading-relaxed line-clamp-4">
                            {ticket.preview}
                          </p>
                        </div>

                        {/* Action */}
                        <Link
                          href={`/dashboard/tickets/mine`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 font-schibsted text-[11px] font-semibold text-sky-700 hover:text-sky-900 transition-colors duration-150"
                        >
                          <IconExternalLink size={11} strokeWidth={2} />
                          Open ticket
                        </Link>
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
          <Link href="/dashboard/tickets/mine" className="block">
            <TicketsCTAButton />
          </Link>
        </div>
      )}
    </div>
  );
}
