"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { IconCheck } from "@tabler/icons-react";


const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;
const easeOutQuint = [0.23, 1, 0.32, 1] as const;
const easeInCubic = [0.55, 0.055, 0.675, 0.19] as const;





export function AnimatedSubmitButton({
  idleLabel,
  loadingLabel,
  successLabel,
  idleIcon,
  state,
  idleWidth,
  loadingWidth,
  successWidth,
  className,
  disabled,
}: {
  idleLabel: string;
  loadingLabel: string;
  successLabel: string;
  idleIcon: React.ReactNode;
  state: "idle" | "loading" | "success";
  idleWidth: number;
  loadingWidth: number;
  successWidth: number;
  className: string;
  disabled?: boolean;
}) {
  const width =
    state === "loading" ? loadingWidth
    : state === "success" ? successWidth
    : idleWidth;

  return (
    <motion.button
      type="submit"
      disabled={disabled || state === "loading"}
      className={className}
    //   animate={{ width }}
    //   transition={{ ease: [.455, .03, .515, .955], duration: 0.2}}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "loading" && (
          <motion.span key="loading"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: easeOutCubic }}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="btn-loader" />
            <span>{loadingLabel}</span>
          </motion.span>
        )}
        {state === "success" && (
          <motion.span key="success"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: easeOutQuint }}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <IconCheck size={13} />
            <span>{successLabel}</span>
          </motion.span>
        )}
        {state === "idle" && (
          <motion.span key="idle"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.1, ease: easeOutCubic }}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            {idleIcon}
            <span>{idleLabel}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}