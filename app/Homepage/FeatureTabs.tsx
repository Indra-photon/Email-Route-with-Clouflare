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
//     <Container className="w-full ">
//       <div
//         className="w-full flex space-x-5 border-t border-b border-dashed border-neutral-400"
//       >
//         {tabs.map((tab, index) => {
//           const isActive = activeTab === tab.id;
//           const isLast = index === tabs.length - 1;

//           return (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`
//                 relative flex-1 flex flex-col items-start gap-1.5 rounded-[6px] py-2
//                 transition-colors duration-150 text-left
//                 ${isActive ? "text-sky-800" : "text-neutral-600 hover:text-neutral-900"}
//               `}
//             >

//               {/* Icon + label */}
//               <span
//                 className={`flex items-center gap-2 font-schibsted font-semibold text-sm leading-none transition-colors duration-150 ${
//                   isActive ? "text-sky-800" : "text-neutral-900 hover:text-neutral-900"
//                 }`}
//               >
//                 {tab.icon}
//                 {tab.label}
//               </span>

//               {/* Description */}
//               {/* <span className="font-schibsted text-xs text-neutral-400 leading-snug pl-[26px]">
//                 {tab.description}
//               </span> */}
//             </button>
//           );
//         })}
//       </div>

//       {/* ── Illustration canvas ───────────────────────────────────────────── */}
//         <div
//         className="w-full flex rounded-md mt-2"
//         >
//         {/* Left — heading + paragraph + bullets */}
//         {/* <div className="flex flex-col justify-center gap-5 py-12 w-[50%] shrink-0">
//             <AnimatePresence mode="wait">
//             <motion.div
//                 key={activeTab + "-left"}
//                 initial={{ opacity: 0, y: 6 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -6 }}
//                 transition={{ duration: 0.18, ease: "easeOut" }}
//                 className="flex flex-col gap-5"
//             >
//                 <Heading as="h2" variant="muted" className="text-sky-800">
//                 {tabContent[activeTab].heading}
//                 </Heading>

//                 <Paragraph variant="default" className="text-neutral-900 pb-10">
//                 {tabContent[activeTab].paragraph}
//                 </Paragraph>

//                 <ul className="flex flex-col gap-3">
//                 {tabContent[activeTab].bullets.map((bullet, i) => (
//                     <li key={i} className="flex items-center gap-2 font-schibsted text-sm text-neutral-700">
//                     <span className="text-sky-700 shrink-0">{bullet.icon}</span>
//                     {bullet.text}
//                     </li>
//                 ))}
//                 </ul>
//             </motion.div>
//             </AnimatePresence>
//         </div>
//         <div className="flex-1 flex items-center justify-center py-10 px-8 ">
//             <div className="bg-sky-800 ring-sky-900 shadow-black/6.5 overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md ring-1 relative">
//                <div className="bg-white ring-sky-800 shadow-black/6.5 overflow-hidden rounded-t-[2rem] shadow ring-1 p-6 h-[500px] w-[400px]">
//                 <AnimatePresence mode="wait">
//                 <motion.div
//                     key={activeTab + "-right"}
//                     initial={{ opacity: 0, y: 6 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -6 }}
//                     transition={{ duration: 0.18, ease: "easeOut" }}
//                     className="w-full max-w-lg"
//                 >
//                     {illustrations[activeTab] ?? (
//                     <div className="w-full h-64 rounded-xl bg-neutral-100 flex items-center justify-center">
//                         <span className="font-schibsted text-sm text-neutral-400">Illustration coming soon</span>
//                     </div>
//                     )}
//                 </motion.div>
//                 </AnimatePresence>
//                 </div>
//             </div>
//         </div> */}
//         <AnimatePresence mode="wait">
//         <motion.div
//             key={activeTab}
//             initial={{ clipPath: "inset(0% 0% 100% 0% round 8px)" }}
//             animate={{ clipPath: "inset(0% 0% 0% 0% round 8px)" }}
//             exit={{ clipPath: "inset(100% 0% 0% 0% round 8px)" }}
//             transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
//             className="w-full flex rounded-md mt-2"
//         >

//             <div className="flex flex-col justify-center gap-5 py-12 w-[50%] shrink-0">
//             <div className="flex flex-col gap-5">
//                 <Heading as="h2" variant="muted" className="text-sky-800 font-semibold">
//                 {tabContent[activeTab].heading}
//                 </Heading>

