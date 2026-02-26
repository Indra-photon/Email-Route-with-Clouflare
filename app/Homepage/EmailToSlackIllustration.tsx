// import React from "react";

// export const EmailToSlackIllustration: React.FC = () => {
//   return (
//     <div className="relative w-full h-full flex items-end justify-center pb-20"
//     style={{ 
//         transformStyle: "preserve-3d",
//         perspective: "800px" }}
//     >
//       {/* Email Card - Bottom Layer */}
//       <div 
//         className=" z-10 rotate-x-5 rotate-y-5 -translate-y-4"
//         aria-hidden="true"
//       >
//         <div className="bg-white rounded-2xl p-6 pb-16 pt-2 shadow-xl ring-1 ring-neutral-200/80">
//           {/* Email Header Fields */}
//           <div className="divide-y border-b border-neutral-200 text-xs *:flex *:h-10 *:items-center *:py-2">
//             {/* To Field */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-1">
//                 <span className="text-neutral-500">To:</span>
//                 <div className="flex cursor-pointer gap-1 rounded-full p-0.5 pr-2.5 bg-neutral-100 ring-1 ring-neutral-200 shadow-sm">
//                   <div className="relative size-4 overflow-hidden rounded-full border border-neutral-200">
//                     <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
//                   </div>
//                   <span className="text-xs font-medium text-neutral-900">support@domain.com</span>
//                 </div>
//               </div>
//               <div className="bg-neutral-100 flex size-6 rounded-full border border-neutral-200">
//                 <svg 
//                   xmlns="http://www.w3.org/2000/svg" 
//                   width="24" 
//                   height="24" 
//                   viewBox="0 0 24 24" 
//                   fill="none" 
//                   stroke="currentColor" 
//                   strokeWidth="3" 
//                   strokeLinecap="round" 
//                   strokeLinejoin="round" 
//                   className="m-auto size-3.5 text-neutral-600"
//                 >
//                   <path d="M5 12h14" />
//                   <path d="M12 5v14" />
//                 </svg>
//               </div>
//             </div>

//             {/* Subject Field */}
//             <div className="flex gap-1">
//               <span className="text-neutral-500">Payment successful but no booking</span>
//             </div>
//           </div>

//           {/* Email Body */}
//           <div className="text-neutral-600 mt-6 space-y-2 text-sm leading-6">
//             <p>Payment successful but no booking found. Please confirm my booking.</p>
//           </div>
//         </div>
//       </div>

//       {/* Slack Channel Card - Top Layer, Overlapping */}
//       <div 
//         className="absolute -bottom-15 right-4 z-20"
//         aria-hidden="true"
//       >
//         <div className="bg-white rounded-xl p-4 shadow-2xl ring-1 ring-neutral-200/80 min-w-[200px]">
//           {/* Slack Channel Header */}
//           <div className="flex items-center gap-2 mb-3">
//             {/* Slack Icon */}
//             <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
//               <svg 
//                 xmlns="http://www.w3.org/2000/svg" 
//                 width="14" 
//                 height="14" 
//                 viewBox="0 0 24 24" 
//                 fill="white"
//               >
//                 <path d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-5zM9 6a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5zm9 2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5zm-2 9a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5z"/>
//               </svg>
//             </div>
//             {/* Channel Name */}
//             <div className="flex items-center gap-1">
//               <span className="text-neutral-500 text-sm font-medium">#</span>
//               <span className="text-sm font-semibold text-neutral-900">billing</span>
//             </div>
//           </div>

//           {/* Message Preview */}
//           <div className="space-y-2">
//             <div className="flex items-start gap-2">
//               <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded" />
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-baseline gap-2 mb-1">
//                   <span className="text-xs font-semibold text-neutral-900">Support</span>
//                   <span className="text-xs text-neutral-400">2:34 PM</span>
//                 </div>
//                 <p className="text-xs text-neutral-600 leading-relaxed">
//                   New email received
//                 </p>
//               </div>
//             </div>

//             {/* Notification Badge */}
//             <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
//               <div className="flex-1 flex items-center gap-1.5">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
//                 <span className="text-xs text-neutral-500">Email routed</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



'use client';

import { AnimatePresence, motion } from "motion/react";
import React, { useState, useEffect } from "react";

const EASING = {
  inQuad: [0.55, 0.085, 0.68, 0.53],
  inCubic: [0.55, 0.055, 0.675, 0.19],
  inQuart: [0.895, 0.03, 0.685, 0.22],
  outQuad: [0.25, 0.46, 0.45, 0.94],
  outCubic: [0.215, 0.61, 0.355, 1],
  outQuart: [0.165, 0.84, 0.44, 1],
  outQuint: [0.23, 1, 0.32, 1],
  outExpo: [0.19, 1, 0.22, 1],
  inOutCubic: [0.645, 0.045, 0.355, 1],
  inOutQuart: [0.77, 0, 0.175, 1],
} as const;

