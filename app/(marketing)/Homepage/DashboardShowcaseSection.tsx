"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";

// ─── Stat pills shown above the screenshot ────────────────────────────────────

const stats = [
  { label: "Avg. first response", value: "14 min" },
  { label: "Tickets resolved today", value: "100%" },
  { label: "Team visibility", value: "Real-time" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardShowcaseSection() {
  return (
    /*
     * Matches the FeatureTabs decorated-grid pattern exactly:
     * cols: [1fr] [2.5rem hatched] [auto card] [2.5rem hatched] [1fr]
     * rows: [1fr]  [1px hr]  [auto content]  [1px hr]  [1fr]
     */
    <div
      className={[
        "relative grid w-full",
        "grid-cols-[1fr_0.75rem_auto_0.75rem_1fr] md:grid-cols-[1fr_2.5rem_auto_2.5rem_1fr]",
        "grid-rows-[1fr_1px_auto_1px_1fr]",
        "bg-white dark:bg-gray-950",
        "[--pattern-fg:theme(colors.gray.950/5%)]",
        "dark:[--pattern-fg:theme(colors.white/10%)]",
      ].join(" ")}
    >
      {/* ── Left hatched column ──────────────────────────────────────────── */}
      <div
        className={[
          "col-start-2 row-span-full row-start-1",
          "relative -right-px",
          "border-x border-x-(--pattern-fg)",
          "bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)]",
          "bg-[size:10px_10px] bg-fixed",
        ].join(" ")}
      />

      {/* ── Right hatched column ─────────────────────────────────────────── */}
      <div
        className={[
          "col-start-4 row-span-full row-start-1",
          "relative -left-px",
          "border-x border-x-(--pattern-fg)",
          "bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)]",
          "bg-[size:10px_10px] bg-fixed",
        ].join(" ")}
      />

      {/* ── Top 1px rule ─────────────────────────────────────────────────── */}
      <div
        className={[
          "relative -bottom-px",
          "col-span-full col-start-1 row-start-2",
          "h-px bg-(--pattern-fg)",
        ].join(" ")}
      />

      {/* ── Bottom 1px rule ──────────────────────────────────────────────── */}
      <div
        className={[
          "relative -top-px",
          "col-span-full col-start-1 row-start-4",
          "h-px bg-(--pattern-fg)",
        ].join(" ")}
      />

      {/* ── Content cell ─────────────────────────────────────────────────── */}
      <div className="col-start-3 row-start-3 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-0 pt-6 pb-6 md:py-16">
          {/* ── Eyebrow ────────────────────────────────────────────────── */}
          <p className="font-schibsted text-sm md:text-xs font-semibold uppercase tracking-widest text-sky-800 mb-4 sm:p-4 text-left">
            Full visibility
          </p>

          {/* ── Heading block ──────────────────────────────────────────── */}
          <motion.div
            className="mb-10 sm:px-4"
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2,
            }}
          >
            <Heading
              as="h2"
              className="text-neutral-900 font-schibsted leading-tight"
            >
              <span>An Integrated Dashboard. </span>
              <span className="text-sky-800 font-extralight">
                — Ticket management, response times, and team performance at a
                glance.
              </span>
            </Heading>
          </motion.div>

          {/* ── Dashboard screenshot ────────────────────────────────────── */}
          <motion.div className="relative w-full">
            {/* Outer frame — browser chrome feel */}
            <div className=" bg-neutral-100 p-2">
              {/* Fake browser bar */}
              {/* <div className="flex items-center gap-1.5 px-3 py-2 mb-2">
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
                <div className="ml-3 h-5 flex-1 max-w-xs rounded-md bg-neutral-100 border border-neutral-200" />
              </div> */}

              {/* Screenshot — responsive, fills the frame */}
              <div className="relative w-full overflow-hidden border border-neutral-200">
                <Image
                  src="/dashboard-screenshot2.png"
                  alt="syncsupport dashboard — ticket management, response times, and team performance at a glance"
                  width={1400}
                  height={900}
                  className="w-full h-auto object-cover object-top"
                  priority={false}
                  quality={90}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
