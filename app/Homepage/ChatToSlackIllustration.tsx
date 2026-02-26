// 'use client';

// import { motion } from "motion/react";
// import React, { useState, useEffect } from "react";

// const EASING = {
//   inQuad: [0.55, 0.085, 0.68, 0.53],
//   inCubic: [0.55, 0.055, 0.675, 0.19],
//   inQuart: [0.895, 0.03, 0.685, 0.22],
//   outQuad: [0.25, 0.46, 0.45, 0.94],
//   outCubic: [0.215, 0.61, 0.355, 1],
//   outQuart: [0.165, 0.84, 0.44, 1],
//   outQuint: [0.23, 1, 0.32, 1],
//   outExpo: [0.19, 1, 0.22, 1],
//   inOutCubic: [0.645, 0.045, 0.355, 1],
//   inOutQuart: [0.77, 0, 0.175, 1],
// } as const;

// export const ChatToSlackIllustration: React.FC = () => {
//   const [widgetOpen, setWidgetOpen] = useState(false);
//   const [typedText, setTypedText] = useState("");
//   const [showCursor, setShowCursor] = useState(false);
//   const [messageSent, setMessageSent] = useState(false);
//   const [sendClicked, setSendClicked] = useState(false);
//   const [showSlack, setShowSlack] = useState(false);
//   const [agentTyping, setAgentTyping] = useState(false);

//   const fullMessage = "Hi, I need help with my order";

//   useEffect(() => {
//     // Step 1: Open chat widget
//     const openWidget = setTimeout(() => {
//       setWidgetOpen(true);

//       // Step 2: Start typing after widget opens
//       setTimeout(() => {
//         setShowCursor(true);
//         let currentIndex = 0;

//         const typeInterval = setInterval(() => {
//           if (currentIndex <= fullMessage.length) {
//             setTypedText(fullMessage.slice(0, currentIndex));
//             currentIndex++;
//           } else {
//             clearInterval(typeInterval);
//             setShowCursor(false);

//             // Step 3: Send message
//             setTimeout(() => {
//               setSendClicked(true);

//               setTimeout(() => {
//                 setMessageSent(true);
//                 setTypedText("");
//                 setSendClicked(false);

//                 // Step 4: Show Slack notification
//                 setTimeout(() => {
//                   setShowSlack(true);

//                   // Step 5: Show agent typing
//                   setTimeout(() => {
//                     setAgentTyping(true);
//                   }, 800);
//                 }, 400);
//               }, 300);
//             }, 300);
//           }
//         }, 50); // Typing speed

//         return () => clearInterval(typeInterval);
//       }, 600);
//     }, 500);

//     return () => clearTimeout(openWidget);
//   }, []);

//   return (
//     <div
//       className="relative w-full h-full flex items-end justify-center pb-20"
//       style={{
//         transformStyle: "preserve-3d",
//         perspective: "800px",
//       }}
//     >
//       {/* Chat Widget - Bottom Layer */}
//       <div
//         aria-hidden="true"
//         style={{
//           transform: " translateY(-16px)",
//         }}
//         className="z-10 mask-b-from-95%"
//       >
//         <motion.div
//           className="bg-gradient-to-br from-sky-500 to-purple-500 rounded-2xl shadow-xl ring-1 ring-neutral-200/80 w-[300px] overflow-hidden"
//           initial={{ height: 56 }}
//           animate={{ height: widgetOpen ? 320 : 56 }}
//           transition={{
//             duration: 0.5,
//             ease: EASING.outQuart,
//           }}
//         >
//           {/* Chat Header */}
//           <div className=" px-4 py-3 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="18"
//                   height="18"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="text-sky-600"
//                 >
//                   <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="text-sm font-semibold text-white">Chat with us</h3>
//                 <div className="flex items-center gap-1">
//                   <div className="w-2 h-2 bg-green-400 rounded-full" />
//                   <span className="text-xs text-white/80">Online</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Chat Messages Area */}
//           <motion.div
//             className="bg-white p-4 space-y-3"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: widgetOpen ? 1 : 0 }}
//             transition={{ duration: 0.3, delay: 0.3 }}
//             style={{ height: "200px" }}
//           >
//             {/* Welcome message */}
//             <div className="flex items-start gap-2">
//               <div className="w-6 h-6 bg-gradient-to-br from-sky-400 to-purple-400 rounded-full flex-shrink-0" />
//               <div className="bg-neutral-100 rounded-lg rounded-tl-none px-3 py-2">
//                 <p className="text-xs text-neutral-700">
//                   Hi! How can we help you today?
//                 </p>
//               </div>
//             </div>

//             {/* Sent message */}
//             {messageSent && (
//               <motion.div
//                 className="flex items-start gap-2 justify-end"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3, ease: EASING.outCubic }}
//               >
//                 <div className="bg-sky-500 rounded-lg rounded-tr-none px-3 py-2">
//                   <p className="text-xs text-white">{fullMessage}</p>
//                 </div>
//                 <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex-shrink-0" />
//               </motion.div>
//             )}
//           </motion.div>

