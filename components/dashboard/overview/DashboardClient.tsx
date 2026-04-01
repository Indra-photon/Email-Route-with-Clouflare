// "use client";

// import { useEffect, useState } from "react";
// import { FilterBar, FilterState } from "./FilterBar";
// import type { DomainOption, AliasOption } from "./FilterBar";
// import { StatCards } from "./StatCards";
// import { TicketVolumeChart } from "./TicketVolumeChart";
// import { StatusBreakdownChart } from "./StatusBreakdownChart";
// import { NeedsAttentionTable } from "./NeedsAttentionTable";

// export function DashboardClient() {
//   const [filters, setFilters] = useState<FilterState>({
//     domainId: "all",
//     aliasId: "all",
//     range: "7d",
//   });

//   const [domains, setDomains] = useState<DomainOption[]>([]);
//   const [aliases, setAliases] = useState<AliasOption[]>([]);

//   useEffect(() => {
//     async function load() {
//       try {
//         const [domainsRes, aliasesRes] = await Promise.all([
//           fetch("/api/domains"),
//           fetch("/api/aliases"),
//         ]);

//         if (domainsRes.ok) {
//           const data = await domainsRes.json();
//           setDomains(data.map((d: any) => ({ id: d.id, label: d.domain })));
//         }

//         if (aliasesRes.ok) {
//           const data = await aliasesRes.json();
//           setAliases(
//             data.map((a: any) => ({
//               id:       a.id,
//               label:    a.email,
//               domainId: a.domainId ?? "unknown",
//             }))
//           );
//         }
//       } catch (err) {
//         console.error("Failed to load domains/aliases for dashboard filters", err);
//       }
//     }
//     load();
//   }, []);

//   return (
//     <div className="flex flex-col">
//       <StatCards />

//       {/* Chart row — explicit min-h so ResponsiveContainer gets a real pixel height */}
      // <div className="py-4 grid grid-cols-5 gap-4" style={{ minHeight: 360 }}>
      //   <div className="col-span-3 min-w-0 min-h-0">
      //     <TicketVolumeChart domains={domains} aliases={aliases} />
      //   </div>
      //   <div className="col-span-2 min-w-0 min-h-0">
      //     <StatusBreakdownChart domains={domains} aliases={aliases} />
      //   </div>
      // </div>

//       <NeedsAttentionTable />
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import type { DomainOption, AliasOption } from "./FilterBar";
import { StatCards } from "./StatCards";
import { TicketVolumeChart } from "./TicketVolumeChart";
import { StatusBreakdownChart } from "./StatusBreakdownChart";
import { NeedsAttentionTable } from "./NeedsAttentionTable";
import { AliasesPanel } from "./AliasesPanel";
import { useAuth } from "@clerk/nextjs";

export function DashboardClient() {
  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [aliases, setAliases] = useState<AliasOption[]>([]);
  const { isLoaded, isSignedIn } = useAuth();

  // domains + aliases still needed by TicketVolumeChart + StatusBreakdownChart
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    async function load() {
      try {
        const [domainsRes, aliasesRes] = await Promise.all([
          fetch("/api/domains"),
          fetch("/api/aliases"),
        ]);
        if (domainsRes.ok) {
          const data = await domainsRes.json();
          setDomains(data.map((d: any) => ({ id: d.id, label: d.domain })));
        }
        if (aliasesRes.ok) {
          const data = await aliasesRes.json();
          setAliases(
            data.map((a: any) => ({
              id:       a.id,
              label:    a.email,
              domainId: a.domainId ?? "unknown",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load domains/aliases", err);
      }
    }
    load();
  }, [isLoaded, isSignedIn]);

  return (
    <div className="flex flex-col gap-4">

      {/* Row 1 — StatCards (self-contained with own filters) */}
      <StatCards />

      {/* Row 2 — Ticket Volume (3/4) + Status Breakdown (1/4) */}
      <div className="py-4 grid grid-cols-5 gap-4" style={{ minHeight: 360 }}>
        <div className="col-span-3 min-w-0 min-h-0">
          <TicketVolumeChart domains={domains} aliases={aliases} />
        </div>
        <div className="col-span-2 min-w-0 min-h-0">
          <StatusBreakdownChart domains={domains} aliases={aliases} />
        </div>
      </div>

      {/* Row 3 — Aliases Panel (40%) + Needs Attention (60%) */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2">
          <AliasesPanel />
        </div>
        <div className="col-span-3">
          <NeedsAttentionTable />
        </div>
      </div>

    </div>
  );
}