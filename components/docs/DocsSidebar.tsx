
// "use client";

// import { useState, useCallback, useRef, useEffect } from "react";
// import { CustomLink } from "@/components/CustomLink";
// import { ChevronDown, Menu, X } from "lucide-react";
// import { motion, AnimatePresence } from "motion/react";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";

// // ─── Easing curves (user-provided) ─────────────────────────────────
// const easeOutCubic: [number, number, number, number] = [0.215, 0.61, 0.355, 1];
// const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

// // ─── Types ──────────────────────────────────────────────────────────
// interface DocSection {
//   title: string;
//   items: {
//     title: string;
//     href: string;
//   }[];
// }

// // ─── Data ───────────────────────────────────────────────────────────
// const docSections: DocSection[] = [
//   {
//     title: "Getting Started",
//     items: [{ title: "Introduction", href: "/docs" }],
//   },
//   {
//     title: "Domain Setup",
//     items: [{ title: "Add Your Domain", href: "/docs/domains" }],
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
//     items: [{ title: "Create an Alias", href: "/docs/aliases" }],
//   },
//   {
//     title: "Ticket Management",
//     items: [{ title: "View Tickets", href: "/docs/tickets" }],
//   },
//   {
//     title: "Chatbot",
//     items: [{ title: "Install Widget", href: "/docs/chatbot" }],
//   },
// ];

// // ─── Collapsible section items ──────────────────────────────────────
// // Uses measured height with overflow hidden. The height animation is
// // kept to a fast 200ms with easeOutCubic so it feels snappy.
// // Crucially: this ONLY animates when the user explicitly toggles a
// // section — not on route changes.

// function SectionItems({
//   items,
//   isExpanded,
//   pathname,
// }: {
//   items: DocSection["items"];
//   isExpanded: boolean;
//   pathname: string;
// }) {
//   const contentRef = useRef<HTMLUListElement>(null);
//   const [measuredHeight, setMeasuredHeight] = useState<number>(0);

//   useEffect(() => {
//     if (contentRef.current) {
//       setMeasuredHeight(contentRef.current.scrollHeight);
//     }
//   }, [items]);

//   useEffect(() => {
//     const el = contentRef.current;
//     if (!el) return;
//     const observer = new ResizeObserver(() => {
//       setMeasuredHeight(el.scrollHeight);
//     });
//     observer.observe(el);
//     return () => observer.disconnect();
//   }, []);

//   const duration = 0.18;

//   return (
//     <motion.div
//       initial={false}
//       animate={{
//         height: isExpanded ? measuredHeight : 0,
//         opacity: isExpanded ? 1 : 0,
//       }}
//       transition={{
//         height: { duration, ease: easeOutCubic },
//         opacity: { duration: duration * 0.7, ease: "easeOut" },
//       }}
//       style={{ overflow: "hidden" }}
//       aria-hidden={!isExpanded}
//     >
//       <ul ref={contentRef} className="space-y-0.5 pb-1">
//         {items.map((item) => {
//           const isActive = pathname === item.href;
//           return (
//             <li key={item.href} className="relative">
//               {isActive && (
//                 <motion.div
//                   layoutId="docs-sidebar-active"
//                   className="absolute inset-0 rounded-lg bg-sky-50 border border-sky-100"
//                   transition={{
//                     type: "spring",
//                     stiffness: 380,
//                     damping: 28,
//                   }}
//                 />
//               )}
//               <CustomLink
//                 href={item.href}
//                 className={cn(
//                   "relative z-10 block rounded-lg py-2 text-sm font-medium transition-colors duration-150",
//                   isActive
//                     ? "text-sky-700 font-semibold"
//                     : "text-neutral-800 hover:text-neutral-900 hover:bg-neutral-50"
//                 )}
//               >
//                 {item.title}
//               </CustomLink>
//             </li>
//           );
//         })}
//       </ul>
//     </motion.div>
//   );
// }

// // ─── Single sidebar section ─────────────────────────────────────────
// function SidebarSection({
//   section,
//   isExpanded,
//   onToggle,
//   pathname,
// }: {
//   section: DocSection;
//   isExpanded: boolean;
//   onToggle: () => void;
//   pathname: string;
// }) {
//   return (
//     <div>
//       <button
//         onClick={onToggle}
//         className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-neutral-600 transition-colors duration-150 mb-1.5 py-1"
//         aria-expanded={isExpanded}
//       >
//         {section.title}
//         <motion.span
//           initial={false}
//           animate={{ rotate: isExpanded ? 180 : 0 }}
//           transition={{
//             duration: 0.18,
//             ease: easeOutCubic,
//           }}
//         >
//           <ChevronDown className="size-3.5" />
//         </motion.span>
//       </button>

