// "use client";

// import { useSubscription } from "@/hooks/useSubscription";
// import { UsageBar } from "@/components/billing/UsageBar";
// import { PlanLimitBanner } from "@/components/billing/PlanLimitBanner";
// import { UpgradeModal } from "@/components/billing/UpgradeModal";
// import { DowngradeModal } from "@/components/billing/DowngradeModal";
// import { useState } from "react";
// import { motion } from "motion/react";

// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";

// const PLAN_ORDER = ["starter", "growth", "scale"] as const;
// type PlanId = typeof PLAN_ORDER[number];

// const PLAN_META: Record<PlanId, { name: string; price: number; color: string }> = {
//   starter: { name: "Starter", price: 19, color: "bg-sky-700" },
//   growth:  { name: "Growth",  price: 59,  color: "bg-sky-800" },
//   scale:   { name: "Scale",   price: 159, color: "bg-sky-900" },
// };

// const STATUS_BADGES: Record<string, { label: string; dot: string }> = {
//   active:    { label: "Active",    dot: "bg-green-500" },
//   trialing:  { label: "Trialing",  dot: "bg-blue-400" },
//   past_due:  { label: "Past Due",  dot: "bg-red-500" },
//   cancelled: { label: "Cancelled", dot: "bg-neutral-400" },
//   inactive:  { label: "Inactive",  dot: "bg-neutral-400" },
//   no_plan:   { label: "No Plan",   dot: "bg-neutral-400" },
// };

// export default function BillingPageContent() {
//   const { data, isLoading, error, refresh } = useSubscription();
//   const [upgradeTarget, setUpgradeTarget] = useState<PlanId | null>(null);
//   const [downgradeTarget, setDowngradeTarget] = useState<PlanId | null>(null);
//   const [cancelling, setCancelling] = useState(false);
//   const [resuming, setResuming] = useState(false);
//   const [portalLoading, setPortalLoading] = useState(false);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-48">
//         <div className="w-6 h-6 border-2 border-sky-800 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (error || !data) {
//     return <p className="font-schibsted text-sm text-red-500 p-6">Failed to load billing info.</p>;
//   }

//   const safePlanId = data.planId as PlanId | null;
//   const currentMeta = safePlanId ? PLAN_META[safePlanId] : null;
//   const badge = STATUS_BADGES[data.status] ?? STATUS_BADGES.inactive;

//   const handleCancel = async () => {
//     if (!confirm("Cancel subscription at the end of your billing period?")) return;
//     setCancelling(true);
//     const res = await fetch("/api/billing/cancel", { method: "POST" });
//     const json = await res.json();
//     if (res.ok) { alert(json.message); refresh(); }
//     else alert(json.error ?? "Failed to cancel");
//     setCancelling(false);
//   };

//   const handleResume = async () => {
//     setResuming(true);
//     const res = await fetch("/api/billing/resume", { method: "POST" });
//     const json = await res.json();
//     if (res.ok) { alert(json.message); refresh(); }
//     else alert(json.error ?? "Failed to resume");
//     setResuming(false);
//   };

//   const handlePortal = async () => {
//     setPortalLoading(true);
//     const res = await fetch("/api/billing/portal", { method: "POST" });
//     const json = await res.json();
//     if (res.ok) window.open(json.portalUrl, "_blank");
//     else alert(json.error ?? "Failed to open portal");
//     setPortalLoading(false);
//   };

//   const endDateStr = data.currentPeriodEnd
//     ? new Date(data.currentPeriodEnd).toLocaleDateString("en-US", {
//         month: "long", day: "numeric", year: "numeric",
//       })
//     : null;

//   return (
//     <div className="space-y-6">
//       {/* Limit warning banner */}
//       <PlanLimitBanner
//         current={data.usage.ticketCountInbound}
//         limit={data.usage.ticketLimit}
//         planName={currentMeta?.name ?? "Free Tier"}
//         onUpgradeClick={() => {
//           const currentIndex = safePlanId ? PLAN_ORDER.indexOf(safePlanId) : -1;
//           const next = PLAN_ORDER[currentIndex + 1] as PlanId | undefined;
//           if (next || !data.planId) setUpgradeTarget(next ?? "starter");
//         }}
//       />

