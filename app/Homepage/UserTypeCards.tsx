"use client";

import { Paragraph } from "@/components/Paragraph";
import React from "react";

const userTypes = [
  {
    title: "Solo Developers",
    description:
      "Ship faster without the support overhead. Handle customer inquiries while staying in flow—no context switching, no separate tools.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    highlights: ["Zero setup time", "One-person support team", "Focus on building, not managing"],
    accent: "bg-cyan-500",
    iconBg: "bg-cyan-50 text-cyan-700",
    pillBg: "bg-cyan-50 text-cyan-700",
  },
  {
    title: "Small Teams",
    description:
      "Scale your support without scaling your headcount. Collaborate seamlessly in Slack—assign tickets, share context, and resolve issues together.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    highlights: ["Built for collaboration", "Shared visibility", "Instant team coordination"],
    accent: "bg-sky-500",
    iconBg: "bg-sky-50 text-sky-700",
    pillBg: "bg-sky-50 text-sky-700",
  },
  {
    title: "Growing Startups",
    description:
      "Enterprise-level support without the enterprise price tag. Scale from 10 to 10,000 customers with the same elegant workflow.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    highlights: ["Unlimited scalability", "Advanced routing", "Custom workflows"],
    accent: "bg-cyan-400",
    iconBg: "bg-cyan-50 text-cyan-700",
    pillBg: "bg-cyan-50 text-cyan-700",
  },
];

export function UserTypeCards() {
  return (
    <div className=" rounded-xl w-full">
    <Paragraph variant="home-par" className="pt-10">
        Perfect for..
    </Paragraph>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
      {userTypes.map((type) => (
        <div
          key={type.title}
          className="relative flex flex-col "
        >

          {/* Icon + Title */}
          <div className="flex items-center gap-2.5">
            <Paragraph variant="default" className="font-semibold">
              {type.title}
            </Paragraph>
          </div>

          {/* Description */}
          <Paragraph variant="default" className="text-xs text-neutral-500 leading-relaxed">
            {type.description}
          </Paragraph>
        </div>
      ))}
    </div>
    </div>
  );
}