"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊", exact: true },
    { href: "/dashboard/tickets/mine", label: "My Tickets", icon: "📧" },
    { href: "/dashboard/tickets/unassigned", label: "Unassigned", icon: "📥" },
    { href: "/dashboard/domains", label: "Domains", icon: "🌐" },
    { href: "/dashboard/aliases", label: "Aliases", icon: "📮" },
    { href: "/dashboard/integrations", label: "Integrations", icon: "🔗" },
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
        <ul className="space-y-1 text-sm">
            {navItems.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 font-medium transition-colors ${active
                                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-semibold"
                                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                                }`}
                        >
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );

    return (
        <div className="min-h-[calc(100vh-4rem)] flex">
            {/* Mobile hamburger */}
            <button
                className="md:hidden fixed top-[18px] left-4 z-50 w-9 h-9 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg flex items-center justify-center shadow text-base"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
            >
                {mobileOpen ? "✕" : "☰"}
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
                className={`fixed md:static top-0 left-0 h-full md:h-auto z-40 w-56 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-6 transition-transform duration-200 md:translate-x-0 ${mobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
                    }`}
            >
                <h2 className="mb-6 text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <span className="text-indigo-600">✉</span> Email Router
                </h2>
                <nav>
                    <NavLinks />
                </nav>
            </aside>

            {/* Page content */}
            <main className="flex-1 min-w-0 px-4 md:px-6 py-6">
                {children}
            </main>
        </div>
    );
}
