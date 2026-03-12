"use client";

import React from "react";
import { motion } from "motion/react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";

// ─── Easing ───────────────────────────────────────────────────────────────────

const EASE_OUT_QUAD: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

// ─── Types ────────────────────────────────────────────────────────────────────

type CellValue =
  | { type: "yes" }
  | { type: "no" }
  | { type: "partial"; note: string }
  | { type: "text"; value: string };

interface ComparisonRow {
  feature: string;
  slackdesk: CellValue;
  ticketping: CellValue;
  front: CellValue;
  pylon: CellValue;
  zendesk: CellValue;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const rows: ComparisonRow[] = [
  {
    feature: "Email → Slack routing",
    slackdesk:  { type: "yes" },
    ticketping: { type: "yes" },
    front:      { type: "partial", note: "Slack notification only" },
    pylon:      { type: "yes" },
    zendesk:    { type: "partial", note: "Integration add-on" },
  },
  {
    feature: "Reply from Slack",
    slackdesk:  { type: "yes" },
    ticketping: { type: "yes" },
    front:      { type: "partial", note: "Via Slack Connect only" },
    pylon:      { type: "yes" },
    zendesk:    { type: "no" },
  },
  {
    feature: "Live chat widget",
    slackdesk:  { type: "yes" },
    ticketping: { type: "yes" },
    front:      { type: "yes" },
    pylon:      { type: "yes" },
    zendesk:    { type: "yes" },
  },
  {
    feature: "Flat pricing — no per-seat fees",
    slackdesk:  { type: "yes" },
    ticketping: { type: "yes" },
    front:      { type: "no" },
    pylon:      { type: "no" },
    zendesk:    { type: "no" },
  },
  {
    feature: "Multiple email aliases",
    slackdesk:  { type: "yes" },
    ticketping: { type: "partial", note: "Limited on lower tiers" },
    front:      { type: "yes" },
    pylon:      { type: "partial", note: "Via email integration" },
    zendesk:    { type: "yes" },
  },
  {
    feature: "Multi-domain support",
    slackdesk:  { type: "yes" },
    ticketping: { type: "partial", note: "Scale plan only" },
    front:      { type: "yes" },
    pylon:      { type: "yes" },
    zendesk:    { type: "yes" },
  },
  {
    feature: "Ticket claiming & assignment",
    slackdesk:  { type: "yes" },
    ticketping: { type: "yes" },
    front:      { type: "yes" },
    pylon:      { type: "yes" },
    zendesk:    { type: "yes" },
  },
  {
    feature: "Reports & analytics",
    slackdesk:  { type: "yes" },
    ticketping: { type: "partial", note: "Startup plan+" },
    front:      { type: "yes" },
    pylon:      { type: "yes" },
    zendesk:    { type: "yes" },
  },
  {
    feature: "AI features",
    slackdesk:  { type: "partial", note: "Coming soon" },
    ticketping: { type: "yes" },
    front:      { type: "yes" },
    pylon:      { type: "partial", note: "Expensive add-on" },
    zendesk:    { type: "partial", note: "Expensive add-on" },
  },
  {
    feature: "Pricing",
    slackdesk:  { type: "text", value: "$19–$159/mo flat" },
    ticketping: { type: "text", value: "$29–$199/mo flat" },
    front:      { type: "text", value: "$25/seat/mo" },
    pylon:      { type: "text", value: "$59/seat/mo" },
    zendesk:    { type: "text", value: "$55/agent/mo" },
  },
  {
    feature: "Setup time",
    slackdesk:  { type: "text", value: "~5 minutes" },
    ticketping: { type: "text", value: "~10 minutes" },
    front:      { type: "text", value: "~1–2 hours" },
    pylon:      { type: "text", value: "2–5 days" },
    zendesk:    { type: "text", value: "Days to weeks" },
  },
];

const competitors = ["slackdesk", "ticketping", "front", "pylon", "zendesk"] as const;
type Competitor = typeof competitors[number];

const LABELS: Record<Competitor, string> = {
  slackdesk:  "SlackDesk",
  ticketping: "Ticketping",
  front:      "Front",
  pylon:      "Pylon",
  zendesk:    "Zendesk",
};

// ─── Cell renderer ────────────────────────────────────────────────────────────

function Cell({
  value,
  isUs,
}: {
  value: CellValue;
  isUs: boolean;
}) {
  const baseText = isUs ? "text-white" : "text-neutral-700";
  const mutedText = isUs ? "text-sky-200" : "text-neutral-400";
  const partialText = isUs ? "text-sky-200" : "text-amber-600";
  const partialNote = isUs ? "text-sky-300" : "text-amber-500";

  if (value.type === "yes") {
    return (
      <span className="inline-flex items-center justify-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isUs ? "text-white" : "text-sky-600"}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    );
  }

  if (value.type === "no") {
    return (
      <span className="inline-flex items-center justify-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isUs ? "text-sky-300" : "text-neutral-300"}
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </span>
    );
  }

  if (value.type === "partial") {
    return (
      <span className="flex flex-col items-center gap-0.5">
        <span className={`font-schibsted text-xs font-semibold ${partialText}`}>~</span>
        <span className={`font-schibsted text-[10px] leading-tight text-center ${partialNote}`}>
          {value.note}
        </span>
      </span>
    );
  }

  // text
  return (
    <span
      className={`font-schibsted text-xs font-medium leading-snug text-center ${baseText}`}
    >
      {value.value}
    </span>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function ComparisonTableSection() {
  return (
    <section className="w-full bg-white py-16 md:py-20 lg:py-28">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-0">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_OUT_QUAD }}
          className="mb-12"
        >
          <Heading as="h2" className="text-neutral-900 mb-4 leading-tight font-semibold">
            How we stack up.
          </Heading>
          <Paragraph variant="home-par" className="">
            Most tools bolt Slack on as an afterthought. We built around it from day one.
          </Paragraph>
        </motion.div>

        {/* Table wrapper — horizontal scroll on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT_QUAD }}
          className="w-full overflow-x-auto rounded-2xl border border-neutral-200 shadow-sm"
        >
          <table className="w-full min-w-[680px] border-collapse">

            {/* ── Column headers ── */}
            <thead>
              <tr>
                {/* Feature label column */}
                <th className="bg-neutral-50 px-5 py-4 text-left w-[30%] border-b border-neutral-200">
                  <span className="font-schibsted text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    Feature
                  </span>
                </th>

                {competitors.map((c) => {
                  const isUs = c === "slackdesk";
                  return (
                    <th
                      key={c}
                      className={`
                        px-4 py-4 text-center border-b
                        ${isUs
                          ? "bg-sky-800 border-sky-700"
                          : "bg-neutral-50 border-neutral-200"
                        }
                      `}
                    >
                      <span
                        className={`font-schibsted text-sm font-semibold ${
                          isUs ? "text-white" : "text-neutral-700"
                        }`}
                      >
                        {LABELS[c]}
                      </span>
                      {isUs && (
                        <span className="block font-schibsted text-[10px] font-medium text-sky-300 mt-0.5">
                          That&apos;s us
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* ── Rows ── */}
            <tbody>
              {rows.map((row, i) => {
                const isLast = i === rows.length - 1;
                return (
                  <motion.tr
                    key={row.feature}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: 0.15 + i * 0.04,
                      ease: EASE_OUT_QUAD,
                    }}
                    className="group"
                  >
                    {/* Feature name */}
                    <td
                      className={`
                        px-5 py-4 font-schibsted text-sm font-medium text-neutral-700
                        bg-white group-hover:bg-neutral-50 transition-colors duration-150
                        ${!isLast ? "border-b border-neutral-100" : ""}
                      `}
                    >
                      {row.feature}
                    </td>

                    {competitors.map((c) => {
                      const isUs = c === "slackdesk";
                      const value = row[c];
                      return (
                        <td
                          key={c}
                          className={`
                            px-4 py-4 text-center align-middle
                            ${isUs
                              ? `bg-sky-800 ${!isLast ? "border-b border-sky-700" : ""}`
                              : `bg-white group-hover:bg-neutral-50 transition-colors duration-150 ${!isLast ? "border-b border-neutral-100" : ""}`
                            }
                          `}
                        >
                          <Cell value={value} isUs={isUs} />
                        </td>
                      );
                    })}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3, ease: EASE_OUT_QUAD }}
          className="font-schibsted text-xs text-neutral-400 mt-4 text-center"
        >
          Competitor data based on publicly available pricing and feature pages as of 2025.
        </motion.p>
      </div>
    </section>
  );
}