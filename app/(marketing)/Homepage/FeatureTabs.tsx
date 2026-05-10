"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EmailSlackIllustration } from "./EmailSlackIllustration";
import { WebsiteChatIllustration } from "./WebsiteChatIllustration";
import {
  IconMailForward,
  IconMessageChatbot,
  IconCircleCheck,
  IconTemplate,
  IconChartBar,
  IconSparkles,
} from "@tabler/icons-react";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { TicketStatusIllustration } from "./TicketStatusIllustration";
import { CannedResponseIllustration } from "./CannedResponseIllustration";

// ─── Tab definitions ──────────────────────────────────────────────────────────

type TabId = "email" | "chat" | "status" | "canned" | "analytics" | "ai";

const tabs: {
  id: TabId;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "email",
    label: "Email to Slack Routing",
    description: "Every support email lands in the right channel instantly",
    icon: <IconMailForward size={18} stroke={1.75} />,
  },
  {
    id: "chat",
    label: "Real-time Chat",
    description: "Live chat that your team handles without a new tool",
    icon: <IconMessageChatbot size={18} stroke={1.75} />,
  },
  {
    id: "status",
    label: "Ticket Management",
    description: "Every ticket owned, tracked, and resolved from Slack",
    icon: <IconCircleCheck size={18} stroke={1.75} />,
  },
  {
    id: "canned",
    label: "Quick Replies & Templates",
    description: "Reusable replies and email templates — consistent every time",
    icon: <IconTemplate size={18} stroke={1.75} />,
  },
];

// ─── Per-tab content ──────────────────────────────────────────────────────────

const tabContent: Record<
  TabId,
  {
    heading: string;
    paragraph: string;
    bullets: { icon: React.ReactNode; text: string }[];
  }
> = {
  email: {
    heading: "The right email. The right channel. Every time.",
    paragraph:
      "One setup. Permanent routing. Connect support@, billing@, and sales@ and every email that arrives goes straight to its dedicated Slack channel — no rules to maintain, no forwarding to configure, no inbox to monitor. Just Slack threads your team already knows how to use.",
    bullets: [
      {
        icon: <IconMailForward size={16} stroke={1.75} />,
        text: "Dedicated channel per alias",
      },
      {
        icon: <IconCircleCheck size={16} stroke={1.75} />,
        text: "Zero inbox clutter for your team",
      },
      {
        icon: <IconSparkles size={16} stroke={1.75} />,
        text: "Works with any email provider",
      },
    ],
  },
  chat: {
    heading: "Live chat that your team handles without a new tool",
    paragraph:
      "Embed the chat widget on your website in minutes. When a visitor starts a conversation, it appears instantly as a Slack thread — your team replies there, the visitor sees the response on your site in real time. No new dashboard, no separate inbox, no tab switching.",
    bullets: [
      {
        icon: <IconMessageChatbot size={16} stroke={1.75} />,
        text: "Embed chat widget in minutes",
      },
      {
        icon: <IconCircleCheck size={16} stroke={1.75} />,
        text: "Replies go back to the visitor instantly",
      },
      {
        icon: <IconSparkles size={16} stroke={1.75} />,
        text: "Full conversation history in Slack",
      },
    ],
  },
  status: {
    heading: "One click to claim. One thread to resolve. Zero chaos.",
    paragraph:
      "When an email or chat arrives in Slack, any team member can claim it in one click — making them the owner. Status updates from Open to In Progress to Resolved, visible to everyone. No duplicate replies, no dropped threads, no manager asking who's handling this.",
    bullets: [
      {
        icon: <IconCircleCheck size={16} stroke={1.75} />,
        text: "One-click claim and assign",
      },
      {
        icon: <IconChartBar size={16} stroke={1.75} />,
        text: "Filter by status in the dashboard",
      },
      {
        icon: <IconSparkles size={16} stroke={1.75} />,
        text: "Zero duplicate responses",
      },
    ],
  },
  canned: {
    heading: "Stop rewriting the same answers. Build them once, send forever.",
    paragraph:
      "Build a library of your best replies — billing questions, password resets, shipping updates, feature request responses. One click in Slack loads the template, you edit if needed, and send. Your customer receives a properly formatted, branded email. Consistent, fast, and professional every time — regardless of who on the team replies.",
    bullets: [
      {
        icon: <IconTemplate size={16} stroke={1.75} />,
        text: "Categorised by Billing, Tech, Sales",
      },
      {
        icon: <IconCircleCheck size={16} stroke={1.75} />,
        text: "50% faster responses on FAQs",
      },
      {
        icon: <IconSparkles size={16} stroke={1.75} />,
        text: "Editable before sending",
      },
    ],
  },
  analytics: {
    heading: "See exactly how your team is performing",
    paragraph:
      "Track first response time, resolution rate, and tickets per agent — all in one dashboard. Spot bottlenecks before they become problems and keep your SLAs green.",
    bullets: [
      {
        icon: <IconChartBar size={16} stroke={1.75} />,
        text: "7-day and 30-day trend views",
      },
      {
        icon: <IconCircleCheck size={16} stroke={1.75} />,
        text: "Per-agent leaderboard",
      },
      {
        icon: <IconSparkles size={16} stroke={1.75} />,
        text: "Average response time at a glance",
      },
    ],
  },
  ai: {
    heading: "Let AI handle triage so you don't have to",
    paragraph:
      "Every incoming ticket gets auto-categorised, sentiment-scored, and prioritised before your team even sees it. Angry billing customers get flagged immediately — nothing falls through the cracks.",
    bullets: [
      {
        icon: <IconSparkles size={16} stroke={1.75} />,
        text: "Auto-detects Billing / Bug / Feature",
      },
      {
        icon: <IconCircleCheck size={16} stroke={1.75} />,
        text: "Sentiment scoring on every ticket",
      },
      {
        icon: <IconChartBar size={16} stroke={1.75} />,
        text: "Priority flag for urgent customers",
      },
    ],
  },
};

