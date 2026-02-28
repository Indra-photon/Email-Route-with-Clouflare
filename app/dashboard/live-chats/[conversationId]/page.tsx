"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";

interface ChatMessage {
    id: string;
    sender: "visitor" | "agent";
    body: string;
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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchConversation = useCallback(async () => {
        try {
            const res = await fetch(`/api/chat/conversations/${conversationId}`);
            if (res.ok) {
                const d = await res.json();
                setData(d);
            }
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, [conversationId]);

    useEffect(() => {
        fetchConversation();
        const interval = setInterval(fetchConversation, 5000);
        return () => clearInterval(interval);
    }, [fetchConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [data?.messages]);

    const sendReply = async () => {
        const text = reply.trim();
        if (!text || sending) return;
        setSending(true);
        const optimisticId = "temp_" + Date.now();
        setData((prev) =>
            prev
                ? {
                    ...prev,
                    messages: [
                        ...prev.messages,
                        { id: optimisticId, sender: "agent", body: text, createdAt: new Date().toISOString() },
                    ],
                }
                : prev
        );
        setReply("");
        try {
            const res = await fetch(`/api/chat/conversations/${conversationId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
            });
            if (!res.ok) throw new Error("Failed");
            const result = await res.json();
            setData((prev) =>
                prev
                    ? {
                        ...prev,
                        messages: prev.messages.map((m) =>
                            m.id === optimisticId ? result.message : m
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
                <div className="min-w-0">
                    <p className="font-semibold text-neutral-900 text-sm">
                        {data.widget?.domain || "Unknown"}
                    </p>
                    <p className="text-xs text-neutral-400 truncate" title={data.visitorPage}>
                        Visitor · {data.visitorPage || "unknown page"} · started {timeAgo(data.createdAt)}
                    </p>
                </div>
                <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${data.status === "open"
                            ? "bg-green-100 text-green-700"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                >
                    {data.status}
                </span>
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
                                className={`rounded-2xl px-4 py-2.5 ${msg.sender === "agent"
                                        ? "rounded-tr-sm text-white"
                                        : "rounded-tl-sm bg-neutral-100 text-neutral-800"
                                    }`}
                                style={msg.sender === "agent" ? { background: accent } : undefined}
                            >
                                <p className="text-sm leading-relaxed">{msg.body}</p>
                            </div>
                            <p className={`text-[10px] mt-1 text-neutral-400 ${msg.sender === "agent" ? "text-right" : ""}`}>
                                {msg.sender === "agent" ? "You · " : "Visitor · "}
                                {timeAgo(msg.createdAt)}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Reply Box */}
            <div className="border-t border-neutral-200 pt-4 flex-shrink-0">
                <div className="flex items-end gap-3 bg-white border border-neutral-200 rounded-xl px-4 py-3 focus-within:border-neutral-300 focus-within:ring-2 focus-within:ring-sky-500/10 transition-all">
                    <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a reply… (Enter to send)"
                        rows={2}
                        className="flex-1 resize-none text-sm text-neutral-800 placeholder-neutral-400 outline-none bg-transparent max-h-40 overflow-auto"
                    />
                    <button
                        onClick={sendReply}
                        disabled={!reply.trim() || sending}
                        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: accent }}
                        aria-label="Send reply"
                    >
                        <Send size={15} />
                    </button>
                </div>
                <p className="text-xs text-neutral-400 mt-1.5">
                    Reply is delivered instantly to the visitor via Render SSE.
                </p>
            </div>
        </div>
    );
}
