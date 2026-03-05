"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function DocsTableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    // Give it a brief moment for the page to render fully
    const timer = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll("article h2, article h3")) as HTMLElement[];

      const newHeadings = elements.map((el) => {
        // Generate an ID if it doesn't have one
        if (!el.id) {
          el.id = el.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "section";
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
        // Find all intersecting entries
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          // If multiple are visible, pick the first one from the DOM order
          setActiveId(intersecting[0].target.id);
        }
      },
      { rootMargin: "0px 0px -80% 0px", threshold: 1.0 }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset by 80px to account for sticky header
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block sticky top-24 w-64 h-[calc(100vh-6rem)] overflow-y-auto pl-8">
      <div className="mb-4">
        <h3 className="text-sm font-schibsted font-semibold text-neutral-900">
          On This Page
        </h3>
      </div>
      <nav>
        <ul className="space-y-2 border-l border-neutral-200">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ marginLeft: `${(heading.level - 2) * 12}px` }}
            >
              <button
                onClick={() => handleClick(heading.id)}
                className={`block w-full text-left border-l-[3px] -ml-[2px] pl-3 py-1 text-sm font-schibsted transition-colors ${activeId === heading.id
                    ? "border-sky-600 text-sky-700 font-medium"
                    : "border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-300"
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