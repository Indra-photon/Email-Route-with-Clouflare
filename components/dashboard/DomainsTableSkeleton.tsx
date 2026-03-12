import { Card, CardContent } from "@/components/ui/card";

function SkeletonCard() {
  return (
    <Card className="bg-neutral-100 rounded-xl">
      <CardContent className="p-4 flex items-center gap-4">
        {/* Icon placeholder */}
        <div className="shrink-0 w-8 h-8 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse" />

        {/* Domain name + badge placeholder */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-3.5 w-48 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          <div className="h-3 w-24 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        </div>

        {/* Chevron placeholder */}
        <div className="shrink-0 w-7 h-7 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse" />

        {/* Delete button placeholder */}
        <div className="shrink-0 w-7 h-7 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      </CardContent>
    </Card>
  );
}

export default function DomainsTableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-5 w-40 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        <div className="h-3.5 w-72 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      </div>

      {/* Form placeholder */}
      <div className="h-10 w-full rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />

      {/* Cards */}
      <Card className="min-h-[120px] overflow-hidden p-4 space-y-2">
        <div className="h-4 w-32 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse mb-4" />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </Card>
    </div>
  );
}