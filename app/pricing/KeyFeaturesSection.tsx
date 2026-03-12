"use client";

import React from "react";
import { motion } from "motion/react";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";

// ─── Easing ───────────────────────────────────────────────────────────────────

const EASE_OUT_QUINT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const EASE_OUT_QUAD: [number, number, number, number]  = [0.25, 0.46, 0.45, 0.94];

// ─── Feature data ─────────────────────────────────────────────────────────────

const features = [
  {
    number: "01",
    title: "Email aliases, straight into Slack",
    description:
      "Create support@, billing@, leads@ — each alias lands in its own dedicated Slack channel. Your team sees everything, organized, the moment it arrives.",
    // Tabler: IconMailForward
    icon: (
      <svg
        width="52"
        height="52"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
        <path d="M3 7l9 6 9-6" />
        <path d="M16 19l3-3-3-3" />
        <path d="M19 16h-6" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Reply without leaving Slack",
    description:
      "Claim a ticket, type your reply in a Slack modal, hit send — the customer gets a real email back. Zero context switching, zero open tabs.",
    // Tabler: IconMessageReply
    icon: (
      <svg
        width="52"
        height="52"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6l-3 3V7a3 3 0 0 1 3-3h12z" />
        <path d="M11 8l-3 3 3 3" />
        <path d="M8 11h8" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Live chat, handled from Slack",
    description:
      "Drop a widget on your website. When a visitor types a message, it lands in Slack as a conversation. Your team replies from Slack, the visitor sees it instantly.",
    // Tabler: IconMessageChatbot
    icon: (
      <svg
        width="52"
        height="52"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6l-3 3V7a3 3 0 0 1 3-3h12z" />
        <path d="M9.5 9h.01" />
        <path d="M14.5 9h.01" />
        <path d="M9.5 13a3.5 3.5 0 0 0 5 0" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Every ticket claimed. Nothing dropped.",
    description:
      "Emails hit Slack in 2–5 seconds. Anyone on the team claims it with one click — the rest of the team sees it's handled. No duplicates, no silence, no lost threads.",
    // Tabler: IconCircleCheck
    icon: (
      <svg
        width="52"
        height="52"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Multiple domains, one workspace",
    description:
      "Running two products? An agency with several clients? Add multiple domains and manage all their support channels from a single Slack workspace.",
    // Tabler: IconWorldWww
    icon: (
      <svg
        width="52"
        height="52"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3.6 9h16.8" />
        <path d="M3.6 15h16.8" />
        <path d="M11.5 3a17 17 0 0 0 0 18" />
        <path d="M12.5 3a17 17 0 0 1 0 18" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Reports that show what's actually happening",
    description:
      "See response times, ticket volume, and team activity at a glance. Know which alias is getting hammered, who's handling the most tickets, and where things are slowing down.",
    // Tabler: IconChartBar
    icon: (
      <svg
        width="52"
        height="52"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
] as const;

// ─── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: EASE_OUT_QUAD,
      }}
      className="relative flex flex-col rounded-2xl bg-neutral-50 border border-neutral-100 p-7 overflow-hidden"
    >
      {/* Number badge — top left */}
      <div className="mb-6 flex items-start justify-between">
        <span className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-2.5 py-1 font-schibsted text-xs font-semibold text-white tabular-nums">
          {feature.number}
        </span>

        {/* Icon — top right, animates on card entry */}
        <motion.div
          initial={{ opacity: 0, rotate: -12, scale: 0.85 }}
          whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.55,
            delay: index * 0.07 + 0.15,
            ease: EASE_OUT_QUINT,
          }}
          className="text-neutral-200"
        >
          {/* Sky tint on the stroke via a wrapper that transitions color */}
          <motion.div
            initial={{ color: "#bae6fd" /* sky-200 */ }}
            whileInView={{ color: "#e5e5e5" /* neutral-200 */ }}
            viewport={{ once: true }}
            transition={{
              duration: 0.9,
              delay: index * 0.07 + 0.2,
              ease: EASE_OUT_QUINT,
            }}
          >
            {feature.icon}
          </motion.div>
        </motion.div>
      </div>

      {/* Text */}
      <h3 className="font-schibsted text-base font-semibold text-neutral-900 mb-2 leading-snug">
        {feature.title}
      </h3>
      <p className="font-schibsted text-sm text-neutral-500 leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function KeyFeaturesSection() {
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
            Everything your team needs.{" "}
            <span className="text-sky-800">Nothing they don't.</span>
          </Heading>
          <Paragraph variant="home-par" className="">
            Built around one idea — your team is already in Slack. Support should be there too.
          </Paragraph>
        </motion.div>

        {/* 3-col grid — last row is 2 wide cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.number} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}