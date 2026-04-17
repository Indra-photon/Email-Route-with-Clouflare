// 'use client';

// import { AnimatePresence, motion } from "motion/react";
// import React, { useState, useEffect } from "react";
// import {
//   IconTemplate,
//   IconCircleCheck,
//   IconChevronUp,
//   IconSend,
// } from "@tabler/icons-react";

// // ─── Easing ───────────────────────────────────────────────────────────────────

// const EASING = {
//   outCubic: [0.215, 0.61, 0.355, 1],
//   outQuart: [0.165, 0.84, 0.44, 1],
//   outQuint: [0.23, 1, 0.32, 1],
// } as const;

// // ─── Canned responses data ────────────────────────────────────────────────────

// const CANNED_RESPONSES = [
//   {
//     id: 1,
//     label: "Acknowledge & Investigate",
//     text: "Thanks for reaching out — we'll look into this right away.",
//   },
//   {
//     id: 2,
//     label: "Request Invoice Number",
//     text: "Could you share your invoice number so we can locate the charge?",
//   },
//   {
//     id: 3,
//     label: "Refund Confirmed",
//     text: "Refund processed — please allow 3–5 business days to reflect.",
//   }
// ];

// // ─── Stage type ───────────────────────────────────────────────────────────────

// type Stage = "idle" | "dropdown" | "selected" | "success";

// // ─── Slack icon ───────────────────────────────────────────────────────────────

// const SlackIcon = () => (
//   <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-5zM9 6a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5zm9 2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5zm-2 9a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5z" />
//   </svg>
// );

// // ─── Component ────────────────────────────────────────────────────────────────

// export const CannedResponseIllustration: React.FC = () => {
//   const [stage, setStage] = useState<Stage>("idle");
//   const [highlightedId, setHighlightedId] = useState<number | null>(null);
//   const [buttonClicked, setButtonClicked] = useState(false);
//   const [rowClicked, setRowClicked] = useState(false);

//   useEffect(() => {
//     let cancelled = false;

//     const run = async () => {
//       // ── STATE 1: Idle — let card sit ──────────────────────────────
//       await new Promise(r => setTimeout(r, 1800));
//       if (cancelled) return;

//       // Flash the canned reply button
//       setButtonClicked(true);
//       await new Promise(r => setTimeout(r, 320));
//       if (cancelled) return;
//       setButtonClicked(false);

//       // ── STATE 2: Dropdown opens ───────────────────────────────────
//       setStage("dropdown");
//       await new Promise(r => setTimeout(r, 600));
//       if (cancelled) return;

//       // Hover over row 1
//       setHighlightedId(1);
//       await new Promise(r => setTimeout(r, 900));
//       if (cancelled) return;

//       // Flash row click
//       setRowClicked(true);
//       await new Promise(r => setTimeout(r, 280));
//       if (cancelled) return;
//       setRowClicked(false);

//       // ── STATE 3: Selected — dropdown closes, reply appears ────────
//       setStage("selected");
//       setHighlightedId(null);
//       await new Promise(r => setTimeout(r, 500));
//       if (cancelled) return;

//       // ── STATE 4: Success bar slides in ────────────────────────────
//       setStage("success");
//       await new Promise(r => setTimeout(r, 2800));
//       if (cancelled) return;

//       // Reset everything
//       setStage("idle");
//     };

//     run();
//     return () => { cancelled = true; };
//   }, [stage === "idle" ? stage : null]); // re-run only when returning to idle

//   const selectedResponse = CANNED_RESPONSES[0];

//   return (
//     <div className="w-full flex flex-col items-center justify-center py-4 gap-0">

//       {/* ── Slack card ───────────────────────────────────────────────── */}
//       <div className="bg-white rounded-xl shadow-lg overflow-visible w-[340px] relative">

//         {/* Slack channel header */}
//         <div className="bg-[#4a154b] px-4 py-2.5 flex items-center gap-2 rounded-t-xl">
//           <div className="w-5 h-5 bg-white rounded flex items-center justify-center text-[#4a154b]">
//             <SlackIcon />
//           </div>
//           <span className="text-white/60 text-xs font-medium">#</span>
//           <span className="text-xs font-semibold text-white">support</span>
//           <div className="ml-auto flex items-center gap-1.5">
//             <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
//             <span className="text-white/40 text-[10px]">live</span>
//           </div>
//         </div>

//         {/* Message body */}
//         <div className="p-4">
//           <div className="flex items-start gap-3">

//             {/* Avatar */}
//             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-700 shrink-0 flex items-center justify-center">
//               <span className="text-[10px] font-bold text-white">SD</span>
//             </div>

