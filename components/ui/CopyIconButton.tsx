"use client";

import { useState } from "react";
import { CopyIcon } from "@/constants/icons";
import { cn } from "@/lib/utils";

interface CopyIconButtonProps {
  value: string;
  size?: number;
  className?: string;
}

export function CopyIconButton({ value, size = 15, className }: CopyIconButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={cn(
        "shrink-0 flex items-center justify-center cursor-pointer text-neutral-500 dark:text-neutral-400",
      )}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      <CopyIcon copied={copied} size={size} />
    </button>
  );
}