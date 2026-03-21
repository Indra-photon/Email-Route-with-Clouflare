"use client";

import { motion } from "motion/react";
import Link from "next/link";

export default function BillingCancelledPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </div>

        <h1 className="font-schibsted text-2xl font-semibold text-neutral-900 mb-2">
          You&apos;re back.
        </h1>
        <p className="font-schibsted text-sm text-neutral-500 mb-8">
          No charge was made. Your current plan hasn&apos;t changed.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/pricing"
            className="rounded-xl border border-neutral-200 text-neutral-700 font-schibsted text-sm font-semibold px-5 py-2.5 hover:bg-neutral-50 transition-colors"
          >
            Back to pricing
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl bg-neutral-900 text-white font-schibsted text-sm font-semibold px-5 py-2.5 hover:bg-neutral-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
