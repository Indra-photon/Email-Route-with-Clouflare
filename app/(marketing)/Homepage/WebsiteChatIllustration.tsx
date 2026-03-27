// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const conversations = [
//   {
//     id: 1,
//     visitorMsg: "Hello! Need help?",
//     agentMsg: "Hi! How can I help you today?",
//   },
//   {
//     id: 2,
//     visitorMsg: "How do I reset my password?",
//     agentMsg: "I'll guide you through it. Check your email for the reset link.",
//   },
//   {
//     id: 3,
//     visitorMsg: "Thanks! Got it working!",
//     agentMsg: "Great! Let me know if you need anything else 👍",
//   },
// ];

// function getCenter(el: HTMLElement) {
//   const rect = el.getBoundingClientRect();
//   return {
//     x: rect.left + rect.width / 2,
//     y: rect.top + rect.height / 2,
//   };
// }

// export function WebsiteChatIllustration() {
//   const [conversationIndex, setConversationIndex] = useState(0);
//   const [visitorTyping, setVisitorTyping] = useState(false);
//   const [visitorMessage, setVisitorMessage] = useState("");
//   const [showVisitorToSlack, setShowVisitorToSlack] = useState(false);
//   const [slackMessage, setSlackMessage] = useState("");
//   const [agentTyping, setAgentTyping] = useState(false);
//   const [agentMessage, setAgentMessage] = useState("");
//   const [showSlackToVisitor, setShowSlackToVisitor] = useState(false);
//   const [agentReplyInWidget, setAgentReplyInWidget] = useState("");
  
//   const [deltaToSlack, setDeltaToSlack] = useState<{ x: number; y: number } | null>(null);
//   const [deltaToWidget, setDeltaToWidget] = useState<{ x: number; y: number } | null>(null);
//   const [messagePositionStart, setMessagePositionStart] = useState<{ x: number; y: number } | null>(null);
//   const [replyPositionStart, setReplyPositionStart] = useState<{ x: number; y: number } | null>(null);

//   const chatWidgetRef = useRef<HTMLDivElement>(null);
//   const slackChannelRef = useRef<HTMLDivElement>(null);

//   const currentConversation = conversations[conversationIndex];

//   useEffect(() => {
//     const run = async () => {
//       // Reset states
//       setVisitorTyping(false);
//       setVisitorMessage("");
//       setShowVisitorToSlack(false);
//       setSlackMessage("");
//       setAgentTyping(false);
//       setAgentMessage("");
//       setShowSlackToVisitor(false);
//       setAgentReplyInWidget("");

//       // Step 1: Visitor starts typing
//       await new Promise(r => setTimeout(r, 1000));
//       setVisitorTyping(true);
//       await new Promise(r => setTimeout(r, 1500));

//       // Step 2: Visitor message appears in chat widget
//       setVisitorTyping(false);
//       setVisitorMessage(currentConversation.visitorMsg);
//       await new Promise(r => setTimeout(r, 500));

//       // Step 3: Calculate path and send message to Slack
//       if (!chatWidgetRef.current || !slackChannelRef.current) return;

//       const fromWidget = getCenter(chatWidgetRef.current);
//       const toSlack = getCenter(slackChannelRef.current);

//       setMessagePositionStart({ x: fromWidget.x, y: fromWidget.y });
//       setDeltaToSlack({
//         x: toSlack.x - fromWidget.x,
//         y: toSlack.y - fromWidget.y,
//       });

//       setShowVisitorToSlack(true);
//       await new Promise(r => setTimeout(r, 1500));

//       // Step 4: Message appears in Slack
//       setShowVisitorToSlack(false);
//       setSlackMessage(currentConversation.visitorMsg);
//       await new Promise(r => setTimeout(r, 500));

//       // Step 5: Agent starts typing in Slack
//       setAgentTyping(true);
//       await new Promise(r => setTimeout(r, 1500));