//             <div className="flex-1 min-w-0">

//               {/* Sender + timestamp */}
//               <div className="flex items-baseline gap-2 mb-2">
//                 <span className="text-xs font-semibold text-neutral-900">SlackDesk</span>
//                 <span className="text-[10px] text-neutral-400">just now</span>
//               </div>

//               {/* Static message */}
//               <div className="space-y-1 text-[12px] text-neutral-700 font-schibsted leading-relaxed">
//                 <p>
//                   📧 New email to{" "}
//                   <span className="font-semibold text-neutral-900">support@company.com</span>
//                 </p>
//                 <p><span className="text-neutral-400">From:</span> customer@email.com</p>
//                 <p><span className="text-neutral-400">Subject:</span> Billing issue with last invoice</p>
//               </div>

//               {/* Snippet */}
//               <p className="mt-2 text-[11px] text-neutral-400 leading-relaxed border-l-2 border-neutral-200 pl-2">
//                 Hi, I was charged twice for my subscription this month...
//               </p>

//               {/* ── Sent reply block — slides in on selected/success ── */}
//               <AnimatePresence>
//                 {(stage === "selected" || stage === "success") && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0, marginTop: 0 }}
//                     animate={{ opacity: 1, height: "auto", marginTop: 10 }}
//                     exit={{ opacity: 0, height: 0, marginTop: 0 }}
//                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                     className="overflow-hidden"
//                   >
//                     <div className="bg-emerald-50 rounded-lg px-3 py-2 flex items-start gap-2">
//                       <IconCircleCheck size={14} stroke={2} className="text-emerald-600 mt-0.5 shrink-0" />
//                       <p className="text-[11px] text-emerald-800 font-schibsted leading-relaxed">
//                         <span className="font-semibold">Reply sent: </span>
//                         "{selectedResponse.text}"
//                       </p>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {/* Divider */}
//               <div className="mt-3 mb-3 border-t border-neutral-100" />

//               {/* ── Action row ─────────────────────────────────────── */}
//               <div className="flex items-center gap-2 relative">

//                 {/* Canned Reply button */}
//                 <motion.button
//                   animate={{ scale: buttonClicked ? 0.92 : 1 }}
//                   transition={{ duration: 0.15, ease: EASING.outQuart }}
//                   className={`
//                     inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md
//                     text-[11px] font-semibold text-white
//                     bg-sky-700 transition-colors duration-150
//                     ${buttonClicked ? "brightness-90" : ""}
//                   `}
//                 >
//                   <IconTemplate size={12} stroke={2} />
//                   Canned Reply
//                   <IconChevronUp size={11} stroke={2.5} className={`transition-transform duration-200 ${stage === "dropdown" ? "rotate-180" : ""}`} />
//                 </motion.button>

//                 <a className="text-[11px] text-sky-600 underline underline-offset-2 cursor-pointer">
//                   View thread
//                 </a>

//                 {/* ── Dropdown ──────────────────────────────────────── */}
//                 <AnimatePresence>
//                   {stage === "dropdown" && (
//                     <motion.div
//                       initial={{ opacity: 0, scale: 0.88, y: 6 }}
//                       animate={{ opacity: 1, scale: 1, y: 0 }}
//                       exit={{ opacity: 0, scale: 0.88, y: 6 }}
//                       transition={{ duration: 0.2, ease: EASING.outQuint }}
//                       style={{ transformOrigin: "bottom left" }}
//                       className="
//                         absolute bottom-[calc(100%+8px)] left-0
//                         w-[280px] bg-white rounded-xl
//                         shadow-xl ring-1 ring-neutral-200
//                         overflow-hidden z-50
//                       "
//                     >
//                       {/* Dropdown header */}
//                       <div className="px-3 py-2 border-b border-neutral-100 flex items-center gap-1.5">
//                         <IconTemplate size={12} stroke={2} className="text-neutral-400" />
//                         <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">
//                           Canned Responses
//                         </span>
//                       </div>

//                       {/* Rows */}
//                       {CANNED_RESPONSES.map((item) => {
//                         const isHighlighted = highlightedId === item.id;
//                         return (
//                           <motion.div
//                             key={item.id}
//                             animate={{
//                               backgroundColor: isHighlighted
//                                 ? (rowClicked ? "#e0f2fe" : "#f0f9ff")
//                                 : "#ffffff",
//                               scale: isHighlighted && rowClicked ? 0.98 : 1,
//                             }}
//                             transition={{ duration: 0.15 }}
//                             className="px-3 py-2.5 cursor-pointer border-b border-neutral-50 last:border-0"
//                           >
//                             <p className={`text-[11px] font-semibold mb-0.5 ${isHighlighted ? "text-sky-700" : "text-neutral-700"}`}>
//                               {item.label}
//                             </p>
//                             <p className="text-[10px] text-neutral-400 leading-relaxed line-clamp-1">
//                               {item.text}
//                             </p>
//                           </motion.div>
//                         );
//                       })}

