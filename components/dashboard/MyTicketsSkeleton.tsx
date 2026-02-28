import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyTicketsSkeleton() {
  return (
    <>
      {/* Refresh Button Skeleton */}
      <div className="mb-6 flex justify-end">
        <Skeleton className="h-10 w-28 bg-neutral-200" />
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="mb-6 flex gap-2 border-b border-neutral-200 pb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-24 bg-neutral-200" />
        ))}
      </div>

      {/* Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-neutral-200" />
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-neutral-200">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="py-4">
                <Skeleton className="h-4 w-48 bg-neutral-200" />
                <Skeleton className="mt-2 h-4 w-full bg-neutral-200" />
                <div className="mt-3 flex items-center gap-3">
                  <Skeleton className="h-6 w-20 rounded-full bg-neutral-200" />
                  <Skeleton className="h-3 w-16 bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}