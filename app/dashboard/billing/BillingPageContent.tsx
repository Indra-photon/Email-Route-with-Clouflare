"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { UsageBar } from "@/components/billing/UsageBar";
import { PlanLimitBanner } from "@/components/billing/PlanLimitBanner";
import { UpgradeModal } from "@/components/billing/UpgradeModal";
import { DowngradeModal } from "@/components/billing/DowngradeModal";
import { useState } from "react";
import { motion } from "motion/react";

import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";

const PLAN_ORDER = ["starter", "growth", "scale"] as const;
type PlanId = typeof PLAN_ORDER[number];

const PLAN_META: Record<PlanId, { name: string; price: number; color: string }> = {
  starter: { name: "Starter", price: 19, color: "bg-sky-700" },
  growth:  { name: "Growth",  price: 59,  color: "bg-sky-800" },
  scale:   { name: "Scale",   price: 159, color: "bg-sky-900" },
};

const STATUS_BADGES: Record<string, { label: string; dot: string }> = {
  active:    { label: "Active",    dot: "bg-green-500" },
  trialing:  { label: "Trialing",  dot: "bg-blue-400" },
  past_due:  { label: "Past Due",  dot: "bg-red-500" },
  cancelled: { label: "Cancelled", dot: "bg-neutral-400" },
  inactive:  { label: "Inactive",  dot: "bg-neutral-400" },
  no_plan:   { label: "No Plan",   dot: "bg-neutral-400" },
};

