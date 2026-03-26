"use client";

import { useEffect, useState } from "react";
import {
  IconMailFast,
  IconHourglass,
  IconRosetteDiscountCheck,
  IconMessage,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import type { FilterState } from "./FilterBar";

// ── Types ─────────────────────────────────────────────────────────────────────

interface StatCardData {
  label:       string;
  value:       string;
  delta:       number;
  deltaLabel:  string;
  icon:        React.ElementType;
  invertDelta?: boolean;
  accent:      "light" | "dark";
}

// ── Mock fetch ────────────────────────────────────────────────────────────────

async function fetchStats(_filters: FilterState): Promise<StatCardData[]> {
  await new Promise((r) => setTimeout(r, 700));
  return [
    {
      label:      "Open Tickets",
      value:      "24",
      delta:      -3,
      deltaLabel: "vs yesterday",
      icon:       IconMailFast,
      accent:     "dark",
    },
    {
      label:       "Avg First Response",
      value:       "14 min",
      delta:       -6,
      deltaLabel:  "vs last period",
      icon:        IconHourglass,
      invertDelta: true,
      accent:      "dark",
    },
    {
      label:      "Resolved Today",
      value:      "18",
      delta:      5,
      deltaLabel: "vs yesterday",
      icon:       IconRosetteDiscountCheck,
      accent:     "dark",
    },
    {
      label:      "Active Live Chats",
      value:      "3",
      delta:      0,
      deltaLabel: "right now",
      icon:       IconMessage,
      accent:     "dark",
    },
  ];
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function StatCardSkeleton({ index }: { index: number }) {
  const isDark = index === 2;
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 flex flex-col gap-2 ${isDark ? "bg-sky-900" : "bg-sky-50 border border-sky-200"}`}>
      <div className={`h-2.5 w-20 rounded animate-pulse ${isDark ? "bg-sky-700" : "bg-sky-200"}`} />
      <div className={`h-9 w-16 rounded-lg animate-pulse ${isDark ? "bg-sky-700" : "bg-sky-200"}`} />
      <div className={`h-2 w-24 rounded animate-pulse ${isDark ? "bg-sky-700" : "bg-sky-200"}`} />
    </div>
  );
}

// ── Single Card ───────────────────────────────────────────────────────────────

function StatCard({ data, index }: { data: StatCardData; index: number }) {
  const Icon = data.icon;
  const isDark = data.accent === "dark";

  const isNeutral = data.delta === 0;
  const isGood    = data.invertDelta ? data.delta < 0 : data.delta > 0;

  const DeltaIcon = isNeutral ? IconMinus : isGood ? IconTrendingUp : IconTrendingDown;

  const deltaText = isNeutral
    ? data.deltaLabel
    : `${isGood ? "+" : ""}${data.delta} ${data.deltaLabel}`;

  // Delta pill colours — green up, red down, always
  const deltaPill = isNeutral
    ? isDark ? "text-sky-200" : "text-neutral-400"
    : isGood
    ? "text-emerald-400"
    : "text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
      className={`
        relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between gap-4
        bg-gradient-to-br from-sky-800 to-cyan-600 shadow-lg shadow-sky-900/30
      `}
    >
      {/* Background watermark icon — deep in corner, intentionally clipped */}
      <div className="absolute -bottom-7 -right-2 pointer-events-none select-none blur-xs">
        <Icon
          size={90}
          strokeWidth={0.30}
          className="text-white opacity-100"
          style={{ transform: "rotate(15deg)" }}
        />
      </div>

      {/* Label */}
      <span className={`font-schibsted text-[10.5px] font-semibold uppercase tracking-[0.07em] text-neutral-100`}>
        {data.label}
      </span>

      {/* Value */}
      <div className="relative z-10">
        <p className={`font-schibsted font-bold leading-none tabular-nums text-white text-3xl`}
        >
          {data.value}
        </p>
      </div>

      {/* Delta pill */}
      <div className={`relative z-10 flex items-center ${deltaPill} self-start rounded-full px-2 py-0.5 gap-1`}>
        <DeltaIcon size={11} strokeWidth={2.5} />
        <span className={`font-schibsted text-[12px] font-semibold`}>{deltaText}</span>
      </div>
    </motion.div>
  );
}

// ── StatCards ─────────────────────────────────────────────────────────────────

interface StatCardsProps {
  filters: FilterState;
}

export function StatCards({ filters }: StatCardsProps) {
  const [stats, setStats]       = useState<StatCardData[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchStats(filters).then((data) => {
      if (!cancelled) {
        setStats(data);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [filters.domainId, filters.aliasId, filters.range]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 py-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} index={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 py-5">
      {stats.map((stat, i) => (
        <StatCard key={stat.label} data={stat} index={i} />
      ))}
    </div>
  );
}
