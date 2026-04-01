// "use client";

// import { useEffect, useState } from "react";
// import {
//   IconMailFast,
//   IconHourglass,
//   IconRosetteDiscountCheck,
//   IconMessage,
//   IconTrendingUp,
//   IconTrendingDown,
//   IconMinus,
// } from "@tabler/icons-react";
// import { motion } from "framer-motion";
// import type { FilterState } from "./FilterBar";

// // ── Types ─────────────────────────────────────────────────────────────────────

// interface StatCardData {
//   label:       string;
//   value:       string;
//   delta:       number;
//   deltaLabel:  string;
//   icon:        React.ElementType;
//   invertDelta?: boolean;
//   accent:      "light" | "dark";
// }

// // ── Real API fetch ─────────────────────────────────────────────────────────────

// async function fetchStats(filters: FilterState): Promise<StatCardData[]> {
//   const params = new URLSearchParams({
//     domainId: filters.domainId,
//     aliasId:  filters.aliasId,
//     range:    filters.range,
//   });

//   const res = await fetch(`/api/dashboard/stats?${params.toString()}`);
//   if (!res.ok) throw new Error("Failed to fetch stats");

//   const data = await res.json();

//   const avgMinValue = data.avgResponseMin.value;
//   const avgDisplay  = avgMinValue >= 60
//     ? `${Math.floor(avgMinValue / 60)}h ${avgMinValue % 60}m`
//     : `${avgMinValue} min`;

//   return [
//     {
//       label:      "Open Tickets",
//       value:      String(data.openTickets.value),
//       delta:      data.openTickets.delta,
//       deltaLabel: data.openTickets.deltaLabel,
//       icon:       IconMailFast,
//       accent:     "dark",
//     },
//     {
//       label:       "Avg First Response",
//       value:       avgDisplay,
//       delta:       data.avgResponseMin.delta,
//       deltaLabel:  data.avgResponseMin.deltaLabel,
//       icon:        IconHourglass,
//       invertDelta: true,
//       accent:      "dark",
//     },
//     {
//       label:      "Resolved Today",
//       value:      String(data.resolvedToday.value),
//       delta:      data.resolvedToday.delta,
//       deltaLabel: data.resolvedToday.deltaLabel,
//       icon:       IconRosetteDiscountCheck,
//       accent:     "dark",
//     },
//     {
//       label:      "Active Live Chats",
//       value:      String(data.activeLiveChats.value),
//       delta:      data.activeLiveChats.delta,
//       deltaLabel: data.activeLiveChats.deltaLabel,
//       icon:       IconMessage,
//       accent:     "dark",
//     },
//   ];
// }

// // ── Skeleton ──────────────────────────────────────────────────────────────────

// function StatCardSkeleton({ index }: { index: number }) {
//   const isDark = index === 2;
//   return (
//     <div className={`relative overflow-hidden rounded-2xl p-5 flex flex-col gap-2 ${isDark ? "bg-sky-900" : "bg-sky-50 border border-sky-200"}`}>
//       <div className={`h-2.5 w-20 rounded animate-pulse ${isDark ? "bg-sky-700" : "bg-sky-200"}`} />
//       <div className={`h-9 w-16 rounded-lg animate-pulse ${isDark ? "bg-sky-700" : "bg-sky-200"}`} />
//       <div className={`h-2 w-24 rounded animate-pulse ${isDark ? "bg-sky-700" : "bg-sky-200"}`} />
//     </div>
//   );
// }

// // ── Single Card ───────────────────────────────────────────────────────────────

// function StatCard({ data, index }: { data: StatCardData; index: number }) {
//   const Icon = data.icon;

//   const isNeutral = data.delta === 0;
//   const isGood    = data.invertDelta ? data.delta < 0 : data.delta > 0;

//   const DeltaIcon = isNeutral ? IconMinus : isGood ? IconTrendingUp : IconTrendingDown;

//   const deltaText = isNeutral
//     ? data.deltaLabel
//     : `${isGood ? "+" : ""}${data.delta} ${data.deltaLabel}`;

