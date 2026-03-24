"use client";

import React from "react";
import { motion } from "motion/react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { LaptopNotificationVisual } from "./LaptopNotificationVisual";
import HeroCTAPrimary, { HeroCTASecondary } from "@/components/HeroCTAPrimary";
import Link from "next/link";
import CTAWrapper from "@/components/CTAWrapper";

// ─── Icons ────────────────────────────────────────────────────────────────────

const SlackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-5zM9 6a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5zm9 2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5zm-2 9a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5z" />
  </svg>
);

const PricingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v2m0 8v2M9 9.5A3 3 0 0 1 12 8h.5a2.5 2.5 0 0 1 0 5H12a2.5 2.5 0 0 0 0 5h.5A3 3 0 0 0 15 16.5" />
  </svg>
);

const ChannelsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

// ─── Small card visuals ───────────────────────────────────────────────────────

const PricingVisual = () => (
  <div className="w-full">
    <div className="flex items-end gap-2">
      {[
        { h: 65, label: "Itercom", color: "bg-gradient-to-t from-red-400 to-red-300" },
        { h: 45, label: "Zedesk", color: "bg-gradient-to-t from-orange-400 to-orange-300" },
        { h: 26, label: "SlackDesk", color: "bg-gradient-to-t from-sky-500 to-cyan-400" },
        ].map((item, i) => (
        <div key={item.label} className="flex-1 flex flex-col items-center">
            <motion.div
            className={`w-full rounded-sm ${item.color}`}
            initial={{ height: 0 }}
            whileInView={{ height: item.h }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.45, ease: "easeOut" }}
            />
        </div>
        ))}
    </div>
    {/* Labels below bars */}
    <div className="flex gap-2 mt-1.5">
      {["Intercom", "Zendesk", "SlackDesk"].map((label, i) => (
        <span key={label} className={`flex-1 text-center font-schibsted text-[9px] ${i === 2 ? "text-sky-600 font-semibold" : "text-neutral-400"}`}>
          {label}
        </span>
      ))}
    </div>
    <div className="mt-2 flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
      <span className="font-schibsted text-[10px] text-neutral-400">3x cheaper than nearest competitor</span>
    </div>
  </div>
);

// const ChannelsVisual = () => {
//   const pathD = "M 20 20 C 20 20 20 40 80 40 C 140 40 140 40 140 40";

//   return (
//     <div className="w-full relative" style={{ height: 110 }}>
//       <svg
//         viewBox="0 0 280 110"
//         fill="none"
//         className="w-full h-full"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <defs>
//           {/* Animated gradient for each path */}
//           {["email", "chat", "discord"].map((id) => (
//             <linearGradient
//               key={id}
//               id={`pulse-${id}`}
//               gradientUnits="userSpaceOnUse"
//               x1="0" x2="140"
//               y1="0" y2="0"
//             >
//               <stop stopColor="#38bdf8" stopOpacity="0" />
//               <stop offset="0.4" stopColor="#38bdf8" />
//               <stop offset="0.6" stopColor="#06b6d4" />
//               <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
//             </linearGradient>
//           ))}
//         </defs>

//         {/* ── Base grey paths (always visible) ── */}
//         {/* Email → center */}
//         <path
//           d="M 30 18 C 60 18 80 50 130 50"
//           stroke="rgba(0,0,0,0.1)"
//           strokeWidth="1.5"
//           fill="none"
//         />
//         {/* Live Chat → center */}
//         <path
//           d="M 30 50 C 60 50 80 50 130 50"
//           stroke="rgba(0,0,0,0.1)"
//           strokeWidth="1.5"
//           fill="none"
//         />
//         {/* Discord → center */}
//         <path
//           d="M 30 82 C 60 82 80 50 130 50"
//           stroke="rgba(0,0,0,0.1)"
//           strokeWidth="1.5"
//           fill="none"
//         />
//         {/* center → Slack */}
//         <path
//           d="M 130 50 C 170 50 200 50 250 50"
//           stroke="rgba(0,0,0,0.1)"
//           strokeWidth="1.5"
//           fill="none"
//         />

