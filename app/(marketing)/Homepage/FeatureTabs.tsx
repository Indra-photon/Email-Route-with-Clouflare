



// "use client";

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import { EmailSlackIllustration } from "./EmailSlackIllustration";
// import { WebsiteChatIllustration } from "./WebsiteChatIllustration";
// import {
//   IconMailForward,
//   IconMessageChatbot,
//   IconCircleCheck,
//   IconTemplate,
//   IconChartBar,
//   IconSparkles,
// } from "@tabler/icons-react";
// import { Container } from "@/components/Container";
// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";
// import { TicketStatusIllustration } from "./TicketStatusIllustration";
// import { CannedResponseIllustration } from "./CannedResponseIllustration";

// // ─── Tab definitions ──────────────────────────────────────────────────────────

// type TabId = "email" | "chat" | "status" | "canned" | "analytics" | "ai";

// const tabs: {
//   id: TabId;
//   label: string;
//   description: string;
//   icon: React.ReactNode;
// }[] = [
//   {
//     id: "email",
//     label: "Automatic Email Routing",
//     description: "Route support@, billing@, sales@ to dedicated Slack channels",
//     icon: <IconMailForward size={18} stroke={1.75} />,
//   },
//   {
//     id: "chat",
//     label: "Live Chat & Reply from Slack",
//     description: "Respond to website visitors without leaving Slack",
//     icon: <IconMessageChatbot size={18} stroke={1.75} />,
//   },
//   {
//     id: "status",
//     label: "Ticket Status & Assignment",
//     description: "Claim tickets, track Open → In Progress → Resolved",
//     icon: <IconCircleCheck size={18} stroke={1.75} />,
//   },
//   {
//     id: "canned",
//     label: "Canned Responses",
//     description: "Save and reuse replies for your most common questions",
//     icon: <IconTemplate size={18} stroke={1.75} />,
//   },
// //   {
// //     id: "analytics",
// //     label: "Performance Dashboard",
// //     description: "Track response times, team load, and resolution rates",
// //     icon: <IconChartBar size={18} stroke={1.75} />,
// //   },
// //   {
// //     id: "ai",
// //     label: "AI Auto-Categorization",
// //     description: "Auto-detect sentiment, priority, and category on every ticket",
// //     icon: <IconSparkles size={18} stroke={1.75} />,
// //   },
// ];

// // ─── Per-tab content ──────────────────────────────────────────────────────────