//       <SectionItems
//         items={section.items}
//         isExpanded={isExpanded}
//         pathname={pathname}
//       />
//     </div>
//   );
// }

// // ─── Shared nav content ─────────────────────────────────────────────
// function SidebarNav({
//   expandedSections,
//   toggleSection,
//   pathname,
//   onLinkClick,
// }: {
//   expandedSections: Set<string>;
//   toggleSection: (title: string) => void;
//   pathname: string;
//   onLinkClick?: () => void;
// }) {
//   return (
//     <nav className="space-y-4" onClick={onLinkClick}>
//       {docSections.map((section) => (
//         <SidebarSection
//           key={section.title}
//           section={section}
//           isExpanded={expandedSections.has(section.title)}
//           onToggle={() => toggleSection(section.title)}
//           pathname={pathname}
//         />
//       ))}
//     </nav>
//   );
// }

// // ─── Main export ────────────────────────────────────────────────────
// export function DocsSidebar() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [expandedSections, setExpandedSections] = useState<Set<string>>(
//     () => new Set(docSections.map((s) => s.title))
//   );
//   const pathname = usePathname();

//   const toggleSection = useCallback((title: string) => {
//     setExpandedSections((prev) => {
//       const next = new Set(prev);
//       if (next.has(title)) {
//         next.delete(title);
//       } else {
//         next.add(title);
//       }
//       return next;
//     });
//   }, []);

//   // Auto-expand section containing the active route (without collapsing others)
//   useEffect(() => {
//     const activeSection = docSections.find((section) =>
//       section.items.some((item) => item.href === pathname)
//     );
//     if (activeSection && !expandedSections.has(activeSection.title)) {
//       setExpandedSections((prev) => new Set([...prev, activeSection.title]));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pathname]);

//   const closeMobile = useCallback(() => setMobileOpen(false), []);

//   return (
//     <>
//       {/* ── Mobile toggle ──────────────────────────────────────────── */}
//       <button
//         onClick={() => setMobileOpen((v) => !v)}
//         className="lg:hidden fixed top-4 left-4 z-50 rounded-xl bg-white/90 backdrop-blur-sm p-2.5 shadow-lg border border-neutral-200/80"
//         aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
//       >
//         {mobileOpen ? (
//           <X className="size-5 text-neutral-700" />
//         ) : (
//           <Menu className="size-5 text-neutral-700" />
//         )}
//       </button>

//       {/* ── Mobile sidebar ─────────────────────────────────────────── */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{
//                 duration: 0.2,
//                 ease: easeOutCubic,
//               }}
//               onClick={closeMobile}
//               className="lg:hidden fixed inset-0 bg-neutral-900/40 backdrop-blur-[2px] z-40"
//             />

//             <motion.aside
//               initial={{ x: "-100%", opacity: 0.8 }}
//               animate={{ x: "0%", opacity: 1 }}
//               exit={{ x: "-100%", opacity: 0.8 }}
//               transition={{
//                 duration: 0.3,
//                 ease: easeOutQuint,
//               }}
//               className="lg:hidden fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-40 overflow-y-auto overscroll-contain"
//             >
//               <div className="p-6">
//                 <div className="mb-8 pt-2">
//                   <h2 className="text-base font-semibold text-neutral-900">
//                     Documentation
//                   </h2>
//                   <p className="text-xs text-neutral-400 mt-0.5">
//                     Guides & reference
//                   </p>
//                 </div>
//                 <SidebarNav
//                   expandedSections={expandedSections}
//                   toggleSection={toggleSection}
//                   pathname={pathname}
//                   onLinkClick={closeMobile}
//                 />
//               </div>
//             </motion.aside>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ── Desktop sidebar ────────────────────────────────────────── */}
//       <aside className="hidden lg:block sticky top-6 w-64 h-[calc(100dvh-3rem)] overflow-y-auto pr-4">
//         <div className="mb-8">
//           <h2 className="text-base font-semibold text-neutral-900">
//             Documentation
//           </h2>
//           <p className="text-xs text-neutral-400 mt-0.5">
//             Guides & reference
//           </p>
//         </div>
//         <SidebarNav
//           expandedSections={expandedSections}
//           toggleSection={toggleSection}
//           pathname={pathname}
//         />
//       </aside>
//     </>
//   );
// }



"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { CustomLink } from "@/components/CustomLink";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// ─── Easing curves ──────────────────────────────────────────────────
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