//       {/* Current plan card */}
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="rounded-2xl border border-neutral-200 overflow-hidden"
//       >
//         <div className={`${currentMeta?.color ?? "bg-gradient-to-t from-sky-900 to-cyan-600"} px-6 py-5 flex items-center justify-between shadow-sm`}>
//           <div>
//             <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
//               Current Plan
//             </p>
//             <h2 className="font-schibsted text-xl font-semibold text-white">
//               {currentMeta ? `${currentMeta.name} — $${currentMeta.price}/month` : "No Plan — $0/month"}
//             </h2>
//           </div>
//           <div className="flex items-center gap-1.5">
//             <div className={`w-2 h-2 rounded-full ${badge.dot}`} />
//             <span className="font-schibsted text-sm font-medium text-white">{badge.label}</span>
//           </div>
//         </div>

//         <div className="px-6 py-5 bg-white space-y-4">
//           {endDateStr && (
//             <div className="flex items-center justify-between text-sm font-schibsted">
//               <span className="text-neutral-500">
//                 {data.cancelAtPeriodEnd ? "Cancels on" : "Next billing"}
//               </span>
//               <span className="font-medium text-neutral-800">{endDateStr}</span>
//             </div>
//           )}

//           {data.pendingPlanId && (
//             <div className="rounded-lg bg-purple-50 border border-purple-200 px-3 py-2">
//               <p className="font-schibsted text-xs text-purple-700">
//                 Downgrade to <strong>{PLAN_META[data.pendingPlanId as PlanId]?.name}</strong> scheduled
//                 for {endDateStr ?? "period end"}
//               </p>
//             </div>
//           )}

//           {data.status === "past_due" && (
//             <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
//               <p className="font-schibsted text-xs text-red-700">
//                 Your last payment failed. Update your payment method to keep access.
//               </p>
//             </div>
//           )}

//           <div className="flex gap-3 flex-wrap">
//             <button
//               onClick={handlePortal}
//               disabled={portalLoading}
//               className="rounded-xl border border-sky-200 px-4 py-2 font-schibsted text-sm font-medium text-sky-700 hover:bg-sky-50 transition-colors disabled:opacity-60"
//             >
//               {portalLoading ? "Loading…" : "Manage payment methods"}
//             </button>
//             {data.cancelAtPeriodEnd || data.status === "cancelled" ? (
//               <button
//                 onClick={handleResume}
//                 disabled={resuming}
//                 className="rounded-xl border border-neutral-200 px-4 py-2 font-schibsted text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-60"
//               >
//                 {resuming ? "Resuming…" : "Resume subscription"}
//               </button>
//             ) : (
//               <button
//                 onClick={handleCancel}
//                 disabled={cancelling}
//                 className="rounded-xl border border-red-200 px-4 py-2 font-schibsted text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
//               >
//                 {cancelling ? "Cancelling…" : "Cancel subscription"}
//               </button>
//             )}
//           </div>
//         </div>
//       </motion.div>

//       {/* Usage bars */}
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4, delay: 0.08 }}
//         className="rounded-2xl border border-neutral-200 bg-neutral-100 px-6 py-5 shadow-sm"
//       >
//         <Heading variant="muted" className="text-base font-semibold text-sky-900 mb-4">
//           Usage this period
//           {data.currentPeriodStart && (
//             <span className="font-normal text-neutral-400 text-sm ml-2">
//               ({new Date(data.currentPeriodStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
//               {data.currentPeriodEnd && ` – ${new Date(data.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`})
//             </span>
//           )}
//         </Heading>
//         <div className="space-y-4">
//           <UsageBar label="Inbound tickets"  current={data.usage.ticketCountInbound}  max={data.limits?.ticketsPerMonth ?? -1} />
//           <UsageBar label="Outbound replies" current={data.usage.ticketCountOutbound} max={-1} />
//           <UsageBar label="Domains"          current={0} max={data.limits?.domains ?? -1} />
//           <UsageBar label="Aliases / domain" current={0} max={data.limits?.aliasesPerDomain ?? -1} />
//           <UsageBar label="Chat widgets"     current={0} max={data.limits?.chatWidgets ?? -1} />
//         </div>
//       </motion.div>

