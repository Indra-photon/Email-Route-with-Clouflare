// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   IconAt,
//   IconGlobe,
//   IconArrowRight,
//   IconCircleCheck,
//   IconCircleX,
// } from "@tabler/icons-react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface AliasRow {
//   id:              string;
//   email:           string;
//   localPart:       string;
//   domain:          string;
//   status:          "active" | "inactive";
//   integrationName: string | null;
//   integrationType: string | null;
// }

// // ─── Mock data (swap for real fetch when ready) ───────────────────────────────

// async function fetchAliases(): Promise<AliasRow[]> {
//   const res = await fetch("/api/aliases");
//   if (!res.ok) return [];
//   const data = await res.json();
//   const list = Array.isArray(data) ? data : (data.aliases ?? []);
//   return list.map((a: any) => ({
//     id:              a.id ?? a._id,
//     email:           a.email,
//     localPart:       a.localPart ?? a.email.split("@")[0],
//     domain:          a.domain ?? a.email.split("@")[1] ?? "—",
//     status:          a.status ?? "active",
//     integrationName: a.integrationName ?? null,
//     integrationType: a.integrationType ?? null,
//   }));
// }

// // ─── Integration icon (Slack / Discord / generic) ────────────────────────────

// function IntegrationBadge({ type, name }: { type: string | null; name: string | null }) {
//   if (!name) return <span className="text-[10px] font-schibsted text-neutral-400">No integration</span>;

//   const color = type === "slack"   ? "bg-[#4A154B] text-white"
//               : type === "discord" ? "bg-[#5865F2] text-white"
//               : "bg-neutral-700 text-white";

//   return (
//     <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-schibsted font-semibold ${color}`}>
//       {name}
//     </span>
//   );
// }

// // ─── Skeleton ─────────────────────────────────────────────────────────────────

// function SkeletonRow() {
//   return (
//     <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-50">
//       <div className="size-8 rounded-lg bg-neutral-100 animate-pulse shrink-0" />
//       <div className="flex-1 space-y-1.5">
//         <div className="h-3 w-40 rounded bg-neutral-100 animate-pulse" />
//         <div className="h-2.5 w-24 rounded bg-neutral-100 animate-pulse" />
//       </div>
//       <div className="h-4 w-14 rounded-full bg-neutral-100 animate-pulse" />
//     </div>
//   );
// }

// // ─── Main component ───────────────────────────────────────────────────────────

// export function AliasesPanel() {
//   const [aliases,  setAliases]  = useState<AliasRow[]>([]);
//   const [loading,  setLoading]  = useState(true);

//   useEffect(() => {
//     fetchAliases()
//       .then(setAliases)
//       .catch(() => setAliases([]))
//       .finally(() => setLoading(false));
//   }, []);

//   const activeCount   = aliases.filter((a) => a.status === "active").length;
//   const inactiveCount = aliases.filter((a) => a.status === "inactive").length;

//   return (
//     <div className="bg-white rounded-4xl border border-neutral-200 flex flex-col h-full shadow-sm">

//       {/* Header */}
//       <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
//         <div className="flex items-center gap-2.5">
//           <div className="size-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
//             <IconAt size={16} className="text-sky-700" strokeWidth={2} />
//           </div>
//           <div>
//             <h3 className="text-sm font-schibsted font-bold text-neutral-800">
//               Aliases &amp; Domains
//             </h3>
//             {!loading && (
//               <p className="text-[11px] font-schibsted text-neutral-400 mt-0.5">
//                 {activeCount} active · {inactiveCount} inactive
//               </p>
//             )}
//           </div>
//         </div>
//         <Link
//           href="/dashboard/aliases"
//           className="flex items-center gap-1 text-xs font-schibsted text-sky-700 hover:text-sky-900 transition-colors"
//         >
//           Manage <IconArrowRight size={11} />
//         </Link>
//       </div>

