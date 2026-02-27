// "use client";

// import React from "react";
// import { Grid } from "@/components/VercelGrid";
// import { Heading } from "@/components/Heading";

// const benefits = [
//   {
//     id: 1,
//     metric: "75%",
//     title: "Faster response time",
//     description: "Respond to customers in minutes, not hours",
//     company: "TechFlow",
//     companyLogo: null,
//   },
//   {
//     id: 2,
//     metric: "3x",
//     title: "More tickets handled",
//     description: "Same team, triple the productivity",
//     company: "StartupHub",
//     companyLogo: null,
//   },
//   {
//     id: 3,
//     metric: "60%",
//     title: "Reduction in support costs",
//     description: "Eliminate expensive helpdesk software",
//     company: "GrowthCo",
//     companyLogo: null,
//   },
//   {
//     id: 4,
//     metric: "4.8/5",
//     title: "Customer satisfaction",
//     description: "Happy customers, loyal customers",
//     company: "CloudSync",
//     companyLogo: null,
//   },
//   {
//     id: 5,
//     metric: "5min",
//     title: "Setup time",
//     description: "Start supporting in minutes, not days",
//     company: "DevTools",
//     companyLogo: null,
//   },
//   {
//     id: 6,
//     metric: "100%",
//     title: "Ticket capture rate",
//     description: "Never miss a customer inquiry",
//     company: "SupportPro",
//     companyLogo: null,
//   },
// ];

// export function BenefitsSection() {
//   return (
//     <section className="w-full bg-white">
//       {/* Desktop Layout */}
//       <div className="hidden lg:block">
//         <Grid.System unstable_useContainer>
//           <div className="w-full">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0 ">
//               <Heading 
//                   as="h3" 
//                   className="text-neutral-900 mb-6 leading-tight font-semibold"
//               >
//                   Solve your customer tickets, resolve customer queries, and get billing, leads, seperately
//               </Heading>
//               <h4 className="text-xl md:text-2xl text-neutral-900 font-schibsted font-regular mb-8 leading-relaxed">
//                 Support teams deliver faster responses with Slack integration.
//               </h4>
              
//               <div className="border-y border-neutral-200">
//                 <div className="grid grid-cols-3 border-x border-neutral-200">
//                   {benefits.map((benefit, index) => (
//                     <div
//                       key={benefit.id}
//                       className={`group relative p-8 pb-0 overflow-hidden border-neutral-200 ${
//                         index % 3 !== 2 ? 'border-r' : ''
//                       } ${index < 3 ? 'border-b' : ''}`}
//                     >
//                       {/* Content */}
//                       <div className="flex flex-col pb-16">
//                         <span className="text-5xl font-schibsted font-bold tracking-tight mb-1 text-sky-800">
//                           {benefit.metric}
//                         </span>
//                         <p className="text-base font-schibsted font-semibold text-neutral-900 mb-1">
//                           {benefit.title}
//                         </p>
//                         <p className="text-sm font-schibsted font-normal text-neutral-900">
//                           {benefit.description}
//                         </p>
//                       </div>

//                       {/* Hover decoration */}
//                       <div className="absolute bottom-0 right-8 w-32 h-32 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Grid.System>
//       </div>

//       {/* Tablet Layout */}
//       <div className="hidden md:block lg:hidden">
//         <div className="max-w-5xl mx-auto px-6 py-12">
//           <h2 className="text-2xl md:text-3xl font-schibsted font-semibold tracking-tight leading-tight mb-10 text-neutral-900">
//             Support teams deliver faster responses with Slack integration.
//           </h2>
          
//           <div className="border-y border-neutral-200">
//             <div className="grid grid-cols-2 border-x border-neutral-200">
//               {benefits.map((benefit, index) => (
//                 <div
//                   key={benefit.id}
//                   className={`relative p-6 pb-0 overflow-hidden border-neutral-200 ${
//                     index % 2 !== 1 ? 'border-r' : ''
//                   } ${index < 4 ? 'border-b' : ''}`}
//                 >
//                   <div className="flex flex-col pb-12">
//                     <span className="text-4xl font-schibsted font-light tracking-tight mb-1 text-sky-700">
//                       {benefit.metric}
//                     </span>
//                     <p className="text-sm font-schibsted font-semibold text-sky-900 mb-1">
//                       {benefit.title}
//                     </p>
//                     <p className="text-xs font-schibsted font-normal text-neutral-600">
//                       {benefit.description}
//                     </p>
//                   </div>
                  
