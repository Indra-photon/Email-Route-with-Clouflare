"use client";

import { useState } from "react";
import { CopyIcon } from "@/constants/icons";

const CODE = "EARLYBIRD20";

export function ScrollEarlyBirdBanner() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 px-4 py-3 text-center shadow-sm">
      <p className="font-schibsted text-[16px] font-light tracking-tighter text-amber-950 leading-snug inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
        <span>Early bird offer</span>
        <span className="h-1 w-1 rounded-full bg-amber-800/50 inline-block" />
        <span>
          Get <strong className="text-white drop-shadow-sm">20% off</strong> for
          your first 3 months. Use code
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied!" : "Copy code EARLYBIRD20"}
          className="inline-flex items-center gap-x-1 font-mono font-bold tracking-widest text-amber-950 bg-white/40 hover:bg-white/60 rounded px-2 py-0.5 text-xs uppercase cursor-pointer transition-colors"
        >
          {CODE}
          <CopyIcon copied={copied} size={13} />
        </button>
        <span>at checkout.</span>
      </p>
    </div>
  );
}