//   const deltaPill = isNeutral
//     ? "text-sky-200"
//     : isGood
//     ? "text-emerald-400"
//     : "text-red-400";

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 12 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.35, delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
//       className={`
//         relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between gap-4
//         bg-gradient-to-br from-sky-800 to-cyan-600 shadow-lg shadow-sky-900/30
//       `}
//     >
//       {/* Background watermark icon */}
//       <div className="absolute -bottom-7 -right-2 pointer-events-none select-none blur-xs">
//         <Icon
//           size={90}
//           strokeWidth={0.30}
//           className="text-white opacity-100"
//           style={{ transform: "rotate(15deg)" }}
//         />
//       </div>

//       {/* Label */}
//       <span className={`font-schibsted text-[10.5px] font-semibold uppercase tracking-[0.07em] text-neutral-100`}>
//         {data.label}
//       </span>

//       {/* Value */}
//       <div className="relative z-10">
//         <p className={`font-schibsted font-bold leading-none tabular-nums text-white text-3xl`}>
//           {data.value}
//         </p>
//       </div>

//       {/* Delta pill */}
//       <div className={`relative z-10 flex items-center ${deltaPill} self-start rounded-full px-2 py-0.5 gap-1`}>
//         <DeltaIcon size={11} strokeWidth={2.5} />
//         <span className={`font-schibsted text-[12px] font-semibold`}>{deltaText}</span>
//       </div>
//     </motion.div>
//   );
// }

// // ── StatCards ─────────────────────────────────────────────────────────────────

// interface StatCardsProps {
//   filters: FilterState;
// }

// export function StatCards({ filters }: StatCardsProps) {
//   const [stats, setStats]       = useState<StatCardData[]>([]);
//   const [isLoading, setLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);

//     fetchStats(filters)
//       .then((data) => {
//         if (!cancelled) {
//           setStats(data);
//           setLoading(false);
//         }
//       })
//       .catch((err) => {
//         console.error("StatCards fetch error:", err);
//         if (!cancelled) setLoading(false);
//       });

//     return () => { cancelled = true; };
//   }, [filters.domainId, filters.aliasId, filters.range]);

//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 py-5">
//         {Array.from({ length: 4 }).map((_, i) => (
//           <StatCardSkeleton key={i} index={i} />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 py-5">
//       {stats.map((stat, i) => (
//         <StatCard key={stat.label} data={stat} index={i} />
//       ))}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  IconMailFast,
  IconHourglass,
  IconRosetteDiscountCheck,
  IconMessage,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowRight,
} from "@tabler/icons-react";
import { useAuth } from "@clerk/nextjs";
import AnimatedDropdown from "@/components/ui/AnimatedDropdown";
import type { DomainOption, AliasOption } from "./FilterBar";
import type { FilterState } from "./FilterBar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatData {
  openTickets: { value: number; delta: number; deltaLabel: string };
  avgResponseMin: { value: number; delta: number; deltaLabel: string };
  resolvedToday: { value: number; delta: number; deltaLabel: string };
  activeLiveChats: { value: number; delta: number; deltaLabel: string };
  totalTickets: { value: number; delta: number; deltaLabel: string };
  totalChats: { value: number; delta: number; deltaLabel: string };
}

interface RecentTicket {
  id: string;
  from: string;
  subject: string;
  status: string;
  createdAt: string;
}

// ─── API fetches ──────────────────────────────────────────────────────────────

