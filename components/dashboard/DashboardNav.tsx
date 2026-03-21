// "use client";

// import { ReactNode, useCallback, useRef } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react";

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
// } from "lucide-react";

// import { IconMail, IconDashboard, IconInbox, IconGlobe, IconAtSign, IconZap } from "@/constants/icons";
// import { IconExternalLink, IconMessageCircle, IconMessages } from "@tabler/icons-react";
// import { CustomLink } from "../CustomLink";

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
// ];

// function NavItem({ item, isActive }: { 
//   item: typeof navItems[0]; 
//   isActive: boolean;
// }) {
//   const [isHovered, setIsHovered] = useState(false);
//   return (
//     <Link
//       href={item.href}
//       className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-schibsted font-regular transition-all duration-150 ${
//         isActive ? "text-sky-800 font-semibold" : "text-neutral-50 hover:text-neutral-100"
//       }
//       ${isHovered && !isActive ? "bg-neutral-100/20" : ""}
//       `}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {item.tablerIcon ? (
//         <item.tablerIcon size={20} className={`shrink-0 ${isActive ? "text-sky-800" : "text-neutral-600"}`} />
//       ) : item.icon ? (
//         <item.icon className={`size-5 ${isActive ? "text-sky-800" : "text-neutral-50"}`} isAnimating={isHovered} />
//       ) : null}
//       <span className="text-sm">{item.label}</span>
//     </Link>
//   );
// }


// function NavLinks({
//   navListRef,
//   navItemRefs,
//   clipPath,
//   isActive,
// }: {
//   navListRef: React.RefObject<HTMLUListElement | null>;
//   navItemRefs: React.RefObject<Map<string, HTMLLIElement>>;
//   clipPath: string;
//   isActive: (href: string, exact?: boolean) => boolean;
// }) {
//   return (
//     <div className="relative">
//       {/* Base layer */}
//       <ul ref={navListRef} className="space-y-1">
//         {navItems.map((item) => (
//           <li
//             key={item.href}
//             ref={(el) => { if (el) navItemRefs.current.set(item.href, el); }}
//           >
//             <NavItem item={item} isActive={isActive(item.href, item.exact)} />
//           </li>
//         ))}
//       </ul>

//       {/* Overlay layer */}
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           clipPath,
//           transition: "clip-path 0.2s cubic-bezier(0.32, 0.72, 0, 1)",
//         }}
//       >
//         <ul className="space-y-1">
//           {navItems.map((item) => (
//             <li key={item.href}>
//               <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-schibsted font-semibold bg-neutral-100 text-sky-800">
//                 {item.tablerIcon ? (
//                   <item.tablerIcon size={20} className="shrink-0 text-sky-800" />
//                 ) : item.icon ? (
//                   <item.icon className="size-5 text-sky-800" isAnimating={false} />
//                 ) : null}
//                 <span className="text-sm">{item.label}</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default function DashboardNav({ children }: { children: ReactNode }) {
//   const pathname = usePathname();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const navListRef = useRef<HTMLUListElement>(null);
// const navItemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
// const [clipPath, setClipPath] = useState("inset(0 0 100% 0)");

//   useEffect(() => {
//     setMobileOpen(false);
//   }, [pathname]);

//   const isActive = (href: string, exact?: boolean) => {
//     if (exact) return pathname === href;
//     return pathname.startsWith(href);
//   };

//   const updateClipPath = useCallback((href: string) => {
//   const container = navListRef.current;
//   const item = navItemRefs.current.get(href);
//   if (!container || !item) return;

//   const offsetTop = item.offsetTop;
//   const offsetBottom = container.offsetHeight - offsetTop - item.offsetHeight;

//   setClipPath(
//     `inset(${offsetTop}px 0 ${offsetBottom}px 0)`
//   );
// }, []);

// useEffect(() => {
//   const activeItem = navItems.find((item) => isActive(item.href, item.exact));
//   if (!activeItem) return;
//   const t = setTimeout(() => updateClipPath(activeItem.href), 50);
//   return () => clearTimeout(t);
// }, [pathname, updateClipPath]);


//   return (
//     <div className="flex h-dvh overflow-hidden">
//       {/* Mobile hamburger button */}
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

//       {/* Sidebar — desktop always visible, mobile slide-in */}
//       <aside
//         className={`fixed bg-sky-800 md:static top-0 left-0 h-full md:h-auto z-40 w-64 border-r border-neutral-200 px-4 py-6 transition-transform duration-200 md:translate-x-0 ${mobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
//           }`}
//       >
//         {/* Logo/Brand */}
//         <div className="mb-8 flex items-center gap-2 px-3">
//           <h2 className="text-lg font-schibsted font-semibold text-neutral-100">
//             Manage your tickets with ease
//           </h2>
//         </div>

