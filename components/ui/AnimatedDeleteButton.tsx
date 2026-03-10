"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconCheck } from "@tabler/icons-react";
import { TrashIconShake } from "@/constants/icons";

const outCubic = [0.215, 0.61, 0.355, 1] as const;
const outQuint = [0.23, 1, 0.32, 1] as const;

type DeleteStatus = "idle" | "deleting" | "deleted" | "error";

interface AnimatedDeleteButtonProps {
  onDelete: () => Promise<"success" | "error">;
  idleLabel?: string;
  deletingLabel?: string;
  doneLabel?: string;
  className?: string;
}

export function AnimatedDeleteButton({
  onDelete,
  idleLabel = "Delete",
  deletingLabel = "Deleting...",
  doneLabel = "Done",
  className,
}: AnimatedDeleteButtonProps) {
  const [status, setStatus] = useState<DeleteStatus>("idle");
  const [isHovering, setIsHovering] = useState(false);

  const isDeleting = status === "deleting";
  const isDeleted = status === "deleted";

  const handleClick = async () => {
    if (isDeleting || isDeleted) return;
    setStatus("deleting");
    const result = await onDelete();
    if (result === "success") {
      setStatus("deleted");
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={isDeleting || isDeleted}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={
        className ??
        "shrink-0 px-3 py-1 rounded-md text-xs font-schibsted flex items-center justify-center gap-1.5 overflow-hidden border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
      }
      animate={{
        width: isDeleting ? 90 : isDeleted ? 74 : status === "error" ? 72 : 68,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDeleting && (
          <motion.span
            key="deleting"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: outCubic }}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>{deletingLabel}</span>
          </motion.span>
        )}
        {isDeleted && (
          <motion.span
            key="deleted"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: outQuint }}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <IconCheck size={13} />
            <span>{doneLabel}</span>
          </motion.span>
        )}
        {status === "error" && (
          <motion.span
            key="error"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: outCubic }}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Failed</span>
          </motion.span>
        )}
        {status === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.1, ease: outCubic }}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <TrashIconShake size={13} isAnimating={isHovering} />
            <span>{idleLabel}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}