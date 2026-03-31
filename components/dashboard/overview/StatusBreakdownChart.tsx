// "use client";

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
// import AnimatedDropdown from "@/components/ui/AnimatedDropdown";
// import type { DomainOption, AliasOption } from "./FilterBar";

// // ── Easing ────────────────────────────────────────────────────────────────────

// const EASE_SETTLE = [0.16, 1, 0.3, 1] as const;

// // ── Types ─────────────────────────────────────────────────────────────────────

// interface StatusSlice {
//   label:  string;
//   value:  number;
//   colour: string;
//   bg:     string; // tailwind bg for legend dot
// }

// interface LocalFilters {
//   domainId: string;
//   aliasId:  string;
// }

// // ── Real API fetch ────────────────────────────────────────────────────────────

// async function fetchStatusData(filters: LocalFilters): Promise<StatusSlice[]> {
//   const params = new URLSearchParams({
//     domainId: filters.domainId,
//     aliasId:  filters.aliasId,
//   });
//   const res = await fetch(`/api/dashboard/status?${params.toString()}`);
//   if (!res.ok) throw new Error("Failed to fetch status data");
//   return res.json();
// }

// // ── Custom Tooltip ────────────────────────────────────────────────────────────

// function CustomTooltip({ active, payload }: any) {
//   if (!active || !payload?.length) return null;
//   const { label, value, colour } = payload[0].payload;
//   const total = payload[0].payload.total;

//   return (
//     <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 shadow-xl">
//       <div className="flex items-center gap-2">
//         <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: colour }} />
//         <span className="text-xs font-schibsted text-neutral-300">{label}</span>
//         <span className="text-xs font-schibsted font-bold text-white ml-2">{value}</span>
//         <span className="text-xs font-schibsted text-neutral-500">
//           ({Math.round((value / total) * 100)}%)
//         </span>
//       </div>
//     </div>
//   );
// }

// // ── Centre Label (custom active shape workaround) ─────────────────────────────

// function CentreLabel({ cx, cy, total }: { cx: number; cy: number; total: number }) {
//   return (
//     <>
//       <text
//         x={cx}
//         y={cy - 8}
//         textAnchor="middle"
//         className="font-schibsted"
//         style={{ fontFamily: "var(--font-schibsted)", fontSize: 28, fontWeight: 700, fill: "#0c4a6e" }}
//       >
//         {total}
//       </text>
//       <text
//         x={cx}
//         y={cy + 14}
//         textAnchor="middle"
//         style={{ fontFamily: "var(--font-schibsted)", fontSize: 11, fill: "#9ca3af" }}
//       >
//         total tickets
//       </text>
//     </>
//   );
// }

// // ── Main Component ────────────────────────────────────────────────────────────

// interface StatusBreakdownChartProps {
//   domains: DomainOption[];
//   aliases: AliasOption[];
// }

// export function StatusBreakdownChart({ domains, aliases }: StatusBreakdownChartProps) {
//   const [filters, setFilters] = useState<LocalFilters>({
//     domainId: "all",
//     aliasId:  "all",
//   });
//   const [data, setData]         = useState<StatusSlice[]>([]);
//   const [isLoading, setLoading] = useState(true);
//   const [chartKey, setChartKey] = useState(0);

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);

//     fetchStatusData(filters)
//       .then((d) => {
//         if (!cancelled) {
//           setData(d);
//           setChartKey((k) => k + 1);
//           setLoading(false);
//         }
//       })
//       .catch((err) => {
//         console.error("StatusBreakdownChart fetch error:", err);
//         if (!cancelled) setLoading(false);
//       });

//     return () => { cancelled = true; };
//   }, [filters.domainId, filters.aliasId]);

//   const total = data.reduce((sum, d) => sum + d.value, 0);

//   // Inject total into each slice for tooltip
//   const dataWithTotal = data.map((d) => ({ ...d, total }));

//   // Cascading aliases
//   const visibleAliases =
//     filters.domainId === "all"
//       ? aliases
//       : aliases.filter((a) => a.domainId === filters.domainId);

//   const domainOptions = [
//     { value: "all", label: "All Domains" },
//     ...domains.map((d) => ({ value: d.id, label: d.label })),
//   ];

//   const aliasOptions = [
//     { value: "all", label: "All Aliases" },
//     ...visibleAliases.map((a) => ({ value: a.id, label: a.label })),
//   ];

//   function handleDomainChange(domainId: string) {
//     setFilters({ domainId, aliasId: "all" });
//   }

