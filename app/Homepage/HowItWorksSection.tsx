"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { EmailToSlackIllustration } from "./EmailToSlackIllustration";
import { ChatToSlackIllustration } from "./ChatToSlackIllustration";
import { AnalyticsKanbanIllustration } from "./AnalyticsKanbanIllustration";

// ─── Step illustrations ────────────────────────────────────────────────────────

const ConnectIllustration = () => (
  <div className="w-full h-full flex items-center justify-center p-8">
    <div className="w-full max-w-xs space-y-3">
      {[
        { label: "support@company.com", color: "bg-sky-500", delay: 0 },
        { label: "billing@company.com", color: "bg-cyan-500", delay: 0.1 },
        { label: "sales@company.com", color: "bg-teal-500", delay: 0.2 },
      ].map((item, i) => (
        <motion.div
          key={item.label}
          className="flex items-center gap-3 bg-white border border-neutral-200 rounded-xl px-4 py-3 shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: item.delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
          <span className="text-xs font-schibsted font-medium text-neutral-700">{item.label}</span>
          <motion.div
            className="ml-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: item.delay + 0.3, duration: 0.3, type: "spring", stiffness: 300 }}
          >
            <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* Arrow down */}
      <div className="flex justify-center py-1">
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </motion.div>
      </div>

      {/* Slack badge */}
      <motion.div
        className="flex items-center gap-2 bg-[#4a154b] rounded-xl px-4 py-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" className="text-white shrink-0" fill="currentColor">
          <path d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-5zM9 6a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5zm9 2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5zm-2 9a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5z" />
        </svg>
        <span className="text-xs font-schibsted font-semibold text-white">Connected to Slack workspace</span>
      </motion.div>
    </div>
  </div>
);

const RouteIllustration = () => (
  <div className="w-full h-full flex items-center justify-center p-8">
    <EmailToSlackIllustration />
  </div>
);

const ClaimIllustration = () => (
  <div className="w-full h-full flex items-center justify-center p-8">
    <ChatToSlackIllustration />
  </div>
);

const AnalyzeIllustration = () => (
  <div className="w-full h-full flex items-center justify-center p-6">
    <AnalyticsKanbanIllustration />
  </div>
);

// ─── Steps data ─────────────────────────────────────────────────────────────

const steps = [
  {
    id: 1,
    number: "01",
    title: "Connect every support channel",
    body: "Point your support@, billing@, and sales@ email addresses to us — or embed a live chat widget on your website in minutes. One platform captures every conversation, zero missed messages.",
    Illustration: ConnectIllustration,
    accent: "text-sky-600",
    iconPath: "M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244",
  },
  {
    id: 2,
    number: "02",
    title: "Route to the right channel",
    body: "Every email and chat lands in a dedicated Slack channel automatically. Billing goes to #billing. Support goes to #support. Your team always knows exactly where to look and who owns what.",
    Illustration: RouteIllustration,
    accent: "text-cyan-600",
    iconPath: "M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5",
  },
  {
    id: 3,
    number: "03",
    title: "Claim, reply, resolve in Slack",
    body: "One click to claim a ticket. One message to reply — the customer gets a real email or chat response back instantly. No context switching, no separate tools, no dropped threads.",
    Illustration: ClaimIllustration,
    accent: "text-teal-600",
    iconPath: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
  {
    id: 4,
    number: "04",
    title: "Turn complaints into product intelligence",
    body: "See patterns across every support conversation. Which features break most? Where do users get lost? Your support queue already knows what to build next — we surface it automatically.",
    Illustration: AnalyzeIllustration,
    accent: "text-sky-700",
    iconPath: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
  },
];

// ─── Step Card ───────────────────────────────────────────────────────────────

interface StepCardProps {
  step: typeof steps[0];
  isActive: boolean;
  onClick: () => void;
  isLast: boolean;
}

const StepCard = ({ step, isActive, onClick, isLast }: StepCardProps) => {
  return (
    <motion.div
      layout
      layoutId={`card-${step.id}`}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl border cursor-pointer
        transition-colors duration-200
        ${isActive
          ? "border-neutral-300 bg-white shadow-lg"
          : "border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-300"
        }
        ${isActive ? "flex-[3]" : "flex-[0.6]"}
      `}
      style={{ minHeight: isActive ? 480 : "auto" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Top label row — always visible */}
      <div className="p-6 pb-0">
        <div className="flex items-start gap-3">
          {/* Number */}
          <motion.span
            layout="position"
            className={`font-schibsted text-4xl font-light tracking-tight ${isActive ? "text-neutral-200" : "text-neutral-300"}`}
          >
            {step.number}
          </motion.span>

          {/* Icon + title stacked vertically when collapsed, inline when active */}
          <div className="flex-1 pt-1">
            <motion.div layout="position" className={`w-6 h-6 mb-2 ${step.accent}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={step.iconPath} />
              </svg>
            </motion.div>

            <motion.h3
              layout="position"
              className={`font-schibsted font-semibold leading-snug ${
                isActive ? "text-base text-neutral-900" : "text-sm text-neutral-500"
              }`}
            >
              {step.title}
            </motion.h3>
          </div>
        </div>
      </div>

      {/* Expanded content — only when active */}
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key={`content-${step.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            className="flex flex-col h-full"
          >
            {/* Body text */}
            <div className="px-6 pt-4">
              <p className="font-schibsted text-sm text-neutral-500 leading-relaxed">
                {step.body}
              </p>
            </div>

            {/* Illustration area */}
            <div className="flex-1 mt-4 min-h-[280px]">
              <step.Illustration />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed hint arrow */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6 pb-6 pt-3"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main Section ─────────────────────────────────────────────────────────────

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="w-full bg-white py-16 md:py-20 lg:py-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-0">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span className="font-schibsted text-xs font-medium text-neutral-600">How it works</span>
          </div>

          <Heading as="h2" className="text-neutral-900 mb-4 leading-tight font-semibold">
            From inbox chaos to Slack clarity.
          </Heading>
          <Paragraph className="text-neutral-500 max-w-xl">
            Four steps. Five minutes. Zero shared inbox drama.
          </Paragraph>
        </motion.div>

        {/* Desktop: Expanding cards row */}
        <div className="hidden lg:flex gap-3 items-stretch" style={{ minHeight: 520 }}>
          {steps.map((step, i) => (
            <StepCard
              key={step.id}
              step={step}
              isActive={activeStep === step.id}
              onClick={() => setActiveStep(step.id)}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>

        {/* Tablet + Mobile: Vertical accordion */}
        <div className="lg:hidden space-y-3">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              layout
              className={`rounded-2xl border overflow-hidden cursor-pointer transition-colors duration-200 ${
                activeStep === step.id
                  ? "border-neutral-300 bg-white shadow-md"
                  : "border-neutral-200 bg-neutral-50"
              }`}
              onClick={() => setActiveStep(step.id)}
            >
              {/* Header row */}
              <div className="flex items-center gap-4 p-5">
                <span className="font-schibsted text-2xl font-light text-neutral-300 shrink-0 w-10">
                  {step.number}
                </span>
                <div className={`w-5 h-5 shrink-0 ${step.accent}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={step.iconPath} />
                  </svg>
                </div>
                <h3 className="font-schibsted font-semibold text-sm text-neutral-900 flex-1">
                  {step.title}
                </h3>
                <motion.div
                  animate={{ rotate: activeStep === step.id ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </div>

              {/* Expanded */}
              <AnimatePresence mode="wait">
                {activeStep === step.id && (
                  <motion.div
                    key={`mobile-content-${step.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4">
                      <p className="font-schibsted text-sm text-neutral-500 leading-relaxed mb-6">
                        {step.body}
                      </p>
                      <div className="h-64 rounded-xl overflow-hidden border border-neutral-100">
                        <step.Illustration />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}