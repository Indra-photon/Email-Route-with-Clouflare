
// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// type Channel = "billing" | "support" | "sales";

// const emails = [
//   { id: 1, name: "Billing", email: "billing@domain.com", channel: "billing" as Channel },
//   { id: 2, name: "Support", email: "support@domain.com", channel: "support" as Channel },
//   { id: 3, name: "Sales", email: "sales@domain.com", channel: "sales" as Channel }
// ];

// function getCenter(el: HTMLElement) {
//   const rect = el.getBoundingClientRect();
//   return {
//     x: rect.left + rect.width / 2,
//     y: rect.top + rect.height / 2,
//   };
// }

// export function EmailSlackIllustration() {
//   const [index, setIndex] = useState(0);
//   const [delta, setDelta] = useState<{ x: number; y: number } | null>(null);
//   const [showSend, setShowSend] = useState(false);
//   const [showCursor, setShowCursor] = useState(false);
//   const [cursorClick, setCursorClick] = useState(false);
//   const [blinkChannel, setBlinkChannel] = useState<Channel | null>(null);
//   const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);

//   const emailRef = useRef<HTMLDivElement>(null);
//   const cursorRef = useRef<HTMLDivElement>(null);
//   const channelRefs = {
//     billing: useRef<HTMLDivElement>(null),
//     support: useRef<HTMLDivElement>(null),
//     sales: useRef<HTMLDivElement>(null),
//   };

//   const current = emails[index];

//   useEffect(() => {
//     const run = async () => {
//       // Reset states
//       setShowCursor(false);
//       setCursorClick(false);
//       setShowSend(false);
//       setBlinkChannel(null);
      
//       // Step 1: Wait for email to appear
//       await new Promise(r => setTimeout(r, 800));

//       // Step 2: Show cursor
//       setShowCursor(true);
//       await new Promise(r => setTimeout(r, 600));

//       // Step 3: Cursor clicks
//       setCursorClick(true);
//       await new Promise(r => setTimeout(r, 400));

//       // Step 4: Calculate path
//       if (!emailRef.current || !channelRefs[current.channel].current) return;

//       const cursorPos = cursorRef.current ? getCenter(cursorRef.current) : getCenter(emailRef.current);
//     const to = getCenter(channelRefs[current.channel].current!);

//     setCursorPosition({ x: cursorPos.x, y: cursorPos.y });

//     setDelta({
//     x: to.x - cursorPos.x,
//     y: to.y - cursorPos.y,
//     });

//       // Step 5: Hide cursor, show send icon
//       setShowCursor(false);
//       setCursorClick(false);
//       await new Promise(r => setTimeout(r, 100));

//       setShowSend(true);
//       await new Promise(r => setTimeout(r, 1500));

//       // Step 6: Blink channel
//       setBlinkChannel(current.channel);
//       setShowSend(false);
//       await new Promise(r => setTimeout(r, 800));

//       // Step 7: Reset and next email
//       setBlinkChannel(null);
//       await new Promise(r => setTimeout(r, 500));
//       setIndex(i => (i + 1) % emails.length);
//     };

//     run();
//   }, [index, current.channel]);

//   return (
//     <div className="relative flex min-h-[420px] w-full items-center justify-end">
//       <div className="flex flex-col gap-12 ">

//         {/* EMAIL CARD */}
//         <div className="relative w-40">
//           <div
//             ref={emailRef}
//             className="rounded-xl bg-white px-4 py-3 shadow-md ring-1 ring-neutral-200"
//           >
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={current.id}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.4 }}
//               >
//                 <div className="text-sm font-semibold">{current.name}</div>
//                 <div className="text-[10px] text-neutral-500">{current.email}</div>
//               </motion.div>
//             </AnimatePresence>
//           </div>

