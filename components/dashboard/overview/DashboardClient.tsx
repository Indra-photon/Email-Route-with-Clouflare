"use client";

import { useEffect, useState } from "react";
import { FilterBar, FilterState } from "./FilterBar";
import type { DomainOption, AliasOption } from "./FilterBar";
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

  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [aliases, setAliases] = useState<AliasOption[]>([]);

  // Fetch real domains & aliases once on mount
  useEffect(() => {
    async function load() {
      try {
        const [domainsRes, aliasesRes] = await Promise.all([
          fetch("/api/domains"),
          fetch("/api/aliases"),
        ]);

        if (domainsRes.ok) {
          const data = await domainsRes.json();
          setDomains(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.map((d: any) => ({ id: d.id, label: d.domain }))
          );
        }

        if (aliasesRes.ok) {
          const data = await aliasesRes.json();
          setAliases(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.map((a: any) => ({
              id:       a.id,
              label:    a.email,
              domainId: a.domainId ?? "unknown",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load domains/aliases for dashboard filters", err);
      }
    }
    load();
  }, []);

  return (
    <div className="flex flex-col">
      <FilterBar
        filters={filters}
        domains={domains}
        aliases={aliases}
        onChange={setFilters}
      />
      <StatCards filters={filters} />
      <div className="py-4 grid grid-cols-5 gap-4 items-stretch">
        <div className="col-span-3">
            <TicketVolumeChart domains={domains} aliases={aliases} />
        </div>
        <div className="col-span-2">
            <StatusBreakdownChart domains={domains} aliases={aliases} />
        </div>
      </div>
      <NeedsAttentionTable filters={filters} />
    </div>
  );
}