//         {/* ── Animated gradient traces ── */}
//         <motion.path
//           d="M 30 18 C 60 18 80 50 130 50"
//           stroke="url(#pulse-email)"
//           strokeWidth="2"
//           strokeLinecap="round"
//           fill="none"
//           initial={{ pathLength: 0, opacity: 0 }}
//           whileInView={{ pathLength: 1, opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 1.2, delay: 0, ease: [0.19, 1, 0.22, 1] }}
//         />
//         <motion.path
//           d="M 30 50 C 60 50 80 50 130 50"
//           stroke="url(#pulse-chat)"
//           strokeWidth="2"
//           strokeLinecap="round"
//           fill="none"
//           initial={{ pathLength: 0, opacity: 0 }}
//           whileInView={{ pathLength: 1, opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 1.2, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
//         />
//         <motion.path
//           d="M 30 82 C 60 82 80 50 130 50"
//           stroke="url(#pulse-discord)"
//           strokeWidth="2"
//           strokeLinecap="round"
//           fill="none"
//           initial={{ pathLength: 0, opacity: 0 }}
//           whileInView={{ pathLength: 1, opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 1.2, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
//         />
//         <motion.path
//           d="M 130 50 C 170 50 200 50 250 50"
//           stroke="url(#pulse-email)"
//           strokeWidth="2"
//           strokeLinecap="round"
//           fill="none"
//           initial={{ pathLength: 0, opacity: 0 }}
//           whileInView={{ pathLength: 1, opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8, delay: 0.9, ease: [0.19, 1, 0.22, 1] }}
//         />

//         {/* ── Source labels (left) ── */}
//         {[
//           { y: 18, label: "Email", bg: "#e0f2fe", text: "#0369a1" },
//           { y: 50, label: "Live Chat", bg: "#cffafe", text: "#0e7490" },
//           { y: 82, label: "Forms", bg: "#f0fdf4", text: "#15803d" },
//         ].map((item) => (
//           <g key={item.label}>
//             <rect
//               x="0" y={item.y - 9}
//               width={item.label === "Live Chat" ? 48 : 38}
//               height="18"
//               rx="5"
//               fill={item.bg}
//             />
//             <text
//               x={item.label === "Live Chat" ? 24 : 19}
//               y={item.y + 4.5}
//               textAnchor="middle"
//               fontSize="9"
//               fontFamily="sans-serif"
//               fontWeight="600"
//               fill={item.text}
//             >
//               {item.label}
//             </text>
//           </g>
//         ))}

//         {/* ── Merge node (center dot) ── */}
//         <motion.circle
//           cx="130" cy="50" r="4"
//           fill="#38bdf8"
//           initial={{ scale: 0, opacity: 0 }}
//           whileInView={{ scale: 1, opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ delay: 0.7, duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
//         />

//         {/* ── Slack label (right) ── */}
//         <motion.g
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ delay: 1.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
//         >
//           <rect x="220" y="38" width="50" height="24" rx="6" fill="#4a154b" />
//           <text
//             x="245" y="54"
//             textAnchor="middle"
//             fontSize="9"
//             fontFamily="sans-serif"
//             fontWeight="700"
//             fill="white"
//           >
//             # slack
//           </text>
//         </motion.g>
//       </svg>
//     </div>
//   );
// };



