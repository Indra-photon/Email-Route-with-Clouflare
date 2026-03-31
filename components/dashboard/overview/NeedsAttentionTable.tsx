"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconAlertTriangle,
  IconClock,
  IconUserOff,
  IconHourglass,
  IconMail,
  IconArrowRight,
} from "@tabler/icons-react";
import Link from "next/link";
import type { FilterState } from "./FilterBar";
import AnimatedDropdown from "@/components/ui/AnimatedDropdown";
import type { DomainOption, AliasOption } from "./FilterBar";

// ── Easing ────────────────────────────────────────────────────────────────────

const EASE_SETTLE = [0.16, 1, 0.3, 1] as const;

// ── Types ─────────────────────────────────────────────────────────────────────

type UrgencyReason = "no_response" | "agent_inactive" | "waiting_too_long";

interface AttentionTicket {
  id:             string;
  fromName:       string;
  fromEmail:      string;
  subject:        string;
  alias:          string;       // e.g. "support@"
  status:         "open" | "in_progress" | "waiting";
  assignedTo:     string | null;
  reason:         UrgencyReason;
  stuckFor:       string;       // e.g. "3h 20m"
  receivedAt:     string;       // e.g. "Today, 9:14 AM"
}

// ── Reason config ─────────────────────────────────────────────────────────────

const REASON_CONFIG: Record<UrgencyReason, {
  label: string;
  icon:  React.ElementType;
  color: string;
  bg:    string;
}> = {
  no_response: {
    label: "No response > 2h",
    icon:  IconClock,
    color: "text-red-600",
    bg:    "bg-red-50 border-red-200",
  },
  agent_inactive: {
    label: "Assigned, no activity > 24h",
    icon:  IconUserOff,
    color: "text-amber-600",
    bg:    "bg-amber-50 border-amber-200",
  },
  waiting_too_long: {
    label: "Waiting > 3 days",
    icon:  IconHourglass,
    color: "text-orange-600",
    bg:    "bg-orange-50 border-orange-200",
  },
};

const STATUS_CONFIG = {
  open:        { label: "Open",        classes: "bg-sky-50 text-sky-800 border border-sky-200"     },
  in_progress: { label: "In Progress", classes: "bg-amber-50 text-amber-700 border border-amber-200" },
  waiting:     { label: "Waiting",     classes: "bg-neutral-100 text-neutral-600 border border-neutral-200" },
};

// ── Real API fetch ────────────────────────────────────────────────────────────

async function fetchAttentionTickets(
  filters: FilterState
): Promise<AttentionTicket[]> {
  const params = new URLSearchParams({
    domainId: filters.domainId,
    aliasId:  filters.aliasId,
    range:    filters.range,
  });
  const res = await fetch(`/api/dashboard/needs-attention?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch attention tickets");
  return res.json();
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="size-7 rounded-full bg-sky-900 text-white flex items-center justify-center text-[10px] font-schibsted font-bold shrink-0">
      {initials}
    </div>
  );
}

// ── Skeleton row ──────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-neutral-100">
      {[40, 60, 20, 25, 20, 15, 20].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div
            className="h-3 bg-neutral-100 animate-pulse rounded"
            style={{ width: `${w}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <tr>
      <td colSpan={7} className="px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <IconMail size={20} className="text-emerald-500" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-schibsted font-semibold text-neutral-700">
            All caught up!
          </p>
          <p className="text-xs font-schibsted text-neutral-400">
            No tickets need attention right now
          </p>
        </div>
      </td>
    </tr>
  );
}

// ── Summary pills ─────────────────────────────────────────────────────────────

