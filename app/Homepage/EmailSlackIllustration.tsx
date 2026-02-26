

// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const emails = [
//   { id: 1, name: "Billing", email: "billing@domain.com", color: "cyan", channel: "billing" },
//   { id: 2, name: "Support", email: "support@domain.com", color: "green", channel: "support" },
//   { id: 3, name: "Sales", email: "sales@domain.com", color: "purple", channel: "sales" },
// ];

// export function EmailSlackIllustration() {
//   const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
//   const [showCursor, setShowCursor] = useState(false);
//   const [cursorClick, setCursorClick] = useState(false);
//   const [showSendIcon, setShowSendIcon] = useState(false);
//   const [blinkChannel, setBlinkChannel] = useState<string | null>(null);

//   const currentEmail = emails[currentEmailIndex];

//   useEffect(() => {
//     const sequence = async () => {
//       // Step 1: Show email content (0-0.5s)
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       // Step 2: Show cursor moving to email (0.5-0.8s)
//       setShowCursor(true);
//       await new Promise(resolve => setTimeout(resolve, 300));
      
//       // Step 3: Cursor clicks on email (0.8-1.1s)
//       setCursorClick(true);
//       await new Promise(resolve => setTimeout(resolve, 300));
      
//       // Step 4: Hide cursor, show send icon (1.1-1.2s)
//       setShowCursor(false);
//       setCursorClick(false);
//       await new Promise(resolve => setTimeout(resolve, 100));
      
//       // Step 5: Send icon travels to Slack (1.2-2.2s)
//       setShowSendIcon(true);
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Step 6: Blink Slack channel when icon arrives (2.2-2.8s)
//       setBlinkChannel(currentEmail.channel);
//       setShowSendIcon(false);
//       await new Promise(resolve => setTimeout(resolve, 600));
      
//       // Step 7: Reset and prepare for next (2.8-3s)
//       setBlinkChannel(null);
//       await new Promise(resolve => setTimeout(resolve, 200));
      
//       // Step 8: Move to next email
//       setCurrentEmailIndex((prev) => (prev + 1) % emails.length);
//     };

//     const interval = setInterval(sequence, 3500);
//     sequence(); // Start immediately

//     return () => clearInterval(interval);
//   }, [currentEmailIndex, currentEmail.channel]);

//   return (
//     <div className="relative flex min-h-[420px] w-full items-center justify-end">
//       {/* Content Layer */}
//       <div className="relative z-10 flex items-center gap-8 lg:gap-16">
//         {/* Left Side - Email Card Container (Fixed) */}
//         <div className="relative w-40 h-64">
//           {/* Fixed Email Card Container */}
//           <div className="absolute bottom-0 left-10 w-40 rounded-xl bg-white px-4 py-2 shadow-md ring-1 ring-neutral-200">
//             {/* Animated Content Inside */}
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={currentEmail.id}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="mb-2 flex items-center gap-2"
//               >
//                 <div>
//                   <div className="text-sm font-semibold text-neutral-900">{currentEmail.name}</div>
//                   <div className="text-[10px] text-neutral-500">{currentEmail.email}</div>
//                 </div>
//               </motion.div>
//             </AnimatePresence>
//           </div>

//           {/* Animated Cursor */}
//           <AnimatePresence>
//             {showCursor && (
//               <motion.div
//                 initial={{ opacity: 0, x: 20, y: 20 }}
//                 animate={{ opacity: 1, x: 0, y: 0 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="absolute bottom-0 left-36 pointer-events-none"
//               >
//                 <motion.svg
//                   width="20"
//                   height="20"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   className="text-neutral-900"
//                   animate={cursorClick ? { scale: [1, 0.8, 1] } : {}}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <path
//                     d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
//                     fill="currentColor"
//                     stroke="white"
//                     strokeWidth="1"
//                   />
//                 </motion.svg>

