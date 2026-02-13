import { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type DashboardLayoutProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/domains", label: "Domains" },
  { href: "/dashboard/aliases", label: "Aliases" },
  { href: "/dashboard/integrations", label: "Integrations" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { userId } = auth();

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
                  className="block rounded-md px-3 py-2 text-neutral-700 hover:bg-neutral-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 px-6 py-6">{children}</main>
    </div>
  );
}

