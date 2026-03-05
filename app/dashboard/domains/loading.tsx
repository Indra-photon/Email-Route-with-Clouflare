export default function DomainsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-36 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
        <div className="h-4 w-72 bg-neutral-200 dark:bg-neutral-700 rounded-md mt-2" />
      </div>

      {/* Add domain form skeleton */}
      <div className="flex gap-2 max-w-md">
        <div className="flex-1 h-9 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
        <div className="w-28 h-9 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
      </div>

      {/* Table skeleton */}
      <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="bg-neutral-50 dark:bg-neutral-800 px-4 py-3 grid grid-cols-5 gap-4">
          {["Domain", "Status", "Receiving", "Added", "Actions"].map((col) => (
            <div key={col} className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16" />
          ))}
        </div>

        {/* Table rows */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="border-t border-neutral-200 dark:border-neutral-700 px-4 py-3 grid grid-cols-5 gap-4 items-center"
          >
            {/* Domain */}
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-36" />
            {/* Status badge */}
            <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded-full w-20" />
            {/* Receiving */}
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-8" />
            {/* Date */}
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20" />
            {/* Actions */}
            <div className="flex gap-2">
              <div className="h-7 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
              <div className="h-7 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}