//         {/* Navigation */}
//         <nav>
//           <NavLinks
//             navListRef={navListRef}
//             navItemRefs={navItemRefs}
//             clipPath={clipPath}
//             isActive={isActive}
//           />
//         </nav>

//         {/* Bottom section - User info or help link (optional) */}
//         {/* <div className="mt-8 px-3">
//           <div className="rounded-lg bg-gradient-to-t from-sky-900 to-cyan-700 border border-neutral-50 p-3">
//             <p className="text-xs font-schibsted font-medium text-neutral-50 pb-2">
//               Need Help?
//             </p>
//             <CustomLink
//               href="/docs"
//               className="flex text-sm font-schibsted font-normal text-white hover:text-neutral-100 transition-colors"
//             >
//               <span className="size-4 mr-1">
//                 <IconExternalLink size={16} className="text-neutral-50" />
//               </span>
//               View Documentation
//             </CustomLink>
//           </div>
//         </div> */}
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
import { motion, LayoutGroup } from "motion/react";

<<<<<<< HEAD
import { Menu, X } from "lucide-react";
=======
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
  CreditCard,
} from "lucide-react";
>>>>>>> master

import { IconDashboard, IconMail, IconGlobe, IconAtSign, IconZap } from "@/constants/icons";
import { IconMessageCircle, IconMessages } from "@tabler/icons-react";

const navItems = [
<<<<<<< HEAD
  { href: "/dashboard", label: "Dashboard", icon: IconDashboard, exact: true },
  { href: "/dashboard/tickets/mine", label: "My Tickets", icon: IconMail },
  { href: "/dashboard/domains", label: "Domains", icon: IconGlobe },
  { href: "/dashboard/integrations", label: "Integrations", icon: IconZap },
  { href: "/dashboard/aliases", label: "Aliases", icon: IconAtSign },
  { href: "/dashboard/chat-widgets", label: "Chat Widgets", icon: null, tablerIcon: IconMessageCircle },
  { href: "/dashboard/live-chats", label: "Live Chats", icon: null, tablerIcon: IconMessages },
=======
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
  // {
  //   href: "/dashboard/tickets/unassigned",
  //   label: "Unassigned",
  //   icon: IconInbox,
  // },
  {
    href: "/dashboard/domains",
    label: "Domains",
    icon: IconGlobe,
  },
  {
    href: "/dashboard/integrations",
    label: "Integrations",
    icon: IconZap,
  },
  {
    href: "/dashboard/aliases",
    label: "Aliases",
    icon: IconAtSign,
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
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: null,
    tablerIcon: CreditCard,
  },
>>>>>>> master
];

function NavItem({
  item,
  isActive,
}: {
  item: typeof navItems[0];
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
      {/* Sliding background bubble */}
      {isActive && (
        <motion.div
          layoutId="nav-bubble"
          className="absolute inset-0 bg-neutral-100 rounded-lg"
          style={{ borderRadius: 8 }}
          // transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
          transition={{ ease: [.23, 1, .32, 1], duration: 0.3 }}
        />
      )}

      {/* Hover background — only when not active */}
      {!isActive && isHovered && (
        <div className="absolute inset-0 bg-neutral-100/20 rounded-lg" />
      )}

      {/* Icon */}
      <span className="relative z-10">
        {item.tablerIcon ? (
          <item.tablerIcon
            size={20}
            className={`shrink-0 ${isActive ? "text-sky-800" : "text-neutral-50"}`}
          />
        ) : item.icon ? (
          <item.icon
            className={`size-5 ${isActive ? "text-sky-800" : "text-neutral-50"}`}
            isAnimating={isHovered}
          />
        ) : null}
      </span>

      {/* Label */}
      <span
        className={`relative z-10 text-sm font-schibsted ${
          isActive ? "text-sky-800 font-semibold" : "text-neutral-50"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}

function NavLinks({ isActive }: { isActive: (href: string, exact?: boolean) => boolean }) {
  return (
    <LayoutGroup>
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.href}>
            <NavItem item={item} isActive={isActive(item.href, item.exact)} />
          </li>
        ))}
      </ul>
    </LayoutGroup>
  );
}

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

  return (
    <div className="flex h-dvh overflow-hidden">

      {/* Mobile hamburger */}
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

      {/* Sidebar */}
      <aside
        className={`fixed bg-sky-800 md:static top-0 left-0 h-full md:h-auto z-40 w-64 border-r border-neutral-200 px-4 py-6 transition-transform duration-200 md:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center gap-2 px-3">
          <h2 className="text-lg font-schibsted font-semibold text-neutral-100">
            Manage your tickets with ease
          </h2>
        </div>

        <nav>
          <NavLinks isActive={isActive} />
        </nav>
      </aside>

      {/* Page content */}
      <main className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-6 bg-white h-full overflow-hidden">
        {children}
      </main>

    </div>
  );
}