//           {/* CURSOR */}
//           <AnimatePresence>
//             {showCursor && (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.5 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 ref={cursorRef}
//                 className="absolute top-10 left-1/2 pointer-events-none z-20"
//               >
//                 <motion.svg
//                   width="20"
//                   height="20"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   className="text-neutral-900"
//                   animate={cursorClick ? { scale: [1, 0.75, 1] } : {}}
//                   transition={{ duration: 0.4 }}
//                 >
//                   <path
//                     d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
//                     fill="currentColor"
//                     stroke="white"
//                     strokeWidth="1"
//                   />
//                 </motion.svg>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* SEND ICON (measured animation) */}
//         <AnimatePresence>
//           {showSend && delta && cursorPosition && (
//             <motion.div
//                 className="fixed z-50 pointer-events-none"
//                 style={{ left: cursorPosition.x, top: cursorPosition.y }}
//                 initial={{ x: 0, y: 0, opacity: 1 }}
//               animate={{
//                 x: [0, delta.x * 0.9, delta.x],
//                 y: [0, delta.y - 40, delta.y],
//                 opacity: [1, 1, 0],
//               }}
//               transition={{ duration: 1.5, ease: "easeInOut" }}
//             >
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="text-neutral-100"
//                 >
//                 <rect x="2" y="4" width="20" height="16" rx="2" />
//                 <path d="m2 7 10 6 10-6" />
//               </svg>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* SLACK MOCK */}
//         <div className="w-90 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-neutral-200">
//           <div className="bg-[#4a154b] px-4 py-3 text-sm font-semibold text-white">
//             Workspace
//           </div>

//           <div className="flex h-60">
//             <div className="w-28 bg-[#3f0e40] p-3 space-y-1 relative">
//             {/* Animated blue background */}
//             <motion.div
//                 className="absolute rounded bg-[#1164a3] px-2 py-1 h-7"
//                 animate={{
//                 y: current.channel === "billing" ? 0 : current.channel === "support" ? 32 : 64,
//                 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                 style={{ width: 'calc(100% - 24px)', left: 12, top: 12 }}
//             />
            
//             {/* Channel items (now without individual backgrounds) */}
//             <motion.div
//                 ref={channelRefs.billing}
//                 animate={blinkChannel === "billing" ? {
//                 scale: [1, 1.08, 1],
//                 } : {}}
//                 transition={{ duration: 0.8 }}
//                 className="relative z-10 px-2 py-1 text-[11px] text-white"
//             >
//                 # billing
//             </motion.div>
//             <motion.div
//                 ref={channelRefs.support}
//                 animate={blinkChannel === "support" ? {
//                 scale: [1, 1.08, 1],
//                 } : {}}
//                 transition={{ duration: 0.8 }}
//                 className="relative z-10 px-2 py-1 text-[11px] text-neutral-300"
//             >
//                 # support
//             </motion.div>
//             <motion.div
//                 ref={channelRefs.sales}
//                 animate={blinkChannel === "sales" ? {
//                 scale: [1, 1.08, 1],
//                 } : {}}
//                 transition={{ duration: 0.8 }}
//                 className="relative z-10 px-2 py-1 text-[11px] text-neutral-300"
//             >
//                 # sales
//             </motion.div>
//             </div>

//             <div className="flex-1 bg-white p-4">
//             <div className="mb-3 text-sm font-bold text-neutral-900">#{current.channel}</div>
            
//             {/* Messages */}
//             <div className="space-y-3">
//                 {/* Message 1 */}
//                 <div className="flex gap-2">
//                 <div className="h-6 w-6 rounded bg-cyan-400 flex-shrink-0"></div>
//                 <div>
//                     <div className="flex items-baseline gap-2 mb-1">
//                     <span className="text-xs font-semibold text-neutral-900">John Davis</span>
//                     <span className="text-[10px] text-neutral-500">2:47 PM</span>
//                     </div>
//                     <p className="text-xs text-neutral-700">
//                     {current.channel === "billing" && "Can someone help me update our payment method?"}
//                     {current.channel === "support" && "Customer reporting login issues on mobile app"}
//                     {current.channel === "sales" && "New lead from enterprise demo yesterday"}
//                     </p>
//                 </div>
//                 </div>

//                 {/* Message 2 */}
//                 <div className="flex gap-2">
//                 <div className="h-6 w-6 rounded bg-green-400 flex-shrink-0"></div>
//                 <div>
//                     <div className="flex items-baseline gap-2 mb-1">
//                     <span className="text-xs font-semibold text-neutral-900">Sarah Chen</span>
//                     <span className="text-[10px] text-neutral-500">2:48 PM</span>
//                     </div>
//                     <p className="text-xs text-neutral-700">
//                     {current.channel === "billing" && "On it! I'll send you the link to update billing info"}
//                     {current.channel === "support" && "Looking into it now. Which device?"}
//                     {current.channel === "sales" && "Great! I'll follow up with them today"}
//                     </p>
//                 </div>
//                 </div>

