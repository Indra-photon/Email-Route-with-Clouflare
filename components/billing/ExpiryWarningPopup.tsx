"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { UpgradeModal } from "./UpgradeModal";

const DISMISS_KEY = "expiry_popup_dismissed_date";

interface ExpiryWarningPopupProps {
  daysUntilExpiry: number | null;
  planName: string;
  currentPlanId: "starter" | "growth" | "scale";
  currentPeriodEnd: string | null;
}

export function ExpiryWarningPopup({
  daysUntilExpiry,
  planName,
  currentPlanId,
  currentPeriodEnd,
}: ExpiryWarningPopupProps) {
  const [visible, setVisible] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState<"starter" | "growth" | "scale" | null>(null);

  useEffect(() => {
    if (daysUntilExpiry === null || daysUntilExpiry <= 0 || daysUntilExpiry > 5) return;

    // Check local dismiss key (reset each calendar day)
    const today = new Date().toDateString();
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed === today) return;

    setVisible(true);
  }, [daysUntilExpiry]);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, new Date().toDateString());
    setVisible(false);
  };

  const endDateStr = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "soon";

  const nextPlan: "starter" | "growth" | "scale" =
    currentPlanId === "starter" ? "growth" : currentPlanId === "growth" ? "scale" : "scale";

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed bottom-5 right-5 z-40 w-full max-w-sm"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="bg-white border border-amber-200 rounded-2xl shadow-xl overflow-hidden">
              {/* Amber top stripe */}
              <div className="h-1 w-full bg-amber-400" />

              <div className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-schibsted text-sm font-semibold text-neutral-900">
                      {planName} plan expires {daysUntilExpiry === 1 ? "tomorrow" : `in ${daysUntilExpiry} days`}
                    </p>
                    <p className="font-schibsted text-xs text-neutral-500 mt-0.5">
                      Renew before {endDateStr} — your new plan activates
                      the moment this one expires. No gap in service.
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setUpgradeTarget(currentPlanId)}
                    className="flex-1 rounded-lg bg-neutral-900 text-white font-schibsted text-xs font-semibold py-2 hover:bg-neutral-700 transition-colors"
                  >
                    Renew {planName}
                  </button>
                  {currentPlanId !== "scale" && (
                    <button
                      onClick={() => setUpgradeTarget(nextPlan)}
                      className="flex-1 rounded-lg border border-neutral-200 text-neutral-700 font-schibsted text-xs font-semibold py-2 hover:bg-neutral-50 transition-colors"
                    >
                      Upgrade
                    </button>
                  )}
                  <button
                    onClick={handleDismiss}
                    className="px-3 rounded-lg border border-neutral-200 text-neutral-400 font-schibsted text-xs hover:bg-neutral-50 transition-colors"
                    title="Remind me tomorrow"
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <UpgradeModal
        isOpen={upgradeTarget !== null}
        onClose={() => setUpgradeTarget(null)}
        targetPlanId={upgradeTarget ?? currentPlanId}
      />
    </>
  );
}