function SummaryPills({ tickets }: { tickets: AttentionTicket[] }) {
  const noResponse    = tickets.filter((t) => t.reason === "no_response").length;
  const agentInactive = tickets.filter((t) => t.reason === "agent_inactive").length;
  const waitingLong   = tickets.filter((t) => t.reason === "waiting_too_long").length;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="flex items-center gap-1.5 text-xs font-schibsted font-medium bg-red-50 text-red-600 border border-red-200 rounded-full px-2.5 py-1">
        <IconClock size={11} strokeWidth={2.5} />
        {noResponse} unresponded &gt;2h
      </span>
      <span className="flex items-center gap-1.5 text-xs font-schibsted font-medium bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2.5 py-1">
        <IconUserOff size={11} strokeWidth={2.5} />
        {agentInactive} agent inactive &gt;24h
      </span>
      <span className="flex items-center gap-1.5 text-xs font-schibsted font-medium bg-orange-50 text-orange-600 border border-orange-200 rounded-full px-2.5 py-1">
        <IconHourglass size={11} strokeWidth={2.5} />
        {waitingLong} waiting &gt;3 days
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function NeedsAttentionTable() {
  const [filters, setFilters] = useState<FilterState>({
    domainId: "all",
    aliasId:  "all",
    range:    "7d",
  });
  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [aliases, setAliases] = useState<AliasOption[]>([]);
  const [tickets, setTickets]   = useState<AttentionTicket[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [tableKey, setTableKey] = useState(0);

  // fetch domains + aliases once
  useEffect(() => {
    Promise.all([fetch("/api/domains"), fetch("/api/aliases")])
      .then(async ([dr, ar]) => {
        if (dr.ok) {
          const d = await dr.json();
          setDomains(d.map((x: any) => ({ id: x.id, label: x.domain })));
        }
        if (ar.ok) {
          const a = await ar.json();
          setAliases(a.map((x: any) => ({ id: x.id, label: x.email, domainId: x.domainId ?? "unknown" })));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchAttentionTickets(filters)
      .then((data) => {
        if (!cancelled) {
          setTickets(data);
          setTableKey((k) => k + 1);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("NeedsAttentionTable fetch error:", err);
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [filters.domainId, filters.aliasId, filters.range]);

  return (
    <div className="bg-white rounded-4xl border border-neutral-200 flex flex-col">

      {/* Header */}
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-neutral-100 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-red-50 flex items-center justify-center">
            <IconAlertTriangle size={16} className="text-red-500" strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-schibsted text-[18.5px] font-semibold uppercase tracking-[0.07em] text-neutral-700">
              Needs Attention
            </h3>
            <p className="text-xs font-schibsted text-neutral-700 tracking-tighter mt-0.5">
              Tickets that are stuck or overdue
            </p>
          </div>
        </div>

        {/* Right side — pills + filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {!isLoading && tickets.length > 0 && (
            <SummaryPills tickets={tickets} />
          )}
          <div className="flex items-center gap-2">
            <AnimatedDropdown
              options={[{ value: "all", label: "All Domains" }, ...domains.map((d) => ({ value: d.id, label: d.label }))]}
              value={filters.domainId}
              onChange={(domainId) => setFilters((f) => ({ ...f, domainId, aliasId: "all" }))}
              placeholder="All Domains"
              width="w-36"
            />
            <AnimatedDropdown
              options={[{ value: "all", label: "All Aliases" }, ...(filters.domainId === "all" ? aliases : aliases.filter((a) => a.domainId === filters.domainId)).map((a) => ({ value: a.id, label: a.label }))]}
              value={filters.aliasId}
              onChange={(aliasId) => setFilters((f) => ({ ...f, aliasId }))}
              placeholder="All Aliases"
              width="w-40"
            />
            <AnimatedDropdown
              options={[{ value: "7d", label: "Last 7 days" }, { value: "14d", label: "Last 14 days" }, { value: "30d", label: "Last 30 days" }]}
              value={filters.range}
              onChange={(range) => setFilters((f) => ({ ...f, range: range as FilterState["range"] }))}
              placeholder="Last 7 days"
              width="w-32"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto">

        {/* Blur overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/40 rounded-b-xl" />
        )}

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/60">
              {["From", "Subject", "Alias", "Status", "Assigned", "Stuck For", "Reason"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-[11px] font-schibsted font-semibold text-neutral-400 uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : tickets.length === 0 ? (
              <EmptyState />
            ) : (
              <AnimatePresence>
                {tickets.map((ticket, i) => {
                  const reason = REASON_CONFIG[ticket.reason];
                  const ReasonIcon = reason.icon;
                  const status = STATUS_CONFIG[ticket.status];

                  return (
                    <motion.tr
                      key={`${tableKey}-${ticket.id}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.05,
                        ease: EASE_SETTLE,
                      }}
                      className="border-b border-neutral-100 hover:bg-neutral-50/80 transition-colors group"
                    >
                      {/* From */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={ticket.fromName} />
                          <div className="min-w-0">
                            <p className="text-xs font-schibsted font-semibold text-neutral-800 truncate">
                              {ticket.fromName}
                            </p>
                            <p className="text-[11px] font-schibsted text-neutral-400 truncate">
                              {ticket.fromEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="px-4 py-3.5 max-w-[240px]">
                        <p className="text-xs font-schibsted text-neutral-700 truncate">
                          {ticket.subject}
                        </p>
                        <p className="text-[11px] font-schibsted text-neutral-400 mt-0.5">
                          {ticket.receivedAt}
                        </p>
                      </td>

                      {/* Alias */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-schibsted font-medium text-sky-700 bg-sky-50 border border-sky-200 rounded-full px-2 py-0.5">
                          {ticket.alias}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={`text-[11px] font-schibsted font-medium px-2 py-0.5 rounded-full ${status.classes}`}>
                          {status.label}
                        </span>
                      </td>

                      {/* Assigned */}
                      <td className="px-4 py-3.5">
                        {ticket.assignedTo ? (
                          <span className="text-xs font-schibsted text-neutral-700">
                            {ticket.assignedTo}
                          </span>
                        ) : (
                          <span className="text-xs font-schibsted text-neutral-400 italic">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Stuck For */}
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-schibsted font-bold ${reason.color}`}>
                          {ticket.stuckFor}
                        </span>
                      </td>

                      {/* Reason */}
                      <td className="px-4 py-3.5">
                        <span className={`flex items-center gap-1.5 text-[11px] font-schibsted font-medium border rounded-full px-2 py-0.5 w-fit ${reason.bg} ${reason.color}`}>
                          <ReasonIcon size={10} strokeWidth={2.5} />
                          {reason.label}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {!isLoading && tickets.length > 0 && (
        <div className="px-5 py-3 border-t border-neutral-100">
          <Link
            href="/dashboard/tickets/mine"
            className="flex items-center gap-1 text-xs font-schibsted font-medium text-sky-700 hover:text-sky-900 transition-colors w-fit"
          >
            View all tickets
            <IconArrowRight size={13} />
          </Link>
        </div>
      )}
    </div>
  );
}