//                 {/* Message 3 - Typing indicator or quick reply */}
//                 <div className="flex gap-2">
//                 <div className="h-6 w-6 rounded bg-purple-400 flex-shrink-0"></div>
//                 <div>
//                     <div className="flex items-baseline gap-2 mb-1">
//                     <span className="text-xs font-semibold text-neutral-900">Mike Wilson</span>
//                     <span className="text-[10px] text-neutral-500">2:49 PM</span>
//                     </div>
//                     <p className="text-xs text-neutral-700">
//                     {current.channel === "billing" && "Thanks! Our card expires next month anyway"}
//                     {current.channel === "support" && "iPhone 14 Pro, iOS 17.2"}
//                     {current.channel === "sales" && "They mentioned needing 50+ seats 🎉"}
//                     </p>
//                 </div>
//                 </div>
//             </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Channel = "billing" | "support" | "sales";

const emails = [
  { id: 1, label: "BILLING", address: "billing@domain.com", channel: "billing" as Channel, tag: "INV" },
  { id: 2, label: "SUPPORT", address: "support@domain.com", channel: "support" as Channel, tag: "REQ" },
  { id: 3, label: "SALES",   address: "sales@domain.com",   channel: "sales"   as Channel, tag: "OPP" },
];

const channelMessages: Record<Channel, { sender: string; text: string; time: string }[]> = {
  billing: [
    { sender: "J.DAVIS",  text: "Need to update payment method",  time: "14:41" },
    { sender: "S.CHEN",   text: "Sending billing portal link now", time: "14:42" },
    { sender: "M.WILSON", text: "Card expires end of month",       time: "14:43" },
  ],
  support: [
    { sender: "J.DAVIS",  text: "Login issues on mobile app",     time: "14:41" },
    { sender: "S.CHEN",   text: "Which device + OS version?",     time: "14:42" },
    { sender: "M.WILSON", text: "iPhone 14 Pro, iOS 17.2",        time: "14:43" },
  ],
  sales: [
    { sender: "J.DAVIS",  text: "Enterprise demo follow-up",      time: "14:41" },
    { sender: "S.CHEN",   text: "Following up with them today",    time: "14:42" },
    { sender: "M.WILSON", text: "They need 50+ seats",            time: "14:43" },
  ],
};

const avatarColors: Record<string, string> = {
  "J.DAVIS":  "bg-sky-100 text-sky-700 border-sky-200",
  "S.CHEN":   "bg-cyan-100 text-cyan-700 border-cyan-200",
  "M.WILSON": "bg-sky-50  text-sky-600 border-sky-100",
};

