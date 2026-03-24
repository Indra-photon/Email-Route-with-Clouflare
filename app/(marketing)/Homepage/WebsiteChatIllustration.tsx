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
//     <div className="relative flex min-h-[420px] w-full items-center justify-center">
//       <div className="flex flex-row gap-12 items-center relative">

//         {/* LEFT - Website Browser with Chat Widget */}
//         <div className="relative">
//           {/* Browser Window */}
//           <div className=" absolute top-0 w-64 h-96 bg-white rounded-lg shadow-xl ring-1 ring-orange-300 overflow-hidden">
//             {/* Browser Header */}
//             <div className="bg-orange-500 px-4 py-2 flex items-center gap-2">
//               <div className="flex gap-1.5">
//                 <div className="w-2.5 h-2.5 rounded-full bg-orange-200"></div>
//                 <div className="w-2.5 h-2.5 rounded-full bg-orange-200"></div>
//                 <div className="w-2.5 h-2.5 rounded-full bg-orange-200"></div>
//               </div>
//               <div className="text-xs text-white ml-2">mywebsite.com</div>
//             </div>

//             {/* Browser Content */}
//             <div className="h-full bg-gradient-to-b from-gray-50 to-gray-100 p-4 relative">
//               {/* Chat Widget */}
//               <div 
//                 ref={chatWidgetRef}
//                 className="absolute top-4 right-4 w-48 bg-white rounded-lg shadow-lg ring-1 ring-cyan-200 overflow-hidden"
//               >
//                 {/* Widget Header */}
//                 <div className="bg-cyan-600 px-3 py-2 flex items-center justify-between">
//                   <span className="text-xs font-semibold text-white">Chat with us</span>
//                   <div className="w-2 h-2 rounded-full bg-green-400"></div>
//                 </div>

//                 {/* Messages */}
//                 <div className="p-3 space-y-2 h-40 overflow-y-auto bg-white">
//                   {/* Visitor message */}
//                   <AnimatePresence>
//                     {visitorMessage && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="flex justify-end"
//                       >
//                         <div className="bg-cyan-100 rounded-lg px-2 py-1 max-w-[80%]">
//                           <p className="text-[10px] text-gray-800">{visitorMessage}</p>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>

//                   {/* Agent reply in widget */}
//                   <AnimatePresence>
//                     {agentReplyInWidget && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="flex justify-start"
//                       >
//                         <div className="bg-gray-100 rounded-lg px-2 py-1 max-w-[80%]">
//                           <p className="text-[10px] text-gray-800">{agentReplyInWidget}</p>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>

//                   {/* Typing indicator */}
//                   <AnimatePresence>
//                     {visitorTyping && (
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="flex justify-end"
//                       >
//                         <div className="bg-cyan-100 rounded-lg px-3 py-2 flex gap-1">
//                           <motion.div
//                             animate={{ scale: [1, 1.2, 1] }}
//                             transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
//                             className="w-1.5 h-1.5 rounded-full bg-cyan-600"
//                           />
//                           <motion.div
//                             animate={{ scale: [1, 1.2, 1] }}
//                             transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
//                             className="w-1.5 h-1.5 rounded-full bg-cyan-600"
//                           />
//                           <motion.div
//                             animate={{ scale: [1, 1.2, 1] }}
//                             transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
//                             className="w-1.5 h-1.5 rounded-full bg-cyan-600"
//                           />
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 {/* Input */}
//                 <div className="border-t border-gray-200 p-2">
//                   <input 
//                     type="text" 
//                     placeholder="Type a message..."
//                     className="w-full text-[10px] px-2 py-1 border border-gray-200 rounded"
//                     disabled
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Flying message from widget to Slack */}
//         {/* <AnimatePresence>
//           {showVisitorToSlack && deltaToSlack && messagePositionStart && (
//             <motion.div
//               className="fixed z-50 pointer-events-none"
//               style={{ left: messagePositionStart.x, top: messagePositionStart.y }}
//               initial={{ x: 0, y: 0, opacity: 1 }}
//               animate={{
//                 x: [0, deltaToSlack.x * 0.5, deltaToSlack.x],
//                 y: [0, deltaToSlack.y - 40, deltaToSlack.y],
//                 opacity: [1, 1, 0],
//               }}
//               transition={{ duration: 1.5, ease: "easeInOut" }}
//             >
//               <div className="bg-cyan-500 text-white text-xs px-3 py-1 rounded-lg shadow-lg">
//                 💬
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence> */}

