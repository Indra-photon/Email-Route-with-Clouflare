// "use client";

// import React, { useState } from "react";
// import { Grid } from "@/components/VercelGrid";
// import { Heading } from "@/components/Heading";
// import { EmailSlackIllustration } from "./EmailSlackIllustration";
// import { AnimatePresence, motion } from "motion/react";
// import { WebsiteChatIllustration } from "./WebsiteChatIllustration";

// export function HeroSection() {
//   const [activeView, setActiveView] = useState<'email' | 'chat'>('email');
//   return (
//     <section className="w-full min-h-dvh bg-white">
//       <Grid.System unstable_useContainer>
//         <Grid columns={7} rows={5} className="" rowSizes="1fr 1fr 1fr 1fr 1fr" showGrid={true}>
          
//           {/* Main hero content box - left side with background */}
//           <Grid.Cell 
//             column="1/5" 
//             row="2/5"
//             className=" bg-neutral-100 flex items-start md:p-12 lg:py-16 lg:px-8"
//           >
//             <div className="w-full">
//               {/* Heading */}
//               <Heading 
//                 as="h1" 
//                 className="text-neutral-900 mb-6 leading-tight"
//               >
//                 Solve your cutomer tickets from <span className="text-sky-800">Slack.</span> Instant Support with <span className="text-sky-800">small team.</span>
//               </Heading>
              
//               {/* Subheading */}
//               <p className="text-xl md:text-2xl text-neutral-900 font-schibsted font-regular mb-8 leading-relaxed">
//                 Streamline your customer support with our Slack integration. Manage tickets, respond to inquiries, and collaborate with your team without leaving your workspace.
//               </p>
              
//               {/* CTA Buttons */}
//               <div className="flex flex-col sm:flex-row gap-4 mb-10">
//                 <button className="px-6 py-0 bg-neutral-900 text-white font-schibsted font-semibold text-lg rounded-xl transition-all duration-200">
//                   Get Started Free
//                 </button>
//                 <button className="px-8 py-4 bg-white hover:bg-neutral-50 text-neutral-900 font-schibsted font-semibold text-lg rounded-xl border-2 border-neutral-300 transition-all duration-200 hover:border-neutral-400">
//                   See How It Works
//                 </button>
//               </div>
              
//               {/* Social Proof */}
//               <div className="flex items-center gap-4">
//                 <div className="flex -space-x-3">
//                   <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 border-3 border-white shadow-md"></div>
//                   <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-sky-500 border-3 border-white shadow-md"></div>
//                   <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-300 to-cyan-400 border-3 border-white shadow-md"></div>
//                   <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-300 to-sky-400 border-3 border-white shadow-md"></div>
//                 </div>
//                 <span className="text-base font-schibsted font-medium text-neutral-900">
//                   <span className="text-sky-800 font-semibold">500+</span> teams already using
//                 </span>
//               </div>
//             </div>
//           </Grid.Cell>

//           {/* Right side - SVG area */}
//           <Grid.Cell 
//             column="5/8" 
//             row="1/6"
//             className="relative flex flex-col items-center justify-center gap-4"
//           >
//             {/* Toggle Buttons */}
//             <div className="flex gap-2 bg-neutral-100 p-1 rounded-lg">
//               <button
//                 onClick={() => setActiveView('email')}
//                 className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
//                   activeView === 'email'
//                     ? 'bg-white text-neutral-900 shadow-sm'
//                     : 'text-neutral-600 hover:text-neutral-900'
//                 }`}
//               >
//                 Email Router
//               </button>
//               <button
//                 onClick={() => setActiveView('chat')}
//                 className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
//                   activeView === 'chat'
//                     ? 'bg-white text-neutral-900 shadow-sm'
//                     : 'text-neutral-600 hover:text-neutral-900'
//                 }`}
//               >
//                 Live Chat
//               </button>
//             </div>

