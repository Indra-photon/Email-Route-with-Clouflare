"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
    id: string;
    sender: "visitor" | "agent";
    body: string;
    type: "text" | "image" | "pdf";
    mediaUrl: string;
    createdAt: string;
}

interface WidgetConfig {
    welcomeMessage: string;
    accentColor: string;
}

export default function ChatEmbedPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
        welcomeMessage: "Hi! How can we help you today? 👋",
        accentColor: "#0ea5e9",
    });
    const [chatKey, setChatKey] = useState<string>("");
    const [visitorId, setVisitorId] = useState<string>("");
    const [visitorPage, setVisitorPage] = useState<string>("");
    const [isConnected, setIsConnected] = useState(false);
    const [agentOnline, setAgentOnline] = useState(false);
    const [agentCount, setAgentCount] = useState(0);
    const [agentTyping, setAgentTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const agentTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const conversationIdRef = useRef<string | null>(null);

    const renderServerUrl = process.env.NEXT_PUBLIC_RENDER_CHAT_SERVER_URL || "";
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

    // Keep ref in sync with state
    useEffect(() => { conversationIdRef.current = conversationId; }, [conversationId]);

    // ── Parse URL params ────────────────────────────────────────────
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const key = params.get("key") || "";
        const vid = params.get("vid") || "";
        const cid = params.get("cid") || "";
        const page = params.get("page") || "";
        setChatKey(key);
        setVisitorId(vid);
        setVisitorPage(page);
        if (cid) setConversationId(cid);
    }, []);

    // ── Load existing messages from DB ──────────────────────────────
    const fetchInitialMessages = useCallback(async (key: string, vid: string, cid: string) => {
        if (!key || !vid || !cid) return;
        try {
            const res = await fetch(
                `/api/chat/messages?key=${encodeURIComponent(key)}&cid=${encodeURIComponent(cid)}&vid=${encodeURIComponent(vid)}`
            );
            if (!res.ok) return;
            const data = await res.json();
            if (data.messages?.length > 0) {
                setMessages(data.messages as ChatMessage[]);
            }
            if (data.widgetConfig) setWidgetConfig(data.widgetConfig);
        } catch { /* silent */ }
    }, []);

    // ── Socket.io connection ────────────────────────────────────────
    useEffect(() => {
        if (!chatKey || !visitorId || !renderServerUrl) return;

        const socket = io(renderServerUrl, {
            transports: ["websocket"],
            reconnectionAttempts: Infinity,
            reconnectionDelay: 3000,
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
            const cid = conversationIdRef.current;
            if (cid) {
                socket.emit("join", { key: chatKey, cid, visitorId, role: "visitor" });
                fetchInitialMessages(chatKey, visitorId, cid);
            }
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
            setAgentOnline(false);
        });

        socket.on("new_message", (msg: ChatMessage) => {
            setMessages((prev) => {
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        });

        socket.on("typing", ({ role, isTyping }: { role: string; isTyping: boolean }) => {
            if (role === "agent") {
                setAgentTyping(isTyping);
                if (isTyping) {
                    if (agentTypingTimeoutRef.current) clearTimeout(agentTypingTimeoutRef.current);
                    agentTypingTimeoutRef.current = setTimeout(() => setAgentTyping(false), 5000);
                }
            }
        });

        socket.on("agent_status", ({ online, count }: { online: boolean; count: number }) => {
            setAgentOnline(online);
            setAgentCount(count);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [chatKey, visitorId, renderServerUrl, fetchInitialMessages]);

    // ── Join room when conversationId becomes available ─────────────
    useEffect(() => {
        if (!conversationId || !socketRef.current?.connected || !chatKey || !visitorId) return;
        socketRef.current.emit("join", { key: chatKey, cid: conversationId, visitorId, role: "visitor" });
        fetchInitialMessages(chatKey, visitorId, conversationId);
    }, [conversationId, chatKey, visitorId, fetchInitialMessages]);

    // ── Scroll to bottom ────────────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, agentTyping]);

    // ── Tell parent widget.js the conversationId ────────────────────
    useEffect(() => {
        if (conversationId) {
            window.parent?.postMessage({ type: "CW_CONVERSATION_ID", conversationId }, "*");
        }
    }, [conversationId]);

    // ── Typing indicator emit ───────────────────────────────────────
    const emitTypingStart = useCallback(() => {
        const cid = conversationIdRef.current;
        if (!cid || !socketRef.current?.connected) return;
        socketRef.current.emit("typing_start", { cid, role: "visitor" });
    }, []);

    const emitTypingStop = useCallback(() => {
        const cid = conversationIdRef.current;
        if (!cid || !socketRef.current?.connected) return;
        socketRef.current.emit("typing_stop", { cid, role: "visitor" });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        emitTypingStart();
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(emitTypingStop, 2000);
    };

    // ── Send text message ───────────────────────────────────────────
    const sendMessage = useCallback(async (
        text: string,
        type: "text" | "image" | "pdf" = "text",
        mediaUrl: string = ""
    ) => {
        if ((!text && !mediaUrl) || isSending || !chatKey || !visitorId) return;
        setIsSending(true);

        const optimisticId = "temp_" + Date.now();
        const optimistic: ChatMessage = {
            id: optimisticId,
            sender: "visitor",
            body: text,
            type,
            mediaUrl,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimistic]);
        if (type === "text") setInput("");

        // Stop typing indicator
        emitTypingStop();
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        try {
            const res = await fetch("/api/chat/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: chatKey,
                    conversationId,
                    visitorId,
                    message: text,
                    visitorPage,
                    type,
                    mediaUrl,
                }),
            });

            if (!res.ok) throw new Error("Failed");

            const data = await res.json();
            const cid = data.conversationId;
            if (!conversationId && cid) setConversationId(cid);

            // Replace optimistic message
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === optimisticId
                        ? { ...m, id: data.message?.id || data.messageId || m.id }
                        : m
                )
            );
            setError(null);
        } catch {
            setError("Failed to send. Please try again.");
            setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
            if (type === "text") setInput(text);
        } finally {
            setIsSending(false);
            if (type === "text") inputRef.current?.focus();
        }
    }, [isSending, chatKey, visitorId, conversationId, visitorPage, emitTypingStop]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input.trim());
        }
    };

    // ── File upload to Cloudinary (unsigned, client-side) ───────────
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isPdf = file.type === "application/pdf";
        const isImage = file.type.startsWith("image/");
        if (!isPdf && !isImage) {
            setError("Only images and PDFs are supported.");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError("File too large (max 10MB).");
            return;
        }

        setUploadProgress(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", uploadPreset);
            formData.append("folder", "chat_uploads");

            const resourceType = isPdf ? "raw" : "image";
            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
                { method: "POST", body: formData }
            );

            if (!uploadRes.ok) throw new Error("Cloudinary upload failed");
            const uploadData = await uploadRes.json();

            const type: "image" | "pdf" = isPdf ? "pdf" : "image";
            await sendMessage(file.name, type, uploadData.secure_url);
        } catch {
            setError("File upload failed. Please try again.");
        } finally {
            setUploadProgress(false);
            // Reset file input
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const accent = widgetConfig.accentColor || "#0ea5e9";

    return (
        <div
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            className="flex flex-col h-screen bg-white"
        >
            {/* Header */}
            <div
                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
                className="flex items-center gap-3 px-4 py-3 shadow-sm flex-shrink-0"
            >
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                    💬
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm leading-tight">Live Support</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{
                                background: !isConnected ? "#fbbf24" : agentOnline ? "#4ade80" : "#f87171",
                            }}
                        />
                        <span className="text-white/80 text-xs truncate">
                            {!isConnected
                                ? "Connecting…"
                                : agentOnline
                                    ? `Agent Online${agentCount > 1 ? ` (${agentCount})` : ""}`
                                    : "No agents online"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {/* Welcome message */}
                <div className="flex justify-start">
                    <div className="max-w-[80%] bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5">
                        <p className="text-gray-800 text-sm leading-relaxed">
                            {widgetConfig.welcomeMessage}
                        </p>
                    </div>
                </div>

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "visitor" ? "justify-end" : "justify-start"}`}
                    >
                        <div className="max-w-[80%]">
                            <div
                                className={`rounded-2xl overflow-hidden ${msg.sender === "visitor"
                                        ? "rounded-tr-sm text-white"
                                        : "rounded-tl-sm bg-gray-100 text-gray-800"
                                    }`}
                                style={msg.sender === "visitor" ? { background: accent } : undefined}
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
                                                ↓
                                            </a>
                                        </div>
                                    </div>
                                ) : msg.type === "pdf" && msg.mediaUrl ? (
                                    <div className="flex items-center gap-2 px-4 py-3">
                                        <span className="text-2xl">📄</span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium truncate max-w-[140px]">{msg.body}</p>
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
                            <p
                                className={`text-[10px] mt-1 ${msg.sender === "visitor"
                                        ? "text-gray-400 text-right"
                                        : "text-gray-400"
                                    }`}
                            >
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Agent typing indicator */}
                {agentTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center">
                        <span className="text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full">
                            {error}
                        </span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
                <div
                    className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 px-3 py-2 focus-within:border-gray-300 focus-within:ring-2 transition-all"
                    style={{ "--tw-ring-color": `${accent}33` } as React.CSSProperties}
                >
                    {/* File upload button */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadProgress || isSending}
                        className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
                        aria-label="Attach file"
                        title="Send image or PDF"
                    >
                        {uploadProgress ? (
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
                                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                            </svg>
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
                        ref={inputRef}
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message…"
                        rows={1}
                        className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none py-0.5 max-h-28 overflow-auto"
                        style={{ lineHeight: "1.5" }}
                        disabled={isSending || uploadProgress}
                    />

                    <button
                        onClick={() => sendMessage(input.trim())}
                        disabled={!input.trim() || isSending || uploadProgress}
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: accent }}
                        aria-label="Send"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </div>
                <p className="text-center text-[10px] text-gray-300 mt-2">
                    Powered by Email Router
                </p>
            </div>
        </div>
    );
}
