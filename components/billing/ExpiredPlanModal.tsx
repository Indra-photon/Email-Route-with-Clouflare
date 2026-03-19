"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { UpgradeModal } from "./UpgradeModal";

const EASE_OUT_QUINT: [number, number, number, number] = [0.23, 1, 0.32, 1];

interface ExpiredPlanModalProps {
  isOpen: boolean;
  /** Optional override message (for limit errors) */
  message?: string;
  /** Optional close handler. If omitted, modal is non-dismissable (pure expiry mode). */
  onClose?: () => void;
}

const PLANS = [
  { id: "starter" as const, name: "Starter", price: 19 },
  { id: "growth" as const, name: "Growth", price: 59 },
  { id: "scale" as const, name: "Scale", price: 159, isContact: true },
];

export function ExpiredPlanModal({ isOpen, message, onClose }: ExpiredPlanModalProps) {
  const [upgradeTarget, setUpgradeTarget] = useState<"starter" | "growth" | "scale" | null>(null);

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.28, ease: EASE_OUT_QUINT }}
            >
              <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Icon */}
                <div className="flex justify-center pt-7 pb-3">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </div>

                <div className="px-6 pb-6 text-center">
                    <h2 className="font-schibsted text-xl font-semibold text-neutral-900 mb-2">
                      {message ? "Action blocked" : "Your plan has expired"}
                    </h2>
                    <p className="font-schibsted text-sm text-neutral-500 mb-5">
                      {message ?? "You can still view your existing tickets and conversations. To send replies, add domains, or create aliases — purchase a plan to continue."}
                    </p>

                  {/* Plan options */}
                  <div className="flex flex-col gap-2 mb-4">
                    {PLANS.map((p) => (
                      p.isContact ? (
                        <a
                          key={p.id}
                          href="/contact"
                          className="w-full rounded-xl border border-neutral-200 text-neutral-700 font-schibsted text-sm font-semibold py-2.5 hover:bg-neutral-50 transition-colors"
                        >
                          Scale — $159/mo · Book a demo
                        </a>
                      ) : (
                        <button
                          key={p.id}
                          onClick={() => setUpgradeTarget(p.id)}
                          className="w-full rounded-xl bg-neutral-900 text-white font-schibsted text-sm font-semibold py-2.5 hover:bg-neutral-700 transition-colors"
                        >
                          {p.name} — ${p.price}/mo
                        </button>
                      )
                    ))}
                  </div>

                  <p className="font-schibsted text-xs text-neutral-400">
                    You cannot dismiss this until a plan is active.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Opens UpgradeModal flow after picking a plan */}
      <UpgradeModal
        isOpen={upgradeTarget !== null}
        onClose={() => setUpgradeTarget(null)}
        targetPlanId={upgradeTarget ?? "starter"}
        triggerReason="manual"
      />
    </>
  );
}
