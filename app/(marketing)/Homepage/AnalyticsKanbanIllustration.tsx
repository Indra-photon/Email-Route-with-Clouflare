// 'use client';

import { motion } from "motion/react";
import React from "react";

export const AnalyticsKanbanIllustration: React.FC = () => {
  // Graph data points for the trend line
  const graphPoints = [
    { x: 0, y: 80 },
    { x: 20, y: 70 },
    { x: 40, y: 75 },
    { x: 60, y: 55 },
    { x: 80, y: 40 },
    { x: 100, y: 25 },
  ];

  const createPath = () => {
    return graphPoints
      .map((point, i) => {
        if (i === 0) return `M ${point.x} ${point.y}`;
        return `L ${point.x} ${point.y}`;
      })
      .join(" ");
  };

  return (
    <div className="relative flex h-full items-center justify-center p-8 py-4">
      <div aria-hidden="true" className="min-w-lg overflow-x-auto p-1">
        <div className="grid grid-cols-3 gap-2">
          {/* Column 1: #billing */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <div className="size-2 rounded-full bg-blue-500"></div>
              <span className="text-xs font-semibold">#billing</span>
              <span className="text-neutral-500 ml-auto text-xs">42</span>
            </div>
            <div className="space-y-2">
              {/* Metric Card 1 */}
              <div className="bg-neutral-50 ring-neutral-200 rounded-xl p-3 ring-1">
                <div className="mb-2 flex gap-1.5">
                  <span className="rounded bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">
                    Avg Response
                  </span>
                </div>
                <div className="text-sm font-medium">2.3 min</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                    <span className="text-green-600 text-[10px] font-medium">-15%</span>
                  </div>
                  <span className="text-neutral-500 text-[10px]">vs last week</span>
                </div>
              </div>
              {/* Metric Card 2 */}
              <div className="bg-neutral-50 ring-neutral-200 rounded-xl p-3 ring-1">
                <div className="mb-2 flex gap-1.5">
                  <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">
                    Resolved
                  </span>
                </div>
                <div className="text-sm font-medium">38 / 42</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex-1 bg-neutral-200 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="bg-emerald-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "90%" }}
                      transition={{ duration: 1.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  </div>
                  <span className="text-neutral-500 text-[10px] ml-2">90%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: #leads */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <div className="size-2 rounded-full bg-purple-500"></div>
              <span className="text-xs font-semibold">#leads</span>
              <span className="text-neutral-500 ml-auto text-xs">28</span>
            </div>
            <div className="space-y-2">
              {/* Metric Card */}
              <div className="bg-neutral-50 ring-neutral-200 rounded-xl p-3 ring-1">
                <div className="mb-2 flex gap-1.5">
                  <span className="rounded bg-purple-500/15 px-1.5 py-0.5 text-[10px] font-medium text-purple-600">
                    Avg Response
                  </span>
                </div>
                <div className="text-sm font-medium">1.8 min</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                    <span className="text-green-600 text-[10px] font-medium">-22%</span>
                  </div>
                  <span className="text-neutral-500 text-[10px]">vs last week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: #support (with animated graph) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <div className="size-2 rounded-full bg-amber-500"></div>
              <span className="text-xs font-semibold">#support</span>
              <span className="text-neutral-500 ml-auto text-xs">15</span>
            </div>
            <div className="space-y-2">
              {/* Graph Card */}
              <div className="bg-neutral-50 ring-neutral-200 rounded-xl p-3 ring-1">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">
                    Issues Trend
                  </span>
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                    <span className="text-green-600 text-[10px] font-medium">-68%</span>
                  </div>
                </div>
                
                {/* Animated Graph */}
                <div className="mt-2 relative h-16 w-full">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Background grid lines */}
                    <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeWidth="0.5" className="text-neutral-200" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-neutral-200" />
                    <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" strokeWidth="0.5" className="text-neutral-200" />
                    
                    {/* Animated line */}
                    <motion.path
                      d={createPath()}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        pathLength: { duration: 2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                        opacity: { duration: 0.3, delay: 0.5 }
                      }}
                    />
                    
                    {/* Data points */}
                    {graphPoints.map((point, i) => (
                      <motion.circle
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r="2"
                        fill="#10b981"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.5 + (i * 0.15),
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                      />
                    ))}
                  </svg>
                </div>
                
                <div className="mt-2 text-center">
                  <span className="text-neutral-500 text-[10px]">Last 6 weeks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};