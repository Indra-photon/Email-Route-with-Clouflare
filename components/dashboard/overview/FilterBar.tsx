"use client";

import AnimatedDropdown from "@/components/ui/AnimatedDropdown";

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
    { value: "all", label: "All Domains" },
    ...domains.map((d) => ({ value: d.id, label: d.label })),
  ];

  const aliasOptions = [
    { value: "all", label: "All Aliases" },
    ...visibleAliases.map((a) => ({ value: a.id, label: a.label })),
  ];

  const rangeOptions = [
    { value: "7d",  label: "Last 7 days"  },
    { value: "14d", label: "Last 14 days" },
    { value: "30d", label: "Last 30 days" },
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