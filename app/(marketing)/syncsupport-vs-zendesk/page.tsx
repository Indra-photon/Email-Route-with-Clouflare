"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Footer } from "@/components/Footer";
import {
  IconCheck,
  IconX,
  IconMinus,
  IconArrowUp,
  IconArrowRight,
} from "@tabler/icons-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

// ─── Cost scaling bar chart ───────────────────────────────────────────────────

const chartData = [
  { teamSize: "1 agent", SyncSupport: 59, Zendesk: 55 },
  { teamSize: "5 agents", SyncSupport: 59, Zendesk: 275 },
  { teamSize: "10 agents", SyncSupport: 59, Zendesk: 550 },
];

const chartConfig = {
  SyncSupport: {
    label: "SyncSupport",
    color: "hsl(199, 89%, 48%)",
  },
  Zendesk: {
    label: "Zendesk",
    color: "hsl(0, 0%, 75%)",
  },
};

function CostBarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <BarChart
            data={chartData}
            margin={{ top: 16, right: 8, left: 0, bottom: 0 }}
            barCategoryGap="30%"
            barGap={4}
          >
            <CartesianGrid
              vertical={false}
              stroke="hsl(0,0%,90%)"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="teamSize"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
                fill: "hsl(0,0%,50%)",
                fontFamily: "inherit",
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
              tick={{
                fontSize: 11,
                fill: "hsl(0,0%,50%)",
                fontFamily: "inherit",
              }}
              width={48}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(0,0%,96%)", radius: 4 }}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    <span key={name} className="font-semibold">
                      ${value}/mo
                    </span>,
                    name,
                  ]}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="SyncSupport"
              fill="url(#ssGradient)"
              radius={[6, 6, 0, 0]}
              isAnimationActive={inView}
              animationBegin={80}
              animationDuration={700}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="Zendesk"
              fill="url(#zdGradient)"
              radius={[6, 6, 0, 0]}
              isAnimationActive={inView}
              animationBegin={160}
              animationDuration={700}
              animationEasing="ease-out"
            />
            <defs>
              <linearGradient id="ssGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(187,100%,42%)" />
                <stop offset="100%" stopColor="hsl(199,89%,38%)" />
              </linearGradient>
              <linearGradient id="zdGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0,0%,82%)" />
                <stop offset="100%" stopColor="hsl(0,0%,68%)" />
              </linearGradient>
            </defs>
          </BarChart>
        </ChartContainer>
      </motion.div>

      <p className="font-schibsted text-[10px] text-neutral-400 text-center mt-2">
        Monthly cost / mo. SyncSupport stays flat regardless of team size.
      </p>
    </div>
  );
}

// ─── Feature comparison table data ────────────────────────────────────────────

type RowVal =
  | { type: "yes" }
  | { type: "no" }
  | { type: "partial"; note: string }
  | { type: "text"; value: string };

const comparisonRows: { feature: string; ss: RowVal; zd: RowVal }[] = [
  {
    feature: "Monthly price (5 agents)",
    ss: { type: "text", value: "$59 flat" },
    zd: { type: "text", value: "$275" },
  },
  {
    feature: "Price scales with team size",
    ss: { type: "no" },
    zd: { type: "yes" },
  },
  {
    feature: "Per-agent fees",
    ss: { type: "no" },
    zd: { type: "yes" },
  },
  {
    feature: "Reply from Slack",
    ss: { type: "yes" },
    zd: { type: "no" },
  },
  {
    feature: "Email → Slack routing",
    ss: { type: "yes" },
    zd: { type: "partial", note: "Integration add-on" },
  },
  {
    feature: "Live chat widget",
    ss: { type: "yes" },
    zd: { type: "yes" },
  },
  {
    feature: "Custom domain email",
    ss: { type: "yes" },
    zd: { type: "yes" },
  },
  {
    feature: "Ticket claiming & assignment",
    ss: { type: "yes" },
    zd: { type: "yes" },
  },
  {
    feature: "AI features",
    ss: { type: "partial", note: "Coming soon" },
    zd: { type: "partial", note: "$50/agent add-on" },
  },
  {
    feature: "Setup time",
    ss: { type: "text", value: "~5 minutes" },
    zd: { type: "text", value: "Days to weeks" },
  },
  {
    feature: "Onboarding call required",
    ss: { type: "no" },
    zd: { type: "partial", note: "Often required" },
  },
  {
    feature: "No long-term contracts",
    ss: { type: "yes" },
    zd: { type: "partial", note: "Annual plans push" },
  },
];

