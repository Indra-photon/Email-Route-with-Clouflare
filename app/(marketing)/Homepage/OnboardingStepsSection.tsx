"use client";

import React from "react";
import { motion } from "motion/react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";

// ─── Steps ────────────────────────────────────────────────────────────────────

const steps = [
  {
    id: "01",
    label: "STEP 01",
    title: "Create a Slack webhook",
    description:
      "In Slack, go to Apps → Incoming Webhooks, add it to your workspace, select a channel, and copy the webhook URL. Takes about 2 minutes.",
  },
  {
    id: "02",
    label: "STEP 02",
    title: "Add the integration",
    description:
      "Paste your webhook URL into the Integrations page in your dashboard. Give it a name like 'Customer Support' — this links Slack to your routing rules.",
  },
  {
    id: "03",
    label: "STEP 03",
    title: "Add your domain",
    description:
      "Enter your domain in the Domains page. You'll instantly get the MX records you need to add to your DNS provider — Cloudflare, GoDaddy, Namecheap, anywhere.",
  },
  {
    id: "04",
    label: "STEP 04",
    title: "Configure DNS",
    description:
      "Add the two MX records to your DNS provider. Propagation usually takes 10–30 minutes. Once live, your domain is ready to receive and route emails.",
  },
  {
    id: "05",
    label: "STEP 05",
    title: "Create an alias and go live",
    description:
      "Map support@ to #support, billing@ to #billing, sales@ to #sales. Send a test email — it appears in Slack within 3 seconds. You're live.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function OnboardingStepsSection() {
  return (
    <section className="w-full bg-white py-16 md:py-20 lg:py-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-0">

        {/* ── Eyebrow ────────────────────────────────────────────────────────── */}
        <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-800 mb-4">
          How it works
        </p>

        {/* ── Heading block ──────────────────────────────────────────────────── */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: [.25, .46, .45, .94], delay: 0.2 }}
        >
          <Heading as="span" className="text-neutral-900 leading-tight font-semibold">
            Setup in minutes.{" "}
          </Heading>
          <Heading as="span" className="text-neutral-400 leading-tight font-semibold">
            Install in Slack. Connect your support flows. Delight your customers.
          </Heading>
        </motion.div>

        {/* ── Steps grid ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={[
                "flex flex-col gap-5 pt-10 pb-4",
                // vertical divider between columns on md+
                // bottom divider on mobile between stacked rows
                index < steps.length - 1
                  ? " md:pr-10"
                  : "",
                // left padding for columns 2 and 3
                index > 0 ? "" : "",
              ].join(" ")}
            >
              {/* Step label — monospace uppercase */}
              <span className="font-mono text-xs font-normal tracking-widest text-neutral-400 uppercase">
                {step.label}
              </span>

              {/* Title */}
              <Heading
                as="h3"
                variant="muted"
                className="text-neutral-900 font-semibold leading-snug"
              >
                {step.title}
              </Heading>

              {/* Description */}
              <Paragraph
                variant="home-par"
                className=""
              >
                {step.description}
              </Paragraph>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}