//                       {/* Dropdown footer */}
//                       <div className="px-3 py-2 bg-neutral-50 border-t border-neutral-100 flex items-center gap-1.5">
//                         <IconSend size={11} stroke={2} className="text-neutral-300" />
//                         <span className="text-[10px] text-neutral-400">Select to send immediately</span>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Success bar — slides up below card ───────────────────────── */}
//       <AnimatePresence>
//         {stage === "success" && (
//           <motion.div
//             initial={{ opacity: 0, y: -8, height: 0 }}
//             animate={{ opacity: 1, y: 0, height: "auto" }}
//             exit={{ opacity: 0, y: -8, height: 0 }}
//             transition={{ duration: 0.32, ease: "easeOut" }}
//             className="overflow-hidden w-[340px]"
//           >
//             <div className="mt-2 bg-emerald-50 rounded-xl px-4 py-3 flex items-center gap-2.5">
//               <IconCircleCheck size={16} stroke={2} className="text-emerald-600 shrink-0" />
//               <div>
//                 <p className="text-[12px] font-semibold text-emerald-800 font-schibsted">
//                   Ticket resolved in 1.7 minutes
//                 </p>
//                 <p className="text-[10px] text-emerald-600 font-schibsted">
//                   Reply sent · Thread closed · Customer notified
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//     </div>
//   );
// };


'use client';

import { AnimatePresence, motion } from "motion/react";
import React, { useState, useEffect } from "react";
import {
  IconTemplate,
  IconCircleCheck,
  IconChevronUp,
  IconSend,
} from "@tabler/icons-react";

const EASING = {
  outCubic: [0.215, 0.61, 0.355, 1],
  outQuart: [0.165, 0.84, 0.44, 1],
  outQuint: [0.23, 1, 0.32, 1],
} as const;

const CANNED_RESPONSES = [
  {
    id: 1,
    label: "Acknowledge & Investigate",
    tag: "ACK",
    text: "Thanks for reaching out — we'll look into this right away.",
  },
  {
    id: 2,
    label: "Request Invoice Number",
    tag: "REQ",
    text: "Could you share your invoice number so we can locate the charge?",
  },
  {
    id: 3,
    label: "Refund Confirmed",
    tag: "RFD",
    text: "Refund processed — please allow 3–5 business days to reflect.",
  },
];

type Stage = "idle" | "dropdown" | "selected" | "success";

const SlackIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-5zM9 6a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5zm9 2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5zm-2 9a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5z" />
  </svg>
);