//       // Step 6: Agent message appears in Slack
//       setAgentTyping(false);
//       setAgentMessage(currentConversation.agentMsg);
//       await new Promise(r => setTimeout(r, 500));

//       // Step 7: Calculate path and send reply back to widget
//       const fromSlack = getCenter(slackChannelRef.current);
//       const toWidget = getCenter(chatWidgetRef.current);

//       setReplyPositionStart({ x: fromSlack.x, y: fromSlack.y });
//       setDeltaToWidget({
//         x: toWidget.x - fromSlack.x,
//         y: toWidget.y - fromSlack.y,
//       });

//       setShowSlackToVisitor(true);
//       await new Promise(r => setTimeout(r, 1500));

//       // Step 8: Reply appears in chat widget
//       setShowSlackToVisitor(false);
//       setAgentReplyInWidget(currentConversation.agentMsg);
//       await new Promise(r => setTimeout(r, 1000));

//       // Move to next conversation
//       setConversationIndex(i => (i + 1) % conversations.length);
//     };

//     run();
//   }, [conversationIndex, currentConversation.visitorMsg, currentConversation.agentMsg]);

//   return (
//     <div className="relative w-full h-[550px]">
//       {/* LEFT - Website Browser with Chat Widget */}
//       <div className="absolute top-0 left-0 z-20">
//         {/* Browser Window */}
//         <div className="w-64 h-52 bg-white rounded-lg shadow-xl overflow-hidden">
//           {/* Browser Header */}
//           <div className="bg-sky-900 px-4 py-2 flex items-center gap-2">
//             <div className="flex gap-1.5">
//               <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
//               <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
//               <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
//             </div>
//             <div className="text-xs text-white ml-2">mywebsite.com</div>
//           </div>

//           {/* Browser Content */}
//           <div className="h-full bg-gradient-to-b from-gray-50 to-gray-100 p-4 relative">
//             {/* Chat Widget */}
//             <div 
//               ref={chatWidgetRef}
//               className="absolute top-4 right-4 w-48 bg-white rounded-lg shadow-lg overflow-hidden"
//             >
//               {/* Widget Header */}
//               <div className="bg-cyan-600 px-3 py-2 flex items-center justify-between">
//                 <span className="text-xs font-semibold text-white">Chat with us</span>
//               </div>

//               {/* Messages */}
//               <div className="p-3 space-y-2 h-20 overflow-y-auto bg-white">
//                 {/* Visitor message */}
//                 <AnimatePresence>
//                   {visitorMessage && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="flex justify-end"
//                     >
//                       <div className="bg-cyan-100 rounded-lg px-2 py-1 max-w-[80%]">
//                         <p className="text-[10px] text-gray-800">{visitorMessage}</p>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 {/* Agent reply in widget */}
//                 <AnimatePresence>
//                   {agentReplyInWidget && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="flex justify-start"
//                     >
//                       <div className="bg-gray-100 rounded-lg px-2 py-1 max-w-[80%]">
//                         <p className="text-[10px] text-gray-800">{agentReplyInWidget}</p>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 {/* Typing indicator */}
//                 <AnimatePresence>
//                   {visitorTyping && (
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       className="flex justify-end"
//                     >
//                       <div className="bg-cyan-100 rounded-lg px-3 py-2 flex gap-1">
//                         <motion.div
//                           animate={{ scale: [1, 1.2, 1] }}
//                           transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
//                           className="w-1.5 h-1.5 rounded-full bg-cyan-600"
//                         />
//                         <motion.div
//                           animate={{ scale: [1, 1.2, 1] }}
//                           transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
//                           className="w-1.5 h-1.5 rounded-full bg-cyan-600"
//                         />
//                         <motion.div
//                           animate={{ scale: [1, 1.2, 1] }}
//                           transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
//                           className="w-1.5 h-1.5 rounded-full bg-cyan-600"
//                         />
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>