function SectionItems({
  items,
  isExpanded,
  pathname,
  itemRefs,
}: {
  items: DocSection["items"];
  isExpanded: boolean;
  pathname: string;
  itemRefs: React.MutableRefObject<Record<string, HTMLLIElement | null>>;
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

  return (
    <motion.div
      initial={false}
      animate={{
        height: isExpanded ? measuredHeight : 0,
        opacity: isExpanded ? 1 : 0,
      }}
      transition={{
        height: { duration: 0.18, ease: easeOutCubic },
        opacity: { duration: 0.13, ease: "easeOut" },
      }}
      style={{ overflow: "hidden" }}
    >
      <ul ref={contentRef} className="space-y-0.5 pb-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li
              key={item.href}
              ref={(el) => { itemRefs.current[item.href] = el; }}
            >
              <CustomLink
                href={item.href}
                className={cn(
                  "relative z-10 block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "text-sky-700 font-semibold"
                    : "text-neutral-800 hover:text-neutral-900"
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
  itemRefs,
}: {
  section: DocSection;
  isExpanded: boolean;
  onToggle: () => void;
  pathname: string;
  itemRefs: React.MutableRefObject<Record<string, HTMLLIElement | null>>;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-neutral-600 transition-colors duration-150 mb-1.5 py-1"
        aria-expanded={isExpanded}
      >
        {section.title}
        <motion.span
          initial={false}
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.18, ease: easeOutCubic }}
        >
          <ChevronDown className="size-3.5" />
        </motion.span>
      </button>

      <SectionItems
        items={section.items}
        isExpanded={isExpanded}
        pathname={pathname}
        itemRefs={itemRefs}
      />
    </div>
  );
}

// ─── Shared nav content ─────────────────────────────────────────────

function SidebarNav({
  expandedSections,
  toggleSection,
  pathname,
  onLinkClick,
}: {
  expandedSections: Set<string>;
  toggleSection: (title: string) => void;
  pathname: string;
  onLinkClick?: () => void;
}) {
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  // Indicator position state
  const [indicatorStyle, setIndicatorStyle] = useState<{
    top: number;
    height: number;
    opacity: number;
  }>({ top: 0, height: 0, opacity: 0 });

  useEffect(() => {
    const activeEl = itemRefs.current[pathname];
    const navEl = navRef.current;

    if (!activeEl || !navEl) {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    const navRect = navEl.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();

    setIndicatorStyle({
      top: itemRect.top - navRect.top + navEl.scrollTop,
      height: itemRect.height,
      opacity: 1,
    });
  }, [pathname, expandedSections]);

  return (
    <div ref={navRef} className="relative" onClick={onLinkClick}>
      {/* ── Shared persistent background indicator ── */}
      <motion.div
        className="absolute left-0 right-0 rounded-lg pointer-events-none z-0"
        animate={{
          top: indicatorStyle.top,
          height: indicatorStyle.height,
          opacity: indicatorStyle.opacity,
        }}
        transition={{
          top: { duration: 0.35, ease: easeOutQuint },
          height: { duration: 0.25, ease: easeOutCubic },
          opacity: { duration: 0.15, ease: "easeOut" },
        }}
      />

      {/* ── Shared persistent left border indicator ── */}
      <motion.div
        className="absolute left-0 w-[3px] rounded-full bg-sky-600 pointer-events-none z-0"
        animate={{
          top: indicatorStyle.top + 4,
          height: indicatorStyle.height - 8,
          opacity: indicatorStyle.opacity,
        }}
        transition={{
          top: { duration: 0.35, ease: easeOutQuint },
          height: { duration: 0.25, ease: easeOutCubic },
          opacity: { duration: 0.15, ease: "easeOut" },
        }}
      />

      <nav className="space-y-4">
        {docSections.map((section) => (
          <SidebarSection
            key={section.title}
            section={section}
            isExpanded={expandedSections.has(section.title)}
            onToggle={() => toggleSection(section.title)}
            pathname={pathname}
            itemRefs={itemRefs}
          />
        ))}
      </nav>
    </div>
  );
}

// ─── Main export ────────────────────────────────────────────────────

export function DocsSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(docSections.map((s) => s.title))
  );
  const pathname = usePathname();

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

  // Auto-expand section containing the active route
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
              transition={{ duration: 0.2, ease: easeOutCubic }}
              onClick={closeMobile}
              className="lg:hidden fixed inset-0 bg-neutral-900/40 backdrop-blur-[2px] z-40"
            />

            <motion.aside
              initial={{ x: "-100%", opacity: 0.8 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "-100%", opacity: 0.8 }}
              transition={{ duration: 0.3, ease: easeOutQuint }}
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
        />
      </aside>
    </>
  );
}