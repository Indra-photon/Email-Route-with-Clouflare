"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageSquare,
  RefreshCw,
  Send,
  Paperclip,
  Trash2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "motion/react";
import {
  IconMessageCircle,
  IconTrash,
  IconSend,
  IconPaperclip,
  IconArrowLeft,
  IconCheck,
  IconChevronDown,
  IconWorld,
  IconClock,
  IconCalendarWeek,
  IconCalendar,
  IconCalendarMonth,
  IconCircle,
  IconCircleCheck,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { Search, X } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ConversationPreview {
  id: string;
  widgetId: string;
  visitorId: string;
  visitorPage: string;
  status: "open" | "closed";
  lastMessageAt: string;
  createdAt: string;
  lastMessage: { body: string; sender: "visitor" | "agent" } | null;
  widget: { domain: string; accentColor: string } | null;
}

interface ChatMessage {
  id: string;
  sender: "visitor" | "agent";
  body: string;
  type: "text" | "image" | "pdf";
  mediaUrl: string;
  createdAt: string;
}

interface ConversationData {
  id: string;
  visitorId: string;
  visitorPage: string;
  status: "open" | "closed";
  createdAt: string;
  widget: {
    domain: string;
    accentColor: string;
    welcomeMessage: string;
  } | null;
  messages: ChatMessage[];
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(date).toLocaleDateString();
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ConversationSkeleton() {
  return (
    <div className="p-2.5 space-y-2">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="rounded-2xl border border-neutral-100 p-1.5">
          <div className="rounded-[10px] bg-neutral-50 p-3 space-y-2.5 animate-pulse">
            <div className="flex justify-between">
              <div className="h-3 bg-neutral-200 rounded w-1/2" />
              <div className="h-3 bg-neutral-200 rounded w-10" />
            </div>
            <div className="h-3 bg-neutral-200 rounded w-3/4" />
            <div className="h-4 bg-neutral-200 rounded-full w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MessageSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-5 flex-1">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className={`flex ${n % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          <div className="animate-pulse h-12 w-52 rounded-2xl bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}

// ── Filter Dropdown ───────────────────────────────────────────────────────────

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ElementType;
}

function FilterDropdown({
  options,
  value,
  onChange,
  placeholder = "Select…",
  width = "w-36",
  disabled = false,
}: {
  options: FilterOption[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const SelectedIcon = selected?.icon;

  return (
    <div className={`relative ${width}`} ref={ref}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className={`w-full flex items-center justify-between gap-2 rounded-lg border px-3 h-9 text-xs tracking-tighter font-schibsted text-left transition-colors duration-100 outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-white ${
          open ? "border-sky-800" : "border-neutral-600 hover:border-neutral-900"
        } ${selected ? "text-neutral-800" : "text-neutral-400"}`}
      >
        <span className="flex items-center gap-1.5 truncate">
          {SelectedIcon && <SelectedIcon size={13} className={`shrink-0 ${selected ? "text-neutral-800" : "text-neutral-400"}`} />}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex items-center justify-center shrink-0"
        >
          <IconChevronDown size={14} className="text-neutral-400" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4, scaleY: 0.95, scaleX: 0.98 }}
            animate={{ opacity: 1, y: 4, scaleY: 1, scaleX: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.95, scaleX: 0.98 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: "top" }}
            className="absolute z-50 w-full mt-0 rounded-lg border border-neutral-200 bg-white shadow-lg shadow-neutral-200/50 overflow-hidden"
          >
            <div className="max-h-48 overflow-y-auto py-1">
              {options.map((opt, i) => {
                const isSelected = opt.value === value;
                const Icon = opt.icon;
                return (
                  <motion.li
                    key={opt.value}
                    initial={{ opacity: 0.6, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.12, delay: i * 0.02, ease: [0.215, 0.61, 0.355, 1] }}
                  >
                    <button
                      type="button"
                      onClick={() => { onChange(opt.value); setOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs tracking-tighter font-schibsted text-left transition-colors duration-75 cursor-pointer ${
                        isSelected ? "text-sky-800 font-medium" : "text-neutral-800 hover:bg-neutral-50"
                      }`}
                    >
                      {Icon && <Icon size={13} className={isSelected ? "text-sky-600" : "text-neutral-400"} />}
                      <span className="flex-1 truncate">{opt.label}</span>
                      {isSelected && (
                        <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }}>
                          <IconCheck size={13} className="text-sky-700 shrink-0" />
                        </motion.span>
                      )}
                    </button>
                  </motion.li>
                );
              })}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function LiveChatsPage() {
  // ── List state ───────────────────────────────────────────────────────────
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [listRefreshing, setListRefreshing] = useState(false);

  // ── Selected conversation / right panel state ────────────────────────────
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [data, setData] = useState<ConversationData | null>(null);
  const [convLoading, setConvLoading] = useState(false);
  const [convRefreshing, setConvRefreshing] = useState(false);

  // ── Reply / upload state ─────────────────────────────────────────────────
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [visitorTyping, setVisitorTyping] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  // ── Socket state ─────────────────────────────────────────────────────────
  const [wsConnected, setWsConnected] = useState(false);
  const [wsSecret, setWsSecret] = useState<string>("");

  // ── Filter state ─────────────────────────────────────────────────────────
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRange, setFilterRange] = useState("all");
  const [filterSearch, setFilterSearch] = useState("");

  // ── Mobile view ──────────────────────────────────────────────────────────
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  // ── Refs ─────────────────────────────────────────────────────────────────
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visitorTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const widgetKeyRef = useRef<string>("");
  const wsSecretRef = useRef<string>("");

  const renderServerUrl = process.env.NEXT_PUBLIC_RENDER_CHAT_SERVER_URL || "";

  // ── Fetch WS secret ───────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/chat/ws-token")
      .then((r) => r.json())
      .then((d) => {
        if (d.secret) {
          setWsSecret(d.secret);
          wsSecretRef.current = d.secret;
        }
      })
      .catch(() => {});
  }, []);

  // ── Fetch conversation list ───────────────────────────────────────────────
  const fetchConversations = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setListRefreshing(true);
    try {
      const res = await fetch("/api/chat/conversations");
      if (res.ok) setConversations(await res.json());
    } catch {
    } finally {
      setLoading(false);
      setListRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(() => fetchConversations(true), 10000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  // ── Fetch single conversation ─────────────────────────────────────────────
  const fetchConversation = useCallback(async (id: string) => {
    setConvLoading(true);
    setData(null);
    widgetKeyRef.current = "";
    try {
      const res = await fetch(`/api/chat/conversations/${id}`);
      if (res.ok) {
        const d = await res.json();
        setData(d);
        if (d.widgetKey) {
          widgetKeyRef.current = d.widgetKey;
          if (socketRef.current?.connected) {
            socketRef.current.emit("join", {
              key: d.widgetKey,
              cid: id,
              role: "agent",
              secret: wsSecretRef.current,
            });
          }
        }
      }
    } catch {
    } finally {
      setConvLoading(false);
    }
  }, []);

  // ── Silent refresh right panel ────────────────────────────────────────────
  const refreshConversation = useCallback(async () => {
    if (!selectedId) return;
    setConvRefreshing(true);
    try {
      const res = await fetch(`/api/chat/conversations/${selectedId}`);
      if (res.ok) setData(await res.json());
    } catch {
    } finally {
      setConvRefreshing(false);
    }
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    const interval = setInterval(refreshConversation, 10000);
    return () => clearInterval(interval);
  }, [selectedId, refreshConversation]);

  // ── Select conversation ───────────────────────────────────────────────────
  const selectConversation = (id: string) => {
    setSelectedId(id);
    setMobileView("chat");
    setReply("");
    setVisitorTyping(false);
    fetchConversation(id);
  };

  // ── Socket ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedId || !renderServerUrl || !wsSecret) return;
    const socket = io(renderServerUrl, {
      transports: ["websocket"],
      reconnectionAttempts: Infinity,
      reconnectionDelay: 3000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setWsConnected(true);
      socket.emit("join", {
        key: widgetKeyRef.current || undefined,
        cid: selectedId,
        role: "agent",
        secret: wsSecret,
      });
    });
    socket.on("disconnect", () => setWsConnected(false));
    socket.on("new_message", (msg: ChatMessage) => {
      if (msg.sender === "agent") return;
      setData((prev) => {
        if (!prev) return prev;
        if (prev.messages.some((m) => m.id === msg.id)) return prev;
        return { ...prev, messages: [...prev.messages, msg] };
      });
    });
    socket.on(
      "typing",
      ({ role, isTyping }: { role: string; isTyping: boolean }) => {
        if (role === "visitor") {
          setVisitorTyping(isTyping);
          if (isTyping) {
            if (visitorTypingTimeoutRef.current)
              clearTimeout(visitorTypingTimeoutRef.current);
            visitorTypingTimeoutRef.current = setTimeout(
              () => setVisitorTyping(false),
              5000,
            );
          }
        }
      },
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setWsConnected(false);
    };
  }, [selectedId, renderServerUrl, wsSecret]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Scroll to bottom ──────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.messages, visitorTyping]);

  // ── Typing emit ───────────────────────────────────────────────────────────
  const emitTypingStart = useCallback(() => {
    if (!socketRef.current?.connected || !selectedId) return;
    socketRef.current.emit("typing_start", { cid: selectedId, role: "agent" });
  }, [selectedId]);

  const emitTypingStop = useCallback(() => {
    if (!socketRef.current?.connected || !selectedId) return;
    socketRef.current.emit("typing_stop", { cid: selectedId, role: "agent" });
  }, [selectedId]);

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReply(e.target.value);
    emitTypingStart();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(emitTypingStop, 2000);
  };

  // ── Send reply ────────────────────────────────────────────────────────────
  const sendReply = useCallback(
    async (
      text: string,
      type: "text" | "image" | "pdf" = "text",
      mediaUrl: string = "",
    ) => {
      if ((!text && !mediaUrl) || sending || !selectedId) return;
      setSending(true);
      const optimisticId = "temp_" + Date.now();
      const now = new Date().toISOString();
      setData((prev) =>
        prev
          ? {
              ...prev,
              messages: [
                ...prev.messages,
                {
                  id: optimisticId,
                  sender: "agent",
                  body: text,
                  type,
                  mediaUrl,
                  createdAt: now,
                },
              ],
            }
          : prev,
      );
      if (type === "text") setReply("");
      emitTypingStop();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      try {
        const res = await fetch(`/api/chat/conversations/${selectedId}/reply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            type,
            mediaUrl,
            socketId: socketRef.current?.id,
          }),
        });
        if (!res.ok) throw new Error("Failed");
        const result = await res.json();
        const savedMessage = { ...result.message, type, mediaUrl };
        setData((prev) =>
          prev
            ? {
                ...prev,
                messages: (() => {
                  const mapped = prev.messages.map((m) =>
                    m.id === optimisticId ? savedMessage : m,
                  );
                  const seen = new Set<string>();
                  return mapped.filter((m) => {
                    if (seen.has(m.id)) return false;
                    seen.add(m.id);
                    return true;
                  });
                })(),
              }
            : prev,
        );
        toast.success("Reply sent");
      } catch {
        toast.error("Failed to send reply");
        setData((prev) =>
          prev
            ? {
                ...prev,
                messages: prev.messages.filter((m) => m.id !== optimisticId),
              }
            : prev,
        );
        if (type === "text") setReply(text);
      } finally {
        setSending(false);
      }
    },
    [selectedId, sending, emitTypingStop],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendReply(reply.trim());
    }
  };

  // ── File upload ───────────────────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    if (!isPdf && !isImage) {
      toast.error("Only images and PDFs are supported.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large (max 10MB).");
      return;
    }
    setUploadProgress(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/chat/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url, type, filename } = await res.json();
      await sendReply(filename, type, url);
    } catch {
      toast.error("File upload failed.");
    } finally {
      setUploadProgress(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Delete conversation ───────────────────────────────────────────────────
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this conversation and all its files? This action cannot be undone.",
      )
    )
      return;
    try {
      const res = await fetch(`/api/chat/conversations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (selectedId === id) {
          setSelectedId(null);
          setData(null);
          setMobileView("list");
        }
      } else {
        toast.error("Failed to delete conversation.");
      }
    } catch {
      toast.error("An error occurred while deleting.");
    }
  };

  const accent = data?.widget?.accentColor || "#0369a1";

  // ── Derived domain options from conversations ─────────────────────────────
  const domainOptions = [
    { value: "all", label: "All Domains" },
    ...Array.from(
      new Set(conversations.map((c) => c.widget?.domain).filter(Boolean)),
    ).map((d) => ({ value: d as string, label: d as string })),
  ];

  // ── Filtered conversations ────────────────────────────────────────────────
  const filtered = conversations.filter((c) => {
    if (filterDomain !== "all" && c.widget?.domain !== filterDomain)
      return false;
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (filterRange !== "all") {
      const ms = Date.now() - new Date(c.lastMessageAt).getTime();
      const days = ms / 86400000;
      if (filterRange === "24h" && days > 1) return false;
      if (filterRange === "7d" && days > 7) return false;
      if (filterRange === "30d" && days > 30) return false;
    }
    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase();
      const matchDomain = c.widget?.domain?.toLowerCase().includes(q);
      const matchMsg = c.lastMessage?.body?.toLowerCase().includes(q);
      const matchPage = c.visitorPage?.toLowerCase().includes(q);
      if (!matchDomain && !matchMsg && !matchPage) return false;
    }
    return true;
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex overflow-hidden h-[calc(100dvh-56px-48px)] border border-neutral-200">
      {/* ── Left Panel ────────────────────────────────────────────────── */}
      <div
        className={`flex flex-col w-full sm:w-[400px] shrink-0 border-r border-neutral-200 bg-white ${mobileView === "chat" ? "hidden sm:flex" : "flex"}`}
      >
        {/* Left header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-sky-700 to-cyan-600 shrink-0">
          <div>
            <p className="text-sm font-schibsted font-semibold text-white">
              Live Chats
            </p>
            <p className="text-[11px] font-schibsted text-sky-100/80 mt-0.5">
              {conversations.length} total · auto-refreshes
            </p>
          </div>
          <button
            type="button"
            onClick={() => fetchConversations(true)}
            disabled={listRefreshing}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer focus:outline-none disabled:opacity-50"
          >
            <RefreshCw
              size={13}
              className={listRefreshing ? "animate-spin" : ""}
            />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-3 pt-2.5 pb-2 border-b border-neutral-200 bg-white shrink-0 space-y-2">
          {/* Search — full width */}
          <div className="flex items-center gap-2 w-full bg-white border border-neutral-600 rounded-full px-3 h-9 transition-colors focus-within:border-sky-800">
            <Search size={13} className="text-neutral-400 shrink-0" />
            <input
              type="text"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              placeholder="Search domain or message…"
              className="flex-1 text-xs tracking-tighter font-schibsted text-neutral-800 placeholder-neutral-400 bg-transparent outline-none"
            />
            {filterSearch && (
              <button onClick={() => setFilterSearch("")} className="text-neutral-300 hover:text-neutral-500">
                <X size={12} />
              </button>
            )}
          </div>

          {/* 3 dropdowns row */}
          <div className="flex items-center gap-2">
            <FilterDropdown
              options={[
                { value: "all", label: "Any time",      icon: IconClock },
                { value: "24h", label: "Last 24 hours", icon: IconClock },
                { value: "7d",  label: "Last 7 days",   icon: IconCalendarWeek },
                { value: "30d", label: "Last 30 days",  icon: IconCalendarMonth },
              ]}
              value={filterRange}
              onChange={setFilterRange}
              placeholder="Any time"
              width="flex-1"
            />
            <FilterDropdown
              options={domainOptions.map((d) => ({ ...d, icon: IconWorld }))}
              value={filterDomain}
              onChange={setFilterDomain}
              placeholder="All Domains"
              width="flex-1"
            />
            <FilterDropdown
              options={[
                { value: "all",    label: "All Status", icon: IconCircle },
                { value: "open",   label: "Open",       icon: IconCircleCheck },
                { value: "closed", label: "Closed",     icon: IconCircle },
              ]}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="All Status"
              width="flex-1"
            />
          </div>

          {/* Clear */}
          {(filterDomain !== "all" || filterStatus !== "all" || filterRange !== "all" || filterSearch) && (
            <div className="flex justify-end">
              <button
                onClick={() => { setFilterDomain("all"); setFilterStatus("all"); setFilterRange("all"); setFilterSearch(""); }}
                className="text-[11px] font-schibsted text-sky-600 hover:text-sky-800 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
          {loading ? (
            <ConversationSkeleton />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12 gap-2">
              <div className="size-10 rounded-2xl bg-neutral-100 flex items-center justify-center mb-1">
                <IconMessageCircle size={18} className="text-neutral-300" strokeWidth={1.5} />
              </div>
              {conversations.length === 0 ? (
                <>
                  <p className="text-sm font-schibsted font-semibold text-neutral-600">No conversations yet</p>
                  <p className="text-[11px] font-schibsted text-neutral-400 leading-relaxed">Add a chat widget to your site to start receiving messages.</p>
                  <Link
                    href="/dashboard/chat-widgets"
                    className="mt-1 text-[11px] font-schibsted font-semibold text-sky-700 hover:text-sky-900 transition-colors"
                  >
                    Create a widget →
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-sm font-schibsted font-semibold text-neutral-600">No results</p>
                  <p className="text-[11px] font-schibsted text-neutral-400">Try adjusting your filters.</p>
                  <button
                    onClick={() => {
                      setFilterDomain("all");
                      setFilterStatus("all");
                      setFilterRange("all");
                      setFilterSearch("");
                    }}
                    className="text-[11px] font-schibsted text-sky-700 hover:text-sky-900 transition-colors"
                  >
                    Clear filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {filtered.map((conv) => {
                const isSelected = conv.id === selectedId;
                return (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <button
                      onClick={() => selectConversation(conv.id)}
                      className={`w-full text-left rounded-2xl border p-1.5 transition-all duration-150 group ${
                        isSelected
                          ? "border-sky-200 bg-sky-50"
                          : "border-neutral-200 bg-white hover:border-neutral-400"
                      }`}
                    >
                      <div className="rounded-[10px] bg-neutral-50 p-3">
                        {/* Top row */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="size-6 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-schibsted font-bold"
                              style={{
                                background: conv.widget?.accentColor || accent,
                              }}
                            >
                              {conv.widget?.domain?.charAt(0).toUpperCase() ||
                                "V"}
                            </div>
                            <span className="text-[13px] font-schibsted font-semibold text-neutral-700 truncate group-hover:text-sky-900 transition-colors">
                              {conv.widget?.domain || "Unknown"}
                            </span>
                          </div>
                          <span className="text-[10px] font-schibsted text-neutral-400 tabular-nums shrink-0">
                            {timeAgo(conv.lastMessageAt)}
                          </span>
                        </div>

                        {/* Last message */}
                        <p className="text-[11px] font-schibsted text-neutral-500 truncate mb-2.5 leading-relaxed">
                          {conv.lastMessage ? (
                            <>
                              {conv.lastMessage.sender === "agent"
                                ? "↩ You: "
                                : "Visitor: "}
                              {conv.lastMessage.body}
                            </>
                          ) : (
                            <span className="italic text-neutral-400">
                              No messages
                            </span>
                          )}
                        </p>

                        {/* Footer row */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-schibsted font-semibold px-2 py-0.5 rounded-full ${
                              conv.status === "open"
                                ? "bg-green-50 text-green-700"
                                : "bg-neutral-100 text-neutral-500"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${conv.status === "open" ? "bg-green-400" : "bg-neutral-400"}`}
                            />
                            {conv.status}
                          </span>
                          <button
                            onClick={(e) => handleDelete(e, conv.id)}
                            className="p-1 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer focus:outline-none"
                          >
                            <IconTrash size={11} />
                          </button>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* ── Right Panel ───────────────────────────────────────────────── */}
      <div
        className={`flex flex-col flex-1 min-w-0 bg-white ${mobileView === "list" ? "hidden sm:flex" : "flex"}`}
      >
        <AnimatePresence mode="wait">
          {!selectedId ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center justify-center h-full text-center px-8 gap-2"
            >
              <div className="size-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-1">
                <IconMessageCircle size={26} className="text-neutral-300" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-schibsted font-semibold text-neutral-600">No chat open</p>
              <p className="text-[11px] font-schibsted text-neutral-400 leading-relaxed max-w-[200px]">
                Select a conversation from the list to start chatting with a visitor.
              </p>
            </motion.div>
          ) : convLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <MessageSkeleton />
            </motion.div>
          ) : data ? (
            <motion.div
              key={data.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col flex-1 min-h-0"
            >
              {/* Conversation header */}
              <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-b from-sky-700 to-cyan-600 shrink-0">
                <button
                  className="sm:hidden text-white/80 hover:text-white transition-colors focus:outline-none cursor-pointer"
                  onClick={() => setMobileView("list")}
                >
                  <IconArrowLeft size={18} />
                </button>

                <div
                  className="size-8 rounded-xl shrink-0 flex items-center justify-center text-white font-schibsted font-bold text-sm border border-white/20"
                  style={{ background: accent }}
                >
                  {data.widget?.domain?.charAt(0).toUpperCase() || "V"}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-schibsted font-semibold text-white truncate leading-tight">
                    {data.widget?.domain || "Unknown"}
                  </p>
                  <p className="text-[11px] font-schibsted text-sky-100/80 truncate leading-tight">
                    {data.visitorPage || "unknown page"} ·{" "}
                    {timeAgo(data.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-schibsted font-semibold px-2 py-0.5 rounded-full ${
                      data.status === "open"
                        ? "bg-white/15 text-white"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${data.status === "open" ? "bg-green-400" : "bg-white/40"}`}
                    />
                    {data.status}
                  </span>
                  <span
                    className="size-2 rounded-full shrink-0"
                    title={wsConnected ? "Live connected" : "Reconnecting…"}
                    style={{ background: wsConnected ? "#4ade80" : "#fbbf24" }}
                  />
                  <button
                    type="button"
                    onClick={refreshConversation}
                    disabled={convRefreshing}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer focus:outline-none disabled:opacity-50"
                  >
                    <RefreshCw
                      size={13}
                      className={convRefreshing ? "animate-spin" : ""}
                    />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 px-5 space-y-3 bg-neutral-50/50">
                {data.messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full py-12 gap-2 text-center">
                    <div className="size-10 rounded-2xl bg-neutral-100 flex items-center justify-center">
                      <IconMessageCircle size={18} className="text-neutral-300" strokeWidth={1.5} />
                    </div>
                    <p className="text-xs font-schibsted font-semibold text-neutral-500">No messages yet</p>
                    <p className="text-[11px] font-schibsted text-neutral-400">The visitor hasn't sent anything yet.</p>
                  </div>
                )}
                {data.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[72%]">
                      <div
                        className={`rounded-2xl overflow-hidden ${
                          msg.sender === "agent"
                            ? "rounded-tr-sm text-white"
                            : "rounded-tl-sm bg-white border border-neutral-200 text-neutral-800"
                        }`}
                        style={
                          msg.sender === "agent"
                            ? {
                                background:
                                  "linear-gradient(135deg, #0c4a6e, #0891b2)",
                              }
                            : undefined
                        }
                      >
                        {msg.type === "image" && msg.mediaUrl ? (
                          <div className="p-1">
                            <img
                              src={msg.mediaUrl}
                              alt={msg.body || "image"}
                              className="rounded-xl max-w-full max-h-48 object-cover block"
                            />
                            <div className="flex items-center justify-between px-2 py-1 gap-2">
                              <span className="text-[11px] opacity-70 truncate font-schibsted">
                                {msg.body}
                              </span>
                              <button
                                onClick={async () => {
                                  try {
                                    const response = await fetch(msg.mediaUrl);
                                    const blob = await response.blob();
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = msg.body || "image";
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                  } catch {
                                    window.open(msg.mediaUrl, "_blank");
                                  }
                                }}
                                className="text-[11px] underline opacity-70 hover:opacity-100 shrink-0 cursor-pointer bg-transparent border-none font-schibsted"
                              >
                                ↓ Download
                              </button>
                            </div>
                          </div>
                        ) : msg.type === "pdf" && msg.mediaUrl ? (
                          <div className="flex items-center gap-2 px-4 py-3">
                            <span className="text-xl">📄</span>
                            <div className="min-w-0">
                              <p className="text-[11px] font-schibsted font-medium truncate max-w-[160px]">
                                {msg.body}
                              </p>
                              <button
                                onClick={() => {
                                  const proxyUrl = `/api/chat/download-proxy?url=${encodeURIComponent(msg.mediaUrl)}&filename=${encodeURIComponent(msg.body || "file.pdf")}`;
                                  const a = document.createElement("a");
                                  a.href = proxyUrl;
                                  a.download = msg.body || "file.pdf";
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                }}
                                className="text-[11px] underline opacity-70 hover:opacity-100 cursor-pointer bg-transparent border-none p-0 font-schibsted"
                              >
                                Download PDF
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="px-3.5 py-2.5">
                            <p className="text-[12px] font-schibsted leading-relaxed">
                              {msg.body}
                            </p>
                          </div>
                        )}
                      </div>
                      <p
                        className={`text-[10px] mt-1 font-schibsted text-neutral-400 ${msg.sender === "agent" ? "text-right" : ""}`}
                      >
                        {msg.sender === "agent" ? "You · " : "Visitor · "}
                        {timeAgo(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Visitor typing */}
                <AnimatePresence>
                  {visitorTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white border border-neutral-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Reply box */}
              <div className="border-t border-neutral-100 px-5 py-4 shrink-0 bg-white">
                <div className="rounded-xl border border-neutral-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/10 transition-all bg-white overflow-hidden">
                  <div className="flex items-end gap-2 px-3.5 pt-3 pb-2">
                    <textarea
                      value={reply}
                      onChange={handleReplyChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Write a reply… (Enter to send)"
                      rows={2}
                      className="flex-1 resize-none text-[12px] font-schibsted text-neutral-800 placeholder-neutral-400 outline-none bg-transparent max-h-40 overflow-auto leading-relaxed"
                    />
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 border-t border-neutral-100 bg-neutral-50">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadProgress || sending}
                        className="flex items-center gap-1.5 text-[10px] font-schibsted text-neutral-500 hover:text-neutral-800 transition-colors disabled:opacity-40 cursor-pointer focus:outline-none"
                      >
                        {uploadProgress ? (
                          <svg
                            className="animate-spin w-3 h-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              strokeOpacity={0.25}
                            />
                            <path
                              d="M12 2a10 10 0 0 1 10 10"
                              strokeLinecap="round"
                            />
                          </svg>
                        ) : (
                          <IconPaperclip size={12} />
                        )}
                        Attach
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`size-1.5 rounded-full ${wsConnected ? "bg-green-500" : "bg-amber-400"}`}
                        />
                        <span className="text-[10px] font-schibsted text-neutral-400">
                          {wsConnected ? "Live" : "Reconnecting…"}
                          {visitorTyping && " · Visitor typing…"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => sendReply(reply.trim())}
                      disabled={!reply.trim() || sending || uploadProgress}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-b from-sky-600 to-cyan-600 hover:opacity-90 text-white text-[11px] font-schibsted font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                    >
                      <IconSend size={11} />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
