"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconMail,
  IconArrowLeft,
  IconX,
  IconMessage,
  IconCheck,
  IconUserCheck,
  IconClock,
  IconCircle,
  IconPlayerPause,
  IconPaperclip,
  IconSend,
  IconChevronDown,
  IconLoader2,
} from "@tabler/icons-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@clerk/nextjs";
import { useTicketPanelStore, type PanelTicket } from "./useTicketPanelStore";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SenderHistory {
  total: number;
  resolved: number;
  open: number;
  in_progress: number;
  waiting: number;
  tickets: PanelTicket[];
}

interface LatestMessage {
  textBody: string;
  direction: "inbound" | "outbound";
  fromName?: string;
  receivedAt?: string;
  createdAt?: string;
}

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  open: {
    label: "Open",
    dot: "bg-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50",
    icon: IconCircle,
  },
  in_progress: {
    label: "In Progress",
    dot: "bg-sky-400",
    text: "text-sky-700",
    bg: "bg-sky-50",
    icon: IconClock,
  },
  waiting: {
    label: "Waiting",
    dot: "bg-purple-400",
    text: "text-purple-700",
    bg: "bg-purple-50",
    icon: IconPlayerPause,
  },
  resolved: {
    label: "Resolved",
    dot: "bg-green-400",
    text: "text-green-700",
    bg: "bg-green-50",
    icon: IconCheck,
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

function initials(name?: string, email?: string): string {
  return (name || email || "?").charAt(0).toUpperCase();
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
      <div className="size-12 rounded-2xl bg-neutral-100 flex items-center justify-center">
        <IconMail size={22} className="text-neutral-300" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-schibsted text-sm font-semibold text-neutral-500">
          Click a ticket to see details
        </p>
        <p className="font-schibsted text-xs text-neutral-400 mt-1 leading-relaxed">
          Select any ticket from the board to view its details and sender
          history here.
        </p>
      </div>
    </div>
  );
}

// ── Sender History Section ────────────────────────────────────────────────────

