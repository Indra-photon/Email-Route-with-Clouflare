"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";

export default function BillingSuccessPage() {
  const [status, setStatus] = useState<"loading" | "active" | "timeout">("loading");
  const [planName, setPlanName] = useState("");
  const router = useRouter();

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;

    const poll = async () => {
      attempts++;
      const res = await fetch("/api/billing/subscription", { cache: "no-store" });
      const data = await res.json();

      if (data.status === "active") {
        setPlanName(data.planId.charAt(0).toUpperCase() + data.planId.slice(1));
        setStatus("active");
        return;
      }

      if (attempts >= maxAttempts) {
        setStatus("timeout");
        return;
      }

      setTimeout(poll, 2000);
    };

    poll();
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-2 border-sky-800 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h1 className="font-schibsted text-xl font-semibold text-neutral-900 mb-2">
              Confirming your subscription…
            </h1>
            <p className="font-schibsted text-sm text-neutral-500">This takes just a moment.</p>
          </>
        )}

        {status === "active" && (
          <>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
            <h1 className="font-schibsted text-2xl font-semibold text-neutral-900 mb-2">
              You&apos;re on {planName} now.
            </h1>
            <p className="font-schibsted text-sm text-neutral-500 mb-8">
              Your plan is active and ready to use.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 text-white font-schibsted text-sm font-semibold px-6 py-3 hover:bg-neutral-700 transition-colors"
            >
              Go to Dashboard →
            </Link>
          </>
        )}

        {status === "timeout" && (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="font-schibsted text-xl font-semibold text-neutral-900 mb-2">
              Payment received.
            </h1>
            <p className="font-schibsted text-sm text-neutral-500 mb-6">
              It may take a minute to activate. Check your billing page to confirm.
            </p>
            <Link
              href="/dashboard/billing"
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 text-white font-schibsted text-sm font-semibold px-6 py-3 hover:bg-neutral-700 transition-colors"
            >
              View Billing →
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
