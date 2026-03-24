'use client';

import { AnimatePresence, motion } from "motion/react";
import React, { useState, useEffect } from "react";
import {
  IconMailOpened,
  IconProgressCheck,
  IconClockPause,
  IconCircleCheck,
  IconRefresh,
  IconArrowRight,
} from "@tabler/icons-react";

// ─── Easing ───────────────────────────────────────────────────────────────────

const EASING = {
  outCubic: [0.215, 0.61, 0.355, 1],
  outQuart: [0.165, 0.84, 0.44, 1],
  outQuint: [0.23, 1, 0.32, 1],
} as const;

// ─── Status config ────────────────────────────────────────────────────────────

type Status = "open" | "in_progress" | "waiting" | "resolved";

const STATUS_CONFIG: Record<Status, {
  label: string;
  icon: React.ReactNode;
  badgeBg: string;
  badgeText: string;
  badgeRing: string;
  dotColor: string;
  buttonLabel: string;
  buttonBg: string;
  buttonIcon: React.ReactNode;
}> = {
  open: {
    label: "Open",
    icon: <IconMailOpened size={13} stroke={2} />,
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-700",
    badgeRing: "ring-sky-200",
    dotColor: "bg-sky-500",
    buttonLabel: "Claim ticket",
    buttonBg: "bg-sky-700",
    buttonIcon: <IconArrowRight size={12} stroke={2.5} />,
  },
  in_progress: {
    label: "In Progress",
    icon: <IconProgressCheck size={13} stroke={2} />,
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    badgeRing: "ring-amber-200",
    dotColor: "bg-amber-500",
    buttonLabel: "Reply",
    buttonBg: "bg-amber-600",
    buttonIcon: <IconArrowRight size={12} stroke={2.5} />,
  },
  waiting: {
    label: "Waiting on Customer",
    icon: <IconClockPause size={13} stroke={2} />,
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
    badgeRing: "ring-violet-200",
    dotColor: "bg-violet-500",
    buttonLabel: "Mark Resolved",
    buttonBg: "bg-emerald-700",
    buttonIcon: <IconCircleCheck size={12} stroke={2.5} />,
  },
  resolved: {
    label: "Resolved",
    icon: <IconCircleCheck size={13} stroke={2} />,
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    badgeRing: "ring-emerald-200",
    dotColor: "bg-emerald-500",
    buttonLabel: "Reopen",
    buttonBg: "bg-neutral-500",
    buttonIcon: <IconRefresh size={12} stroke={2.5} />,
  },
};

const STATUS_SEQUENCE: Status[] = ["open", "in_progress", "waiting", "resolved"];

// ─── Slack icon ───────────────────────────────────────────────────────────────

const SlackIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-5zM9 6a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5zm9 2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5zm-2 9a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5z" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const TicketStatusIllustration: React.FC = () => {
  const [statusIndex, setStatusIndex] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(false);

  const currentStatus = STATUS_SEQUENCE[statusIndex];
  const config = STATUS_CONFIG[currentStatus];

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Hold on current status — let user read it
      await new Promise(r => setTimeout(r, 2200));
      if (cancelled) return;

      // Simulate button click — scale down
      setButtonClicked(true);
      await new Promise(r => setTimeout(r, 380));
      if (cancelled) return;
      setButtonClicked(false);

      // Brief pause before status updates
      await new Promise(r => setTimeout(r, 180));
      if (cancelled) return;

      // Advance to next status — only status row + button rerender
      setStatusIndex(prev => (prev + 1) % STATUS_SEQUENCE.length);
    };

    run();
    return () => { cancelled = true; };
  }, [statusIndex]);

  return (
    <div className="w-full flex items-center justify-center py-4">

      {/* Outer Slack card — static, never re-mounts */}
      <div className="bg-white rounded-xl shadow-lg ring-1 ring-neutral-200 overflow-hidden w-[340px]">

        {/* ── Slack channel header ────────────────────────────────────── */}
        <div className="bg-[#4a154b] px-4 py-2.5 flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded flex items-center justify-center text-[#4a154b]">
            <SlackIcon />
          </div>
          <span className="text-white/60 text-xs font-medium">#</span>
          <span className="text-xs font-semibold text-white">support</span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-white/40 text-[10px]">live</span>
          </div>
        </div>

        {/* ── Message body ────────────────────────────────────────────── */}
        <div className="p-4">
          <div className="flex items-start gap-3">

            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-700 shrink-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">SD</span>
            </div>

            <div className="flex-1 min-w-0">

              {/* Sender + timestamp */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-xs font-semibold text-neutral-900">SlackDesk</span>
                <span className="text-[10px] text-neutral-400">just now</span>
              </div>

              {/* Static message content — never changes */}
              <div className="space-y-1 text-[12px] text-neutral-700 font-schibsted leading-relaxed">
                <p>
                  📧 New email to{" "}
                  <span className="font-semibold text-neutral-900">support@company.com</span>
                </p>
                <p>
                  <span className="text-neutral-400">From:</span>{" "}
                  customer@email.com
                </p>
                <p>
                  <span className="text-neutral-400">Subject:</span>{" "}
                  Billing issue with last invoice
                </p>
              </div>

              {/* Snippet */}
              <p className="mt-2 text-[11px] text-neutral-900 font-schibsted leading-relaxed line-clamp-2 border-l-2 border-neutral-200 pl-2">
                Hi, I was charged twice for my subscription this month. Can you please look into this?
              </p>

              {/* ── Divider ──────────────────────────────────────────── */}
              <div className="mt-3 mb-3 border-t border-neutral-100 pb-10" />

              {/* ── Status row — ONLY this animates ──────────────────── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStatus + "-status"}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.22, ease: EASING.outCubic }}
                  className="flex items-center gap-2 mb-3"
                >
                  {/* Status badge */}
                  <span
                    className={`
                      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                      text-[11px] font-semibold ring-1
                      ${config.badgeBg} ${config.badgeText} ${config.badgeRing}
                    `}
                  >
                    Ticket status:
                    {config.icon}
                    {config.label}
                  </span>

                  {/* Dot separator */}
                  <span className="text-neutral-300 text-xs">·</span>

                </motion.div>
              </AnimatePresence>

              {/* ── Action button — ONLY this animates ───────────────── */}
              <div className="flex items-center gap-2.5">
                <AnimatePresence mode="wait">
                  <motion.button
                    key={currentStatus + "-btn"}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{
                      opacity: 1,
                      scale: buttonClicked ? 0.92 : 1,
                    }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.18, ease: EASING.outQuart }}
                    className={`
                      inline-flex items-center gap-1.5
                      px-3 py-1.5 rounded-md
                      text-[11px] font-semibold text-white
                      transition-all duration-150
                      ${config.buttonBg}
                      ${buttonClicked ? "brightness-90 scale-95" : ""}
                    `}
                  >
                    {config.buttonIcon}
                    {config.buttonLabel}
                  </motion.button>
                </AnimatePresence>

                <a className="text-[11px] text-sky-600 hover:text-sky-700 underline underline-offset-2 cursor-pointer transition-colors">
                  View thread
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};