//                 <Paragraph variant="default" className="text-neutral-900 pb-10">
//                 {tabContent[activeTab].paragraph}
//                 </Paragraph>

//             </div>
//             </div>

//             <div className="flex-1 flex items-center justify-center py-10 px-8">
//             <div className="bg-sky-800 ring-sky-900 shadow-black/6.5 overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md ring-1 relative">
//                 <div className="bg-white ring-sky-800 shadow-black/6.5 overflow-hidden rounded-t-[2rem] shadow ring-1 p-6 h-[500px] w-[400px]">
//                 {illustrations[activeTab] ?? (
//                     <div className="w-full h-64 rounded-xl bg-neutral-100 flex items-center justify-center">
//                     <span className="font-schibsted text-sm text-neutral-400">Illustration coming soon</span>
//                     </div>
//                 )}
//                 </div>
//             </div>
//             </div>
//         </motion.div>
//         </AnimatePresence>
//         </div>

//     </Container>
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
    label: "Automatic Email Routing",
    description: "Route support@, billing@, sales@ to dedicated Slack channels",
    icon: <IconMailForward size={18} stroke={1.75} />,
  },
  {
    id: "chat",
    label: "Live Chat & Reply from Slack",
    description: "Respond to website visitors without leaving Slack",
    icon: <IconMessageChatbot size={18} stroke={1.75} />,
  },
  {
    id: "status",
    label: "Ticket Status & Assignment",
    description: "Claim tickets, track Open → In Progress → Resolved",
    icon: <IconCircleCheck size={18} stroke={1.75} />,
  },
  {
    id: "canned",
    label: "Canned Responses",
    description: "Save and reuse replies for your most common questions",
    icon: <IconTemplate size={18} stroke={1.75} />,
  },
//   {
//     id: "analytics",
//     label: "Performance Dashboard",
//     description: "Track response times, team load, and resolution rates",
//     icon: <IconChartBar size={18} stroke={1.75} />,
//   },
//   {
//     id: "ai",
//     label: "AI Auto-Categorization",
//     description: "Auto-detect sentiment, priority, and category on every ticket",
//     icon: <IconSparkles size={18} stroke={1.75} />,
//   },
];

// ─── Per-tab content ──────────────────────────────────────────────────────────

