"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: "📊",
  },
  {
    href: "/admin/receiving-requests",
    label: "Receiving Requests",
    icon: "📬",
  },
  {
    href: "/admin/domains",
    label: "All Domains",
    icon: "🌐",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: "⚙️",
    divider: true,
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 p-4">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href} className={cn(item.divider && "pt-4 border-t border-neutral-200 dark:border-neutral-700")}>
            <Link
              href={item.href}
              className={cn(
                "block px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive(item.href)
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                  : item.divider
                  ? "text-neutral-500 dark:text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-400"
              )}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