const ChannelsVisual = () => {
  return (
    <div className="w-full relative" style={{ height: 110 }}>
      <svg
        viewBox="0 0 280 110"
        fill="none"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pulse-email" gradientUnits="userSpaceOnUse" x1="0" x2="140" y1="0" y2="0">
            <stop stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="0.4" stopColor="#38bdf8" />
            <stop offset="0.6" stopColor="#06b6d4" />
            <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="pulse-chat" gradientUnits="userSpaceOnUse" x1="0" x2="140" y1="0" y2="0">
            <stop stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="0.4" stopColor="#38bdf8" />
            <stop offset="0.6" stopColor="#06b6d4" />
            <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="pulse-forms" gradientUnits="userSpaceOnUse" x1="0" x2="140" y1="0" y2="0">
            <stop stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="0.4" stopColor="#38bdf8" />
            <stop offset="0.6" stopColor="#06b6d4" />
            <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="pulse-outgoing" gradientUnits="userSpaceOnUse" x1="130" x2="250" y1="0" y2="0">
            <stop stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="0.3" stopColor="#0ea5e9" />
            <stop offset="0.7" stopColor="#7c3aed" />
            <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── Base grey paths (always visible) ── */}
        <path d="M 30 18 C 60 18 80 50 130 50" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" fill="none" />
        <path d="M 30 50 C 60 50 80 50 130 50" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" fill="none" />
        <path d="M 30 82 C 60 82 80 50 130 50" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" fill="none" />
        <path d="M 130 50 C 170 50 200 50 250 50" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" fill="none" />

        {/* ── Animated gradient traces — looping ── */}
        <motion.path
          d="M 30 18 C 60 18 80 50 130 50"
          stroke="url(#pulse-email)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: false }}
          transition={{
            duration: 1.4,
            delay: 0,
            ease: [0.19, 1, 0.22, 1],
          }}
        />
        <motion.path
          d="M 30 50 C 60 50 80 50 130 50"
          stroke="url(#pulse-chat)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: false }}
          transition={{
            duration: 1.4,
            delay: 0.25,
            ease: [0.19, 1, 0.22, 1],
          }}
        />
        <motion.path
          d="M 30 82 C 60 82 80 50 130 50"
          stroke="url(#pulse-forms)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: false }}
          transition={{
            duration: 1.4,
            delay: 0.5,
            ease: [0.19, 1, 0.22, 1],
          }}
        />
        {/* ── Outgoing path — sky → violet ── */}
        <motion.path
          d="M 130 50 C 170 50 200 50 250 50"
          stroke="url(#pulse-outgoing)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: false }}
          transition={{
            duration: 1.0,
            delay: 1.1,
            ease: [0.19, 1, 0.22, 1],
          }}
        />

        {/* ── Source labels (left) ── */}
        {[
          { y: 18, label: "Email", bg: "#e0f2fe", text: "#0369a1" },
          { y: 50, label: "Live Chat", bg: "#cffafe", text: "#0e7490" },
          { y: 82, label: "Forms", bg: "#f0fdf4", text: "#15803d" },
        ].map((item) => (
          <g key={item.label}>
            <rect
              x="0"
              y={item.y - 9}
              width={item.label === "Live Chat" ? 48 : 38}
              height="18"
              rx="5"
              fill={item.bg}
            />
            <text
              x={item.label === "Live Chat" ? 24 : 19}
              y={item.y + 4.5}
              textAnchor="middle"
              fontSize="9"
              fontFamily="sans-serif"
              fontWeight="600"
              fill={item.text}
            >
              {item.label}
            </text>
          </g>
        ))}

        {/* ── Merge node (center dot) ── */}
        <motion.circle
          cx="130"
          cy="50"
          r="4"
          fill="#38bdf8"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
        />

        {/* ── Slack label (right) ── */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <rect x="220" y="38" width="50" height="24" rx="6" fill="#4a154b" />
          <text
            x="245"
            y="54"
            textAnchor="middle"
            fontSize="9"
            fontFamily="sans-serif"
            fontWeight="700"
            fill="white"
          >
            # slack
          </text>
        </motion.g>
      </svg>
    </div>
  );
};


