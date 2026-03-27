


// "use client";

// import { useEffect, useRef, useState } from "react";
// import { usePathname } from "next/navigation";
// import { motion } from "motion/react";

// interface TocItem {
//   id: string;
//   text: string;
//   level: number;
// }

// const easeOutQuint = [0.23, 1, 0.32, 1] as const;

// export function DocsTableOfContents() {
//   const [headings, setHeadings] = useState<TocItem[]>([]);
//   const [activeId, setActiveId] = useState<string>("");
//   const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
//   const pathname = usePathname();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const elements = Array.from(
//         document.querySelectorAll("article h2, article h3")
//       ) as HTMLElement[];

//       const newHeadings = elements.map((el) => {
//         if (!el.id) {
//           el.id =
//             el.textContent
//               ?.toLowerCase()
//               .replace(/[^a-z0-9]+/g, "-")
//               .replace(/(^-|-$)/g, "") || "section";
//         }
//         return {
//           id: el.id,
//           text: el.textContent || "",
//           level: Number(el.tagName.substring(1)),
//         };
//       });

//       setHeadings(newHeadings);
//     }, 100);

//     return () => clearTimeout(timer);
//   }, [pathname]);

//   useEffect(() => {
//   if (headings.length === 0) return;

//   const observer = new IntersectionObserver(
//     (entries) => {
//       const intersecting = entries.filter((e) => e.isIntersecting);
//       if (intersecting.length > 0) {
//         setActiveId(intersecting[0].target.id);
//       }
//     },
//     { rootMargin: "0px 0px -80% 0px", threshold: 1.0 }
//   );

//   headings.forEach(({ id }) => {
//     const element = document.getElementById(id);
//     if (element) observer.observe(element);
//   });

//   const handleScroll = () => {
//     const nearBottom =
//       window.innerHeight + window.scrollY >= document.body.scrollHeight - 80;
//     if (nearBottom) {
//       setActiveId(headings[headings.length - 1].id);
//     }
//   };

//   window.addEventListener("scroll", handleScroll, { passive: true });

//   return () => {
//     observer.disconnect();
//     window.removeEventListener("scroll", handleScroll);
//   };
// }, [headings]);

//   const handleClick = (id: string) => {
//     const element = document.getElementById(id);
//     if (element) {
//       const y = element.getBoundingClientRect().top + window.scrollY - 80;
//       window.scrollTo({ top: y, behavior: "smooth" });
//     }
//   };

//   // Measure the active item's offsetTop and height for the indicator
//   const activeItem = activeId ? itemRefs.current[activeId] : null;
//   const indicatorTop = activeItem?.offsetTop ?? 0;
//   const indicatorHeight = activeItem?.offsetHeight ?? 0;

//   if (headings.length === 0) return null;

//   return (
//     <aside className="hidden xl:block sticky top-24 w-64 h-[calc(100vh-6rem)] overflow-y-auto pl-8">
//       <div className="mb-4">
//         <h3 className="text-sm font-schibsted font-semibold text-neutral-900 dark:text-neutral-100">
//           On This Page
//         </h3>
//       </div>
//       <nav>
//         <ul className="space-y-2 border-l border-neutral-200 dark:border-neutral-800 relative">

//           {/* Sliding indicator */}
//           {activeId && indicatorHeight > 0 && (
//             <motion.span
//               className="absolute left-[-2px] w-[3px] rounded-full bg-sky-600 dark:bg-sky-500"
//               animate={{
//                 top: indicatorTop,
//                 height: indicatorHeight,
//               }}
//               transition={{
//                 duration: 0.35,
//                 ease: easeOutQuint,
//               }}
//             />
//           )}

//           {headings.map((heading) => (
//             <li
//               key={heading.id}
//               ref={(el) => { itemRefs.current[heading.id] = el; }}
//               style={{ marginLeft: `${(heading.level - 2) * 12}px` }}
//             >
//               <button
//                 onClick={() => handleClick(heading.id)}
//                 className={`block w-full text-left pl-3 py-1 text-sm font-schibsted transition-colors duration-150 ${
//                   activeId === heading.id
//                     ? "text-sky-700 dark:text-sky-400 font-medium"
//                     : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
//                 }`}
//               >
//                 {heading.text}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </aside>
//   );
// }


