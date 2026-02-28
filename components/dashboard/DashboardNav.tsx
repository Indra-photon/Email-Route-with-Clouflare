"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// Lucide icons
import {
  LayoutDashboard,
  Mail,
  Inbox,
  Globe,
  AtSign,
  Zap,
  Menu,
  X,
} from "lucide-react";

import { IconMail, IconDashboard, IconInbox, IconGlobe, IconAtSign, IconZap } from "@/constants/icons";
import { IconMessageCircle, IconMessages } from "@tabler/icons-react";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: IconDashboard,
    exact: true,
  },
  {
    href: "/dashboard/tickets/mine",
    label: "My Tickets",
    icon: IconMail,
  },
  {
    href: "/dashboard/tickets/unassigned",
    label: "Unassigned",
    icon: IconInbox,
  },
  {
    href: "/dashboard/domains",
    label: "Domains",
    icon: IconGlobe,
  },
  {
    href: "/dashboard/aliases",
    label: "Aliases",
    icon: IconAtSign,
  },
  {
    href: "/dashboard/integrations",
    label: "Integrations",
    icon: IconZap,
  },
  {
    href: "/dashboard/chat-widgets",
    label: "Chat Widgets",
    icon: null,
    tablerIcon: IconMessageCircle,
  },
  {
    href: "/dashboard/live-chats",
    label: "Live Chats",
    icon: null,
    tablerIcon: IconMessages,
  },
];

export default function DashboardNav({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const NavLinks = () => (
    <ul className="space-y-1">
      {navItems.map((item) => {
        const active = isActive(item.href, item.exact);
        const [isHovered, setIsHovered] = useState(false);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-schibsted font-regular transition-all duration-150 ${active
                ? "bg-sky-100 text-sky-800 font-semibold"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {item.tablerIcon ? (
                <item.tablerIcon
                  size={20}
                  className={`shrink-0 ${active ? "text-sky-800" : "text-neutral-600"}`}
                />
              ) : item.icon ? (
                <item.icon
                  className={`size-5 ${active ? "text-sky-800" : "text-neutral-600"}`}
                  isAnimating={isHovered}
                />
              ) : null}
              <span className="text-sm">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="min-h-dvh flex">
      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-5 left-4 z-50 size-10 bg-white border border-neutral-200 rounded-lg flex items-center justify-center shadow-sm hover:bg-neutral-50 transition-colors"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <X className="size-5 text-neutral-900" />
        ) : (
          <Menu className="size-5 text-neutral-900" />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop always visible, mobile slide-in */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto z-40 w-64 border-r border-neutral-200 bg-white px-4 py-6 transition-transform duration-200 md:translate-x-0 ${mobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
          }`}
      >
        {/* Logo/Brand */}
        <div className="mb-8 flex items-center gap-2 px-3">
          <div className="rounded-lg bg-sky-100 p-2">
            <Mail className="size-5 text-sky-800" />
          </div>
          <h2 className="text-lg font-schibsted font-semibold text-neutral-900">
            Email Router
          </h2>
        </div>

        {/* Navigation */}
        <nav>
          <NavLinks />
        </nav>

        {/* Bottom section - User info or help link (optional) */}
        <div className="mt-8 px-3">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <p className="text-xs font-schibsted font-medium text-neutral-900 mb-1">
              Need Help?
            </p>
            <Link
              href="/docs"
              className="text-xs font-schibsted font-normal text-sky-800 hover:text-sky-900 transition-colors"
            >
              View Documentation →
            </Link>
          </div>
        </div>
      </aside>

      {/* Page content */}
      <main className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-6 bg-neutral-50">
        {children}
      </main>
    </div>
  );
}