const tabContent: Record<TabId, {
  heading: string;
  paragraph: string;
  bullets: { icon: React.ReactNode; text: string }[];
}> = {
  email: {
    heading: "Route every email, automatically",
    paragraph: "Connect your support@, billing@, and sales@ inboxes and let our system forward each one to the right Slack channel. No more digging through a shared inbox — the right person sees the right message instantly.",
    bullets: [
      { icon: <IconMailForward size={16} stroke={1.75} />, text: "Dedicated channel per alias" },
      { icon: <IconCircleCheck size={16} stroke={1.75} />, text: "Zero inbox clutter for your team" },
      { icon: <IconSparkles size={16} stroke={1.75} />, text: "Works with any email provider" },
    ],
  },
  chat: {
    heading: "Reply to live chat without leaving Slack",
    paragraph: "Your website visitors get a live chat widget. Your team gets a Slack message. Reply directly from the thread — no new tool to learn, no tab switching, no dropped conversations.",
    bullets: [
      { icon: <IconMessageChatbot size={16} stroke={1.75} />, text: "Embed chat widget in minutes" },
      { icon: <IconCircleCheck size={16} stroke={1.75} />, text: "Replies go back to the visitor instantly" },
      { icon: <IconSparkles size={16} stroke={1.75} />, text: "Full conversation history in Slack" },
    ],
  },
  status: {
    heading: "Always know where every ticket stands",
    paragraph: "Claim tickets, update status from Open to In Progress to Resolved — all from Slack buttons. No duplicate replies, no dropped threads, no manager asking 'who's handling this?'",
    bullets: [
      { icon: <IconCircleCheck size={16} stroke={1.75} />, text: "One-click claim and assign" },
      { icon: <IconChartBar size={16} stroke={1.75} />, text: "Filter by status in the dashboard" },
      { icon: <IconSparkles size={16} stroke={1.75} />, text: "Zero duplicate responses" },
    ],
  },
  canned: {
    heading: "Answer common questions in one click",
    paragraph: "Build a library of your best replies for billing questions, password resets, feature requests. Insert any template from Slack in seconds — consistent, fast, on-brand every time.",
    bullets: [
      { icon: <IconTemplate size={16} stroke={1.75} />, text: "Categorised by Billing, Tech, Sales" },
      { icon: <IconCircleCheck size={16} stroke={1.75} />, text: "50% faster responses on FAQs" },
      { icon: <IconSparkles size={16} stroke={1.75} />, text: "Editable before sending" },
    ],
  },
  analytics: {
    heading: "See exactly how your team is performing",
    paragraph: "Track first response time, resolution rate, and tickets per agent — all in one dashboard. Spot bottlenecks before they become problems and keep your SLAs green.",
    bullets: [
      { icon: <IconChartBar size={16} stroke={1.75} />, text: "7-day and 30-day trend views" },
      { icon: <IconCircleCheck size={16} stroke={1.75} />, text: "Per-agent leaderboard" },
      { icon: <IconSparkles size={16} stroke={1.75} />, text: "Average response time at a glance" },
    ],
  },
  ai: {
    heading: "Let AI handle triage so you don't have to",
    paragraph: "Every incoming ticket gets auto-categorised, sentiment-scored, and prioritised before your team even sees it. Angry billing customers get flagged immediately — nothing falls through the cracks.",
    bullets: [
      { icon: <IconSparkles size={16} stroke={1.75} />, text: "Auto-detects Billing / Bug / Feature" },
      { icon: <IconCircleCheck size={16} stroke={1.75} />, text: "Sentiment scoring on every ticket" },
      { icon: <IconChartBar size={16} stroke={1.75} />, text: "Priority flag for urgent customers" },
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

export function FeatureTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("email");

  return (
    <div className="w-full mt-10">
      <Container className="py-16">

        {/* ── Section label ─────────────────────────────────────────────────── */}
        <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-800 mb-4">
          Everything in one place
        </p>

        {/* ── Outer box ─────────────────────────────────────────────────────── */}
        <div className="border border-neutral-200 overflow-hidden">

          {/* ── Tab row ─────────────────────────────────────────────────────── */}
          <div className="flex divide-x divide-neutral-200 border-b border-neutral-200">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 flex flex-col items-start gap-1.5 px-6 py-5 text-left transition-colors duration-150 ${
                    isActive ? "bg-white" : "bg-neutral-50 hover:bg-white"
                  }`}
                >
                  {/* Active top border indicator */}

                  <span className={`text-base font-schibsted font-semibold mb-1 transition-colors duration-150 ${
                    isActive ? "text-sky-800" : "text-neutral-900"
                  }`}>
                    {tab.icon}
                    {tab.label}
                  </span>
                  <span className="text-sm font-schibsted font-normal text-neutral-900 leading-snug">
                    {tab.description}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Content area ────────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-neutral-200"
            >
              {/* Left — text */}
              <div className="lg:w-[42%] shrink-0 flex flex-col gap-6 p-10">
                <Heading variant="default" className="font-schibsted text-2xl lg:text-3xl font-bold text-neutral-900 leading-tight">
                  {tabContent[activeTab].heading}
                </Heading>

                <Paragraph variant="home-par" className="mb-8">
                  {tabContent[activeTab].paragraph}
                </Paragraph>

                {/* <ul className="flex flex-col gap-3 pt-2">
                  {tabContent[activeTab].bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center gap-3 font-schibsted text-sm text-neutral-700">
                      <span className="flex items-center justify-center w-7 h-7 bg-sky-50 border border-sky-100 text-sky-800 shrink-0">
                        {bullet.icon}
                      </span>
                      {bullet.text}
                    </li>
                  ))}
                </ul> */}
              </div>

              {/* Right — illustration */}
              <div className="flex-1 flex items-center justify-center bg-neutral-50 p-10">
                <div className="bg-white/75 ring-1 ring-neutral-200 overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md relative">
                  <div className="bg-white ring-1 ring-neutral-100 overflow-hidden rounded-t-[2rem] p-6 h-[460px] w-[380px]">
                    {illustrations[activeTab] ?? (
                      <div className="w-full h-full bg-neutral-50 flex items-center justify-center">
                        <span className="font-schibsted text-sm text-neutral-400">Coming soon</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

      </Container>
    </div>
  );
}