//           {/* Input Area */}
//           <motion.div
//             className="bg-white border-t border-neutral-200 p-3 flex items-center gap-2"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: widgetOpen ? 1 : 0 }}
//             transition={{ duration: 0.3, delay: 0.3 }}
//           >
//             <div className="flex-1 bg-neutral-100 rounded-lg px-3 py-2 flex items-center min-h-[36px]">
//               <span className="text-xs text-neutral-700">{typedText}</span>
//               {showCursor && (
//                 <motion.span
//                   className="inline-block w-0.5 h-3 bg-neutral-900 ml-0.5"
//                   animate={{ opacity: [1, 0] }}
//                   transition={{
//                     duration: 0.8,
//                     repeat: Infinity,
//                     ease: "linear",
//                   }}
//                 />
//               )}
//               {!typedText && !showCursor && (
//                 <span className="text-xs text-neutral-400">Type a message...</span>
//               )}
//             </div>
//             <motion.button
//               className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center flex-shrink-0"
//               animate={sendClicked ? { scale: 0.85 } : { scale: 1 }}
//               transition={{
//                 duration: 0.15,
//                 ease: EASING.outQuart,
//               }}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="white"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <line x1="22" y1="2" x2="11" y2="13" />
//                 <polygon points="22 2 15 22 11 13 2 9 22 2" />
//               </svg>
//             </motion.button>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Slack Notification - Top Layer */}
//       <motion.div
//         className="absolute bottom-0 right-4 z-20 w-[320px]"
//         aria-hidden="true"
//         initial={{ y: "100%", opacity: 0 }}
//         animate={{
//           y: showSlack ? "0%" : "100%",
//           opacity: showSlack ? 1 : 0,
//         }}
//         transition={{
//           duration: 0.6,
//           ease: EASING.outExpo,
//         }}
//         style={{ translateZ: "50px" }}
//       >
//         <div className="bg-white rounded-xl shadow-2xl ring-1 ring-neutral-200/80 overflow-hidden">
//           {/* Slack Header */}
//           <div className="bg-[#4a154b] px-4 py-2 flex items-center gap-2">
//             <div className="flex-shrink-0 w-5 h-5 bg-white rounded flex items-center justify-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="12"
//                 height="12"
//                 viewBox="0 0 24 24"
//                 fill="#4a154b"
//               >
//                 <path d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-5zM9 6a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5zm9 2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5zm-2 9a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5z" />
//               </svg>
//             </div>
//             <div className="flex items-center gap-1">
//               <span className="text-white/70 text-xs font-medium">#</span>
//               <span className="text-xs font-semibold text-white">website-chat</span>
//             </div>
//           </div>

//           {/* Notification Content */}
//           <div className="p-4 bg-white">
//             {/* New message */}
//             <motion.div
//               className="flex items-start gap-2"
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: showSlack ? 1 : 0, y: showSlack ? 0 : 10 }}
//               transition={{
//                 duration: 0.4,
//                 delay: 0.3,
//                 ease: EASING.outCubic,
//               }}
//             >
//               <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-400 rounded" />
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-baseline gap-2 mb-1">
//                   <span className="text-xs font-semibold text-neutral-900">Visitor</span>
//                   <span className="text-[10px] text-neutral-400">just now</span>
//                 </div>
//                 <p className="text-xs text-neutral-600 leading-relaxed">
//                   {fullMessage}
//                 </p>
//               </div>
//             </motion.div>

//             {/* Agent typing indicator */}
//             {agentTyping && (
//               <motion.div
//                 className="flex items-start gap-2 mt-3"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{
//                   duration: 0.3,
//                   ease: EASING.outCubic,
//                 }}
//               >
//                 <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-400 rounded" />
//                 <div className="bg-neutral-100 rounded-lg px-3 py-2 flex gap-1">
//                   <motion.div
//                     animate={{ scale: [1, 1.3, 1] }}
//                     transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
//                     className="w-1.5 h-1.5 rounded-full bg-neutral-600"
//                   />
//                   <motion.div
//                     animate={{ scale: [1, 1.3, 1] }}
//                     transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
//                     className="w-1.5 h-1.5 rounded-full bg-neutral-600"
//                   />
//                   <motion.div
//                     animate={{ scale: [1, 1.3, 1] }}
//                     transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
//                     className="w-1.5 h-1.5 rounded-full bg-neutral-600"
//                   />
//                 </div>
//               </motion.div>
//             )}

//             {/* Online indicator */}
//             <motion.div
//               className="flex items-center gap-2 pt-3 mt-3 border-t border-neutral-100"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: showSlack ? 1 : 0 }}
//               transition={{
//                 duration: 0.3,
//                 delay: 0.5,
//                 ease: EASING.outCubic,
//               }}
//             >
//               <div className="flex-1 flex items-center gap-1.5">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//                 <span className="text-xs text-neutral-500 font-medium">Agent notified</span>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