async function fetchStats(filters: FilterState): Promise<StatData> {
  const params = new URLSearchParams({
    domainId: filters.domainId,
    aliasId: filters.aliasId,
    range: filters.range,
  });
  const res = await fetch(`/api/dashboard/stats?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  const data = await res.json();

  return {
    openTickets: data.openTickets,
    avgResponseMin: data.avgResponseMin,
    resolvedToday: data.resolvedToday,
    activeLiveChats: data.activeLiveChats,
    // derive totals from existing fields — fallback gracefully
    totalTickets: data.totalTickets ?? data.openTickets,
    totalChats: data.totalChats ?? data.activeLiveChats,
  };
}

async function fetchRecentTickets(): Promise<RecentTicket[]> {
  const res = await fetch("/api/tickets?limit=5&sort=newest");
  if (!res.ok) return [];
  const data = await res.json();
  // handle both { tickets: [] } and plain array
  const list = Array.isArray(data) ? data : (data.tickets ?? data.threads ?? []);
  return list.slice(0, 5).map((t: any) => ({
    id: t.id ?? t._id,
    from: t.from ?? t.fromEmail ?? "—",
    subject: t.subject ?? "(no subject)",
    status: t.status ?? "open",
    createdAt: t.createdAt ?? t.receivedAt ?? "",
  }));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAvg(minutes: number): string {
  if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  return `${minutes}m`;
}

function timeAgo(iso: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  open: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  in_progress: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-400" },
  waiting: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
  resolved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  pending: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
  completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.open;
  const label = status.replace("_", " ");
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-schibsted font-semibold capitalize ${s.bg} ${s.text}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
}

function DeltaPill({
  delta,
  label,
  invert = false,
  light = false,
}: {
  delta: number;
  label: string;
  invert?: boolean;
  light?: boolean;
}) {
  const isGood = invert ? delta < 0 : delta > 0;
  const isZero = delta === 0;

  const pillClass = light
    ? isZero
      ? " text-white/60"
      : isGood
        ? " text-white"
        : " text-white"
    : isZero
      ? " text-neutral-500"
      : isGood
        ? " text-emerald-700"
        : " text-red-600";

  const Icon = isZero ? null : isGood ? IconTrendingUp : IconTrendingDown;
  const sign = delta > 0 ? "+" : "";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full text-[11px] font-schibsted font-semibold ${pillClass}`}>
      {Icon && <Icon size={10} strokeWidth={2.5} />}
      {sign}{delta} {label}
    </span>
  );
}

// ─── Box 1 — Total hero card with Tickets / Chats tabs ────────────────────────