// ─── Illustration map ─────────────────────────────────────────────────────────

const illustrations: Partial<Record<TabId, React.ReactNode>> = {
  email: <EmailSlackIllustration />,
  chat: <WebsiteChatIllustration />,
  status: <TicketStatusIllustration />,
  canned: <CannedResponseIllustration />,
};

// ─── Component ────────────────────────────────────────────────────────────────

const TAB_DURATION = 7; // seconds each tab stays active

export function FeatureTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("email");
  const [trailKey, setTrailKey] = useState(0);

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
    setTrailKey((k) => k + 1);
  };

  // Single timer drives auto-advance — avoids double-firing from two mounted trails
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setActiveTab((current) => {
        const idx = tabs.findIndex((t) => t.id === current);
        return tabs[(idx + 1) % tabs.length].id;
      });
      setTrailKey((k) => k + 1);
    }, TAB_DURATION * 1000);
    return () => clearTimeout(timer);
  }, [activeTab, trailKey]);

  return (
    /*
     * ┌─────────────────────────────────────────────────────────────────┐
     * │  GRID FRAME  (mirrors the Tailwind Play decorative grid)        │
     * │                                                                 │
     * │  cols: [1fr] [2.5rem hatched] [auto card] [2.5rem hatched] [1fr]│
     * │  rows: [1fr]  [1px hr]  [auto content]  [1px hr]  [1fr]        │
     * └─────────────────────────────────────────────────────────────────┘
     *
     *  The CSS variable --pattern-fg drives every decorative colour so
     *  both light and dark modes stay in sync automatically.
     */
    <div
      className={[
        "relative grid w-full mt-10",
        // 5 columns: margins | hatched | card | hatched | margins
        "grid-cols-[1fr_0.75rem_auto_0.75rem_1fr] md:grid-cols-[1fr_2.5rem_auto_2.5rem_1fr]",
        // 5 rows: top-space | 1px line | content | 1px line | bottom-space
        "grid-rows-[1fr_1px_auto_1px_1fr]",
        // light/dark background + pattern colour token
        "bg-white dark:bg-gray-950",
        "[--pattern-fg:theme(colors.gray.950/5%)]",
        "dark:[--pattern-fg:theme(colors.white/10%)]",
      ].join(" ")}
    >
      {/* ── Left hatched column (col 2, all rows) ──────────────────────── */}
      <div
        className={[
          "col-start-2 row-span-full row-start-1",
          // nudge inward 1 px so borders don't double-up
          "relative -right-px",
          // left + right border in pattern colour
          "border-x border-x-(--pattern-fg)",
          // diagonal stripe via repeating-linear-gradient
          "bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)]",
          "bg-[size:10px_10px]",
          // fixed so the pattern doesn't scroll with the page
          "bg-fixed",
        ].join(" ")}
      />

      {/* ── Right hatched column (col 4, all rows) ─────────────────────── */}
      <div
        className={[
          "col-start-4 row-span-full row-start-1",
          "relative -left-px",
          "border-x border-x-(--pattern-fg)",
          "bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)]",
          "bg-[size:10px_10px]",
          "bg-fixed",
        ].join(" ")}
      />

      {/* ── Top 1px horizontal rule (row 2, full width) ────────────────── */}
      <div
        className={[
          "relative -bottom-px",
          "col-span-full col-start-1 row-start-2",
          "h-px bg-(--pattern-fg)",
        ].join(" ")}
      />

      {/* ── Bottom 1px horizontal rule (row 4, full width) ─────────────── */}
      <div
        className={[
          "relative -top-px",
          "col-span-full col-start-1 row-start-4",
          "h-px bg-(--pattern-fg)",
        ].join(" ")}
      />

      {/* ── THE CARD  (col 3, row 3 — the live content cell) ───────────── */}
      <div className="col-start-3 row-start-3 w-full">
        <Container className="py-8 md:py-20 lg:py-1">
          {/* ── Section label ─────────────────────────────────────────── */}
          <p className="font-schibsted text-sm md:text-xs font-semibold uppercase tracking-widest text-sky-800 px-4 pt-4 pb-4 text-left">
            Everything in one place
          </p>

          {/* ── Outer box ─────────────────────────────────────────────── */}
          <div className="border border-neutral-200 overflow-hidden">
            {/* ── Tab row — desktop only ─────────────────────────────── */}
            <div className="hidden md:flex divide-x divide-neutral-200 border-b border-neutral-200">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={[
                      "relative flex-1 flex flex-col items-start gap-1.5 px-6 py-5 text-left",
                      "transition-colors duration-150 overflow-hidden",
                      isActive ? "bg-white" : "bg-neutral-50 hover:bg-white",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex items-center gap-2 text-base font-schibsted font-semibold mb-1",
                        "transition-colors duration-150",
                        isActive ? "text-sky-800" : "text-neutral-900",
                      ].join(" ")}
                    >
                      {tab.icon}
                      {tab.label}
                    </span>
                    <span
                      className={`text-sm font-schibsted font-normal leading-snug ${isActive ? "" : "text-neutral-900"}`}
                    >
                      {tab.description}
                    </span>

                    {/* ── Progress trail ──────────────────────────────── */}
                    {isActive && (
                      <div
                        key={trailKey}
                        className="absolute bottom-0 left-0 w-full h-5 overflow-hidden"
                        aria-hidden="true"
                      >
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-sky-100" />
                        <motion.div
                          className="absolute bottom-0 left-0 h-px bg-sky-500 origin-left"
                          style={{ width: "100%" }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: TAB_DURATION,
                            ease: "linear",
                          }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Mobile step navigator ─────────────────────────────── */}
            <div className="flex md:hidden items-center justify-start px-4 py-4 border-b border-neutral-200 bg-white relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="flex items-center gap-2.5 font-schibsted font-semibold text-base text-sky-800"
                >
                  <span className="[&>svg]:w-5 [&>svg]:h-5">
                    {tabs.find((t) => t.id === activeTab)?.icon}
                  </span>
                  {tabs.find((t) => t.id === activeTab)?.label}
                </motion.span>
              </AnimatePresence>

              {/* Progress trail on mobile */}
              <div
                key={trailKey}
                className="absolute bottom-0 left-0 w-full h-4 overflow-hidden pointer-events-none"
                aria-hidden="true"
              >
                <div className="absolute bottom-0 left-0 right-0 h-px bg-sky-100" />
                <motion.div
                  className="absolute bottom-0 left-0 h-px bg-sky-500 origin-left"
                  style={{ width: "100%" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: TAB_DURATION, ease: "linear" }}
                />
              </div>
            </div>

            {/* ── Animated content area ─────────────────────────────── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-neutral-200"
              >
                {/* Left — text ──────────────────────────────────────── */}
                <div className="lg:w-[42%] shrink-0 flex flex-col gap-6 p-5 md:p-10">
                  <Heading
                    variant="muted"
                    className="font-schibsted text-2xl lg:text-3xl text-sky-800 leading-tight"
                  >
                    {tabContent[activeTab].heading}
                  </Heading>

                  <Paragraph variant="home-par" className="mb-8">
                    {tabContent[activeTab].paragraph}
                  </Paragraph>
                </div>

                {/* Right — illustration ────────────────────────────── */}
                <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-b from-[#A8D3FF] to-[#FFF4DF] p-0 md:p-10">
                  {/* SVG grain filter */}
                  <svg className="absolute w-0 h-0" aria-hidden="true">
                    <filter id="featureTabGrain">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.65"
                        numOctaves="3"
                        stitchTiles="stitch"
                      />
                      <feColorMatrix type="saturate" values="0" />
                    </filter>
                  </svg>

                  {/* Grain overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "#8C8C8C",
                      filter: "url(#featureTabGrain)",
                      opacity: 0.9,
                    }}
                  />

                  {/* Illustration — sits above grain */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    {illustrations[activeTab] ?? (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-schibsted text-sm text-neutral-400">
                          Coming soon
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Container>
      </div>
    </div>
  );
}