//   return (
//     <div className="bg-white rounded-4xl border border-neutral-200 p-5 flex flex-col h-full gap-4">

//       {/* Header */}
//       <div className="flex items-start justify-between gap-3 flex-wrap">
//         <div>
//           <h3 className="font-schibsted text-[18.5px] font-semibold uppercase tracking-[0.07em] text-neutral-700">
//             Status Breakdown
//           </h3>
//           <p className="text-xs font-schibsted text-neutral-700 tracking-tighter mt-0.5">
//             See the distribution of open, pending, and closed tickets at a glance.
//           </p>
//         </div>

//         {/* Dropdowns */}
//         <div className="flex gap-2">
//           <AnimatedDropdown
//             options={domainOptions}
//             value={filters.domainId}
//             onChange={handleDomainChange}
//             placeholder="All Domains"
//             width="w-44"
//           />
//           <AnimatedDropdown
//             options={aliasOptions}
//             value={filters.aliasId}
//             onChange={(aliasId) => setFilters((f) => ({ ...f, aliasId }))}
//             placeholder="All Aliases"
//             width="w-44"
//           />
//         </div>
//       </div>

//       {/* Chart area */}
//       <div className="relative rounded-lg border border-neutral-100 bg-neutral-50 overflow-hidden h-56">

//         {/* Blur overlay while loading */}
//         {isLoading && (
//           <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/40 rounded-lg" />
//         )}

//         <AnimatePresence>
//           {!isLoading && (
//             <motion.div
//               key={chartKey}
//               initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
//               animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//               exit={{   opacity: 0, y: 8, filter: "blur(4px)" }}
//               transition={{ duration: 0.45, ease: EASE_SETTLE }}
//               className="w-full h-full"
//             >
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={dataWithTotal}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={62}
//                     outerRadius={90}
//                     paddingAngle={3}
//                     dataKey="value"
//                     strokeWidth={0}
//                   >
//                     {dataWithTotal.map((entry, index) => (
//                       <Cell key={index} fill={entry.colour} />
//                     ))}
//                   </Pie>
//                   <Tooltip content={<CustomTooltip />} />

//                   {/* Centre label rendered as SVG text */}
//                   {total > 0 && (
//                     <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
//                       <CentreLabel cx={0} cy={0} total={total} />
//                     </text>
//                   )}
//                 </PieChart>
//               </ResponsiveContainer>

//               {/* Centre label via absolute overlay (more reliable than SVG text) */}
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <div className="text-center">
//                   <p className="text-3xl font-schibsted font-bold text-sky-900 leading-none">
//                     {total}
//                   </p>
//                   <p className="text-xs font-schibsted text-neutral-400 mt-1">
//                     total tickets
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Legend */}
//       {!isLoading && (
//         <div className="grid grid-cols-2 gap-x-4 gap-y-2">
//           {data.map((slice) => (
//             <div key={slice.label} className="flex items-center justify-between">
//               <div className="flex items-center gap-1.5">
//                 <span className={`size-2.5 rounded-full ${slice.bg}`} />
//                 <span className="text-xs font-schibsted text-neutral-700 tracking-tighter">{slice.label}</span>
//               </div>
//               <span className="text-xs font-schibsted font-semibold text-neutral-700">
//                 {slice.value}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import AnimatedDropdown from "@/components/ui/AnimatedDropdown";
import type { DomainOption, AliasOption } from "./FilterBar";

// ── Easing ────────────────────────────────────────────────────────────────────

const EASE_SETTLE = [0.16, 1, 0.3, 1] as const;

// ── Types ─────────────────────────────────────────────────────────────────────

interface StatusSlice {
  label:  string;
  value:  number;
  colour: string;
  bg:     string; // tailwind bg for legend dot
}

interface LocalFilters {
  domainId: string;
  aliasId:  string;
}

// ── Mock / Real fetch ─────────────────────────────────────────────────────────

