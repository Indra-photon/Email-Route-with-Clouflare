import { cn } from "@/lib/utils";

type Status = "verified" | "pending" | "not_started" | string;

interface VerificationStatusBadgeProps {
  status: Status;
  className?: string;
}

export function VerificationStatusBadge({ status, className }: VerificationStatusBadgeProps) {
  const normalized = (status || "").toLowerCase().replace(/_/g, " ");
  const isVerified = normalized === "verified";
  const isPending = normalized === "pending" || normalized === "not started";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isVerified && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        isPending && "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        !isVerified && !isPending && "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        className
      )}
      role="status"
    >
      {isVerified && "✅"}
      {isPending && "⏳"}
      {!isVerified && !isPending && "❌"}
      {normalized || "unknown"}
    </span>
  );
}
