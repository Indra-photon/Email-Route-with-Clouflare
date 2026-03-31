// "use client";

// import { ReactNode } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
// import { motion, LayoutGroup, AnimatePresence } from "motion/react";
// import { Menu, X, CreditCard, User, Palette } from "lucide-react";
// import { IconDashboard, IconMail, IconGlobe, IconAtSign, IconZap } from "@/constants/icons";
// import { IconMessageCircle, IconMessages, IconTemplate } from "@tabler/icons-react";
// import { useUserStore } from "@/lib/store";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { DashboardBreadcrumb } from "@/components/dashboard/DashboardBreadcrumb";
// import { RightPanel } from "./right-panel/RightPanel";

// // ─── Easing ──────────────────────────────────────────────────────────────────
// const EASE_OUT_QUART: [number, number, number, number] = [0.165, 0.84, 0.44, 1];

// // ─── Nav Groups ──────────────────────────────────────────────────────────────
// const navGroups = [
//   {
//     label: "OVERVIEW",
//     items: [
//       {
//         href: "/dashboard",
//         label: "Dashboard",
//         icon: IconDashboard,
//         tablerIcon: null,
//         exact: true,
//       },
//     ],
//   },
//   {
//     label: "MANAGE",
//     items: [
//       {
//         href: "/dashboard/tickets/mine",
//         label: "My Tickets",
//         icon: IconMail,
//         tablerIcon: null,
//         exact: false,
//       },
//       {
//         href: "/dashboard/live-chats",
//         label: "Live Chats",
//         icon: null,
//         tablerIcon: IconMessages,
//         exact: false,
//       },
//     ],
//   },
//   {
//     label: "CONFIGURE",
//     items: [
//       {
//         href: "/dashboard/domains",
//         label: "Domains",
//         icon: IconGlobe,
//         tablerIcon: null,
//         exact: false,
//       },
//       {
//         href: "/dashboard/integrations",
//         label: "Integrations",
//         icon: IconZap,
//         tablerIcon: null,
//         exact: false,
//       },
//       {
//         href: "/dashboard/aliases",
//         label: "Aliases",
//         icon: IconAtSign,
//         tablerIcon: null,
//         exact: false,
//       },
//       {
//         href: "/dashboard/chat-widgets",
//         label: "Chat Widgets",
//         icon: null,
//         tablerIcon: IconMessageCircle,
//         exact: false,
//       },
//       {
//         href: "/dashboard/customize-app",
//         label: "Customize App",
//         icon: null,
//         tablerIcon: Palette,
//         exact: false,
//       },
//       {
//         href: "/dashboard/email-templates",
//         label: "Email Templates",
//         icon: null,
//         tablerIcon: IconTemplate,
//         exact: false,
//       },
//     ],
//   },
//   {
//     label: "ACCOUNT",
//     items: [
//       {
//         href: "/dashboard/billing",
//         label: "Billing",
//         icon: null,
//         tablerIcon: CreditCard,
//         exact: false,
//       },
//       {
//         href: "/profile",
//         label: "Profile",
//         icon: null,
//         tablerIcon: User,
//         exact: false,
//       },
//     ],
//   },
// ];

// // ─── Logo Mark ────────────────────────────────────────────────────────────────
// function LogoMark() {
//   return (
//     <Link href="/" className="flex items-center gap-2 group">
//       <div className="size-8 rounded-lg bg-sky-700 flex items-center justify-center transition-colors duration-200 group-hover:bg-sky-600">
//         <svg
//           width="16"
//           height="16"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="text-white"
//         >
//           <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
//         </svg>
//       </div>
//       <span className="font-schibsted font-semibold text-base text-white tracking-tight">
//         Email Router
//       </span>
//     </Link>
//   );
// }

// // ─── User Profile Card ────────────────────────────────────────────────────────
// function UserProfileCard() {
//   const user = useUserStore((state) => state.user);