// const tabContent: Record<TabId, {
//   heading: string;
//   paragraph: string;
//   bullets: { icon: React.ReactNode; text: string }[];
// }> = {
//   email: {
//     heading: "Route every email, automatically",
//     paragraph: "Connect your support@, billing@, and sales@ inboxes and let our system forward each one to the right Slack channel. No more digging through a shared inbox — the right person sees the right message instantly.",
//     bullets: [
//       { icon: <IconMailForward size={16} stroke={1.75} />, text: "Dedicated channel per alias" },
//       { icon: <IconCircleCheck size={16} stroke={1.75} />, text: "Zero inbox clutter for your team" },
//       { icon: <IconSparkles size={16} stroke={1.75} />, text: "Works with any email provider" },
//     ],
//   },
//   chat: {
//     heading: "Reply to live chat without leaving Slack",
//     paragraph: "Your website visitors get a live chat widget. Your team gets a Slack message. Reply directly from the thread — no new tool to learn, no tab switching, no dropped conversations.",
//     bullets: [
//       { icon: <IconMessageChatbot size={16} stroke={1.75} />, text: "Embed chat widget in minutes" },
//       { icon: <IconCircleCheck size={16} stroke={1.75} />, text: "Replies go back to the visitor instantly" },
//       { icon: <IconSparkles size={16} stroke={1.75} />, text: "Full conversation history in Slack" },
//     ],
//   },
//   status: {
//     heading: "Always know where every ticket stands",
//     paragraph: "Claim tickets, update status from Open to In Progress to Resolved — all from Slack buttons. No duplicate replies, no dropped threads, no manager asking 'who's handling this?'",
//     bullets: [
//       { icon: <IconCircleCheck size={16} stroke={1.75} />, text: "One-click claim and assign" },
//       { icon: <IconChartBar size={16} stroke={1.75} />, text: "Filter by status in the dashboard" },
//       { icon: <IconSparkles size={16} stroke={1.75} />, text: "Zero duplicate responses" },
//     ],
//   },
//   canned: {
//     heading: "Answer common questions in one click",
//     paragraph: "Build a library of your best replies for billing questions, password resets, feature requests. Insert any template from Slack in seconds — consistent, fast, on-brand every time.",
//     bullets: [
//       { icon: <IconTemplate size={16} stroke={1.75} />, text: "Categorised by Billing, Tech, Sales" },
//       { icon: <IconCircleCheck size={16} stroke={1.75} />, text: "50% faster responses on FAQs" },
//       { icon: <IconSparkles size={16} stroke={1.75} />, text: "Editable before sending" },
//     ],
//   },
//   analytics: {
//     heading: "See exactly how your team is performing",
//     paragraph: "Track first response time, resolution rate, and tickets per agent — all in one dashboard. Spot bottlenecks before they become problems and keep your SLAs green.",
//     bullets: [
//       { icon: <IconChartBar size={16} stroke={1.75} />, text: "7-day and 30-day trend views" },
//       { icon: <IconCircleCheck size={16} stroke={1.75} />, text: "Per-agent leaderboard" },
//       { icon: <IconSparkles size={16} stroke={1.75} />, text: "Average response time at a glance" },
//     ],
//   },
//   ai: {
//     heading: "Let AI handle triage so you don't have to",
//     paragraph: "Every incoming ticket gets auto-categorised, sentiment-scored, and prioritised before your team even sees it. Angry billing customers get flagged immediately — nothing falls through the cracks.",
//     bullets: [
//       { icon: <IconSparkles size={16} stroke={1.75} />, text: "Auto-detects Billing / Bug / Feature" },
//       { icon: <IconCircleCheck size={16} stroke={1.75} />, text: "Sentiment scoring on every ticket" },
//       { icon: <IconChartBar size={16} stroke={1.75} />, text: "Priority flag for urgent customers" },
//     ],
//   },
// };

// // ─── Illustration map ─────────────────────────────────────────────────────────

// const illustrations: Partial<Record<TabId, React.ReactNode>> = {
//   email: <EmailSlackIllustration />,
//   chat: <WebsiteChatIllustration />,
//   status: <TicketStatusIllustration />,
//   canned: <CannedResponseIllustration />,
// };

// export function FeatureTabs() {
//   const [activeTab, setActiveTab] = useState<TabId>("email");

//   return (
//     <div className="w-full mt-10">
//       <Container className="py-16">

//         {/* ── Section label ─────────────────────────────────────────────────── */}
//         <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-800 mb-4">
//           Everything in one place
//         </p>

//         {/* ── Outer box ─────────────────────────────────────────────────────── */}
//         <div className="border border-neutral-200 overflow-hidden">

//           {/* ── Tab row ─────────────────────────────────────────────────────── */}
//           <div className="flex divide-x divide-neutral-200 border-b border-neutral-200">
//             {tabs.map((tab) => {
//               const isActive = activeTab === tab.id;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`relative flex-1 flex flex-col items-start gap-1.5 px-6 py-5 text-left transition-colors duration-150 ${
//                     isActive ? "bg-white" : "bg-neutral-50 hover:bg-white"
//                   }`}
//                 >
//                   {/* Active top border indicator */}

//                   <span className={`text-base font-schibsted font-semibold mb-1 transition-colors duration-150 ${
//                     isActive ? "text-sky-800" : "text-neutral-900"
//                   }`}>
//                     {tab.icon}
//                     {tab.label}
//                   </span>
//                   <span className="text-sm font-schibsted font-normal text-neutral-900 leading-snug">
//                     {tab.description}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>

//           {/* ── Content area ────────────────────────────────────────────────── */}
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activeTab}
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -6 }}
//               transition={{ duration: 0.2, ease: "easeOut" }}
//               className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-neutral-200"
//             >
//               {/* Left — text */}
//               <div className="lg:w-[42%] shrink-0 flex flex-col gap-6 p-10">
//                 <Heading variant="default" className="font-schibsted text-2xl lg:text-3xl font-bold text-neutral-900 leading-tight">
//                   {tabContent[activeTab].heading}
//                 </Heading>