//       {/* List */}
//       <div className="flex-1 overflow-y-auto">
//         {loading ? (
//           <>
//             <SkeletonRow />
//             <SkeletonRow />
//             <SkeletonRow />
//             <SkeletonRow />
//           </>
//         ) : aliases.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full py-10 gap-2">
//             <div className="size-10 rounded-full bg-neutral-100 flex items-center justify-center">
//               <IconAt size={18} className="text-neutral-400" />
//             </div>
//             <p className="text-xs font-schibsted text-neutral-400">No aliases yet</p>
//             <Link
//               href="/dashboard/aliases"
//               className="text-xs font-schibsted font-semibold text-sky-700 hover:text-sky-900"
//             >
//               Add your first alias →
//             </Link>
//           </div>
//         ) : (
//           aliases.map((alias) => (
//             <div
//               key={alias.id}
//               className="flex items-center gap-3 px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50/60 transition-colors duration-100"
//             >
//               {/* Icon */}
//               <div className="size-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
//                 <IconAt size={14} className="text-sky-600" strokeWidth={2} />
//               </div>

//               {/* Email + domain */}
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-schibsted font-semibold text-neutral-800 truncate">
//                   {alias.email}
//                 </p>
//                 <div className="flex items-center gap-1.5 mt-0.5">
//                   <IconGlobe size={10} className="text-neutral-400 shrink-0" />
//                   <span className="text-[10px] font-schibsted text-neutral-400 truncate">
//                     {alias.domain}
//                   </span>
//                 </div>
//               </div>

//               {/* Integration badge */}
//               <IntegrationBadge type={alias.integrationType} name={alias.integrationName} />

//               {/* Status dot */}
//               {alias.status === "active" ? (
//                 <IconCircleCheck size={14} className="text-emerald-500 shrink-0" strokeWidth={2} />
//               ) : (
//                 <IconCircleX size={14} className="text-neutral-300 shrink-0" strokeWidth={2} />
//               )}
//             </div>
//           ))
//         )}
//       </div>

//     </div>
//   );
// }



"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  IconAt,
  IconGlobe,
  IconArrowRight,
  IconCircleCheck,
  IconCircleX,
  IconChevronDown,
} from "@tabler/icons-react";
import AnimatedDropdown from "@/components/ui/AnimatedDropdown";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AliasRow {
  id:              string;
  email:           string;
  localPart:       string;
  domain:          string;
  status:          "active" | "inactive";
  integrationName: string | null;
  integrationType: string | null;
}