//       {/* Change plan */}
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4, delay: 0.16 }}
//         className="rounded-2xl border border-neutral-200 bg-neutral-100 px-6 py-5 shadow-sm"
//       >
//         <Heading variant="muted" className="text-base font-semibold text-sky-900 mb-4">Change plan</Heading>
//         <div className="grid grid-cols-3 gap-3">
//           {PLAN_ORDER.map((pid) => {
//             const meta = PLAN_META[pid];
//             const isCurrent = pid === data.planId;
//             const isScale = pid === "scale";
//             const currentIndex = safePlanId ? PLAN_ORDER.indexOf(safePlanId) : -1;
//             const isUpgrade = PLAN_ORDER.indexOf(pid) > currentIndex;
//             const isDowngrade = currentIndex >= 0 && PLAN_ORDER.indexOf(pid) < currentIndex;

//             return (
//               <div key={pid} className={`rounded-xl border p-4 shadow-sm transition-all ${isCurrent ? "border-sky-300 bg-sky-50" : "border-neutral-200 bg-white"}`}>
//                 <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1">{meta.name}</p>
//                 <p className="font-schibsted text-xl font-semibold text-neutral-900 mb-3">${meta.price}<span className="text-xs font-normal text-neutral-400">/mo</span></p>
//                 {isCurrent ? (
//                   <span className="inline-block w-full text-center rounded-lg py-1.5 font-schibsted text-xs font-semibold text-sky-700 bg-sky-200/50">
//                     Current plan
//                   </span>
//                 ) : isScale ? (
//                   <a href="/contact" className="block w-full text-center rounded-lg py-1.5 font-schibsted text-xs font-semibold text-neutral-700 border border-neutral-200 hover:bg-neutral-50 transition-colors">
//                     Book a demo
//                   </a>
//                 ) : isUpgrade ? (
//                   <button
//                     onClick={() => setUpgradeTarget(pid)}
//                     className="w-full rounded-lg py-1.5 font-schibsted text-xs font-semibold text-white bg-gradient-to-t from-sky-900 to-cyan-600 hover:opacity-90 transition-all shadow-sm"
//                   >
//                     Upgrade
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => setDowngradeTarget(pid)}
//                     className="w-full rounded-lg py-1.5 font-schibsted text-xs font-semibold text-sky-600 border border-sky-100 hover:bg-sky-50 transition-colors"
//                   >
//                     Downgrade
//                   </button>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </motion.div>

//       {/* Modals */}
//       <UpgradeModal
//         isOpen={upgradeTarget !== null}
//         onClose={() => setUpgradeTarget(null)}
//         targetPlanId={upgradeTarget ?? "growth"}
//       />
//       <DowngradeModal
//         isOpen={downgradeTarget !== null}
//         onClose={() => { setDowngradeTarget(null); refresh(); }}
//         currentPlanName={currentMeta?.name ?? "No Plan"}
//         targetPlanId={(downgradeTarget ?? "starter") as "starter" | "growth"}
//         targetPlanName={downgradeTarget ? PLAN_META[downgradeTarget].name : ""}
//         targetPlanPrice={downgradeTarget ? PLAN_META[downgradeTarget].price : 0}
//         currentPeriodEnd={data.currentPeriodEnd}
//       />
//     </div>
//   );
// }



"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { UsageBar } from "@/components/billing/UsageBar";
import { PlanLimitBanner } from "@/components/billing/PlanLimitBanner";
import { UpgradeModal } from "@/components/billing/UpgradeModal";
import { DowngradeModal } from "@/components/billing/DowngradeModal";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Card } from "@/components/ui/card";
import {
  IconCreditCard,
  IconChartBar,
  IconArrowUp,
  IconArrowDown,
  IconCheck,
  IconAlertTriangle,
  IconCalendar,
  IconExternalLink,
  IconRefresh,
  IconLayoutGrid,
} from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────