//               {/* Input */}
//               <div className="border-t border-gray-200 p-2">
//                 <input 
//                   type="text" 
//                   placeholder="Type a message..."
//                   className="w-full text-[10px] px-2 py-1 border border-gray-200 rounded"
//                   disabled
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Flying message from widget to Slack */}
//       {/* <AnimatePresence>
//         {showVisitorToSlack && deltaToSlack && messagePositionStart && (
//           <motion.div
//             className="fixed z-50 pointer-events-none"
//             style={{ left: messagePositionStart.x, top: messagePositionStart.y }}
//             initial={{ x: 0, y: 0, opacity: 1 }}
//             animate={{
//               x: [0, deltaToSlack.x * 0.5, deltaToSlack.x],
//               y: [0, deltaToSlack.y - 40, deltaToSlack.y],
//               opacity: [1, 1, 0],
//             }}
//             transition={{ duration: 1.5, ease: "easeInOut" }}
//           >
//             <div className="bg-cyan-500 text-white text-xs px-3 py-1 rounded-lg shadow-lg">
//               💬
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence> */}

//       {/* Flying reply from Slack to widget */}
//       {/* <AnimatePresence>
//         {showSlackToVisitor && deltaToWidget && replyPositionStart && (
//           <motion.div
//             className="fixed z-50 pointer-events-none"
//             style={{ left: replyPositionStart.x, top: replyPositionStart.y }}
//             initial={{ x: 0, y: 0, opacity: 1 }}
//             animate={{
//               x: [0, deltaToWidget.x * 0.5, deltaToWidget.x],
//               y: [0, deltaToWidget.y - 40, deltaToWidget.y],
//               opacity: [1, 1, 0],
//             }}
//             transition={{ duration: 1.5, ease: "easeInOut" }}
//           >
//             <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-lg shadow-lg">
//               💬
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence> */}

//       {/* RIGHT - Slack Interface */}
//       <div className="absolute bottom-0 right-0 z-10 w-80 overflow-hidden rounded-xl bg-white shadow-xl">
//         {/* Slack Header */}
//         <div className="bg-[#4a154b] px-4 py-3 text-sm font-semibold text-white">
//           Workspace
//         </div>

//         <div className="flex h-72">
//           {/* Sidebar */}
//           <div className="w-28 bg-[#3f0e40] p-3 space-y-1">
//             <div 
//               ref={slackChannelRef}
//               className="rounded bg-[#1164a3] px-2 py-1 text-[11px] text-white"
//             >
//               # website-chat
//             </div>
//             <div className="px-2 py-1 text-[11px] text-neutral-300"># support</div>
//             <div className="px-2 py-1 text-[11px] text-neutral-300"># general</div>
//           </div>

//           {/* Main Chat Area */}
//           <div className="flex-1 bg-white p-4 overflow-y-auto">
//             <div className="mb-3 text-sm font-bold text-neutral-900"># website-chat</div>
            
//             {/* Messages */}
//             <div className="space-y-3">
//               {/* Visitor message in Slack */}
//               <AnimatePresence>
//                 {slackMessage && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="flex gap-2"
//                   >
//                     <div className="h-6 w-6 rounded bg-cyan-400 flex-shrink-0"></div>
//                     <div>
//                       <div className="flex items-baseline gap-2 mb-1">
//                         <span className="text-xs font-semibold text-neutral-900">Visitor</span>
//                         <span className="text-[10px] text-neutral-500">just now</span>
//                       </div>
//                       <p className="text-xs text-neutral-700">{slackMessage}</p>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {/* Agent typing indicator */}
//               <AnimatePresence>
//                 {agentTyping && (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="flex gap-2"
//                   >
//                     <div className="h-6 w-6 rounded bg-green-400 flex-shrink-0"></div>
//                     <div className="bg-gray-100 rounded px-3 py-2 flex gap-1">
//                       <motion.div
//                         animate={{ scale: [1, 1.2, 1] }}
//                         transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
//                         className="w-1.5 h-1.5 rounded-full bg-gray-600"
//                       />
//                       <motion.div
//                         animate={{ scale: [1, 1.2, 1] }}
//                         transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
//                         className="w-1.5 h-1.5 rounded-full bg-gray-600"
//                       />
//                       <motion.div
//                         animate={{ scale: [1, 1.2, 1] }}
//                         transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
//                         className="w-1.5 h-1.5 rounded-full bg-gray-600"
//                       />
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {/* Agent message in Slack */}
//               <AnimatePresence>
//                 {agentMessage && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="flex gap-2"
//                   >
//                     <div className="h-6 w-6 rounded bg-green-400 flex-shrink-0"></div>
//                     <div>
//                       <div className="flex items-baseline gap-2 mb-1">
//                         <span className="text-xs font-semibold text-neutral-900">Sarah Chen</span>
//                         <span className="text-[10px] text-neutral-500">just now</span>
//                       </div>
//                       <p className="text-xs text-neutral-700">{agentMessage}</p>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
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

