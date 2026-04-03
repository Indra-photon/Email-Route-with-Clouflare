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
  IconWorldUpload,
  IconTable,
} from "@tabler/icons-react";
import { Paragraph } from "../Paragraph";
import { Heading } from "../Heading";
import DomainAddForm from "./DomainAddForm";
import { CopyIcon } from "@/constants/icons";
import { AnimatedDeleteButton } from "../ui/AnimatedDeleteButton";
import { CopyIconButton } from "@/components/ui/CopyIconButton";

// ─── Types ────────────────────────────────────────────────────────────────────

const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;
const outCubic = [0.215, 0.61, 0.355, 1] as const;
const outQuint = [0.23, 1, 0.32, 1] as const;

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

type PageTab = "domains" | "add" | "delete";
type BtnState = "idle" | "loading" | "success" | "error";

const PAGE_TABS: { id: PageTab; label: string }[] = [
  { id: "domains", label: "Domains" },
  { id: "add",     label: "Add Domain" },
  { id: "delete",  label: "Delete" },
];

// ─── Animated Button (exported for use in aliases page) ───────────────────────

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

// ─── DNS Records Table (Sending) ──────────────────────────────────────────────

function DNSTable({ records, domainName }: { records: DomainDetail["dnsRecords"]; domainName: string }) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  if (!records?.length) return (
    <div className="space-y-2">
      <p className="text-xs font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">
        DNS records for sending emails from your workspace
      </p>
      <p className="text-xs font-schibsted text-neutral-500 dark:text-neutral-400">
        No DNS records yet. Add this domain to Resend first.
      </p>
    </div>
  );

  return (
    <div className="space-y-2">
      <p className="text-xs font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">
        DNS records for sending emails from your workspace
      </p>
      <div className="overflow-x-auto rounded-lg border border-neutral-900 dark:border-neutral-700">
        <table className="min-w-full text-xs">
          <thead>
            <tr>
              {["Type", "Name", "Value", "TTL", "Priority", "Status"].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-schibsted bg-linear-to-b from-sky-700 to-cyan-600 text-neutral-50">
                  {h}
                </th>
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
                    <span className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm border border-neutral-800 font-schibsted font-bold text-neutral-700 dark:text-neutral-300">
                      {r.type}
                    </span>
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
                        <code className="truncate text-neutral-500 group-hover/name:text-neutral-900 dark:text-neutral-300 font-schibsted font-semibold transition-colors duration-200">
                          {displayName}
                        </code>
                        <AnimatePresence>
                          {hoveredItem === `${i}-name` && (
                            <motion.span
                              initial={{ opacity: 0.95, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.25, ease: [.075, .82, .165, 1] }}
                              className="absolute left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 text-xs font-schibsted text-neutral-600 dark:text-neutral-400 flex items-center gap-1 whitespace-nowrap"
                            >
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
                        <code className="truncate max-w-30 text-neutral-500 group-hover/value:text-neutral-900 dark:text-neutral-300 font-schibsted font-semibold">
                          {r.value}
                        </code>
                        <AnimatePresence>
                          {hoveredItem === `${i}-value` && r.value && (
                            <motion.span
                              initial={{ opacity: 0.95, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.15, ease: [.165, .84, .44, 1] }}
                              className="absolute left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 text-xs font-schibsted text-neutral-600 dark:text-neutral-400 flex items-center gap-1 whitespace-nowrap"
                            >
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
                    <span className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 font-schibsted font-semibold ${
                      isVerified
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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  if (!records?.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">
        DNS records for receiving emails in your workspace
      </p>
      <div className="overflow-x-auto rounded-lg border border-neutral-900 dark:border-neutral-700">
        <table className="min-w-full text-xs">
          <thead>
            <tr>
              {["Type", "Name", "Value", "TTL", "Priority", "Status"].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-schibsted bg-linear-to-b from-sky-700 to-cyan-600 text-neutral-50">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => {
              const displayName = r.name === "@" || !r.name ? "@" : r.name;
              return (
                <tr key={i} className="border-t border-neutral-900 dark:border-neutral-700">
                  <td className="px-3 py-2 max-w-50">
                    <span className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm border border-neutral-800 font-schibsted font-bold text-neutral-700 dark:text-neutral-300">
                      {r.type}
                    </span>
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
                        <code className="truncate text-neutral-500 group-hover/mx-name:text-neutral-900 dark:text-neutral-300 font-schibsted font-semibold transition-colors duration-200">
                          {displayName}
                        </code>
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
                        <code className="truncate max-w-30 text-neutral-500 group-hover/mx-value:text-neutral-900 dark:text-neutral-300 font-schibsted font-semibold transition-colors duration-200">
                          {r.value}
                        </code>
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

// ─── Expanded Panel ───────────────────────────────────────────────────────────

function ExpandedPanel({
  domainId,
  domainName,
  isOpen,
  initialDetail,
  onStatusChange,
}: {
  domainId: string;
  domainName: string;
  isOpen: boolean;
  initialDetail?: DomainRow["prefetchedDetail"];
  onStatusChange?: (patch: Partial<DomainRow>) => void;
}) {
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
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(initialDetail ? Date.now() : null);

  const STALE_AFTER_MS = 30_000;
  const isStale = lastFetchedAt === null || Date.now() - lastFetchedAt > STALE_AFTER_MS;

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
      setLastFetchedAt(Date.now());
    }
  }, [domainId]);

  useEffect(() => {
    if (isOpen && isStale) fetchDetail();
  }, [isOpen, isStale, fetchDetail]);

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
      if (data.domain) {
        setDetail((prev) => prev ? { ...prev, ...data.domain } : data.domain);
        onStatusChange?.({ status: data.domain.status, verifiedForSending: data.domain.verifiedForSending });
      }
      setCheckState(data.verified ? "success" : "error");
      setTimeout(() => setCheckState("idle"), 2000);
    } catch {
      setCheckState("error");
      setTimeout(() => setCheckState("idle"), 2000);
    }
  };

  return (
    <motion.div
      layout
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
      className="px-4 pb-4 pt-1 border-t border-neutral-100 dark:border-neutral-800 mt-1"
    >
      <motion.div
        layout
        initial={{ opacity: 0.5, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.10, ease: [.075, .82, .165, 1] } }}
        exit={{ opacity: 0.5, scale: 0.98, transition: { duration: 0.10, ease: [.075, .82, .165, 1] } }}
        style={{ transformOrigin: "top left" }}
        className="space-y-4"
      >
        <DNSTable records={detail?.dnsRecords} domainName={domainName} />
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
              idleWidth={120} loadingWidth={100} successWidth={84} errorWidth={80}
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
              idleWidth={148} loadingWidth={110} successWidth={90} errorWidth={84}
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
    </motion.div>
  );
}

// ─── Domain Card ──────────────────────────────────────────────────────────────

function DomainCard({
  domain,
  onDelete,
  onStatusChange,
  deleteMode,
}: {
  domain: DomainRow;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, patch: Partial<DomainRow>) => void;
  deleteMode?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState<Pick<DomainRow, "status" | "verifiedForSending">>({
    status: domain.status,
    verifiedForSending: domain.verifiedForSending,
  });

  const getStatusBadge = () => {
    if (localStatus.verifiedForSending || localStatus.status === "verified") {
      return <Badge className="bg-green-50 border border-green-900 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-sm font-schibsted font-semibold">Verified</Badge>;
    }
    if (localStatus.status === "active") {
      return <Badge className="bg-blue-100 border border-blue-900 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-sm font-schibsted font-semibold">Active</Badge>;
    }
    return <Badge className="bg-amber-100 border border-amber-900 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-sm font-schibsted font-semibold">Pending Verification</Badge>;
  };

  return (
    <motion.div
      layout
      style={{ transformOrigin: "top center" }}
      variants={{ hidden: { opacity: 0, scaleY: 0 }, show: { opacity: 1, scaleY: 1 } }}
      animate="show"
      exit={{ opacity: 0, scaleY: 0.85 }}
      transition={{
        opacity: { duration: 0.15, ease: [0.4, 0, 1, 1] },
        scaleY: { type: "spring", stiffness: 400, damping: 28 },
      }}
    >
      <Card className="bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors duration-300 ease-out">
        <CardContent className="p-4 flex items-center gap-4">
          {/* Icon */}
          <div className="shrink-0 w-8 h-8 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center">
            <IconWorldUpload size={15} className="text-white" />
          </div>

          {/* Domain + status — clickable to toggle, disabled in delete mode */}
          <button
            type="button"
            onClick={() => !deleteMode && setIsOpen((o) => !o)}
            className={`flex-1 min-w-0 text-left focus:outline-none ${deleteMode ? "cursor-default" : "cursor-pointer"}`}
          >
            <p className="font-schibsted font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
              {domain.domain}
            </p>
            <div className="mt-0.5">{getStatusBadge()}</div>
          </button>

          {/* Chevron — hidden in delete mode */}
          {!deleteMode && (
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
          )}

          {/* Delete */}
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

        {/* Expanded panel — hidden in delete mode */}
        {!deleteMode && (
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
              onStatusChange={(patch) => {
                setLocalStatus((prev) => ({ ...prev, ...patch }));
                onStatusChange?.(domain.id, patch);
              }}
            />
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15, ease: easeOutCubic }}
      className="flex flex-col items-center justify-center py-12 px-6 gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center opacity-40">
        <IconGlobe size={18} className="text-white" />
      </div>
      <Paragraph variant="muted" className="text-center max-w-lg">
        No domains yet. Go to Add Domain to get started.
      </Paragraph>
    </motion.div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export default function DomainsTable({ initialDomains }: { initialDomains: DomainRow[] }) {
  const [domains, setDomains] = useState<DomainRow[]>(initialDomains);
  const [activePageTab, setActivePageTab] = useState<PageTab>("domains");

  const handleDelete = (id: string) => setDomains((prev) => prev.filter((d) => d.id !== id));
  const handleDomainAdded = (domain: DomainRow) => setDomains((prev) => [domain, ...prev]);
  const handleStatusChange = (id: string, patch: Partial<DomainRow>) => {
    setDomains((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  return (
    <Card className="min-h-[300px]">

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
                layoutId="domains-tab-bg"
                className="absolute inset-0 bg-gradient-to-b from-sky-900 to-cyan-700 rounded-lg z-0 shadow-sm"
                transition={{ type: "spring", stiffness: 280, damping: 30, duration: 0.3 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.id === "domains" && <IconTable size={15} />}
              {tab.id === "add"     && <IconPlus size={15} />}
              {tab.id === "delete"  && <IconTrash size={15} />}
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="pt-4">
        <AnimatePresence mode="wait" initial={false}>

          {/* ── Domains tab ── */}
          {activePageTab === "domains" && (
            <motion.div key="domains"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: outQuint }}
            >
              {domains.length === 0 ? (
                <EmptyState />
              ) : (
                <motion.div layout className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {domains.map((d, index) => (
                      <DomainCard
                        key={d.id}
                        domain={d}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── Add Domain tab ── */}
          {activePageTab === "add" && (
            <motion.div key="add"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: outQuint }}
            >
              <DomainAddForm onDomainAdded={handleDomainAdded} />
            </motion.div>
          )}

          {/* ── Delete tab ── */}
          {activePageTab === "delete" && (
            <motion.div key="delete"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: outQuint }}
            >
              {domains.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <p className="text-xs font-schibsted text-neutral-400 mb-3">
                    Select a domain to delete it permanently.
                  </p>
                  <motion.div layout className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {domains.map((d) => (
                        <DomainCard
                          key={d.id}
                          domain={d}
                          onDelete={handleDelete}
                          onStatusChange={handleStatusChange}
                          deleteMode
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </Card>
  );
}