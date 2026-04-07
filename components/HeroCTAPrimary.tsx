"use client";

import { useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

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
    <div>
      {/* THE BUTTON */}
      <motion.button
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileTap={{ scale: 0.97 }}
        className=" relative flex items-center justify-between gap-0 overflow-hidden rounded-full bg-gradient-to-b from-sky-900 to-cyan-700  shadow-xs cursor-pointer"
        
      >
        {/* Shimmer sweep on hover */}
        <motion.div
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
        />

        {/* Text */}
        <span
          className="relative text-shadow-2xl z-10 font-schibsted font-semibold text-white text-sm uppercase tracking-wide select-none flex items-center justify-center flex-1 px-6 py-2.5"
        >
          {text}
        </span>
      </motion.button>
    </div>
  );
}

// export default function HeroCTAPrimary({ text = "Get Started" }: { text?: string }) {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <div>
//       <motion.button
//         onHoverStart={() => setHovered(true)}
//         onHoverEnd={() => setHovered(false)}
//         whileTap={{ scale: 0.97 }}
//         className="relative flex items-center justify-center overflow-hidden rounded-full cursor-pointer"
//         style={{
//           background: "linear-gradient(180deg, #1e6fa8 0%, #0e7490 55%, #0a5f73 100%)",
//           boxShadow: `
//             inset 0 1px 0 rgba(255,255,255,0.18),
//             inset 0 -1px 0 rgba(0,0,0,0.35),
//             0 2px 8px rgba(0,0,0,0.30),
//             0 1px 2px rgba(0,0,0,0.20)
//           `,
//         }}
//       >
//         {/* Shimmer sweep on hover */}
//         <motion.div
//           className="absolute inset-0 pointer-events-none"
//           style={{
//             background:
//               "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.10) 50%, transparent 70%)",
//             backgroundSize: "200% 100%",
//           }}
//           animate={
//             hovered
//               ? { backgroundPositionX: ["200%", "-200%"] }
//               : { backgroundPositionX: "200%" }
//           }
//           transition={{ duration: 0.65, ease: "easeInOut" }}
//         />

//         {/* Text */}
//         <span
//           className="relative z-10 font-schibsted font-semibold text-white text-sm uppercase tracking-wide select-none px-7 py-3"
//           style={{ textShadow: "0 1px 2px rgba(0,20,40,0.5)" }}
//         >
//           {text}
//         </span>
//       </motion.button>
//     </div>
//   );
// }


export function HeroCTASecondary() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      className="relative flex items-center px-6 py-2.5 rounded-full border border-neutral-200 bg-white hover:border-neutral-300 transition-colors duration-200 cursor-pointer group"
    >
      <span className="font-schibsted font-semibold text-neutral-800 text-sm uppercase tracking-wide select-none">
        See How It Works
      </span>

      {/* Subtle underline slide */}
      <motion.div
        className="absolute bottom-2 left-5 right-5 h-px bg-neutral-300"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      />
    </motion.button>
  );
}