"use client";

interface StatusFilterProps {
  currentFilter: string;
  counts: {
    all: number;
    open: number;
    in_progress: number;
    waiting: number;
    resolved: number;
  };
  onFilterChange: (filter: string) => void;
}

export default function StatusFilter({
  currentFilter,
  counts,
  onFilterChange
}: StatusFilterProps) {
  const filters = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'open', label: '🆕 Open', count: counts.open },
    { key: 'in_progress', label: '🔄 In Progress', count: counts.in_progress },
    { key: 'waiting', label: '⏸️ Waiting', count: counts.waiting },
    { key: 'resolved', label: '✅ Resolved', count: counts.resolved },
  ];

  return (
    <div className="flex gap-2 flex-wrap border-b border-neutral-200 dark:border-neutral-700 pb-4 mb-4">
      {filters.map(filter => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentFilter === filter.key
              ? 'bg-blue-600 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
          }`}
        >
          {filter.label}
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
            currentFilter === filter.key
              ? 'bg-blue-500'
              : 'bg-neutral-200 dark:bg-neutral-700'
          }`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
}