function CompCell({ val, highlight }: { val: RowVal; highlight: boolean }) {
  const textCls = highlight ? "text-white" : "text-neutral-700";
  const mutedCls = highlight ? "text-sky-200" : "text-neutral-400";
  const partialCls = highlight ? "text-sky-200" : "text-amber-600";

  if (val.type === "yes") {
    return (
      <span className="inline-flex items-center justify-center">
        <IconCheck
          size={16}
          stroke={2.5}
          className={highlight ? "text-white" : "text-sky-600"}
        />
      </span>
    );
  }
  if (val.type === "no") {
    return (
      <span className="inline-flex items-center justify-center">
        <IconX
          size={16}
          stroke={2}
          className={highlight ? "text-sky-300" : "text-neutral-300"}
        />
      </span>
    );
  }
  if (val.type === "partial") {
    return (
      <span className="flex flex-col items-center gap-0.5">
        <IconMinus size={14} stroke={2} className={partialCls} />
        <span
          className={`font-schibsted text-[10px] leading-tight text-center ${highlight ? "text-sky-300" : "text-amber-500"}`}
        >
          {val.note}
        </span>
      </span>
    );
  }
  return (
    <span
      className={`font-schibsted text-xs font-medium text-center leading-snug ${textCls}`}
    >
      {val.value}
    </span>
  );
}

// ─── Pain points cards ────────────────────────────────────────────────────────

