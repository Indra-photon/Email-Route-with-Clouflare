import { Suspense } from "react";
import { Heading } from "@/components/Heading";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail } from "lucide-react";
import UnassignedTicketsContent from "@/components/dashboard/UnassignedTicketsContent";
import UnassignedTicketsSkeleton from "@/components/dashboard/UnassignedTicketsSkeleton";

// ✅ ISR: Page cached for 30 seconds (faster revalidation for unassigned tickets)
export const revalidate = 30;

export default async function UnassignedTicketsPage() {
  return (
    <Container className="py-8">
      {/* Header - Renders immediately */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Heading as="h1" className="text-neutral-900">
            Unassigned Tickets
          </Heading>
          <p className="mt-2 text-base text-neutral-600 font-schibsted font-normal">
            Tickets waiting to be claimed by team members
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild className="font-schibsted font-medium">
            <Link href="/dashboard/tickets/mine">
              <Mail className="mr-2 size-4" />
              My Tickets
            </Link>
          </Button>
        </div>
      </div>

      {/* ✅ Suspense: Shows skeleton while data loads */}
      <Suspense fallback={<UnassignedTicketsSkeleton />}>
        <UnassignedTicketsContent />
      </Suspense>
    </Container>
  );
}