"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  SidebarItem,
  SidebarFolder,
  SidebarFolderTrigger,
  SidebarFolderContent,
} from "fumadocs-ui/components/sidebar/base";
import type { Item as PageItem, Folder as PageFolder } from "fumadocs-core/page-tree";
import { create } from "zustand";
import { cn } from "@/lib/utils";

// ─── Shared hover store ───────────────────────────────────────────────────────
// Zustand lets all sibling Item components share a single hoveredId so the
// motion layoutId background slides smoothly from one item to the next.

const useSidebarHover = create<{
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}>((set) => ({
  hoveredId: null,
  setHoveredId: (id) => set({ hoveredId: id }),
}));

// ─── Easing ───────────────────────────────────────────────────────────────────

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];
const easeOutCubic: [number, number, number, number] = [0.215, 0.61, 0.355, 1];

// ─── Custom Item ──────────────────────────────────────────────────────────────

export function CustomItem({ item }: { item: PageItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.url;
  const { hoveredId, setHoveredId } = useSidebarHover();
  const isHovered = hoveredId === item.url;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHoveredId(item.url)}
      onMouseLeave={() => setHoveredId(null)}
    >
      {/* ── Sliding hover background ──────────────────────────────── */}
      {isHovered && (
        <motion.div
          layoutId="sidebar-hover-bg"
          className="absolute inset-0 rounded-lg bg-neutral-50 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: easeOutCubic }}
        />
      )}

      {/* ── Active left bar ───────────────────────────────────────── */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-bar"
          className="absolute left-0 w-[3px] rounded-full bg-sky-600 z-10 pointer-events-none"
          style={{ top: 4, bottom: 4 }}
          transition={{ duration: 0.35, ease: easeOutQuint }}
        />
      )}

      {/* ── Link ─────────────────────────────────────────────────── */}
      <SidebarItem
        href={item.url}
        className={cn(
          "relative z-10 block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
          isActive
            ? "text-sky-700 font-semibold"
            : "text-neutral-800 hover:text-neutral-900"
        )}
      >
        {item.name}
      </SidebarItem>
    </div>
  );
}

// ─── Custom Folder ────────────────────────────────────────────────────────────

export function CustomFolder({
  item,
  children,
}: {
  item: PageFolder;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <SidebarFolder defaultOpen>
      {/* ── Section header ───────────────────────────────────────── */}
      <SidebarFolderTrigger
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 py-1 hover:text-neutral-500 transition-colors"
      >
        {item.name}
      </SidebarFolderTrigger>

      {/* ── Items ─────────────────────────────────────────────────── */}
      <SidebarFolderContent className="space-y-0.5">
        {children}
      </SidebarFolderContent>
    </SidebarFolder>
  );
}