"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function DocsTableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const containerRef = useRef<HTMLUListElement>(null);
  const pathname = usePathname();

  const [thumb, setThumb] = useState({ top: 0, height: 0 });
  const [path, setPath] = useState("");
  const [svgSize, setSvgSize] = useState({ width: 14, height: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = Array.from(
        document.querySelectorAll("article h2, article h3")
      ) as HTMLElement[];

      const newHeadings = elements.map((el) => {
        if (!el.id) {
          el.id =
            el.textContent
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") || "section";
        }
        return {
          id: el.id,
          text: el.textContent || "",
          level: Number(el.tagName.substring(1)),
        };
      });

      setHeadings(newHeadings);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id);
        }
      },
      { rootMargin: "0px 0px -80% 0px", threshold: 1.0 }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 80;
      if (nearBottom) {
        setActiveId(headings[headings.length - 1].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  // Build SVG path — measure offsetTop relative to the container
  useEffect(() => {
    if (!containerRef.current || headings.length === 0) return;

    const frame = requestAnimationFrame(() => {
      const containerTop = containerRef.current!.getBoundingClientRect().top;
      const d: string[] = [];
      let w = 0;
      let h = 0;

      headings.forEach((heading, i) => {
        const el = itemRefs.current[heading.id];
        if (!el) return;

        // x=1 for h2, x=9 for h3
        const offset = heading.level >= 3 ? 9 : 1;
        const prevHeading = headings[i - 1];
        const prevOffset = prevHeading
          ? prevHeading.level >= 3 ? 9 : 1
          : offset;

        // Measure relative to container
        const elRect = el.getBoundingClientRect();
        const top = elRect.top - containerTop;
        const bottom = elRect.bottom - containerTop;
        const mid = (top + bottom) / 2;

        w = Math.max(w, offset);
        h = Math.max(h, bottom);

        if (i === 0) {
          d.push(`M${offset} ${top}`);
        } else if (offset !== prevOffset) {
          const midTop = top + (bottom - top) / 2 - 4;
          const midBottom = top + (bottom - top) / 2 + 4;
          d.push(`L${prevOffset} ${midTop}`);
          d.push(`L${offset} ${midBottom}`);
          d.push(`L${offset} ${bottom}`);
        } else {
          d.push(`L${offset} ${bottom}`);
        }

        d.push(`L${offset} ${bottom}`);
        console.log("PATH:", d.join(" "));
      });

      setPath(d.join(" "));
      setSvgSize({ width: w + 1, height: h });
    });

    return () => cancelAnimationFrame(frame);
  }, [headings]);

  // Update thumb — also relative to container
  useEffect(() => {
    if (!activeId || !containerRef.current) return;
    const el = itemRefs.current[activeId];
    if (!el) return;

    const containerTop = containerRef.current.getBoundingClientRect().top;
    const elRect = el.getBoundingClientRect();
    setThumb({
      top: elRect.top - containerTop,
      height: elRect.height,
    });
  }, [activeId]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const makeMask = () =>
    path
      ? `url("data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize.width} ${svgSize.height}">
            <path d="${path}" stroke="white" stroke-width="1" fill="none" />
          </svg>`
        )}")`
      : undefined;

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block sticky top-24 w-64 h-[calc(100vh-6rem)] overflow-y-auto pl-8">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          On This Page
        </h3>
      </div>

      <nav>
        <div className="flex flex-row gap-0 items-start">

          {/* SVG mask track */}
          <div
            className="relative shrink-0"
            style={{ width: svgSize.width, height: svgSize.height }}
          >
            {/* Gray static track */}
            <div
              className="absolute inset-0"
              style={{ maskImage: makeMask() }}
            >
              <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800" />
            </div>

            {/* Animated thumb */}
            {activeId && (
              <div
                className="absolute inset-0"
                style={{ maskImage: makeMask() }}
              >
                <div
                  className="w-full bg-sky-600 dark:bg-sky-500"
                  style={{
                    marginTop: thumb.top,
                    height: thumb.height,
                    transition: "all 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                />
              </div>
            )}
          </div>

          {/* TOC Labels */}
          <ul ref={containerRef} className="flex flex-col flex-1">
            {headings.map((heading) => (
              <li
                key={heading.id}
                ref={(el) => { itemRefs.current[heading.id] = el; }}
              >
                <button
                  onClick={() => handleClick(heading.id)}
                  style={{
                    paddingLeft: `${(heading.level - 2) * 12 + 12}px`,
                  }}
                  className={`block w-full text-left py-1 text-sm transition-colors duration-150 ${
                    activeId === heading.id
                      ? "text-sky-700 dark:text-sky-400 font-medium"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  }`}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}