//                 {/* Click ripple effect */}
//                 {cursorClick && (
//                   <motion.div
//                     initial={{ scale: 0, opacity: 0.6 }}
//                     animate={{ scale: 2.5, opacity: 0 }}
//                     transition={{ duration: 0.4 }}
//                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-500/30"
//                   />
//                 )}
//               </motion.div>
//             )}
//           </AnimatePresence>


//           {/* Animated Send Icon with curved path */}
//           <AnimatePresence>
//             {showSendIcon && (
//               <motion.div
//                 initial={{ 
//                   x: 0, 
//                   y: 0,
//                   opacity: 1,
//                   scale: 1
//                 }}
//                 animate={{ 
//                   x: [0, 50, 200, 50],
//                   y: [0, -30, -20, 0],
//                 //   opacity: [0, 1, 1, 0],
//                 //   scale: [0.5, 1, 1, 0.8]
//                 }}
//                 transition={{ 
//                   duration: 0.9,
//                   ease: "easeInOut"
//                 }}
//                 className="absolute top-24 left-36 pointer-events-none"
//               >
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="text-cyan-600"
//                 >
//                   <line x1="22" y1="2" x2="11" y2="13"></line>
//                   <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
//                 </svg>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Right Side - Slack Mockup */}
//         <div className="w-80 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-neutral-200">
//           {/* Slack Header */}
//           <div className="bg-[#4a154b] px-4 py-3">
//             <div className="text-sm font-semibold text-white">Workspace</div>
//           </div>

//           {/* Slack Content */}
//           <div className="flex h-64">
//             {/* Sidebar */}
//             <div className="w-28 bg-[#3f0e40] p-3">
//               <div className="mb-2 text-[10px] font-medium text-neutral-400">Channels</div>
//               <div className="space-y-1">
//                 <motion.div
//                   animate={blinkChannel === "billing" ? {
//                     backgroundColor: ["#1164a3", "#2d8fd9", "#1164a3"],
//                     scale: [1, 1.08, 1],
//                   } : {}}
//                   transition={{ duration: 0.6, times: [0, 0.5, 1] }}
//                   className="rounded bg-[#1164a3] px-2 py-1 text-[11px] font-medium text-white"
//                 >
//                   # billing
//                 </motion.div>
//                 <motion.div
//                   animate={blinkChannel === "support" ? {
//                     backgroundColor: ["transparent", "#1164a3", "transparent"],
//                     scale: [1, 1.08, 1],
//                   } : {}}
//                   transition={{ duration: 0.6, times: [0, 0.5, 1] }}
//                   className="px-2 py-1 text-[11px] text-neutral-300"
//                 >
//                   # support
//                 </motion.div>
//                 <motion.div
//                   animate={blinkChannel === "sales" ? {
//                     backgroundColor: ["transparent", "#1164a3", "transparent"],
//                     scale: [1, 1.08, 1],
//                   } : {}}
//                   transition={{ duration: 0.6, times: [0, 0.5, 1] }}
//                   className="px-2 py-1 text-[11px] text-neutral-300"
//                 >
//                   # sales
//                 </motion.div>
//                 <div className="px-2 py-1 text-[11px] text-neutral-300"># general</div>
//               </div>
//             </div>

//             {/* Main Chat Area */}
//             <div className="flex-1 bg-white p-4">
//               <div className="mb-3 text-sm font-bold text-neutral-900"># billing</div>
              
//               {/* Messages */}
//               <div className="space-y-3">
//                 <div className="rounded-lg bg-neutral-50 p-2 ring-1 ring-neutral-200">
//                   <div className="mb-1 flex items-center gap-2">
//                     <div className="h-5 w-5 rounded bg-cyan-200"></div>
//                     <span className="text-[10px] font-semibold text-neutral-900">User</span>
//                   </div>
//                   <div className="space-y-1">
//                     <div className="h-1 w-full rounded-full bg-neutral-200"></div>
//                     <div className="h-1 w-4/5 rounded-full bg-neutral-200"></div>
//                   </div>
//                 </div>

