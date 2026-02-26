// "use client";

// import React, { useState } from "react";
// import { SitemapIcon, MessagesIcon, StackPerspectiveIcon } from "../../constants/icons";
// import { EmailToSlackIllustration } from "./EmailToSlackIllustration";
// import { ChatToSlackIllustration } from "./ChatToSlackIllustration";
// import { Heading } from "@/components/Heading";
// import { IntegrationsStackIllustration } from "./Integrationsstackillustration";

// const features = [
//   {
//     id: 1,
//     title: "Smart email routing to Slack channels",
//     description: "Automatically route support@, billing@, and sales@ emails to dedicated Slack channels. Never miss an inquiry.",
//     Icon: SitemapIcon,
//     Illustration: EmailToSlackIllustration,
//   },
//   {
//     id: 2,
//     title: "Live chat widget with instant Slack notifications",
//     description: "Embed a chat widget on your website. Customer messages appear instantly in Slack for real-time responses.",
//     Icon: MessagesIcon,
//     Illustration: ChatToSlackIllustration,
//   },
//   {
//     id: 3,
//     title: "Discord and Slack integrations",
//     description: "Connect your workspaces. Manage all customer conversations from one unified platform.",
//     Icon: StackPerspectiveIcon,
//     Illustration: IntegrationsStackIllustration,
//   },
// ];

// interface FeatureCardProps {
//   title: string;
//   description: string;
//   Icon: React.FC<{ x?: number; y?: number; rotation?: number; scale?: number }>;
//   Illustration: React.FC | null;
// }

// const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, Icon, Illustration }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       className="relative flex flex-col min-h-[280px] lg:min-h-[340px] rounded-lg overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-all duration-300 bg-neutral-50 hover:shadow-lg group"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Text Content - Absolute positioned at top */}
//       <div className=" p-6 lg:p-8 z-10">
//         <div className="flex items-start gap-3 lg:gap-4 mb-3">
//           {/* Icon wrapper with animation */}
//           <div className="">
//             <Icon
//               x={isHovered ? 4 : 0}
//               y={isHovered ? -2 : 0}
//               // rotation={isHovered ? 5 : 0}
//               // scale={isHovered ? 1.1 : 1}
//             />
//           </div>
          
//           <h3 className="flex-1 text-lg lg:text-xl font-schibsted font-semibold tracking-tight text-neutral-900">
//             {title}
//           </h3>
//         </div>
        
//         <p className="text-sm lg:text-base font-schibsted font-normal text-neutral-600 leading-relaxed pl-0">
//           {description}
//         </p>
//       </div>

//       {/* Visual placeholder or Illustration - Full height */}
//       <div className="h-full flex items-end justify-center p-6">
//         {
//           Illustration && <Illustration />
//         }
//       </div>
//     </div>
//   );
// };

// export function FeaturesSection() {
//   return (
//     <section className="w-full bg-white py-16 md:py-20 lg:py-24">
//       <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-0">
//         {/* Section Heading */}
//         <Heading 
//           as="h2" 
//           className="text-neutral-900 mb-4 leading-tight font-semibold"
//         >
//           Turn every channel into a conversation.
//         </Heading>
//         <p className="text-lg md:text-xl text-neutral-600 font-schibsted font-normal mb-12 leading-relaxed max-w-3xl">
//           Route emails, capture live chat, and unify Discord & Slack—all in one place. Your team responds faster when everything flows to where they already work.
//         </p>

//         {/* Features Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
//           {features.map((feature) => (
//             <FeatureCard
//               key={feature.id}
//               title={feature.title}
//               description={feature.description}
//               Icon={feature.Icon}
//               Illustration={feature.Illustration}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import React, { useState } from "react";
import { SitemapIcon, MessagesIcon, StackPerspectiveIcon, UsersIcon, AnalyticsIcon } from "../../constants/icons";
import { EmailToSlackIllustration } from "./EmailToSlackIllustration";
import { ChatToSlackIllustration } from "./ChatToSlackIllustration";
import { Heading } from "@/components/Heading";
import { IntegrationsStackIllustration } from "./Integrationsstackillustration";
import { AnalyticsKanbanIllustration } from "./AnalyticsKanbanIllustration";
import { PricingBenefitsIllustration } from "./PricingBenefitsIllustration";