//                 <Paragraph variant="home-par" className="mb-8">
//                   {tabContent[activeTab].paragraph}
//                 </Paragraph>

//                 {/* <ul className="flex flex-col gap-3 pt-2">
//                   {tabContent[activeTab].bullets.map((bullet, i) => (
//                     <li key={i} className="flex items-center gap-3 font-schibsted text-sm text-neutral-700">
//                       <span className="flex items-center justify-center w-7 h-7 bg-sky-50 border border-sky-100 text-sky-800 shrink-0">
//                         {bullet.icon}
//                       </span>
//                       {bullet.text}
//                     </li>
//                   ))}
//                 </ul> */}
//               </div>

//               {/* Right — illustration */}
//               <div className="flex-1 flex items-center justify-center bg-neutral-50 p-10">
//                 <div className="bg-white/75 ring-1 ring-neutral-200 overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md relative">
//                   <div className="bg-white ring-1 ring-neutral-100 overflow-hidden rounded-t-[2rem] p-6 h-[460px] w-[380px]">
//                     {illustrations[activeTab] ?? (
//                       <div className="w-full h-full bg-neutral-50 flex items-center justify-center">
//                         <span className="font-schibsted text-sm text-neutral-400">Coming soon</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </AnimatePresence>

//         </div>

//       </Container>
//     </div>
//   );
// }



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
  // Bump this key whenever the active tab changes to remount the SVG trail
  const [trailKey, setTrailKey] = useState(0);

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
    setTrailKey((k) => k + 1);
  };

  const handleAdvanceTab = () => {
    setActiveTab((current) => {
      const idx = tabs.findIndex((t) => t.id === current);
      return tabs[(idx + 1) % tabs.length].id;
    });
    setTrailKey((k) => k + 1);
  };

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
        "grid-cols-[1fr_2.5rem_auto_2.5rem_1fr]",
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
        <Container className="py-16">

          {/* ── Section label ─────────────────────────────────────────── */}
          <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-800 mb-4 p-4">
            Everything in one place
          </p>

          {/* ── Outer box ─────────────────────────────────────────────── */}
          <div className="border border-neutral-200 overflow-hidden">

            {/* ── Tab row ───────────────────────────────────────────── */}
            <div className="flex divide-x divide-neutral-200 border-b border-neutral-200">
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
                    <span className={`text-sm font-schibsted font-normal leading-snug ${isActive ? "" : "text-neutral-900"}`}>
                      {tab.description}
                    </span>

                    {/* ── Progress trail ──────────────────────────────── */}
                    {isActive && (
                      <div
                        key={trailKey}
                        className="absolute bottom-0 left-0 w-full h-5 overflow-hidden"
                        aria-hidden="true"
                      >
                        {/* dim track */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-sky-100" />

                        {/* growing trail line behind the bolt */}
                        <motion.div
                          className="absolute bottom-0 left-0 h-px bg-sky-500 origin-left"
                          style={{ width: "100%" }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: TAB_DURATION, ease: "linear" }}
                          onAnimationComplete={handleAdvanceTab}
                        />

                      </div>
                    )}
                  </button>
                );
              })}
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
                <div className="lg:w-[42%] shrink-0 flex flex-col gap-6 p-10">
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

                {/* Right — illustration ─────────────────────────────── */}
                <div className="flex-1 flex items-center justify-center bg-neutral-50 p-10">
                  {/* <div className="bg-white/75 ring-1 ring-neutral-200 overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md relative">
                    <div className="bg-white ring-1 ring-neutral-100 overflow-hidden rounded-t-[2rem] p-6 h-[460px] w-[380px]"> */}
                      {illustrations[activeTab] ?? (
                        <div className="w-full h-full bg-neutral-50 flex items-center justify-center">
                          <span className="font-schibsted text-sm text-neutral-400">
                            Coming soon
                          </span>
                        </div>
                      )}
                    {/* </div>
                  </div> */}
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </Container>
      </div>
    </div>
  );
}