const AnalyticsVisual = () => {
  const items = [
    {
      rank: "#1",
      label: "Payment flow on mobile",
      delta: "+12",
      dir: "up",
      tag: "Fix Now",
      tagColor: "bg-red-50 text-red-500",
      idea: "Write: 'Mobile payment troubleshooting guide'",
    },
    {
      rank: "#2",
      label: "CSV export missing",
      delta: "-4",
      dir: "down",
      tag: "Build Next",
      tagColor: "bg-sky-50 text-sky-600",
      idea: "Write: 'Why we're building CSV export'",
    },
    {
      rank: "#3",
      label: "SSO login requests",
      delta: "new",
      dir: "new",
      tag: "Content",
      tagColor: "bg-cyan-50 text-cyan-600",
      idea: "Write: 'SSO setup — coming soon'",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-2">
      {items.map((item, i) => (
        <motion.div
          key={item.rank}
          className="w-full"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: i * 0.12,
            duration: 0.5,
            ease: [0.215, 0.61, 0.355, 1], // ease-out-cubic
          }}
        >
          {/* Main row */}
          <div className="flex items-center gap-2">
            {/* Rank */}
            <span className="font-schibsted text-[10px] font-bold text-neutral-300 w-5 shrink-0">
              {item.rank}
            </span>

            {/* Label */}
            <span className="font-schibsted text-[11px] text-neutral-700 flex-1 leading-tight">
              {item.label}
            </span>

            {/* Tag */}
            <span className={`font-schibsted text-[9px] font-semibold px-1.5 py-0.5 rounded-md shrink-0 ${item.tagColor}`}>
              {item.tag}
            </span>

            {/* Delta */}
            <motion.span
              className={`font-schibsted text-[10px] font-bold w-7 text-right shrink-0 ${
                item.dir === "up"
                  ? "text-red-400"
                  : item.dir === "down"
                  ? "text-green-500"
                  : "text-sky-400"
              }`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.12 + 0.25,
                duration: 0.4,
                ease: [0.19, 1, 0.22, 1], // ease-out-expo
              }}
            >
              {item.dir === "up" ? "↑" : item.dir === "down" ? "↓" : "✦"}{" "}
              {item.delta}
            </motion.span>
          </div>

          {/* AI content idea — indented below */}
          <motion.div
            className="ml-7 mt-0.5 flex items-center gap-1"
            initial={{ opacity: 0, height: 0 }}
            whileInView={{ opacity: 1, height: "auto" }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.12 + 0.35,
              duration: 0.45,
              ease: [0.165, 0.84, 0.44, 1], // ease-out-quart
            }}
          >
            <div className="w-3 h-px bg-sky-200 shrink-0" />
            <span className="font-schibsted text-[9px] text-sky-400 leading-tight">
              {item.idea}
            </span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

// ─── Featured card illustration — dark mesh ───────────────────────────────────

const FeaturedIllustration = () => (
  <div className="absolute inset-0">
    {/* Base dark bg */}
    <div className="absolute inset-0 bg-neutral-950" />

    {/* Glow orbs */}
    <motion.div
      className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full"
      style={{ background: "radial-gradient(circle, rgba(14,165,233,0.4) 0%, transparent 70%)", filter: "blur(40px)" }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] rounded-full"
      style={{ background: "radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)", filter: "blur(50px)" }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
    <motion.div
      className="absolute bottom-[5%] left-[20%] w-[50%] h-[40%] rounded-full"
      style={{ background: "radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%)", filter: "blur(35px)" }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />

    {/* Grid lines */}
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)`,
        backgroundSize: "38px 38px",
      }}
    />

    {/* Channel pills */}
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 px-6">
      {[
        { channel: "#billing", count: "12 new", delay: 0 },
        { channel: "#support", count: "7 new", delay: 0.12 },
        { channel: "#sales", count: "3 new", delay: 0.24 },
      ].map((item) => (
        <motion.div
          key={item.channel}
          className="flex items-center justify-between w-full max-w-[180px] bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-2.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: item.delay, duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="font-schibsted text-xs font-medium text-white/90">{item.channel}</span>
          </div>
          <span className="font-schibsted text-[10px] text-sky-300 font-semibold">{item.count}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

// ─── Card data ────────────────────────────────────────────────────────────────

type CardData = {
  id: number;
  number: string;
  Icon: React.FC;
  title: string;
  description: string;
  Visual: React.FC | null;
  featured: boolean;
};

const cards: CardData[] = [
  {
    id: 1,
    number: "01",
    Icon: SlackIcon,
    title: "No new tools to learn.",
    description: "SlackDesk lives inside Slack. Your team replies from where they already work — no logins, no tabs, no onboarding.",
    Visual: LaptopNotificationVisual,
    featured: false,
  },
  {
    id: 2,
    number: "02",
    Icon: ChannelsIcon,
    title: "Every channel. One place.",
    description: "Email, live chat, Discord — routed into dedicated Slack channels automatically. Nothing falls through.",
    Visual: ChannelsVisual,
    featured: true,
  },
  {
    id: 3,
    number: "03",
    Icon: AnalyticsIcon,
    title: "Support data that ships features.",
    description: "We surface your top recurring issues, ranked by volume. Your product team gets a brief — no analyst needed.",
    Visual: AnalyticsVisual,
    featured: false,
  },
  {
    id: 4,
    number: "04",
    Icon: PricingIcon,
    title: "One price. Unlimited seats.",
    description: "Add your whole team — founders, contractors, agents. No per-seat fees. Ever.",
    Visual: PricingVisual,
    featured: false,
  },
];

// ─── Small Card ───────────────────────────────────────────────────────────────

const SmallCard = ({ card, delay = 0 }: { card: CardData; delay?: number }) => (
  <motion.div
    className="relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white"
    style={{ height: 460 }}
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94], delay }}
  >
    {/* Watermark number */}
    <div className="absolute top-3 left-4 select-none pointer-events-none">
      <span className="font-schibsted text-6xl font-bold leading-none text-neutral-100">
        {card.number}
      </span>
    </div>

    {/* Visual zone */}
    {card.Visual && (
      <div className={`${card.id === 3 ? 'mt-18' : card.id === 1 ? 'mt-15' : 'mt-32'} px-5`}>
        <card.Visual />
      </div>
    )}

    {/* Bottom text — always pinned to bottom */}
    <div className="mt-auto px-5 pb-5">
      <div className="flex items-center gap-2 mb-1.5">
        <Heading as="h3" variant="small" className="text-sky-800 font-normal leading-snug">
          {card.title}
        </Heading>
      </div>
      <Paragraph variant="home-par" className="">
        {card.description}
      </Paragraph>
    </div>
  </motion.div>
);

// ─── Featured Card (Card 02) ──────────────────────────────────────────────────

const FeaturedCard = ({ card, delay = 0 }: { card: CardData; delay?: number }) => (
  <motion.div
    className="relative flex flex-col overflow-hidden rounded-2xl border border-neutral-300 bg-white shadow-2xl"
    style={{ height: 460 }}
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay }}
  >
    {/* ── Top zone: dark illustration, ~58% of total height ── */}
    <div className="relative flex-none overflow-hidden bg-neutral-950" style={{ height: "58%" }}>
        <div className="absolute inset-0 flex items-center justify-center px-4 mt-20">
            <ChannelsVisual />
        </div>

      {/* Dark shader from top — cinematic vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, rgba(8,8,8,0.65) 0%, rgba(8,8,8,0.15) 55%, transparent 100%)",
        }}
      />

      {/* Watermark number — visible through shader */}
      <span className="absolute top-4 left-5 z-20 font-schibsted text-6xl font-bold leading-none text-white/15 select-none pointer-events-none">
        {card.number}
      </span>
    </div>

    {/* ── Icon badge — sits exactly at the boundary ── */}
    <div
      className="absolute z-30 left-5"
      style={{ top: "calc(58% - 20px)" }}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-neutral-200 shadow-lg text-sky-600">
        <card.Icon />
      </div>
    </div>

    {/* ── Bottom zone: white, text ── */}
    <div className="flex flex-col flex-1 bg-white px-5 pt-9 pb-6">
      <Heading as="h3" variant="small" className="text-sky-800 font-normal mb-1.5">
        {card.title}
      </Heading>
      <Paragraph variant="home-par" className="leading-tight">
        {card.description}
      </Paragraph>
    </div>
  </motion.div>
);

// ─── Section ──────────────────────────────────────────────────────────────────

export function WhySlackDeskSection() {
  const featured = cards.find((c) => c.featured)!;
  const [c1, , c3, c4] = cards;

  return (
    <section className="w-full bg-white py-16 md:py-20 lg:py-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-0">

        {/* Eyebrow */}
        <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-800 mb-4">
          Why teams switch
        </p>

        {/* Inline heading + subheading */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [.25, .46, .45, .94], delay: 0.2 }}
        >
          <Heading as="span" className="text-neutral-900 leading-tight font-semibold">
            Why teams switch to SlackDesk.{" "}
          </Heading>
          <Heading as="span" className="text-neutral-400 leading-tight font-semibold">
            We stripped away the bloat. What's left works the way your team actually works.
          </Heading>
        </motion.div>

        {/* CTA */}
        <div className="mb-10">
          {/* <CTAWrapper
            loggedInHref="/dashboard"
            loggedOutHref="/sign-up"
            loggedInText="Dashboard"
            loggedOutText="Get Started"
          >
            {({ text }) => (
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="font-schibsted font-semibold text-sm uppercase tracking-wide px-6 py-2.5 rounded-full bg-gradient-to-b from-sky-900 to-cyan-700 text-white shadow-lg cursor-pointer"
              >
                {text}
              </motion.button>
            )}
          </CTAWrapper> */}
        </div>

        {/* ── Desktop: all 4 cards, same bottom baseline, card 02 taller ── */}
        <div className="hidden lg:flex items-end gap-3">
          <div className="flex-1"><SmallCard card={c1} delay={0} /></div>
          <div className="flex-1"><FeaturedCard card={featured} delay={0.05} /></div>
          <div className="flex-1"><SmallCard card={c3} delay={0.1} /></div>
          <div className="flex-1"><SmallCard card={c4} delay={0.15} /></div>
        </div>

        {/* ── Tablet: 2×2 ── */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-3">
          {cards.map((card, i) =>
            card.featured
              ? <FeaturedCard key={card.id} card={card} delay={i * 0.05} />
              : <SmallCard key={card.id} card={card} delay={i * 0.05} />
          )}
        </div>

        {/* ── Mobile: single column ── */}
        <div className="grid md:hidden grid-cols-1 gap-3">
          {cards.map((card, i) =>
            card.featured
              ? <FeaturedCard key={card.id} card={card} delay={i * 0.05} />
              : <SmallCard key={card.id} card={card} delay={i * 0.05} />
          )}
        </div>

      </div>
    </section>
  );
}