//         {/* Flying reply from Slack to widget */}
//         {/* <AnimatePresence>
//           {showSlackToVisitor && deltaToWidget && replyPositionStart && (
//             <motion.div
//               className="fixed z-50 pointer-events-none"
//               style={{ left: replyPositionStart.x, top: replyPositionStart.y }}
//               initial={{ x: 0, y: 0, opacity: 1 }}
//               animate={{
//                 x: [0, deltaToWidget.x * 0.5, deltaToWidget.x],
//                 y: [0, deltaToWidget.y - 40, deltaToWidget.y],
//                 opacity: [1, 1, 0],
//               }}
//               transition={{ duration: 1.5, ease: "easeInOut" }}
//             >
//               <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-lg shadow-lg">
//                 💬
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence> */}

//         {/* RIGHT - Slack Interface */}
//         <div className="w-80 overflow-hidden rounded-xl bg-white shadow-xl">
//           {/* Slack Header */}
//           <div className="bg-[#4a154b] px-4 py-3 text-sm font-semibold text-white">
//             Workspace
//           </div>

//           <div className="flex h-72">
//             {/* Sidebar */}
//             <div className="w-28 bg-[#3f0e40] p-3 space-y-1">
//               <div 
//                 ref={slackChannelRef}
//                 className="rounded bg-[#1164a3] px-2 py-1 text-[11px] text-white"
//               >
//                 # website-chat
//               </div>
//               <div className="px-2 py-1 text-[11px] text-neutral-300"># support</div>
//               <div className="px-2 py-1 text-[11px] text-neutral-300"># general</div>
//             </div>

//             {/* Main Chat Area */}
//             <div className="flex-1 bg-white p-4 overflow-y-auto">
//               <div className="mb-3 text-sm font-bold text-neutral-900"># website-chat</div>
              
//               {/* Messages */}
//               <div className="space-y-3">
//                 {/* Visitor message in Slack */}
//                 <AnimatePresence>
//                   {slackMessage && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="flex gap-2"
//                     >
//                       <div className="h-6 w-6 rounded bg-cyan-400 flex-shrink-0"></div>
//                       <div>
//                         <div className="flex items-baseline gap-2 mb-1">
//                           <span className="text-xs font-semibold text-neutral-900">Visitor</span>
//                           <span className="text-[10px] text-neutral-500">just now</span>
//                         </div>
//                         <p className="text-xs text-neutral-700">{slackMessage}</p>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 {/* Agent typing indicator */}
//                 <AnimatePresence>
//                   {agentTyping && (
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       className="flex gap-2"
//                     >
//                       <div className="h-6 w-6 rounded bg-green-400 flex-shrink-0"></div>
//                       <div className="bg-gray-100 rounded px-3 py-2 flex gap-1">
//                         <motion.div
//                           animate={{ scale: [1, 1.2, 1] }}
//                           transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
//                           className="w-1.5 h-1.5 rounded-full bg-gray-600"
//                         />
//                         <motion.div
//                           animate={{ scale: [1, 1.2, 1] }}
//                           transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
//                           className="w-1.5 h-1.5 rounded-full bg-gray-600"
//                         />
//                         <motion.div
//                           animate={{ scale: [1, 1.2, 1] }}
//                           transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
//                           className="w-1.5 h-1.5 rounded-full bg-gray-600"
//                         />
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 {/* Agent message in Slack */}
//                 <AnimatePresence>
//                   {agentMessage && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="flex gap-2"
//                     >
//                       <div className="h-6 w-6 rounded bg-green-400 flex-shrink-0"></div>
//                       <div>
//                         <div className="flex items-baseline gap-2 mb-1">
//                           <span className="text-xs font-semibold text-neutral-900">Sarah Chen</span>
//                           <span className="text-[10px] text-neutral-500">just now</span>
//                         </div>
//                         <p className="text-xs text-neutral-700">{agentMessage}</p>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
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

const conversations = [
  {
    id: 1,
    visitorMsg: "Hello! Need help?",
    agentMsg: "Hi! How can I help you today?",
  },
  {
    id: 2,
    visitorMsg: "How do I reset my password?",
    agentMsg: "I'll guide you through it. Check your email for the reset link.",
  },
  {
    id: 3,
    visitorMsg: "Thanks! Got it working!",
    agentMsg: "Great! Let me know if you need anything else 👍",
  },
];