const PLAN_ORDER = ["starter", "growth", "scale"] as const;
type PlanId = typeof PLAN_ORDER[number];
type PageTab = "overview" | "plans";

const PLAN_META: Record<PlanId, {
  name: string;
  price: number;
  description: string;
  highlights: string[];
}> = {
  starter: {
    name: "Starter",
    price: 19,
    description: "For small teams getting started",
    highlights: ["200 tickets/month", "1 domain", "3 aliases/domain", "1 chat widget"],
  },
  growth: {
    name: "Growth",
    price: 59,
    description: "For growing teams with more volume",
    highlights: ["600 tickets/month", "3 domains", "5 aliases/domain", "3 chat widgets"],
  },
  scale: {
    name: "Scale",
    price: 159,
    description: "For teams that need enterprise scale",
    highlights: ["Unlimited tickets", "Unlimited domains", "Unlimited aliases", "Unlimited widgets"],
  },
};

const STATUS_META: Record<string, {
  label: string;
  dotColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}> = {
  active:    { label: "Active",    dotColor: "bg-green-500",   textColor: "text-green-800",   bgColor: "bg-green-50",    borderColor: "border-green-900" },
  trialing:  { label: "Trialing",  dotColor: "bg-blue-400",    textColor: "text-blue-800",    bgColor: "bg-blue-50",     borderColor: "border-blue-900" },
  past_due:  { label: "Past Due",  dotColor: "bg-red-500",     textColor: "text-red-800",     bgColor: "bg-red-50",      borderColor: "border-red-900" },
  cancelled: { label: "Cancelled", dotColor: "bg-neutral-400", textColor: "text-neutral-600", bgColor: "bg-neutral-100", borderColor: "border-neutral-400" },
  inactive:  { label: "Inactive",  dotColor: "bg-neutral-400", textColor: "text-neutral-600", bgColor: "bg-neutral-100", borderColor: "border-neutral-400" },
  no_plan:   { label: "No Plan",   dotColor: "bg-neutral-400", textColor: "text-neutral-600", bgColor: "bg-neutral-100", borderColor: "border-neutral-400" },
};

const PAGE_TABS: { id: PageTab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview & Usage", icon: <IconCreditCard size={15} /> },
  { id: "plans",    label: "Plans",            icon: <IconLayoutGrid size={15} /> },
];

