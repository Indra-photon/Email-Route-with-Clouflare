// "use client";

// import { useState } from "react";
// import { CustomLink } from "@/components/CustomLink";
// import { ChevronDown, Menu, X } from "lucide-react";
// import { motion, AnimatePresence } from "motion/react";
// import { usePathname } from "next/navigation";

// interface DocSection {
//   title: string;
//   items: {
//     title: string;
//     href: string;
//   }[];
// }

// const docSections: DocSection[] = [
//   {
//     title: "Getting Started",
//     items: [
//       { title: "Introduction", href: "/docs" },
//       // { title: "Quick Start", href: "/docs/getting-started" },
//     ],
//   },
//   {
//     title: "Domain Setup",
//     items: [
//       { title: "Add Your Domain", href: "/docs/domains" },
//     ],
//   },
//   {
//     title: "Integrations",
//     items: [
//       { title: "Slack Integration", href: "/docs/integrations/slack" },
//       { title: "Discord Integration", href: "/docs/integrations/discord" },
//     ],
//   },
//   {
//     title: "Email Aliases",
//     items: [
//       { title: "Create an Alias", href: "/docs/aliases" },
//     ],
//   },
//   {
//     title: "Ticket Management",
//     items: [
//       { title: "View Tickets", href: "/docs/tickets" },
//     ],
//   },
//   {
//     title: "Chatbot",
//     items: [
//       { title: "Install Widget", href: "/docs/chatbot" },
//     ],
//   },
//   // {
//   //   title: "API Reference",
//   //   items: [
//   //     { title: "Authentication", href: "/docs/api" },
//   //   ],
//   // },
//   // {
//   //   title: "Advanced",
//   //   items: [
//   //     { title: "Email Forwarding", href: "/docs/advanced" },
//   //   ],
//   // },
//   // {
//   //   title: "Troubleshooting",
//   //   items: [
//   //     { title: "Common Issues", href: "/docs/troubleshooting" },
//   //   ],
//   // },
//   // {
//   //   title: "Resources",
//   //   items: [
//   //     { title: "Changelog", href: "/docs/resources" },
//   //   ],
//   // },
// ];

// export function DocsSidebar() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [expandedSections, setExpandedSections] = useState<Set<string>>(
//     new Set(docSections.map((s) => s.title))
//   );
//   const pathname = usePathname();

//   const toggleSection = (title: string) => {
//     setExpandedSections((prev) => {
//       const next = new Set(prev);
//       if (next.has(title)) {
//         next.delete(title);
//       } else {
//         next.add(title);
//       }
//       return next;
//     });
//   };

//   const isActive = (href: string) => pathname === href;

//   const SidebarContent = () => (
//     <nav className="space-y-6">
//       {docSections.map((section) => {
//         const isExpanded = expandedSections.has(section.title);
//         return (
//           <div key={section.title}>
//             <button
//               onClick={() => toggleSection(section.title)}
//               className="flex w-full items-center justify-between text-sm font-schibsted font-semibold text-neutral-900 mb-2"
//             >
//               {section.title}
//               <ChevronDown
//                 className={`size-4 transition-transform ${
//                   isExpanded ? "rotate-180" : ""
//                 }`}
//               />
//             </button>
//             <AnimatePresence>
//               {isExpanded && (
//                 <motion.ul
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{ height: "auto", opacity: 1 }}
//                   exit={{ height: 0, opacity: 0 }}
//                   transition={{ duration: 0.2 }}
//                   className="space-y-1 overflow-hidden"
//                 >
//                   {section.items.map((item) => (
//                     <li key={item.href}>
//                       <CustomLink
//                         href={item.href}
//                         className={`block rounded-lg px-3 py-2 text-sm font-schibsted font-medium transition-colors ${
//                           isActive(item.href)
//                             ? "bg-sky-100 text-sky-800 font-semibold"
//                             : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
//                         }`}
//                       >
//                         {item.title}
//                       </CustomLink>
//                     </li>
//                   ))}
//                 </motion.ul>
//               )}
//             </AnimatePresence>
//           </div>
//         );
//       })}
//     </nav>
//   );