//                 <div className="rounded-lg bg-neutral-50 p-2 ring-1 ring-neutral-200">
//                   <div className="mb-1 flex items-center gap-2">
//                     <div className="h-5 w-5 rounded bg-green-200"></div>
//                     <span className="text-[10px] font-semibold text-neutral-900">Support</span>
//                   </div>
//                   <div className="space-y-1">
//                     <div className="h-1 w-full rounded-full bg-neutral-200"></div>
//                     <div className="h-1 w-3/5 rounded-full bg-neutral-200"></div>
//                   </div>
//                 </div>
//               </div>
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
  { id: 1, name: "Billing", email: "billing@domain.com", channel: "billing" as Channel },
  { id: 2, name: "Support", email: "support@domain.com", channel: "support" as Channel },
  { id: 3, name: "Sales", email: "sales@domain.com", channel: "sales" as Channel }
];

function getCenter(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function EmailSlackIllustration() {
  const [index, setIndex] = useState(0);
  const [delta, setDelta] = useState<{ x: number; y: number } | null>(null);
  const [showSend, setShowSend] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [cursorClick, setCursorClick] = useState(false);
  const [blinkChannel, setBlinkChannel] = useState<Channel | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);

  const emailRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const channelRefs = {
    billing: useRef<HTMLDivElement>(null),
    support: useRef<HTMLDivElement>(null),
    sales: useRef<HTMLDivElement>(null),
  };

  const current = emails[index];

  useEffect(() => {
    const run = async () => {
      // Reset states
      setShowCursor(false);
      setCursorClick(false);
      setShowSend(false);
      setBlinkChannel(null);
      
      // Step 1: Wait for email to appear
      await new Promise(r => setTimeout(r, 800));

      // Step 2: Show cursor
      setShowCursor(true);
      await new Promise(r => setTimeout(r, 600));

      // Step 3: Cursor clicks
      setCursorClick(true);
      await new Promise(r => setTimeout(r, 400));

      // Step 4: Calculate path
      if (!emailRef.current || !channelRefs[current.channel].current) return;

      const cursorPos = cursorRef.current ? getCenter(cursorRef.current) : getCenter(emailRef.current);
    const to = getCenter(channelRefs[current.channel].current!);

    setCursorPosition({ x: cursorPos.x, y: cursorPos.y });

    setDelta({
    x: to.x - cursorPos.x,
    y: to.y - cursorPos.y,
    });

      // Step 5: Hide cursor, show send icon
      setShowCursor(false);
      setCursorClick(false);
      await new Promise(r => setTimeout(r, 100));

      setShowSend(true);
      await new Promise(r => setTimeout(r, 1500));

      // Step 6: Blink channel
      setBlinkChannel(current.channel);
      setShowSend(false);
      await new Promise(r => setTimeout(r, 800));

      // Step 7: Reset and next email
      setBlinkChannel(null);
      await new Promise(r => setTimeout(r, 500));
      setIndex(i => (i + 1) % emails.length);
    };

    run();
  }, [index, current.channel]);

  return (
    <div className="relative flex min-h-[420px] w-full items-center justify-end">
      <div className="flex flex-col gap-12 ">

        {/* EMAIL CARD */}
        <div className="relative w-40">
          <div
            ref={emailRef}
            className="rounded-xl bg-white px-4 py-3 shadow-md ring-1 ring-neutral-200"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-sm font-semibold">{current.name}</div>
                <div className="text-[10px] text-neutral-500">{current.email}</div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CURSOR */}
          <AnimatePresence>
            {showCursor && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                ref={cursorRef}
                className="absolute top-10 left-1/2 pointer-events-none z-20"
              >
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-neutral-900"
                  animate={cursorClick ? { scale: [1, 0.75, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <path
                    d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                    fill="currentColor"
                    stroke="white"
                    strokeWidth="1"
                  />
                </motion.svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SEND ICON (measured animation) */}
        <AnimatePresence>
          {showSend && delta && cursorPosition && (
            <motion.div
                className="fixed z-50 pointer-events-none"
                style={{ left: cursorPosition.x, top: cursorPosition.y }}
                initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: [0, delta.x * 0.9, delta.x],
                y: [0, delta.y - 40, delta.y],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-100"
                >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 6 10-6" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SLACK MOCK */}
        <div className="w-90 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-neutral-200">
          <div className="bg-[#4a154b] px-4 py-3 text-sm font-semibold text-white">
            Workspace
          </div>

          <div className="flex h-60">
            <div className="w-28 bg-[#3f0e40] p-3 space-y-1 relative">
            {/* Animated blue background */}
            <motion.div
                className="absolute rounded bg-[#1164a3] px-2 py-1 h-7"
                animate={{
                y: current.channel === "billing" ? 0 : current.channel === "support" ? 32 : 64,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ width: 'calc(100% - 24px)', left: 12, top: 12 }}
            />
            
            {/* Channel items (now without individual backgrounds) */}
            <motion.div
                ref={channelRefs.billing}
                animate={blinkChannel === "billing" ? {
                scale: [1, 1.08, 1],
                } : {}}
                transition={{ duration: 0.8 }}
                className="relative z-10 px-2 py-1 text-[11px] text-white"
            >
                # billing
            </motion.div>
            <motion.div
                ref={channelRefs.support}
                animate={blinkChannel === "support" ? {
                scale: [1, 1.08, 1],
                } : {}}
                transition={{ duration: 0.8 }}
                className="relative z-10 px-2 py-1 text-[11px] text-neutral-300"
            >
                # support
            </motion.div>
            <motion.div
                ref={channelRefs.sales}
                animate={blinkChannel === "sales" ? {
                scale: [1, 1.08, 1],
                } : {}}
                transition={{ duration: 0.8 }}
                className="relative z-10 px-2 py-1 text-[11px] text-neutral-300"
            >
                # sales
            </motion.div>
            </div>

            <div className="flex-1 bg-white p-4">
            <div className="mb-3 text-sm font-bold text-neutral-900">#{current.channel}</div>
            
            {/* Messages */}
            <div className="space-y-3">
                {/* Message 1 */}
                <div className="flex gap-2">
                <div className="h-6 w-6 rounded bg-cyan-400 flex-shrink-0"></div>
                <div>
                    <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-semibold text-neutral-900">John Davis</span>
                    <span className="text-[10px] text-neutral-500">2:47 PM</span>
                    </div>
                    <p className="text-xs text-neutral-700">
                    {current.channel === "billing" && "Can someone help me update our payment method?"}
                    {current.channel === "support" && "Customer reporting login issues on mobile app"}
                    {current.channel === "sales" && "New lead from enterprise demo yesterday"}
                    </p>
                </div>
                </div>

                {/* Message 2 */}
                <div className="flex gap-2">
                <div className="h-6 w-6 rounded bg-green-400 flex-shrink-0"></div>
                <div>
                    <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-semibold text-neutral-900">Sarah Chen</span>
                    <span className="text-[10px] text-neutral-500">2:48 PM</span>
                    </div>
                    <p className="text-xs text-neutral-700">
                    {current.channel === "billing" && "On it! I'll send you the link to update billing info"}
                    {current.channel === "support" && "Looking into it now. Which device?"}
                    {current.channel === "sales" && "Great! I'll follow up with them today"}
                    </p>
                </div>
                </div>

                {/* Message 3 - Typing indicator or quick reply */}
                <div className="flex gap-2">
                <div className="h-6 w-6 rounded bg-purple-400 flex-shrink-0"></div>
                <div>
                    <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-semibold text-neutral-900">Mike Wilson</span>
                    <span className="text-[10px] text-neutral-500">2:49 PM</span>
                    </div>
                    <p className="text-xs text-neutral-700">
                    {current.channel === "billing" && "Thanks! Our card expires next month anyway"}
                    {current.channel === "support" && "iPhone 14 Pro, iOS 17.2"}
                    {current.channel === "sales" && "They mentioned needing 50+ seats 🎉"}
                    </p>
                </div>
                </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}