const easeOutQuint = [0.23, 1, 0.32, 1] as const;

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.inactive;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-schibsted font-semibold border ${meta.textColor} ${meta.bgColor} ${meta.borderColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor}`} />
      {meta.label}
    </span>
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────

function ActionButton({
  onClick,
  disabled,
  loading,
  label,
  loadingLabel,
  variant = "default",
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  label: string;
  loadingLabel?: string;
  variant?: "default" | "danger" | "primary";
}) {
  const styles = {
    default: "border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800",
    danger:  "border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
    primary: "bg-gradient-to-b from-sky-700 to-cyan-600 text-white border-0 hover:opacity-90",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-schibsted font-semibold transition-all duration-150 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {loading && (
        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {loading ? (loadingLabel ?? label) : label}
    </button>
  );
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({
  pid,
  isCurrent,
  isUpgrade,
  isDowngrade,
  isPending,
  onUpgrade,
  onDowngrade,
}: {
  pid: PlanId;
  isCurrent: boolean;
  isUpgrade: boolean;
  isDowngrade: boolean;
  isPending: boolean;
  onUpgrade: () => void;
  onDowngrade: () => void;
}) {
  const meta = PLAN_META[pid];
  const isScale = pid === "scale";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative rounded-xl border overflow-hidden transition-all duration-150 ${
        isCurrent
          ? "border-sky-600 shadow-sm shadow-sky-100 dark:shadow-none"
          : "border-neutral-200 dark:border-neutral-700"
      }`}
    >
      {isCurrent && <div className="h-1 w-full bg-gradient-to-r from-sky-700 to-cyan-600" />}

      <div className={`p-4 ${isCurrent ? "bg-sky-50/50 dark:bg-sky-900/10" : "bg-white dark:bg-neutral-900"}`}>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">{meta.name}</p>
            <div className="flex items-baseline gap-1">
              <span className="font-schibsted text-2xl font-bold text-neutral-900 dark:text-neutral-100">${meta.price}</span>
              <span className="font-schibsted text-xs text-neutral-400">/mo</span>
            </div>
          </div>
          {isCurrent && (
            <span className="shrink-0 inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] font-schibsted font-semibold bg-sky-100 border border-sky-300 text-sky-800 dark:bg-sky-900/30 dark:border-sky-700 dark:text-sky-400">
              <IconCheck size={10} />Current
            </span>
          )}
          {isPending && (
            <span className="shrink-0 inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-schibsted font-semibold bg-amber-50 border border-amber-300 text-amber-800">
              Pending
            </span>
          )}
        </div>

        <p className="font-schibsted text-xs text-neutral-500 dark:text-neutral-400 mb-3">{meta.description}</p>

        <ul className="space-y-1.5 mb-4">
          {meta.highlights.map((h) => (
            <li key={h} className="flex items-center gap-2 text-xs font-schibsted text-neutral-600 dark:text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 shrink-0" />
              {h}
            </li>
          ))}
        </ul>

        {isCurrent ? (
          <div className="w-full py-1.5 text-center rounded-lg font-schibsted text-xs font-semibold text-sky-700 bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400">
            Your current plan
          </div>
        ) : isScale ? (
          <a href="/contact" className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg font-schibsted text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            Book a demo <IconExternalLink size={11} />
          </a>
        ) : isUpgrade ? (
          <button type="button" onClick={onUpgrade}
            className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg font-schibsted text-xs font-semibold text-white bg-gradient-to-b from-sky-700 to-cyan-600 hover:opacity-90 transition-all cursor-pointer focus:outline-none"
          >
            <IconArrowUp size={12} />Upgrade
          </button>
        ) : (
          <button type="button" onClick={onDowngrade}
            className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg font-schibsted text-xs font-semibold text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors cursor-pointer focus:outline-none"
          >
            <IconArrowDown size={12} />Downgrade
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export default function BillingPageContent() {
  const { data, isLoading, error, refresh } = useSubscription();
  const [upgradeTarget, setUpgradeTarget] = useState<PlanId | null>(null);
  const [downgradeTarget, setDowngradeTarget] = useState<PlanId | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [resuming, setResuming] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [activePageTab, setActivePageTab] = useState<PageTab>("overview");

  const handleCancel = async () => {
    if (!confirm("Cancel subscription at the end of your billing period?")) return;
    setCancelling(true);
    const res = await fetch("/api/billing/cancel", { method: "POST" });
    const json = await res.json();
    if (res.ok) { alert(json.message); refresh(); }
    else alert(json.error ?? "Failed to cancel");
    setCancelling(false);
  };

  const handleResume = async () => {
    setResuming(true);
    const res = await fetch("/api/billing/resume", { method: "POST" });
    const json = await res.json();
    if (res.ok) { alert(json.message); refresh(); }
    else alert(json.error ?? "Failed to resume");
    setResuming(false);
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const json = await res.json();
    if (res.ok) {
      window.open(json.portalUrl, "_blank");
    } else {
      const msg = json.error ?? "Failed to open billing portal";
      // Provide a helpful message for the most common case
      if (msg.includes("No billing account")) {
        alert("⚠️ No billing account found.\n\nThis happens if your subscription was created via a test route and has no real Dodo customer record. Please subscribe through the normal checkout flow first.");
      } else {
        alert(`❌ ${msg}`);
      }
    }
    setPortalLoading(false);
  };

  const handleReactivateAliases = async () => {
    setReactivating(true);
    const res = await fetch("/api/billing/reactivate-aliases", { method: "POST" });
    const json = await res.json();
    if (res.ok) {
      alert(`✅ ${json.message}`);
      refresh();
    } else {
      alert(json.error ?? "Failed to reactivate aliases");
    }
    setReactivating(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 border border-neutral-400 rounded-lg p-4 min-h-screen">
        <div>
          <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">Billing & Plans</Heading>
          <Paragraph variant="small" className="text-neutral-600 dark:text-neutral-400 mt-1">Manage your subscription, usage and payment methods.</Paragraph>
        </div>
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-sky-700 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6 border border-neutral-400 rounded-lg p-4 min-h-screen">
        <p className="font-schibsted text-sm text-red-500">Failed to load billing info.</p>
      </div>
    );
  }

  const safePlanId = data.planId as PlanId | null;
  const currentMeta = safePlanId ? PLAN_META[safePlanId] : null;
  const currentIndex = safePlanId ? PLAN_ORDER.indexOf(safePlanId) : -1;

  const endDateStr = data.currentPeriodEnd
    ? new Date(data.currentPeriodEnd).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  const startDateShort = data.currentPeriodStart
    ? new Date(data.currentPeriodStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  const endDateShort = data.currentPeriodEnd
    ? new Date(data.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  return (
    <div className="space-y-6 border border-neutral-400 rounded-lg p-4 min-h-screen">

      {/* Page heading */}
      <div>
        <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
          Billing & Plans
        </Heading>
        <Paragraph variant="small" className="text-neutral-600 dark:text-neutral-400 mt-1">
          Manage your subscription, usage and payment methods.
        </Paragraph>
      </div>

      {/* Limit warning banner */}
      <PlanLimitBanner
        current={data.usage.ticketCountInbound}
        limit={data.usage.ticketLimit}
        planName={currentMeta?.name ?? "Free Tier"}
        onUpgradeClick={() => {
          const next = PLAN_ORDER[currentIndex + 1] as PlanId | undefined;
          if (next || !data.planId) setUpgradeTarget(next ?? "starter");
        }}
      />

      {/* Main tabbed card */}
      <Card className="min-h-[300px] overflow-hidden">

        {/* Tab bar */}
        <div className="flex items-center gap-1.5 pb-4 border-b border-neutral-100 dark:border-neutral-800 flex-wrap">
          {PAGE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePageTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-schibsted font-semibold transition-all duration-150 focus:outline-none cursor-pointer ${
                activePageTab === tab.id
                  ? "text-white"
                  : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              {activePageTab === tab.id && (
                <motion.span
                  layoutId="billing-tab-bg"
                  className="absolute inset-0 bg-linear-to-r from-sky-800 to-cyan-700 rounded-lg z-0 shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="pt-4">
          <AnimatePresence mode="wait" initial={false}>

            {/* ── Overview tab ── */}
            {activePageTab === "overview" && (
              <motion.div key="overview"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">

                  {/* Left: Plan info + Usage bars */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="font-schibsted text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {currentMeta ? currentMeta.name : "No Plan"}
                      </h2>
                      <StatusBadge status={data.status} />
                    </div>

                    <p className="font-schibsted text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                      ${currentMeta?.price ?? 0}
                      <span className="text-sm font-normal text-neutral-400 ml-1">/month</span>
                    </p>

                    {endDateStr && (
                      <p className="font-schibsted text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                        <IconCalendar size={12} />
                        {data.cancelAtPeriodEnd ? "Cancels on" : "Renews on"} {endDateStr}
                      </p>
                    )}

                    {/* Pending downgrade alert */}
                    {data.pendingPlanId && (
                      <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 px-3 py-2">
                        <IconAlertTriangle size={13} className="text-amber-600 dark:text-amber-400 shrink-0" />
                        <p className="font-schibsted text-xs text-amber-700 dark:text-amber-300">
                          Downgrade to <strong>{PLAN_META[data.pendingPlanId as PlanId]?.name}</strong> scheduled for {endDateStr ?? "period end"}
                        </p>
                      </div>
                    )}

                    {/* Past due alert */}
                    {data.status === "past_due" && (
                      <div className="inline-flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 px-3 py-2">
                        <IconAlertTriangle size={13} className="text-red-600 dark:text-red-400 shrink-0" />
                        <p className="font-schibsted text-xs text-red-700 dark:text-red-300">
                          Your last payment failed. Update your payment method to keep access.
                        </p>
                      </div>
                    )}

                    {/* Plan highlights */}
                    {currentMeta && (
                      <ul className="space-y-1.5 pt-1 pb-1">
                        {currentMeta.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-2 text-xs font-schibsted text-neutral-600 dark:text-neutral-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Usage bars — directly under plan info */}
                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-schibsted text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                          <IconChartBar size={12} className="text-cyan-600" />
                          Usage this period
                        </p>
                        {startDateShort && endDateShort && (
                          <p className="font-schibsted text-xs text-neutral-400 flex items-center gap-1">
                            <IconCalendar size={11} />
                            {startDateShort} – {endDateShort}
                          </p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <UsageBar label="Inbound tickets"  current={data.usage.ticketCountInbound}  max={data.limits?.ticketsPerMonth ?? -1} />
                        <UsageBar label="Outbound replies" current={data.usage.ticketCountOutbound} max={0} />
                        <UsageBar label="Domains"          current={data.usage.domainCount ?? 0} max={data.limits?.domains ?? -1} />
                        <UsageBar label="Aliases / domain" current={data.usage.aliasCount ?? 0} max={data.limits?.aliasesPerDomain ?? -1} />
                        <UsageBar label="Chat widgets"     current={data.usage.chatWidgetCount ?? 0} max={data.limits?.chatWidgets ?? -1} />
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col gap-2 sm:min-w-[190px]">
                    <p className="font-schibsted text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1">Actions</p>
                    <ActionButton
                      onClick={handlePortal}
                      loading={portalLoading}
                      label="Manage payment"
                      loadingLabel="Loading…"
                      variant="default"
                    />
                    <ActionButton
                      onClick={() => setActivePageTab("plans")}
                      label="Change plan"
                      variant="primary"
                    />
                    {data.status === "active" && (
                      <ActionButton
                        onClick={handleReactivateAliases}
                        loading={reactivating}
                        label="Reactivate aliases"
                        loadingLabel="Reactivating…"
                        variant="default"
                      />
                    )}
                    {data.cancelAtPeriodEnd || data.status === "cancelled" ? (
                      <ActionButton
                        onClick={handleResume}
                        loading={resuming}
                        label="Resume subscription"
                        loadingLabel="Resuming…"
                        variant="default"
                      />
                    ) : (
                      <ActionButton
                        onClick={handleCancel}
                        loading={cancelling}
                        label="Cancel subscription"
                        loadingLabel="Cancelling…"
                        variant="danger"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Plans tab ── */}
            {activePageTab === "plans" && (
              <motion.div key="plans"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                <p className="text-xs font-schibsted text-neutral-400 mb-4">
                  Upgrade or downgrade your plan at any time. Changes take effect immediately or at the end of your billing period.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {PLAN_ORDER.map((pid) => (
                    <PlanCard
                      key={pid}
                      pid={pid}
                      isCurrent={pid === data.planId}
                      isUpgrade={PLAN_ORDER.indexOf(pid) > currentIndex}
                      isDowngrade={currentIndex >= 0 && PLAN_ORDER.indexOf(pid) < currentIndex}
                      isPending={data.pendingPlanId === pid}
                      onUpgrade={() => setUpgradeTarget(pid)}
                      onDowngrade={() => setDowngradeTarget(pid)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </Card>

      {/* Modals */}
      <UpgradeModal
        isOpen={upgradeTarget !== null}
        onClose={() => setUpgradeTarget(null)}
        targetPlanId={upgradeTarget ?? "growth"}
      />
      <DowngradeModal
        isOpen={downgradeTarget !== null}
        onClose={() => { setDowngradeTarget(null); refresh(); }}
        currentPlanName={currentMeta?.name ?? "No Plan"}
        targetPlanId={(downgradeTarget ?? "starter") as "starter" | "growth"}
        targetPlanName={downgradeTarget ? PLAN_META[downgradeTarget].name : ""}
        targetPlanPrice={downgradeTarget ? PLAN_META[downgradeTarget].price : 0}
        currentPeriodEnd={data.currentPeriodEnd}
      />
    </div>
  );
}