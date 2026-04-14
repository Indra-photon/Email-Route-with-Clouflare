"use client";

import { useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { IconArrowUp } from "@tabler/icons-react";

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
    <div className="bg-gradient-to-b from-white/90 to-transparent p-[4px] rounded-[16px] inline-flex">
      <motion.button
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileTap={{ scale: 0.995 }}
        className="relative group p-[4px] rounded-[12px] bg-gradient-to-b from-sky-900 to-cyan-700 shadow-[0_1px_2px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] cursor-pointer overflow-hidden"
      >
        {/* Shimmer sweep on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
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

        <div className="bg-gradient-to-b from-white/[0.08] to-transparent rounded-[8px] px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="relative z-10 font-schibsted font-semibold text-white text-sm uppercase tracking-wide select-none">
              {text}
            </span>
            <div className="relative flex items-center justify-center w-5 h-5">
              <span className="absolute inset-0 rounded-full bg-white/0 backdrop-blur-0 group-hover:bg-white/20 group-hover:backdrop-blur-sm transition-all duration-150 ease-out" />
              <IconArrowUp
                size={13}
                stroke={2.5}
                className="relative z-10 text-white rotate-90 transition-transform duration-150 ease-out group-hover:rotate-45"
              />
            </div>
          </div>
        </div>
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
  return (
    <div className=" p-[4px] rounded-[16px] inline-flex">
      <button className="group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995] cursor-pointer">
        <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-4 py-[5px]">
          <span className="font-schibsted font-semibold tracking-wide uppercase text-neutral-900 text-sm select-none">
            See How It Works
          </span>
        </div>
      </button>
    </div>
  );
}