//                   <div className="absolute bottom-6 left-6">
//                     <span className="text-xs font-schibsted font-medium text-neutral-500">
//                       {benefit.company}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Layout */}
//       <div className="block md:hidden">
//         <div className="container mx-auto px-4 py-10">
//           <h2 className="text-xl sm:text-2xl font-schibsted font-semibold tracking-tight leading-tight mb-8 text-neutral-900">
//             Support teams deliver faster responses with Slack integration.
//           </h2>
          
//           <div className="border-y border-neutral-200">
//             <div className="grid grid-cols-1 border-x border-neutral-200">
//               {benefits.map((benefit, index) => (
//                 <div
//                   key={benefit.id}
//                   className={`relative p-6 pb-0 overflow-hidden ${
//                     index !== benefits.length - 1 ? 'border-b' : ''
//                   } border-neutral-200`}
//                 >
//                   <div className="flex flex-col pb-12">
//                     <span className="text-3xl font-schibsted font-light tracking-tight mb-1 text-sky-700">
//                       {benefit.metric}
//                     </span>
//                     <p className="text-sm font-schibsted font-semibold text-sky-900 mb-1">
//                       {benefit.title}
//                     </p>
//                     <p className="text-xs font-schibsted font-normal text-neutral-600">
//                       {benefit.description}
//                     </p>
//                   </div>
                  
//                   <div className="absolute bottom-6 left-6">
//                     <span className="text-xs font-schibsted font-medium text-neutral-500">
//                       {benefit.company}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import React from "react";
import { Grid } from "@/components/VercelGrid";
import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";

const benefits = [
  {
    id: 1,
    metric: "75%",
    title: "Faster response time",
    description: "Respond to customers in minutes, not hours",
    company: "TechFlow",
    companyLogo: null,
    decoration: "waves",
  },
  {
    id: 2,
    metric: "3x",
    title: "More tickets handled",
    description: "Same team, triple the productivity",
    company: "StartupHub",
    companyLogo: null,
    decoration: "bubbles",
  },
  {
    id: 3,
    metric: "60%",
    title: "Reduction in support costs",
    description: "Eliminate expensive helpdesk software",
    company: "GrowthCo",
    companyLogo: null,
    decoration: "layers",
  },
  {
    id: 4,
    metric: "4.8/5",
    title: "Customer satisfaction",
    description: "Happy customers, loyal customers",
    company: "CloudSync",
    companyLogo: null,
    decoration: "target",
  },
  {
    id: 5,
    metric: "5min",
    title: "Setup time",
    description: "Start supporting in minutes, not days",
    company: "DevTools",
    companyLogo: null,
    decoration: "pulse",
  },
  {
    id: 6,
    metric: "100%",
    title: "Ticket capture rate",
    description: "Never miss a customer inquiry",
    company: "SupportPro",
    companyLogo: null,
    decoration: "rings",
  },
];

// Decoration Components
const WavesDecoration = ({ isHovered }: { isHovered: boolean }) => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="absolute top-0 right-0">
    <motion.path
      d="M 60 0 A 60 60 0 0 1 120 60 L 120 0 Z"
      fill="#E0F2FE"
      initial={{ scale: 1, opacity: 0.3 }}
      animate={isHovered ? { scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] } : { scale: 1, opacity: 0.3 }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.path
      d="M 80 0 A 40 40 0 0 1 120 40 L 120 0 Z"
      fill="#38BDF8"
      initial={{ scale: 1, opacity: 0.4 }}
      animate={isHovered ? { scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] } : { scale: 1, opacity: 0.4 }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
    />
    <motion.path
      d="M 100 0 A 20 20 0 0 1 120 20 L 120 0 Z"
      fill="#0EA5E9"
      initial={{ scale: 1, opacity: 0.5 }}
      animate={isHovered ? { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] } : { scale: 1, opacity: 0.5 }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
    />
  </svg>
);