export default function BillingPageContent() {
  const { data, isLoading, error, refresh } = useSubscription();
  const [upgradeTarget, setUpgradeTarget] = useState<PlanId | null>(null);
  const [downgradeTarget, setDowngradeTarget] = useState<PlanId | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [resuming, setResuming] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-sky-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return <p className="font-schibsted text-sm text-red-500 p-6">Failed to load billing info.</p>;
  }

  const safePlanId = data.planId as PlanId | null;
  const currentMeta = safePlanId ? PLAN_META[safePlanId] : null;
  const badge = STATUS_BADGES[data.status] ?? STATUS_BADGES.inactive;

  const handleCancel = async () => {
    if (!confirm("Cancel subscription at the end of your billing period?")) return;
    setCancelling(true);
    const res = await fetch("/api/billing/cancel", { method: "POST" });
    const json = await res.json();
    if (res.ok) { alert(json.message); refresh(); }
    else alert(json.error ?? "Failed to cancel");
    setCancelling(false);
  };

  const handleResume = async () => {
    setResuming(true);
    const res = await fetch("/api/billing/resume", { method: "POST" });
    const json = await res.json();
    if (res.ok) { alert(json.message); refresh(); }
    else alert(json.error ?? "Failed to resume");
    setResuming(false);
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const json = await res.json();
    if (res.ok) window.open(json.portalUrl, "_blank");
    else alert(json.error ?? "Failed to open portal");
    setPortalLoading(false);
  };

  const endDateStr = data.currentPeriodEnd
    ? new Date(data.currentPeriodEnd).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      })
    : null;

  return (
    <div className="space-y-6">
      {/* Limit warning banner */}
      <PlanLimitBanner
        current={data.usage.ticketCountInbound}
        limit={data.usage.ticketLimit}
        planName={currentMeta?.name ?? "Free Tier"}
        onUpgradeClick={() => {
          const currentIndex = safePlanId ? PLAN_ORDER.indexOf(safePlanId) : -1;
          const next = PLAN_ORDER[currentIndex + 1] as PlanId | undefined;
          if (next || !data.planId) setUpgradeTarget(next ?? "starter");
        }}
      />

      {/* Current plan card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-neutral-200 overflow-hidden"
      >
        <div className={`${currentMeta?.color ?? "bg-gradient-to-t from-sky-900 to-cyan-600"} px-6 py-5 flex items-center justify-between shadow-sm`}>
          <div>
            <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
              Current Plan
            </p>
            <h2 className="font-schibsted text-xl font-semibold text-white">
              {currentMeta ? `${currentMeta.name} — $${currentMeta.price}/month` : "No Plan — $0/month"}
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${badge.dot}`} />
            <span className="font-schibsted text-sm font-medium text-white">{badge.label}</span>
          </div>
        </div>

        <div className="px-6 py-5 bg-white space-y-4">
          {endDateStr && (
            <div className="flex items-center justify-between text-sm font-schibsted">
              <span className="text-neutral-500">
                {data.cancelAtPeriodEnd ? "Cancels on" : "Next billing"}
              </span>
              <span className="font-medium text-neutral-800">{endDateStr}</span>
            </div>
          )}

          {data.pendingPlanId && (
            <div className="rounded-lg bg-purple-50 border border-purple-200 px-3 py-2">
              <p className="font-schibsted text-xs text-purple-700">
                Downgrade to <strong>{PLAN_META[data.pendingPlanId as PlanId]?.name}</strong> scheduled
                for {endDateStr ?? "period end"}
              </p>
            </div>
          )}

          {data.status === "past_due" && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
              <p className="font-schibsted text-xs text-red-700">
                Your last payment failed. Update your payment method to keep access.
              </p>
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="rounded-xl border border-sky-200 px-4 py-2 font-schibsted text-sm font-medium text-sky-700 hover:bg-sky-50 transition-colors disabled:opacity-60"
            >
              {portalLoading ? "Loading…" : "Manage payment methods"}
            </button>
            {data.cancelAtPeriodEnd || data.status === "cancelled" ? (
              <button
                onClick={handleResume}
                disabled={resuming}
                className="rounded-xl border border-neutral-200 px-4 py-2 font-schibsted text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-60"
              >
                {resuming ? "Resuming…" : "Resume subscription"}
              </button>
            ) : (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="rounded-xl border border-red-200 px-4 py-2 font-schibsted text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
              >
                {cancelling ? "Cancelling…" : "Cancel subscription"}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Usage bars */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="rounded-2xl border border-neutral-200 bg-neutral-100 px-6 py-5 shadow-sm"
      >
        <Heading variant="muted" className="text-base font-semibold text-sky-900 mb-4">
          Usage this period
          {data.currentPeriodStart && (
            <span className="font-normal text-neutral-400 text-sm ml-2">
              ({new Date(data.currentPeriodStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              {data.currentPeriodEnd && ` – ${new Date(data.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`})
            </span>
          )}
        </Heading>
        <div className="space-y-4">
          <UsageBar label="Inbound tickets"  current={data.usage.ticketCountInbound}  max={data.limits?.ticketsPerMonth ?? -1} />
          <UsageBar label="Outbound replies" current={data.usage.ticketCountOutbound} max={-1} />
          <UsageBar label="Domains"          current={0} max={data.limits?.domains ?? -1} />
          <UsageBar label="Aliases / domain" current={0} max={data.limits?.aliasesPerDomain ?? -1} />
          <UsageBar label="Chat widgets"     current={0} max={data.limits?.chatWidgets ?? -1} />
        </div>
      </motion.div>

      {/* Change plan */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16 }}
        className="rounded-2xl border border-neutral-200 bg-neutral-100 px-6 py-5 shadow-sm"
      >
        <Heading variant="muted" className="text-base font-semibold text-sky-900 mb-4">Change plan</Heading>
        <div className="grid grid-cols-3 gap-3">
          {PLAN_ORDER.map((pid) => {
            const meta = PLAN_META[pid];
            const isCurrent = pid === data.planId;
            const isScale = pid === "scale";
            const currentIndex = safePlanId ? PLAN_ORDER.indexOf(safePlanId) : -1;
            const isUpgrade = PLAN_ORDER.indexOf(pid) > currentIndex;
            const isDowngrade = currentIndex >= 0 && PLAN_ORDER.indexOf(pid) < currentIndex;

            return (
              <div key={pid} className={`rounded-xl border p-4 shadow-sm transition-all ${isCurrent ? "border-sky-300 bg-sky-50" : "border-neutral-200 bg-white"}`}>
                <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1">{meta.name}</p>
                <p className="font-schibsted text-xl font-semibold text-neutral-900 mb-3">${meta.price}<span className="text-xs font-normal text-neutral-400">/mo</span></p>
                {isCurrent ? (
                  <span className="inline-block w-full text-center rounded-lg py-1.5 font-schibsted text-xs font-semibold text-sky-700 bg-sky-200/50">
                    Current plan
                  </span>
                ) : isScale ? (
                  <a href="/contact" className="block w-full text-center rounded-lg py-1.5 font-schibsted text-xs font-semibold text-neutral-700 border border-neutral-200 hover:bg-neutral-50 transition-colors">
                    Book a demo
                  </a>
                ) : isUpgrade ? (
                  <button
                    onClick={() => setUpgradeTarget(pid)}
                    className="w-full rounded-lg py-1.5 font-schibsted text-xs font-semibold text-white bg-gradient-to-t from-sky-900 to-cyan-600 hover:opacity-90 transition-all shadow-sm"
                  >
                    Upgrade
                  </button>
                ) : (
                  <button
                    onClick={() => setDowngradeTarget(pid)}
                    className="w-full rounded-lg py-1.5 font-schibsted text-xs font-semibold text-sky-600 border border-sky-100 hover:bg-sky-50 transition-colors"
                  >
                    Downgrade
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Modals */}
      <UpgradeModal
        isOpen={upgradeTarget !== null}
        onClose={() => setUpgradeTarget(null)}
        targetPlanId={upgradeTarget ?? "growth"}
      />
      <DowngradeModal
        isOpen={downgradeTarget !== null}
        onClose={() => { setDowngradeTarget(null); refresh(); }}
        currentPlanName={currentMeta?.name ?? "No Plan"}
        targetPlanId={(downgradeTarget ?? "starter") as "starter" | "growth"}
        targetPlanName={downgradeTarget ? PLAN_META[downgradeTarget].name : ""}
        targetPlanPrice={downgradeTarget ? PLAN_META[downgradeTarget].price : 0}
        currentPeriodEnd={data.currentPeriodEnd}
      />
    </div>
  );
}
