"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  IconCheck,
  IconTrash,
  IconGlobe,
  IconChevronDown,
  IconRefresh,
  IconPlus,
  IconX,
  IconCopy,
  IconWorldUpload,
} from "@tabler/icons-react";
import { Paragraph } from "../Paragraph";
import DomainAddForm from "./DomainAddForm";

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Shared inline sub-types ────────────────────────────────────────────────

type DnsRecord = {
  record: string;
  name: string;
  type: string;
  value?: string;
  status: string;
  priority?: number;
};

type MxRecord = {
  type: string;
  name: string;
  value: string;
  priority: number;
  ttl: string;
};

interface DomainRow {
  id: string;
  domain: string;
  status: string;
  verifiedForSending?: boolean;
  receivingEnabled?: boolean;
  createdAt: string;
  prefetchedDetail?: {
    resendDomainId?: string | null;
    dnsRecords?: DnsRecord[];
    receivingEnabled?: boolean;
    receivingMxRecords?: MxRecord[];
    lastCheckedAt?: string | null;
  };
}

interface DomainDetail extends DomainRow {
  resendDomainId?: string | null;
  dnsRecords?: DnsRecord[];
  receivingMxRecords?: MxRecord[];
  lastCheckedAt?: string | null;
}

// ─── Easing ───────────────────────────────────────────────────────────────────

const outCubic = [0.215, 0.61, 0.355, 1] as const;
const outQuint = [0.23, 1, 0.32, 1] as const;

// ─── Loader CSS ───────────────────────────────────────────────────────────────

const loaderStyle = `
  .btn-loader {
    width: 14px;
    height: 14px;
    --b: 2px;
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 1px;
    background: conic-gradient(#0000 10%, currentColor) content-box;
    -webkit-mask:
      repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
      radial-gradient(farthest-side, #0000 calc(100% - var(--b) - 1px), #000 calc(100% - var(--b)));
    -webkit-mask-composite: destination-in;
    mask-composite: intersect;
    animation: btn-spin 1s infinite steps(10);
    flex-shrink: 0;
  }
  @keyframes btn-spin { to { transform: rotate(1turn); } }
`;

// ─── Animated Button ──────────────────────────────────────────────────────────

type BtnState = "idle" | "loading" | "success" | "error";

function AnimatedButton({
  idleLabel,
  loadingLabel,
  successLabel,
  errorLabel,
  idleIcon,
  onClick,
  state,
  idleWidth,
  loadingWidth,
  successWidth,
  errorWidth,
  className,
  disabled,
}: {
  idleLabel: string;
  loadingLabel: string;
  successLabel: string;
  errorLabel?: string;
  idleIcon: React.ReactNode;
  onClick: () => void;
  state: BtnState;
  idleWidth: number;
  loadingWidth: number;
  successWidth: number;
  errorWidth?: number;
  className: string;
  disabled?: boolean;
}) {
  const width =
    state === "loading" ? loadingWidth
      : state === "success" ? successWidth
        : state === "error" ? (errorWidth ?? idleWidth)
          : idleWidth;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || state === "loading"}
      className={className}
      animate={{ width }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "loading" && (
          <motion.span key="loading"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: outCubic }}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="btn-loader" />
            <span>{loadingLabel}</span>
          </motion.span>
        )}
        {state === "success" && (
          <motion.span key="success"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: outQuint }}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <IconCheck size={13} />
            <span>{successLabel}</span>
          </motion.span>
        )}
        {state === "error" && (
          <motion.span key="error"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: outCubic }}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <IconX size={13} />
            <span>{errorLabel ?? "Failed"}</span>
          </motion.span>
        )}
        {state === "idle" && (
          <motion.span key="idle"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.1, ease: outCubic }}
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

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      animate={{ width: copied ? 64 : 52 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="shrink-0 px-2 py-0.5 rounded text-xs font-schibsted border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-center gap-1 overflow-hidden cursor-pointer focus:outline-none"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="copied"
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: outCubic }}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <IconCheck size={11} />
            <span>Done</span>
          </motion.span>
        ) : (
          <motion.span key="copy"
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.1, ease: outCubic }}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <IconCopy size={11} />
            <span>Copy</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── DNS Records Table ────────────────────────────────────────────────────────