interface SubData {
  planId: string | null;
  currentPeriodEnd: string | null;
  usage: {
    ticketCountInbound: number;
    ticketLimit:        number;
    domainCount:        number;
    aliasCount:         number;
  };
  limits: {
    domains:           number;
    aliasesPerDomain:  number;
    ticketsPerMonth:   number;
  } | null;
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

async function fetchAliases(): Promise<AliasRow[]> {
  // MOCK DATA — remove this block and uncomment the real fetch below when ready
//   return [
//     {
//       id: "1",
//       email: "support@acme.com",
//       localPart: "support",
//       domain: "acme.com",
//       status: "active",
//       integrationName: "Customer Support",
//       integrationType: "slack",
//     },
//     {
//       id: "2",
//       email: "sales@acme.com",
//       localPart: "sales",
//       domain: "acme.com",
//       status: "active",
//       integrationName: "Sales Team",
//       integrationType: "slack",
//     },
//     {
//       id: "3",
//       email: "billing@acme.com",
//       localPart: "billing",
//       domain: "acme.com",
//       status: "active",
//       integrationName: "Finance",
//       integrationType: "discord",
//     },
//     {
//       id: "4",
//       email: "help@techcorp.io",
//       localPart: "help",
//       domain: "techcorp.io",
//       status: "inactive",
//       integrationName: null,
//       integrationType: null,
//     },
//     {
//       id: "5",
//       email: "hello@techcorp.io",
//       localPart: "hello",
//       domain: "techcorp.io",
//       status: "active",
//       integrationName: "General",
//       integrationType: "slack",
//     },
//   ];

  // ── Real fetch (uncomment when ready) ──
  const res = await fetch("/api/aliases");
  if (!res.ok) return [];
  const data = await res.json();
  const list = Array.isArray(data) ? data : (data.aliases ?? []);
  return list.map((a: any) => ({
    id:              a.id ?? a._id,
    email:           a.email,
    localPart:       a.localPart ?? a.email.split("@")[0],
    domain:          a.domain ?? a.email.split("@")[1] ?? "—",
    status:          a.status ?? "active",
    integrationName: a.integrationName ?? null,
    integrationType: a.integrationType ?? null,
  }));
}

async function fetchSubscription(): Promise<SubData | null> {
  try {
    const res = await fetch("/api/billing/subscription");
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatResetDate(iso: string | null): string | undefined {
  if (!iso) return undefined;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function barColor(pct: number): string {
  if (pct >= 90) return "bg-red-500";
  if (pct >= 70) return "bg-amber-400";
  return "bg-sky-500";
}

// ─── UsageBar ─────────────────────────────────────────────────────────────────

function UsageBar({
  label,
  current,
  max,
  note,
  loading,
}: {
  label:    string;
  current:  number;
  max:      number;
  note?:    string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="h-2.5 w-24 rounded bg-neutral-100 animate-pulse" />
        <div className="h-7 w-full rounded-xl bg-neutral-100 animate-pulse" />
      </div>
    );
  }

  if (max === -1) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-schibsted font-semibold text-neutral-700">{label}</span>
        <div className="relative h-9 w-full rounded-xl overflow-hidden flex">
          {/* filled side */}
          <div className="h-full bg-sky-500/30 flex items-center px-3 flex-1">
            <span className="text-xs font-schibsted font-semibold text-sky-700 tabular-nums">
              {current} used
            </span>
          </div>
          {/* divider */}
          <div className="w-px bg-neutral-300 shrink-0 self-stretch" />
          {/* remainder side */}
          <div
            className="h-full flex items-center justify-end px-3 flex-1"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.04) 4px, rgba(0,0,0,0.04) 8px)",
              backgroundColor: "#f3f4f6",
            }}
          >
            <span className="text-[10px] font-schibsted font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
              Unlimited
            </span>
          </div>
        </div>
        {note && (
          <p className="text-[10px] font-schibsted text-neutral-400">{note}</p>
        )}
      </div>
    );
  }

  const pct     = max === 0 ? 0 : Math.min((current / max) * 100, 100);
  const remain  = Math.max(100 - pct, 0);

  // bar fill colour based on threshold
  const fillBg =
    pct >= 90 ? "bg-red-500"   :
    pct >= 70 ? "bg-amber-400" :
                "bg-sky-500";

  const fillText =
    pct >= 90 ? "text-white"       :
    pct >= 70 ? "text-amber-900"   :
                "text-white";

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      <span className="text-xs font-schibsted text-neutral-700 tracking-tighter">{label}</span>

      {/* Split bar */}
      <div className="relative h-5 w-full rounded-xl overflow-hidden flex">

        {/* ── Filled side ── */}
        <div
          className={`h-full flex items-center px-3 transition-all duration-500 ${fillBg}`}
          style={{ width: `${pct}%`, minWidth: pct > 0 ? "2.5rem" : 0 }}
        >
          {pct >= 15 && (
            <span className={`text-xs font-schibsted font-semibold tabular-nums whitespace-nowrap ${fillText}`}>
              {current}
            </span>
          )}
        </div>

        {/* ── Divider ── */}
        {pct > 0 && pct < 100 && (
          <div className="w-2 bg-white/60 shrink-0 self-stretch z-10" />
        )}

        {/* ── Remainder side — hatched pattern ── */}
        <div
          className="h-full flex items-center justify-end px-3 flex-1"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(0,0,0,0.06) 5px, rgba(0,0,0,0.06) 10px)",
            backgroundColor: "#e5e7eb",
          }}
        >
          {remain >= 15 && (
            <span className="text-xs font-schibsted font-medium text-neutral-500 tabular-nums whitespace-nowrap">
              {max - current} left
            </span>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        {/* <span className="text-[11px] font-schibsted font-medium text-neutral-500 tabular-nums">
          {current} used
          {note && <span className="text-neutral-400 font-normal"> · {note}</span>}
        </span> */}
        {/* <span className="text-[11px] font-schibsted font-medium text-neutral-500 tabular-nums">
          {max} total
        </span> */}
      </div>
    </div>
  );
}

