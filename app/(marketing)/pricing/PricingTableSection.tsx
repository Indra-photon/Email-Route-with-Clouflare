"use client";

import React, { useState, useRef, useEffect } from "react";
// Note: useState kept for PricingCard's local state (checkoutLoading, downgradeOpen, etc.)
import { motion, AnimatePresence } from "motion/react";
import posthog from "posthog-js";
import { useUser } from "@clerk/nextjs";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { useSubscription } from "@/hooks/useSubscription";
import { DowngradeModal } from "@/components/billing/DowngradeModal";
import { IconArrowUp } from "@tabler/icons-react";

// ─── Types from DB (mirrors IPricingPlan but snake_case id) ───────────────────

interface DbPlanLimits {
  domains: number;
  aliasesPerDomain: number;
  chatWidgets: number;
  ticketsPerMonth: number;
  dataRetentionDays: number;
}

interface DbPricingFeature {
  label: string;
  included: boolean;
  soon?: boolean;
  note?: string;
}

interface DbPricingPlan {
  id: "starter" | "growth" | "scale";
  name: string;
  price: number;
  description: string;
  highlight: boolean;
  ctaLabel: string;
  limits: DbPlanLimits;
  features: DbPricingFeature[];
  sortOrder: number;
  isVisible: boolean;
}

// ─── Easing ───────────────────────────────────────────────────────────────────

const EASE_OUT_QUINT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const EASE_OUT_QUAD: [number, number, number, number]  = [0.25, 0.46, 0.45, 0.94];

// ─── Tooltip ─────────────────────────────────────────────────────────────────

export interface TooltipContent { title: string; body: string; example: string; }

const TOOLTIP_MAP: Record<string, TooltipContent> = {
  "Data retention": {
    title: "Data Retention",
    body: "How long we store your ticket history and email conversations in our system.",
    example: "On Starter, tickets older than 15 days are permanently deleted. On Scale, we keep everything forever.",
  },
  "Ticket claiming": {
    title: "Ticket Claiming",
    body: "When an email arrives in Slack, any teammate can 'claim' it — this assigns the ticket to them.",
    example: "No more two people typing a reply to the same customer at the same time.",
  },
  "Canned responses": {
    title: "Canned Responses",
    body: "Pre-written reply templates your team can insert with one click when replying from Slack.",
    example: "'Password Reset Instructions' — saves typing the same reply 20 times a day.",
  },
  "Chat widget (text only)": {
    title: "Text Only Widget",
    body: "Your chat widget supports text messages only. Customers cannot send images or files.",
    example: "Upgrade to Growth to allow customers to send attachments like screenshots or PDFs.",
  },
  "1 chat widget (text only)": {
    title: "Text Only Widget",
    body: "Your chat widget supports text messages only. Customers cannot send images or files.",
    example: "Upgrade to Growth to allow customers to send attachments.",
  },
  "Aliases per domain": {
    title: "Email Aliases",
    body: "Each alias is a separate email address on your domain routed to its own Slack channel.",
    example: "e.g. support@yourdomain.com → #support-channel, billing@yourdomain.com → #billing-channel.",
  },
};