function TotalHeroCard({ stats, loading }: { stats: StatData | null; loading: boolean }) {
  const [tab, setTab] = useState<"tickets" | "chats">("tickets");

  const value = tab === "tickets"
    ? stats?.totalTickets.value ?? stats?.openTickets.value ?? 0
    : stats?.totalChats.value ?? stats?.activeLiveChats.value ?? 0;

  const delta = tab === "tickets"
    ? stats?.totalTickets.delta ?? stats?.openTickets.delta ?? 0
    : stats?.totalChats.delta ?? stats?.activeLiveChats.delta ?? 0;

  const deltaLabel = tab === "tickets"
    ? (stats?.totalTickets.deltaLabel ?? stats?.openTickets.deltaLabel ?? "last month")
    : (stats?.totalChats.deltaLabel ?? stats?.activeLiveChats.deltaLabel ?? "last month");

  return (
    <div className="bg-white rounded-4xl border border-neutral-200 p-5 flex flex-col gap-4 h-full">

      {/* Header row — label left, tabs right */}
      <div className="flex items-center justify-between">
        <p className="font-schibsted text-[10.5px] font-semibold uppercase tracking-[0.07em] text-neutral-700">
          {tab === "tickets" ? "Total tickets" : "Total chats"}
        </p>
      </div>

      {/* Tab switcher — right side of header */}
      <div className="inline-flex items-center w-fit bg-neutral-100 rounded-lg p-0.5 gap-0.5">
        {(["tickets", "chats"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`
                px-2.5 py-1 rounded-md text-[11px] font-schibsted font-semibold
                transition-all duration-150
                ${tab === t
                ? "bg-white text-sky-800 shadow-sm"
                : "text-neutral-400 hover:text-neutral-600"
              }
              `}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Big number */}
      <div className="flex-1 flex items-center">
        {loading ? (
          <div className="h-12 w-20 rounded-xl bg-neutral-100 animate-pulse" />
        ) : (
          <motion.p
            key={`${tab}-${value}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-5xl xl:text-6xl font-schibsted font-bold text-neutral-900 tabular-nums leading-none tracking-tighter truncate w-full"
          >
            {value}
          </motion.p>
        )}
      </div>

      {/* Delta */}
      {/* {loading ? (
        <div className="h-5 w-28 rounded-full bg-neutral-100 animate-pulse" />
      ) : (
        <DeltaPill delta={delta} label={deltaLabel} />
      )} */}

    </div>
  );
}

// ─── Box 2 — 2×2 metric cards ─────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  icon: React.ElementType;
  accent?: boolean;
  invert?: boolean;
  loading: boolean;
}

function MetricCard({ label, value, delta, deltaLabel, icon: Icon, accent, invert, loading }: MetricCardProps) {
  return (
    <div className={`
      relative rounded-4xl p-5 flex flex-col justify-between overflow-hidden
      ${accent
        ? "bg-gradient-to-br from-sky-800 to-cyan-600 "
        : "bg-gradient-to-br from-sky-800 to-cyan-600 "
      }
    `}>
      {/* Watermark icon — behind everything */}
      <div className="absolute -bottom-4 -right-1 pointer-events-none select-none blur-[2px]">
        <Icon size={80} strokeWidth={0.3} className="text-white opacity-100" style={{ transform: "rotate(15deg)" }} />
      </div>

      {/* Label & Delta pill — side by side */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-schibsted text-[10.5px] font-semibold uppercase tracking-[0.07em] text-neutral-100">
          {label}
        </span>
        {loading ? (
          <div className="h-5 w-24 rounded-full animate-pulse bg-sky-700" />
        ) : (
          <DeltaPill delta={delta} label={deltaLabel} invert={invert} light />
        )}
      </div>

      {/* Value */}
      {loading ? (
        <div className="my-3 h-9 w-16 rounded-lg animate-pulse bg-sky-700" />
      ) : (
        <p className="relative z-10 my-3 font-schibsted font-bold leading-none tabular-nums text-white text-3xl">
          {value}
        </p>
      )}
    </div>
  );
}

function MetricGrid({ stats, loading }: { stats: StatData | null; loading: boolean }) {
  const avg = stats ? formatAvg(stats.avgResponseMin.value) : "—";

  const cards: MetricCardProps[] = [
    {
      label: "Resolved Today",
      value: String(stats?.resolvedToday.value ?? 0),
      delta: stats?.resolvedToday.delta ?? 0,
      deltaLabel: stats?.resolvedToday.deltaLabel ?? "this month",
      icon: IconRosetteDiscountCheck,
      accent: true,
      loading,
    },
    {
      label: "Avg Response",
      value: avg,
      delta: stats?.avgResponseMin.delta ?? 0,
      deltaLabel: stats?.avgResponseMin.deltaLabel ?? "this month",
      icon: IconHourglass,
      invert: true,
      loading,
    },
    {
      label: "In Progress",
      value: String(stats?.openTickets.value ?? 0),
      delta: stats?.openTickets.delta ?? 0,
      deltaLabel: stats?.openTickets.deltaLabel ?? "this month",
      icon: IconMailFast,
      loading,
    },
    {
      label: "Live Chats",
      value: String(stats?.activeLiveChats.value ?? 0),
      delta: stats?.activeLiveChats.delta ?? 0,
      deltaLabel: stats?.activeLiveChats.deltaLabel ?? "this month",
      icon: IconMessage,
      loading,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      {cards.map((c) => (
        <MetricCard key={c.label} {...c} />
      ))}
    </div>
  );
}

// ─── Box 3 — Recent Activity table ───────────────────────────────────────────

function RecentActivityBox() {
  const [tickets, setTickets] = useState<RecentTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetchRecentTickets()
      .then(setTickets)
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn]);

  return (
    <div className="bg-white rounded-4xl border border-neutral-200 p-3 flex flex-col h-full shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 mt-2">
        <div className="flex flex-col gap-0.5">
          <p className="font-schibsted text-[18.5px] font-semibold uppercase tracking-[0.07em] text-neutral-700">Recent Activity</p>
          <p className="text-xs font-schibsted text-neutral-700 tracking-tighter">Last updated 5 minutes ago</p>
        </div>
        <Link
          href="/dashboard/tickets/mine"
          className="flex items-center gap-1 text-xs font-schibsted text-sky-700 hover:text-sky-900 transition-colors"
        >
          View all <IconArrowRight size={11} />
        </Link>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden bg-neutral-50 rounded-xl p-4">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-2">
                <div className="h-8 flex-1 rounded-lg bg-neutral-100 animate-pulse" />
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs font-schibsted text-neutral-400">No recent tickets</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50">
            {tickets.map((t) => (
              <Link
                key={t.id}
                href={`/dashboard/tickets/mine`}
                className="flex items-center gap-3 py-2 hover:bg-neutral-50 rounded-lg px-1 -mx-1 transition-colors duration-100 group"
              >
                {/* From */}
                <span className="text-xs font-schibsted text-neutral-500 truncate w-28 shrink-0">
                  {t.from}
                </span>
                {/* Subject */}
                <span className="text-xs font-schibsted text-neutral-700 truncate flex-1 group-hover:text-neutral-900 transition-colors">
                  {t.subject}
                </span>
                {/* Status */}
                <StatusBadge status={t.status} />
                {/* Time */}
                <span className="text-[10px] font-schibsted text-neutral-400 shrink-0 w-12 text-right">
                  {timeAgo(t.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main StatCards export ────────────────────────────────────────────────────

// ─── Filter options (fetched once on mount) ───────────────────────────────────

const rangeOptions = [
  { value: "7d", label: "Last 7 days" },
  { value: "14d", label: "Last 14 days" },
  { value: "30d", label: "Last 30 days" },
];

export function StatCards() {
  const [filters, setFilters] = useState<FilterState>({
    domainId: "all",
    aliasId: "all",
    range: "7d",
  });
  const [stats, setStats] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;
    setLoading(true);

    fetchStats(filters)
      .then((data) => { if (!cancelled) { setStats(data); setLoading(false); } })
      .catch((err) => { console.error("StatCards fetch error:", err); if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn, filters.domainId, filters.aliasId, filters.range]);

  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [aliases, setAliases] = useState<AliasOption[]>([]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
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
      .catch(() => { });
  }, [isLoaded, isSignedIn]);

  const visibleAliases = filters.domainId === "all"
    ? aliases
    : aliases.filter((a) => a.domainId === filters.domainId);

  const domainOptions = [
    { value: "all", label: "All Domains" },
    ...domains.map((d) => ({ value: d.id, label: d.label })),
  ];

  const aliasOptions = [
    { value: "all", label: "All Aliases" },
    ...visibleAliases.map((a) => ({ value: a.id, label: a.label })),
  ];

  return (
    <div className="flex flex-col gap-3 py-5">

      {/* Filter row — right-aligned, visually sits above col 1+2 only */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 flex justify-start items-center gap-2">
          <span className="text-xs font-schibsted text-neutral-400 mr-1">Filter by</span>
          <AnimatedDropdown
            options={domainOptions}
            value={filters.domainId}
            onChange={(domainId) => setFilters((f) => ({ ...f, domainId, aliasId: "all" }))}
            placeholder="All Domains"
            width="w-40"
          />
          <AnimatedDropdown
            options={aliasOptions}
            value={filters.aliasId}
            onChange={(aliasId) => setFilters((f) => ({ ...f, aliasId }))}
            placeholder="All Aliases"
            width="w-44"
          />
          <AnimatedDropdown
            options={rangeOptions}
            value={filters.range}
            onChange={(range) => setFilters((f) => ({ ...f, range: range as FilterState["range"] }))}
            placeholder="Last 7 days"
            width="w-36"
          />
        </div>
        {/* <div className="col-span-5" /> */}
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-12 gap-4" style={{ minHeight: 220 }}>
        <div className="col-span-2">
          <TotalHeroCard stats={stats} loading={loading} />
        </div>
        <div className="col-span-5">
          <MetricGrid stats={stats} loading={loading} />
        </div>
        <div className="col-span-5">
          <RecentActivityBox />
        </div>
      </div>

    </div>
  );
}