"use client";

interface UsageBarProps {
  label: string;
  current: number;
  max: number | -1; // -1 = unlimited
  className?: string;
}

export function UsageBar({ label, current, max, className = "" }: UsageBarProps) {
  const isUnlimited = max === -1;
  const percent = isUnlimited ? 0 : Math.min(100, Math.round((current / max) * 100));

  const barColor =
    percent >= 100
      ? "bg-red-500"
      : percent >= 80
      ? "bg-amber-400"
      : "bg-sky-500";

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="font-schibsted text-sm text-neutral-600">{label}</span>
        <span className="font-schibsted text-xs text-neutral-400 tabular-nums">
          {isUnlimited ? `${current.toLocaleString()} / ∞` : `${current.toLocaleString()} / ${max.toLocaleString()}`}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
        {isUnlimited ? (
          <div className="h-full w-full bg-sky-100 rounded-full" />
        ) : (
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        )}
      </div>
      {!isUnlimited && percent >= 80 && (
        <p className={`font-schibsted text-xs ${percent >= 100 ? "text-red-500" : "text-amber-500"}`}>
          {percent >= 100 ? "Limit reached" : `${percent}% used`}
        </p>
      )}
    </div>
  );
}