async function fetchStatusData(_filters: LocalFilters): Promise<StatusSlice[]> {
  // MOCK DATA — remove this block and uncomment the real fetch below when ready
  return [
    { label: "Open",        value: 24, colour: "#0284c7", bg: "bg-sky-600"   },
    { label: "In Progress", value: 18, colour: "#7dd3fc", bg: "bg-sky-300"   },
    { label: "Waiting",     value: 9,  colour: "#cbd5e1", bg: "bg-slate-300" },
    { label: "Resolved",    value: 41, colour: "#e2e8f0", bg: "bg-slate-200" },
  ];

  // ── Real fetch (uncomment when ready) ──
  // const params = new URLSearchParams({
  //   domainId: _filters.domainId,
  //   aliasId:  _filters.aliasId,
  // });
  // const res = await fetch(`/api/dashboard/status?${params.toString()}`);
  // if (!res.ok) throw new Error("Failed to fetch status data");
  // return res.json();
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { label, value, colour } = payload[0].payload;
  const total = payload[0].payload.total;

  return (
    <div className="bg-sky-950 border border-sky-800 rounded-lg px-3 py-2 shadow-xl">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: colour }} />
        <span className="text-xs font-schibsted text-neutral-300">{label}</span>
        <span className="text-xs font-schibsted font-bold text-white ml-2">{value}</span>
        <span className="text-xs font-schibsted text-neutral-500">
          ({Math.round((value / total) * 100)}%)
        </span>
      </div>
    </div>
  );
}

// ── Centre Label ──────────────────────────────────────────────────────────────

function CentreLabel({ cx, cy, total }: { cx: number; cy: number; total: number }) {
  return (
    <>
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        className="font-schibsted"
        style={{ fontFamily: "var(--font-schibsted)", fontSize: 28, fontWeight: 700, fill: "#ffffff" }}
      >
        {total}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        style={{ fontFamily: "var(--font-schibsted)", fontSize: 11, fill: "#7dd3fc" }}
      >
        total tickets
      </text>
    </>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface StatusBreakdownChartProps {
  domains: DomainOption[];
  aliases: AliasOption[];
}

export function StatusBreakdownChart({ domains, aliases }: StatusBreakdownChartProps) {
  const [filters, setFilters] = useState<LocalFilters>({
    domainId: "all",
    aliasId:  "all",
  });
  const [data, setData]         = useState<StatusSlice[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchStatusData(filters)
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setChartKey((k) => k + 1);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("StatusBreakdownChart fetch error:", err);
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [filters.domainId, filters.aliasId]);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  // Inject total into each slice for tooltip
  const dataWithTotal = data.map((d) => ({ ...d, total }));

  // Cascading aliases
  const visibleAliases =
    filters.domainId === "all"
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

  function handleDomainChange(domainId: string) {
    setFilters({ domainId, aliasId: "all" });
  }

  return (
    <div className="bg-sky-800 rounded-4xl border border-sky-700 p-5 flex flex-col h-full gap-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-schibsted text-[18.5px] font-semibold uppercase tracking-[0.07em] text-white">
            Status Breakdown
          </h3>
          <p className="text-xs font-schibsted text-sky-200 tracking-tighter mt-0.5">
            See the distribution of open, pending, and closed tickets at a glance.
          </p>
        </div>

        {/* Dropdowns */}
        <div className="flex gap-2">
          <AnimatedDropdown
            options={domainOptions}
            value={filters.domainId}
            onChange={handleDomainChange}
            placeholder="All Domains"
            width="w-44"
          />
          <AnimatedDropdown
            options={aliasOptions}
            value={filters.aliasId}
            onChange={(aliasId) => setFilters((f) => ({ ...f, aliasId }))}
            placeholder="All Aliases"
            width="w-44"
          />
        </div>
      </div>

      {/* Chart area */}
      <div className="relative rounded-xl border-dashed border border-sky-500 bg-sky-900/40 overflow-hidden h-56">

        {/* Blur overlay while loading */}
        {isLoading && (
          <div className="absolute inset-0 z-10 backdrop-blur-sm bg-sky-900/40 rounded-lg" />
        )}

        <AnimatePresence>
          {!isLoading && (
            <motion.div
              key={chartKey}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{   opacity: 0, y: 8, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: EASE_SETTLE }}
              className="w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataWithTotal}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {dataWithTotal.map((entry, index) => (
                      <Cell key={index} fill={entry.colour} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />

                  {/* Centre label rendered as SVG text */}
                  {total > 0 && (
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
                      <CentreLabel cx={0} cy={0} total={total} />
                    </text>
                  )}
                </PieChart>
              </ResponsiveContainer>

              {/* Centre label via absolute overlay (more reliable than SVG text) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-3xl font-schibsted font-bold text-white leading-none">
                    {total}
                  </p>
                  <p className="text-xs font-schibsted text-sky-300 mt-1">
                    total tickets
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      {!isLoading && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {data.map((slice) => (
            <div key={slice.label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`size-2.5 rounded-full ${slice.bg}`} />
                <span className="text-xs font-schibsted text-sky-100 tracking-tighter">{slice.label}</span>
              </div>
              <span className="text-xs font-schibsted font-semibold text-white">
                {slice.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}