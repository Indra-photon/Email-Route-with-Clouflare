"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, RefreshCw, Send, Paperclip, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";

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
    widget: { domain: string; accentColor: string; welcomeMessage: string } | null;
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

    // ── Mobile view ──────────────────────────────────────────────────────────
    const [mobileView, setMobileView] = useState<"list" | "chat">("list");

    // ── Refs ─────────────────────────────────────────────────────────────────
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const visitorTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const widgetKeyRef = useRef<string>("");
    const wsSecretRef = useRef<string>("");

    const renderServerUrl = process.env.NEXT_PUBLIC_RENDER_CHAT_SERVER_URL || "";

    // ── Fetch WS secret once on mount ────────────────────────────────────────
    useEffect(() => {
        fetch("/api/chat/ws-token")
            .then((r) => r.json())
            .then((d) => { if (d.secret) { setWsSecret(d.secret); wsSecretRef.current = d.secret; } })
            .catch(() => { });
    }, []);

    // ── Fetch conversation list ───────────────────────────────────────────────
    const fetchConversations = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setListRefreshing(true);
        try {
            const res = await fetch("/api/chat/conversations");
            if (res.ok) setConversations(await res.json());
        } catch {
            // silent
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

    // ── Fetch single conversation (full load) ────────────────────────────────
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
                    // If socket is already connected, upgrade the join with the key
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
        } catch { /* silent */ } finally {
            setConvLoading(false);
        }
    }, []);

    // ── Silent refresh right panel (no skeleton flash) ───────────────────────
    const refreshConversation = useCallback(async () => {
        if (!selectedId) return;
        setConvRefreshing(true);
        try {
            const res = await fetch(`/api/chat/conversations/${selectedId}`);
            if (res.ok) {
                const d = await res.json();
                setData(d);
            }
        } catch { /* silent */ } finally {
            setConvRefreshing(false);
        }
    }, [selectedId]);

    // ── Auto-refresh right panel every 10s when a conversation is open ────────
    useEffect(() => {
        if (!selectedId) return;
        const interval = setInterval(refreshConversation, 10000);
        return () => clearInterval(interval);
    }, [selectedId, refreshConversation]);

    // ── Select conversation ──────────────────────────────────────────────────
    const selectConversation = (id: string) => {
        setSelectedId(id);
        setMobileView("chat");
        setReply("");
        setVisitorTyping(false);
        fetchConversation(id);
    };

    // ── Socket connect/disconnect when selectedId or wsSecret changes ─────────
    // IMPORTANT: widgetKey is NOT in deps — widgetKeyRef is used to avoid
    // disconnecting/reconnecting every time fetchConversation returns.
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
            // Only add visitor messages via socket.
            // Agent's own replies are already shown via optimistic UI.
            if (msg.sender === "agent") return;
            setData((prev) => {
                if (!prev) return prev;
                if (prev.messages.some((m) => m.id === msg.id)) return prev;
                return { ...prev, messages: [...prev.messages, msg] };
            });
        });

        socket.on("typing", ({ role, isTyping }: { role: string; isTyping: boolean }) => {
            if (role === "visitor") {
                setVisitorTyping(isTyping);
                if (isTyping) {
                    if (visitorTypingTimeoutRef.current) clearTimeout(visitorTypingTimeoutRef.current);
                    visitorTypingTimeoutRef.current = setTimeout(() => setVisitorTyping(false), 5000);
                }
            }
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
            setWsConnected(false);
        };
    }, [selectedId, renderServerUrl, wsSecret]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Scroll to bottom on new messages / typing ────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [data?.messages, visitorTyping]);

    // ── Typing emit ──────────────────────────────────────────────────────────
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

    // ── Send reply ───────────────────────────────────────────────────────────
    const sendReply = useCallback(async (
        text: string,
        type: "text" | "image" | "pdf" = "text",
        mediaUrl: string = ""
    ) => {
        if ((!text && !mediaUrl) || sending || !selectedId) return;
        setSending(true);

        const optimisticId = "temp_" + Date.now();
        const now = new Date().toISOString();
        setData((prev) =>
            prev
                ? { ...prev, messages: [...prev.messages, { id: optimisticId, sender: "agent", body: text, type, mediaUrl, createdAt: now }] }
                : prev
        );
        if (type === "text") setReply("");

        emitTypingStop();
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        try {
            const res = await fetch(`/api/chat/conversations/${selectedId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, type, mediaUrl, socketId: socketRef.current?.id }),
            });
            if (!res.ok) throw new Error("Failed");
            const result = await res.json();

            // Replace optimistic with real saved message, deduplicate to prevent race condition
            const savedMessage = { ...result.message, type, mediaUrl };
            setData((prev) =>
                prev
                    ? {
                        ...prev,
                        messages: (() => {
                            const mapped = prev.messages.map((m) => m.id === optimisticId ? savedMessage : m);
                            const seen = new Set<string>();
                            return mapped.filter((m) => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });
                        })(),
                    }
                    : prev
            );
            toast.success("Reply sent");
        } catch {
            toast.error("Failed to send reply");
            setData((prev) => prev ? { ...prev, messages: prev.messages.filter((m) => m.id !== optimisticId) } : prev);
            if (type === "text") setReply(text);
        } finally {
            setSending(false);
        }
    }, [selectedId, sending, emitTypingStop]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendReply(reply.trim());
        }
    };

    // ── File upload ──────────────────────────────────────────────────────────
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const isPdf = file.type === "application/pdf";
        const isImage = file.type.startsWith("image/");
        if (!isPdf && !isImage) { toast.error("Only images and PDFs are supported."); return; }
        if (file.size > 10 * 1024 * 1024) { toast.error("File too large (max 10MB)."); return; }
        setUploadProgress(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/chat/upload", { method: "POST", body: formData });
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

    // ── Delete conversation ──────────────────────────────────────────────────
    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to permanently delete this conversation and all its files? This action cannot be undone.")) return;
        try {
            const res = await fetch(`/api/chat/conversations/${id}`, { method: "DELETE" });
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

    const accent = data?.widget?.accentColor || "#0ea5e9";

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="flex h-[calc(100vh-88px)] overflow-hidden border border-neutral-200 rounded-xl bg-white">

            {/* ── Left Panel: Conversation List ────────────────────────────── */}
            <div className={`flex flex-col w-full sm:w-[340px] flex-shrink-0 border-r border-neutral-200 ${mobileView === "chat" ? "hidden sm:flex" : "flex"}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200 flex-shrink-0">
                    <div>
                        <h1 className="text-base font-semibold text-neutral-900 font-schibsted">Live Chats</h1>
                        <p className="text-xs text-neutral-400 font-schibsted mt-0.5">Auto-refreshes every 10s</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => fetchConversations(true)}
                        disabled={listRefreshing}
                        className="h-8 w-8"
                        title="Refresh list"
                    >
                        <RefreshCw size={14} className={listRefreshing ? "animate-spin" : ""} />
                    </Button>
                </div>

                {/* Conversation List */}
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
                    ) : conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
                            <MessageSquare className="size-8 text-neutral-300 mb-3" />
                            <p className="text-sm font-medium text-neutral-500 font-schibsted">No conversations yet</p>
                            <Link href="/dashboard/chat-widgets" className="mt-3 text-xs text-sky-600 hover:underline font-schibsted">
                                Create a Widget →
                            </Link>
                        </div>
                    ) : (
                        <ul className="divide-y divide-neutral-100">
                            {conversations.map((conv) => {
                                const isSelected = conv.id === selectedId;
                                return (
                                    <li key={conv.id}>
                                        <button
                                            onClick={() => selectConversation(conv.id)}
                                            className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors hover:bg-neutral-50 ${isSelected ? "bg-sky-50 border-l-2 border-sky-500" : ""}`}
                                        >
                                            {/* Color dot */}
                                            <div
                                                className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                                                style={{ background: conv.widget?.accentColor || "#0ea5e9" }}
                                            >
                                                {conv.widget?.domain?.charAt(0).toUpperCase() || "V"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className="text-sm font-semibold text-neutral-900 font-schibsted truncate">
                                                        {conv.widget?.domain || "Unknown"}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-schibsted shrink-0">
                                                        <Clock size={10} />
                                                        {timeAgo(conv.lastMessageAt)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-neutral-500 font-schibsted truncate mt-0.5">
                                                    {conv.lastMessage ? (
                                                        <>{conv.lastMessage.sender === "agent" ? "You: " : "Visitor: "}{conv.lastMessage.body}</>
                                                    ) : (
                                                        <span className="italic text-neutral-400">No messages</span>
                                                    )}
                                                </p>
                                                <div className="mt-1.5 flex items-center justify-between gap-2">
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-schibsted font-medium ${conv.status === "open" ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                                                        {conv.status}
                                                    </span>
                                                    <button
                                                        onClick={(e) => handleDelete(e, conv.id)}
                                                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete conversation"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>

            {/* ── Right Panel: Chat ─────────────────────────────────────────── */}
            <div className={`flex flex-col flex-1 min-w-0 ${mobileView === "list" ? "hidden sm:flex" : "flex"}`}>
                {!selectedId ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                        <div className="w-14 h-14 rounded-full bg-sky-50 flex items-center justify-center mb-4">
                            <MessageSquare size={22} className="text-sky-400" />
                        </div>
                        <p className="text-base font-semibold text-neutral-700 font-schibsted">Select a conversation</p>
                        <p className="text-sm text-neutral-400 font-schibsted mt-1">Click any chat on the left to open it</p>
                    </div>
                ) : convLoading ? (
                    /* Loading skeleton for right panel */
                    <div className="flex flex-col gap-3 p-6 flex-1">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className={`flex ${n % 2 === 0 ? "justify-end" : "justify-start"}`}>
                                <div className="animate-pulse h-10 w-48 rounded-2xl bg-neutral-200" />
                            </div>
                        ))}
                    </div>
                ) : data ? (
                    <>
                        {/* Conversation Header */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 flex-shrink-0 bg-white">
                            {/* Back button (mobile only) */}
                            <button
                                className="sm:hidden text-neutral-400 hover:text-neutral-700 transition-colors"
                                onClick={() => setMobileView("list")}
                            >
                                <ArrowLeft size={18} />
                            </button>

                            {/* Color dot */}
                            <div
                                className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                                style={{ background: accent }}
                            >
                                {data.widget?.domain?.charAt(0).toUpperCase() || "V"}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-neutral-900 font-schibsted truncate">
                                    {data.widget?.domain || "Unknown"}
                                </p>
                                <p className="text-[11px] text-neutral-400 font-schibsted truncate">
                                    Visitor · {data.visitorPage || "unknown page"} · started {timeAgo(data.createdAt)}
                                </p>
                            </div>

                            {/* Right controls */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {/* WS status dot */}
                                <span
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    title={wsConnected ? "Live WebSocket connected" : "Reconnecting…"}
                                    style={{ background: wsConnected ? "#4ade80" : "#fbbf24" }}
                                />
                                <span className={`text-xs px-2 py-0.5 rounded-full font-schibsted ${data.status === "open" ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                                    {data.status}
                                </span>
                                {/* Refresh button */}
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
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto py-4 space-y-3 px-4">
                            {data.messages.length === 0 && (
                                <p className="text-center text-sm text-neutral-400 py-8 font-schibsted">No messages yet.</p>
                            )}
                            {data.messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}>
                                    <div className="max-w-[72%]">
                                        <div
                                            className={`rounded-2xl overflow-hidden ${msg.sender === "agent" ? "rounded-tr-sm text-white" : "rounded-tl-sm bg-neutral-100 text-neutral-800"}`}
                                            style={msg.sender === "agent" ? { background: accent } : undefined}
                                        >
                                            {msg.type === "image" && msg.mediaUrl ? (
                                                <div className="p-1">
                                                    <img
                                                        src={msg.mediaUrl}
                                                        alt={msg.body || "image"}
                                                        className="rounded-xl max-w-full max-h-48 object-cover block"
                                                    />
                                                    <div className="flex items-center justify-between px-2 py-1 gap-2">
                                                        <span className="text-xs opacity-70 truncate">{msg.body}</span>
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
                                                            className="text-xs underline opacity-70 hover:opacity-100 shrink-0 cursor-pointer bg-transparent border-none"
                                                        >
                                                            ↓ Download
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : msg.type === "pdf" && msg.mediaUrl ? (
                                                <div className="flex items-center gap-2 px-4 py-3">
                                                    <span className="text-2xl">📄</span>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium truncate max-w-[160px]">{msg.body}</p>
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
                                                            className="text-xs underline opacity-70 hover:opacity-100 cursor-pointer bg-transparent border-none p-0"
                                                        >
                                                            Download PDF
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="px-4 py-2.5">
                                                    <p className="text-sm leading-relaxed">{msg.body}</p>
                                                </div>
                                            )}
                                        </div>
                                        <p className={`text-[10px] mt-1 text-neutral-400 font-schibsted ${msg.sender === "agent" ? "text-right" : ""}`}>
                                            {msg.sender === "agent" ? "You · " : "Visitor · "}
                                            {timeAgo(msg.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Visitor typing indicator */}
                            {visitorTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-neutral-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0ms]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:150ms]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:300ms]" />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Reply Box */}
                        <div className="border-t border-neutral-200 px-4 py-3 flex-shrink-0 bg-white">
                            <div className="flex items-end gap-2 bg-white border border-neutral-200 rounded-xl px-3 py-3 focus-within:border-neutral-300 focus-within:ring-2 focus-within:ring-sky-500/10 transition-all">
                                {/* File attach button */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadProgress || sending}
                                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-40"
                                    title="Attach image or PDF"
                                >
                                    {uploadProgress ? (
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                            <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
                                            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                                        </svg>
                                    ) : (
                                        <Paperclip size={16} />
                                    )}
                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />

                                <textarea
                                    value={reply}
                                    onChange={handleReplyChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a reply… (Enter to send)"
                                    rows={2}
                                    className="flex-1 resize-none text-sm text-neutral-800 placeholder-neutral-400 outline-none bg-transparent max-h-40 overflow-auto font-schibsted"
                                />
                                <button
                                    onClick={() => sendReply(reply.trim())}
                                    disabled={!reply.trim() || sending || uploadProgress}
                                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    style={{ background: accent }}
                                    aria-label="Send reply"
                                >
                                    <Send size={15} />
                                </button>
                            </div>
                            <p className="text-xs text-neutral-400 mt-1.5 font-schibsted">
                                {wsConnected ? "🟢 Live WebSocket connected" : "🟡 Reconnecting…"}
                                {visitorTyping && " · Visitor is typing…"}
                            </p>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}
