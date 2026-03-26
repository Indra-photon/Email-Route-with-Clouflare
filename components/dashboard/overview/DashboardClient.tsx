"use client";

import { useState } from "react";
import { FilterBar, FilterState, MOCK_DOMAINS, MOCK_ALIASES } from "./FilterBar";
import { StatCards } from "./StatCards";
import { TicketVolumeChart } from "./TicketVolumeChart";
import { StatusBreakdownChart } from "./StatusBreakdownChart";
import { NeedsAttentionTable } from "./NeedsAttentionTable";

export function DashboardClient() {
  const [filters, setFilters] = useState<FilterState>({
    domainId: "all",
    aliasId: "all",
    range: "7d",
  });

  return (
    <div className="flex flex-col">
      <FilterBar
        filters={filters}
        domains={MOCK_DOMAINS}
        aliases={MOCK_ALIASES}
        onChange={setFilters}
      />
      <StatCards filters={filters} />
      <div className="py-4 grid grid-cols-5 gap-4 items-stretch">
        <div className="col-span-3">
            <TicketVolumeChart domains={MOCK_DOMAINS} aliases={MOCK_ALIASES} />
        </div>
        <div className="col-span-2">
            <StatusBreakdownChart domains={MOCK_DOMAINS} aliases={MOCK_ALIASES} />
        </div>
      </div>
      <NeedsAttentionTable filters={filters} />
    </div>
  );
}