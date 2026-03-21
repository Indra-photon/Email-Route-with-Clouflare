import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HelpSlideOver } from "@/components/HelpSlideOver";
import DashboardNav from "@/components/dashboard/DashboardNav";
import AgentPresenceProvider from "@/components/dashboard/AgentPresenceProvider";
<<<<<<< HEAD
import { Container } from "@/components/Container";
=======
import { DashboardSubscriptionGuard } from "@/components/dashboard/DashboardSubscriptionGuard";
import { PlanGuardProvider } from "@/components/billing/PlanGuardProvider";
>>>>>>> master

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="max-w-9xl mx-auto">
      <AgentPresenceProvider />
<<<<<<< HEAD
      <DashboardNav>{children}</DashboardNav>
    </div>
=======
      <PlanGuardProvider>
        <DashboardNav>{children}</DashboardNav>
      </PlanGuardProvider>
      {/* Mounts the ExpiryWarningPopup on every dashboard page (client-side) */}
      <DashboardSubscriptionGuard />
    </>
>>>>>>> master
  );
}
