"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { CustomLink } from "@/components/CustomLink";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

interface SearchResult {
  title: string;
  href: string;
  excerpt: string;
  category: string;
}

const mockSearchData: SearchResult[] = [
  {
    title: "Quick Start",
    href: "/docs/getting-started",
    excerpt: "Get Email Router running in 5 minutes...",
    category: "Getting Started",
  },
  {
    title: "Slack Integration",
    href: "/docs/integrations/slack",
    excerpt: "Connect Email Router to your Slack workspace...",
    category: "Integrations",
  },
  {
    title: "Add Your Domain",
    href: "/docs/domains",
    excerpt: "Configure your domain to receive emails...",
    category: "Domain Setup",
  },
];

export function DocSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = mockSearchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleResultClick = (href: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 transition-colors w-64"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left font-schibsted font-normal">
          Search docs...
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 text-xs font-schibsted font-medium text-neutral-600">
          <span>⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-neutral-900/50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-neutral-200 z-50 overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3">
                <Search className="size-5 text-neutral-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search documentation..."
                  className="flex-1 bg-transparent text-sm font-schibsted font-normal text-neutral-900 placeholder:text-neutral-500 outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="size-4" />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-1 text-xs font-schibsted font-medium text-neutral-600">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto p-2">
                {query.trim().length === 0 ? (
                  <div className="py-12 text-center">
                    <Search className="size-8 text-neutral-300 mx-auto mb-3" />
                    <p className="text-sm font-schibsted font-normal text-neutral-500">
                      Start typing to search documentation
                    </p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm font-schibsted font-normal text-neutral-500">
                      No results found for "{query}"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {results.map((result) => (
                      <button
                        key={result.href}
                        onClick={() => handleResultClick(result.href)}
                        className="w-full text-left rounded-lg px-3 py-3 hover:bg-neutral-50 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-schibsted font-semibold text-neutral-900 group-hover:text-sky-800 transition-colors">
                              {result.title}
                            </p>
                            <p className="text-xs font-schibsted font-normal text-neutral-600 mt-1 line-clamp-1">
                              {result.excerpt}
                            </p>
                          </div>
                          <span className="text-xs font-schibsted font-medium text-neutral-500 shrink-0">
                            {result.category}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {results.length > 0 && (
                <div className="border-t border-neutral-200 px-4 py-2 bg-neutral-50">
                  <p className="text-xs font-schibsted font-normal text-neutral-500">
                    {results.length} result{results.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}