function SenderHistorySection({
  fromEmail,
  currentId,
}: {
  fromEmail: string;
  currentId: string;
}) {
  const [history, setHistory] = useState<SenderHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const { isLoaded, isSignedIn } = useAuth();
  const navigateTo = useTicketPanelStore((s) => s.navigateTo);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !fromEmail) return;
    let cancelled = false;
    setLoading(true);
    setHistory(null);

    // ── MOCK ──────────────────────────────────────────────────────────────
    // fetch("/mock-data/sender-history.json")
    //   .then((r) => r.json())
    //   .then((all) => all[fromEmail] ?? null)
    // ── LIVE ──────────────────────────────────────────────────────────────
    fetch(`/api/emails/sender-history?email=${encodeURIComponent(fromEmail)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) setHistory(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fromEmail, isLoaded, isSignedIn]);

  return (
    <div>
      <div>
        {/* Section header */}
        <div className="flex items-center gap-2 px-5 py-3">
          <span className="font-schibsted text-[10px] font-bold tracking-[0.1em] uppercase text-neutral-400">
            Sender History
          </span>
          {history && (
            <span className="font-schibsted text-[10px] font-semibold text-neutral-400 bg-neutral-100 rounded-full px-1.5 py-px">
              {history.total} tickets
            </span>
          )}
        </div>

        {loading ? (
          <div className="px-5 pb-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 rounded-lg bg-neutral-100 animate-pulse"
              />
            ))}
          </div>
        ) : !history || history.total === 0 ? (
          <div className="px-5 pb-4">
            <div className="rounded-xl bg-neutral-50 border border-dashed border-neutral-200 px-4 py-3 text-center">
              <p className="font-schibsted text-xs text-neutral-400">
                First ticket from this sender
              </p>
            </div>
          </div>
        ) : (
          <div className="px-5 pb-4 space-y-3">
            {/* Donut chart */}
            {(() => {
              const slices = [
                {
                  key: "open",
                  label: "Open",
                  value: history.open,
                  colour: "#f59e0b",
                },
                {
                  key: "in_progress",
                  label: "In Progress",
                  value: history.in_progress,
                  colour: "#0ea5e9",
                },
                {
                  key: "waiting",
                  label: "Waiting",
                  value: history.waiting,
                  colour: "#a855f7",
                },
                {
                  key: "resolved",
                  label: "Resolved",
                  value: history.resolved,
                  colour: "#22c55e",
                },
              ].filter((s) => s.value > 0);

              return (
                <div className="rounded-xl bg-neutral-50 border border-neutral-100 px-3 pt-3 pb-2">
                  {/* Chart */}
                  <div className="relative h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={slices}
                          cx="50%"
                          cy="50%"
                          innerRadius={36}
                          outerRadius={52}
                          paddingAngle={slices.length > 1 ? 3 : 0}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {slices.map((s) => (
                            <Cell key={s.key} fill={s.colour} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const { label, value, colour } = payload[0].payload;
                            return (
                              <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 shadow-xl">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="size-1.5 rounded-full shrink-0"
                                    style={{ backgroundColor: colour }}
                                  />
                                  <span className="font-schibsted text-[11px] text-neutral-300">
                                    {label}
                                  </span>
                                  <span className="font-schibsted text-[11px] font-bold text-white ml-1">
                                    {value}
                                  </span>
                                </div>
                              </div>
                            );
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Centre label */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <p className="font-schibsted text-xl font-bold text-neutral-900 leading-none tabular-nums">
                          {history.total}
                        </p>
                        <p className="font-schibsted text-[9px] text-neutral-400 mt-0.5">
                          tickets
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1 pb-1">
                    {slices.map((s) => (
                      <div
                        key={s.key}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="size-2 rounded-full shrink-0"
                            style={{ backgroundColor: s.colour }}
                          />
                          <span className="font-schibsted text-[10px] text-neutral-500">
                            {s.label}
                          </span>
                        </div>
                        <span className="font-schibsted text-[10px] font-semibold text-neutral-700 tabular-nums">
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Previous tickets list */}
            <div className="space-y-1">
              {history.tickets.map((ticket) => {
                const s =
                  STATUS_CONFIG[ticket.status as keyof typeof STATUS_CONFIG] ??
                  STATUS_CONFIG.open;
                const isCurrent = ticket.id === currentId;
                return (
                  <button
                    key={ticket.id}
                    onClick={() => !isCurrent && navigateTo(ticket)}
                    disabled={isCurrent}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors duration-100 ${
                      isCurrent
                        ? "bg-sky-50 border border-sky-200 cursor-default"
                        : "hover:bg-neutral-50 cursor-pointer"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full shrink-0 ${s.dot}`}
                    />
                    <span
                      className={`flex-1 font-schibsted text-[11.5px] truncate ${isCurrent ? "text-sky-800 font-semibold" : "text-neutral-700"}`}
                    >
                      {ticket.subject}
                    </span>
                    {isCurrent && (
                      <span className="font-schibsted text-[9px] font-bold text-sky-600 bg-sky-100 rounded-full px-1.5 py-px shrink-0">
                        viewing
                      </span>
                    )}
                    {!isCurrent && (
                      <span className="font-schibsted text-[10px] text-neutral-400 shrink-0 tabular-nums">
                        {timeAgo(ticket.receivedAt)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Status dropdown ───────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "open", label: "Open", dot: "bg-amber-400", text: "text-amber-700" },
  {
    value: "in_progress",
    label: "In Progress",
    dot: "bg-sky-400",
    text: "text-sky-700",
  },
  {
    value: "waiting",
    label: "Waiting",
    dot: "bg-purple-400",
    text: "text-purple-700",
  },
  {
    value: "resolved",
    label: "Resolved",
    dot: "bg-green-400",
    text: "text-green-700",
  },
];

function StatusDropdown({
  current,
  loading,
  onChange,
}: {
  current: string;
  loading: boolean;
  onChange: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const cur =
    STATUS_OPTIONS.find((o) => o.value === current) ?? STATUS_OPTIONS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-schibsted font-semibold transition-colors disabled:opacity-50 ${
          open
            ? "border-sky-300 bg-sky-50 text-sky-700"
            : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
        }`}
      >
        <span className={`size-1.5 rounded-full shrink-0 ${cur.dot}`} />
        {cur.label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex items-center"
        >
          <IconChevronDown size={11} className="text-neutral-400" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 4, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
            transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: "top" }}
            className="absolute left-0 z-50 w-36 mt-0 rounded-xl border border-neutral-200 bg-white shadow-lg shadow-neutral-200/50 overflow-hidden py-1"
          >
            {STATUS_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <button
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] font-schibsted text-left transition-colors ${
                    opt.value === current
                      ? `font-semibold ${opt.text}`
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full shrink-0 ${opt.dot}`}
                  />
                  {opt.label}
                  {opt.value === current && (
                    <IconCheck size={11} className="ml-auto shrink-0" />
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Ticket Detail Section ─────────────────────────────────────────────────────

function TicketDetail({ ticket }: { ticket: PanelTicket }) {
  const [messages, setMessages] = useState<LatestMessage[]>([]);
  const [msgLoading, setMsgLoading] = useState(true);
  const msgEndRef = useRef<HTMLDivElement>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(ticket.status);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [sentFlash, setSentFlash] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { isLoaded, isSignedIn } = useAuth();
  const clearSelected = useTicketPanelStore((s) => s.clearSelected);
  const goBack = useTicketPanelStore((s) => s.goBack);
  const navHistory = useTicketPanelStore((s) => s.history);

  useEffect(() => {
    setCurrentStatus(ticket.status);
    setReplyOpen(false);
    setReplyText("");
    setAttachment(null);
    setMessages([]);
  }, [ticket.id]);

  // Fetch full conversation thread
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;
    setMsgLoading(true);

    // ── MOCK ──────────────────────────────────────────────────────────────
    // fetch("/mock-data/threads.json")
    //   .then((r) => r.json())
    //   .then((all) => all[ticket.id] ?? null)
    // ── LIVE ──────────────────────────────────────────────────────────────
    fetch(`/api/emails/threads/${ticket.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.messages?.length) {
          setMessages(data.messages as LatestMessage[]);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setMsgLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ticket.id, isLoaded, isSignedIn]);

  // Scroll to bottom when messages load
  useEffect(() => {
    if (!msgLoading)
      msgEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgLoading, messages.length]);

  const handleUpdateStatus = async (status: string) => {
    setStatusLoading(true);
    try {
      const res = await fetch("/api/emails/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: ticket.id, status }),
      });
      if (res.ok) setCurrentStatus(status as PanelTicket["status"]);
    } catch {}
    setStatusLoading(false);
  };

  const handleSend = async () => {
    if (!replyText.trim() || sending) return;
    setSending(true);
    try {
      await fetch("/api/emails/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: ticket.id,
          replyText: replyText.trim(),
        }),
      });
      setReplyText("");
      setAttachment(null);
      setReplyOpen(false);
      setSentFlash(true);
      setTimeout(() => setSentFlash(false), 2000);
    } catch {}
    setSending(false);
  };

  const s =
    STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.open;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Header (fixed) ── */}
      <div className="flex items-start gap-3 px-5 py-4 border-b border-neutral-100 shrink-0">
        {navHistory.length > 0 ? (
          <button
            onClick={goBack}
            className="size-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center shrink-0 transition-colors"
          >
            <IconArrowLeft size={14} className="text-neutral-600" />
          </button>
        ) : (
          <div className="size-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-schibsted font-bold text-sm shrink-0">
            {initials(ticket.fromName, ticket.from)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-schibsted text-sm font-semibold text-neutral-900 truncate leading-tight">
            {ticket.fromName || ticket.from}
          </p>
          <p className="font-schibsted text-[11px] text-neutral-400 truncate leading-tight">
            {ticket.from}
          </p>
        </div>
        <button
          onClick={clearSelected}
          className="size-6 rounded-lg flex items-center justify-center text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100 transition-colors shrink-0"
        >
          <IconX size={13} />
        </button>
      </div>

      {/* ── Meta (fixed) ── */}
      <div className="px-5 pt-3 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-schibsted font-semibold ${s.bg} ${s.text}`}
          >
            <span className={`size-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
          <span className="font-schibsted text-[10px] text-neutral-400 tabular-nums">
            {timeAgo(ticket.receivedAt)}
          </span>
        </div>
        <p className="font-schibsted text-sm font-semibold text-neutral-800 leading-snug">
          {ticket.subject}
        </p>
        {ticket.assignedToName && (
          <div className="flex items-center gap-1 mt-1">
            <IconUserCheck size={11} className="text-neutral-400 shrink-0" />
            <span className="font-schibsted text-[11px] text-neutral-500">
              Assigned to{" "}
              <span className="font-semibold text-neutral-700">
                {ticket.assignedToName}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* ── Conversation thread (scrollable, flex-1) ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-neutral-50/50">
        {msgLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
              >
                <div className="h-16 w-48 rounded-2xl bg-neutral-200 animate-pulse" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="font-schibsted text-xs text-neutral-400">
              No messages
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isOut = msg.direction === "outbound";
            const time = msg.createdAt || msg.receivedAt;
            return (
              <div
                key={i}
                className={`flex flex-col gap-1 ${isOut ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[12px] font-schibsted leading-relaxed whitespace-pre-wrap ${
                    isOut
                      ? "rounded-tr-sm bg-sky-500 text-white"
                      : "rounded-tl-sm bg-white border border-neutral-200 text-neutral-800"
                  }`}
                >
                  {msg.textBody}
                </div>
                {time && (
                  <span className="font-schibsted text-[9px] text-neutral-400 px-1">
                    {isOut ? "You" : msg.fromName || "Sender"} ·{" "}
                    {new Date(time).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            );
          })
        )}
        <div ref={msgEndRef} />
      </div>

      {/* ── Action bar — commented out until ready ── */}
      {/* <div className="px-5 py-2.5 border-t border-neutral-100 shrink-0 flex items-center gap-2 bg-white">
        <button
          onClick={() => setReplyOpen((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-schibsted font-semibold transition-colors ${
            replyOpen
              ? "bg-sky-600 text-white"
              : sentFlash
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-sky-600 hover:bg-sky-700 text-white"
          }`}
        >
          {sentFlash ? <IconCheck size={12} /> : <IconMessage size={12} />}
          {sentFlash ? "Sent!" : replyOpen ? "Cancel" : "Reply"}
        </button>
        <StatusDropdown current={currentStatus} loading={statusLoading} onChange={handleUpdateStatus} />
      </div> */}

      {/* ── Inline reply composer — commented out until ready ── */}
      {/* <AnimatePresence initial={false}>
        {replyOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden shrink-0 border-t border-neutral-100 bg-white"
          >
            <div className="px-5 py-3">
              <div className="rounded-xl border border-neutral-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/10 transition-all bg-white overflow-hidden">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Write a reply… (Enter to send)"
                  rows={3}
                  className="w-full resize-none px-3.5 pt-3 pb-2 text-[12px] font-schibsted text-neutral-800 placeholder-neutral-400 focus:outline-none bg-transparent leading-relaxed"
                />
                {attachment && (
                  <div className="flex items-center gap-2 mx-3 mb-2 px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200">
                    <IconPaperclip size={11} className="text-neutral-400 shrink-0" />
                    <span className="font-schibsted text-[10px] text-neutral-600 truncate flex-1">{attachment.name}</span>
                    <button onClick={() => setAttachment(null)} className="text-neutral-300 hover:text-neutral-600 transition-colors">
                      <IconX size={11} />
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between px-3 py-2 border-t border-neutral-100 bg-neutral-50">
                  <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-[10px] font-schibsted text-neutral-500 hover:text-neutral-800 transition-colors">
                    <IconPaperclip size={12} />
                    Attach
                  </button>
                  <input ref={fileRef} type="file" className="hidden" onChange={(e) => setAttachment(e.target.files?.[0] ?? null)} />
                  <button
                    onClick={handleSend}
                    disabled={!replyText.trim() || sending}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-schibsted font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {sending ? <IconLoader2 size={11} className="animate-spin" /> : <IconSend size={11} />}
                    {sending ? "Sending…" : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function TicketDetailPanel() {
  const selectedTicket = useTicketPanelStore((s) => s.selectedTicket);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top 3/4 — ticket detail with scrollable conversation */}
      <AnimatePresence mode="wait">
        {!selectedTicket ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 min-h-0"
          >
            <EmptyState />
          </motion.div>
        ) : (
          <motion.div
            key={selectedTicket.id}
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="min-h-[580px] max-h-[580px] overflow-hidden flex flex-col"
          >
            <TicketDetail ticket={selectedTicket} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom 1/4 — sender history, scrollable */}
      {selectedTicket && (
        <div className="flex-[1] min-h-0 overflow-y-auto border-t border-neutral-100">
          <SenderHistorySection
            key={selectedTicket.from}
            fromEmail={selectedTicket.from}
            currentId={selectedTicket.id}
          />
        </div>
      )}
    </div>
  );
}
