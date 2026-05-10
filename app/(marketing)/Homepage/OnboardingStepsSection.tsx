"use client";

import React from "react";
import { motion } from "motion/react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import Link from "next/link";
import CTAWrapper from "@/components/CTAWrapper";
import { IconArrowUp } from "@tabler/icons-react";

const steps = [
  {
    id: "01",
    label: "STEP 01",
    title: "Add your domain",
    description:
      "Enter your domain on the Domains page. You'll instantly get the MX records to add to your DNS provider — Cloudflare, GoDaddy, Namecheap, anywhere. Propagation usually takes 10–30 minutes.",
    docsHref: "/docs/domains",
  },
  {
    id: "02",
    label: "STEP 02",
    title: "Connect Slack & create channels",
    description:
      "Authorize Slack via OAuth in one click. Then create dedicated channels for each support topic — #support, #billing, #sales — directly from your dashboard.",
    docsHref: "/docs/integrations/slack",
  },
  {
    id: "03",
    label: "STEP 03",
    title: "Map email aliases to channels",
    description:
      "Create aliases for your domain and link each one to a Slack channel — support@yourdomain.com → #support, billing@yourdomain.com → #billing. Every inbound email lands in the right channel instantly.",
    docsHref: "/docs/aliases",
  },
  {
    id: "04",
    label: "STEP 04",
    title: "Add the live chat widget",
    description:
      "Copy the one-line snippet from your dashboard and paste it into your site's <head>. The widget goes live instantly — no npm, no build step. Your customers see it in seconds.",
    docsHref: "/docs/chatbot",
  },
];

function ViewDocsCTA({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between border-t border-neutral-200 px-5 md:px-8 py-4 hover:bg-neutral-50 transition-colors duration-150"
    >
      <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-900 transition-colors duration-150">
        Docs
      </span>
      <div className="relative flex items-center justify-center w-5 h-5">
        <span className="absolute inset-0 rounded-full bg-neutral-900/0 group-hover:bg-neutral-900/5 transition-all duration-150 ease-out" />
        <IconArrowUp
          size={14}
          stroke={2}
          className="relative text-neutral-400 group-hover:text-neutral-900 rotate-90 group-hover:rotate-45 transition-transform duration-100 ease-out"
        />
      </div>
    </Link>
  );
}

