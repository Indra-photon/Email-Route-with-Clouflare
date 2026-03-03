"use client";

import { useEffect, useState } from "react";
import { CustomLink } from "@/components/CustomLink";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface DocsTableOfContentsProps {
  headings?: TocItem[];
}

export function DocsTableOfContents({ headings = [] }: DocsTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
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
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block sticky top-6 w-56 h-[calc(100vh-3rem)] overflow-y-auto pl-4">
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
              style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
            >
              <button
                onClick={() => handleClick(heading.id)}
                className={`block w-full text-left border-l-2 -ml-px px-3 py-1 text-sm font-schibsted font-medium transition-colors ${
                  activeId === heading.id
                    ? "border-sky-800 text-sky-800 font-semibold"
                    : "border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300"
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