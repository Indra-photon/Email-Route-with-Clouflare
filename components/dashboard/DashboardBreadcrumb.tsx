
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
//   IconRefresh,
//   IconTemplate,
//   type Icon as TablerIcon,
// } from "@tabler/icons-react";
// import { useRefreshStore } from "@/components/dashboard/right-panel/useRefresh";

// type RouteConfig = {
//   label: string;
//   group: string;
//   icon: TablerIcon;
//   href: string;
// };

// const ROUTE_MAP: RouteConfig[] = [
//   { href: "/dashboard",                   label: "Dashboard",       group: "OVERVIEW",  icon: IconLayoutDashboard },
//   { href: "/dashboard/tickets/mine",      label: "My Tickets",      group: "MANAGE",    icon: IconMail },
//   { href: "/dashboard/live-chats",        label: "Live Chats",      group: "MANAGE",    icon: IconMessages },
//   { href: "/dashboard/domains",           label: "Domains",         group: "CONFIGURE", icon: IconGlobe },
//   { href: "/dashboard/integrations",      label: "Integrations",    group: "CONFIGURE", icon: IconAiGateway },
//   { href: "/dashboard/aliases",           label: "Aliases",         group: "CONFIGURE", icon: IconAt },
//   { href: "/dashboard/chat-widgets",      label: "Chat Widgets",    group: "CONFIGURE", icon: IconMessageCircle },
//   { href: "/dashboard/email-templates",   label: "Email Templates", group: "CONFIGURE", icon: IconTemplate },
//   { href: "/dashboard/billing",           label: "Billing",         group: "ACCOUNT",   icon: IconCreditCard },
//   { href: "/profile",                     label: "Profile",         group: "ACCOUNT",   icon: IconUser },
// ];

// export function DashboardBreadcrumb() {
//   const pathname = usePathname();
//   const triggerRefresh = useRefreshStore((s) => s.triggerRefresh);
//   const isAnyLoading = useRefreshStore((s) => s.isAnyLoading);
//   const spinning = isAnyLoading();

//   const matched = ROUTE_MAP.filter((r) =>
//     r.href === "/dashboard"
//       ? pathname === "/dashboard"
//       : pathname === r.href || pathname.startsWith(r.href + "/")
//   ).sort((a, b) => b.href.length - a.href.length)[0];

//   const route = matched ?? ROUTE_MAP[0];
//   const Icon = route.icon;
//   const groupLabel = route.group.charAt(0) + route.group.slice(1).toLowerCase();
//   const isTopLevel = route.group === "OVERVIEW";

//   return (
//     <div className="flex items-center justify-between px-6 h-14 border-b border-neutral-200 bg-neutral-50 shrink-0">
//       {/* Left — breadcrumb */}
//       <div className="flex items-center gap-2.5">
//         <Icon
//           size={14}
//           strokeWidth={2}
//           className="text-neutral-300 shrink-0"
//         />
//         {isTopLevel ? (
//           <span className="font-sans text-sm font-semibold tracking-tight text-neutral-800">
//             {route.label}
//           </span>
//         ) : (
//           <>
//             <span className="font-sans text-[11px] font-medium tracking-[0.055em] uppercase text-neutral-400">
//               {groupLabel}
//             </span>
//             <IconChevronRight size={11} strokeWidth={2.5} className="text-neutral-300 shrink-0" />
//             <span className="font-sans text-sm font-semibold tracking-tight text-neutral-800">
//               {route.label}
//             </span>
//           </>
//         )}
//       </div>

//       {/* Right — refresh button */}
//       <button
//         onClick={triggerRefresh}
//         disabled={spinning}
//         title="Refresh panel"
//         className="flex items-center justify-center size-7 rounded-md border border-neutral-200 bg-white hover:bg-neutral-100 hover:border-neutral-300 transition-all duration-150 disabled:opacity-40 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]"
//       >
//         <IconRefresh
//           size={13}
//           strokeWidth={2.25}
//           className={`transition-colors duration-150 ${spinning ? "animate-spin text-sky-500" : "text-neutral-400 hover:text-neutral-600"}`}
//         />
//       </button>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  IconSearch,
  IconBell,
  IconInfoCircle,
  IconChevronDown,
  IconRefresh,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/lib/store";
import { useRefreshStore } from "@/components/dashboard/right-panel/useRefresh";

// ─── Greeting helper ──────────────────────────────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Search bar ───────────────────────────────────────────────────────────────
function SearchBar() {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`
        flex items-center gap-2 h-9 px-3 rounded-xl border bg-neutral-50
        transition-all duration-150
        ${focused
          ? "border-sky-400 bg-white shadow-sm shadow-sky-100 w-52"
          : "border-neutral-200 hover:border-neutral-300 w-44"
        }
      `}
    >
      <IconSearch
        size={14}
        className={`shrink-0 transition-colors duration-150 ${
          focused ? "text-sky-500" : "text-neutral-400"
        }`}
      />
      <input
        type="text"
        placeholder="Search..."
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 text-sm font-schibsted bg-transparent outline-none text-neutral-700 placeholder:text-neutral-400 min-w-0"
      />
    </div>
  );
}