const features = [
  {
    id: 1,
    title: "Smart email routing to Slack channels",
    description: "Automatically route support@, billing@, and sales@ emails to dedicated Slack channels. Never miss an inquiry.",
    Icon: SitemapIcon,
    Illustration: EmailToSlackIllustration,
    span: "col-span-1",
  },
  {
    id: 2,
    title: "Live chat widget with instant Slack notifications",
    description: "Embed a chat widget on your website. Customer messages appear instantly in Slack for real-time responses.",
    Icon: MessagesIcon,
    Illustration: ChatToSlackIllustration,
    span: "col-span-1",
  },
  {
    id: 3,
    title: "Discord and Slack integrations",
    description: "Connect your workspaces. Manage all customer conversations from one unified platform.",
    Icon: StackPerspectiveIcon,
    Illustration: IntegrationsStackIllustration,
    span: "col-span-1",
  },
  {
    id: 4,
    title: "Analytics dashboard for customer insights",
    description: "Track response times, conversation volume, and customer satisfaction. Get actionable insights to improve your support quality and team performance.",
    Icon: AnalyticsIcon, // Temporary, will be replaced
    Illustration: AnalyticsKanbanIllustration,
    span: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    id: 5,
    title: "No extra cost per team member",
    description: "Add unlimited team members at no additional charge. Scale your support team without worrying about per-seat pricing.",
    Icon: UsersIcon, // Temporary, will be replaced
    Illustration: PricingBenefitsIllustration,
    span: "col-span-1",
  },
];

interface FeatureCardProps {
  title: string;
  description: string;
  Icon: React.FC<{ x?: number; y?: number; rotation?: number; scale?: number }>;
  Illustration: React.FC | null;
  span: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, Icon, Illustration, span }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative flex flex-col min-h-[280px] lg:min-h-[340px] rounded-lg overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-all duration-300 bg-neutral-50 hover:shadow-lg group ${span}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Text Content - Absolute positioned at top */}
      <div className="p-6 lg:p-8 z-10">
        <div className="flex items-start gap-3 lg:gap-4 mb-3">
          {/* Icon wrapper with animation */}
          <div className="">
            <Icon
              x={isHovered ? 4 : 0}
              y={isHovered ? -2 : 0}
            />
          </div>
          
          <h3 className="flex-1 text-lg lg:text-xl font-schibsted font-semibold tracking-tight text-sky-800">
            {title}
          </h3>
        </div>
        
        <p className="text-sm lg:text-base font-schibsted font-normal text-neutral-600 leading-relaxed pl-0">
          {description}
        </p>
      </div>

      {/* Visual placeholder or Illustration - Full height */}
      {Illustration && (
        <div className="h-full flex items-end justify-center p-6">
          <Illustration />
        </div>
      )}

      {/* Placeholder for cards without illustrations */}
      {!Illustration && (
        <div className="h-full flex items-end justify-center p-6">
          <div className="w-full h-32 lg:h-40 bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-100 rounded-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        </div>
      )}
    </div>
  );
};

export function FeaturesSection() {
  return (
    <section className="w-full bg-white py-16 md:py-20 lg:py-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-0">
        {/* Section Heading */}
        <Heading 
          as="h2" 
          className="text-neutral-900 mb-4 leading-tight font-semibold"
        >
          Turn every channel into a conversation.
        </Heading>
        <p className="text-lg md:text-xl text-neutral-600 font-schibsted font-normal mb-12 leading-relaxed max-w-3xl">
          Route emails, capture live chat, and unify Discord & Slack—all in one place. Your team responds faster when everything flows to where they already work.
        </p>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              Icon={feature.Icon}
              Illustration={feature.Illustration}
              span={feature.span}
            />
          ))}
        </div>
      </div>
    </section>
  );
}