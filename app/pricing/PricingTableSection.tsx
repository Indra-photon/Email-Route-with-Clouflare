"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { PRICING_PLANS, type PricingPlan, type PricingFeature } from "@/constants/pricing";

// ─── Easing curves (from globals.css tokens) ─────────────────────────────────

const EASE_OUT_QUINT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const EASE_OUT_QUAD: [number, number, number, number]  = [0.25, 0.46, 0.45, 0.94];

// ─── Tooltip data ─────────────────────────────────────────────────────────────

export interface TooltipContent {
  title: string;
  body: string;
  example: string;
}

const TOOLTIP_MAP: Record<string, TooltipContent> = {
  "Data retention": {
    title: "Data Retention",
    body: "How long we store your ticket history and email conversations in our system.",
    example:
      "On Starter, tickets older than 15 days are permanently deleted. On Scale, we keep everything forever — useful for audits or customer history lookups.",
  },
  "Ticket claiming": {
    title: "Ticket Claiming",
    body: "When an email arrives in Slack, any teammate can 'claim' it — this assigns the ticket to them so the rest of the team knows it's being handled.",
    example:
      "No more two people typing a reply to the same customer at the same time.",
  },
  "Canned responses": {
    title: "Canned Responses",
    body: "Pre-written reply templates your team can insert with one click when replying from Slack.",
    example:
      "e.g. 'Password Reset Instructions' or 'Refund Policy' — saves typing the same reply 20 times a day.",
  },
  "Chat widget (text only)": {
    title: "Text Only Widget",
    body: "Your chat widget supports text messages only. Customers cannot send images, screenshots, or files.",
    example:
      "Upgrade to Growth to allow customers to send attachments like screenshots or PDFs directly in the chat.",
  },
  "1 chat widget (text only)": {
    title: "Text Only Widget",
    body: "Your chat widget supports text messages only. Customers cannot send images, screenshots, or files.",
    example:
      "Upgrade to Growth to allow customers to send attachments like screenshots or PDFs directly in the chat.",
  },
  "Aliases per domain": {
    title: "Email Aliases",
    body: "Each alias is a separate email address on your domain. Every alias routes to its own dedicated Slack channel.",
    example:
      "e.g. support@yourdomain.com → #support-channel, billing@yourdomain.com → #billing-channel. Each one is independent.",
  },
};

// ─── Reusable TermTooltip component ──────────────────────────────────────────
// Usage anywhere: <TermTooltip content={TOOLTIP_MAP["Data retention"]} />
// Or pass content directly: <TermTooltip content={{ title, body, example }} />

interface TermTooltipProps {
  content: TooltipContent;
  /** "above" always shows above, "below" always below, "smart" = above on mobile, below on md+ */
  placement?: "above" | "below" | "smart";
}