function getCenter(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function WebsiteChatIllustration() {
  const [conversationIndex, setConversationIndex] = useState(0);
  const [visitorTyping, setVisitorTyping] = useState(false);
  const [visitorMessage, setVisitorMessage] = useState("");
  const [showVisitorToSlack, setShowVisitorToSlack] = useState(false);
  const [slackMessage, setSlackMessage] = useState("");
  const [agentTyping, setAgentTyping] = useState(false);
  const [agentMessage, setAgentMessage] = useState("");
  const [showSlackToVisitor, setShowSlackToVisitor] = useState(false);
  const [agentReplyInWidget, setAgentReplyInWidget] = useState("");
  
  const [deltaToSlack, setDeltaToSlack] = useState<{ x: number; y: number } | null>(null);
  const [deltaToWidget, setDeltaToWidget] = useState<{ x: number; y: number } | null>(null);
  const [messagePositionStart, setMessagePositionStart] = useState<{ x: number; y: number } | null>(null);
  const [replyPositionStart, setReplyPositionStart] = useState<{ x: number; y: number } | null>(null);

  const chatWidgetRef = useRef<HTMLDivElement>(null);
  const slackChannelRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations[conversationIndex];

  useEffect(() => {
    const run = async () => {
      // Reset states
      setVisitorTyping(false);
      setVisitorMessage("");
      setShowVisitorToSlack(false);
      setSlackMessage("");
      setAgentTyping(false);
      setAgentMessage("");
      setShowSlackToVisitor(false);
      setAgentReplyInWidget("");

      // Step 1: Visitor starts typing
      await new Promise(r => setTimeout(r, 1000));
      setVisitorTyping(true);
      await new Promise(r => setTimeout(r, 1500));

      // Step 2: Visitor message appears in chat widget
      setVisitorTyping(false);
      setVisitorMessage(currentConversation.visitorMsg);
      await new Promise(r => setTimeout(r, 500));

      // Step 3: Calculate path and send message to Slack
      if (!chatWidgetRef.current || !slackChannelRef.current) return;

      const fromWidget = getCenter(chatWidgetRef.current);
      const toSlack = getCenter(slackChannelRef.current);

      setMessagePositionStart({ x: fromWidget.x, y: fromWidget.y });
      setDeltaToSlack({
        x: toSlack.x - fromWidget.x,
        y: toSlack.y - fromWidget.y,
      });

      setShowVisitorToSlack(true);
      await new Promise(r => setTimeout(r, 1500));

      // Step 4: Message appears in Slack
      setShowVisitorToSlack(false);
      setSlackMessage(currentConversation.visitorMsg);
      await new Promise(r => setTimeout(r, 500));

      // Step 5: Agent starts typing in Slack
      setAgentTyping(true);
      await new Promise(r => setTimeout(r, 1500));

      // Step 6: Agent message appears in Slack
      setAgentTyping(false);
      setAgentMessage(currentConversation.agentMsg);
      await new Promise(r => setTimeout(r, 500));

      // Step 7: Calculate path and send reply back to widget
      const fromSlack = getCenter(slackChannelRef.current);
      const toWidget = getCenter(chatWidgetRef.current);

      setReplyPositionStart({ x: fromSlack.x, y: fromSlack.y });
      setDeltaToWidget({
        x: toWidget.x - fromSlack.x,
        y: toWidget.y - fromSlack.y,
      });

      setShowSlackToVisitor(true);
      await new Promise(r => setTimeout(r, 1500));

      // Step 8: Reply appears in chat widget
      setShowSlackToVisitor(false);
      setAgentReplyInWidget(currentConversation.agentMsg);
      await new Promise(r => setTimeout(r, 1000));

      // Move to next conversation
      setConversationIndex(i => (i + 1) % conversations.length);
    };

    run();
  }, [conversationIndex, currentConversation.visitorMsg, currentConversation.agentMsg]);

  return (
    <div className="relative w-full h-[550px]">
      {/* LEFT - Website Browser with Chat Widget */}
      <div className="absolute top-0 left-0 z-20">
        {/* Browser Window */}
        <div className="w-64 h-52 bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Browser Header */}
          <div className="bg-sky-900 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
            </div>
            <div className="text-xs text-white ml-2">mywebsite.com</div>
          </div>

          {/* Browser Content */}
          <div className="h-full bg-gradient-to-b from-gray-50 to-gray-100 p-4 relative">
            {/* Chat Widget */}
            <div 
              ref={chatWidgetRef}
              className="absolute top-4 right-4 w-48 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {/* Widget Header */}
              <div className="bg-cyan-600 px-3 py-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Chat with us</span>
              </div>

              {/* Messages */}
              <div className="p-3 space-y-2 h-20 overflow-y-auto bg-white">
                {/* Visitor message */}
                <AnimatePresence>
                  {visitorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end"
                    >
                      <div className="bg-cyan-100 rounded-lg px-2 py-1 max-w-[80%]">
                        <p className="text-[10px] text-gray-800">{visitorMessage}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Agent reply in widget */}
                <AnimatePresence>
                  {agentReplyInWidget && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 rounded-lg px-2 py-1 max-w-[80%]">
                        <p className="text-[10px] text-gray-800">{agentReplyInWidget}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                  {visitorTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-end"
                    >
                      <div className="bg-cyan-100 rounded-lg px-3 py-2 flex gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-1.5 h-1.5 rounded-full bg-cyan-600"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-1.5 h-1.5 rounded-full bg-cyan-600"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-1.5 h-1.5 rounded-full bg-cyan-600"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-2">
                <input 
                  type="text" 
                  placeholder="Type a message..."
                  className="w-full text-[10px] px-2 py-1 border border-gray-200 rounded"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flying message from widget to Slack */}
      {/* <AnimatePresence>
        {showVisitorToSlack && deltaToSlack && messagePositionStart && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{ left: messagePositionStart.x, top: messagePositionStart.y }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: [0, deltaToSlack.x * 0.5, deltaToSlack.x],
              y: [0, deltaToSlack.y - 40, deltaToSlack.y],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className="bg-cyan-500 text-white text-xs px-3 py-1 rounded-lg shadow-lg">
              💬
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Flying reply from Slack to widget */}
      {/* <AnimatePresence>
        {showSlackToVisitor && deltaToWidget && replyPositionStart && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{ left: replyPositionStart.x, top: replyPositionStart.y }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: [0, deltaToWidget.x * 0.5, deltaToWidget.x],
              y: [0, deltaToWidget.y - 40, deltaToWidget.y],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-lg shadow-lg">
              💬
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* RIGHT - Slack Interface */}
      <div className="absolute bottom-0 right-0 z-10 w-80 overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Slack Header */}
        <div className="bg-[#4a154b] px-4 py-3 text-sm font-semibold text-white">
          Workspace
        </div>

        <div className="flex h-72">
          {/* Sidebar */}
          <div className="w-28 bg-[#3f0e40] p-3 space-y-1">
            <div 
              ref={slackChannelRef}
              className="rounded bg-[#1164a3] px-2 py-1 text-[11px] text-white"
            >
              # website-chat
            </div>
            <div className="px-2 py-1 text-[11px] text-neutral-300"># support</div>
            <div className="px-2 py-1 text-[11px] text-neutral-300"># general</div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 bg-white p-4 overflow-y-auto">
            <div className="mb-3 text-sm font-bold text-neutral-900"># website-chat</div>
            
            {/* Messages */}
            <div className="space-y-3">
              {/* Visitor message in Slack */}
              <AnimatePresence>
                {slackMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2"
                  >
                    <div className="h-6 w-6 rounded bg-cyan-400 flex-shrink-0"></div>
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-semibold text-neutral-900">Visitor</span>
                        <span className="text-[10px] text-neutral-500">just now</span>
                      </div>
                      <p className="text-xs text-neutral-700">{slackMessage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Agent typing indicator */}
              <AnimatePresence>
                {agentTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2"
                  >
                    <div className="h-6 w-6 rounded bg-green-400 flex-shrink-0"></div>
                    <div className="bg-gray-100 rounded px-3 py-2 flex gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-1.5 h-1.5 rounded-full bg-gray-600"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-gray-600"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-1.5 h-1.5 rounded-full bg-gray-600"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Agent message in Slack */}
              <AnimatePresence>
                {agentMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2"
                  >
                    <div className="h-6 w-6 rounded bg-green-400 flex-shrink-0"></div>
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-semibold text-neutral-900">Sarah Chen</span>
                        <span className="text-[10px] text-neutral-500">just now</span>
                      </div>
                      <p className="text-xs text-neutral-700">{agentMessage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}