//   return (
//     <>
//       {/* Mobile Toggle Button */}
//       <button
//         onClick={() => setMobileOpen(!mobileOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 rounded-lg bg-white p-2 shadow-lg border border-neutral-200"
//       >
//         {mobileOpen ? (
//           <X className="size-5 text-neutral-900" />
//         ) : (
//           <Menu className="size-5 text-neutral-900" />
//         )}
//       </button>

//       {/* Mobile Sidebar */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setMobileOpen(false)}
//               className="lg:hidden fixed inset-0 bg-neutral-900/50 z-40"
//             />
//             <motion.aside
//               initial={{ x: -320 }}
//               animate={{ x: 0 }}
//               exit={{ x: -320 }}
//               transition={{ type: "spring", damping: 20 }}
//               className="lg:hidden fixed top-0 left-0 bottom-0 w-80 bg-white border-r border-neutral-200 z-40 overflow-y-auto p-6"
//             >
//               <div className="mb-8">
//                 <h2 className="text-lg font-schibsted font-semibold text-neutral-900">
//                   Documentation
//                 </h2>
//               </div>
//               <SidebarContent />
//             </motion.aside>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Desktop Sidebar */}
//       <aside className="hidden lg:block sticky top-6 w-64 h-[calc(100vh-3rem)] overflow-y-auto pr-4">
//         <div className="mb-8">
//           <h2 className="text-lg font-schibsted font-semibold text-neutral-900">
//             Documentation
//           </h2>
//         </div>
//         <SidebarContent />
//       </aside>
//     </>
//   );
// }


"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { CustomLink } from "@/components/CustomLink";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// ─── Easing curves (user-provided) ─────────────────────────────────
const easeOutCubic: [number, number, number, number] = [0.215, 0.61, 0.355, 1];
const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

// ─── Types ──────────────────────────────────────────────────────────
interface DocSection {
  title: string;
  items: {
    title: string;
    href: string;
  }[];
}

// ─── Data ───────────────────────────────────────────────────────────
const docSections: DocSection[] = [
  {
    title: "Getting Started",
    items: [{ title: "Introduction", href: "/docs" }],
  },
  {
    title: "Domain Setup",
    items: [{ title: "Add Your Domain", href: "/docs/domains" }],
  },
  {
    title: "Integrations",
    items: [
      { title: "Slack Integration", href: "/docs/integrations/slack" },
      { title: "Discord Integration", href: "/docs/integrations/discord" },
    ],
  },
  {
    title: "Email Aliases",
    items: [{ title: "Create an Alias", href: "/docs/aliases" }],
  },
  {
    title: "Ticket Management",
    items: [{ title: "View Tickets", href: "/docs/tickets" }],
  },
  {
    title: "Chatbot",
    items: [{ title: "Install Widget", href: "/docs/chatbot" }],
  },
];

// ─── Collapsible section items ──────────────────────────────────────
// Uses measured height with overflow hidden. The height animation is
// kept to a fast 200ms with easeOutCubic so it feels snappy.
// Crucially: this ONLY animates when the user explicitly toggles a
// section — not on route changes.

function SectionItems({
  items,
  isExpanded,
  pathname,
  prefersReducedMotion,
}: {
  items: DocSection["items"];
  isExpanded: boolean;
  pathname: string;
  prefersReducedMotion: boolean | null;
}) {
  const contentRef = useRef<HTMLUListElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setMeasuredHeight(contentRef.current.scrollHeight);
    }
  }, [items]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setMeasuredHeight(el.scrollHeight);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const duration = prefersReducedMotion ? 0 : 0.18;

  return (
    <motion.div
      initial={false}
      animate={{
        height: isExpanded ? measuredHeight : 0,
        opacity: isExpanded ? 1 : 0,
      }}
      transition={{
        height: { duration, ease: easeOutCubic },
        opacity: { duration: duration * 0.7, ease: "easeOut" },
      }}
      style={{ overflow: "hidden" }}
      aria-hidden={!isExpanded}
    >
      <ul ref={contentRef} className="space-y-0.5 pb-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="relative">
              {isActive && (
                <motion.div
                  layoutId="docs-sidebar-active"
                  className="absolute inset-0 rounded-lg bg-sky-50 border border-sky-100"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 28,
                  }}
                />
              )}
              <CustomLink
                href={item.href}
                className={cn(
                  "relative z-10 block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "text-sky-700 font-semibold"
                    : "text-neutral-800 hover:text-neutral-900 hover:bg-neutral-50"
                )}
              >
                {item.title}
              </CustomLink>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