// ─── IntegrationBadge ─────────────────────────────────────────────────────────

function IntegrationBadge({ type, name }: { type: string | null; name: string | null }) {
  if (!name) {
    return <span className="text-[10px] font-schibsted text-neutral-400">No integration</span>;
  }
  const color =
    type === "slack"   ? "bg-[#4A154B] text-white" :
    type === "discord" ? "bg-[#5865F2] text-white"  :
                         "bg-neutral-700 text-white";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-schibsted font-semibold ${color}`}>
      {name}
    </span>
  );
}




// ─── Skeleton rows ────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-50">
      <div className="size-8 rounded-lg bg-neutral-100 animate-pulse shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-40 rounded bg-neutral-100 animate-pulse" />
        <div className="h-2.5 w-24 rounded bg-neutral-100 animate-pulse" />
      </div>
      <div className="h-4 w-14 rounded-full bg-neutral-100 animate-pulse" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AliasesPanel() {
  const [aliases,      setAliases]      = useState<AliasRow[]>([]);
  const [aliasLoading, setAliasLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState("all");

  const [subscription, setSubscription] = useState<SubData | null>(null);
  const [subLoading,   setSubLoading]   = useState(true);

  // fetch both on mount in parallel
  useEffect(() => {
    fetchAliases()
      .then(setAliases)
      .catch(() => setAliases([]))
      .finally(() => setAliasLoading(false));

    fetchSubscription()
      .then(setSubscription)
      .finally(() => setSubLoading(false));
  }, []);

  // derive unique domain list from aliases
  const domains = useMemo(
    () => [...new Set(aliases.map((a) => a.domain))].sort(),
    [aliases]
  );

  // filtered alias list
  const visibleAliases = useMemo(
    () => selectedDomain === "all"
      ? aliases
      : aliases.filter((a) => a.domain === selectedDomain),
    [aliases, selectedDomain]
  );

  const activeCount   = visibleAliases.filter((a) => a.status === "active").length;
  const inactiveCount = visibleAliases.filter((a) => a.status === "inactive").length;

  // usage values
  // MOCK SUBSCRIPTION — remove when real API is connected
// const sub: SubData = {
//   planId: "growth",
//   currentPeriodEnd: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
//   usage: {
//     ticketCountInbound: 143,
//     ticketLimit:        600,
//     domainCount:        2,
//     aliasCount:         8,
//   },
//   limits: {
//     domains:          3,
//     aliasesPerDomain: 5,
//     ticketsPerMonth:  600,
//   },
// };
     const sub = subscription;  // ← uncomment this and remove the mock above when ready


  const limits  = sub?.limits ?? null;
  const usage   = sub?.usage  ?? null;
  const planName = sub?.planId
    ? sub.planId.charAt(0).toUpperCase() + sub.planId.slice(1)
    : null;
  const resetDate = formatResetDate(sub?.currentPeriodEnd ?? null);

  // effective alias cap = domains × aliasesPerDomain
  const aliasMax = limits
    ? limits.aliasesPerDomain === -1
      ? -1
      : (usage?.domainCount ?? 0) * limits.aliasesPerDomain
    : 0;

  return (
    <div className="bg-white rounded-4xl border border-neutral-200 flex flex-col h-full overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
            <IconAt size={16} className="text-sky-700" strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-schibsted text-[18.5px] font-semibold uppercase tracking-[0.07em] text-neutral-700">
              Aliases &amp; Domains
            </h3>
            {!aliasLoading && (
              <p className="text-xs font-schibsted text-neutral-700 tracking-tighter mt-0.5">
                {activeCount} active · {inactiveCount} inactive
              </p>
            )}
          </div>
        </div>

        {/* Right: domain filter + manage link */}
        <div className="flex items-center gap-2.5">
          {!aliasLoading && domains.length > 1 && (
            <AnimatedDropdown
                options={[
                { value: "all", label: "All domains" },
                ...domains.map((d) => ({ value: d, label: d })),
                ]}
                value={selectedDomain}
                onChange={setSelectedDomain}
                placeholder="Select domain"
                width="w-32"
            />
            )}
          <Link
            href="/dashboard/aliases"
            className="flex items-center gap-1 text-xs font-schibsted text-sky-700 hover:text-sky-900 transition-colors whitespace-nowrap"
          >
            Manage <IconArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* ── Alias list ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {aliasLoading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : visibleAliases.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-10 gap-2">
            <div className="size-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <IconAt size={18} className="text-neutral-400" />
            </div>
            <p className="text-xs font-schibsted text-neutral-400">No aliases yet</p>
            <Link
              href="/dashboard/aliases"
              className="text-xs font-schibsted font-semibold text-sky-700 hover:text-sky-900"
            >
              Add your first alias →
            </Link>
          </div>
        ) : (
          visibleAliases.map((alias) => (
            <div
              key={alias.id}
              className="flex items-center gap-3 px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50/60 transition-colors duration-100"
            >
              {/* Icon */}
              <div className="size-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                <IconAt size={14} className="text-sky-600" strokeWidth={2} />
              </div>

              {/* Email + domain */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-schibsted font-semibold text-neutral-800 truncate">
                  {alias.email}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <IconGlobe size={10} className="text-neutral-400 shrink-0" />
                  <span className="text-[10px] font-schibsted text-neutral-400 truncate">
                    {alias.domain}
                  </span>
                </div>
              </div>

              {/* Integration badge */}
              <IntegrationBadge type={alias.integrationType} name={alias.integrationName} />

              {/* Status icon */}
              {alias.status === "active" ? (
                <IconCircleCheck size={14} className="text-emerald-500 shrink-0" strokeWidth={2} />
              ) : (
                <IconCircleX size={14} className="text-neutral-300 shrink-0" strokeWidth={2} />
              )}
            </div>
          ))
        )}
      </div>

      {/* ── Usage footer ───────────────────────────────────────────────────── */}
      <div className="border-t border-neutral-100 px-5 py-4 flex flex-col gap-3 shrink-0">

        {/* Section header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-schibsted text-neutral-900 tracking-tighter">
            Usage
          </span>
          {planName && (
            <span className="text-[10px] font-schibsted font-semibold capitalize text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
              {planName} plan
            </span>
          )}
        </div>

        {/* Bar 1 — Emails this month */}
        <UsageBar
          label="Emails this month"
          current={usage?.ticketCountInbound ?? 0}
          max={limits?.ticketsPerMonth ?? 0}
          note={resetDate ? `Resets ${resetDate}` : undefined}
          loading={subLoading}
        />

        {/* Bar 2 — Domains */}
        <UsageBar
          label="Domains"
          current={usage?.domainCount ?? 0}
          max={limits?.domains ?? 0}
          loading={subLoading}
        />

        {/* Bar 3 — Aliases (total across all domains) */}
        <UsageBar
          label="Aliases"
          current={usage?.aliasCount ?? 0}
          max={aliasMax}
          note={
            limits && limits.aliasesPerDomain !== -1
              ? `${limits.aliasesPerDomain} per domain`
              : undefined
          }
          loading={subLoading}
        />

      </div>

    </div>
  );
}