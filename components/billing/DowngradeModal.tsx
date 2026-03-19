"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const EASE_OUT_QUINT: [number, number, number, number] = [0.23, 1, 0.32, 1];

interface DowngradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanName: string;
  targetPlanId: "starter" | "growth";
  targetPlanName: string;
  targetPlanPrice: number;
  currentPeriodEnd: string | null;
  /** Features the user will lose (shown as warnings) */
  lostFeatures?: string[];
}

export function DowngradeModal({
  isOpen,
  onClose,
  currentPlanName,
  targetPlanId,
  targetPlanName,
  targetPlanPrice,
  currentPeriodEnd,
  lostFeatures = [],
}: DowngradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const endDateStr = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "end of billing period";

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: targetPlanId, downgrade: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Downgrade failed");
      setConfirmed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} onClick={!confirmed ? onClose : undefined}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.28, ease: EASE_OUT_QUINT }}
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              {confirmed ? (
                // ── Success state ──────────────────────────────────────────
                <div className="px-6 py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-schibsted text-lg font-semibold text-neutral-900 mb-2">
                    Downgrade scheduled
                  </h3>
                  <p className="font-schibsted text-sm text-neutral-500 mb-6">
                    You'll keep {currentPlanName} until {endDateStr}. {targetPlanName} activates automatically after that — no action needed.
                  </p>
                  <button onClick={onClose} className="w-full rounded-xl bg-neutral-900 text-white font-schibsted text-sm font-semibold py-3">
                    Got it
                  </button>
                </div>
              ) : (
                // ── Confirm state ──────────────────────────────────────────
                <>
                  <div className="px-6 pt-6 pb-4 border-b border-neutral-100">
                    <h2 className="font-schibsted text-lg font-semibold text-neutral-900 mb-1">
                      Switch to {targetPlanName}?
                    </h2>
                    <p className="font-schibsted text-sm text-neutral-500">
                      Your {currentPlanName} plan stays active until{" "}
                      <strong>{endDateStr}</strong>. {targetPlanName} (${targetPlanPrice}/mo)
                      activates automatically when it ends — no gap, no extra steps.
                    </p>
                  </div>

                  {lostFeatures.length > 0 && (
                    <div className="px-6 py-4 bg-amber-50 border-b border-amber-100">
                      <p className="font-schibsted text-xs font-semibold uppercase tracking-wide text-amber-700 mb-2">
                        You'll lose access to
                      </p>
                      <ul className="space-y-1">
                        {lostFeatures.map((f) => (
                          <li key={f} className="flex items-center gap-2 font-schibsted text-sm text-amber-800">
                            <span className="text-amber-500">−</span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="px-6 py-5">
                    {error && <p className="font-schibsted text-sm text-red-600 mb-3">{error}</p>}
                    <div className="flex gap-3">
                      <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="flex-1 rounded-xl bg-neutral-900 text-white font-schibsted text-sm font-semibold py-3 hover:bg-neutral-700 transition-colors disabled:opacity-60"
                      >
                        {loading ? "Scheduling…" : `Confirm downgrade`}
                      </button>
                      <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 rounded-xl border border-neutral-200 text-neutral-600 font-schibsted text-sm font-semibold py-3 hover:bg-neutral-50 transition-colors"
                      >
                        Keep {currentPlanName}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