//         {/* Illustration Container */}
//           <motion.div
//           layout
//           transition={{ duration: 0.9, type: "spring", stiffness: 100, damping: 20 }}
//           className="bg-white/75 ring-neutral-300 shadow-black/6.5 overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md ring-1 relative">
//             <motion.div className="bg-white ring-neutral-200 shadow-black/6.5 overflow-hidden rounded-t-[2rem] shadow ring-1 p-8 h-[600px] w-[450px]">
//             <AnimatePresence mode="wait">
//               {activeView === 'email' ? (
//                 <motion.div
//                   key="email"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <EmailSlackIllustration />
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   key="chat"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <WebsiteChatIllustration />
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//           {/* Bottom fade mask */}
//           <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none"></div>
//         </motion.div>
//       </Grid.Cell>
          
//         </Grid>
//       </Grid.System>
//     </section>
//   );
// }

"use client";

import React, { useState } from "react";
import { Grid } from "@/components/VercelGrid";
import { Heading } from "@/components/Heading";
import { EmailSlackIllustration } from "./EmailSlackIllustration";
import { AnimatePresence, motion } from "motion/react";
import { WebsiteChatIllustration } from "./WebsiteChatIllustration";
import { Container } from "@/components/Container";

export function HeroSection() {
  const [activeView, setActiveView] = useState<'email' | 'chat'>('email');
  
  return (
    <Container className="min-h-dvh bg-white">
      {/* Desktop Grid Layout (lg and above) */}
      <div className="hidden lg:block">
        <Grid.System unstable_useContainer>
          <Grid columns={7} rows={6} className="" rowSizes="0.5fr 1fr 1fr 1fr 1fr 0.5fr" showGrid={false}>
            
            {/* Main hero content box - left side with background */}
            <Grid.Cell 
              column="1/5" 
              row="2/6"
              className="bg-white flex items-start p-12 lg:py-16 lg:px-8"
            >
              <div className="w-full">
                {/* Heading */}
                <Heading 
                  as="h1" 
                  className="text-neutral-900 mb-6 leading-tight"
                >
                  Solve your customer tickets from <span className="text-sky-800">Slack.</span> Instant Support with <span className="text-sky-800">small team.</span>
                </Heading>
                
                {/* Subheading */}
                <p className="text-xl md:text-2xl text-neutral-900 font-schibsted font-regular mb-8 leading-relaxed">
                  Streamline your customer support with our Slack integration. Manage tickets, respond to inquiries, and collaborate with your team without leaving your workspace.
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <button className="px-6 py-4 bg-neutral-900 text-white font-schibsted font-semibold text-lg rounded-xl transition-all duration-200 hover:bg-neutral-800">
                    Get Started Free
                  </button>
                  <button className="px-8 py-4 bg-white hover:bg-neutral-50 text-neutral-900 font-schibsted font-semibold text-lg rounded-xl border-2 border-neutral-300 transition-all duration-200 hover:border-neutral-400">
                    See How It Works
                  </button>
                </div>
                
                {/* Social Proof */}
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 border-3 border-white shadow-md"></div>
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-sky-500 border-3 border-white shadow-md"></div>
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-300 to-cyan-400 border-3 border-white shadow-md"></div>
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-300 to-sky-400 border-3 border-white shadow-md"></div>
                  </div>
                  <span className="text-base font-schibsted font-medium text-neutral-900">
                    <span className="text-sky-800 font-semibold">500+</span> teams already using
                  </span>
                </div>
              </div>
            </Grid.Cell>

            {/* Right side - Illustration */}
            <Grid.Cell 
              column="5/8" 
              row="2/6"
              className="relative flex flex-col items-center justify-center gap-4"
            >
              {/* Toggle Buttons */}
              <div className="flex gap-2 bg-neutral-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveView('email')}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                    activeView === 'email'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Email Router
                </button>
                <button
                  onClick={() => setActiveView('chat')}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                    activeView === 'chat'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Live Chat
                </button>
              </div>

              {/* Illustration Container */}
              <motion.div
                layout
                transition={{ duration: 0.9, type: "spring", stiffness: 100, damping: 20 }}
                className="bg-white/75 ring-neutral-300  shadow-black/6.5 overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md ring-1 relative"
              >
                <motion.div className="bg-white ring-neutral-200 shadow-black/6.5 overflow-hidden rounded-t-[2rem] shadow ring-1 p-8 h-[600px] w-[450px]">
                  <AnimatePresence mode="wait">
                    {activeView === 'email' ? (
                      <motion.div
                        key="email"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <EmailSlackIllustration />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="chat"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <WebsiteChatIllustration />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </Grid.Cell>
          </Grid>
        </Grid.System>
      </div>

      {/* Tablet Layout (md to lg) */}
      <div className="hidden md:block lg:hidden">
        <div className="container mx-auto px-6 py-16">
          {/* Text Content */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Heading 
              as="h1" 
              className="text-neutral-900 mb-6 leading-tight text-4xl"
            >
              Solve your customer tickets from <span className="text-sky-800">Slack.</span> Instant Support with <span className="text-sky-800">small team.</span>
            </Heading>
            
            <p className="text-lg text-neutral-900 font-schibsted font-regular mb-8 leading-relaxed">
              Streamline your customer support with our Slack integration. Manage tickets, respond to inquiries, and collaborate with your team without leaving your workspace.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center">
              <button className="px-6 py-4 bg-neutral-900 text-white font-schibsted font-semibold text-lg rounded-xl transition-all duration-200 hover:bg-neutral-800">
                Get Started Free
              </button>
              <button className="px-8 py-4 bg-white hover:bg-neutral-50 text-neutral-900 font-schibsted font-semibold text-lg rounded-xl border-2 border-neutral-300 transition-all duration-200 hover:border-neutral-400">
                See How It Works
              </button>
            </div>
            
            {/* Social Proof */}
            <div className="flex items-center gap-4 justify-center">
              <div className="flex -space-x-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 border-3 border-white shadow-md"></div>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-sky-500 border-3 border-white shadow-md"></div>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-300 to-cyan-400 border-3 border-white shadow-md"></div>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-300 to-sky-400 border-3 border-white shadow-md"></div>
              </div>
              <span className="text-base font-schibsted font-medium text-neutral-900">
                <span className="text-sky-800 font-semibold">500+</span> teams already using
              </span>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex flex-col items-center gap-6">
            {/* Toggle Buttons */}
            <div className="flex gap-2 bg-neutral-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveView('email')}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                  activeView === 'email'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Email Router
              </button>
              <button
                onClick={() => setActiveView('chat')}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                  activeView === 'chat'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Live Chat
              </button>
            </div>

            {/* Illustration Container - Scaled down */}
            <motion.div
              layout
              transition={{ duration: 0.9, type: "spring", stiffness: 100, damping: 20 }}
              className="bg-white/75 ring-neutral-300 shadow-black/6.5 overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md ring-1 relative"
            >
              <motion.div className="bg-white ring-neutral-200 shadow-black/6.5 overflow-hidden rounded-t-[2rem] shadow ring-1 p-6 h-[500px] w-[380px]">
                <AnimatePresence mode="wait">
                  {activeView === 'email' ? (
                    <motion.div
                      key="email"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="scale-90 origin-top"
                    >
                      <EmailSlackIllustration />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="scale-90 origin-top"
                    >
                      <WebsiteChatIllustration />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Layout (< md) */}
      <div className="block md:hidden">
        <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col justify-center">
          {/* Text Content */}
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6 leading-tight font-schibsted">
              Solve your customer tickets from <span className="text-sky-800">Slack.</span>
            </h1>
            
            <p className="text-base sm:text-lg text-neutral-700 font-schibsted mb-8 leading-relaxed">
              Streamline your customer support with our Slack integration. Respond instantly without leaving your workspace.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mb-8">
              <button className="w-full px-6 py-4 bg-neutral-900 text-white font-schibsted font-semibold text-base rounded-xl transition-all duration-200 hover:bg-neutral-800">
                Get Started Free
              </button>
              <button className="w-full px-6 py-4 bg-white hover:bg-neutral-50 text-neutral-900 font-schibsted font-semibold text-base rounded-xl border-2 border-neutral-300 transition-all duration-200 hover:border-neutral-400">
                See How It Works
              </button>
            </div>
            
            {/* Social Proof */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 border-2 border-white shadow-md"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-500 border-2 border-white shadow-md"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-300 to-cyan-400 border-2 border-white shadow-md"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-300 to-sky-400 border-2 border-white shadow-md"></div>
              </div>
              <span className="text-sm font-schibsted font-medium text-neutral-900">
                <span className="text-sky-800 font-semibold">500+</span> teams already using
              </span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}