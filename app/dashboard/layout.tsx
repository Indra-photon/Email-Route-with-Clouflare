import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HelpSlideOver } from "@/components/HelpSlideOver";
import DashboardNav from "@/components/dashboard/DashboardNav";
import AgentPresenceProvider from "@/components/dashboard/AgentPresenceProvider";
import { DashboardSubscriptionGuard } from "@/components/dashboard/DashboardSubscriptionGuard";
import { PlanGuardProvider } from "@/components/billing/PlanGuardProvider";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <>
      <AgentPresenceProvider />
      <PlanGuardProvider>
        <DashboardNav>{children}</DashboardNav>
      </PlanGuardProvider>
      {/* Mounts the ExpiryWarningPopup on every dashboard page (client-side) */}
      <DashboardSubscriptionGuard />
    </>
  );
}