export function TermTooltip({ content, placement = "smart" }: { content: TooltipContent; placement?: "above" | "below" | "smart" }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !tooltipRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const positionClasses = placement === "above" ? "bottom-full mb-2" : placement === "below" ? "top-full mt-2" : "bottom-full mb-2 md:bottom-auto md:top-full md:mb-0 md:mt-2";

  return (
    <span onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className="relative inline-flex items-center">
      <button ref={triggerRef} type="button" aria-label="More information" className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-neutral-300 text-neutral-400 hover:border-neutral-400 hover:text-neutral-500 transition-colors duration-150 ml-1 focus:outline-none shrink-0">
        <span className="font-schibsted text-[9px] font-semibold leading-none select-none">?</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div ref={tooltipRef} role="tooltip" className={`absolute ${positionClasses} left-1/2 z-50 w-64 bg-neutral-100 backdrop-blur-md border border-neutral-200 rounded-xl p-4 text-left`}
            style={{ originX: "50%", originY: placement === "above" ? "100%" : "0%", x: "-50%" }}
            initial={{ opacity: 0, scale: 0.88, y: placement === "above" ? 6 : -6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.88, y: placement === "above" ? 6 : -6 }}
            transition={{ opacity: { duration: 0.18, ease: EASE_OUT_QUAD }, scale: { duration: 0.22, ease: EASE_OUT_QUINT }, y: { duration: 0.22, ease: EASE_OUT_QUINT } }}
          >
            <p className="font-schibsted font-semibold text-xs text-neutral-900 mb-1">{content.title}</p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, ease: EASE_OUT_QUAD }}>
              <p className="font-schibsted text-xs text-neutral-600 leading-tight mb-2">{content.body}</p>
              <p className="font-schibsted text-[10px] text-neutral-500 leading-relaxed">{content.example.replace(/^e\.g\.\s*/i, "")}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

// ─── Helper: display limit value ──────────────────────────────────────────────

function displayLimit(val: number): string {
  return val === -1 ? "∞" : val.toLocaleString();
}

// ─── Feature row ──────────────────────────────────────────────────────────────

function FeatureRow({ feature, isHighlight }: { feature: DbPricingFeature; isHighlight: boolean }) {
  const tooltipContent = Object.entries(TOOLTIP_MAP).find(([key]) =>
    feature.label.toLowerCase().includes(key.toLowerCase())
  )?.[1];

  return (
    <li className="flex items-start gap-2.5 py-1.5">
      <span className="mt-0.5 shrink-0">
        {feature.included ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={isHighlight ? "text-white" : "text-neutral-800"}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isHighlight ? "text-sky-100" : "text-neutral-300"}>
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </span>
      <span className={`font-schibsted text-sm leading-snug flex items-center flex-wrap gap-x-1.5 gap-y-1 ${feature.included ? (isHighlight ? "text-white" : "text-neutral-800") : (isHighlight ? "text-red-100" : "text-neutral-400")}`}>
        {feature.label}
        {feature.soon && (
          <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-schibsted text-[9px] font-semibold uppercase tracking-wide text-amber-700">Soon</span>
        )}
        {tooltipContent && <TermTooltip content={tooltipContent} />}
      </span>
    </li>
  );
}

// ─── Plan order helpers ───────────────────────────────────────────────────────

const PLAN_ORDER = ["starter", "growth", "scale"] as const;
type PlanId = typeof PLAN_ORDER[number];

const PLAN_META: Record<PlanId, { name: string; price: number }> = {
  starter: { name: "Starter", price: 19 },
  growth:  { name: "Growth",  price: 59 },
  scale:   { name: "Scale",   price: 159 },
};

// ─── CTA logic ────────────────────────────────────────────────────────────────

type CtaAction = "not-logged-in" | "no-plan" | "current-plan" | "upgrade" | "downgrade" | "renew" | "contact";

function getCtaAction(planId: PlanId, currentPlanId: PlanId | null | undefined, isExpired: boolean, isLoggedIn: boolean): CtaAction {
  if (!isLoggedIn) return "not-logged-in";
  if (planId === "scale") return "contact";
  // New user: signed in but no plan purchased yet
  if (!currentPlanId && !isExpired) return "no-plan";
  // Expired: had a plan, now lapsed
  if (isExpired) return "renew";
  if (planId === currentPlanId) return "current-plan";
  // At this point currentPlanId is definitely a PlanId (not null/undefined)
  const activePlanId = currentPlanId as PlanId;
  const currentIdx = PLAN_ORDER.indexOf(activePlanId);
  const targetIdx  = PLAN_ORDER.indexOf(planId);
  return targetIdx > currentIdx ? "upgrade" : "downgrade";
}

// ─── Single pricing card ──────────────────────────────────────────────────────

