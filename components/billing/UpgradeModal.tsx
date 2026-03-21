"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const EASE_OUT_QUINT: [number, number, number, number] = [0.23, 1, 0.32, 1];

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlanId: "starter" | "growth" | "scale";
  triggerReason?: "manual" | "domain_limit" | "alias_limit" | "ticket_limit" | "widget_limit";
}

const PLAN_DETAILS: Record<
  string,
  { name: string; price: number; color: string; features: string[] }
> = {
  starter: {
    name: "Starter",
    price: 19,
    color: "bg-neutral-800",
    features: ["1 domain", "3 aliases/domain", "200 tickets/month", "1 chat widget", "15-day retention"],
  },
  growth: {
    name: "Growth",
    price: 59,
    color: "bg-sky-800",
    features: ["3 domains", "5 aliases/domain", "600 tickets/month", "3 chat widgets", "90-day retention"],
  },
  scale: {
    name: "Scale",
    price: 159,
    color: "bg-indigo-800",
    features: ["Unlimited domains", "Unlimited aliases", "Unlimited tickets", "Unlimited widgets", "Forever retention"],
  },
};

const REASON_MESSAGES: Record<string, string> = {
  domain_limit: "You've hit your domain limit.",
  alias_limit: "You've hit your alias limit for this domain.",
  ticket_limit: "You've hit your monthly ticket limit.",
  widget_limit: "You've hit your chat widget limit.",
  manual: "",
};

export function UpgradeModal({ isOpen, onClose, targetPlanId, triggerReason = "manual" }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = PLAN_DETAILS[targetPlanId];
  const reason = REASON_MESSAGES[triggerReason];

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: targetPlanId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.28, ease: EASE_OUT_QUINT }}
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className={`${plan.color} px-6 py-5`}>
                <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
                  Upgrade to
                </p>
                <h2 className="font-schibsted text-2xl font-semibold text-white">
                  {plan.name} Plan
                </h2>
                <p className="font-schibsted text-4xl font-semibold text-white mt-2">
                  ${plan.price}
                  <span className="text-base font-normal text-white/70">/month</span>
                </p>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                {reason && (
                  <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="font-schibsted text-sm text-amber-700">{reason}</p>
                  </div>
                )}

                <ul className="space-y-2 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 font-schibsted text-sm text-neutral-700">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-sky-600 shrink-0">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {error && (
                  <p className="font-schibsted text-sm text-red-600 mb-3">{error}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="flex-1 rounded-xl bg-neutral-900 text-white font-schibsted text-sm font-semibold py-3 hover:bg-neutral-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Redirecting…" : "Subscribe now"}
                  </button>
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 rounded-xl border border-neutral-200 text-neutral-600 font-schibsted text-sm font-semibold py-3 hover:bg-neutral-50 transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
