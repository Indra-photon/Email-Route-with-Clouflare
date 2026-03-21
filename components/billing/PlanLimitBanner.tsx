"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PlanLimitBannerProps {
  current: number;
  limit: number | -1;
  planName: string;
  onUpgradeClick: () => void;
}

export function PlanLimitBanner({ current, limit, planName, onUpgradeClick }: PlanLimitBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (limit === -1 || dismissed) return null;

  const percent = Math.round((current / limit) * 100);
  const isOver = percent >= 100;
  const isNear = percent >= 80;

  if (!isNear) return null;

  const bgColor = isOver ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200";
  const textColor = isOver ? "text-red-700" : "text-amber-700";
  const barColor = isOver ? "bg-red-500" : "bg-amber-400";
  const barFill = isOver ? "bg-red-100" : "bg-amber-100";

  return (
    <div className={`rounded-xl border px-4 py-3 ${bgColor} flex items-center gap-4`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={textColor}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className={`font-schibsted text-sm font-semibold ${textColor}`}>
            {isOver
              ? `You've hit your ${limit.toLocaleString()} ticket limit. New tickets are queued.`
              : `You've used ${current.toLocaleString()}/${limit.toLocaleString()} tickets this month (${percent}% of your ${planName} limit)`}
          </p>
        </div>
        <div className={`h-1.5 w-full rounded-full ${barFill} overflow-hidden`}>
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(100, percent)}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onUpgradeClick}
          className={`font-schibsted text-xs font-semibold px-3 py-1.5 rounded-lg ${
            isOver ? "bg-red-600 text-white hover:bg-red-700" : "bg-amber-500 text-white hover:bg-amber-600"
          } transition-colors`}
        >
          Upgrade plan
        </button>
        {!isOver && (
          <button
            onClick={() => setDismissed(true)}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Dismiss banner"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