function getCenter(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

export function EmailSlackIllustration() {
  const [index, setIndex]                 = useState(0);
  const [showArrow, setShowArrow]         = useState(false);
  const [arrowPath, setArrowPath]         = useState("");
  const [arrowOrigin, setArrowOrigin]     = useState({ x: 0, y: 0 });
  const [blinkChannel, setBlinkChannel]   = useState<Channel | null>(null);
  const [activeChannel, setActiveChannel] = useState<Channel>("billing");
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorClicked, setCursorClicked] = useState(false);

  const emailRef     = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const channelRefs: Record<Channel, React.RefObject<HTMLDivElement | null>> = {
    billing: useRef<HTMLDivElement>(null),
    support: useRef<HTMLDivElement>(null),
    sales:   useRef<HTMLDivElement>(null),
  };

  const current = emails[index];

  useEffect(() => {
    const run = async () => {
      setShowArrow(false);
      setBlinkChannel(null);
      setCursorVisible(false);
      setCursorClicked(false);

      await new Promise(r => setTimeout(r, 700));
      setCursorVisible(true);
      await new Promise(r => setTimeout(r, 500));
      setCursorClicked(true);
      await new Promise(r => setTimeout(r, 300));
      setCursorClicked(false);

      if (!emailRef.current || !channelRefs[current.channel].current || !containerRef.current) return;

      const cRect = containerRef.current.getBoundingClientRect();
      const fRect = emailRef.current.getBoundingClientRect();
      const tRect = channelRefs[current.channel].current!.getBoundingClientRect();

      const fx = fRect.right  - cRect.left;
      const fy = fRect.top + fRect.height / 2 - cRect.top;
      const tx = tRect.left   - cRect.left;
      const ty = tRect.top + tRect.height / 2 - cRect.top;

      const cx1 = fx + (tx - fx) * 0.55;
      const cy1 = fy - 28;
      const cx2 = fx + (tx - fx) * 0.45;
      const cy2 = ty;

      setArrowOrigin({ x: fx, y: fy });
      setArrowPath(`M ${fx} ${fy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`);
      setCursorVisible(false);
      setShowArrow(true);

      await new Promise(r => setTimeout(r, 900));
      setActiveChannel(current.channel);
      setBlinkChannel(current.channel);
      await new Promise(r => setTimeout(r, 800));
      setShowArrow(false);
      setBlinkChannel(null);
      await new Promise(r => setTimeout(r, 500));
      setIndex(i => (i + 1) % emails.length);
    };
    run();
  }, [index]);

  const channels: Channel[] = ["billing", "support", "sales"];

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center justify-between gap-8 overflow-hidden bg-neutral-50 border border-neutral-200 p-8 min-h-[400px]"
    >
      {/* Top-left label */}
      <div className="absolute top-3 left-4 flex items-center gap-1.5">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-sky-800"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <span className="font-mono text-[9px] tracking-widest text-sky-800 uppercase">
          Smart Routing
        </span>
      </div>

      {/* Dot-grid background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.25]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="#94a3b8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Arrow SVG overlay */}
      <AnimatePresence>
        {showArrow && arrowPath && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <marker
                id="tip"
                viewBox="0 0 10 10"
                refX="8" refY="5"
                markerWidth="5" markerHeight="5"
                orient="auto"
              >
                <path
                  d="M1 1L9 5L1 9"
                  fill="none"
                  stroke="#0c4a6e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </marker>
            </defs>

            {/* Origin dot */}
            <motion.circle
              cx={arrowOrigin.x}
              cy={arrowOrigin.y}
              r="3.5"
              fill="#0c4a6e"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Path draws itself */}
            <motion.path
              d={arrowPath}
              fill="none"
              stroke="#0c4a6e"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="400"
              strokeDashoffset="400"
              markerEnd="url(#tip)"
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.65, ease: "easeInOut" }}
            />
          </svg>
        )}
      </AnimatePresence>

      {/* ── LEFT: EMAIL CARD ── */}
      <div className="relative z-10 flex-shrink-0 w-52">
        <div className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase mb-2">
          Inbound Email
        </div>

        <div ref={emailRef} className="relative bg-white border border-neutral-200 p-4">
          {/* Corner brackets — sky brand color */}
          <span className="absolute -top-px -left-px font-mono text-[8px] leading-none text-sky-800 select-none">■</span>
          <span className="absolute -top-px -right-px font-mono text-[8px] leading-none text-sky-800 select-none">■</span>
          <span className="absolute -bottom-px -left-px font-mono text-[8px] leading-none text-sky-800 select-none">■</span>
          <span className="absolute -bottom-px -right-px font-mono text-[8px] leading-none text-sky-800 select-none">■</span>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {/* Tag + label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[9px] tracking-wider bg-sky-800 text-white px-1.5 py-0.5">
                  {current.tag}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-sky-900 font-bold uppercase">
                  {current.label}
                </span>
              </div>

              <div className="border-t border-neutral-100 mb-3" />

              <div className="font-mono text-[8px] tracking-widest text-neutral-400 uppercase mb-1">To:</div>
              <div className="font-mono text-[10px] text-sky-900 tracking-tight">{current.address}</div>

              {/* Cursor */}
              <AnimatePresence>
                {cursorVisible && (
                  <motion.div
                    className="absolute bottom-3 right-3 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.svg
                      width="13" height="13" viewBox="0 0 24 24"
                      animate={cursorClicked ? { scale: [1, 0.65, 1] } : {}}
                      transition={{ duration: 0.25 }}
                    >
                      <path
                        d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                        fill="#0c4a6e"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                    </motion.svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pulsing status */}
        <div className="mt-2 flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-sky-700 inline-block"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          Status: Routing...
        </div>
      </div>

      {/* ── RIGHT: SLACK MOCK ── */}
      <div className="relative z-10 flex-1 max-w-sm">
        <div className="font-mono text-[9px] tracking-widest text-neutral-700 uppercase mb-2">
          Slack Workspace
        </div>

        <div className="relative bg-white border border-neutral-200 overflow-hidden">
          {/* Corner brackets */}
          <span className="absolute -top-px -left-px font-mono text-[8px] leading-none text-sky-800 z-10 select-none">■</span>
          <span className="absolute -top-px -right-px font-mono text-[8px] leading-none text-sky-800 z-10 select-none">■</span>
          <span className="absolute -bottom-px -left-px font-mono text-[8px] leading-none text-sky-800 z-10 select-none">■</span>
          <span className="absolute -bottom-px -right-px font-mono text-[8px] leading-none text-sky-800 z-10 select-none">■</span>

          {/* Title bar — sky-900 brand */}
          <div className="bg-sky-900 px-4 py-2.5 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 border border-white" />
              <div className="w-2 h-2 border border-white" />
              <div className="w-2 h-2 border border-white" />
            </div>
            <span className="font-mono text-[9px] tracking-widest text-white uppercase ml-2">
              Workspace
            </span>
          </div>

          {/* Body */}
          <div className="flex h-56">

            {/* Sidebar — sky-950 */}
            <div className="w-[108px] bg-sky-950 border-r border-sky-900 py-3 flex-shrink-0">
              <div className="font-mono text-[8px] tracking-widest text-neutral-100 uppercase px-3 mb-2">
                Channels
              </div>
              {channels.map(ch => {
                const isActive = activeChannel === ch;
                const isBlink  = blinkChannel === ch;
                return (
                  <motion.div
                    key={ch}
                    ref={channelRefs[ch]}
                    animate={isBlink ? { x: [0, 3, -2, 2, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={[
                      "relative px-3 py-1.5 font-mono text-[10px] tracking-wider transition-all duration-200 border-l-2",
                      isActive
                        ? "bg-sky-800 text-white border-cyan-400 font-bold"
                        : "text-neutral-200 border-transparent",
                    ].join(" ")}
                  >
                    #{ch.toUpperCase()}
                    {isBlink && (
                      <motion.span
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                        transition={{ duration: 0.8 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Message pane */}
            <div className="flex-1 p-4 bg-white overflow-hidden">
              {/* Channel header */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2 mb-3">
                <span className="font-mono text-[10px] font-bold tracking-widest text-sky-900 uppercase">
                  #{activeChannel}
                </span>
                <span className="font-mono text-[8px] tracking-wider text-neutral-300 uppercase">
                  3 members
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeChannel}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-2.5"
                >
                  {channelMessages[activeChannel].map((msg, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className={[
                        "w-5 h-5 flex-shrink-0 flex items-center justify-center border font-mono text-[7px] font-bold",
                        avatarColors[msg.sender] ?? "bg-neutral-100 text-neutral-500 border-neutral-200",
                      ].join(" ")}>
                        {msg.sender[0]}
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="font-mono text-[8px] font-bold tracking-wider text-sky-900">
                            {msg.sender}
                          </span>
                          <span className="font-mono text-[8px] text-neutral-300">{msg.time}</span>
                        </div>
                        <p className="font-mono text-[10px] text-neutral-600 leading-snug">{msg.text}</p>
                      </div>
                    </div>
                  ))}

                  {/* Route indicator */}
                  <AnimatePresence>
                    {blinkChannel === activeChannel && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 pt-2 border-t border-sky-100"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        <span className="font-mono text-[8px] tracking-widest text-cyan-600 uppercase">
                          New message routed
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Status bar — sky-950 */}
          <div className="bg-sky-950 border-t border-sky-900 px-4 py-1.5 flex items-center gap-4">
            {channels.map(ch => (
              <span
                key={ch}
                className={[
                  "font-mono text-[8px] tracking-wider uppercase transition-all duration-300",
                  activeChannel === ch ? "text-cyan-400 font-bold" : "text-sky-700",
                ].join(" ")}
              >
                #{ch} {activeChannel === ch ? "●" : "○"}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-2 font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
          Auto-routed · No manual sorting
        </div>
      </div>
    </div>
  );
}