export const EmailToSlackIllustration: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const [sendButtonClicked, setSendButtonClicked] = useState(false);
  const [showSlack, setShowSlack] = useState(false);
  
  const fullMessage = "Payment successful but no booking found. Please confirm my booking.";

  useEffect(() => {
    // Step 1: Start typing after 500ms
    const startTyping = setTimeout(() => {
      setShowCursor(true);
      let currentIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentIndex <= fullMessage.length) {
          setTypedText(fullMessage.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setShowCursor(false);
          
          // Step 2: Click send button after typing completes
          setTimeout(() => {
            setSendButtonClicked(true);
            
            // Step 3: Show Slack after send animation
            setTimeout(() => {
              setShowSlack(true);
            }, 400);
          }, 300);
        }
      }, 40); // Typing speed
      
      return () => clearInterval(typeInterval);
    }, 500);

    return () => clearTimeout(startTyping);
  }, []);

  return (
    <div 
      className="relative w-full h-full flex items-end justify-center pb-20"
      style={{ 
        transformStyle: "preserve-3d",
        perspective: "800px" 
      }}
    >
      {/* Email Card - Bottom Layer */}
      <div 
        aria-hidden="true"
        style={{
          transform: "rotateX(5deg) rotateY(5deg) translateY(-16px)"
        }}
        className="z-10"
      >
        <div className="mask-b-from-75%">
        <div className="bg-white rounded-2xl p-6 pb-16 pt-2 border border-neutral-200 w-[320px]">
          {/* Email Header Fields */}
          <div className="divide-y border-b border-neutral-200 text-xs *:flex *:h-10 *:items-center *:py-2">
            {/* To Field */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-neutral-500">To:</span>
                <div className="flex cursor-pointer gap-1 rounded-full p-0.5 pr-2.5 bg-neutral-100 ring-1 ring-neutral-200 shadow-sm">
                  <div className="relative size-4 overflow-hidden rounded-full border border-neutral-200">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
                  </div>
                  <span className="text-xs font-medium text-neutral-900">support@</span>
                </div>
              </div>
              <motion.div 
                className="bg-blue-500 hover:bg-blue-600 flex items-center justify-center w-16 h-6 rounded text-white text-xs font-medium cursor-pointer"
                animate={sendButtonClicked ? { scale: 0.85 } : { scale: 1 }}
                transition={{
                  duration: 0.15,
                  ease: EASING.outQuart,
                }}
              >
                Send
              </motion.div>
            </div>

            {/* Subject Field */}
            <div className="flex gap-1">
              <span className="text-neutral-500 text-xs">Subject: Booking Issue</span>
            </div>
          </div>

          {/* Email Body with Typed Text */}
          <div className="text-neutral-600 mt-6 space-y-2 text-sm leading-6">
            <p className="min-h-[60px]">
              {typedText}
              {showCursor && (
                <motion.span
                  className="inline-block w-0.5 h-4 bg-neutral-900 ml-0.5"
                  animate={{ opacity: [1, 0] }}
                  transition={{ 
                    duration: 0.8, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* Slack Channel Card - Slides up from bottom */}
      <motion.div 
        className="absolute bottom-0 right-4 z-20 w-[280px]"
        aria-hidden="true"
        initial={{ y: 0, z: 0, opacity: 0 }}
        animate={{ y: showSlack ? "0%" : "100%", z: showSlack ? 20 : 0, opacity: showSlack ? 1 : 0 }}
        transition={{
          duration: 0.6,
          ease: EASING.outQuart,
        }}
      >
        <div className="bg-white rounded-xl shadow-2xl ring-1 ring-neutral-200/80 overflow-hidden">
          {/* Slack Channel Header */}
          <div className="bg-[#4a154b] px-4 py-2 flex items-center gap-2">
            {/* Slack Icon */}
            <div className="flex-shrink-0 w-5 h-5 bg-white rounded flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="#4a154b"
              >
                <path d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-5zM9 6a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5zm9 2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5zm-2 9a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5z"/>
              </svg>
            </div>
            {/* Channel Name */}
            <div className="flex items-center gap-1">
              <span className="text-white/70 text-xs font-medium">#</span>
              <span className="text-xs font-semibold text-white">support</span>
            </div>
          </div>

          {/* Message Content */}
          <div className="p-4 bg-white">
            <motion.div 
              className="flex items-start gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showSlack ? 1 : 0, y: showSlack ? 0 : 10 }}
              transition={{
                duration: 0.4,
                delay: 0.3,
                ease: EASING.outCubic,
              }}
            >
              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[10px] text-neutral-400">just now</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed pb-3">
                    New email received: "Payment successful but no booking found. Please confirm my booking."
                </p>

                <button className="px-2 text-sm font-schibsted bg-blue-500 text-white rounded"> Claim ticket</button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};