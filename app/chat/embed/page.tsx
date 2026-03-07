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

    // Keep ref in sync with state
    useEffect(() => { conversationIdRef.current = conversationId; }, [conversationId]);

    // ── Parse URL params ─────────────────────────────────────────────
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const key = params.get("key") || "";
        const vid = params.get("vid") || "";
        const page = params.get("page") || "";
        setChatKey(key);
        setVisitorId(vid);
        setVisitorPage(page);
        // Note: we intentionally do NOT read ?cid= from the URL.
        // The conversation is discovered from the API via lookupActiveConversation.
    }, []);

    // ── Load existing messages from DB ──────────────────────────────
    // Called once we know the conversationId (either from API lookup or after first message).
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

    // ── Look up active conversation for this visitor ─────────────────
    // Called on mount. If this visitor has chatted before (same visitorId),
    // the API returns their conversationId and existing messages.
    // This replaces the old approach of reading ?cid= from the URL (which
    // could be stale from localStorage and show a previous session's history).
    const lookupActiveConversation = useCallback(async (key: string, vid: string) => {
        if (!key || !vid) return;
        try {
            const res = await fetch(
                `/api/chat/messages?key=${encodeURIComponent(key)}&vid=${encodeURIComponent(vid)}`
            );
            if (!res.ok) return;
            const data = await res.json();
            if (data.widgetConfig) setWidgetConfig(data.widgetConfig);
            if (data.conversationId) {
                setConversationId(data.conversationId);
                // conversationId state update triggers the cid useEffect below
                // which calls fetchInitialMessages — no need to duplicate here.
            }
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
            // Always join with key so visitor enters the presence room and
            // gets agent_status immediately, even before starting a conversation.
            socket.emit("join", {
                key: chatKey,
                cid: cid || undefined,
                visitorId,
                role: "visitor",
            });
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

    // ── On mount: look up active conversation by visitorId ───────────
    // Runs once chatKey + visitorId are parsed from the URL.
    // This discovers if the visitor has an existing open conversation
    // without relying on a potentially-stale ?cid= URL param.
    useEffect(() => {
        if (!chatKey || !visitorId) return;
        lookupActiveConversation(chatKey, visitorId);
    }, [chatKey, visitorId, lookupActiveConversation]);

    // ── Upgrade to conversation room once we have a cid ──────────────
    // Fires when the visitor sends their first message and gets a conversationId back.
    useEffect(() => {
        if (!conversationId || !chatKey || !visitorId) return;

        // Fetch history immediately, independently of socket connection
        fetchInitialMessages(chatKey, visitorId, conversationId);

        // Join socket room if socket is connected
        if (isConnected) {
            socketRef.current?.emit("join", { key: chatKey, cid: conversationId, visitorId, role: "visitor" });
        }
    }, [conversationId, chatKey, visitorId, isConnected, fetchInitialMessages]);




    // ── BULLETPROOF: Poll agent presence every 8 seconds via REST ────
    // Works independently of socket — guaranteed accurate status.
    useEffect(() => {
        if (!chatKey || !renderServerUrl) return;

        const checkPresence = async () => {
            try {
                const res = await fetch(
                    `${renderServerUrl}/presence?key=${encodeURIComponent(chatKey)}`
                );
                if (!res.ok) return;
                const data = await res.json();
                setAgentOnline(data.online);
                setAgentCount(data.count || 0);
            } catch { /* silent — socket presence still works as backup */ }
        };

        checkPresence(); // Check immediately
        const interval = setInterval(checkPresence, 8000);
        return () => clearInterval(interval);
    }, [chatKey, renderServerUrl]);

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
        const now = new Date().toISOString();
        const optimistic: ChatMessage = {
            id: optimisticId,
            sender: "visitor",
            body: text,
            type,
            mediaUrl,
            createdAt: now,
        };
        setMessages((prev) => [...prev, optimistic]);
        if (type === "text") setInput("");

        // Stop typing indicator
        emitTypingStop();
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // ── Emit visitor_message via socket IMMEDIATELY for instant delivery ──
        // This ensures the agent sees the message in real-time without waiting
        // for the API call + /push HTTP roundtrip to complete.
        const currentCid = conversationIdRef.current;
        if (currentCid && socketRef.current?.connected) {
            socketRef.current.emit("visitor_message", {
                cid: currentCid,
                message: {
                    id: optimisticId,
                    sender: "visitor",
                    body: text,
                    type,
                    mediaUrl,
                    createdAt: now,
                },
            });
        }

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
                    socketId: socketRef.current?.id,
                }),
            });

            if (!res.ok) throw new Error("Failed");

            const data = await res.json();
            const savedCid = data.conversationId;
            const savedMsgId = data.message?.id || data.messageId || optimisticId;

            // If this was the first message, we now have a cid — set it.
            if (!conversationId && savedCid) {
                setConversationId(savedCid);
                try {
                    window.parent.postMessage(
                        { type: "CW_CONVERSATION_ID", conversationId: savedCid },
                        "*"
                    );
                } catch { /* cross-origin safeguard */ }
            }

            // Replace optimistic message with real ID
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === optimisticId
                        ? { ...m, id: savedMsgId }
                        : m
                )
            );

            // Join the conversation room if this was the first message.
            const activeCid = savedCid || conversationId;
            if (activeCid && socketRef.current?.connected) {
                socketRef.current.emit("join", {
                    key: chatKey,
                    cid: activeCid,
                    visitorId,
                    role: "visitor",
                });

                // If we didn't have a cid before (first message), the socket
                // emit above was skipped. Now emit visitor_message with the real cid
                // so the agent sees it (even if slightly delayed for first message only).
                if (!currentCid) {
                    socketRef.current.emit("visitor_message", {
                        cid: activeCid,
                        message: {
                            id: savedMsgId,
                            sender: "visitor",
                            body: text,
                            type,
                            mediaUrl,
                            createdAt: now,
                        },
                    });
                }
            }

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

    // ── File upload via server-side API ────────────────────────────────
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
            formData.append("key", chatKey);

            const uploadRes = await fetch("/api/chat/visitor-upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("Upload failed");
            const uploadData = await uploadRes.json();

            const type: "image" | "pdf" = uploadData.type === "pdf" ? "pdf" : "image";
            await sendMessage(uploadData.filename || file.name, type, uploadData.url);
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
                                    ? "Agent Online"
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
                                                ↓
                                            </button>
                                        </div>
                                    </div>
                                ) : msg.type === "pdf" && msg.mediaUrl ? (
                                    <div className="flex items-center gap-2 px-4 py-3">
                                        <span className="text-2xl">📄</span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium truncate max-w-[140px]">{msg.body}</p>
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
