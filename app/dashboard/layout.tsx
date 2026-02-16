import { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HelpSlideOver } from "@/components/HelpSlideOver";

type DashboardLayoutProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/tickets/mine", label: "My Tickets", icon: "📧" },
  { href: "/dashboard/tickets/unassigned", label: "Unassigned", icon: "📥" },
  { href: "/dashboard/domains", label: "Domains", icon: "🌐" },
  { href: "/dashboard/aliases", label: "Aliases", icon: "📮" },
  { href: "/dashboard/integrations", label: "Integrations", icon: "🔗" },
];

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <aside className="w-56 border-r border-neutral-200 bg-neutral-50 px-4 py-6">
        <h2 className="mb-6 text-lg font-semibold">Email Router</h2>
        <nav>
          <ul className="space-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 px-6 py-6">{children}</main>
      <HelpSlideOver />
    </div>
  );
}