const conversations = [
  {
    id: 1,
    visitorMsg: "Hi, I need help with my account",
    agentMsg: "Of course! What seems to be the issue?",
  },
  {
    id: 2,
    visitorMsg: "How do I reset my password?",
    agentMsg: "Check your email for the reset link.",
  },
  {
    id: 3,
    visitorMsg: "Thanks! Got it working!",
    agentMsg: "Great! Let me know if you need anything else.",
  },
];

export function WebsiteChatIllustration() {
  const [convIndex, setConvIndex]               = useState(0);
  const [visitorTyping, setVisitorTyping]       = useState(false);
  const [visitorMessage, setVisitorMessage]     = useState("");
  const [slackMessage, setSlackMessage]         = useState("");
  const [agentTyping, setAgentTyping]           = useState(false);
  const [agentMessage, setAgentMessage]         = useState("");
  const [agentReplyInWidget, setAgentReplyInWidget] = useState("");

  // Arrow states — forward (widget → slack)
  const [showFwdArrow, setShowFwdArrow] = useState(false);
  const [fwdPath, setFwdPath]           = useState("");
  const [fwdOrigin, setFwdOrigin]       = useState({ x: 0, y: 0 });

  // Arrow states — return (slack → widget)
  const [showRetArrow, setShowRetArrow] = useState(false);
  const [retPath, setRetPath]           = useState("");
  const [retOrigin, setRetOrigin]       = useState({ x: 0, y: 0 });

  const containerRef  = useRef<HTMLDivElement>(null);
  const widgetRef     = useRef<HTMLDivElement>(null);
  const slackRef      = useRef<HTMLDivElement>(null);

  const current = conversations[convIndex];

  function buildPath(
    fromEl: HTMLElement,
    toEl: HTMLElement,
    containerEl: HTMLElement,
    direction: "fwd" | "ret"
  ) {
    const cRect = containerEl.getBoundingClientRect();
    const fRect = fromEl.getBoundingClientRect();
    const tRect = toEl.getBoundingClientRect();

    const fx = direction === "fwd"
      ? fRect.right  - cRect.left
      : fRect.left   - cRect.left;
    const fy = fRect.top + fRect.height / 2 - cRect.top;
    const tx = direction === "fwd"
      ? tRect.left   - cRect.left
      : tRect.right  - cRect.left;
    const ty = tRect.top + tRect.height / 2 - cRect.top;

    const cx1 = fx + (tx - fx) * 0.5;
    const cy1 = fy - 40;
    const cx2 = fx + (tx - fx) * 0.5;
    const cy2 = ty + 40;

    return {
      path: `M ${fx} ${fy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`,
      origin: { x: fx, y: fy },
    };
  }

  useEffect(() => {
    const run = async () => {
      // Reset
      setVisitorTyping(false);
      setVisitorMessage("");
      setSlackMessage("");
      setAgentTyping(false);
      setAgentMessage("");
      setAgentReplyInWidget("");
      setShowFwdArrow(false);
      setShowRetArrow(false);

      // 1. Visitor typing
      await new Promise(r => setTimeout(r, 800));
      setVisitorTyping(true);
      await new Promise(r => setTimeout(r, 1400));

      // 2. Visitor message in widget
      setVisitorTyping(false);
      setVisitorMessage(current.visitorMsg);
      await new Promise(r => setTimeout(r, 500));

      // 3. Forward arrow: widget → slack
      if (!widgetRef.current || !slackRef.current || !containerRef.current) return;
      const fwd = buildPath(widgetRef.current, slackRef.current, containerRef.current, "fwd");
      setFwdPath(fwd.path);
      setFwdOrigin(fwd.origin);
      setShowFwdArrow(true);
      await new Promise(r => setTimeout(r, 850));

      // 4. Message appears in Slack
      setShowFwdArrow(false);
      setSlackMessage(current.visitorMsg);
      await new Promise(r => setTimeout(r, 400));

      // 5. Agent typing in Slack
      setAgentTyping(true);
      await new Promise(r => setTimeout(r, 1400));

      // 6. Agent message in Slack
      setAgentTyping(false);
      setAgentMessage(current.agentMsg);
      await new Promise(r => setTimeout(r, 500));

      // 7. Return arrow: slack → widget
      const ret = buildPath(slackRef.current, widgetRef.current, containerRef.current, "ret");
      setRetPath(ret.path);
      setRetOrigin(ret.origin);
      setShowRetArrow(true);
      await new Promise(r => setTimeout(r, 850));

      // 8. Reply appears in widget
      setShowRetArrow(false);
      setAgentReplyInWidget(current.agentMsg);
      await new Promise(r => setTimeout(r, 1200));

      // Next conversation
      setConvIndex(i => (i + 1) % conversations.length);
    };

    run();
  }, [convIndex]);

  const ArrowSVG = ({
    show,
    path,
    origin,
    color,
    markerId,
  }: {
    show: boolean;
    path: string;
    origin: { x: number; y: number };
    color: string;
    markerId: string;
  }) => (
    <AnimatePresence>
      {show && path && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20">
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 10 10"
              refX="8" refY="5"
              markerWidth="5" markerHeight="5"
              orient="auto"
            >
              <path
                d="M1 1L9 5L1 9"
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
          </defs>
          <motion.circle
            cx={origin.x}
            cy={origin.y}
            r="3"
            fill={color}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
          <motion.path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="500"
            strokeDashoffset="500"
            markerEnd={`url(#${markerId})`}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
          />
        </svg>
      )}
    </AnimatePresence>
  );

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center justify-between gap-8 overflow-hidden bg-neutral-50 border border-neutral-200 p-8 min-h-[400px]"
    >
      {/* Top-left badge */}
      <div className="absolute top-3 left-4 flex items-center gap-1.5">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-sky-800"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <span className="font-mono text-[9px] tracking-widest text-sky-800 uppercase">
          Live Chat Bridge
        </span>
      </div>

      {/* Dot-grid background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.25]">
        <defs>
          <pattern id="chat-dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="#94a3b8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#chat-dots)" />
      </svg>

      {/* Forward arrow: widget → slack (sky-800) */}
      <ArrowSVG
        show={showFwdArrow}
        path={fwdPath}
        origin={fwdOrigin}
        color="#0c4a6e"
        markerId="fwd-tip"
      />

      {/* Return arrow: slack → widget (cyan-600) */}
      <ArrowSVG
        show={showRetArrow}
        path={retPath}
        origin={retOrigin}
        color="#0891b2"
        markerId="ret-tip"
      />

      {/* ── LEFT: BROWSER + CHAT WIDGET ── */}
      <div className="relative z-10 flex-shrink-0 w-56">
        <div className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase mb-2">
          Website Visitor
        </div>

        {/* Browser shell */}
        <div className="relative bg-white border border-neutral-200 overflow-hidden">
          {/* Corner brackets */}
          <span className="absolute -top-px -left-px font-mono text-[8px] leading-none text-sky-800 select-none z-10">■</span>
          <span className="absolute -top-px -right-px font-mono text-[8px] leading-none text-sky-800 select-none z-10">■</span>
          <span className="absolute -bottom-px -left-px font-mono text-[8px] leading-none text-sky-800 select-none z-10">■</span>
          <span className="absolute -bottom-px -right-px font-mono text-[8px] leading-none text-sky-800 select-none z-10">■</span>

          {/* Browser title bar */}
          <div className="bg-sky-900 px-4 py-2.5 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 border border-white" />
              <div className="w-2 h-2 border border-white" />
              <div className="w-2 h-2 border border-white" />
            </div>
            <span className="font-mono text-[9px] tracking-widest text-white uppercase ml-2">
              mywebsite.com
            </span>
          </div>

          {/* Page content area */}
          <div className="relative bg-neutral-50 p-3 h-52">
            {/* Fake page skeleton lines */}
            <div className="space-y-1.5 mb-3">
              <div className="h-1.5 w-3/4 bg-neutral-200 rounded-sm" />
              <div className="h-1.5 w-1/2 bg-neutral-200 rounded-sm" />
              <div className="h-1.5 w-5/6 bg-neutral-200 rounded-sm" />
            </div>
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              <div className="h-8 bg-neutral-200 rounded-sm" />
              <div className="h-8 bg-neutral-200 rounded-sm" />
            </div>

            {/* Chat widget — positioned bottom-right of the page area */}
            <div
              ref={widgetRef}
              className="absolute bottom-2 right-2 w-40 bg-white border border-neutral-200 overflow-hidden"
            >
              {/* Widget corner brackets */}
              <span className="absolute -top-px -left-px font-mono text-[7px] leading-none text-sky-800 select-none z-10">■</span>
              <span className="absolute -top-px -right-px font-mono text-[7px] leading-none text-sky-800 select-none z-10">■</span>
              <span className="absolute -bottom-px -left-px font-mono text-[7px] leading-none text-sky-800 select-none z-10">■</span>
              <span className="absolute -bottom-px -right-px font-mono text-[7px] leading-none text-sky-800 select-none z-10">■</span>

              {/* Widget header */}
              <div className="bg-sky-800 px-2.5 py-1.5 flex items-center justify-between">
                <span className="font-mono text-[8px] tracking-widest text-white uppercase">
                  Support
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>

              {/* Messages */}
              <div className="p-2 space-y-1.5 h-20 overflow-hidden bg-white">
                <AnimatePresence>
                  {visitorMessage && (
                    <motion.div
                      key="visitor-msg"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end"
                    >
                      <div className="bg-sky-100 border border-sky-200 px-1.5 py-1 max-w-[85%]">
                        <p className="font-mono text-[8px] text-sky-900 leading-snug">
                          {visitorMessage}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {agentReplyInWidget && (
                    <motion.div
                      key="agent-reply"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-neutral-100 border border-neutral-200 px-1.5 py-1 max-w-[85%]">
                        <p className="font-mono text-[8px] text-neutral-700 leading-snug">
                          {agentReplyInWidget}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                  {visitorTyping && (
                    <motion.div
                      key="typing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-end"
                    >
                      <div className="bg-sky-100 border border-sky-200 px-2 py-1.5 flex gap-1">
                        {[0, 0.2, 0.4].map((delay, i) => (
                          <motion.div
                            key={i}
                            className="w-1 h-1 rounded-full bg-sky-700"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.7, repeat: Infinity, delay }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input row */}
              <div className="border-t border-neutral-100 px-2 py-1.5 flex items-center gap-1">
                <div className="flex-1 h-4 bg-neutral-50 border border-neutral-200" />
                <div className="w-4 h-4 bg-sky-800 flex items-center justify-center flex-shrink-0">
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                    <path d="M1 5h8M5 1l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
          Chat widget · Live
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

          {/* Title bar */}
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

          <div className="flex h-56">
            {/* Sidebar */}
            <div className="w-[108px] bg-sky-950 border-r border-sky-900 py-3 flex-shrink-0">
              <div className="font-mono text-[8px] tracking-widest text-neutral-100 uppercase px-3 mb-2">
                Channels
              </div>
              {[
                { name: "website-chat", active: true },
                { name: "support", active: false },
                { name: "general", active: false },
              ].map(ch => (
                <div
                  key={ch.name}
                  ref={ch.active ? slackRef : undefined}
                  className={[
                    "relative px-3 py-1.5 font-mono text-[10px] tracking-wider border-l-2 transition-all duration-200",
                    ch.active
                      ? "bg-sky-800 text-white border-cyan-400 font-bold"
                      : "text-neutral-200 border-transparent",
                  ].join(" ")}
                >
                  #{ch.name}
                </div>
              ))}
            </div>

            {/* Message pane */}
            <div className="flex-1 p-4 bg-white overflow-hidden">
              {/* Channel header */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2 mb-3">
                <span className="font-mono text-[10px] font-bold tracking-widest text-sky-900 uppercase">
                  #website-chat
                </span>
                <span className="font-mono text-[8px] tracking-wider text-neutral-300 uppercase">
                  Live
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {/* Visitor message in Slack */}
                <AnimatePresence>
                  {slackMessage && (
                    <motion.div
                      key="slack-visitor"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2"
                    >
                      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center border bg-sky-100 text-sky-700 border-sky-200 font-mono text-[7px] font-bold">
                        V
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="font-mono text-[8px] font-bold tracking-wider text-sky-900">
                            VISITOR
                          </span>
                          <span className="font-mono text-[8px] text-neutral-300">just now</span>
                        </div>
                        <p className="font-mono text-[10px] text-neutral-600 leading-snug">
                          {slackMessage}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Agent typing */}
                <AnimatePresence>
                  {agentTyping && (
                    <motion.div
                      key="agent-typing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2"
                    >
                      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center border bg-cyan-100 text-cyan-700 border-cyan-200 font-mono text-[7px] font-bold">
                        S
                      </div>
                      <div className="bg-neutral-50 border border-neutral-100 px-2 py-1.5 flex gap-1">
                        {[0, 0.2, 0.4].map((delay, i) => (
                          <motion.div
                            key={i}
                            className="w-1 h-1 rounded-full bg-neutral-400"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.7, repeat: Infinity, delay }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Agent message */}
                <AnimatePresence>
                  {agentMessage && (
                    <motion.div
                      key="slack-agent"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2"
                    >
                      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center border bg-cyan-100 text-cyan-700 border-cyan-200 font-mono text-[7px] font-bold">
                        S
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="font-mono text-[8px] font-bold tracking-wider text-sky-900">
                            S.CHEN
                          </span>
                          <span className="font-mono text-[8px] text-neutral-300">just now</span>
                        </div>
                        <p className="font-mono text-[10px] text-neutral-600 leading-snug">
                          {agentMessage}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Routed indicator — shows when reply is sent back */}
                <AnimatePresence>
                  {agentReplyInWidget && (
                    <motion.div
                      key="routed"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 pt-2 border-t border-sky-100"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <span className="font-mono text-[8px] tracking-widest text-cyan-600 uppercase">
                        Reply sent to visitor
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="bg-sky-950 border-t border-sky-900 px-4 py-1.5 flex items-center gap-4">
            <span className="font-mono text-[8px] tracking-wider uppercase text-cyan-400 font-bold">
              #website-chat ●
            </span>
            <span className="font-mono text-[8px] tracking-wider uppercase text-sky-700">
              #support ○
            </span>
            <span className="font-mono text-[8px] tracking-wider uppercase text-sky-700">
              #general ○
            </span>
          </div>
        </div>

        <div className="mt-2 font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
          Reply from Slack · Zero context switch
        </div>
      </div>
    </div>
  );
}