"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Send, Inbox, X } from "lucide-react";
import { toast } from "sonner";
import AnimatedDropdown, { DropdownOption } from "@/components/ui/AnimatedDropdown";
import { Paragraph } from "@/components/Paragraph";
import { Heading } from "@/components/Heading";
import { AnimatePresence, motion } from "motion/react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Ticket {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  status: string;
  receivedAt: string;
  repliedAt?: string | null;
  assignedTo?: string;
  assignedToEmail?: string;
  assignedToName?: string;
  claimedAt?: string;
}

interface ConversationMessage {
  id: string;
  direction: "inbound" | "outbound";
  from: string;
  fromName: string;
  to: string;
  subject: string;
  textBody: string;
  attachments: Array<{ id: string; filename: string; content_type: string; size?: number }>;
  createdAt: string;
  receivedAt: string;
}

interface ThreadDetail {
  id: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  status: string;
  assignedTo?: string;
  assignedToEmail?: string;
  assignedToName?: string;
  claimedAt?: string;
  receivedAt: string;
  repliedAt?: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  if (hrs < 48) return "yesterday";
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDateLabel(date: string) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function senderInitial(name: string, email: string) {
  return (name || email || "?").charAt(0).toUpperCase();
}

const STATUS_CONFIG: Record<string, { label: string; className: string; dot: string }> = {
  open: { label: "Open", className: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
  in_progress: { label: "In Progress", className: "bg-sky-100 text-sky-700", dot: "bg-sky-400" },
  waiting: { label: "Waiting", className: "bg-purple-100 text-purple-700", dot: "bg-purple-400" },
  resolved: { label: "Resolved", className: "bg-green-100 text-green-700", dot: "bg-green-400" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  return (
    <Badge variant="secondary" className={`${cfg.className} font-schibsted font-medium text-xs`}>
      {cfg.label}
    </Badge>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [dateRange, setDateRange] = useState("7d");
  const [domains, setDomains] = useState<DropdownOption[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [thread, setThread] = useState<ThreadDetail | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [convLoading, setConvLoading] = useState(false);

  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [convRefreshing, setConvRefreshing] = useState(false);

  // Mobile: show list or chat
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ticketListRef = useRef<HTMLDivElement>(null);
  const ticketItemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [clipPath, setClipPath] = useState("inset(0 0 100% 0 round 0px)");

  // ── Fetch ticket list ────────────────────────────────────────────────────
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/emails/tickets/mine");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTickets(data.tickets || []);
      const domRes = await fetch("/api/domains");
      if (domRes.ok) {
        const domData = await domRes.json();
        setDomains([
          { value: "all", label: "All Domains" },
          ...domData.map((d: any) => ({ value: d.id, label: d.domain })),
        ]);
      }
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  // ── Fetch conversation when ticket selected ──────────────────────────────
  const fetchConversation = useCallback(async (id: string) => {
    setConvLoading(true);
    setThread(null);
    setMessages([]);
    try {
      const res = await fetch(`/api/emails/threads/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setThread(data.thread);
      setMessages(data.messages);
    } catch {
      toast.error("Failed to load conversation");
    } finally {
      setConvLoading(false);
    }
  }, []);

  const updateClipPath = useCallback((id: string) => {
  const container = ticketListRef.current;
  const item = ticketItemRefs.current.get(id);
  if (!container || !item) return;

  const containerTop = container.getBoundingClientRect().top;
  const itemTop = item.getBoundingClientRect().top;
  const offsetTop = itemTop - containerTop + container.scrollTop;
  const offsetBottom = container.offsetHeight - offsetTop - item.offsetHeight;

  setClipPath(
    `inset(${offsetTop}px 0 ${offsetBottom}px 0 round 0px)`
  );
}, []);



  const selectTicket = (id: string) => {
    setSelectedId(id);
    setMobileView("chat");
    fetchConversation(id);
    updateClipPath(id);
  };

  // ── Silently refresh the right-side conversation (no full-screen skeleton) ──
  const refreshConversation = useCallback(async () => {
    if (!selectedId) return;
    setConvRefreshing(true);
    try {
      const res = await fetch(`/api/emails/threads/${selectedId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setThread(data.thread);
      setMessages(data.messages);
    } catch {
      // silent fail — don't toast on background auto-refresh
    } finally {
      setConvRefreshing(false);
    }
  }, [selectedId]);

  // ── Auto-refresh right panel every 10s when a conversation is open ────────
  useEffect(() => {
    if (!selectedId) return;
    const interval = setInterval(refreshConversation, 60000);
    return () => clearInterval(interval);
  }, [selectedId, refreshConversation]);

  // ── Scroll to bottom when messages change ────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  

  // ── Send reply ───────────────────────────────────────────────────────────
  const sendReply = async () => {
    if (!reply.trim() || !selectedId || sending) return;
    setSending(true);
    const text = reply.trim();
    setReply("");

    // Optimistic message
    const optimisticId = "temp_" + Date.now();
    const now = new Date().toISOString();
    setMessages((prev) => [
      ...prev,
      {
        id: optimisticId,
        direction: "outbound",
        from: thread?.to || "",
        fromName: "You",
        to: thread?.from || "",
        subject: thread?.subject || "",
        textBody: text,
        attachments: [],
        createdAt: now,
        receivedAt: now,
      },
    ]);

    try {
      const res = await fetch("/api/emails/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: selectedId, replyText: text }),
      });
      if (!res.ok) throw new Error();
      toast.success("Reply sent");
      // Refresh conversation to get real saved message
      const convRes = await fetch(`/api/emails/threads/${selectedId}`);
      if (convRes.ok) {
        const data = await convRes.json();
        setThread(data.thread);
        setMessages(data.messages);
        // Also refresh ticket list to update repliedAt / status
        fetchTickets();
      }
    } catch {
      toast.error("Failed to send reply");
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setReply(text);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  };

  // ── Update ticket status ─────────────────────────────────────────────────
  const updateStatus = async (status: string) => {
    if (!selectedId || !thread) return;
    try {
      const res = await fetch("/api/emails/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: selectedId, status }),
      });
      if (!res.ok) throw new Error();
      setThread((prev) => prev ? { ...prev, status } : prev);
      setTickets((prev) =>
        prev.map((t) => (t.id === selectedId ? { ...t, status } : t))
      );
      toast.success(`Marked as ${STATUS_CONFIG[status]?.label || status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  // ── Filter ───────────────────────────────────────────────────────────────
  const filtered = currentFilter === "all"
    ? tickets
    : tickets.filter((t) => t.status === currentFilter);

  const statusCounts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    waiting: tickets.filter((t) => t.status === "waiting").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  useEffect(() => {
  if (!selectedId) return;
  // Small timeout to ensure refs are populated after render
  const t = setTimeout(() => updateClipPath(selectedId), 50);
  return () => clearTimeout(t);
}, [selectedId, filtered, updateClipPath]);

  // ── Date-separator grouping ───────────────────────────────────────────────
  function renderMessages() {
    const nodes: React.ReactNode[] = [];
    let lastDateLabel = "";

    messages.forEach((msg) => {
      const dateLabel = formatDateLabel(msg.createdAt || msg.receivedAt);
      if (dateLabel !== lastDateLabel) {
        lastDateLabel = dateLabel;
        nodes.push(
          <div key={`sep-${msg.id}`} className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400 font-schibsted font-medium px-2 whitespace-nowrap">
              {dateLabel}
            </span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>
        );
      }

      const isOut = msg.direction === "outbound";
      nodes.push(
        <div key={msg.id} className={`flex ${isOut ? "justify-end" : "justify-start"}`}>
          <div className="max-w-[72%]">
            <div
              className={`rounded-2xl px-4 py-2.5 ${
                isOut
                  ? "rounded-tr-sm bg-sky-500 text-white"
                  : "rounded-tl-sm bg-neutral-100 text-neutral-800"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.textBody}</p>
              {msg.attachments?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {msg.attachments.map((a) => (
                    <div
                      key={a.id}
                      className={`flex items-center gap-2 text-xs rounded-lg px-2 py-1.5 ${
                        isOut ? "bg-sky-600/40" : "bg-neutral-200"
                      }`}
                    >
                      <span>📎</span>
                      <span className="truncate font-medium">{a.filename}</span>
                      {a.size && (
                        <span className="opacity-60 shrink-0">
                          ({Math.round(a.size / 1024)}KB)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className={`text-[10px] mt-1 text-neutral-400 font-schibsted ${isOut ? "text-right" : ""}`}>
              {isOut ? "You" : (msg.fromName || msg.from)} · {formatTime(msg.createdAt || msg.receivedAt)}
            </p>
          </div>
        </div>
      );
    });

    return nodes;
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full overflow-hidden bg-white">

      {/* ── Left Panel: Ticket List ────────────────────────────────────── */}
      <div
        className={`flex flex-col w-full sm:w-[520px] flex-shrink-0 border-r border-neutral-200 ${
          mobileView === "chat" ? "hidden sm:flex" : "flex"
        }`}
      >
        {/* ── Page Header ── */}
        <div className="px-4 pb-3 border-b border-neutral-100 flex-shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <Heading variant="muted" className="font-bold text-neutral-900">
                My Tickets
              </Heading>
                <Paragraph variant="default" className="text-neutral-600 mt-1">
                Your support queue. Filter by domain or date to find what you need.
                </Paragraph>
            </div>
          </div>
        
          {/* Controls row */}
          <div className="flex items-center gap-2 flex-wrap">
            <AnimatedDropdown
              options={domains}
              value={selectedDomain}
              onChange={setSelectedDomain}
              placeholder="All Domains"
              width="w-44"
            />
            <AnimatedDropdown
              options={[
                { value: "24h", label: "Last 24 hrs" },
                { value: "7d",  label: "Last 7 days" },
                { value: "15d", label: "Last 15 days" },
              ]}
              value={dateRange}
              onChange={setDateRange}
              width="w-36"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchTickets}
              disabled={loading}
              className="h-8 w-8"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1 px-3 py-2 border-b border-neutral-100 flex-shrink-0 overflow-x-auto">
          {[
            { key: "all", label: "All" },
            { key: "open", label: "Open" },
            { key: "in_progress", label: "In Progress" },
            { key: "waiting", label: "Waiting" },
            { key: "resolved", label: "Resolved" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setCurrentFilter(f.key)}
              className={`rounded-lg px-2.5 py-1 text-xs font-schibsted font-medium whitespace-nowrap transition-all ${
                currentFilter === f.key
                  ? "bg-sky-100 text-sky-800"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
              }`}
            >
              {f.label}
              <span className="ml-1 opacity-60">
                ({statusCounts[f.key as keyof typeof statusCounts]})
              </span>
            </button>
          ))}
        </div>

        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col gap-3 p-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-neutral-200 rounded w-3/4" />
                    <div className="h-3 bg-neutral-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <p className="text-sm text-neutral-400 font-schibsted">No tickets found</p>
            </div>
          ) : (
            // <div ref={ticketListRef} className="divide-y divide-neutral-100">
            //   {filtered.map((ticket) => {
            //     const cfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
            //     const isSelected = ticket.id === selectedId;
            //     return (
            //       <button
            //         key={ticket.id}
            //         onClick={() => selectTicket(ticket.id)}
            //         className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors hover:bg-neutral-50 ${
            //           isSelected ? "bg-sky-50 border-l-2 border-sky-500" : ""
            //         }`}
            //       >
            //         {/* Avatar */}
            //         <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-bold flex-shrink-0 font-schibsted">
            //           {senderInitial(ticket.fromName, ticket.from)}
            //         </div>
            //         {/* Info */}
            //         <div className="flex-1 min-w-0">
            //           <div className="flex items-center justify-between gap-1">
            //             <p className="text-sm font-semibold text-neutral-900 font-schibsted truncate leading-tight">
            //               {ticket.fromName || ticket.from}
            //             </p>
            //             <span className="text-[10px] text-neutral-400 font-schibsted shrink-0">
            //               {timeAgo(ticket.receivedAt)}
            //             </span>
            //           </div>
            //           <p className="text-xs text-neutral-500 font-schibsted truncate mt-0.5 leading-tight">
            //             {ticket.subject}
            //           </p>
            //           <div className="mt-1.5 flex items-center gap-1.5">
            //             <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
            //             <span className={`text-[10px] font-schibsted font-medium ${cfg.className.split(" ")[1]}`}>
            //               {cfg.label}
            //             </span>
            //           </div>
            //         </div>
            //       </button>
            //     );
            //   })}
            // </div>
            <div ref={ticketListRef} className="relative divide-y divide-neutral-100">

              {/* ── Base layer ── */}
              {filtered.map((ticket) => {
                const cfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
                return (
                  <button
                    key={ticket.id}
                    ref={(el) => { if (el) ticketItemRefs.current.set(ticket.id, el); }}
                    onClick={() => selectTicket(ticket.id)}
                    className="w-full text-left flex items-start gap-3 px-4 py-3 transition-colors hover:bg-neutral-50"
                  >
                    <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-bold flex-shrink-0 font-schibsted">
                      {senderInitial(ticket.fromName, ticket.from)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-sm font-semibold text-neutral-900 font-schibsted truncate leading-tight">
                          {ticket.fromName || ticket.from}
                        </p>
                        <span className="text-[10px] text-neutral-400 font-schibsted shrink-0">
                          {timeAgo(ticket.receivedAt)}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-schibsted truncate mt-0.5 leading-tight">
                        {ticket.subject}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        <span className={`text-[10px] font-schibsted font-medium ${cfg.className.split(" ")[1]}`}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* ── Overlay layer (clipped) ── */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{
                  clipPath,
                  transition: "clip-path 0.15s ease",
                }}
              >
                <div className="bg-sky-100 divide-y divide-sky-100">
                  {filtered.map((ticket) => {
                    const cfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
                    return (
                      <div
                        key={ticket.id}
                        className="w-full text-left flex items-start gap-3 px-4 py-3"
                      >
                        <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-bold flex-shrink-0 font-schibsted">
                          {senderInitial(ticket.fromName, ticket.from)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm font-semibold text-sky-900 font-schibsted truncate leading-tight">
                              {ticket.fromName || ticket.from}
                            </p>
                            <span className="text-[10px] text-sky-400 font-schibsted shrink-0">
                              {timeAgo(ticket.receivedAt)}
                            </span>
                          </div>
                          <p className="text-xs text-sky-500 font-schibsted truncate mt-0.5 leading-tight">
                            {ticket.subject}
                          </p>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                            <span className={`text-[10px] font-schibsted font-medium ${cfg.className.split(" ")[1]}`}>
                              {cfg.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* ── Right Panel: Conversation ──────────────────────────────────────── */}
      <div className="hidden sm:flex flex-col flex-1 min-w-0">
        {!selectedId ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-14 h-14 rounded-full bg-sky-50 flex items-center justify-center mb-4">
              <Send size={22} className="text-sky-400" />
            </div>
            <p className="text-base font-semibold text-neutral-700 font-schibsted">Select a conversation</p>
            <p className="text-sm text-neutral-400 font-schibsted mt-1">
              Click any ticket on the left to read and reply
            </p>
          </div>
        ) : (
          <>
            {/* Conversation Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 flex-shrink-0 bg-white">
              {/* Back (mobile) */}
              <button
                className="sm:hidden text-neutral-400 hover:text-neutral-700 transition-colors"
                onClick={() => setMobileView("list")}
              >
                <ArrowLeft size={18} />
              </button>

              {thread && (
                <>
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-bold flex-shrink-0 font-schibsted">
                    {senderInitial(thread.fromName, thread.from)}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 font-schibsted leading-tight truncate">
                      {thread.fromName || thread.from}
                    </p>
                    <p className="text-[11px] text-neutral-400 font-schibsted truncate leading-tight">
                      {thread.subject}
                    </p>
                  </div>
                  {/* Status + change */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <AnimatedDropdown
                      options={[
                        { value: "open",        label: "Open" },
                        { value: "in_progress", label: "In Progress" },
                        { value: "waiting",     label: "Waiting" },
                        { value: "resolved",    label: "Resolved" },
                      ]}
                      value={thread.status}
                      onChange={(val) => updateStatus(val)}
                      width="w-36"
                      className="[&_button]:focus:ring-0 [&_button]:focus:outline-none [&_button]:focus:border-neutral-300"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={refreshConversation}
                      disabled={convRefreshing}
                      className="h-8 w-8"
                      title="Refresh conversation"
                    >
                      <RefreshCw size={14} className={convRefreshing ? "animate-spin" : ""} />
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <motion.div
              className="flex-1 overflow-y-auto px-4 py-2 space-y-1"
            >
              <AnimatePresence>
                {/* {convLoading && (
                  <div className="flex flex-col gap-3 pt-6">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className={`flex ${n % 2 === 0 ? "justify-end" : "justify-start"}`}>
                        <div className="animate-pulse h-10 w-48 rounded-2xl bg-neutral-200" />
                      </div>
                    ))}
                  </div>
                )} */}
                {!convLoading && messages.length === 0 && (
                  <div className="text-center text-sm text-neutral-400 py-8 font-schibsted">
                    No messages yet.
                  </div>
                )}
                {!convLoading && messages.length > 0 && 
                (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                  >
                    {renderMessages()}
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </AnimatePresence>
            </motion.div>

            {/* Reply Box */}
            <div className="border-t border-neutral-200 px-4 py-3 flex-shrink-0 bg-white">
              <div className="flex items-end gap-2 bg-white border border-neutral-200 rounded-xl px-3 py-2 focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-500/10 transition-all">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a reply… (Enter to send, Shift+Enter for new line)"
                  rows={2}
                  className="flex-1 resize-none text-sm text-neutral-800 placeholder-neutral-400 outline-none bg-transparent max-h-32 overflow-auto font-schibsted"
                />
                <button
                  onClick={sendReply}
                  disabled={!reply.trim() || sending}
                  className="flex-shrink-0 w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-white transition-all hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send reply"
                >
                  {sending ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {mobileView === "chat" && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => { setMobileView("list"); setSelectedId(null); }}
            />

            {/* Sheet panel */}
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 h-[92vh] bg-white rounded-t-2xl flex flex-col sm:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Handle + close */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0">
                <div className="w-8 h-1 rounded-full bg-neutral-300 mx-auto absolute left-1/2 -translate-x-1/2" />
                <div className="flex-1" />
                <button
                  onClick={() => { setMobileView("list"); setSelectedId(null); }}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  <X size={14} className="text-neutral-500" />
                </button>
              </div>

              {/* Conversation goes here next */}
                {
                  selectedId && (
                    <>
                    {/* Conversation Header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 flex-shrink-0 bg-white">

                      {thread && (
                        <>
                          {/* Avatar */}
                          <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-bold flex-shrink-0 font-schibsted">
                            {senderInitial(thread.fromName, thread.from)}
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-neutral-900 font-schibsted leading-tight truncate">
                              {thread.fromName || thread.from}
                            </p>
                            <p className="text-[11px] text-neutral-400 font-schibsted truncate leading-tight">
                              {thread.subject}
                            </p>
                          </div>
                          {/* Status + change */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <AnimatedDropdown
                              options={[
                                { value: "open",        label: "Open" },
                                { value: "in_progress", label: "In Progress" },
                                { value: "waiting",     label: "Waiting" },
                                { value: "resolved",    label: "Resolved" },
                              ]}
                              value={thread.status}
                              onChange={(val) => updateStatus(val)}
                              width="w-24"
                              className="[&_button]:focus:ring-0 [&_button]:focus:outline-none [&_button]:focus:border-neutral-300"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={refreshConversation}
                              disabled={convRefreshing}
                              className="h-8 w-8"
                              title="Refresh conversation"
                            >
                              <RefreshCw size={14} className={convRefreshing ? "animate-spin" : ""} />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Messages */}
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: 0.4 }}
                    className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                      {convLoading ? (
                        <div className="flex flex-col gap-3 pt-6">
                          {[1, 2, 3].map((n) => (
                            <div key={n} className={`flex ${n % 2 === 0 ? "justify-end" : "justify-start"}`}>
                              <div className="animate-pulse h-10 w-48 rounded-2xl bg-neutral-200" />
                            </div>
                          ))}
                        </div>
                      ) : messages.length === 0 ? (
                        <p className="text-center text-sm text-neutral-400 py-8 font-schibsted">No messages yet.</p>
                      ) : (
                        renderMessages()
                      )}
                      <div ref={messagesEndRef} />
                    </motion.div>

                    {/* Reply Box */}
                    <div className="border-t border-neutral-200 px-4 py-3 flex-shrink-0 bg-white">
                      <div className="flex items-end gap-2 bg-white border border-neutral-200 rounded-xl px-3 py-2 focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-500/10 transition-all">
                        <textarea
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Type a reply… (Enter to send, Shift+Enter for new line)"
                          rows={2}
                          className="flex-1 resize-none text-sm text-neutral-800 placeholder-neutral-400 outline-none bg-transparent max-h-32 overflow-auto font-schibsted"
                        />
                        <button
                          onClick={sendReply}
                          disabled={!reply.trim() || sending}
                          className="flex-shrink-0 w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-white transition-all hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Send reply"
                        >
                          {sending ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <Send size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                  )
                }
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
