"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface ChatMessage {
    id: string;
    sender: "visitor" | "agent";
    body: string;
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
    const [error, setError] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const lastFetchRef = useRef<string | null>(null);
    const renderServerUrl = process.env.NEXT_PUBLIC_RENDER_CHAT_SERVER_URL || "";

    // Parse URL params
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

    // Fetch/poll for messages from Vercel (fallback) + SSE from Render (real-time)
    const fetchMessages = useCallback(async () => {
        if (!chatKey || !visitorId || !conversationId) return;
        try {
            const url = `/api/chat/messages?key=${encodeURIComponent(chatKey)}&cid=${encodeURIComponent(conversationId)}&vid=${encodeURIComponent(visitorId)}${lastFetchRef.current ? `&after=${encodeURIComponent(lastFetchRef.current)}` : ""}`;
            const res = await fetch(url);
            if (!res.ok) return;
            const data = await res.json();
            if (data.messages?.length > 0) {
                setMessages((prev) => {
                    const existingIds = new Set(prev.map((m) => m.id));
                    const newMsgs = data.messages.filter((m: ChatMessage) => !existingIds.has(m.id));
                    if (newMsgs.length === 0) return prev;
                    lastFetchRef.current = newMsgs[newMsgs.length - 1].createdAt;
                    return [...prev, ...newMsgs];
                });
            }
            if (data.widgetConfig) {
                setWidgetConfig(data.widgetConfig);
            }
        } catch {
            // silent
        }
    }, [chatKey, visitorId, conversationId]);

    // SSE from Render server for real-time agent replies
    useEffect(() => {
        if (!conversationId || !chatKey || !renderServerUrl) return;
        let es: EventSource | null = null;
        let retryTimeout: ReturnType<typeof setTimeout>;

        function connect() {
            const url = `${renderServerUrl}/live?key=${encodeURIComponent(chatKey)}&cid=${encodeURIComponent(conversationId!)}`;
            es = new EventSource(url);

            es.onopen = () => setIsConnected(true);

            es.onmessage = (e) => {
                try {
                    const msg = JSON.parse(e.data) as ChatMessage;
                    if (msg.sender === "agent") {
                        setMessages((prev) => {
                            if (prev.some((m) => m.id === msg.id)) return prev;
                            return [...prev, msg];
                        });
                    }
                } catch {
                    // ignore heartbeats
                }
            };

            es.onerror = () => {
                setIsConnected(false);
                es?.close();
                retryTimeout = setTimeout(connect, 5000);
            };
        }

        connect();

        return () => {
            es?.close();
            clearTimeout(retryTimeout);
        };
    }, [conversationId, chatKey, renderServerUrl]);

    // Polling fallback every 5s (catches up if SSE missed anything)
    useEffect(() => {
        if (!conversationId) return;
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [fetchMessages, conversationId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Tell parent widget.js the conversationId (so it can persist in localStorage)
    useEffect(() => {
        if (conversationId) {
            window.parent?.postMessage(
                { type: "CW_CONVERSATION_ID", conversationId },
                "*"
            );
        }
    }, [conversationId]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || isSending || !chatKey || !visitorId) return;

        setIsSending(true);
        const optimisticId = "temp_" + Date.now();
        const optimistic: ChatMessage = {
            id: optimisticId,
            sender: "visitor",
            body: text,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimistic]);
        setInput("");

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
                }),
            });

            if (!res.ok) {
                setError("Failed to send. Please try again.");
                setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
                setInput(text);
            } else {
                const data = await res.json();
                if (!conversationId && data.conversationId) {
                    setConversationId(data.conversationId);
                }
                // Replace optimistic with real ID
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === optimisticId
                            ? { ...m, id: data.messageId || m.id }
                            : m
                    )
                );
                lastFetchRef.current = new Date().toISOString();
                setError(null);
            }
        } catch {
            setError("Network error. Please try again.");
            setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
            setInput(text);
        } finally {
            setIsSending(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
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
                className="flex items-center gap-3 px-4 py-3 shadow-sm"
            >
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                    💬
                </div>
                <div>
                    <p className="text-white font-semibold text-sm leading-tight">Live Support</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: isConnected ? "#4ade80" : "#fbbf24" }}
                        />
                        <span className="text-white/80 text-xs">
                            {isConnected ? "Connected" : "Connecting…"}
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
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.sender === "visitor"
                                    ? "rounded-tr-sm text-white"
                                    : "rounded-tl-sm bg-gray-100 text-gray-800"
                                }`}
                            style={
                                msg.sender === "visitor"
                                    ? { background: accent }
                                    : undefined
                            }
                        >
                            <p className="text-sm leading-relaxed">{msg.body}</p>
                            <p
                                className={`text-[10px] mt-1 ${msg.sender === "visitor" ? "text-white/60 text-right" : "text-gray-400"
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
            <div className="px-4 py-3 border-t border-gray-100 bg-white">
                <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 px-3 py-2 focus-within:border-gray-300 focus-within:ring-2 transition-all"
                    style={{ "--tw-ring-color": `${accent}33` } as React.CSSProperties}
                >
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message…"
                        rows={1}
                        className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none py-0.5 max-h-28 overflow-auto"
                        style={{ lineHeight: "1.5" }}
                        disabled={isSending}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isSending}
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