export function OnboardingStepsSection() {
  return (
    <div
      className={[
        "relative grid w-full",
        "grid-cols-[1fr_0.75rem_auto_0.75rem_1fr] md:grid-cols-[1fr_2.5rem_auto_2.5rem_1fr]",
        "grid-rows-[1fr_1px_auto_1px_1fr]",
        "bg-white",
        "[--pattern-fg:theme(colors.gray.950/5%)]",
      ].join(" ")}
    >
      {/* ── Left hatched column ─────────────────────────────────────────── */}
      <div
        className={[
          "col-start-2 row-span-full row-start-1",
          "relative -right-px",
          "border-x border-x-(--pattern-fg)",
          "bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)]",
          "bg-[size:10px_10px] bg-fixed",
        ].join(" ")}
      />

      {/* ── Right hatched column ────────────────────────────────────────── */}
      <div
        className={[
          "col-start-4 row-span-full row-start-1",
          "relative -left-px",
          "border-x border-x-(--pattern-fg)",
          "bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)]",
          "bg-[size:10px_10px] bg-fixed",
        ].join(" ")}
      />

      {/* ── Top 1px rule ────────────────────────────────────────────────── */}
      <div className="relative -bottom-px col-span-full col-start-1 row-start-2 h-px bg-(--pattern-fg)" />

      {/* ── Bottom 1px rule ─────────────────────────────────────────────── */}
      <div className="relative -top-px col-span-full col-start-1 row-start-4 h-px bg-(--pattern-fg)" />

      {/* ── Content card (col 3, row 3) ─────────────────────────────────── */}
      <section className="col-start-3 row-start-3 w-full py-8 md:py-20 lg:py-1">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-0">
          {/* Eyebrow */}
          <p className="font-schibsted text-sm md:text-xs font-semibold uppercase tracking-widest text-sky-800 p-4 text-left">
            How it works
          </p>

          {/* Heading block */}
          <motion.div
            className="mb-2 px-4"
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
              className="text-neutral-900 leading-tight font-semibold"
            >
              <span>Setup in minutes. </span>
              <span className="text-sky-800 font-extralight">
                No complex tools, routing rules, or training required
              </span>
            </Heading>
          </motion.div>

          {/* ── Grid ────────────────────────────────────────────────────── */}
          {/*
            Row 1: [step 01] [step 02] [step 03]
            Row 2: [step 04] [    punchline CTA box    ]
          */}
          <div className="grid grid-cols-1 md:grid-cols-3 border border-neutral-200">
            {/* ── Row 1: Steps 01 02 03 ─────────────────────────────────── */}
            {steps.slice(0, 3).map((step, index) => (
              <motion.div
                key={step.id}
                // initial={{ opacity: 0, y: 24 }}
                // whileInView={{ opacity: 1, y: 0 }}
                // viewport={{ once: true }}
                // transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.1 }}
                className={[
                  "flex flex-col bg-white",
                  "border-b border-neutral-200",
                  index < 2 ? "md:border-r border-neutral-200" : "",
                ].join(" ")}
              >
                <div className="flex flex-col gap-5 p-5 md:p-8 flex-1">
                  <span className="font-mono text-xs font-normal tracking-widest text-sky-900 uppercase">
                    {step.label}
                  </span>
                  <Heading
                    as="h3"
                    variant="muted"
                    className="text-sky-800 leading-snug"
                  >
                    {step.title}
                  </Heading>
                  <Paragraph variant="home-par" className="flex-1">
                    {step.description}
                  </Paragraph>
                </div>
                <ViewDocsCTA href={step.docsHref} />
              </motion.div>
            ))}

            {/* ── Row 2 col 1: Step 04 ──────────────────────────────────── */}
            <motion.div
              // initial={{ opacity: 0, y: 24 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
              className="flex flex-col bg-white border-b md:border-b-0 md:border-r border-neutral-200"
            >
              <div className="flex flex-col gap-5 p-5 md:p-8 flex-1">
                <span className="font-mono text-xs font-normal tracking-widest text-sky-900 uppercase">
                  {steps[3].label}
                </span>
                <Heading
                  as="h3"
                  variant="muted"
                  className="text-sky-800 leading-snug"
                >
                  {steps[3].title}
                </Heading>
                <Paragraph variant="home-par" className="flex-1">
                  {steps[3].description}
                </Paragraph>
              </div>
              <ViewDocsCTA href={steps[3].docsHref} />
            </motion.div>

            {/* ── Row 2 cols 2–3: Punchline CTA box ────────────────────── */}
            <motion.div
              // initial={{ opacity: 0, y: 24 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
              className="col-span-1 md:col-span-2 relative overflow-hidden flex flex-col justify-end bg-gradient-to-b from-[#A8D3FF] to-[#FFF4DF]"
            >
              {/* Grain filter */}
              <svg className="absolute w-0 h-0" aria-hidden="true">
                <filter id="onboardingGrain">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.65"
                    numOctaves="3"
                    stitchTiles="stitch"
                  />
                  <feColorMatrix type="saturate" values="0" />
                </filter>
              </svg>
              {/* Grain overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "#8C8C8C",
                  filter: "url(#onboardingGrain)",
                  opacity: 0.9,
                }}
              />

              {/* White content card */}
              <div className="relative z-10 m-4">
                <div className="bg-white border border-neutral-200 p-7 flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <Heading
                      as="h3"
                      className="text-neutral-900 leading-[1.01] font-semibold"
                    >
                      You're live. Your whole team replies from Slack — without
                      ever touching an inbox.
                    </Heading>
                    <Paragraph variant="home-par">
                      From domain to live support in under 10 minutes. No
                      training required, no new tools to learn — just faster,
                      calmer customer support from day one.
                    </Paragraph>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Primary — black button with arrow */}
                    <CTAWrapper
                      loggedInHref="/dashboard"
                      loggedOutHref="/sign-up"
                      loggedInText="Dashboard"
                      loggedOutText="Get Started Free"
                    >
                      {({ text }) => (
                        <div className="bg-gradient-to-b from-white/90 to-transparent p-[4px] rounded-[16px] inline-flex">
                          <button className="group p-[4px] rounded-[12px] bg-gradient-to-b from-sky-900 to-cyan-700 shadow-[0_1px_2px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]">
                            <div className="bg-gradient-to-b from-white/[0.08] to-transparent rounded-[8px] px-4 py-2">
                              <div className="flex items-center gap-2">
                                <span className="font-schibsted font-semibold tracking-wide uppercase text-white text-sm">
                                  {text}
                                </span>
                                <div className="relative flex items-center justify-center w-5 h-5">
                                  <span className="absolute inset-0 rounded-full bg-white/0 backdrop-blur-0 group-hover:bg-white/20 group-hover:backdrop-blur-sm transition-all duration-150 ease-out" />
                                  <IconArrowUp
                                    size={13}
                                    stroke={2.5}
                                    className="relative text-white rotate-90 transition-transform duration-100 ease-out group-hover:rotate-45"
                                  />
                                </div>
                              </div>
                            </div>
                          </button>
                        </div>
                      )}
                    </CTAWrapper>

                    {/* Secondary — white button */}
                    <div className="rounded-[16px] inline-flex">
                      <Link href="/docs" className="block">
                        <button className="group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]">
                          <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-4 py-[6px]">
                            <span className="font-schibsted font-semibold tracking-wide uppercase text-neutral-900 text-sm">
                              Read the Docs
                            </span>
                          </div>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