const BubblesDecoration = ({ isHovered }: { isHovered: boolean }) => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="absolute top-0 right-0">
    <motion.path
      d="M 80 0 A 40 40 0 0 1 120 40 L 120 0 Z"
      fill="#FED7AA"
      initial={{ rotate: 0, scale: 1 }}
      animate={isHovered ? { rotate: [0, 5, 0], scale: [1, 1.05, 1] } : { rotate: 0, scale: 1 }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.path
      d="M 90 10 A 30 30 0 0 1 120 40 L 120 10 Z"
      fill="#FB923C"
      initial={{ rotate: 0, scale: 1 }}
      animate={isHovered ? { rotate: [0, -5, 0], scale: [1, 1.08, 1] } : { rotate: 0, scale: 1 }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    />
    <motion.path
      d="M 100 20 A 20 20 0 0 1 120 40 L 120 20 Z"
      fill="#F97316"
      initial={{ rotate: 0, scale: 1 }}
      animate={isHovered ? { rotate: [0, 3, 0], scale: [1, 1.1, 1] } : { rotate: 0, scale: 1 }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
  </svg>
);

const LayersDecoration = ({ isHovered }: { isHovered: boolean }) => (
  <svg width="120" height="100" viewBox="0 0 120 100" className="absolute top-0 right-0">
    <motion.rect
      x="40"
      y="0"
      width="80"
      height="30"
      rx="15"
      fill="#E0E7FF"
      initial={{ x: 40, opacity: 0.4 }}
      animate={isHovered ? { x: [40, 35, 40], opacity: [0.4, 0.7, 0.4] } : { x: 40, opacity: 0.4 }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.rect
      x="50"
      y="25"
      width="70"
      height="30"
      rx="15"
      fill="#A78BFA"
      initial={{ x: 50, opacity: 0.5 }}
      animate={isHovered ? { x: [50, 45, 50], opacity: [0.5, 0.8, 0.5] } : { x: 50, opacity: 0.5 }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
    />
    <motion.rect
      x="60"
      y="50"
      width="60"
      height="30"
      rx="15"
      fill="#7C3AED"
      initial={{ x: 60, opacity: 0.6 }}
      animate={isHovered ? { x: [60, 55, 60], opacity: [0.6, 0.9, 0.6] } : { x: 60, opacity: 0.6 }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
    />
  </svg>
);

const TargetDecoration = ({ isHovered }: { isHovered: boolean }) => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="absolute -top-5 -right-5">
    <motion.circle
      cx="90"
      cy="30"
      r="30"
      fill="#FEF9C3"
      initial={{ scale: 1, opacity: 0.3 }}
      animate={isHovered ? { scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] } : { scale: 1, opacity: 0.3 }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.circle
      cx="90"
      cy="30"
      r="20"
      fill="#FBBF24"
      initial={{ scale: 1, opacity: 0.5 }}
      animate={isHovered ? { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] } : { scale: 1, opacity: 0.5 }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
    />
    <motion.circle
      cx="90"
      cy="30"
      r="10"
      fill="#F59E0B"
      initial={{ scale: 1, opacity: 0.7 }}
      animate={isHovered ? { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] } : { scale: 1, opacity: 0.7 }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
    />
  </svg>
);

const PulseDecoration = ({ isHovered }: { isHovered: boolean }) => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="absolute top-0 right-0">
    <motion.path
      d="M 60 0 Q 120 0 120 60 L 120 0 Z"
      fill="#DBEAFE"
      initial={{ scale: 1, opacity: 0.3 }}
      animate={isHovered ? { scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] } : { scale: 1, opacity: 0.3 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.path
      d="M 80 0 Q 120 0 120 40 L 120 0 Z"
      fill="#93C5FD"
      initial={{ scale: 1, opacity: 0.5 }}
      animate={isHovered ? { scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] } : { scale: 1, opacity: 0.5 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
    />
    <motion.path
      d="M 100 0 Q 120 0 120 20 L 120 0 Z"
      fill="#3B82F6"
      initial={{ scale: 1, opacity: 0.7 }}
      animate={isHovered ? { scale: [1, 1.15, 1], opacity: [0.7, 0.9, 0.7] } : { scale: 1, opacity: 0.7 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
    />
  </svg>
);

const RingsDecoration = ({ isHovered }: { isHovered: boolean }) => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="absolute -top-5 -right-5">
    <motion.circle
      cx="90"
      cy="30"
      r="28"
      fill="none"
      stroke="#D1FAE5"
      strokeWidth="4"
      initial={{ scale: 1, opacity: 0.4 }}
      animate={isHovered ? { scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] } : { scale: 1, opacity: 0.4 }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.circle
      cx="90"
      cy="30"
      r="18"
      fill="none"
      stroke="#6EE7B7"
      strokeWidth="4"
      initial={{ scale: 1, opacity: 0.6 }}
      animate={isHovered ? { scale: [1, 1.25, 1], opacity: [0.6, 0.9, 0.6] } : { scale: 1, opacity: 0.6 }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    />
    <motion.circle
      cx="90"
      cy="30"
      r="8"
      fill="#10B981"
      initial={{ scale: 1, opacity: 0.8 }}
      animate={isHovered ? { scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] } : { scale: 1, opacity: 0.8 }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
  </svg>
);

const DecorationRenderer = ({ type, isHovered }: { type: string; isHovered: boolean }) => {
  switch (type) {
    case "waves":
      return <WavesDecoration isHovered={isHovered} />;
    case "bubbles":
      return <BubblesDecoration isHovered={isHovered} />;
    case "layers":
      return <LayersDecoration isHovered={isHovered} />;
    case "target":
      return <TargetDecoration isHovered={isHovered} />;
    case "pulse":
      return <PulseDecoration isHovered={isHovered} />;
    case "rings":
      return <RingsDecoration isHovered={isHovered} />;
    default:
      return null;
  }
};

export function BenefitsSection() {
  const [hoveredCard, setHoveredCard] = React.useState<number | null>(null);

  return (
    <section className="w-full bg-white">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <Grid.System unstable_useContainer>
          <div className="w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0 py-16">
              <Heading 
                as="h2" 
                className="text-neutral-900 mb-4 leading-tight font-semibold"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: [.25, .46, .45, .94], delay: 0.2 }}
                >
                Real results. Real teams. Real fast.
                </motion.div>
              </Heading>
              <p className="text-lg md:text-xl text-neutral-600 font-schibsted font-normal mb-12 leading-relaxed max-w-3xl">
                From startups to scale-ups, teams using our platform see dramatic improvements in response times, ticket handling, and customer satisfaction—without adding headcount.
              </p>
              
              <div className="border-y border-neutral-200 relative overflow-hidden ">
                <div className="grid grid-cols-3 border-x border-neutral-200 overflow-hidden">
                  {benefits.map((benefit, index) => (
                    <div
                      key={benefit.id}
                      onMouseEnter={() => setHoveredCard(benefit.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className={`group relative p-8 pb-0 border-neutral-200 overflow-hidden ${
                        index % 3 !== 2 ? 'border-r' : ''
                      } ${index < 3 ? 'border-b' : ''}`}
                    >
                      {/* Animated Decoration */}
                      <DecorationRenderer 
                        type={benefit.decoration} 
                        isHovered={hoveredCard === benefit.id}
                      />

                      {/* Content */}
                      <div className="flex flex-col pb-16 relative z-10">
                        <span className="text-5xl font-schibsted font-bold tracking-tight mb-1 text-sky-800">
                          {benefit.metric}
                        </span>
                        <p className="text-base font-schibsted font-semibold text-neutral-900 mb-1">
                          {benefit.title}
                        </p>
                        <p className="text-sm font-schibsted font-normal text-neutral-900">
                          {benefit.description}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Grid.System>
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:block lg:hidden">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="text-2xl md:text-3xl font-schibsted font-semibold tracking-tight leading-tight mb-4 text-neutral-900">
            Real results. Real teams. Real fast.
          </h2>
          <p className="text-base md:text-lg text-neutral-600 font-schibsted font-normal mb-10 leading-relaxed">
            From startups to scale-ups, teams using our platform see dramatic improvements in response times, ticket handling, and customer satisfaction—without adding headcount.
          </p>
          
          <div className="border-y border-neutral-200">
            <div className="grid grid-cols-2 border-x border-neutral-200">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.id}
                  className={`relative p-6 pb-0 overflow-hidden border-neutral-200 ${
                    index % 2 !== 1 ? 'border-r' : ''
                  } ${index < 4 ? 'border-b' : ''}`}
                >
                  <div className="flex flex-col pb-12">
                    <span className="text-4xl font-schibsted font-light tracking-tight mb-1 text-sky-700">
                      {benefit.metric}
                    </span>
                    <p className="text-sm font-schibsted font-semibold text-sky-900 mb-1">
                      {benefit.title}
                    </p>
                    <p className="text-xs font-schibsted font-normal text-neutral-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="container mx-auto px-4 py-10">
          <h2 className="text-xl sm:text-2xl font-schibsted font-semibold tracking-tight leading-tight mb-3 text-neutral-900">
            Real results. Real teams. Real fast.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-schibsted font-normal mb-8 leading-relaxed">
            From startups to scale-ups, teams using our platform see dramatic improvements in response times, ticket handling, and customer satisfaction—without adding headcount.
          </p>
          
          <div className="border-y border-neutral-200">
            <div className="grid grid-cols-1 border-x border-neutral-200">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.id}
                  className={`relative p-6 pb-0 overflow-hidden ${
                    index !== benefits.length - 1 ? 'border-b' : ''
                  } border-neutral-200`}
                >
                  <div className="flex flex-col pb-12">
                    <span className="text-3xl font-schibsted font-light tracking-tight mb-1 text-sky-700">
                      {benefit.metric}
                    </span>
                    <p className="text-sm font-schibsted font-semibold text-sky-900 mb-1">
                      {benefit.title}
                    </p>
                    <p className="text-xs font-schibsted font-normal text-neutral-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}