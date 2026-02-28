import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentActivitySkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-6 w-32 bg-neutral-200" />
        <Skeleton className="h-8 w-24 bg-neutral-200" />
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-neutral-200">
          {/* Skeleton Row 1 */}
          <div className="py-4">
            <Skeleton className="h-4 w-48 bg-neutral-200" />
            <Skeleton className="mt-2 h-4 w-full bg-neutral-200" />
            <div className="mt-3 flex items-center gap-3">
              <Skeleton className="h-6 w-20 rounded-full bg-neutral-200" />
              <Skeleton className="h-3 w-16 bg-neutral-200" />
            </div>
          </div>

          {/* Skeleton Row 2 */}
          <div className="py-4">
            <Skeleton className="h-4 w-40 bg-neutral-200" />
            <Skeleton className="mt-2 h-4 w-full bg-neutral-200" />
            <div className="mt-3 flex items-center gap-3">
              <Skeleton className="h-6 w-24 rounded-full bg-neutral-200" />
              <Skeleton className="h-3 w-20 bg-neutral-200" />
            </div>
          </div>

          {/* Skeleton Row 3 */}
          <div className="py-4">
            <Skeleton className="h-4 w-44 bg-neutral-200" />
            <Skeleton className="mt-2 h-4 w-full bg-neutral-200" />
            <div className="mt-3 flex items-center gap-3">
              <Skeleton className="h-6 w-16 rounded-full bg-neutral-200" />
              <Skeleton className="h-3 w-24 bg-neutral-200" />
            </div>
          </div>

          {/* Skeleton Row 4 */}
          <div className="py-4">
            <Skeleton className="h-4 w-52 bg-neutral-200" />
            <Skeleton className="mt-2 h-4 w-full bg-neutral-200" />
            <div className="mt-3 flex items-center gap-3">
              <Skeleton className="h-6 w-28 rounded-full bg-neutral-200" />
              <Skeleton className="h-3 w-16 bg-neutral-200" />
            </div>
          </div>

          {/* Skeleton Row 5 */}
          <div className="py-4">
            <Skeleton className="h-4 w-36 bg-neutral-200" />
            <Skeleton className="mt-2 h-4 w-full bg-neutral-200" />
            <div className="mt-3 flex items-center gap-3">
              <Skeleton className="h-6 w-20 rounded-full bg-neutral-200" />
              <Skeleton className="h-3 w-20 bg-neutral-200" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}