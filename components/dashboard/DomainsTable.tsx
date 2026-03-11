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
import { CopyIcon, TrashIconShake } from "@/constants/icons";
import { AnimatedDeleteButton } from "../ui/AnimatedDeleteButton";
import { CopyIconButton } from "@/components/ui/CopyIconButton";
import { Heading } from "../Heading";


type DnsRecord = {
  record: string;
  name: string;
  type: string;
  value?: string;
  status: string;
  priority?: number;
    ttl?: string;
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

// ─── Animated Button ──────────────────────────────────────────────────────────

type BtnState = "idle" | "loading" | "success" | "error";

export function AnimatedButton({
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

    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [copiedItem, setCopiedItem] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <p className="text-xs font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">DNS records for sending emails from your workspace</p>
      <div className="overflow-x-auto rounded-lg border border-neutral-900 dark:border-neutral-700">
        <table className="min-w-full text-xs">
          <thead>
            <tr>
              {["Type", "Name", "Value", "TTL", "Priority", "Status"].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-schibsted bg-linear-to-b from-sky-700 to-cyan-600 text-neutral-50 dark:text-neutral-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => {
              const displayName = r.name === "@" || !r.name ? "@" : r.name;
              const isVerified = r.status === "verified";
              return (
                <tr key={i} className="border-t border-neutral-900 dark:border-neutral-700">
                  <td className="px-3 py-2">
                    <span className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm border border-neutral-800 font-schibsted font-bold text-neutral-700 dark:text-neutral-300">{r.type}</span>
                  </td>

                  <td className="px-3 py-2 max-w-50">
                    <div className="flex items-center cursor-pointer group/name"
                    onMouseEnter={() => setHoveredItem(`${i}-name`)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => {
                        navigator.clipboard.writeText(displayName);
                        setCopiedItem(`${i}-name`);
                        setTimeout(() => setCopiedItem(null), 2000);
                    }}
                    >
                      <span className="flex items-center gap-2 relative">
                        <code
                          className="truncate text-neutral-500 group-hover/name:text-neutral-900 dark:text-neutral-300 font-schibsted font-semibold transition-colors duration-200">{displayName}</code>

                        <AnimatePresence>
                        {hoveredItem === `${i}-name` && (
                            <motion.span
                            initial={{ opacity: 0.95, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.25, ease: [.075, .82, .165, 1] }}
                            className="absolute left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 text-xs font-schibsted text-neutral-600 dark:text-neutral-400 flex items-center gap-1 whitespace-nowrap"
                            >
                            {/* {copiedItem === `${i}-name` ? <IconCheck size={11} /> : <IconCopy size={11} />} */}
                            <CopyIcon copied={copiedItem === `${i}-name`} size={16} />
                            </motion.span>
                        )}
                        </AnimatePresence>
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-2 max-w-50">
                    <div className="flex items-center cursor-pointer group/value"
                    onMouseEnter={() => setHoveredItem(`${i}-value`)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => {
                        if (!r.value) return;
                        navigator.clipboard.writeText(r.value);
                        setCopiedItem(`${i}-value`);
                        setTimeout(() => setCopiedItem(null), 2000);
                    }}
                    >
                    <span className="flex items-center gap-2 relative">
                        <code className="truncate max-w-30 text-neutral-500 group-hover/value:text-neutral-900 dark:text-neutral-300 font-schibsted font-semibold">{r.value}</code>
                        <AnimatePresence>
                        {hoveredItem === `${i}-value` && r.value && (
                            <motion.span
                            initial={{ opacity: 0.95, scale: 0.9}} animate={{ opacity: 1, scale: 1}} exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.15, ease: [.165, .84, .44, 1] }}
                            className="absolute left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 text-xs font-schibsted text-neutral-600 dark:text-neutral-400 flex items-center gap-1 whitespace-nowrap"
                            >
                            {/* {copiedItem === `${i}-value` ? <IconCheck size={11} /> : <IconCopy size={11} />} */}
                            <CopyIcon copied={copiedItem === `${i}-value`} size={16} />
                            </motion.span>
                        )}
                        </AnimatePresence>
                    </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-schibsted font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 cursor-pointer transition-colors duration-200">
                    {r.ttl ?? "—"}
                  </td>

                    <td className="px-3 py-2 font-schibsted font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 cursor-pointer transition-colors duration-200">
                    {r.priority ?? "—"}
                    </td>

                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 font-schibsted font-semibold ${isVerified
                      ? "bg-green-50 border border-green-900 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-amber-50 border border-amber-900 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                      {isVerified ? "Verified" : "Pending"}
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

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <p className="text-xs font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">DNS records for receiving emails in your workspace</p>
      <div className="overflow-x-auto rounded-lg border border-neutral-900 dark:border-neutral-700">
        <table className="min-w-full text-xs">
          <thead>
            <tr>
              {["Type", "Name", "Value", "TTL", "Priority", "Status"].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-schibsted bg-linear-to-b from-sky-700 to-cyan-600 text-neutral-50 dark:text-neutral-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => {
              const displayName = r.name === "@" || !r.name ? "@" : r.name;
              return (
              <tr key={i} className="border-t border-neutral-900 dark:border-neutral-700">
                <td className="px-3 py-2 max-w-50">
                  <span className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm border border-neutral-800 font-schibsted font-bold text-neutral-700 dark:text-neutral-300">{r.type}</span>
                </td>
                
                <td className="px-3 py-2 max-w-50">
                  <div className="flex items-center cursor-pointer group/mx-name"
                    onMouseEnter={() => setHoveredItem(`${i}-mx-name`)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => {
                      navigator.clipboard.writeText(displayName);
                      setCopiedItem(`${i}-mx-name`);
                      setTimeout(() => setCopiedItem(null), 2000);
                    }}
                  >
                    <span className="flex items-center gap-2 relative">
                      <code className="truncate text-neutral-500 group-hover/mx-name:text-neutral-900 dark:text-neutral-300 font-schibsted font-semibold transition-colors duration-200">{displayName}</code>
                      
                      <AnimatePresence>
                        {hoveredItem === `${i}-mx-name` && (
                          <motion.span
                            initial={{ opacity: 0.95, scale: 0.9, filter: "blur(1px)" }} 
                            animate={{ opacity: 1, scale: 1, filter: "blur(0)" }} 
                            exit={{ opacity: 0, scale: 0.9, filter: "blur(1px)" }}
                            transition={{ duration: 0.25, ease: [.075, .82, .165, 1] }}
                            className="absolute left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 text-xs font-schibsted text-neutral-600 dark:text-neutral-400 flex items-center gap-1 whitespace-nowrap"
                          >
                            <CopyIcon copied={copiedItem === `${i}-mx-name`} size={16} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </div>
                </td>

                <td className="px-3 py-2 max-w-50">
                  <div className="flex items-center cursor-pointer group/mx-value"
                    onMouseEnter={() => setHoveredItem(`${i}-mx-value`)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => {
                      navigator.clipboard.writeText(r.value);
                      setCopiedItem(`${i}-mx-value`);
                      setTimeout(() => setCopiedItem(null), 2000);
                    }}
                  >
                    <span className="flex items-center gap-2 relative">
                      <code className="truncate max-w-30 text-neutral-500 group-hover/mx-value:text-neutral-900 dark:text-neutral-300 font-schibsted font-semibold transition-colors duration-200">{r.value}</code>
                      
                      <AnimatePresence>
                        {hoveredItem === `${i}-mx-value` && (
                          <motion.span
                            initial={{ opacity: 0.95, scale: 0.9, filter: "blur(1px)" }} 
                            animate={{ opacity: 1, scale: 1, filter: "blur(0)" }} 
                            exit={{ opacity: 0, scale: 0.9, filter: "blur(1px)" }}
                            transition={{ duration: 0.15, ease: [.165, .84, .44, 1] }}
                            className="absolute left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 text-xs font-schibsted text-neutral-600 dark:text-neutral-400 flex items-center gap-1 whitespace-nowrap"
                          >
                            <CopyIcon copied={copiedItem === `${i}-mx-value`} size={16} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </div>
                </td>

                <td className="px-3 py-2 max-w-50 font-schibsted font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 cursor-pointer transition-colors duration-200">
                  {r.ttl ?? "—"}
                </td>

                <td className="px-3 py-2 max-w-50 font-schibsted font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 cursor-pointer transition-colors duration-200">
                  {r.priority}
                </td>

                <td className="px-3 py-2 max-w-50">
                  <span className="inline-flex items-center gap-1 rounded-sm px-2 py-0.5 font-schibsted font-semibold bg-green-50 border border-green-900 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Verified
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

      // Merge with existing detail so no fields (like resendDomainId) get wiped
      if (data.domain) {
        setDetail((prev) => prev ? { ...prev, ...data.domain } : data.domain);
      }

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
                initial={{ opacity: 0.5, scale: 0.98, y: -2 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: [.075, .82, .165, 1] } }}
                exit={{ opacity: 0.5, scale: 0.98, y: -2, transition: { duration: 0.15, ease: [.075, .82, .165, 1] } }}
                style={{ transformOrigin: "top left" }}
                className="space-y-2"
            >
                {/* Label */}
                <div className="h-3 w-48 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />

                {/* Table */}
                <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                <table className="min-w-full text-xs">
                    <thead>
                    <tr className="bg-neutral-100 dark:bg-neutral-800">
                        {[40, 48, 52, 80, 44].map((w, i) => (
                        <th key={i} className="px-3 py-2 text-left">
                            <div className={`h-2.5 rounded bg-neutral-300 dark:bg-neutral-600 animate-pulse`} style={{ width: w }} />
                        </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({ length: initialDetail?.dnsRecords?.length ?? 3 }).map((_, i) => (
                        <tr key={i} className="border-t border-neutral-200 dark:border-neutral-700">
                        <td className="px-3 py-2"><div className="h-2.5 w-8 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" /></td>
                        <td className="px-3 py-2"><div className="h-2.5 w-20 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" /></td>
                        <td className="px-3 py-2"><div className="h-2.5 w-24 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" /></td>
                        <td className="px-3 py-2"><div className="h-2.5 w-32 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" /></td>
                        <td className="px-3 py-2"><div className="h-2.5 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" /></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                {/* Button row */}
                <div className="flex items-center gap-2 pt-1">
                <div className="h-7 w-28 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                </div>
            </motion.div>
        ) : (
          <motion.div
            key="content"
            layout
            initial={{ opacity: 0.5, scale: 0.98, y: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: [.075, .82, .165, 1] } }}
            exit={{ opacity: 0.5, scale: 0.98, y: -2, transition: { duration: 0.15, ease: [.075, .82, .165, 1] } }}
            style={{ transformOrigin: "top left" }}
            className="space-y-4"
          >

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

            {/* <div className={`rounded-lg px-3 py-2 border flex items-center gap-2 ${isVerified
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : detail?.resendDomainId
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
              }`}>
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
            </div> */}
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
  const isDeleted = deleteStatus === "deleted";


  const getStatusBadge = () => {
    if (domain.verifiedForSending || domain.status === "verified") {
      return <Badge className="bg-green-50 border border-green-900 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-sm font-schibsted font-semibold">Verified</Badge>;
    }
    if (domain.status === "active") {
      return <Badge className="bg-blue-100 border border-blue-900 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-sm font-schibsted font-semibold">Active</Badge>;
    }
    return <Badge className="bg-amber-100 border border-amber-900 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-sm font-schibsted font-semibold">Pending Verification</Badge>;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: isDeleted ? 0 : 1, scale: isDeleted ? 0.97 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -4 }}
      transition={{ duration: 0.15, ease: [.215, .61, .355, 1] }}
      style={{ transformOrigin: "top left" }}
    >
      <Card className="bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors duration-300 ease-out">
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
          <AnimatedDeleteButton
            onDelete={async () => {
                try {
                const res = await fetch("/api/domains/" + domain.id, { method: "DELETE" });
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    throw new Error(body.error || "Failed to delete");
                }
                toast.success("Domain deleted");
                setTimeout(() => onDelete(domain.id), 400);
                return "success";
                } catch (err: any) {
                toast.error(err.message || "Failed to delete domain");
                return "error";
                }
            }}
            />
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

      <DomainAddForm onDomainAdded={handleDomainAdded} />

      <div className="border-2 border-dashed border-neutral-200 rounded-xl px-4 pt-3 pb-3">

        <Card className="min-h-[120px] overflow-hidden">
            <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">Your Domains</Heading>
            <Paragraph variant="small" className="text-neutral-600 dark:text-neutral-400 mt-1 pb-5">
            Manage the domains you use to send and receive emails. Click on a domain to view its DNS records and verification status.
            </Paragraph>
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
                className="space-y-2"
                >
                {domains.map((d, index) => (
                    <DomainCard key={d.id} domain={d} onDelete={handleDelete} index={index} />
                ))}
                </motion.div>
            )}
            </AnimatePresence>
        </Card>
        </div>
    </>
  );
}