// ─── Single sidebar section ─────────────────────────────────────────
function SidebarSection({
  section,
  isExpanded,
  onToggle,
  pathname,
  prefersReducedMotion,
}: {
  section: DocSection;
  isExpanded: boolean;
  onToggle: () => void;
  pathname: string;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-neutral-600 transition-colors duration-150 mb-1.5 px-3 py-1"
        aria-expanded={isExpanded}
      >
        {section.title}
        <motion.span
          initial={false}
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.18,
            ease: easeOutCubic,
          }}
        >
          <ChevronDown className="size-3.5" />
        </motion.span>
      </button>

      <SectionItems
        items={section.items}
        isExpanded={isExpanded}
        pathname={pathname}
        prefersReducedMotion={prefersReducedMotion}
      />
    </div>
  );
}

// ─── Shared nav content ─────────────────────────────────────────────
function SidebarNav({
  expandedSections,
  toggleSection,
  pathname,
  prefersReducedMotion,
  onLinkClick,
}: {
  expandedSections: Set<string>;
  toggleSection: (title: string) => void;
  pathname: string;
  prefersReducedMotion: boolean | null;
  onLinkClick?: () => void;
}) {
  return (
    <nav className="space-y-4" onClick={onLinkClick}>
      {docSections.map((section) => (
        <SidebarSection
          key={section.title}
          section={section}
          isExpanded={expandedSections.has(section.title)}
          onToggle={() => toggleSection(section.title)}
          pathname={pathname}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </nav>
  );
}

// ─── Main export ────────────────────────────────────────────────────
export function DocsSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(docSections.map((s) => s.title))
  );
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const toggleSection = useCallback((title: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  }, []);

  // Auto-expand section containing the active route (without collapsing others)
  useEffect(() => {
    const activeSection = docSections.find((section) =>
      section.items.some((item) => item.href === pathname)
    );
    if (activeSection && !expandedSections.has(activeSection.title)) {
      setExpandedSections((prev) => new Set([...prev, activeSection.title]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* ── Mobile toggle ──────────────────────────────────────────── */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="lg:hidden fixed top-4 left-4 z-50 rounded-xl bg-white/90 backdrop-blur-sm p-2.5 shadow-lg border border-neutral-200/80"
        aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
      >
        {mobileOpen ? (
          <X className="size-5 text-neutral-700" />
        ) : (
          <Menu className="size-5 text-neutral-700" />
        )}
      </button>

      {/* ── Mobile sidebar ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.2,
                ease: easeOutCubic,
              }}
              onClick={closeMobile}
              className="lg:hidden fixed inset-0 bg-neutral-900/40 backdrop-blur-[2px] z-40"
            />

            <motion.aside
              initial={{ x: "-100%", opacity: 0.8 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "-100%", opacity: 0.8 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                ease: easeOutQuint,
              }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-40 overflow-y-auto overscroll-contain"
            >
              <div className="p-6">
                <div className="mb-8 pt-2">
                  <h2 className="text-base font-semibold text-neutral-900">
                    Documentation
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Guides & reference
                  </p>
                </div>
                <SidebarNav
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                  pathname={pathname}
                  prefersReducedMotion={prefersReducedMotion}
                  onLinkClick={closeMobile}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ────────────────────────────────────────── */}
      <aside className="hidden lg:block sticky top-6 w-64 h-[calc(100dvh-3rem)] overflow-y-auto pr-4">
        <div className="mb-8">
          <h2 className="text-base font-semibold text-neutral-900">
            Documentation
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Guides & reference
          </p>
        </div>
        <SidebarNav
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          pathname={pathname}
          prefersReducedMotion={prefersReducedMotion}
        />
      </aside>
    </>
  );
}