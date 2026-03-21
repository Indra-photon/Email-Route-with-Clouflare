import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HelpSlideOver } from "@/components/HelpSlideOver";
import DashboardNav from "@/components/dashboard/DashboardNav";
import AgentPresenceProvider from "@/components/dashboard/AgentPresenceProvider";
import { Container } from "@/components/Container";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="max-w-9xl mx-auto">
      <AgentPresenceProvider />
      <DashboardNav>{children}</DashboardNav>
    </div>
  );
}
