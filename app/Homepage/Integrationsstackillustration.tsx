'use client';

import { motion } from "motion/react";
import React, { useState, useEffect } from "react";

const EASING = {
  outQuad: [0.25, 0.46, 0.45, 0.94],
  outCubic: [0.215, 0.61, 0.355, 1],
  outQuart: [0.165, 0.84, 0.44, 1],
} as const;

interface CardData {
  id: number;
  platform: string;
  logo: React.ReactNode;
  channel: string;
  messageCount: string;
  color: string;
}

const cards: CardData[] = [
  {
    id: 1,
    platform: "Microsoft Teams",
    channel: "Customer Support",
    messageCount: "567",
    color: "#5B5FC7",
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20.625 8.127h-7.5v7.5h7.5v-7.5zM11.25 2.252h-7.5v7.5h7.5v-7.5zM20.625 17.502h-7.5v4.246h3.75a3.75 3.75 0 0 0 3.75-3.75v-.496zM11.25 11.627h-7.5v10.121h7.5V11.627z" />
      </svg>
    ),
  },
  {
    id: 2,
    platform: "Discord",
    channel: "#support",
    messageCount: "892",
    color: "#5865F2",
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    id: 3,
    platform: "Slack",
    channel: "#general",
    messageCount: "1,284",
    color: "#4A154B",
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-5zM9 6a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5zm9 2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5zm-2 9a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5z" />
      </svg>
    ),
  },
];

export const IntegrationsStackIllustration: React.FC = () => {
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCards(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center py-12"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <div aria-hidden="true" className="relative">
        <div className="mask-b-from-65% relative -mx-4 px-4 pt-14">
          {/* Stacked Cards */}
          <div className="relative">
            {cards.map((card, index) => {
              const isLast = index === cards.length - 1;
              const translateY = isLast ? 0 : (cards.length - 1 - index) * 24;
              const delay = index * 0.15;

              return (
                <motion.div
                  key={card.id}
                  className="relative z-10 overflow-hidden rounded-2xl border border-neutral-200 p-6 text-sm shadow-xl ring-1 ring-neutral-200/80 bg-white"
                  style={{
                    position: index === 0 ? "relative" : "absolute",
                    top: index === 0 ? 0 : 0,
                    left: 0,
                    right: 0,
                    width: "100%",
                  }}
                  initial={{
                    y: 0,
                    opacity: 0,
                    scale: 0.95,
                  }}
                  animate={{
                    y: showCards ? -translateY : 0,
                    opacity: showCards ? 1 : 0,
                    scale: showCards ? 1 : 0.95,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: delay,
                    ease: EASING.outQuart,
                  }}
                >
                  {/* Card Header */}
                  <div className="mb-6 flex items-start justify-between gap-8">
                    <div className="space-y-0.5">
                      {/* Platform Logo and Name */}
                      <div className="flex items-center gap-2" style={{ color: card.color }}>
                        {card.logo}
                        <span className="font-semibold text-sm text-neutral-900">
                          {card.platform}
                        </span>
                      </div>

                      {/* Channel Info */}
                      <div className="mt-4 font-mono text-xs text-neutral-600">
                        {card.channel}
                      </div>

                      {/* Message Count */}
                      <div className="mt-1 -translate-x-1 font-mono text-2xl font-semibold text-neutral-900">
                        {card.messageCount}
                      </div>

                      {/* Status */}
                      <div className="text-xs font-medium text-neutral-600">
                        messages today
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      aria-hidden="true"
                      className="bg-neutral-50 ring-neutral-200 shadow-md ring-1 w-16 space-y-2 rounded-md p-2"
                    >
                      {/* Active indicator */}
                      <div className="flex items-center gap-1">
                        <div className="bg-green-500 size-2.5 rounded-full"></div>
                        <div className="bg-neutral-300 h-[3px] w-4 rounded-full"></div>
                      </div>

                      {/* Message lines */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1">
                          <div className="bg-neutral-300 h-[3px] w-2.5 rounded-full"></div>
                          <div className="bg-neutral-300 h-[3px] w-6 rounded-full"></div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="bg-neutral-300 h-[3px] w-2.5 rounded-full"></div>
                          <div className="bg-neutral-300 h-[3px] w-6 rounded-full"></div>
                        </div>
                      </div>

                      {/* Activity bars */}
                      <div className="space-y-1.5">
                        <div className="bg-neutral-300 h-[3px] w-full rounded-full"></div>
                        <div className="flex items-center gap-1">
                          <div className="bg-neutral-300 h-[3px] w-2/3 rounded-full"></div>
                          <div className="bg-neutral-300 h-[3px] w-1/3 rounded-full"></div>
                        </div>
                      </div>

                      {/* Connected icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-auto size-3 text-neutral-600"
                      >
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                      <span className="text-neutral-500 w-18 block text-xs">Status</span>
                      <span className="bg-neutral-200 h-2 w-1/4 rounded-full"></span>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                      <span className="text-neutral-500 w-18 block text-xs">Team</span>
                      <span className="bg-neutral-200 h-2 w-1/2 rounded-full"></span>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                      <span className="text-neutral-500 w-18 block text-xs">Members</span>
                      <span className="bg-neutral-200 h-2 w-2/3 rounded-full"></span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};