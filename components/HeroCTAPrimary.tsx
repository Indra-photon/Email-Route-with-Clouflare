"use client";

import { useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {IconBrandYoutubeFilled} from "@tabler/icons-react";

// 3x3 dot grid positions (normalized 0-1 in a 48x48 box)
const DOT_POSITIONS = [
  { x: 10, y: 10 }, { x: 24, y: 10 }, { x: 38, y: 10 },
  { x: 10, y: 24 }, { x: 24, y: 24 }, { x: 38, y: 24 },
  { x: 10, y: 38 }, { x: 24, y: 38 }, { x: 38, y: 38 },
];

// Arrow shape: dots morph into these positions to form →
const ARROW_POSITIONS = [
  { x: 8,  y: 38 }, // shaft start bottom-left
  { x: 14, y: 32 },
  { x: 20, y: 26 },
  { x: 26, y: 20 },
  { x: 38, y: 10 }, // tip top-right
  { x: 28, y: 8  }, // top wing end
  { x: 40, y: 22 }, // bottom wing end
  { x: 24, y: 24 }, // hidden
  { x: 24, y: 24 }, // hidden
];

export default function HeroCTAPrimary({ text = "Get Started" }: { text?: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex flex-col gap-8">

      {/* THE BUTTON */}
      <motion.button
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileTap={{ scale: 0.97 }}
        className="relative w-64 flex items-center justify-between gap-0 overflow-hidden rounded-2xl bg-gradient-to-b from-sky-900 to-cyan-700 shadow-lg cursor-pointer"
      >
        {/* Shimmer sweep on hover */}
        {/* <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
          }}
          animate={
            hovered
              ? { backgroundPositionX: ["200%", "-200%"] }
              : { backgroundPositionX: "200%" }
          }
          transition={{ duration: 0.7, ease: "easeInOut" }}
        /> */}

        {/* Text */}
        <span
          className="relative z-10 font-schibsted font-semibold text-white text-xl uppercase tracking-wide select-none flex items-center justify-center flex-1 px-4 py-4"
        >
          {text}
        </span>

        {/* White box with dot → arrow animation */}
        {/* <div
          className="relative z-10 flex items-center justify-center rounded-xl m-2"
          style={{
            width: 45,
            height: 45,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(4px)",
            flexShrink: 0,
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {DOT_POSITIONS.map((dot, i) => {
              const target = ARROW_POSITIONS[i];
              const shouldFade = i === 7 || i === 8;

              return (
                <motion.circle
                  key={i}
                  r={2.5}
                  fill={hovered ? "#0891b2" : "#94a3b8"}
                  animate={{
                    cx: hovered ? target.x : dot.x,
                    cy: hovered ? target.y : dot.y,
                    r: shouldFade ? (hovered ? 0 : 2.5) : hovered ? 2.8 : 2.5,
                    opacity: shouldFade ? (hovered ? 0 : 1) : hovered ? 0 : 1,
                    fill: hovered ? "#0891b2" : "#94a3b8",
                  }}
                  transition={{
                    duration: 0.25,
                    delay: hovered ? i * 0.03 : (8 - i) * 0.02,
                    ease: [0.34, 1.56, 0.64, 1], // spring-like overshoot
                  }}
                />
              );
            })}

            <motion.path
            d="M8 38 L38 10"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="2 4"
            animate={{ opacity: hovered ? 1 : 0, pathLength: hovered ? 1 : 0 }}
            transition={{ duration: 0.35, delay: hovered ? 0.18 : 0 }}
            />
            <motion.path
            d="M28 8 L38 10"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinecap="round"
            animate={{ opacity: hovered ? 1 : 0, pathLength: hovered ? 1 : 0 }}
            transition={{ duration: 0.2, delay: hovered ? 0.38 : 0 }}
            />
            <motion.path
            d="M38 10 L40 22"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinecap="round"
            animate={{ opacity: hovered ? 1 : 0, pathLength: hovered ? 1 : 0 }}
            transition={{ duration: 0.2, delay: hovered ? 0.38 : 0 }}
            />
          </svg>
        </div> */}
      </motion.button>
    </div>
  );
}


export function HeroCTASecondary() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      className="relative flex items-center gap-3 px-7 py-4 rounded-2xl border-2 border-neutral-200 bg-white hover:border-neutral-300 transition-colors duration-200 cursor-pointer group"
    >
      {/* Play icon */}
      <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 group-hover:bg-neutral-200 transition-colors duration-200 flex-shrink-0">
        <IconBrandYoutubeFilled size={14} color="#ef4444" />
      </div>

      <span className="font-schibsted font-semibold text-neutral-800 text-xl tracking-wide select-none">
        See How It Works
      </span>

      {/* Subtle underline slide */}
      <motion.div
        className="absolute bottom-3 left-7 right-7 h-px bg-neutral-300"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      />
    </motion.button>
  );
}