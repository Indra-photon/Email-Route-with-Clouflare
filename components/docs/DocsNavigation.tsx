"use client";

import { CustomLink } from "@/components/CustomLink";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DocsNavigationProps {
  prev?: {
    title: string;
    href: string;
  };
  next?: {
    title: string;
    href: string;
  };
}

export function DocsNavigation({ prev, next }: DocsNavigationProps) {
  if (!prev && !next) return null;

  return (
    <div className="mt-12 pt-8 border-t border-neutral-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prev ? (
          <CustomLink
            href={prev.href}
            className="group flex items-center gap-3 rounded-lg border border-neutral-200 p-4 hover:border-sky-300 hover:bg-sky-50 transition-colors"
          >
            <ChevronLeft className="size-5 text-neutral-400 group-hover:text-sky-800 transition-colors" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-schibsted font-medium text-neutral-500 mb-1">
                Previous
              </p>
              <p className="text-sm font-schibsted font-semibold text-neutral-900 group-hover:text-sky-800 transition-colors truncate">
                {prev.title}
              </p>
            </div>
          </CustomLink>
        ) : (
          <div />
        )}

        {next && (
          <CustomLink
            href={next.href}
            className="group flex items-center gap-3 rounded-lg border border-neutral-200 p-4 hover:border-sky-300 hover:bg-sky-50 transition-colors md:ml-auto"
          >
            <div className="flex-1 min-w-0 text-right">
              <p className="text-xs font-schibsted text-neutral-500 mb-1">
                Next
              </p>
              <p className="text-sm font-schibsted font-semibold text-neutral-900 group-hover:text-sky-800 transition-colors truncate">
                {next.title}
              </p>
            </div>
            <ChevronRight className="size-5 text-neutral-400 group-hover:text-sky-800 transition-colors" />
          </CustomLink>
        )}
      </div>
    </div>
  );
}