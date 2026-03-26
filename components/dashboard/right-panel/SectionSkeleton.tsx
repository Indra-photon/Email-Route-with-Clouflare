export function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 px-4 py-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          {/* Avatar/icon placeholder */}
          <div className="size-7 rounded-full bg-neutral-100 animate-pulse shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1.5">
            <div
              className="h-3 bg-neutral-100 animate-pulse rounded"
              style={{ width: `${65 + (i % 3) * 10}%` }}
            />
            <div
              className="h-2.5 bg-neutral-100 animate-pulse rounded"
              style={{ width: `${40 + (i % 2) * 15}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}