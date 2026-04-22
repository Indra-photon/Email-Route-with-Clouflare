"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AnimatedDropdown from "@/components/ui/AnimatedDropdown";
import type { DomainOption, AliasOption } from "./FilterBar";
import { Heading } from "@/components/Heading";
import { useAuth } from "@clerk/nextjs";
import {
  IconWorld,
  IconAt,
  IconCalendarWeek,
  IconCalendar,
  IconCalendarMonth,
} from "@tabler/icons-react";

// ── Easing ────────────────────────────────────────────────────────────────────

const EASE_SETTLE = [0.16, 1, 0.3, 1] as const;

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChartDataPoint {
  date:     string;
  incoming: number;
  resolved: number;
}

interface LocalFilters {
  domainId: string;
  aliasId:  string;
  range:    "7d" | "14d" | "30d";
}

// ── Real API fetch ────────────────────────────────────────────────────────────

async function fetchChartData(filters: LocalFilters): Promise<ChartDataPoint[]> {
  const params = new URLSearchParams({
    domainId: filters.domainId,
    aliasId:  filters.aliasId,
    range:    filters.range,
  });
  const res = await fetch(`/api/dashboard/volume?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch volume data");
  return res.json();
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const incoming = payload.find((p: any) => p.dataKey === "incoming")?.value ?? 0;
  const resolved = payload.find((p: any) => p.dataKey === "resolved")?.value ?? 0;
  const backlog   = incoming - resolved;

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 shadow-xl">
      <p className="text-xs font-schibsted font-semibold text-neutral-300 mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-sky-500 shrink-0" />
          <span className="text-xs font-schibsted text-neutral-300">Incoming</span>
          <span className="text-xs font-schibsted font-bold text-white ml-auto pl-4">{incoming}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-sky-300 shrink-0" />
          <span className="text-xs font-schibsted text-neutral-300">Resolved</span>
          <span className="text-xs font-schibsted font-bold text-white ml-auto pl-4">{resolved}</span>
        </div>
        {backlog !== 0 && (
          <>
            <div className="border-t border-neutral-700 my-1" />
            <div className="flex items-center gap-2">
              <span className={`text-xs font-schibsted font-semibold ${backlog > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                {backlog > 0 ? `+${backlog} backlog` : `${Math.abs(backlog)} cleared`}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Chart Skeleton ────────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="w-full h-full flex flex-col justify-end gap-1 px-2 pb-2">
      {[40, 65, 50, 80, 55, 70, 45].map((h, i) => (
        <div key={i} className="flex items-end gap-1 flex-1">
          <div
            className="flex-1 bg-neutral-100 animate-pulse rounded-t"
            style={{ height: `${h}%` }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface TicketVolumeChartProps {
  domains: DomainOption[];
  aliases: AliasOption[];
}

export function TicketVolumeChart({ domains, aliases }: TicketVolumeChartProps) {
  const [filters, setFilters] = useState<LocalFilters>({
    domainId: "all",
    aliasId:  "all",
    range:    "7d",
  });
  const [data, setData]         = useState<ChartDataPoint[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [chartKey, setChartKey] = useState(0); // forces AnimatePresence remount
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;
    setLoading(true);

    fetchChartData(filters)
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setChartKey((k) => k + 1);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("TicketVolumeChart fetch error:", err);
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn, filters.domainId, filters.aliasId, filters.range]);

  // Cascading aliases
  const visibleAliases =
    filters.domainId === "all"
      ? aliases
      : aliases.filter((a) => a.domainId === filters.domainId);

  const domainOptions = [
    { value: "all", label: "All Domains", icon: IconWorld },
    ...domains.map((d) => ({ value: d.id, label: d.label, icon: IconWorld })),
  ];

  const aliasOptions = [
    { value: "all", label: "All Aliases", icon: IconAt },
    ...visibleAliases.map((a) => ({ value: a.id, label: a.label, icon: IconAt })),
  ];

  const rangeOptions = [
    { value: "7d",  label: "Last 7 days",  icon: IconCalendarWeek  },
    { value: "14d", label: "Last 14 days", icon: IconCalendar      },
    { value: "30d", label: "Last 30 days", icon: IconCalendarMonth },
  ];

  function handleDomainChange(domainId: string) {
    setFilters((f) => ({ ...f, domainId, aliasId: "all" }));
  }

  return (
    <div className="bg-white rounded-4xl border border-neutral-200 p-5 flex flex-col gap-4">

      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-schibsted text-[18.5px] font-semibold uppercase tracking-[0.07em] text-neutral-700">
            Ticket Volume
          </h3>
          <p className="text-xs font-schibsted text-neutral-700 tracking-tighter mt-0.5">
            Check the pulse of your support with incoming vs resolved ticket trends.
          </p>
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <AnimatedDropdown
            options={domainOptions}
            value={filters.domainId}
            onChange={handleDomainChange}
            placeholder="All Domains"
            width="w-44"
            compact
          />
          <AnimatedDropdown
            options={aliasOptions}
            value={filters.aliasId}
            onChange={(aliasId) => setFilters((f) => ({ ...f, aliasId }))}
            placeholder="All Aliases"
            width="w-52"
            compact
          />
          <AnimatedDropdown
            options={rangeOptions}
            value={filters.range}
            onChange={(range) => setFilters((f) => ({ ...f, range: range as LocalFilters["range"] }))}
            placeholder="Last 7 days"
            width="w-36"
            compact
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-sky-600" />
          <span className="text-xs font-schibsted text-neutral-700 tracking-tighter">Incoming</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-sky-300" />
          <span className="text-xs font-schibsted text-neutral-700 tracking-tighter">Resolved</span>
        </div>
      </div>

      {/* Chart area */}
      <div className="relative rounded-lg border border-neutral-100 bg-neutral-50 overflow-hidden h-64">

        {/* Blur overlay while loading */}
        <AnimatePresence>
        {isLoading && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-10 backdrop-blur-sm bg-white/40 rounded-lg"
            />
        )}
        </AnimatePresence>

        {/* Animated chart */}
        <AnimatePresence mode="wait">
          {data.length > 0 && (
            <motion.div
              key={chartKey}
              initial={{ opacity: 0.60, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{   opacity: 0.60, y: 8, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: EASE_SETTLE }}
              className="w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 16, right: 16, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#0284c7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0}   />
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#7dd3fc" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7dd3fc" stopOpacity={0}   />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fontFamily: "var(--font-schibsted)", fill: "#0c4a6e" }}
                    axisLine={false}
                    tickLine={false}
                    dy={6}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fontFamily: "var(--font-schibsted)", fill: "#0c4a6e" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }} />

                  <Area
                    type="monotone"
                    dataKey="incoming"
                    stroke="#0284c7"
                    strokeWidth={2}
                    fill="url(#colorIncoming)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#0284c7", stroke: "#fff", strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stroke="#7dd3fc"
                    strokeWidth={2}
                    fill="url(#colorResolved)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#7dd3fc", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}