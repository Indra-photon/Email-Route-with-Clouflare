"use client";

import AnimatedDropdown from "@/components/ui/AnimatedDropdown";
import {
  IconWorld,
  IconAt,
  IconCalendarWeek,
  IconCalendar,
  IconCalendarMonth,
} from "@tabler/icons-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type DateRange = "7d" | "14d" | "30d";

export interface FilterState {
  domainId: string;
  aliasId:  string;
  range:    DateRange;
}

export interface DomainOption {
  id:    string;
  label: string;
}

export interface AliasOption {
  id:       string;
  label:    string;
  domainId: string;
}


// ── FilterBar ─────────────────────────────────────────────────────────────────

interface FilterBarProps {
  filters:  FilterState;
  domains:  DomainOption[];
  aliases:  AliasOption[];
  onChange: (next: FilterState) => void;
}

export function FilterBar({ filters, domains, aliases, onChange }: FilterBarProps) {
  // Cascade: only show aliases under selected domain
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
    // Reset alias when domain changes
    onChange({ ...filters, domainId, aliasId: "all" });
  }

  return (
    <div className="flex flex-wrap items-center gap-4 py-4">

      <span className="text-base font-schibsted font-semibold text-neutral-500 mr-1">
        Filter by:
      </span>

      <AnimatedDropdown
        options={domainOptions}
        value={filters.domainId}
        onChange={handleDomainChange}
        placeholder="All Domains"
        width="w-52"
      />

      <AnimatedDropdown
        options={aliasOptions}
        value={filters.aliasId}
        onChange={(aliasId) => onChange({ ...filters, aliasId })}
        placeholder="All Aliases"
        width="w-64"
        disabled={domainOptions.length === 1}
      />

      {/* Visual divider before date range */}
      <div className="h-6 w-px bg-neutral-200" />

      <AnimatedDropdown
        options={rangeOptions}
        value={filters.range}
        onChange={(range) => onChange({ ...filters, range: range as DateRange })}
        placeholder="Last 7 days"
        width="w-40"
      />

    </div>
  );
}