const painPoints = [
  {
    title: "Every new hire is an instant bill spike.",
    body: "With Zendesk at $55/agent/month, a single new hire adds $660/year. Onboard 5 people and your support tool costs more than a junior salary. SyncSupport is flat — hire 50 people, pay the same $59.",
  },
  {
    title: "The real Zendesk bill is double the sticker price.",
    body: "AI features ($50/agent), QA tools ($35/agent), and workforce management ($25/agent) are all add-ons. A 5-agent team that wants AI support pays $950/month — not $275. SyncSupport has no add-on tiers.",
  },
  {
    title: "Setup takes days, not minutes.",
    body: "Zendesk requires routing rules, macros, views, triggers, agent roles, and usually an onboarding call. SyncSupport needs a DNS record and a Slack webhook. Most teams are live inside 5 minutes.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VsZendeskPage() {
  return (
    <div className="bg-white">
      <section className="flex flex-col">
        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="border-b border-neutral-200 bg-white">
          <Container className="px-4 sm:px-8 xl:px-0 pt-16 pb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-600 mb-5">
                Direct comparison · 2025
              </p>
              <Heading
                as="h1"
                className="text-neutral-900 leading-tight mb-4 max-w-7xl"
              >
                SyncSupport vs Zendesk.{" "}
                <span className="text-sky-800 font-extralight">
                  The honest comparison.
                </span>
              </Heading>
              <Paragraph
                variant="home-par"
                className="text-neutral-600 max-w-7xl mb-8"
              >
                Zendesk Suite Team costs $55/agent/month. For a 5-person team
                that&apos;s $275/month before a single add-on. SyncSupport
                charges $59/month flat — unlimited agents, no surprises.
              </Paragraph>

              {/* Quick stats strip */}
              <div className="flex flex-wrap gap-6">
                {[
                  { stat: "~5 min", label: "SyncSupport setup time" },
                  { stat: "$2,592", label: "Saved per year (5-agent team)" },
                  { stat: "$0", label: "Per-agent fee" },
                ].map((item) => (
                  <div key={item.stat} className="flex flex-col">
                    <span className="font-schibsted text-3xl font-bold text-sky-800 leading-none">
                      {item.stat}
                    </span>
                    <span className="font-schibsted text-xs text-neutral-500 mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </Container>
        </div>

        {/* ── Quick verdict cards ────────────────────────────────────────────── */}
        <div className="bg-neutral-50 py-12 border-b border-neutral-200">
          <Container className="px-4 sm:px-8 xl:px-0">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: EASE }}
              className="mb-8"
            >
              <Heading
                as="h2"
                variant="muted"
                className="text-neutral-900 font-semibold leading-tight mb-2"
              >
                At a glance.
              </Heading>
              <Paragraph variant="home-par" className="text-neutral-500">
                The key differences between SyncSupport and Zendesk,
                side-by-side.
              </Paragraph>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SyncSupport card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: EASE, delay: 0 }}
                className="rounded-2xl bg-sky-800 p-6 text-white"
              >
                <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-300 mb-3">
                  SyncSupport · That&apos;s us
                </p>
                <div className="space-y-3">
                  {[
                    ["Monthly price (5 agents)", "$59/mo flat"],
                    ["Price if you add 5 more agents", "$59/mo — unchanged"],
                    ["Slack-native reply", "Yes — built-in"],
                    ["AI add-ons", "Included (coming soon)"],
                    ["Setup time", "~5 minutes"],
                    ["Onboarding call", "None needed"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-start justify-between gap-4 border-b border-sky-700 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="font-schibsted text-sm text-sky-200">
                        {k}
                      </span>
                      <span className="font-schibsted text-sm font-semibold text-white text-right">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Zendesk card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.06 }}
                className="rounded-2xl border border-neutral-200 bg-white p-6"
              >
                <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">
                  Zendesk Suite Team
                </p>
                <div className="space-y-3">
                  {[
                    ["Monthly price (5 agents)", "$275/mo"],
                    ["Price if you add 5 more agents", "$550/mo"],
                    ["Slack-native reply", "No — integration add-on only"],
                    ["AI add-ons", "$50/agent/mo extra"],
                    ["Setup time", "Days to weeks"],
                    ["Onboarding call", "Often required"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="font-schibsted text-sm text-neutral-500">
                        {k}
                      </span>
                      <span className="font-schibsted text-sm font-semibold text-neutral-700 text-right">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </Container>
        </div>

        {/* ── Pricing math ──────────────────────────────────────────────────── */}
        <div className="bg-neutral-50 py-16 border-b border-neutral-200">
          <Container className="px-4 sm:px-8 xl:px-0">
            {/* Section header — full width */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: EASE }}
              className="mb-10"
            >
              <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-600 mb-3">
                The math
              </p>
              <Heading
                as="h2"
                variant="muted"
                className="text-neutral-900 font-semibold leading-tight mb-3"
              >
                The real cost of Zendesk.
              </Heading>
              <Paragraph
                variant="home-par"
                className="text-neutral-600 max-w-2xl"
              >
                Per-agent pricing looks cheap at 1 agent. At 5 agents, Zendesk
                costs 4.6× more than SyncSupport. At 10 agents, it&apos;s 9.3×
                more — for the same support workflow.
              </Paragraph>
            </motion.div>

            {/* Grid: top row equal halves, bottom row full-width */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* ── Cost table card ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
                className="rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col"
              >
                {/* Card header */}
                <div className="px-6 pt-6 pb-4">
                  <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    Cost by team size
                  </p>
                </div>

                {/* Table — grows to fill card height */}
                <div className="overflow-x-auto flex-1">
                  <table className="w-full border-collapse min-w-[420px] h-full">
                    <thead>
                      <tr>
                        <th className="bg-neutral-50 px-5 py-3 text-left">
                          <span className="font-schibsted text-xs font-semibold uppercase tracking-widest text-neutral-400">
                            Team size
                          </span>
                        </th>
                        <th className="bg-sky-800 px-5 py-3 text-center">
                          <span className="font-schibsted text-xs font-semibold text-white">
                            SyncSupport
                          </span>
                          <span className="block font-schibsted text-[10px] text-sky-300 mt-0.5">
                            flat rate
                          </span>
                        </th>
                        <th className="bg-neutral-50 px-5 py-3 text-center">
                          <span className="font-schibsted text-xs font-semibold text-neutral-700">
                            Zendesk
                          </span>
                          <span className="block font-schibsted text-[10px] text-neutral-400 mt-0.5">
                            Suite Team
                          </span>
                        </th>
                        <th className="bg-neutral-50 px-5 py-3 text-center">
                          <span className="font-schibsted text-xs font-semibold text-neutral-700">
                            You save
                          </span>
                          <span className="block font-schibsted text-[10px] text-neutral-400 mt-0.5">
                            per year
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          size: "1 agent",
                          ss: "$59/mo",
                          zd: "$55/mo",
                          save: "—",
                        },
                        {
                          size: "5 agents",
                          ss: "$59/mo",
                          zd: "$275/mo",
                          save: "$2,592",
                        },
                        {
                          size: "10 agents",
                          ss: "$59/mo",
                          zd: "$550/mo",
                          save: "$5,892",
                        },
                        {
                          size: "20 agents",
                          ss: "$159/mo*",
                          zd: "$1,100/mo",
                          save: "$11,292",
                        },
                      ].map((row, i) => {
                        const isLast = i === 3;
                        return (
                          <motion.tr
                            key={row.size}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.3,
                              delay: 0.2 + i * 0.05,
                              ease: EASE,
                            }}
                            className="group"
                          >
                            <td
                              className={`px-5 py-4 font-schibsted text-sm font-medium text-neutral-700 bg-white group-hover:bg-neutral-50 transition-colors ${!isLast ? "border-b border-neutral-100" : ""}`}
                            >
                              {row.size}
                            </td>
                            <td
                              className={`px-5 py-4 text-center bg-sky-800 ${!isLast ? "border-b border-sky-700" : ""}`}
                            >
                              <span className="font-schibsted text-sm font-semibold text-white">
                                {row.ss}
                              </span>
                            </td>
                            <td
                              className={`px-5 py-4 text-center bg-white group-hover:bg-neutral-50 transition-colors ${!isLast ? "border-b border-neutral-100" : ""}`}
                            >
                              <span className="font-schibsted text-sm text-neutral-700">
                                {row.zd}
                              </span>
                            </td>
                            <td
                              className={`px-5 py-4 text-center bg-white group-hover:bg-neutral-50 transition-colors ${!isLast ? "border-b border-neutral-100" : ""}`}
                            >
                              <span
                                className={`font-schibsted text-sm font-semibold ${row.save === "—" ? "text-neutral-400" : "text-emerald-600"}`}
                              >
                                {row.save}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Card footer */}
                <div className="px-5 py-3 bg-neutral-50">
                  <p className="font-schibsted text-[10px] text-neutral-400">
                    * Scale plan. Zendesk base price only — AI, QA, and WFM
                    add-ons push real costs to 2–3× higher.
                  </p>
                </div>
              </motion.div>

              {/* ── Chart card ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.12 }}
                className="rounded-2xl bg-white shadow-sm p-6 flex flex-col"
              >
                <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-6">
                  Monthly cost as your team grows
                </p>
                <div className="flex-1 flex items-center">
                  <CostBarChart />
                </div>
              </motion.div>

              {/* ── Savings callout — full width ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.18 }}
                className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-sky-800 to-cyan-700 p-8 text-white shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-300 mb-2">
                      5-agent team · annual savings
                    </p>
                    <div className="font-schibsted text-5xl font-bold leading-none">
                      $2,592
                    </div>
                  </div>
                  <p className="font-schibsted text-sm  font-light text-white leading-relaxed sm:max-w-sm sm:text-right">
                    That&apos;s SyncSupport Growth ($708/yr) vs Zendesk Suite
                    Team ($3,300/yr). Before a single add-on.
                  </p>
                </div>
              </motion.div>
            </div>
          </Container>
        </div>

        {/* ── Feature comparison table ───────────────────────────────────────── */}
        <div className="bg-neutral-50 py-16 border-b border-neutral-200">
          <Container className="px-4 sm:px-8 xl:px-0">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: EASE }}
              className="mb-10"
            >
              <Heading
                as="h2"
                variant="muted"
                className="text-neutral-900 font-semibold leading-tight mb-2"
              >
                Feature by feature.
              </Heading>
              <Paragraph variant="home-par" className="text-neutral-500">
                Where SyncSupport wins, where Zendesk wins, and what you
                actually need.
              </Paragraph>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
              className="rounded-2xl border border-neutral-200 overflow-hidden shadow-sm bg-white"
            >
              <table className="w-full border-collapse min-w-[500px]">
                <thead>
                  <tr>
                    <th className="bg-neutral-50 px-5 py-4 text-left w-[50%] border-b border-neutral-200">
                      <span className="font-schibsted text-xs font-semibold uppercase tracking-widest text-neutral-400">
                        Feature
                      </span>
                    </th>
                    <th className="bg-sky-800 px-5 py-4 text-center border-b border-sky-700">
                      <span className="font-schibsted text-sm font-semibold text-white">
                        SyncSupport
                      </span>
                      <span className="block font-schibsted text-[10px] text-sky-300 mt-0.5">
                        That&apos;s us
                      </span>
                    </th>
                    <th className="bg-neutral-50 px-5 py-4 text-center border-b border-neutral-200">
                      <span className="font-schibsted text-sm font-semibold text-neutral-700">
                        Zendesk
                      </span>
                      <span className="block font-schibsted text-[10px] text-neutral-400 mt-0.5">
                        Suite Team
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => {
                    const isLast = i === comparisonRows.length - 1;
                    return (
                      <motion.tr
                        key={row.feature}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.3,
                          delay: 0.15 + i * 0.035,
                          ease: EASE,
                        }}
                        className="group"
                      >
                        <td
                          className={`px-5 py-4 font-schibsted tracking-tighter text-sm text-neutral-900 bg-white group-hover:bg-neutral-50 transition-colors ${!isLast ? "border-b border-neutral-100" : ""}`}
                        >
                          {row.feature}
                        </td>
                        <td
                          className={`px-5 py-4 text-center align-middle bg-sky-800 ${!isLast ? "border-b border-sky-700" : ""}`}
                        >
                          <CompCell val={row.ss} highlight={true} />
                        </td>
                        <td
                          className={`px-5 py-4 text-center align-middle bg-white group-hover:bg-neutral-50 transition-colors ${!isLast ? "border-b border-neutral-100" : ""}`}
                        >
                          <CompCell val={row.zd} highlight={false} />
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
            <p className="font-schibsted text-xs text-neutral-400 mt-3 text-center">
              Based on publicly available pricing and feature pages as of 2025.
            </p>
          </Container>
        </div>

        {/* ── Pain points ───────────────────────────────────────────────────── */}
        <div className="bg-white py-16 border-b border-neutral-200">
          <Container className="px-4 sm:px-8 xl:px-0">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: EASE }}
              className="mb-10"
            >
              <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-600 mb-4">
                Why it matters
              </p>
              <Heading
                as="h2"
                variant="muted"
                className="text-neutral-900 font-semibold leading-tight mb-2"
              >
                Why per-agent pricing punishes growth.
              </Heading>
              <Paragraph
                variant="home-par"
                className="text-neutral-500 max-w-7xl"
              >
                The cost structure you choose shapes how you think about
                staffing, hiring, and scaling support. Here&apos;s where teams
                feel the squeeze.
              </Paragraph>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {painPoints.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease: EASE, delay: i * 0.07 }}
                  className="rounded-2xl border border-neutral-200 bg-white p-6"
                >
                  <Heading
                    as="h3"
                    variant="small"
                    className="text-sky-800 font-normal leading-tight mb-3"
                  >
                    {card.title}
                  </Heading>
                  <Paragraph
                    variant="home-par"
                    className="text-neutral-600 leading-relaxed"
                  >
                    {card.body}
                  </Paragraph>
                </motion.div>
              ))}
            </div>
          </Container>
        </div>

        {/* ── Honest "When Zendesk makes sense" ─────────────────────────────── */}
        <div className="bg-neutral-50 py-16 border-b border-neutral-200">
          <Container className="px-4 sm:px-8 xl:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">
                  The honest take
                </p>
                <Heading
                  as="h2"
                  variant="muted"
                  className="text-neutral-900 font-semibold leading-tight mb-4"
                >
                  When Zendesk makes sense.
                </Heading>
                <Paragraph
                  variant="home-par"
                  className="text-neutral-600 leading-relaxed mb-6"
                >
                  We&apos;re not here to say Zendesk is bad software. It&apos;s
                  a mature product with real strengths — it just has a very
                  different target customer.
                </Paragraph>
                <div className="space-y-3">
                  {[
                    "Enterprise companies with 50+ dedicated support agents",
                    "Teams that need deep Salesforce or SAP CRM integration",
                    "Call centers managing high-volume voice + email workflows",
                    "Organizations that require SOC 2 Type II / HIPAA compliance",
                    "Teams that have dedicated IT staff to manage configuration",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <IconCheck
                        size={16}
                        className="text-neutral-400 mt-0.5 shrink-0"
                      />
                      <Paragraph
                        variant="home-par"
                        className="text-neutral-600"
                      >
                        {item}
                      </Paragraph>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
              >
                <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-600 mb-4">
                  And where SyncSupport wins
                </p>
                <Heading
                  as="h2"
                  variant="muted"
                  className="text-neutral-900 font-semibold leading-tight mb-4"
                >
                  Built for teams that live in Slack.
                </Heading>
                <Paragraph
                  variant="home-par"
                  className="text-neutral-600 leading-relaxed mb-6"
                >
                  SyncSupport is designed for startups, SMBs, and product teams
                  who want customer support to feel like a natural extension of
                  how they already work.
                </Paragraph>
                <div className="space-y-3">
                  {[
                    "Startups and SMBs with 1–50 team members",
                    "Teams already using Slack as their primary communication tool",
                    "Founders who handle support themselves and want zero overhead",
                    "Growing teams that need cost-predictable infrastructure",
                    "Companies that need to be live today, not next week",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <IconCheck
                        size={16}
                        className="text-sky-600 mt-0.5 shrink-0"
                      />
                      <Paragraph
                        variant="home-par"
                        className="text-neutral-600"
                      >
                        {item}
                      </Paragraph>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </Container>
        </div>

        {/* ── Internal links ────────────────────────────────────────────────── */}
        <div className="bg-white py-12 border-b border-neutral-200">
          <Container className="px-4 sm:px-8 xl:px-0">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex flex-wrap gap-4 items-center"
            >
              <p className="font-schibsted text-sm font-semibold text-neutral-500 mr-2">
                Learn more:
              </p>
              {[
                { label: "See full pricing", href: "/pricing" },
                {
                  label: "Flat-rate pricing explained",
                  href: "/blog/flat-rate-helpdesk-vs-per-agent-pricing-which-one-makes-sense-for-small-teams",
                },
                {
                  label: "Frequently asked questions",
                  href: "/frequently-asked-questions",
                },
                {
                  label: "Stop losing tickets",
                  href: "/blog/stop-losing-customer-support-tickets-how-to-fix",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 font-schibsted text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors underline underline-offset-2"
                >
                  {link.label}
                  <IconArrowRight size={13} />
                </Link>
              ))}
            </motion.div>
          </Container>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <div className="border-t border-neutral-200 bg-neutral-50 py-20">
          <Container className="px-4 sm:px-8 xl:px-0 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-600 mb-4">
                Ready to switch?
              </p>
              <Heading
                as="h2"
                className="text-neutral-900 font-light tracking-tighter leading-tight mb-4"
              >
                Start handling support in Slack.{" "}
                <span className="text-sky-800">In 5 minutes.</span>
              </Heading>
              <Paragraph
                variant="home-par"
                className="text-neutral-600 mb-8 max-w-xl mx-auto"
              >
                No per-agent fees. No onboarding call. No credit card required
                to start. Just connect Slack, add your domain, and go live.
              </Paragraph>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="bg-gradient-to-b from-white/20 to-transparent rounded-[16px] inline-flex">
                  <a href="/sign-up" className="block">
                    <button className="group p-[4px] rounded-[12px] bg-gradient-to-b from-sky-900 to-cyan-700 shadow-[0_1px_2px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]">
                      <div className="bg-gradient-to-b from-white/[0.08] to-transparent rounded-[8px] px-6 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-schibsted font-semibold tracking-wide uppercase text-white text-sm">
                            Start free
                          </span>
                          <div className="relative flex items-center justify-center w-5 h-5">
                            <span className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/20 transition-all duration-150" />
                            <IconArrowUp
                              size={13}
                              stroke={2.5}
                              className="relative text-white rotate-90 transition-transform duration-100 group-hover:rotate-45"
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  </a>
                </div>

                <div className="rounded-[16px] inline-flex">
                  <Link href="/pricing" className="block">
                    <button className="group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]">
                      <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-6 py-[9px]">
                        <span className="font-schibsted font-semibold tracking-wide uppercase text-neutral-900 text-sm">
                          View pricing
                        </span>
                      </div>
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </Container>
        </div>

        <Footer />
      </section>
    </div>
  );
}
