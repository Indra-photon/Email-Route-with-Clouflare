


"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const easeOutQuint = [0.23, 1, 0.32, 1] as const;

export function DocsTableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const pathname = usePathname();

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

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Measure the active item's offsetTop and height for the indicator
  const activeItem = activeId ? itemRefs.current[activeId] : null;
  const indicatorTop = activeItem?.offsetTop ?? 0;
  const indicatorHeight = activeItem?.offsetHeight ?? 0;

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block sticky top-24 w-64 h-[calc(100vh-6rem)] overflow-y-auto pl-8">
      <div className="mb-4">
        <h3 className="text-sm font-schibsted font-semibold text-neutral-900 dark:text-neutral-100">
          On This Page
        </h3>
      </div>
      <nav>
        <ul className="space-y-2 border-l border-neutral-200 dark:border-neutral-800 relative">

          {/* Sliding indicator */}
          {activeId && indicatorHeight > 0 && (
            <motion.span
              className="absolute left-[-2px] w-[3px] rounded-full bg-sky-600 dark:bg-sky-500"
              animate={{
                top: indicatorTop,
                height: indicatorHeight,
              }}
              transition={{
                duration: 0.35,
                ease: easeOutQuint,
              }}
            />
          )}

          {headings.map((heading) => (
            <li
              key={heading.id}
              ref={(el) => { itemRefs.current[heading.id] = el; }}
              style={{ marginLeft: `${(heading.level - 2) * 12}px` }}
            >
              <button
                onClick={() => handleClick(heading.id)}
                className={`block w-full text-left pl-3 py-1 text-sm font-schibsted transition-colors duration-150 ${
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
      </nav>
    </aside>
  );
}