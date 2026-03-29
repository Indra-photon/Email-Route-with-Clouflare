
// "use client";

// import { ReactNode } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
// import { motion, LayoutGroup } from "motion/react";

// // Lucide icons
// import {
//   LayoutDashboard,
//   Mail,
//   Inbox,
//   Globe,
//   AtSign,
//   Zap,
//   Menu,
//   X,
//   CreditCard,
// } from "lucide-react";

// import { IconDashboard, IconMail, IconGlobe, IconAtSign, IconZap } from "@/constants/icons";
// import { IconMessageCircle, IconMessages } from "@tabler/icons-react";

// const navItems = [
//   {
//     href: "/dashboard",
//     label: "Dashboard",
//     icon: IconDashboard,
//     exact: true,
//   },
//   {
//     href: "/dashboard/tickets/mine",
//     label: "My Tickets",
//     icon: IconMail,
//   },
//   // {
//   //   href: "/dashboard/tickets/unassigned",
//   //   label: "Unassigned",
//   //   icon: IconInbox,
//   // },
//   {
//     href: "/dashboard/domains",
//     label: "Domains",
//     icon: IconGlobe,
//   },
//   {
//     href: "/dashboard/integrations",
//     label: "Integrations",
//     icon: IconZap,
//   },
//   {
//     href: "/dashboard/aliases",
//     label: "Aliases",
//     icon: IconAtSign,
//   },
//   {
//     href: "/dashboard/chat-widgets",
//     label: "Chat Widgets",
//     icon: null,
//     tablerIcon: IconMessageCircle,
//   },
//   {
//     href: "/dashboard/live-chats",
//     label: "Live Chats",
//     icon: null,
//     tablerIcon: IconMessages,
//   },
//   {
//     href: "/dashboard/billing",
//     label: "Billing",
//     icon: null,
//     tablerIcon: CreditCard,
//   },
// ];

// function NavItem({
//   item,
//   isActive,
// }: {
//   item: typeof navItems[0];
//   isActive: boolean;
// }) {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <Link
//       href={item.href}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       style={{ WebkitTapHighlightColor: "transparent" }}
//       className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 font-schibsted transition-colors duration-150"
//     >
//       {/* Sliding background bubble */}
//       {isActive && (
//         <motion.div
//           layoutId="nav-bubble"
//           className="absolute inset-0 bg-neutral-100 rounded-lg"
//           style={{ borderRadius: 8 }}
//           // transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
//           transition={{ ease: [.23, 1, .32, 1], duration: 0.3 }}
//         />
//       )}

//       {/* Hover background — only when not active */}
//       {!isActive && isHovered && (
//         <div className="absolute inset-0 bg-neutral-100/20 rounded-lg" />
//       )}

//       {/* Icon */}
//       <span className="relative z-10">
//         {item.tablerIcon ? (
//           <item.tablerIcon
//             size={20}
//             className={`shrink-0 ${isActive ? "text-sky-800" : "text-neutral-50"}`}
//           />
//         ) : item.icon ? (
//           <item.icon
//             className={`size-5 ${isActive ? "text-sky-800" : "text-neutral-50"}`}
//             isAnimating={isHovered}
//           />
//         ) : null}
//       </span>

//       {/* Label */}
//       <span
//         className={`relative z-10 text-sm font-schibsted ${
//           isActive ? "text-sky-800 font-semibold" : "text-neutral-50"
//         }`}
//       >
//         {item.label}
//       </span>
//     </Link>
//   );
// }

// function NavLinks({ isActive }: { isActive: (href: string, exact?: boolean) => boolean }) {
//   return (
//     <LayoutGroup>
//       <ul className="space-y-1">
//         {navItems.map((item) => (
//           <li key={item.href}>
//             <NavItem item={item} isActive={isActive(item.href, item.exact)} />
//           </li>
//         ))}
//       </ul>
//     </LayoutGroup>
//   );
// }

// export default function DashboardNav({ children }: { children: ReactNode }) {
//   const pathname = usePathname();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   useEffect(() => {
//     setMobileOpen(false);
//   }, [pathname]);

//   const isActive = (href: string, exact?: boolean) => {
//     if (exact) return pathname === href;
//     return pathname.startsWith(href);
//   };

//   return (
//     <div className="flex h-dvh pt-1">

