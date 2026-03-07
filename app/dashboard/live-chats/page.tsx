"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MessageSquare, ChevronRight, Clock, Trash2 } from "lucide-react";

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

function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export default function LiveChatsPage() {
    const [conversations, setConversations] = useState<ConversationPreview[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchConversations = useCallback(async () => {
        try {
            const res = await fetch("/api/chat/conversations");
            if (res.ok) setConversations(await res.json());
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, [fetchConversations]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Prevent navigating to the chat

        if (!window.confirm("Are you sure you want to permanently delete this conversation and all its files? This action cannot be undone.")) {
            return;
        }

        try {
            const res = await fetch(`/api/chat/conversations/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                // Remove from local state immediately
                setConversations((prev) => prev.filter((c) => c.id !== id));
            } else {
                alert("Failed to delete conversation.");
            }
        } catch (error) {
            console.error("Error deleting conversation:", error);
            alert("An error occurred while deleting.");
        }
    };

    if (loading) {
        return (
            <div className="space-y-3 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 rounded-xl bg-neutral-100" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold text-neutral-900 font-schibsted">Live Chats</h1>
                <p className="text-sm text-neutral-500 mt-0.5">
                    All visitor conversations across your chat widgets. Auto-refreshes every 10s.
                </p>
            </div>

            {conversations.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-neutral-200 rounded-xl">
                    <MessageSquare className="size-10 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-700 font-medium">No conversations yet</p>
                    <p className="text-sm text-neutral-400 mt-1 mb-5">
                        When visitors use your chat widgets, conversations will appear here.
                    </p>
                    <Link
                        href="/dashboard/chat-widgets"
                        className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Create a Widget →
                    </Link>
                </div>
            ) : (
                <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                    <ul className="divide-y divide-neutral-100">
                        {conversations.map((conv) => (
                            <li key={conv.id}>
                                <Link
                                    href={`/dashboard/live-chats/${conv.id}`}
                                    className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors group"
                                >
                                    {/* Color dot */}
                                    <div
                                        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-sm"
                                        style={{ background: conv.widget?.accentColor || "#0ea5e9" }}
                                    >
                                        {conv.widget?.domain?.charAt(0).toUpperCase() || "V"}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-neutral-900 text-sm truncate">
                                                {conv.widget?.domain || "Unknown domain"}
                                            </span>
                                            <span
                                                className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${conv.status === "open"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-neutral-100 text-neutral-500"
                                                    }`}
                                            >
                                                {conv.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-neutral-500 truncate mt-0.5">
                                            {conv.lastMessage ? (
                                                <>
                                                    <span className="text-neutral-400 text-xs">
                                                        {conv.lastMessage.sender === "agent" ? "You: " : "Visitor: "}
                                                    </span>
                                                    {conv.lastMessage.body}
                                                </>
                                            ) : (
                                                <span className="text-neutral-400 italic">No messages</span>
                                            )}
                                        </p>
                                        {conv.visitorPage && (
                                            <p className="text-xs text-neutral-400 truncate mt-0.5" title={conv.visitorPage}>
                                                📍 {conv.visitorPage}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1 text-xs text-neutral-400">
                                            <Clock size={11} />
                                            {timeAgo(conv.lastMessageAt)}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <button
                                                onClick={(e) => handleDelete(e, conv.id)}
                                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete conversation"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <ChevronRight
                                                size={16}
                                                className="text-neutral-300 group-hover:text-neutral-500 transition-colors hidden sm:block"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
