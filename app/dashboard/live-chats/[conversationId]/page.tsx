"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

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

export default function ConversationDetailPage() {
    const { conversationId } = useParams<{ conversationId: string }>();
    const [data, setData] = useState<ConversationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState("");
    const [sending, setSending] = useState(false);
    const [visitorTyping, setVisitorTyping] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(false);
    const [wsConnected, setWsConnected] = useState(false);
    const [wsSecret, setWsSecret] = useState<string>("");
    const widgetKeyRef = useRef<string>(""); // ref so socket effect doesn't reconnect when key loads
    const wsSecretRef = useRef<string>("");  // ref mirror of wsSecret for use in callbacks

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const visitorTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const renderServerUrl = process.env.NEXT_PUBLIC_RENDER_CHAT_SERVER_URL || "";

    // ── Fetch WS secret (server-side env, not NEXT_PUBLIC) ───────────
    useEffect(() => {
        fetch("/api/chat/ws-token")
            .then((r) => r.json())
            .then((d) => { if (d.secret) { setWsSecret(d.secret); wsSecretRef.current = d.secret; } })
            .catch(() => { });
    }, []);

    // ── Initial fetch ────────────────────────────────────────────────
    const fetchConversation = useCallback(async () => {
        try {
            const res = await fetch(`/api/chat/conversations/${conversationId}`);
            if (res.ok) {
                const d = await res.json();
                setData(d);
                // Store widget key in ref \u2014 NOT state \u2014 so socket doesn't reconnect
                if (d.widgetKey) {
                    widgetKeyRef.current = d.widgetKey;
                    // If socket is already connected, upgrade the join with the key
                    // (no reconnect needed — server handles duplicate joins idempotently)
                    if (socketRef.current?.connected) {
                        socketRef.current.emit("join", {
                            key: d.widgetKey,
                            cid: conversationId,
                            role: "agent",
                            secret: wsSecretRef.current,
                        });
                    }
                }
            }
        } catch { /* silent */ } finally {
            setLoading(false);
        }
    }, [conversationId]);

    useEffect(() => {
        fetchConversation();
    }, [fetchConversation]);

    // ── Socket.io — Agent joins the room ─────────────────────────────
    // IMPORTANT: widgetKey is intentionally NOT in the dep array.
    // Adding it caused the socket to disconnect/reconnect when fetchConversation
    // returned, creating a window where incoming messages were permanently lost.
    // widgetKeyRef is used instead so the latest value is always available.
    useEffect(() => {
        if (!conversationId || !renderServerUrl || !wsSecret) return;

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
                cid: conversationId,
                role: "agent",
                secret: wsSecret,
            });
        });

        socket.on("disconnect", () => setWsConnected(false));

        socket.on("new_message", (msg: ChatMessage) => {
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
        };
    }, [conversationId, renderServerUrl, wsSecret]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Scroll to bottom ────────────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [data?.messages, visitorTyping]);

    // ── Typing indicator emit ───────────────────────────────────────
    const emitTypingStart = useCallback(() => {
        if (!socketRef.current?.connected) return;
        socketRef.current.emit("typing_start", { cid: conversationId, role: "agent" });
    }, [conversationId]);

    const emitTypingStop = useCallback(() => {
        if (!socketRef.current?.connected) return;
        socketRef.current.emit("typing_stop", { cid: conversationId, role: "agent" });
    }, [conversationId]);

    const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReply(e.target.value);
        emitTypingStart();
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(emitTypingStop, 2000);
    };

    // ── Send reply (text or file) ────────────────────────────────────
    const sendReply = useCallback(async (
        text: string,
        type: "text" | "image" | "pdf" = "text",
        mediaUrl: string = ""
    ) => {
        if ((!text && !mediaUrl) || sending) return;
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
                : prev
        );
        if (type === "text") setReply("");

        // Stop typing
        emitTypingStop();
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // ── Emit agent_message via socket IMMEDIATELY for instant delivery ──
        // This ensures the visitor sees the message in real-time without waiting
        // for the API call + /push HTTP roundtrip to complete.
        if (socketRef.current?.connected && wsSecretRef.current) {
            socketRef.current.emit("agent_message", {
                cid: conversationId,
                secret: wsSecretRef.current,
                message: {
                    id: optimisticId,
                    sender: "agent",
                    body: text,
                    type,
                    mediaUrl,
                    createdAt: now,
                },
            });
        }

        try {
            const res = await fetch(`/api/chat/conversations/${conversationId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, type, mediaUrl }),
            });
            if (!res.ok) throw new Error("Failed");
            const result = await res.json();
            const savedMessage = { ...result.message, type, mediaUrl };

            // Replace optimistic message with the real saved one
            setData((prev) =>
                prev
                    ? {
                        ...prev,
                        messages: prev.messages.map((m) =>
                            m.id === optimisticId ? savedMessage : m
                        ),
                    }
                    : prev
            );

            toast.success("Reply sent");
        } catch {
            toast.error("Failed to send reply");
            setData((prev) =>
                prev
                    ? { ...prev, messages: prev.messages.filter((m) => m.id !== optimisticId) }
                    : prev
            );
            if (type === "text") setReply(text);
        } finally {
            setSending(false);
        }
    }, [conversationId, sending, emitTypingStop]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendReply(reply.trim());
        }
    };

    // ── Agent file upload (server-side via /api/chat/upload) ─────────
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

    if (loading) {
        return (
            <div className="animate-pulse space-y-3">
                <div className="h-8 w-48 bg-neutral-100 rounded" />
                <div className="h-96 bg-neutral-100 rounded-xl" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-16">
                <p className="text-neutral-500">Conversation not found.</p>
                <Link href="/dashboard/live-chats" className="text-sky-600 text-sm mt-2 block hover:underline">
                    ← Back to Live Chats
                </Link>
            </div>
        );
    }

    const accent = data.widget?.accentColor || "#0ea5e9";

    return (
        <div className="flex flex-col h-[calc(100vh-88px)] max-h-[800px]">
            {/* Top bar */}
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-200 flex-shrink-0">
                <Link
                    href="/dashboard/live-chats"
                    className="text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div
                    className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: accent }}
                >
                    {data.widget?.domain?.charAt(0).toUpperCase() || "V"}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-semibold text-neutral-900 text-sm">
                        {data.widget?.domain || "Unknown"}
                    </p>
                    <p className="text-xs text-neutral-400 truncate" title={data.visitorPage}>
                        Visitor · {data.visitorPage || "unknown page"} · started {timeAgo(data.createdAt)}
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* WS status dot */}
                    <span
                        className="w-2 h-2 rounded-full"
                        title={wsConnected ? "Live WebSocket connected" : "Reconnecting…"}
                        style={{ background: wsConnected ? "#4ade80" : "#fbbf24" }}
                    />
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full ${data.status === "open"
                            ? "bg-green-100 text-green-700"
                            : "bg-neutral-100 text-neutral-500"
                            }`}
                    >
                        {data.status}
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 px-1">
                {data.messages.length === 0 && (
                    <p className="text-center text-sm text-neutral-400 py-8">No messages yet.</p>
                )}
                {data.messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}
                    >
                        <div className="max-w-[72%]">
                            <div
                                className={`rounded-2xl overflow-hidden ${msg.sender === "agent"
                                    ? "rounded-tr-sm text-white"
                                    : "rounded-tl-sm bg-neutral-100 text-neutral-800"
                                    }`}
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
                                            <a
                                                href={msg.mediaUrl}
                                                download={msg.body || "image"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs underline opacity-70 hover:opacity-100 flex-shrink-0"
                                            >
                                                ↓ Download
                                            </a>
                                        </div>
                                    </div>
                                ) : msg.type === "pdf" && msg.mediaUrl ? (
                                    <div className="flex items-center gap-2 px-4 py-3">
                                        <span className="text-2xl">📄</span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium truncate max-w-[160px]">{msg.body}</p>
                                            <a
                                                href={msg.mediaUrl}
                                                download={msg.body || "file.pdf"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs underline opacity-70 hover:opacity-100"
                                            >
                                                Download PDF
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="px-4 py-2.5">
                                        <p className="text-sm leading-relaxed">{msg.body}</p>
                                    </div>
                                )}
                            </div>
                            <p className={`text-[10px] mt-1 text-neutral-400 ${msg.sender === "agent" ? "text-right" : ""}`}>
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
            <div className="border-t border-neutral-200 pt-4 flex-shrink-0">
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
                        className="flex-1 resize-none text-sm text-neutral-800 placeholder-neutral-400 outline-none bg-transparent max-h-40 overflow-auto"
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
                <p className="text-xs text-neutral-400 mt-1.5">
                    {wsConnected ? "🟢 Live WebSocket connected" : "🟡 Reconnecting…"}
                    {visitorTyping && " · Visitor is typing…"}
                </p>
            </div>
        </div>
    );
}