// function DNSTable({ records, domainName }: { records: DomainDetail["dnsRecords"]; domainName: string }) {
//   if (!records?.length) return (
//     <p className="text-xs font-schibsted text-neutral-500 dark:text-neutral-400">
//       No DNS records yet. Add this domain to Resend first.
//     </p>
//   );

//   return (
//     <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
//       <table className="min-w-full text-xs">
//         <thead className="bg-neutral-50 dark:bg-neutral-800">
//           <tr>
//             {["Type", "Name", "Record", "Value", "Status"].map((h) => (
//               <th key={h} className="px-3 py-2 text-left font-schibsted bg-linear-to-b from-sky-700 to-cyan-600 text-neutral-50 dark:text-neutral-400">{h}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {records.map((r, i) => {
//             const displayName = r.name === "@" || !r.name ? "@" : r.name;
//             const isVerified = r.status === "verified";
//             return (
//               <tr key={i} className="border-t border-neutral-200 dark:border-neutral-700">
//                 <td className="px-3 py-2">
//                   <span className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded font-schibsted font-medium text-neutral-700 dark:text-neutral-300">{r.type}</span>
//                 </td>
//                 <td className="px-3 py-2 max-w-50">
//                   <div className="flex items-center gap-2">
//                     <code className="truncate text-neutral-700 dark:text-neutral-300 font-schibsted">{displayName}</code>
//                     <CopyButton value={displayName} />
//                   </div>
//                 </td>
//                 <td className="px-3 py-2 max-w-50">
//                   <div className="flex items-center gap-2">
//                     <span className="truncate font-schibsted text-neutral-600 dark:text-neutral-400">{r.record}</span>
//                     <CopyButton value={r.record} />
//                   </div>
//                 </td>
//                 <td className="px-3 py-2 max-w-50">
//                   <div className="flex items-center gap-2">
//                     <code className="truncate text-neutral-700 dark:text-neutral-300 font-schibsted">{r.value}</code>
//                     {r.value && <CopyButton value={r.value} />}
//                   </div>
//                 </td>
//                 <td className="px-3 py-2">
//                   <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-schibsted font-semibold ${
//                     isVerified
//                       ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
//                       : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
//                   }`}>
//                     {isVerified ? "✓ Verified" : "Pending"}
//                   </span>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// ─── DNS Records Table (Sending) ─────────────────────────────────────────────