//   const getInitials = (name?: string) => {
//     if (!name) return "U";
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   return (
//     <div className="px-3 py-4 border-b border-sky-700/50">
//       <div className="flex items-center gap-3">
//         <Avatar className="size-9 border-2 border-sky-600/50 shrink-0">
//           <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
//           <AvatarFallback className="bg-sky-700 text-white text-sm font-schibsted font-semibold">
//             {getInitials(user?.name)}
//           </AvatarFallback>
//         </Avatar>
//         <div className="flex-1 min-w-0">
//           <p className="text-sm font-schibsted font-semibold text-white truncate">
//             {user?.name || "User"}
//           </p>
//           <p className="text-xs font-schibsted text-sky-300/70 truncate">
//             {user?.email || ""}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Nav Item ─────────────────────────────────────────────────────────────────
// type NavItemType = {
//   href: string;
//   label: string;
//   icon: any;
//   tablerIcon: any;
//   exact: boolean;
// };

// function NavItem({
//   item,
//   isActive,
// }: {
//   item: NavItemType;
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
//       {/* Active background bubble */}
//       {isActive && (
//         <motion.div
//           layoutId="nav-bubble"
//           className="absolute inset-0 bg-white/15 rounded-lg"
//           style={{ borderRadius: 8 }}
//           transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.3 }}
//         />
//       )}

//       {/* Hover background — only when not active */}
//       {!isActive && isHovered && (
//         <div className="absolute inset-0 bg-white/8 rounded-lg" />
//       )}

//       {/* Active left accent bar */}
//       {isActive && (
//         <motion.div
//           layoutId="nav-accent"
//           className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full"
//           transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.3 }}
//         />
//       )}

//       {/* Icon */}
//       <span className="relative z-10">
//         {item.tablerIcon ? (
//           <item.tablerIcon
//             size={18}
//             className={`shrink-0 transition-colors duration-150 ${
//               isActive ? "text-white" : "text-white/70"
//             }`}
//           />
//         ) : item.icon ? (
//           <item.icon
//             className={`size-[18px] transition-colors duration-150 ${
//               isActive ? "text-white" : "text-white/70"
//             }`}
//             isAnimating={isHovered}
//           />
//         ) : null}
//       </span>

//       {/* Label */}
//       <span
//         className={`relative z-10 text-sm font-schibsted transition-colors duration-150 ${
//           isActive ? "text-white font-semibold" : "text-neutral-200 font-medium"
//         }`}
//       >
//         {item.label}
//       </span>
//     </Link>
//   );
// }

// // ─── Nav Group ────────────────────────────────────────────────────────────────
// function NavGroup({
//   group,
//   isActive,
// }: {
//   group: (typeof navGroups)[0];
//   isActive: (href: string, exact?: boolean) => boolean;
// }) {
//   return (
//     <div className="mb-8">
//       {/* Section Header */}
//       <p className="px-3 mb-1 mt-4 text-[13px] font-schibsted font-semibold tracking-widest text-stone-100 uppercase select-none">
//         {group.label}
//       </p>

//       {/* Items */}
//       <ul className="space-y-0.5 pl-3">
//         {group.items.map((item) => (
//           <li key={item.href}>
//             <NavItem item={item} isActive={isActive(item.href, item.exact)} />
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// // ─── Sidebar Content ──────────────────────────────────────────────────────────
// function SidebarContent({
//   isActive,
//   onClose,
// }: {
//   isActive: (href: string, exact?: boolean) => boolean;
//   onClose?: () => void;
// }) {
//   return (
//     <div className="flex flex-col h-full bg-sky-800">
//       {/* User Profile */}
//       <UserProfileCard />

//       {/* Nav Groups */}
//       <nav className="flex-1 px-2 py-2 overflow-y-auto scrollbar-none">
//         <LayoutGroup>
//           {navGroups.map((group) => (
//             <NavGroup key={group.label} group={group} isActive={isActive} />
//           ))}
//         </LayoutGroup>
//       </nav>

//       {/* Bottom — Logo pinned */}
//       <div className="px-4 py-4 border-t border-sky-700/50">
//         <LogoMark />
//       </div>
//     </div>
//   );
// }

// // ─── Main DashboardNav ────────────────────────────────────────────────────────
// export default function DashboardNav({ children }: { children: ReactNode }) {
//   const pathname = usePathname();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   // Close mobile menu on route change
//   useEffect(() => {
//     setMobileOpen(false);
//   }, [pathname]);

//   const isActive = (href: string, exact?: boolean) => {
//     if (exact) return pathname === href;
//     return pathname.startsWith(href);
//   };

//   return (
//     <div className="flex h-dvh">
//       {/* ── Desktop Sidebar ─────────────────────────────── */}
//       <aside className="hidden md:flex md:flex-col w-56 shrink-0 border-r border-sky-900/40 shadow-xl shadow-sky-900/10">
//         <SidebarContent isActive={isActive} />
//       </aside>

//       {/* ── Mobile Hamburger ────────────────────────────── */}
//       <button
//         className="md:hidden fixed top-4 left-4 z-50 size-10 bg-sky-800 border border-sky-700 rounded-lg flex items-center justify-center shadow-md hover:bg-sky-700 transition-colors"
//         onClick={() => setMobileOpen((o) => !o)}
//         aria-label="Toggle menu"
//       >
//         <AnimatePresence mode="wait" initial={false}>
//           {mobileOpen ? (
//             <motion.span
//               key="close"
//               initial={{ rotate: -90, opacity: 0 }}
//               animate={{ rotate: 0, opacity: 1 }}
//               exit={{ rotate: 90, opacity: 0 }}
//               transition={{ duration: 0.15 }}
//             >
//               <X className="size-4 text-white" />
//             </motion.span>
//           ) : (
//             <motion.span
//               key="open"
//               initial={{ rotate: 90, opacity: 0 }}
//               animate={{ rotate: 0, opacity: 1 }}
//               exit={{ rotate: -90, opacity: 0 }}
//               transition={{ duration: 0.15 }}
//             >
//               <Menu className="size-4 text-white" />
//             </motion.span>
//           )}
//         </AnimatePresence>
//       </button>

//       {/* ── Mobile Overlay ──────────────────────────────── */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div
//             key="overlay"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             onClick={() => setMobileOpen(false)}
//             className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
//           />
//         )}
//       </AnimatePresence>

//       {/* ── Mobile Drawer ───────────────────────────────── */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.aside
//             key="drawer"
//             initial={{ x: "-100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "-100%" }}
//             transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
//             className="fixed top-0 left-0 bottom-0 w-56 z-50 md:hidden shadow-2xl"
//           >
//             <SidebarContent isActive={isActive} onClose={() => setMobileOpen(false)} />
//           </motion.aside>
//         )}
//       </AnimatePresence>

//       {/* ── Page Content ────────────────────────────────── */}
//       <main className="flex-1 min-w-0 flex overflow-hidden bg-neutral-50">
//         <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
//           <DashboardBreadcrumb />
//           <div className="px-10 py-6">{children}</div>
//         </div>
//         <RightPanel />
//       </main>
//     </div>
//   );
// }



// -------------------------------------- v 2.0 ---------------------------------

// "use client";

// import { ReactNode } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import { CreditCard, User, Palette, ChevronRight, ChevronLeft, Menu } from "lucide-react";
// import { IconDashboard, IconMail, IconGlobe, IconAtSign, IconZap } from "@/constants/icons";
// import { IconMessageCircle, IconMessages, IconTemplate } from "@tabler/icons-react";
// import { useUserStore } from "@/lib/store";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { DashboardBreadcrumb } from "@/components/dashboard/DashboardBreadcrumb";
// import { RightPanel } from "./right-panel/RightPanel";

// // ─── Easing ──────────────────────────────────────────────────────────────────
// const EASE_OUT_QUART: [number, number, number, number] = [0.165, 0.84, 0.44, 1];

// // ─── Nav Groups ──────────────────────────────────────────────────────────────
// const navGroups = [
//   {
//     label: "OVERVIEW",
//     items: [
//       {
//         href: "/dashboard",
//         label: "Dashboard",
//         icon: IconDashboard,
//         tablerIcon: null,
//         exact: true,
//       },
//     ],
//   },
//   {
//     label: "MANAGE",
//     items: [
//       {
//         href: "/dashboard/tickets/mine",
//         label: "My Tickets",
//         icon: IconMail,
//         tablerIcon: null,
//         exact: false,
//       },
//       {
//         href: "/dashboard/live-chats",
//         label: "Live Chats",
//         icon: null,
//         tablerIcon: IconMessages,
//         exact: false,
//       },
//     ],
//   },
//   {
//     label: "CONFIGURE",
//     items: [
//       {
//         href: "/dashboard/domains",
//         label: "Domains",
//         icon: IconGlobe,
//         tablerIcon: null,
//         exact: false,
//       },
//       {
//         href: "/dashboard/integrations",
//         label: "Integrations",
//         icon: IconZap,
//         tablerIcon: null,
//         exact: false,
//       },
//       {
//         href: "/dashboard/aliases",
//         label: "Aliases",
//         icon: IconAtSign,
//         tablerIcon: null,
//         exact: false,
//       },
//       {
//         href: "/dashboard/chat-widgets",
//         label: "Chat Widgets",
//         icon: null,
//         tablerIcon: IconMessageCircle,
//         exact: false,
//       },
//       {
//         href: "/dashboard/customize-app",
//         label: "Customize App",
//         icon: null,
//         tablerIcon: Palette,
//         exact: false,
//       },
//       {
//         href: "/dashboard/email-templates",
//         label: "Email Templates",
//         icon: null,
//         tablerIcon: IconTemplate,
//         exact: false,
//       },
//     ],
//   },
//   {
//     label: "ACCOUNT",
//     items: [
//       {
//         href: "/dashboard/billing",
//         label: "Billing",
//         icon: null,
//         tablerIcon: CreditCard,
//         exact: false,
//       },
//       {
//         href: "/profile",
//         label: "Profile",
//         icon: null,
//         tablerIcon: User,
//         exact: false,
//       },
//     ],
//   },
// ];

// // ─── Types ────────────────────────────────────────────────────────────────────
// type NavItemType = {
//   href: string;
//   label: string;
//   icon: any;
//   tablerIcon: any;
//   exact: boolean;
// };

// // ─── Icon Renderer ────────────────────────────────────────────────────────────
// function NavIcon({
//   item,
//   isActive,
//   size = 18,
// }: {
//   item: NavItemType;
//   isActive: boolean;
//   size?: number;
// }) {
//   const colorClass = isActive ? "text-white" : "text-white/60";
//   if (item.tablerIcon) {
//     return (
//       <item.tablerIcon
//         size={size}
//         className={`shrink-0 transition-colors duration-150 ${colorClass}`}
//       />
//     );
//   }
//   if (item.icon) {
//     return (
//       <item.icon
//         className={`shrink-0 transition-colors duration-150 ${colorClass}`}
//         style={{ width: size, height: size }}
//         isAnimating={false}
//       />
//     );
//   }
//   return null;
// }

// // ─── Collapsed: Icon-only pill ────────────────────────────────────────────────
// function CollapsedPill({ item, isActive }: { item: NavItemType; isActive: boolean }) {
//   return (
//     <Link
//       href={item.href}
//       title={item.label}
//       style={{ WebkitTapHighlightColor: "transparent" }}
//       className={`
//         relative flex items-center justify-center w-full h-9 rounded-lg
//         transition-colors duration-150
       
//       `}
//     >
//       {/* {isActive && (
//         <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full" />
//       )} */}
//       <NavIcon item={item} isActive={isActive} size={18} />
//     </Link>
//   );
// }

// // ─── Collapsed: Group cluster ─────────────────────────────────────────────────
// function CollapsedGroup({
//   group,
//   isActive,
// }: {
//   group: (typeof navGroups)[0];
//   isActive: (href: string, exact?: boolean) => boolean;
// }) {
//   return (
//     <div className="flex flex-col gap-0.5">
//       <p className="text-[8px] font-schibsted font-semibold tracking-widest text-white/30 uppercase text-center select-none mb-0.5">
//         {group.label.slice(0, 3)}
//       </p>
//       <div className="bg-sky-900 rounded-4xl p-1.5 flex flex-col gap-0.5">
//         {group.items.map((item) => (
//           <CollapsedPill
//             key={item.href}
//             item={item}
//             isActive={isActive(item.href, item.exact)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Expanded: Full nav item ──────────────────────────────────────────────────
// function ExpandedNavItem({ item, isActive }: { item: NavItemType; isActive: boolean }) {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <Link
//       href={item.href}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       style={{ WebkitTapHighlightColor: "transparent" }}
//       className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 font-schibsted transition-colors duration-150"
//     >
//       {isActive && (
//         <motion.div
//           layoutId="nav-bubble"
//           className="absolute inset-0 bg-white/15 rounded-lg"
//           style={{ borderRadius: 8 }}
//           transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.3 }}
//         />
//       )}
//       {!isActive && isHovered && (
//         <div className="absolute inset-0 bg-white/8 rounded-lg" />
//       )}
//       {isActive && (
//         <motion.div
//           layoutId="nav-accent"
//           className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full"
//           transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.3 }}
//         />
//       )}
//       <span className="relative z-10">
//         <NavIcon item={item} isActive={isActive} size={18} />
//       </span>
//       <span
//         className={`relative z-10 text-sm font-schibsted transition-colors duration-150 whitespace-nowrap ${
//           isActive ? "text-white font-semibold" : "text-white/70 font-medium"
//         }`}
//       >
//         {item.label}
//       </span>
//     </Link>
//   );
// }

// // ─── Expanded: Nav group ──────────────────────────────────────────────────────
// function ExpandedGroup({
//   group,
//   isActive,
// }: {
//   group: (typeof navGroups)[0];
//   isActive: (href: string, exact?: boolean) => boolean;
// }) {
//   return (
//     <div className="mb-6">
//       <p className="px-3 mb-1 text-[10px] font-schibsted font-semibold tracking-widest text-white/30 uppercase select-none">
//         {group.label}
//       </p>
//       <ul className="space-y-0.5">
//         {group.items.map((item) => (
//           <li key={item.href}>
//             <ExpandedNavItem item={item} isActive={isActive(item.href, item.exact)} />
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// // ─── User Profile Card ────────────────────────────────────────────────────────
// function UserProfileCard({ collapsed }: { collapsed: boolean }) {
//   const user = useUserStore((s) => s.user);

//   const getInitials = (name?: string) => {
//     if (!name) return "U";
//     return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
//   };

//   return (
//     <div className={`border-b border-sky-700/50 ${collapsed ? "flex justify-center py-3" : "px-3 py-4"}`}>
//       <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
//         <Avatar className={`border-2 border-sky-600/50 shrink-0 ${collapsed ? "size-8" : "size-9"}`}>
//           <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
//           <AvatarFallback className="bg-sky-700 text-white text-sm font-schibsted font-semibold">
//             {getInitials(user?.name)}
//           </AvatarFallback>
//         </Avatar>
//         {/* Labels only render when expanded — no layout shift, just hidden by overflow:hidden on aside */}
//         {!collapsed && (
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-schibsted font-semibold text-white truncate">
//               {user?.name || "User"}
//             </p>
//             <p className="text-xs font-schibsted text-sky-300/70 truncate">
//               {user?.email || ""}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Edge Toggle Button ───────────────────────────────────────────────────────
// function EdgeToggle({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
//   return (
//     <button
//       onClick={onToggle}
//       aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//       className="
//         absolute top-1/2 -translate-y-1/2 -right-3 z-50
//         flex items-center justify-center
//         w-6 h-6 rounded-full
//         bg-sky-700 hover:bg-sky-500
//         border border-sky-500/60
//         shadow-lg shadow-sky-900/40
//         transition-colors duration-150
//         cursor-pointer
//       "
//     >
//       <motion.div
//         animate={{ rotate: collapsed ? 0 : 180 }}
//         transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
//       >
//         <ChevronRight size={13} className="text-white" />
//       </motion.div>
//     </button>
//   );
// }


// function Sidebar({
//   collapsed,
//   isActive,
// }: {
//   collapsed: boolean;
//   isActive: (href: string, exact?: boolean) => boolean;
// }) {
//   return (
//     <div className="flex flex-col h-full bg-sky-800">
//       <UserProfileCard collapsed={collapsed} />

//       <nav className="flex-1 px-2 py-3 overflow-y-auto overflow-x-hidden scrollbar-none">
//         {collapsed ? (
//           // ── Collapsed: grouped pill clusters ──
//           <div className="flex flex-col space-y-8">
//             {navGroups.map((group) => (
//               <CollapsedGroup key={group.label} group={group} isActive={isActive} />
//             ))}
//           </div>
//         ) : (
//           // ── Expanded: full labelled nav ──
//           <div>
//             {navGroups.map((group) => (
//               <ExpandedGroup key={group.label} group={group} isActive={isActive} />
//             ))}
//           </div>
//         )}
//       </nav>
//     </div>
//   );
// }

// // ─── Main DashboardNav ────────────────────────────────────────────────────────
// export default function DashboardNav({ children }: { children: ReactNode }) {
//   const pathname = usePathname();
//   const [collapsed, setCollapsed] = useState(true);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   useEffect(() => {
//     setMobileOpen(false);
//   }, [pathname]);

//   const isActive = (href: string, exact?: boolean) => {
//     if (exact) return pathname === href;
//     return pathname.startsWith(href);
//   };

//   return (
//     <div className="flex h-dvh">

//       {/* ── Desktop Sidebar + Edge Toggle ────────────────────────────────── */}
//       <div className="relative hidden md:flex shrink-0">
//         <motion.aside
//           animate={{ width: collapsed ? 68 : 224 }}
//           transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
//           // overflow-hidden is the key — clips wider content during width animation
//           // so labels don't wrap or jump before the sidebar reaches full width
//           className="flex flex-col overflow-hidden border-r border-sky-900/40 shadow-xl shadow-sky-900/10"
//         >
//           {/*
//             Single Sidebar tree — no AnimatePresence swap.
//             Content switches via the `collapsed` prop.
//             This eliminates the flash entirely because there's no unmount/remount cycle.
//           */}
//           <Sidebar collapsed={collapsed} isActive={isActive} />
//         </motion.aside>

//         <EdgeToggle collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
//       </div>

//       {/* ── Mobile Hamburger ─────────────────────────────────────────────── */}
//       <button
//         className="md:hidden fixed top-4 left-4 z-50 size-10 bg-sky-800 border border-sky-700 rounded-lg flex items-center justify-center shadow-md hover:bg-sky-700 transition-colors"
//         onClick={() => setMobileOpen((o) => !o)}
//         aria-label="Toggle menu"
//       >
//         <AnimatePresence mode="wait" initial={false}>
//           {mobileOpen ? (
//             <motion.span
//               key="close"
//               initial={{ rotate: -90, opacity: 0 }}
//               animate={{ rotate: 0, opacity: 1 }}
//               exit={{ rotate: 90, opacity: 0 }}
//               transition={{ duration: 0.15 }}
//             >
//               <ChevronLeft className="size-4 text-white" />
//             </motion.span>
//           ) : (
//             <motion.span
//               key="open"
//               initial={{ rotate: 90, opacity: 0 }}
//               animate={{ rotate: 0, opacity: 1 }}
//               exit={{ rotate: -90, opacity: 0 }}
//               transition={{ duration: 0.15 }}
//             >
//               <Menu className="size-4 text-white" />
//             </motion.span>
//           )}
//         </AnimatePresence>
//       </button>

//       {/* ── Mobile Overlay ───────────────────────────────────────────────── */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div
//             key="overlay"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             onClick={() => setMobileOpen(false)}
//             className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
//           />
//         )}
//       </AnimatePresence>

//       {/* ── Mobile Drawer ────────────────────────────────────────────────── */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.aside
//             key="drawer"
//             initial={{ x: "-100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "-100%" }}
//             transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
//             className="fixed top-0 left-0 bottom-0 w-56 z-50 md:hidden shadow-2xl overflow-hidden"
//           >
//             <Sidebar collapsed={false} isActive={isActive} />
//           </motion.aside>
//         )}
//       </AnimatePresence>

//       {/* ── Page Content ─────────────────────────────────────────────────── */}
//       <main className="flex-1 min-w-0 flex overflow-hidden bg-neutral-50">
//         <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
//           <DashboardBreadcrumb />
//           <div className="px-10 py-6">{children}</div>
//         </div>
//         <RightPanel />
//       </main>

//     </div>
//   );
// }




// -------------------------------------- v 3.0 ---------------------------------

"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CreditCard, User, Palette, Menu, ChevronLeft } from "lucide-react";
import { Tooltip } from "radix-ui";
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
  // {
  //   label: "OVERVIEW",
  //   items: [
  //     {
  //       href: "/dashboard",
  //       label: "Dashboard",
  //       icon: IconDashboard,
  //       tablerIcon: null,
  //       exact: true,
  //     },
  //   ],
  // },
  {
    label: "MANAGE",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: IconDashboard,
        tablerIcon: null,
        exact: true,
      },
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

// ─── Types ────────────────────────────────────────────────────────────────────
type NavItemType = {
  href: string;
  label: string;
  icon: any;
  tablerIcon: any;
  exact: boolean;
};

// ─── Icon Renderer ────────────────────────────────────────────────────────────
function NavIcon({
  item,
  isActive,
  size = 18,
}: {
  item: NavItemType;
  isActive: boolean;
  size?: number;
}) {
  const colorClass = isActive ? "text-neutral-50" : "text-neutral-300 opacity-90";
  if (item.tablerIcon) {
    return (
      <item.tablerIcon
        size={size}
        className={`shrink-0 transition-colors duration-150 ${colorClass} hover:text-neutral-50`}
      />
    );
  }
  if (item.icon) {
    return (
      <item.icon
        className={`shrink-0 transition-colors duration-150 ${colorClass} hover:text-neutral-50`}
        style={{ width: size, height: size }}
        isAnimating={false}
      />
    );
  }
  return null;
}

// ─── Nav Pill with Radix Tooltip ──────────────────────────────────────────────
function NavPill({
  item,
  isActive,
}: {
  item: NavItemType;
  isActive: boolean;
}) {
  return (
    <Tooltip.Root delayDuration={200}>
      <Tooltip.Trigger asChild>
        <Link
          href={item.href}
          aria-label={item.label}
          style={{ WebkitTapHighlightColor: "transparent" }}
          className={`
            relative flex items-center justify-center pb-4 pt-4 w-full h-9 rounded-lg
            transition-colors duration-150
            
          `}
        >
          {/* Active left accent bar */}
          {/* {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full" />
          )} */}
          <NavIcon item={item} isActive={isActive} size={18} />
        </Link>
      </Tooltip.Trigger>

      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          sideOffset={12}
          className="
            z-50 select-none
            rounded-lg bg-neutral-900 px-3 py-1.5
            text-xs font-schibsted font-medium text-white
            shadow-lg
            will-change-[transform,opacity]
            data-[state=delayed-open]:animate-tooltip-in
            data-[state=closed]:animate-tooltip-out
          "
        >
          {item.label}
          <Tooltip.Arrow className="fill-neutral-900" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

// ─── Nav Group cluster ────────────────────────────────────────────────────────
function NavGroup({
  group,
  isActive,
}: {
  group: (typeof navGroups)[0];
  isActive: (href: string, exact?: boolean) => boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {/* Tiny section label */}
      {/* <p className="text-[8px] font-schibsted font-semibold tracking-widest text-white/30 uppercase text-center select-none mb-0.5">
        {group.label.slice(0, 3)}
      </p> */}
      {/* Dark pill container */}
      <div className="bg-sky-900 rounded-4xl p-1.5 flex flex-col gap-0.5">
        {group.items.map((item) => (
          <NavPill
            key={item.href}
            item={item}
            isActive={isActive(item.href, item.exact)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── User Profile Card (avatar only, always collapsed) ────────────────────────
function UserProfileCard() {
  const user = useUserStore((s) => s.user);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex justify-center py-3 border-b border-sky-700/50">
      <Avatar className="size-8 border-2 border-sky-600/50 shrink-0">
        <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
        <AvatarFallback className="bg-sky-700 text-white text-xs font-schibsted font-semibold">
          {getInitials(user?.name)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

// ─── Sidebar (always collapsed icon-only) ────────────────────────────────────
function Sidebar({
  isActive,
}: {
  isActive: (href: string, exact?: boolean) => boolean;
}) {
  return (
    <div className="flex flex-col h-full bg-sky-800">
      <UserProfileCard />
      <nav className="flex-1 px-2 py-3 overflow-y-auto overflow-x-hidden scrollbar-none">
        <div className="flex flex-col space-y-8">
          {navGroups.map((group) => (
            <NavGroup key={group.label} group={group} isActive={isActive} />
          ))}
        </div>
      </nav>
    </div>
  );
}

// ─── Main DashboardNav ────────────────────────────────────────────────────────
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
    // Tooltip.Provider wraps everything so tooltips work anywhere in the tree
    <Tooltip.Provider delayDuration={200} skipDelayDuration={100}>
      <div className="flex h-dvh">

        {/* ── Desktop Sidebar (fixed width, always collapsed) ─────────────── */}
        <aside className="hidden md:flex flex-col w-[68px] shrink-0 border-r border-sky-900/40 shadow-xl shadow-sky-900/10 overflow-hidden">
          <Sidebar isActive={isActive} />
        </aside>

        {/* ── Mobile Hamburger ───────────────────────────────────────────── */}
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
                <ChevronLeft className="size-4 text-white" />
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

        {/* ── Mobile Overlay ─────────────────────────────────────────────── */}
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

        {/* ── Mobile Drawer ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
              className="fixed top-0 left-0 bottom-0 w-[68px] z-50 md:hidden shadow-2xl overflow-hidden"
            >
              <Sidebar isActive={isActive} />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Page Content ───────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 flex overflow-hidden bg-neutral-50">
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <DashboardBreadcrumb />
            <div className="px-10 py-6">{children}</div>
          </div>
          <RightPanel />
        </main>

      </div>
    </Tooltip.Provider>
  );
}