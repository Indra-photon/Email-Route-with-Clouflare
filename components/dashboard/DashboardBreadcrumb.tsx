// "use client";

// import { usePathname } from "next/navigation";
// import {
//   IconLayoutDashboard,
//   IconMail,
//   IconMessages,
//   IconGlobe,
//   IconAiGateway,
//   IconAt,
//   IconMessageCircle,
//   IconCreditCard,
//   IconUser,
//   IconChevronRight,
//   type Icon as TablerIcon,
// } from "@tabler/icons-react";

// type RouteConfig = {
//   label: string;       // nav label shown in breadcrumb
//   group: string;       // nav group label e.g. "OVERVIEW"
//   icon: TablerIcon;
//   href: string;        // canonical href to link back to
// };

// // Mirrors navGroups in DashboardNav exactly.
// // Key = the pathname this entry matches (startsWith for non-exact, === for exact).
// const ROUTE_MAP: RouteConfig[] = [
//   { href: "/dashboard",              label: "Dashboard",    group: "OVERVIEW",   icon: IconLayoutDashboard },
//   { href: "/dashboard/tickets/mine", label: "My Tickets",   group: "MANAGE",     icon: IconMail },
//   { href: "/dashboard/live-chats",   label: "Live Chats",   group: "MANAGE",     icon: IconMessages },
//   { href: "/dashboard/domains",      label: "Domains",      group: "CONFIGURE",  icon: IconGlobe },
//   { href: "/dashboard/integrations", label: "Integrations", group: "CONFIGURE",  icon: IconAiGateway },
//   { href: "/dashboard/aliases",      label: "Aliases",      group: "CONFIGURE",  icon: IconAt },
//   { href: "/dashboard/chat-widgets", label: "Chat Widgets", group: "CONFIGURE",  icon: IconMessageCircle },
//   { href: "/dashboard/billing",      label: "Billing",      group: "ACCOUNT",    icon: IconCreditCard },
//   { href: "/profile",                label: "Profile",      group: "ACCOUNT",    icon: IconUser },
// ];

// export function DashboardBreadcrumb() {
//   const pathname = usePathname();

//   // Find longest matching route (most specific wins)
//   const matched = ROUTE_MAP.filter((r) =>
//     r.href === "/dashboard"
//       ? pathname === "/dashboard"
//       : pathname === r.href || pathname.startsWith(r.href + "/")
//   ).sort((a, b) => b.href.length - a.href.length)[0];

//   const route = matched ?? ROUTE_MAP[0];
//   const Icon = route.icon;

//   // "MANAGE" → "Manage"
//   const groupLabel = route.group.charAt(0) + route.group.slice(1).toLowerCase();
//   const isTopLevel = route.group === "OVERVIEW";

//   return (
//     <div className="flex items-center gap-2 px-6 h-14 border-b border-neutral-200 bg-neutral-50 shrink-0">
//       <Icon size={16} className="text-neutral-400" strokeWidth={1.75} />

//       {isTopLevel ? (
//         <span className="text-sm font-medium text-neutral-700">{route.label}</span>
//       ) : (
//         <>
//           <span className="text-sm text-neutral-400">{groupLabel}</span>
//           <IconChevronRight size={13} className="text-neutral-300" />
//           <span className="text-sm font-medium text-neutral-700">{route.label}</span>
//         </>
//       )}
//     </div>
//   );
// }


"use client";

import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconMail,
  IconMessages,
  IconGlobe,
  IconAiGateway,
  IconAt,
  IconMessageCircle,
  IconCreditCard,
  IconUser,
  IconChevronRight,
  IconRefresh,
  type Icon as TablerIcon,
} from "@tabler/icons-react";
import { useRefreshStore } from "@/components/dashboard/right-panel/useRefresh";

type RouteConfig = {
  label: string;
  group: string;
  icon: TablerIcon;
  href: string;
};

const ROUTE_MAP: RouteConfig[] = [
  { href: "/dashboard",              label: "Dashboard",    group: "OVERVIEW",  icon: IconLayoutDashboard },
  { href: "/dashboard/tickets/mine", label: "My Tickets",   group: "MANAGE",    icon: IconMail },
  { href: "/dashboard/live-chats",   label: "Live Chats",   group: "MANAGE",    icon: IconMessages },
  { href: "/dashboard/domains",      label: "Domains",      group: "CONFIGURE", icon: IconGlobe },
  { href: "/dashboard/integrations", label: "Integrations", group: "CONFIGURE", icon: IconAiGateway },
  { href: "/dashboard/aliases",      label: "Aliases",      group: "CONFIGURE", icon: IconAt },
  { href: "/dashboard/chat-widgets", label: "Chat Widgets", group: "CONFIGURE", icon: IconMessageCircle },
  { href: "/dashboard/billing",      label: "Billing",      group: "ACCOUNT",   icon: IconCreditCard },
  { href: "/profile",                label: "Profile",      group: "ACCOUNT",   icon: IconUser },
];

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const triggerRefresh = useRefreshStore((s) => s.triggerRefresh);
  const isAnyLoading = useRefreshStore((s) => s.isAnyLoading);
  const spinning = isAnyLoading();

  const matched = ROUTE_MAP.filter((r) =>
    r.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === r.href || pathname.startsWith(r.href + "/")
  ).sort((a, b) => b.href.length - a.href.length)[0];

  const route = matched ?? ROUTE_MAP[0];
  const Icon = route.icon;
  const groupLabel = route.group.charAt(0) + route.group.slice(1).toLowerCase();
  const isTopLevel = route.group === "OVERVIEW";

  return (
    <div className="flex items-center justify-between px-6 h-14 border-b border-neutral-200 bg-neutral-50 shrink-0">
      {/* Left — breadcrumb */}
      <div className="flex items-center gap-2.5">
        <Icon
          size={14}
          strokeWidth={2}
          className="text-neutral-300 shrink-0"
        />
        {isTopLevel ? (
          <span className="font-sans text-sm font-semibold tracking-tight text-neutral-800">
            {route.label}
          </span>
        ) : (
          <>
            <span className="font-sans text-[11px] font-medium tracking-[0.055em] uppercase text-neutral-400">
              {groupLabel}
            </span>
            <IconChevronRight size={11} strokeWidth={2.5} className="text-neutral-300 shrink-0" />
            <span className="font-sans text-sm font-semibold tracking-tight text-neutral-800">
              {route.label}
            </span>
          </>
        )}
      </div>

      {/* Right — refresh button */}
      <button
        onClick={triggerRefresh}
        disabled={spinning}
        title="Refresh panel"
        className="flex items-center justify-center size-7 rounded-md border border-neutral-200 bg-white hover:bg-neutral-100 hover:border-neutral-300 transition-all duration-150 disabled:opacity-40 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]"
      >
        <IconRefresh
          size={13}
          strokeWidth={2.25}
          className={`transition-colors duration-150 ${spinning ? "animate-spin text-sky-500" : "text-neutral-400 hover:text-neutral-600"}`}
        />
      </button>
    </div>
  );
}