function DNSTable({ records, domainName }: { records: DomainDetail["dnsRecords"]; domainName: string }) {
  if (!records?.length) return (
    <div className="space-y-2">
      <Paragraph variant="small" className="font-semibold text-neutral-700 dark:text-neutral-300">
        DNS records for sending emails from your workspace
      </Paragraph>
      <Paragraph variant="small" className="text-neutral-500 dark:text-neutral-400">
        No DNS records yet. Add this domain to Resend first.
      </Paragraph>
    </div>
  );

  return (
    <div className="space-y-2">
      <p className="text-xs font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">DNS records for sending emails from your workspace</p>
      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className="min-w-full text-xs">
          <thead>
            <tr>
              {["Type", "Name", "Record", "Value", "Status"].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-schibsted bg-linear-to-b from-sky-700 to-cyan-600 text-neutral-50 dark:text-neutral-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => {
              const displayName = r.name === "@" || !r.name ? "@" : r.name;
              const isVerified = r.status === "verified";
              return (
                <tr key={i} className="border-t border-neutral-200 dark:border-neutral-700">
                  <td className="px-3 py-2">
                    <span className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded font-schibsted font-medium text-neutral-700 dark:text-neutral-300">{r.type}</span>
                  </td>
                  <td className="px-3 py-2 max-w-50">
                    <div className="flex items-center gap-2">
                      <code className="truncate text-neutral-700 dark:text-neutral-300 font-schibsted">{displayName}</code>
                      <CopyButton value={displayName} />
                    </div>
                  </td>
                  <td className="px-3 py-2 max-w-50">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-schibsted text-neutral-600 dark:text-neutral-400">{r.record}</span>
                      <CopyButton value={r.record} />
                    </div>
                  </td>
                  <td className="px-3 py-2 max-w-50">
                    <div className="flex items-center gap-2">
                      <code className="truncate text-neutral-700 dark:text-neutral-300 font-schibsted">{r.value}</code>
                      {r.value && <CopyButton value={r.value} />}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-schibsted font-semibold ${isVerified
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                      {isVerified ? "✓ Verified" : "Pending"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MX Records Table (Receiving) ─────────────────────────────────────────────

function MXTable({ records }: { records: DomainDetail["receivingMxRecords"] }) {
  if (!records?.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">DNS records for receiving emails in your workspace</p>
      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className="min-w-full text-xs">
          <thead>
            <tr>
              {["Type", "Name", "Value", "Priority"].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-schibsted bg-linear-to-b from-sky-700 to-cyan-600 text-neutral-50 dark:text-neutral-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i} className="border-t border-neutral-200 dark:border-neutral-700">
                <td className="px-3 py-2">
                  <span className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded font-schibsted font-medium text-neutral-700 dark:text-neutral-300">{r.type}</span>
                </td>
                <td className="px-3 py-2 max-w-50">
                  <div className="flex items-center gap-2">
                    <code className="truncate text-neutral-700 dark:text-neutral-300 font-schibsted">{r.name}</code>
                    <CopyButton value={r.name} />
                  </div>
                </td>
                <td className="px-3 py-2 max-w-50">
                  <div className="flex items-center gap-2">
                    <code className="truncate text-neutral-700 dark:text-neutral-300 font-schibsted">{r.value}</code>
                    <CopyButton value={r.value} />
                  </div>
                </td>
                <td className="px-3 py-2 font-schibsted text-neutral-700 dark:text-neutral-300">{r.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Expanded Panel ───────────────────────────────────────────────────────────

// function ExpandedPanel({ domainId, domainName }: { domainId: string; domainName: string }) {
//   const [detail, setDetail] = useState<DomainDetail | null>(null);
//   const [loadingDetail, setLoadingDetail] = useState(true);
//   const [addToResendState, setAddToResendState] = useState<BtnState>("idle");
//   const [checkState, setCheckState] = useState<BtnState>("idle");

//   const fetchDetail = useCallback(async () => {
//     try {
//       const res = await fetch(`/api/domains/${domainId}`);
//       if (!res.ok) throw new Error();
//       const data = await res.json();
//       setDetail(data);
//     } catch {
//       toast.error("Failed to load domain details");
//     } finally {
//       setLoadingDetail(false);
//     }
//   }, [domainId]);

//   useEffect(() => {
//     fetchDetail();
//   }, [fetchDetail]);

//   const handleAddToResend = async () => {
//     setAddToResendState("loading");
//     try {
//       const res = await fetch("/api/domains/add-to-resend", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ domainId }),
//       });
//       if (!res.ok) throw new Error();
//       setAddToResendState("success");
//       await fetchDetail();
//       setTimeout(() => setAddToResendState("idle"), 2000);
//     } catch {
//       setAddToResendState("error");
//       setTimeout(() => setAddToResendState("idle"), 2000);
//     }
//   };

//   const handleCheckVerification = async () => {
//     setCheckState("loading");
//     try {
//       const res = await fetch("/api/domains/check-verification", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ domainId }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);
//       setDetail(data.domain ?? detail);
//       setCheckState("success");
//       setTimeout(() => setCheckState("idle"), 2000);
//     } catch {
//       setCheckState("error");
//       setTimeout(() => setCheckState("idle"), 2000);
//     }
//   };

//   const isVerified = detail?.status === "verified" || detail?.verifiedForSending;

//   return (
//     <div className="px-4 pb-4 pt-1 space-y-4 border-t border-neutral-100 dark:border-neutral-800 mt-1">

//           <motion.div
//             animate={{ height: "auto" }}
//             transition={{ duration: 0.3, ease: outQuint }}
//             style={{ overflow: "hidden" }}
//             >
//             <AnimatePresence mode="wait" initial={false}>
//                 {loadingDetail ? (
//                 <motion.div
//                     key="loading"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.15, type: "spring", stiffness: 300, damping: 25 }}
//                     className="flex items-center gap-2 py-3"
//                 >
//                     <span className="btn-loader text-neutral-400" />
//                     <Paragraph variant="muted" className="text-xs">Loading records...</Paragraph>
//                 </motion.div>
//                 ) : (
//                 <motion.div
//                     key="content"
//                     initial={{ opacity: 0.95, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0.95, y: 10 }}
//                     transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
//                     className="space-y-3"
//                 >

//                     <div className={`rounded-lg px-3 py-2 border ${
//                     isVerified
//                         ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
//                         : detail?.resendDomainId
//                         ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
//                         : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
//                     }`}>
//                         {isVerified && (
//                             <IconCheck size={14} className="text-green-700 dark:text-green-400 shrink-0" />
//                         )}
//                         <Paragraph variant="muted" className={`text-xs ${
//                             isVerified
//                             ? "text-green-800 dark:text-green-300"
//                             : detail?.resendDomainId
//                             ? "text-blue-800 dark:text-blue-200"
//                             : "text-amber-800 dark:text-amber-200"
//                         }`}>
//                             {isVerified
//                             ? "Domain verified — you can send emails from this domain."
//                             : detail?.resendDomainId
//                             ? "Add the DNS records below at your domain provider. Verification usually takes 5–30 minutes."
//                             : "Click \"Add to Resend\" to get your DNS records."}
//                         </Paragraph>

//                     </div>
//                 </motion.div>
//                 )}
//             </AnimatePresence>
//           </motion.div>

//           {/* DNS Records */}
//           <DNSTable records={detail?.dnsRecords} domainName={domainName} />

//           {/* Receiving MX Records */}
//           {detail?.receivingEnabled && detail.receivingMxRecords && detail.receivingMxRecords.length > 0 && (
//             <div className="space-y-2">
//               <p className="text-xs font-schibsted font-medium text-neutral-700 dark:text-neutral-300">📬 MX Records for receiving:</p>
//               <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
//                 <table className="min-w-full text-xs">
//                   <thead className="bg-neutral-50 dark:bg-neutral-800">
//                     <tr>
//                       {["Type", "Name", "Value", "Priority"].map((h) => (
//                         <th key={h} className="px-3 py-2 text-left font-schibsted font-medium text-neutral-500">{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {detail.receivingMxRecords.map((r, i) => (
//                       <tr key={i} className="border-t border-neutral-200 dark:border-neutral-700">
//                         <td className="px-3 py-2 font-mono text-neutral-700 dark:text-neutral-300">{r.type}</td>
//                         <td className="px-3 py-2 font-mono text-neutral-700 dark:text-neutral-300">{r.name}</td>
//                         <td className="px-3 py-2">
//                           <div className="flex items-center gap-2">
//                             <code className="truncate font-mono text-neutral-700 dark:text-neutral-300">{r.value}</code>
//                             <CopyButton value={r.value} />
//                           </div>
//                         </td>
//                         <td className="px-3 py-2 text-neutral-600 dark:text-neutral-400">{r.priority}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Action buttons */}
//           <div className="flex items-center gap-2 flex-wrap">
//             {!detail?.resendDomainId && (
//               <AnimatedButton
//                 idleLabel="Add to Resend"
//                 loadingLabel="Adding..."
//                 successLabel="Added!"
//                 errorLabel="Failed"
//                 idleIcon={<IconPlus size={13} />}
//                 onClick={handleAddToResend}
//                 state={addToResendState}
//                 idleWidth={120}
//                 loadingWidth={100}
//                 successWidth={84}
//                 errorWidth={80}
//                 className="shrink-0 px-3 py-1.5 rounded-md text-xs font-schibsted text-white bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center gap-1.5 overflow-hidden border-0 focus:outline-none cursor-pointer disabled:opacity-60"
//               />
//             )}
//             {detail?.resendDomainId && (
//               <AnimatedButton
//                 idleLabel="Check Verification"
//                 loadingLabel="Checking..."
//                 successLabel="Verified!"
//                 errorLabel="Not yet"
//                 idleIcon={<IconRefresh size={13} />}
//                 onClick={handleCheckVerification}
//                 state={checkState}
//                 idleWidth={148}
//                 loadingWidth={110}
//                 successWidth={90}
//                 errorWidth={84}
//                 className="shrink-0 px-3 py-1.5 rounded-md text-xs font-schibsted text-white bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center gap-1.5 overflow-hidden border-0 focus:outline-none cursor-pointer disabled:opacity-60"
//               />
//             )}
//             {detail?.lastCheckedAt && (
//               <span className="text-xs text-neutral-400 font-schibsted tabular-nums">
//                 Last checked: {new Date(detail.lastCheckedAt).toLocaleString()}
//               </span>
//             )}
//           </div>
//     </div>
//   );
// };


function ExpandedPanel({
  domainId,
  domainName,
  isOpen,
  initialDetail,
}: {
  domainId: string;
  domainName: string;
  isOpen: boolean;
  initialDetail?: DomainRow["prefetchedDetail"];
}) {
  // Seed state with prefetched data if available — skips loading entirely on first open
  const [detail, setDetail] = useState<DomainDetail | null>(
    initialDetail
      ? {
        id: domainId,
        domain: domainName,
        status: "pending_verification",
        createdAt: new Date().toISOString(),
        resendDomainId: initialDetail.resendDomainId,
        dnsRecords: initialDetail.dnsRecords || [],
        receivingEnabled: initialDetail.receivingEnabled || false,
        receivingMxRecords: initialDetail.receivingMxRecords || [],
        lastCheckedAt: initialDetail.lastCheckedAt,
      }
      : null
  );
  const [loadingDetail, setLoadingDetail] = useState(!initialDetail);
  const [addToResendState, setAddToResendState] = useState<BtnState>("idle");
  const [checkState, setCheckState] = useState<BtnState>("idle");
  const [hasFetched, setHasFetched] = useState(!!initialDetail);

  const fetchDetail = useCallback(async () => {
    try {
      const res = await fetch(`/api/domains/${domainId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDetail(data);
    } catch {
      toast.error("Failed to load domain details");
    } finally {
      setLoadingDetail(false);
      setHasFetched(true);
    }
  }, [domainId]);

  // Only fetch once — on the first time the panel is opened
  useEffect(() => {
    if (isOpen && !hasFetched) {
      fetchDetail();
    }
  }, [isOpen, hasFetched, fetchDetail]);

  const handleAddToResend = async () => {
    setAddToResendState("loading");
    try {
      const res = await fetch("/api/domains/add-to-resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId }),
      });
      if (!res.ok) throw new Error();
      setAddToResendState("success");
      await fetchDetail();
      setTimeout(() => setAddToResendState("idle"), 2000);
    } catch {
      setAddToResendState("error");
      setTimeout(() => setAddToResendState("idle"), 2000);
    }
  };

  const handleCheckVerification = async () => {
    setCheckState("loading");
    try {
      const res = await fetch("/api/domains/check-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDetail(data.domain ?? detail);
      setCheckState("success");
      setTimeout(() => setCheckState("idle"), 2000);
    } catch {
      setCheckState("error");
      setTimeout(() => setCheckState("idle"), 2000);
    }
  };

  const isVerified = detail?.status === "verified" || detail?.verifiedForSending;

  return (
    <motion.div layout
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
      className="px-4 pb-4 pt-1 border-t border-neutral-100 dark:border-neutral-800 mt-1">
      <AnimatePresence mode="wait" initial={false}>
        {loadingDetail ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0.6, scale: 0.97, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0.4, scale: 0.98, y: -3 }}
            transition={{ duration: 0.3, ease: [.785, .135, .15, .86] }}
            className="w-full h-20 flex items-center justify-center gap-2 py-3"
          >
            <span className="btn-loader text-neutral-400" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            layout
            initial={{ opacity: 0.5, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0.5, scale: 0.98, y: -4 }}
            transition={{ duration: 0.15, ease: [.785, .135, .15, .86] }}
            className="space-y-4"
          >

            <div className={`rounded-lg px-3 py-2 border flex items-center gap-2 ${isVerified
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : detail?.resendDomainId
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
              }`}>
              {isVerified && (
                <IconCheck size={14} className="text-green-700 dark:text-green-400 shrink-0" />
              )}
              <Paragraph variant="muted" className={`text-xs ${isVerified
                ? "text-green-800 dark:text-green-300"
                : detail?.resendDomainId
                  ? "text-blue-800 dark:text-blue-200"
                  : "text-amber-800 dark:text-amber-200"
                }`}>
                {isVerified
                  ? "Domain verified — you can send emails from this domain."
                  : detail?.resendDomainId
                    ? "Add the DNS records below at your domain provider. Verification usually takes 5–30 minutes."
                    : "Click \"Add to Resend\" to get your DNS records."}
              </Paragraph>
            </div>


            {/* <DNSTable records={detail?.dnsRecords} domainName={domainName} />

      
            {detail?.receivingEnabled && detail.receivingMxRecords && detail.receivingMxRecords.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-schibsted font-medium text-neutral-700 dark:text-neutral-300">📬 MX Records for receiving:</p>
                <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <table className="min-w-full text-xs">
                    <thead className="bg-neutral-50 dark:bg-neutral-800">
                      <tr>
                        {["Type", "Name", "Value", "Priority"].map((h) => (
                          <th key={h} className="px-3 py-2 text-left font-schibsted font-medium text-neutral-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {detail.receivingMxRecords.map((r, i) => (
                        <tr key={i} className="border-t border-neutral-200 dark:border-neutral-700">
                          <td className="px-3 py-2 font-mono text-neutral-700 dark:text-neutral-300">{r.type}</td>
                          <td className="px-3 py-2 font-mono text-neutral-700 dark:text-neutral-300">{r.name}</td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <code className="truncate font-mono text-neutral-700 dark:text-neutral-300">{r.value}</code>
                              <CopyButton value={r.value} />
                            </div>
                          </td>
                          <td className="px-3 py-2 text-neutral-600 dark:text-neutral-400">{r.priority}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )} */}

            {/* DNS Records — Sending */}
            <DNSTable records={detail?.dnsRecords} domainName={domainName} />

            {/* MX Records — Receiving */}
            {detail?.receivingMxRecords && detail.receivingMxRecords.length > 0 && (
              <MXTable records={detail.receivingMxRecords} />
            )}


            <div className="flex items-center gap-2 flex-wrap">
              {!detail?.resendDomainId && (
                <AnimatedButton
                  idleLabel="Add to Resend"
                  loadingLabel="Adding..."
                  successLabel="Added!"
                  errorLabel="Failed"
                  idleIcon={<IconPlus size={13} />}
                  onClick={handleAddToResend}
                  state={addToResendState}
                  idleWidth={120}
                  loadingWidth={100}
                  successWidth={84}
                  errorWidth={80}
                  className="shrink-0 px-3 py-1.5 rounded-md text-xs font-schibsted text-white bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center gap-1.5 overflow-hidden border-0 focus:outline-none cursor-pointer disabled:opacity-60"
                />
              )}
              {detail?.resendDomainId && (
                <AnimatedButton
                  idleLabel="Check Verification"
                  loadingLabel="Checking..."
                  successLabel="Verified!"
                  errorLabel="Not yet"
                  idleIcon={<IconRefresh size={13} />}
                  onClick={handleCheckVerification}
                  state={checkState}
                  idleWidth={148}
                  loadingWidth={110}
                  successWidth={90}
                  errorWidth={84}
                  className="shrink-0 px-3 py-1.5 rounded-md text-xs font-schibsted text-white bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center gap-1.5 overflow-hidden border-0 focus:outline-none cursor-pointer disabled:opacity-60"
                />
              )}
              {detail?.lastCheckedAt && (
                <span className="text-xs text-neutral-400 font-schibsted tabular-nums">
                  Last checked: {new Date(detail.lastCheckedAt).toLocaleString()}
                </span>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}

// ─── Domain Card ──────────────────────────────────────────────────────────────

type DeleteStatus = "idle" | "deleting" | "deleted";

function DomainCard({
  domain,
  onDelete,
  index,
}: {
  domain: DomainRow;
  onDelete: (id: string) => void;
  index: number;
}) {
  const [deleteStatus, setDeleteStatus] = useState<DeleteStatus>("idle");
  const [isOpen, setIsOpen] = useState(false);

  const isDeleting = deleteStatus === "deleting";
  const isDeleted = deleteStatus === "deleted";

  const handleDelete = async () => {
    if (!confirm("Delete domain " + domain.domain + "? This will also remove all aliases.")) return;
    setIsOpen(false);
    setDeleteStatus("deleting");
    try {
      const res = await fetch("/api/domains/" + domain.id, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete");
      }
      setDeleteStatus("deleted");
      setTimeout(() => onDelete(domain.id), 400);
      toast.success("Domain deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete domain");
      setDeleteStatus("idle");
    }
  };

  const getStatusBadge = () => {
    if (domain.verifiedForSending || domain.status === "verified") {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0 font-schibsted tracking-tight">Verified</Badge>;
    }
    if (domain.status === "active") {
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-0 font-schibsted tracking-tight">Active</Badge>;
    }
    return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-0 font-schibsted tracking-tight">Pending Verification</Badge>;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: isDeleted ? 0 : 1, scale: isDeleted ? 0.97 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -8 }}
      transition={{ duration: 0.25, ease: [.215, .61, .355, 1] }}
    >
      <Card className={`border shadow-none transition-colors duration-150 rounded-md overflow-hidden ${isOpen
        ? "border-sky-600 dark:border-sky-800"
        : "border-sky-600 dark:border-neutral-700 hover:border-sky-800 dark:hover:border-neutral-600"
        }`}>
        {/* Card header row */}
        <CardContent className="p-4 flex items-center gap-4">
          {/* Icon */}
          <div className="shrink-0 w-8 h-8 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center">
            <IconWorldUpload size={15} className="text-white" />
          </div>

          {/* Domain name + status — clickable to toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            className="flex-1 min-w-0 text-left cursor-pointer focus:outline-none"
          >
            <p className="font-schibsted font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
              {domain.domain}
            </p>
            <div className="mt-0.5">{getStatusBadge()}</div>
          </button>

          {/* Chevron toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex items-center justify-center"
            >
              <IconChevronDown size={15} className="text-neutral-500" />
            </motion.span>
          </button>

          {/* Delete button */}
          <motion.button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || isDeleted}
            className="shrink-0 px-3 py-1 rounded-md text-xs font-schibsted flex items-center justify-center gap-1.5 overflow-hidden border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            animate={{ width: isDeleting ? 90 : isDeleted ? 74 : 68 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDeleting && (
                <motion.span key="deleting"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15, ease: outCubic }}
                  className="flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Deleting...</span>
                </motion.span>
              )}
              {isDeleted && (
                <motion.span key="deleted"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: outQuint }}
                  className="flex items-center gap-1.5 whitespace-nowrap"
                >
                  <IconCheck size={13} /><span>Done</span>
                </motion.span>
              )}
              {!isDeleting && !isDeleted && (
                <motion.span key="delete"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.1, ease: outCubic }}
                  className="flex items-center gap-1.5 whitespace-nowrap"
                >
                  <IconTrash size={13} /><span>Delete</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </CardContent>

        {/* Expanded panel — always mounted so state (fetched data) is preserved across open/close */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: outQuint }}
          style={{ overflow: "hidden" }}
        >
          <ExpandedPanel
            domainId={domain.id}
            domainName={domain.domain}
            isOpen={isOpen}
            initialDetail={domain.prefetchedDetail}
          />
        </motion.div>
      </Card>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2, ease: outCubic }}
      className="flex flex-col items-center justify-center py-12 px-6 gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center opacity-40">
        <IconGlobe size={18} className="text-white" />
      </div>
      <Paragraph variant="muted" className="text-center max-w-lg">
        You haven't added any domains yet. Add your domain and verify to start creating email aliases and receive emails at your custom address.
      </Paragraph>
    </motion.div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────


export default function DomainsTable({ initialDomains }: { initialDomains: DomainRow[] }) {
  const [domains, setDomains] = useState<DomainRow[]>(initialDomains);

  const handleDelete = (id: string) => {
    setDomains((prev) => prev.filter((d) => d.id !== id));
  };

  const handleDomainAdded = (domain: DomainRow) => {
    setDomains((prev) => [domain, ...prev]);
  };

  return (
    <>
      <style>{loaderStyle}</style>

      <DomainAddForm onDomainAdded={handleDomainAdded} />

      <Card className="min-h-[120px] overflow-hidden mt-4">
        <AnimatePresence mode="wait">
          {domains.length === 0 ? (
            <EmptyState key="empty" />
          ) : (
            <motion.div
              key="list"
              layout
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.7 }}
              transition={{ duration: 0.15, type: "spring", stiffness: 300, damping: 20 }}
              className="p-2 space-y-2"
            >
              {domains.map((d, index) => (
                <DomainCard key={d.id} domain={d} onDelete={handleDelete} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </>
  );
}