function PricingCard({
  plan,
  index,
  currentPlanId,
  isExpired,
  isLoggedIn,
  currentPeriodEnd,
}: {
  plan: DbPricingPlan;
  index: number;
  currentPlanId: PlanId | null | undefined;
  isExpired: boolean;
  isLoggedIn: boolean;
  currentPeriodEnd: string | null;
}) {
  const [downgradeOpen, setDowngradeOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const isHighlight = plan.highlight;
  const action = getCtaAction(plan.id, currentPlanId, isExpired, isLoggedIn);

  const captureCtaClick = (label: string) => {
    posthog.capture("pricing_cta_clicked", {
      plan: plan.id,
      plan_price: plan.price,
      action: label,
    });
  };

  const handleDirectCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Something went wrong");
      setCheckoutLoading(false);
    }
  };

  const lostFeatures: string[] = [];
  if (action === "downgrade" && currentPlanId) {
    // Show a simple difference summary
    const currentMeta = PLAN_META[currentPlanId];
    lostFeatures.push(`Downgrade from ${currentMeta.name} ($${currentMeta.price}/mo) to ${plan.name} ($${plan.price}/mo)`);
  }

  function BlackBtn({ label, onClick, disabled }: { label: string; onClick?: () => void; disabled?: boolean }) {
    return (
      <div className="bg-gradient-to-b from-white/20 to-transparent rounded-[16px] w-full inline-flex">
        <button
          onClick={onClick}
          disabled={disabled}
          className="group w-full p-[4px] rounded-[12px] bg-gradient-to-b from-zinc-700 to-black shadow-[0_1px_2px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="bg-gradient-to-b from-white/[0.08] to-transparent rounded-[8px] px-4 py-2">
            <div className="flex items-center justify-center gap-2">
              <span className="font-schibsted font-semibold tracking-wide uppercase text-white text-sm">{label}</span>
              <div className="relative flex items-center justify-center w-5 h-5">
                <span className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/20 group-hover:backdrop-blur-sm transition-all duration-150 ease-out" />
                <IconArrowUp size={13} stroke={2.5} className="relative text-white rotate-90 transition-transform duration-100 ease-out group-hover:rotate-45" />
              </div>
            </div>
          </div>
        </button>
      </div>
    );
  }

  function WhiteBtn({ label, onClick, disabled, href }: { label: string; onClick?: () => void; disabled?: boolean; href?: string }) {
    const inner = (
      <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-4 py-[5px]">
        <div className="flex items-center justify-center gap-2">
          <span className="font-schibsted font-semibold tracking-wide uppercase text-neutral-900 text-sm">{label}</span>
          <div className="relative flex items-center justify-center w-5 h-5">
            <span className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/5 transition-all duration-150 ease-out rounded-full" />
            <IconArrowUp size={13} stroke={2.5} className="relative text-neutral-800 rotate-90 transition-transform duration-100 ease-out group-hover:rotate-45" />
          </div>
        </div>
      </div>
    );
    const btnClass = "group w-full p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.15)] active:shadow-[0_0px_1px_rgba(0,0,0,0.1)] active:scale-[0.995] disabled:opacity-60 disabled:cursor-not-allowed";
    if (href) return (
      <div className="rounded-[16px] w-full inline-flex">
        <a href={href} className="block w-full"><button className={btnClass}>{inner}</button></a>
      </div>
    );
    return (
      <div className="rounded-[16px] w-full inline-flex">
        <button onClick={onClick} disabled={disabled} className={btnClass}>{inner}</button>
      </div>
    );
  }

  function renderCta() {
    switch (action) {
      case "not-logged-in":
        return isHighlight
          ? <WhiteBtn label={plan.ctaLabel} href="/sign-up" onClick={() => captureCtaClick("sign_up")} />
          : <BlackBtn label={plan.ctaLabel} onClick={() => { captureCtaClick("sign_up"); window.location.href = "/sign-up"; }} />;

      case "no-plan":
        return (
          <>
            {isHighlight
              ? <WhiteBtn label={checkoutLoading ? "Redirecting…" : plan.ctaLabel} onClick={() => { captureCtaClick("checkout"); handleDirectCheckout(); }} disabled={checkoutLoading} />
              : <BlackBtn label={checkoutLoading ? "Redirecting…" : plan.ctaLabel} onClick={() => { captureCtaClick("checkout"); handleDirectCheckout(); }} disabled={checkoutLoading} />
            }
            {checkoutError && <p className="font-schibsted text-xs text-red-500 mt-2 text-center">{checkoutError}</p>}
          </>
        );

      case "current-plan":
        return (
          <span className={`block w-full text-center rounded-xl px-4 py-3 font-schibsted text-sm font-semibold cursor-default opacity-60 ${isHighlight ? "bg-white/30 text-white" : "bg-neutral-100 text-neutral-500 border border-neutral-200"}`}>
            Current plan
          </span>
        );

      case "upgrade":
      case "renew": {
        const label = checkoutLoading ? "Redirecting…" : action === "renew" ? `Renew — ${plan.name}` : `Upgrade to ${plan.name}`;
        return (
          <>
            {isHighlight
              ? <WhiteBtn label={label} onClick={() => { captureCtaClick(action); handleDirectCheckout(); }} disabled={checkoutLoading} />
              : <BlackBtn label={label} onClick={() => { captureCtaClick(action); handleDirectCheckout(); }} disabled={checkoutLoading} />
            }
            {checkoutError && <p className="font-schibsted text-xs text-red-500 mt-2 text-center">{checkoutError}</p>}
          </>
        );
      }

      case "downgrade":
        return (
          <>
            <BlackBtn label={`Downgrade to ${plan.name}`} onClick={() => { captureCtaClick("downgrade"); setDowngradeOpen(true); }} />
            <DowngradeModal
              isOpen={downgradeOpen}
              onClose={() => setDowngradeOpen(false)}
              currentPlanName={currentPlanId ? PLAN_META[currentPlanId].name : ""}
              targetPlanId={plan.id as "starter" | "growth"}
              targetPlanName={plan.name}
              targetPlanPrice={plan.price}
              currentPeriodEnd={currentPeriodEnd}
              lostFeatures={lostFeatures}
            />
          </>
        );

      case "contact":
        return isHighlight
          ? <WhiteBtn label="Book a demo" href="mailto:support@syncsupport.app" onClick={() => captureCtaClick("contact")} />
          : <BlackBtn label="Book a demo" onClick={() => { captureCtaClick("contact"); window.location.href = "mailto:support@syncsupport.app"; }} />;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: EASE_OUT_QUAD }}
      className="relative flex flex-col"
    >
      <div
        className={`relative flex flex-col flex-1 rounded-2xl ${isHighlight ? "bg-sky-800 -mt-4 pt-4" : ""}`}
        style={isHighlight ? undefined : { boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)" }}
      >
        {/* Top section */}
        <div className={`px-6 pt-6 pb-5 border-b ${isHighlight ? "" : "border-neutral-100"}`}>
          <p className={`font-schibsted text-xs font-semibold uppercase tracking-widest ${isHighlight ? "text-white" : "text-neutral-500"} mb-3`}>{plan.name}</p>
          <div className="flex items-end gap-1 mb-3">
            <span className={`font-schibsted text-5xl font-semibold ${isHighlight ? "text-white" : "text-neutral-800"} leading-none tabular-nums`}>${plan.price}</span>
            <span className={`font-schibsted text-sm ${isHighlight ? "text-white" : "text-neutral-500"} mb-1`}>/mo</span>
          </div>
          <p className={`font-schibsted text-sm ${isHighlight ? "text-white" : "text-neutral-500"} leading-relaxed`}>{plan.description}</p>
        </div>

        {/* Limits pills */}
        <div className={`px-6 py-4 flex flex-wrap gap-2 border-b ${isHighlight ? "border-sky-100" : "border-neutral-100"}`}>
          {[
            { label: `${displayLimit(plan.limits.domains)} domain${plan.limits.domains === 1 ? "" : "s"}` },
            { label: `${displayLimit(plan.limits.aliasesPerDomain)} aliases/domain`, tooltip: TOOLTIP_MAP["Aliases per domain"] },
            { label: `${displayLimit(plan.limits.ticketsPerMonth)} tickets/mo` },
          ].map((pill) => (
            <span key={pill.label} className="inline-flex items-center gap-0.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-schibsted text-xs font-medium text-neutral-600">
              {pill.label}
              {pill.tooltip && <TermTooltip content={pill.tooltip} placement="above" />}
            </span>
          ))}
        </div>

        {/* Features */}
        <div className="px-6 py-5 flex-1">
          <ul className="space-y-0.5">
            {plan.features.map((feature) => (
              <FeatureRow key={feature.label} feature={feature} isHighlight={isHighlight} />
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          {renderCta()}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function PricingTableSection({ plans }: { plans: DbPricingPlan[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { isSignedIn } = useUser();

  // Auth-aware subscription data (only fetched if signed in)
  const { data: subData } = useSubscription();

  const currentPlanId = isSignedIn ? (subData?.planId ?? null) : null;
  const isExpired     = isSignedIn ? (subData?.isExpired ?? false) : false;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          posthog.capture("pricing_section_viewed");
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white py-16 md:py-20 lg:py-28" id="pricing">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-0">

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE_OUT_QUAD }} className="mb-12">
          <Heading as="h2" className="text-neutral-900 mb-4 leading-tight font-semibold">
            Simple, <span className="text-sky-800 font-extralight">predictable, pricing</span>
          </Heading>
          <Paragraph variant="home-par">No extra cost for bigger teams. Pick a plan and bring your whole team.</Paragraph>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-end">
            {plans.map((plan, i) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                index={i}
                currentPlanId={currentPlanId}
                isExpired={isExpired}
                isLoggedIn={!!isSignedIn}
                currentPeriodEnd={subData?.currentPeriodEnd ?? null}
              />
            ))}
          </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.4, ease: EASE_OUT_QUAD }}
          className="mt-10 w-full rounded-2xl bg-neutral-50 px-8 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          style={{ boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)" }}
        >
          <div className="flex-1">
            <p className="font-schibsted text-xl font-semibold text-neutral-800 mb-1.5">
              No surprise charges.{" "}
              <span className="font-normal text-neutral-500">Ever.</span>
            </p>
            <p className="font-schibsted text-xs text-neutral-500 leading-relaxed">
              If you hit your monthly limit, new tickets <span className="text-neutral-700 font-medium">queue up</span> — we never charge you automatically. You'll get a notification and can choose to upgrade or wait for the next month when limits reset.{" "}
              <span className="text-neutral-400">Need custom volume pricing or have a question about plans?</span>
            </p>
          </div>
          <div className="shrink-0 bg-gradient-to-b from-white/20 to-transparent rounded-[16px] inline-flex">
            <a href="mailto:pricing@syncsupport.app" className="block">
              <button className="group p-[4px] rounded-[12px] bg-gradient-to-b from-zinc-700 to-black shadow-[0_1px_2px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]">
                <div className="bg-gradient-to-b from-white/[0.08] to-transparent rounded-[8px] px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="font-schibsted font-semibold tracking-wide uppercase text-white text-sm">Contact Us</span>
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <span className="absolute inset-0 rounded-full bg-white/0 backdrop-blur-0 group-hover:bg-white/20 group-hover:backdrop-blur-sm transition-all duration-150 ease-out" />
                      <IconArrowUp size={13} stroke={2.5} className="relative text-white rotate-90 transition-transform duration-100 ease-out group-hover:rotate-45" />
                    </div>
                  </div>
                </div>
              </button>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}