//       {/* Mobile hamburger */}
//       <button
//         className="md:hidden fixed top-5 left-4 z-50 size-10 bg-white border border-neutral-200 rounded-lg flex items-center justify-center shadow-sm hover:bg-neutral-50 transition-colors"
//         onClick={() => setMobileOpen((o) => !o)}
//         aria-label="Toggle menu"
//       >
//         {mobileOpen ? (
//           <X className="size-5 text-neutral-900" />
//         ) : (
//           <Menu className="size-5 text-neutral-900" />
//         )}
//       </button>

//       {/* Mobile overlay */}
//       {mobileOpen && (
//         <div
//           className="md:hidden fixed inset-0 bg-black/30 z-40"
//           onClick={() => setMobileOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed bg-sky-800 md:static top-0 left-0 h-full md:h-auto z-40 w-64 border-r border-neutral-200 px-4 py-6 transition-transform duration-200 md:translate-x-0 ${
//           mobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
//         }`}
//       >
//         <div className="mb-8 flex items-center gap-2 px-3">
//           <h2 className="text-lg font-schibsted font-semibold text-neutral-100">
//             Manage your tickets with ease
//           </h2>
//         </div>

//         <nav>
//           <NavLinks isActive={isActive} />
//         </nav>
//       </aside>

//       {/* Page content */}
//       <main className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-6 bg-white h-full overflow-hidden">
//         {children}
//       </main>

//     </div>
//   );
// }


"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, LayoutGroup, AnimatePresence } from "motion/react";
import { Menu, X, CreditCard, User, Palette } from "lucide-react";
import { IconDashboard, IconMail, IconGlobe, IconAtSign, IconZap } from "@/constants/icons";
import { IconMessageCircle, IconMessages, IconTemplate } from "@tabler/icons-react";
import { useUserStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardBreadcrumb } from "@/components/dashboard/DashboardBreadcrumb";
import { RightPanel } from "./right-panel/RightPanel";

// ─── Easing ──────────────────────────────────────────────────────────────────
const EASE_OUT_QUART: [number, number, number, number] = [0.165, 0.84, 0.44, 1];

// ─── Nav Groups ──────────────────────────────────────────────────────────────
const navGroups = [
  {
    label: "OVERVIEW",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: IconDashboard,
        tablerIcon: null,
        exact: true,
      },
    ],
  },
  {
    label: "MANAGE",
    items: [
      {
        href: "/dashboard/tickets/mine",
        label: "My Tickets",
        icon: IconMail,
        tablerIcon: null,
        exact: false,
      },
      {
        href: "/dashboard/live-chats",
        label: "Live Chats",
        icon: null,
        tablerIcon: IconMessages,
        exact: false,
      },
    ],
  },
  {
    label: "CONFIGURE",
    items: [
      {
        href: "/dashboard/domains",
        label: "Domains",
        icon: IconGlobe,
        tablerIcon: null,
        exact: false,
      },
      {
        href: "/dashboard/integrations",
        label: "Integrations",
        icon: IconZap,
        tablerIcon: null,
        exact: false,
      },
      {
        href: "/dashboard/aliases",
        label: "Aliases",
        icon: IconAtSign,
        tablerIcon: null,
        exact: false,
      },
      {
        href: "/dashboard/chat-widgets",
        label: "Chat Widgets",
        icon: null,
        tablerIcon: IconMessageCircle,
        exact: false,
      },
      {
        href: "/dashboard/customize-app",
        label: "Customize App",
        icon: null,
        tablerIcon: Palette,
        exact: false,
      },
      {
        href: "/dashboard/email-templates",
        label: "Email Templates",
        icon: null,
        tablerIcon: IconTemplate,
        exact: false,
      },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      {
        href: "/dashboard/billing",
        label: "Billing",
        icon: null,
        tablerIcon: CreditCard,
        exact: false,
      },
      {
        href: "/profile",
        label: "Profile",
        icon: null,
        tablerIcon: User,
        exact: false,
      },
    ],
  },
];

// ─── Logo Mark ────────────────────────────────────────────────────────────────
function LogoMark() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="size-8 rounded-lg bg-sky-700 flex items-center justify-center transition-colors duration-200 group-hover:bg-sky-600">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
        </svg>
      </div>
      <span className="font-schibsted font-semibold text-base text-white tracking-tight">
        Email Router
      </span>
    </Link>
  );
}

