"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/receiving-requests", label: "Receiving Requests", icon: "📬", showBadge: true },
  { href: "/admin/domains", label: "All Domains", icon: "🌐" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️", divider: true },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/receiving-requests?status=pending")
      .then((r) => r.json())
      .then((data) => setPendingCount(data.total ?? 0))
      .catch(() => { });
  }, [pathname]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  const NavLinks = () => (
    <nav className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 p-4">
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li
            key={item.href}
            className={cn(item.divider && "pt-4 border-t border-neutral-200 dark:border-neutral-700")}
          >
            <Link
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive(item.href)
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-semibold"
                  : item.divider
                    ? "text-neutral-500 dark:text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-400"
              )}
            >
              <span>
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </span>
              {item.showBadge && pendingCount !== null && pendingCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold rounded-full bg-amber-500 text-white">
                  {pendingCount > 99 ? "99+" : pendingCount}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="lg:hidden fixed top-[18px] left-4 z-50 w-9 h-9 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg flex items-center justify-center shadow text-lg"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar — always visible */}
      <aside className="hidden lg:block w-64 flex-shrink-0 space-y-4">
        <NavLinks />
      </aside>

      {/* Mobile sidebar — slide-in drawer */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full z-40 w-64 pt-16 px-4 pb-4 bg-neutral-100 dark:bg-neutral-950 space-y-4 shadow-xl transition-transform duration-200 overflow-y-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavLinks />
      </aside>
    </>
  );
}
