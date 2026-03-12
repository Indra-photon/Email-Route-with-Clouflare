import { Card, CardContent } from "@/components/ui/card";

function SkeletonAliasCard() {
  return (
    <Card className="bg-neutral-50 rounded-xl">
      <CardContent className="p-4 flex items-center gap-4">
        {/* Icon placeholder */}
        <div className="shrink-0 w-8 h-8 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse" />

        {/* Email + badge placeholder */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-3.5 w-52 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          <div className="h-3 w-16 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        </div>

        {/* Chevron placeholder */}
        <div className="shrink-0 w-7 h-7 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse" />

        {/* Delete button placeholder */}
        <div className="shrink-0 w-7 h-7 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      </CardContent>
    </Card>
  );
}

export default function AliasesPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-5 w-64 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        <div className="h-3.5 w-96 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      </div>

      {/* Form placeholder — local part + domain + integration + button */}
      <div className="flex items-end gap-2">
        <div className="space-y-1">
          <div className="h-3 w-16 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          <div className="h-9 w-40 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-14 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          <div className="h-9 w-48 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-20 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          <div className="h-9 w-48 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        </div>
        <div className="h-9 w-16 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      </div>

      {/* Cards */}
      <div className="pt-3 pb-3">
        <Card className="min-h-[120px] p-4 space-y-2">
          <div className="h-4 w-36 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse mb-4" />
          <SkeletonAliasCard />
          <SkeletonAliasCard />
          <SkeletonAliasCard />
        </Card>
      </div>
    </div>
  );
}