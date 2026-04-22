import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

// Custom components
import { Heading } from "@/components/Heading";
import { Container } from "@/components/Container";
import { DashboardClient } from "@/components/dashboard/overview/DashboardClient";

// Shadcn UI components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import optimized components (we'll create these next)
import StatsCards from "@/components/dashboard/StatsCards";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";

// Import skeletons
import StatsCardsSkeleton from "@/components/dashboard/StatsCardsSkeleton";
import RecentActivitySkeleton from "@/components/dashboard/RecentActivitySkeleton";

// ✅ ISR: Revalidate every 60 seconds
// Dashboard is pre-rendered and cached at edge
// Background refresh happens every 60s automatically
export const revalidate = 60;

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-dvh">
      <div className="py-0">
        {/* <Heading className="text-neutral-900">
          Welcome back, <span className="text-neutral-900">Indranil</span>!
        </Heading> */}

        <DashboardClient />
      </div>
    </div>
  );
}