export const CannedResponseIllustration: React.FC = () => {
  const [stage, setStage] = useState<Stage>("idle");
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [rowClicked, setRowClicked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await new Promise(r => setTimeout(r, 1800));
      if (cancelled) return;

      setButtonClicked(true);
      await new Promise(r => setTimeout(r, 320));
      if (cancelled) return;
      setButtonClicked(false);

      setStage("dropdown");
      await new Promise(r => setTimeout(r, 600));
      if (cancelled) return;

      setHighlightedId(1);
      await new Promise(r => setTimeout(r, 900));
      if (cancelled) return;

      setRowClicked(true);
      await new Promise(r => setTimeout(r, 280));
      if (cancelled) return;
      setRowClicked(false);

      setStage("selected");
      setHighlightedId(null);
      await new Promise(r => setTimeout(r, 500));
      if (cancelled) return;

      setStage("success");
      await new Promise(r => setTimeout(r, 2800));
      if (cancelled) return;

      setStage("idle");
    };

    run();
    return () => { cancelled = true; };
  }, [stage === "idle" ? stage : null]);

  const selectedResponse = CANNED_RESPONSES[0];

  return (
    <div className="relative w-full overflow-hidden bg-neutral-50 border border-neutral-200 p-4 md:p-8 min-h-[340px] flex items-center justify-center">

      {/* Top-left badge */}
      <div className="absolute top-3 left-4 flex items-center gap-1.5">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-sky-800"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <span className="font-mono text-[9px] tracking-widest text-sky-800 uppercase">
          Canned Responses
        </span>
      </div>

      {/* Dot-grid background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.25]">
        <defs>
          <pattern id="canned-dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="#94a3b8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#canned-dots)" />
      </svg>

      {/* Card + success bar wrapper */}
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-0">

        <div className="font-mono text-[9px] tracking-widest text-neutral-700 uppercase mb-2">
          Slack Notification
        </div>

        {/* ── Slack card shell — static ── */}
        <div className="relative bg-white border border-neutral-200 overflow-visible">

          {/* Corner brackets */}
          <span className="absolute -top-px -left-px font-mono text-[8px] leading-none text-sky-800 select-none z-10">■</span>
          <span className="absolute -top-px -right-px font-mono text-[8px] leading-none text-sky-800 select-none z-10">■</span>
          <span className="absolute -bottom-px -left-px font-mono text-[8px] leading-none text-sky-800 select-none z-10">■</span>
          <span className="absolute -bottom-px -right-px font-mono text-[8px] leading-none text-sky-800 select-none z-10">■</span>

          {/* Slack header */}
          <div className="bg-sky-900 px-4 py-2.5 flex items-center gap-2.5">
            <div className="w-5 h-5 bg-white flex items-center justify-center text-sky-900 flex-shrink-0">
              <SlackIcon />
            </div>
            <span className="font-mono text-[9px] tracking-widest text-white uppercase">
              #support
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="font-mono text-[8px] tracking-widest text-white/60 uppercase">live</span>
            </div>
          </div>

          {/* Message body */}
          <div className="p-4">
            <div className="flex items-start gap-3">

              {/* Avatar — flat square */}
              <div className="w-7 h-7 bg-sky-800 flex-shrink-0 flex items-center justify-center">
                <span className="font-mono text-[9px] font-bold text-white">SD</span>
              </div>

              <div className="flex-1 min-w-0">

                {/* Sender + timestamp */}
                <div className="flex items-baseline gap-2 mb-2.5">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-sky-900">
                    SLACKDESK
                  </span>
                  <span className="font-mono text-[8px] text-neutral-300">just now</span>
                </div>

                {/* Static message fields */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[8px] tracking-wider text-neutral-400 uppercase w-12 flex-shrink-0">To:</span>
                    <span className="font-mono text-[10px] text-sky-900 font-bold">support@company.com</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[8px] tracking-wider text-neutral-400 uppercase w-12 flex-shrink-0">From:</span>
                    <span className="font-mono text-[10px] text-neutral-600">customer@email.com</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-mono text-[8px] tracking-wider text-neutral-400 uppercase w-12 flex-shrink-0 pt-px">Subj:</span>
                    <span className="font-mono text-[10px] text-neutral-600 leading-snug">Billing issue with last invoice</span>
                  </div>
                </div>

                {/* Snippet */}
                <div className="border-l-2 border-sky-200 pl-2.5 mb-3">
                  <p className="font-mono text-[9px] text-neutral-400 leading-relaxed line-clamp-2">
                    Hi, I was charged twice for my subscription this month...
                  </p>
                </div>

                {/* Sent reply block */}
                <AnimatePresence>
                  {(stage === "selected" || stage === "success") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 10 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-emerald-50 border border-emerald-200 px-3 py-2 flex items-start gap-2">
                        <IconCircleCheck size={12} stroke={2} className="text-emerald-600 mt-px flex-shrink-0" />
                        <p className="font-mono text-[9px] text-emerald-800 leading-relaxed">
                          <span className="font-bold tracking-wider uppercase">Reply sent: </span>
                          "{selectedResponse.text}"
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Divider */}
                <div className="border-t border-neutral-100 mb-3" />

                {/* Action row */}
                <div className="flex items-center gap-2.5 relative">

                  {/* Canned Reply button */}
                  <motion.button
                    animate={{ scale: buttonClicked ? 0.92 : 1 }}
                    transition={{ duration: 0.15, ease: EASING.outQuart }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-800 font-mono text-[9px] tracking-widest text-white uppercase cursor-pointer transition-colors duration-150 hover:bg-sky-900"
                  >
                    <IconTemplate size={11} stroke={2} />
                    Canned Reply
                    <IconChevronUp
                      size={10}
                      stroke={2.5}
                      className={`transition-transform duration-200 ${stage === "dropdown" ? "rotate-180" : ""}`}
                    />
                  </motion.button>

                  <span className="font-mono text-[9px] tracking-wider text-sky-700 uppercase cursor-pointer">
                    View thread →
                  </span>

                  {/* ── Dropdown ── */}
                  <AnimatePresence>
                    {stage === "dropdown" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 6 }}
                        transition={{ duration: 0.18, ease: EASING.outQuint }}
                        style={{ transformOrigin: "bottom left" }}
                        className="absolute bottom-[calc(100%+8px)] left-0 w-[280px] max-w-[calc(100vw-2rem)] bg-white border border-neutral-200 overflow-hidden z-50"
                      >
                        {/* Dropdown corner brackets */}
                        <span className="absolute -top-px -left-px font-mono text-[7px] leading-none text-sky-800 select-none z-10">■</span>
                        <span className="absolute -top-px -right-px font-mono text-[7px] leading-none text-sky-800 select-none z-10">■</span>
                        <span className="absolute -bottom-px -left-px font-mono text-[7px] leading-none text-sky-800 select-none z-10">■</span>
                        <span className="absolute -bottom-px -right-px font-mono text-[7px] leading-none text-sky-800 select-none z-10">■</span>

                        {/* Dropdown header */}
                        <div className="px-3 py-2 bg-sky-950 flex items-center gap-1.5">
                          <IconTemplate size={11} stroke={2} className="text-sky-400" />
                          <span className="font-mono text-[8px] tracking-widest text-neutral-100 uppercase">
                            Canned Responses
                          </span>
                        </div>

                        {/* Rows */}
                        {CANNED_RESPONSES.map((item) => {
                          const isHighlighted = highlightedId === item.id;
                          return (
                            <motion.div
                              key={item.id}
                              animate={{
                                backgroundColor: isHighlighted
                                  ? rowClicked ? "#e0f2fe" : "#f0f9ff"
                                  : "#ffffff",
                              }}
                              transition={{ duration: 0.12 }}
                              className="px-3 py-2.5 cursor-pointer border-b border-neutral-100 last:border-0"
                            >
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className={[
                                  "font-mono text-[8px] px-1 py-px border tracking-wider",
                                  isHighlighted
                                    ? "bg-sky-100 text-sky-800 border-sky-200"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200",
                                ].join(" ")}>
                                  {item.tag}
                                </span>
                                <p className={[
                                  "font-mono text-[9px] font-bold tracking-wide",
                                  isHighlighted ? "text-sky-800" : "text-neutral-700",
                                ].join(" ")}>
                                  {item.label}
                                </p>
                              </div>
                              <p className="font-mono text-[9px] text-neutral-400 leading-relaxed line-clamp-1 pl-px">
                                {item.text}
                              </p>
                            </motion.div>
                          );
                        })}

                        {/* Dropdown footer */}
                        <div className="px-3 py-2 bg-neutral-50 border-t border-neutral-100 flex items-center gap-1.5">
                          <IconSend size={10} stroke={2} className="text-neutral-300" />
                          <span className="font-mono text-[8px] tracking-wider text-neutral-400 uppercase">
                            Select to send immediately
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="bg-sky-950 border-t border-sky-900 px-4 py-1.5 flex items-center gap-3">
            <AnimatePresence mode="wait">
              <motion.span
                key={stage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="font-mono text-[8px] tracking-widest uppercase font-bold text-cyan-400"
              >
                {stage === "idle"     && "STATUS: READY"}
                {stage === "dropdown" && "STATUS: SELECTING"}
                {stage === "selected" && "STATUS: SENDING"}
                {stage === "success"  && "STATUS: SENT ✓"}
              </motion.span>
            </AnimatePresence>
            <span className="font-mono text-[8px] tracking-wider text-sky-700 ml-auto uppercase">
              #support ●
            </span>
          </div>
        </div>

        {/* ── Success bar — slides down below card ── */}
        <AnimatePresence>
          {stage === "success" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="mt-2 bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-center gap-2.5 relative">
                {/* Corner brackets on success bar */}
                <span className="absolute -top-px -left-px font-mono text-[7px] leading-none text-emerald-600 select-none">■</span>
                <span className="absolute -top-px -right-px font-mono text-[7px] leading-none text-emerald-600 select-none">■</span>
                <span className="absolute -bottom-px -left-px font-mono text-[7px] leading-none text-emerald-600 select-none">■</span>
                <span className="absolute -bottom-px -right-px font-mono text-[7px] leading-none text-emerald-600 select-none">■</span>
                <IconCircleCheck size={14} stroke={2} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-mono text-[9px] font-bold tracking-wider text-emerald-800 uppercase">
                    Ticket resolved in 1.7 minutes
                  </p>
                  <p className="font-mono text-[8px] tracking-wider text-emerald-600 uppercase mt-0.5">
                    Reply sent · Thread closed · Customer notified
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-2 font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
          Canned replies · Reply in seconds
        </div>
      </div>
    </div>
  );
};