// ─── User Profile Card ────────────────────────────────────────────────────────
function UserProfileCard() {
  const user = useUserStore((state) => state.user);

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
    <div className="px-3 py-4 border-b border-sky-700/50">
      <div className="flex items-center gap-3">
        <Avatar className="size-9 border-2 border-sky-600/50 shrink-0">
          <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
          <AvatarFallback className="bg-sky-700 text-white text-sm font-schibsted font-semibold">
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-schibsted font-semibold text-white truncate">
            {user?.name || "User"}
          </p>
          <p className="text-xs font-schibsted text-sky-300/70 truncate">
            {user?.email || ""}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────
type NavItemType = {
  href: string;
  label: string;
  icon: any;
  tablerIcon: any;
  exact: boolean;
};

function NavItem({
  item,
  isActive,
}: {
  item: NavItemType;
  isActive: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={item.href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ WebkitTapHighlightColor: "transparent" }}
      className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 font-schibsted transition-colors duration-150"
    >
      {/* Active background bubble */}
      {isActive && (
        <motion.div
          layoutId="nav-bubble"
          className="absolute inset-0 bg-white/15 rounded-lg"
          style={{ borderRadius: 8 }}
          transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.3 }}
        />
      )}

      {/* Hover background — only when not active */}
      {!isActive && isHovered && (
        <div className="absolute inset-0 bg-white/8 rounded-lg" />
      )}

      {/* Active left accent bar */}
      {isActive && (
        <motion.div
          layoutId="nav-accent"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full"
          transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.3 }}
        />
      )}

      {/* Icon */}
      <span className="relative z-10">
        {item.tablerIcon ? (
          <item.tablerIcon
            size={18}
            className={`shrink-0 transition-colors duration-150 ${
              isActive ? "text-white" : "text-white/70"
            }`}
          />
        ) : item.icon ? (
          <item.icon
            className={`size-[18px] transition-colors duration-150 ${
              isActive ? "text-white" : "text-white/70"
            }`}
            isAnimating={isHovered}
          />
        ) : null}
      </span>

      {/* Label */}
      <span
        className={`relative z-10 text-sm font-schibsted transition-colors duration-150 ${
          isActive ? "text-white font-semibold" : "text-neutral-200 font-medium"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}

// ─── Nav Group ────────────────────────────────────────────────────────────────
function NavGroup({
  group,
  isActive,
}: {
  group: (typeof navGroups)[0];
  isActive: (href: string, exact?: boolean) => boolean;
}) {
  return (
    <div className="mb-8">
      {/* Section Header */}
      <p className="px-3 mb-1 mt-4 text-[13px] font-schibsted font-semibold tracking-widest text-stone-100 uppercase select-none">
        {group.label}
      </p>

      {/* Items */}
      <ul className="space-y-0.5 pl-3">
        {group.items.map((item) => (
          <li key={item.href}>
            <NavItem item={item} isActive={isActive(item.href, item.exact)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Sidebar Content ──────────────────────────────────────────────────────────
function SidebarContent({
  isActive,
  onClose,
}: {
  isActive: (href: string, exact?: boolean) => boolean;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-sky-800">
      {/* User Profile */}
      <UserProfileCard />

      {/* Nav Groups */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto scrollbar-none">
        <LayoutGroup>
          {navGroups.map((group) => (
            <NavGroup key={group.label} group={group} isActive={isActive} />
          ))}
        </LayoutGroup>
      </nav>

      {/* Bottom — Logo pinned */}
      <div className="px-4 py-4 border-t border-sky-700/50">
        <LogoMark />
      </div>
    </div>
  );
}

// ─── Main DashboardNav ────────────────────────────────────────────────────────
export default function DashboardNav({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-dvh">
      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden md:flex md:flex-col w-56 shrink-0 border-r border-sky-900/40 shadow-xl shadow-sky-900/10">
        <SidebarContent isActive={isActive} />
      </aside>

      {/* ── Mobile Hamburger ────────────────────────────── */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 size-10 bg-sky-800 border border-sky-700 rounded-lg flex items-center justify-center shadow-md hover:bg-sky-700 transition-colors"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait" initial={false}>
          {mobileOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="size-4 text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Menu className="size-4 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* ── Mobile Overlay ──────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer ───────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
            className="fixed top-0 left-0 bottom-0 w-56 z-50 md:hidden shadow-2xl"
          >
            <SidebarContent isActive={isActive} onClose={() => setMobileOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Page Content ────────────────────────────────── */}
      <main className="flex-1 min-w-0 flex overflow-hidden bg-neutral-50">
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <DashboardBreadcrumb />
          <div className="px-10 py-6">{children}</div>
        </div>
        <RightPanel />
      </main>
    </div>
  );
}