export function TermTooltip({ content, placement = "smart" }: TermTooltipProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef  = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !tooltipRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Determine tooltip position classes
  // "smart": above on <md (mobile), below on md+
  const positionClasses =
    placement === "above"
      ? "bottom-full mb-2"
      : placement === "below"
      ? "top-full mt-2"
      : "bottom-full mb-2 md:bottom-auto md:top-full md:mb-0 md:mt-2";

  return (
    <span
    onMouseEnter={() => setOpen(true)}
    onMouseLeave={() => setOpen(false)}
    className="relative inline-flex items-center">
      <button
        ref={triggerRef}
        type="button"
        aria-label="More information"
        className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-neutral-300 text-neutral-400 hover:border-neutral-400 hover:text-neutral-500 transition-colors duration-150 ml-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:ring-offset-1 shrink-0"
      >
        <span className="font-schibsted text-[9px] font-semibold leading-none select-none">?</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={tooltipRef}
            role="tooltip"
            className={`
              absolute ${positionClasses}
              left-1/2 z-50 w-64
              bg-neutral-100 backdrop-blur-md
              border border-neutral-200
              rounded-xl
              p-4 text-left
            `}
            style={{ originX: "50%", originY: placement === "above" ? "100%" : "0%", x: "-50%" }}
            initial={{ opacity: 0, scale: 0.88, y: placement === "above" ? 6 : -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: placement === "above" ? 6 : -6 }}
            transition={{
              opacity: { duration: 0.18, ease: EASE_OUT_QUAD },
              scale:   { duration: 0.22, ease: EASE_OUT_QUINT },
              y:       { duration: 0.22, ease: EASE_OUT_QUINT },
            }}
          >
            {/* Title */}
            <p className="font-schibsted font-semibold text-xs text-neutral-900 mb-1">
              {content.title}
            </p>

            {/* Body — delayed fade-in for layered feel */}
            <motion.div
              initial={{ opacity: 0}}
              animate={{ opacity: 1}}
              transition={{duration: 0.2, ease: EASE_OUT_QUAD }}
              style={{ animationFillMode: "backwards" }}
            >
              <p className="font-schibsted text-xs text-neutral-600 leading-tight mb-2">
                {content.body}
              </p>
              <p className="font-schibsted text-[10px] text-neutral-500 leading-relaxed">
                {content.example.replace(/^e\.g\.\s*/i, "")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

// ─── Feature row ──────────────────────────────────────────────────────────────

function FeatureRow({ feature, isHighlight }: { feature: PricingFeature; isHighlight: boolean }) {
    // Find tooltip content by matching the start of the label
    const tooltipContent = Object.entries(TOOLTIP_MAP).find(([key]) =>
        feature.label.toLowerCase().includes(key.toLowerCase())
    )?.[1];

    return (
        <li className="flex items-start gap-2.5 py-1.5">
            {/* Check / Cross icon */}
            <span className="mt-0.5 shrink-0">
                {feature.included ? (
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={isHighlight ? "text-white" : "text-neutral-800"}
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                ) : (
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={isHighlight ? "text-sky-100" : "text-neutral-300"}
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                )}
            </span>

            {/* Label + optional badges + tooltip */}
            <span
                className={`font-schibsted text-sm leading-snug flex items-center flex-wrap gap-x-1.5 gap-y-1 ${
                    feature.included
                        ? isHighlight ? "text-white" : "text-neutral-800"
                        : isHighlight ? "text-red-100" : "text-neutral-400"
                }`}
            >
                {feature.label}

                {/* Coming Soon badge */}
                {feature.soon && (
                    <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-schibsted text-[9px] font-semibold uppercase tracking-wide text-amber-700">
                        Soon
                    </span>
                )}

                {/* Tooltip trigger — only if we have content for this feature */}
                {tooltipContent && <TermTooltip content={tooltipContent} />}
            </span>
        </li>
    );
}

// ─── Single pricing card ──────────────────────────────────────────────────────

function PricingCard({
  plan,
  index,
}: {
  plan: PricingPlan;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const isHighlight = plan.highlight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: EASE_OUT_QUAD,
      }}
      className="relative flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── "Most Popular" label — slides up out of top edge on hover ── */}
      {/* {isHighlight && (
        <div className="absolute -top-2 left-0 right-0 overflow-hidden pointer-events-none z-10"
          style={{ height: 32 }}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center h-8 bg-sky-600 rounded-t-2xl"
            initial={{ y: "100%" }}
            animate={{ y: hovered ? "0%" : "100%" }}
            transition={{ duration: 0.28, ease: EASE_OUT_QUINT }}
          >
            <span className="font-schibsted text-[11px] font-semibold text-white tracking-wide">
              Most Popular · 200+ teams
            </span>
          </motion.div>
        </div>
      )} */}

      {/* ── Card body ── */}
      <div
        className={`
          relative flex flex-col flex-1 rounded-2xl border
          ${isHighlight
            ? "bg-sky-800 -mt-4 pt-4"
            : "border-neutral-200 shadow-sm"
          }
        `}
      >
        {/* Top section */}
        <div className={`px-6 pt-6 pb-5 border-b ${isHighlight ? "" : "border-neutral-100"}`}>
          {/* Plan name */}
          <p className={`font-schibsted text-xs font-semibold uppercase tracking-widest ${isHighlight ? "text-white" : "text-neutral-500"} mb-3`}>
            {plan.name}
          </p>

          {/* Price */}
          <div className="flex items-end gap-1 mb-3">
            <span className={`font-schibsted text-5xl font-semibold ${isHighlight ? "text-white" : "text-neutral-800"} leading-none tabular-nums`}>
              ${plan.price}
            </span>
            <span className={`font-schibsted text-sm ${isHighlight ? "text-white" : "text-neutral-500"} mb-1`}>/mo</span>
          </div>

          {/* Description */}
          <p className={`font-schibsted text-sm ${isHighlight ? "text-white" : "text-neutral-500"} leading-relaxed`}>
            {plan.description}
          </p>
        </div>

        {/* Limits pills */}
        <div className={`px-6 py-4 flex flex-wrap gap-2 border-b ${isHighlight ? "border-sky-100" : "border-neutral-100"}`}>
          {[
            {
              label: `${plan.limits.domains === "unlimited" ? "∞" : plan.limits.domains} domain${plan.limits.domains === 1 ? "" : "s"}`,
            },
            {
              label: `${plan.limits.aliasesPerDomain === "unlimited" ? "∞" : plan.limits.aliasesPerDomain} aliases/domain`,
              tooltip: TOOLTIP_MAP["Aliases per domain"],
            },
            {
              label: `${typeof plan.limits.ticketsPerMonth === "number" ? plan.limits.ticketsPerMonth.toLocaleString() : "∞"} tickets/mo`,
            },
          ].map((pill) => (
            <span
              key={pill.label}
              className="inline-flex items-center gap-0.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-schibsted text-xs font-medium text-neutral-600"
            >
              {pill.label}
              {pill.tooltip && <TermTooltip content={pill.tooltip} placement="above" />}
            </span>
          ))}
        </div>

        {/* Features list */}
        <div className="px-6 py-5 flex-1">
          <ul className="space-y-0.5">
            {plan.features.map((feature) => (
              <FeatureRow key={feature.label} feature={feature} isHighlight={isHighlight} />
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          <a
            href={plan.ctaHref}
            className={`
              block w-full text-center rounded-xl px-4 py-3
              font-schibsted text-sm font-semibold
              transition-colors duration-150
              ${isHighlight
                ? "bg-white text-neutral-800"
                : "bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
              }
            `}
          >
            {plan.ctaLabel}
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function PricingTableSection() {
  return (
    <section className="w-full bg-white py-16 md:py-20 lg:py-28" id="pricing">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-0">

        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_OUT_QUAD }}
            className="mb-12"
        >
            <Heading as="h2" className="text-neutral-900 mb-4 leading-tight font-semibold">
            Simple, predictable{" "} <span className="text-sky-800">pricing {" "}</span> 
            </Heading>
            <Paragraph variant="home-par" className="">
            No extra cost for bigger teams. Pick a plan and bring your whole team.
            </Paragraph>
        </motion.div>

        {/* Cards grid — Growth card overflows top via -mt-4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-end">
          {PRICING_PLANS.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4, ease: EASE_OUT_QUAD }}
          className="text-center font-schibsted text-xs text-neutral-400 mt-8"
        >
          We do not charge suddenly if the ticket volume increases. If you hit your monthly limit, new tickets will queue up and you'll get an email notification — you can then choose to upgrade or wait for the next month when limits reset. 
        </motion.p>
      </div>
    </section>
  );
}