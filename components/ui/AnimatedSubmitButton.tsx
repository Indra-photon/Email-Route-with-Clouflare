"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { IconCheck } from "@tabler/icons-react";


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

    const buttonContent = {
      idle: (
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          {idleIcon}
          <span>{idleLabel}</span>
        </span>
      ),
      loading: (
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="btn-loader" />
          <span>{loadingLabel}</span>
        </span>
      ),
      success: (
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <IconCheck size={13} />
          <span>{successLabel}</span>
        </span>
      ),
    };

  return (
    <motion.button
      type="submit"
      disabled={disabled || state === "loading"}
      className={className}
    >
      <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={state}
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 25 }}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
      >
        {buttonContent[state]}
      </motion.span>
    </AnimatePresence>
    </motion.button>
  );
}