// ─── Icon button ──────────────────────────────────────────────────────────────
function IconBtn({
  children,
  badge,
}: {
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <button className="relative flex items-center justify-center size-9 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-300 hover:shadow-sm transition-all duration-150">
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-0.5 rounded-full bg-red-500 text-white text-[9px] font-schibsted font-bold leading-none">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}

// ─── User pill ────────────────────────────────────────────────────────────────
function UserPill() {
  const user = useUserStore((s) => s.user);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Link
      href="/profile"
      className="flex items-center gap-2.5 h-9 pl-1.5 pr-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-300 hover:shadow-sm transition-all duration-150"
    >
      <Avatar className="size-6 shrink-0">
        <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
        <AvatarFallback className="bg-sky-700 text-white text-[10px] font-schibsted font-semibold">
          {getInitials(user?.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-schibsted font-semibold text-neutral-800 truncate max-w-[110px] leading-tight">
          {user?.name || "User"}
        </span>
        <span className="text-[10px] font-schibsted text-neutral-400 truncate max-w-[110px] leading-tight">
          {user?.email || ""}
        </span>
      </div>
      <IconChevronDown size={12} className="text-neutral-400 shrink-0" />
    </Link>
  );
}

// ─── Refresh button (kept for right-panel compatibility) ──────────────────────
function RefreshBtn() {
  const triggerRefresh = useRefreshStore((s) => s.triggerRefresh);
  const isAnyLoading = useRefreshStore((s) => s.isAnyLoading);
  const spinning = isAnyLoading();

  return (
    <button
      onClick={triggerRefresh}
      disabled={spinning}
      title="Refresh panel"
      className="flex items-center justify-center size-9 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-300 hover:shadow-sm transition-all duration-150 disabled:opacity-40"
    >
      <IconRefresh
        size={14}
        strokeWidth={2.2}
        className={`transition-colors duration-150 ${
          spinning ? "animate-spin text-sky-500" : "text-neutral-400"
        }`}
      />
    </button>
  );
}

// ─── Main TopBar ──────────────────────────────────────────────────────────────
export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);

  const isDashboardHome = pathname === "/dashboard";

  const firstName = user?.name?.split(" ")[0] || "there";
  const greeting = getGreeting();

  return (
    <div className="flex items-center justify-between px-6 h-16 shrink-0 border-b border-neutral-200 bg-white">

      {/* ── Left: greeting (dashboard home) or page title (other pages) ── */}
      <div className="flex flex-col justify-center min-w-0">
        {isDashboardHome ? (
          <>
            <h1 className="text-lg font-schibsted font-semibold text-neutral-900 leading-tight truncate">
              {greeting},{" "}
              <span className="text-sky-800">{firstName}</span>
            </h1>
            <p className="text-xs font-schibsted text-neutral-400 leading-tight">
              Stay on top of your tasks, monitor progress, and track status.
            </p>
          </>
        ) : (
          <h1 className="text-base font-schibsted font-semibold tracking-tighter text-neutral-900 truncate">
            {getPageTitle(pathname)}
          </h1>
        )}
      </div>

      {/* ── Right: search + actions + user ── */}
      <div className="flex items-center gap-2 shrink-0 ml-4">
        <SearchBar />

        <IconBtn badge={3}>
          <IconBell size={16} className="text-neutral-500" />
        </IconBtn>

        <IconBtn>
          <IconInfoCircle size={16} className="text-neutral-500" />
        </IconBtn>

        <RefreshBtn />

        <div className="w-px h-5 bg-neutral-200 mx-1" />

        <UserPill />
      </div>

    </div>
  );
}

// ─── Page title helper ────────────────────────────────────────────────────────
function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/dashboard/tickets")) return "My Tickets";
  if (pathname.startsWith("/dashboard/live-chats")) return "Live Chats";
  if (pathname.startsWith("/dashboard/domains")) return "Domains";
  if (pathname.startsWith("/dashboard/integrations")) return "Integrations";
  if (pathname.startsWith("/dashboard/aliases")) return "Aliases";
  if (pathname.startsWith("/dashboard/chat-widgets")) return "Chat Widgets";
  if (pathname.startsWith("/dashboard/customize-app")) return "Customize App";
  if (pathname.startsWith("/dashboard/email-templates")) return "Email Templates";
  if (pathname.startsWith("/dashboard/billing")) return "Billing";
  if (pathname.startsWith("/profile")) return "Profile";
  return "Dashboard";
}