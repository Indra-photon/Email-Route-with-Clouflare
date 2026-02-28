import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Skeleton Card 1 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24 bg-neutral-200" />
          <Skeleton className="size-4 rounded bg-neutral-200" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 bg-neutral-200" />
          <Skeleton className="mt-2 h-4 w-32 bg-neutral-200" />
        </CardContent>
      </Card>

      {/* Skeleton Card 2 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-28 bg-neutral-200" />
          <Skeleton className="size-4 rounded bg-neutral-200" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 bg-neutral-200" />
          <Skeleton className="mt-2 h-4 w-36 bg-neutral-200" />
        </CardContent>
      </Card>

      {/* Skeleton Card 3 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-32 bg-neutral-200" />
          <Skeleton className="size-4 rounded bg-neutral-200" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-12 bg-neutral-200" />
          <Skeleton className="mt-2 h-4 w-28 bg-neutral-200" />
        </CardContent>
      </Card>

      {/* Skeleton Card 4 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20 bg-neutral-200" />
          <Skeleton className="size-4 rounded bg-neutral-200" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-10 bg-neutral-200" />
          <Skeleton className="mt-2 h-4 w-24 bg-neutral-200" />
        </CardContent>
      </Card>
    </div>
  );
}