'use client';

import { motion } from "motion/react";
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

export const ChatToSlackIllustration: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [sendClicked, setSendClicked] = useState(false);
  const [showSlack, setShowSlack] = useState(false);

  const fullMessage = "Hi, I need help with my order";

  useEffect(() => {
    // Start typing immediately
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

          // Send message
          setTimeout(() => {
            setSendClicked(true);

            setTimeout(() => {
              setMessageSent(true);
              setTypedText("");
              setSendClicked(false);

              // Show Slack notification
              setTimeout(() => {
                setShowSlack(true);
              }, 400);
            }, 300);
          }, 300);
        }
      }, 50);

      return () => clearInterval(typeInterval);
    }, 500);

    return () => clearTimeout(startTyping);
  }, []);

  return (
    <div
      className="relative w-full h-full flex items-end justify-center pb-20"
      style={{
        transformStyle: "preserve-3d",
        perspective: "800px",
      }}
    >
      {/* Chat Widget - Bottom Layer */}
      <div
        aria-hidden="true"
        style={{
          transform: "rotateX(5deg) rotateY(-5deg) translateY(-16px)",
        }}
        className="z-10"
      >
        <div className="mask-b-from-95%">
          <div
            className="bg-white rounded-2xl shadow-xl border border-neutral-200 w-[300px] overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-50 rounded-full flex items-center justify-center border border-sky-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-sky-600"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">Chat with us</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-neutral-500">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div
              className="bg-neutral-50 py-4 px-4 space-y-3"
            >
              {/* Welcome message */}
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-sky-400 to-sky-500 rounded-full flex-shrink-0 border border-sky-200" />
                <div className="bg-white border border-neutral-200 rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
                  <p className="text-xs text-neutral-700">
                    Hi! How can we help you today?
                  </p>
                </div>
              </div>

              {/* Sent message */}
              {messageSent && (
                <motion.div
                  className="flex items-start gap-2 justify-end"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EASING.outCubic }}
                >
                  <div className="bg-white border border-neutral-200 rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
                    <p className="text-xs text-neutral-700">{fullMessage}</p>
                  </div>
                  <div className="w-6 h-6 bg-sky-700 rounded-full flex-shrink-0" />
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div
              className="bg-white border-t border-neutral-200 p-3 flex items-center gap-2"
            >
              <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 flex items-center min-h-[36px]">
                <span className="text-xs text-neutral-700">{typedText}</span>
                {showCursor && (
                  <motion.span
                    className="inline-block w-0.5 h-3 bg-neutral-900 ml-0.5"
                    animate={{ opacity: [1, 0] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                )}
                {!typedText && !showCursor && (
                  <span className="text-xs text-neutral-400">Type a message...</span>
                )}
              </div>
              <motion.button
                className="w-8 h-8 bg-sky-500 hover:bg-sky-600 border border-sky-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                animate={sendClicked ? { scale: 0.85 } : { scale: 1 }}
                transition={{
                  duration: 0.15,
                  ease: EASING.outQuart,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Slack Notification - Top Layer */}
      <motion.div
        className="absolute bottom-0 right-4 z-20 w-[320px]"
        aria-hidden="true"
        initial={{ y: "100%", z: 0, opacity: 0 }}
        animate={{
          y: showSlack ? "0%" : "100%",
          z: showSlack ? 30 : 0,
          opacity: showSlack ? 1 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: EASING.outExpo,
        }}
      >
        <div className="bg-white rounded-xl shadow-2xl ring-1 ring-neutral-200/80 overflow-hidden">
          {/* Slack Header */}
          <div className="bg-[#4a154b] px-4 py-2 flex items-center gap-2">
            <div className="flex-shrink-0 w-5 h-5 bg-white rounded flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="#4a154b"
              >
                <path d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-5zM9 6a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5zm9 2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5zm-2 9a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5z" />
              </svg>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-white/70 text-xs font-medium">#</span>
              <span className="text-xs font-semibold text-white">website-chat</span>
            </div>
          </div>

          {/* Notification Content */}
          <div className="p-4 bg-white">
            {/* New message */}
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
              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-400 rounded" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-semibold text-neutral-900">Mr. Smith</span>
                  <span className="text-[10px] text-neutral-400">just now</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {fullMessage}
                </p>
              </div>
            </motion.div>

            {/* Online indicator */}
            <motion.div
              className="flex items-center gap-2 pt-3 mt-3 border-t border-neutral-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: showSlack ? 1 : 0 }}
              transition={{
                duration: 0.3,
                delay: 0.5,
                ease: EASING.outCubic,
              }}
            >
              <div className="flex-1 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-neutral-500 font-medium">Agent notified</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};