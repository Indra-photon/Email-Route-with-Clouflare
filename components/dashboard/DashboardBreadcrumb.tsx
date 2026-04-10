
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

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  IconSearch,
  IconBell,
  IconInfoCircle,
  IconChevronDown,
  IconRefresh,
  IconUser,
  IconCreditCard,
  IconLogout,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/lib/store";
import { useRefreshStore } from "@/components/dashboard/right-panel/useRefresh";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

// ─── Live notification data (polls every 45s + on manual refresh) ─────────────
const POLL_INTERVAL_MS = 45_000;

interface NotifItem {
  id: string;
  from: string;
  subject: string;
  time: string;
}

function useNotifications() {
  const [count, setCount] = useState<number | null>(null);
  const [items, setItems] = useState<NotifItem[]>([]);
  const { isLoaded, isSignedIn } = useAuth();
  const refreshCount = useRefreshStore((s) => s.refreshCount);

  const fetchData = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    try {
      const res = await fetch("/api/notifications/count");
      if (!res.ok) return;
      const data = await res.json();
      setCount(data.count ?? 0);
      setItems(data.items ?? []);
    } catch {
      // silently ignore — keeps last known state
    }
  }, [isLoaded, isSignedIn]);

  // Re-fetch on auth ready or manual refresh trigger
  useEffect(() => {
    fetchData();
  }, [fetchData, refreshCount]);

  // Auto-poll every 45 seconds
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const id = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isLoaded, isSignedIn, fetchData]);

  return { count, items };
}

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

// ─── Generic icon button (for non-notification actions) ───────────────────────
function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="relative flex items-center justify-center size-9 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-300 hover:shadow-sm transition-all duration-150">
      {children}
    </button>
  );
}

// ─── Notification bell with dropdown ────────────────────────────────────────
function NotificationBell({
  count,
  items,
}: {
  count: number | null;
  items: NotifItem[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {/* Bell trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center size-9 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-300 hover:shadow-sm transition-all duration-150"
      >
        <IconBell size={16} className={open ? "text-sky-600" : "text-neutral-500"} />
        {count != null && count > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-0.5 rounded-full bg-red-500 text-white text-[9px] font-schibsted font-bold leading-none">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-80 rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-200/60 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
            <span className="font-schibsted text-[11px] font-semibold tracking-widest uppercase text-neutral-400">
              Notifications
            </span>
            {count != null && count > 0 && (
              <span className="font-schibsted text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                {count} new
              </span>
            )}
          </div>

          {/* Items */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <IconBell size={22} className="text-neutral-200" strokeWidth={1.5} />
              <p className="font-schibsted text-[12px] text-neutral-400">
                No new tickets in the last 24h
              </p>
            </div>
          ) : (
            <ul>
              {items.map((item, i) => (
                <li
                  key={item.id}
                  className={`px-4 py-3 hover:bg-neutral-50 transition-colors duration-100 ${
                    i !== 0 ? "border-t border-neutral-50" : ""
                  }`}
                >
                  <Link
                    href="/dashboard/tickets/mine"
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3"
                  >
                    {/* Dot */}
                    <span className="mt-1.5 size-1.5 rounded-full bg-sky-500 shrink-0" />
                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="font-schibsted text-[12px] font-semibold text-neutral-800 truncate leading-snug">
                        {item.subject}
                      </p>
                      <p className="font-schibsted text-[11px] text-neutral-400 truncate mt-0.5">
                        {item.from}
                      </p>
                    </div>
                    {/* Time */}
                    <span className="font-schibsted text-[10px] text-neutral-400 shrink-0 pt-0.5">
                      {item.time}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Footer */}
          <div className="border-t border-neutral-100 px-4 py-2.5">
            <Link
              href="/dashboard/tickets/mine"
              onClick={() => setOpen(false)}
              className="font-schibsted text-[11px] font-semibold text-sky-600 hover:text-sky-800 transition-colors"
            >
              View all tickets →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Easing ───────────────────────────────────────────────────────────────────
const easeOutQuint = [0.23, 1, 0.32, 1] as const;

// ─── User menu dropdown ───────────────────────────────────────────────────────
function UserMenuDropdown() {
  const user = useUserStore((s) => s.user);
  const { signOut } = useClerk();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleNav = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Trigger pill */}
      <button
        onClick={() => setOpen((v) => !v)}
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
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex items-center justify-center shrink-0"
        >
          <IconChevronDown size={12} className="text-neutral-400" />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scaleY: 0.95, scaleX: 0.98 }}
            animate={{ opacity: 1, y: 4, scaleY: 1, scaleX: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.95, scaleX: 0.98 }}
            transition={{ duration: 0.2, ease: easeOutQuint }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-full z-50 w-44 rounded-xl border border-neutral-200 bg-white shadow-lg shadow-neutral-200/50 overflow-hidden"
          >
            <div className="py-1">
              {/* Profile */}
              <button
                onClick={() => handleNav("/dashboard/profile")}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm font-schibsted font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-100"
              >
                <IconUser size={14} className="text-neutral-400 shrink-0" />
                Profile
              </button>

              {/* Billing */}
              <button
                onClick={() => handleNav("/dashboard/billing")}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm font-schibsted font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-100"
              >
                <IconCreditCard size={14} className="text-neutral-400 shrink-0" />
                Billing
              </button>

              <div className="h-px bg-neutral-100 mx-2 my-1" />

              {/* Logout */}
              <button
                onClick={() => { signOut(); setOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm font-schibsted font-medium text-red-500 hover:bg-red-50 transition-colors duration-100"
              >
                <IconLogout size={14} className="shrink-0" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
  const { count: notifCount, items: notifItems } = useNotifications();

  const isDashboardHome = pathname === "/dashboard";

  const firstName = user?.name?.split(" ")[0] || "there";
  const greeting = getGreeting();

  return (
    <div className="flex items-center justify-between px-10 h-14 shrink-0 border-b border-neutral-200 bg-white">

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

        <NotificationBell count={notifCount} items={notifItems} />

        <IconBtn>
          <IconInfoCircle size={16} className="text-neutral-500" />
        </IconBtn>

        <RefreshBtn />

        <div className="w-px h-5 bg-neutral-200 mx-1" />

        <UserMenuDropdown />
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
  if (pathname.startsWith("/dashboard/profile")) return "Profile";
  return "Dashboard";
}