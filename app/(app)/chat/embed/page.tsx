"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  IconMessageChatbot,
  IconRobot,
  IconSend,
  IconPaperclip,
  IconLoader2,
  IconX,
} from "@tabler/icons-react";

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

const EASE_OUT_QUART: [number, number, number, number] = [0.165, 0.84, 0.44, 1];

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
  const [agentTyping, setAgentTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const agentTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const conversationIdRef = useRef<string | null>(null);

  const shouldReduceMotion = useReducedMotion();
  const renderServerUrl = process.env.NEXT_PUBLIC_RENDER_CHAT_SERVER_URL || "";

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setChatKey(params.get("key") || "");
    setVisitorId(params.get("vid") || "");
    setVisitorPage(params.get("page") || "");
  }, []);

  const fetchInitialMessages = useCallback(
    async (key: string, vid: string, cid: string) => {
      if (!key || !vid || !cid) return;
      try {
        const res = await fetch(
          `/api/chat/messages?key=${encodeURIComponent(key)}&cid=${encodeURIComponent(cid)}&vid=${encodeURIComponent(vid)}`,
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.messages?.length > 0)
          setMessages(data.messages as ChatMessage[]);
        if (data.widgetConfig) setWidgetConfig(data.widgetConfig);
      } catch {
        /* silent */
      }
    },
    [],
  );

  const lookupActiveConversation = useCallback(
    async (key: string, vid: string) => {
      if (!key || !vid) return;
      try {
        const res = await fetch(
          `/api/chat/messages?key=${encodeURIComponent(key)}&vid=${encodeURIComponent(vid)}`,
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.widgetConfig) setWidgetConfig(data.widgetConfig);
        if (data.conversationId) setConversationId(data.conversationId);
      } catch {
        /* silent */
      }
    },
    [],
  );

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
      socket.emit("join", {
        key: chatKey,
        cid: conversationIdRef.current || undefined,
        visitorId,
        role: "visitor",
      });
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
      setAgentOnline(false);
    });
    socket.on("new_message", (msg: ChatMessage) => {
      if (msg.sender === "visitor") return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });
    socket.on(
      "typing",
      ({ role, isTyping }: { role: string; isTyping: boolean }) => {
        if (role === "agent") {
          setAgentTyping(isTyping);
          if (isTyping) {
            if (agentTypingTimeoutRef.current)
              clearTimeout(agentTypingTimeoutRef.current);
            agentTypingTimeoutRef.current = setTimeout(
              () => setAgentTyping(false),
              5000,
            );
          }
        }
      },
    );
    socket.on(
      "agent_status",
      ({ online, count }: { online: boolean; count: number }) => {
        setAgentOnline(online);
      },
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [chatKey, visitorId, renderServerUrl]);

  useEffect(() => {
    if (!chatKey || !visitorId) return;
    lookupActiveConversation(chatKey, visitorId);
  }, [chatKey, visitorId, lookupActiveConversation]);

  useEffect(() => {
    if (!conversationId || !chatKey || !visitorId) return;
    fetchInitialMessages(chatKey, visitorId, conversationId);
    if (isConnected) {
      socketRef.current?.emit("join", {
        key: chatKey,
        cid: conversationId,
        visitorId,
        role: "visitor",
      });
    }
  }, [conversationId, chatKey, visitorId, isConnected, fetchInitialMessages]);

  useEffect(() => {
    if (!chatKey || !renderServerUrl) return;
    const checkPresence = async () => {
      try {
        const res = await fetch(
          `${renderServerUrl}/presence?key=${encodeURIComponent(chatKey)}`,
        );
        if (!res.ok) return;
        const data = await res.json();
        setAgentOnline(data.online);
      } catch {
        /* silent */
      }
    };
    checkPresence();
    const interval = setInterval(checkPresence, 8000);
    return () => clearInterval(interval);
  }, [chatKey, renderServerUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, agentTyping]);

  useEffect(() => {
    if (conversationId) {
      window.parent?.postMessage(
        { type: "CW_CONVERSATION_ID", conversationId },
        "*",
      );
    }
  }, [conversationId]);

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

  const sendMessage = useCallback(
    async (
      text: string,
      type: "text" | "image" | "pdf" = "text",
      mediaUrl: string = "",
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
            socketId: socketRef.current?.id,
          }),
        });
        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        const savedCid = data.conversationId;
        const savedMsgId = data.message?.id || data.messageId || optimisticId;

        if (!conversationId && savedCid) {
          setConversationId(savedCid);
          try {
            window.parent.postMessage(
              { type: "CW_CONVERSATION_ID", conversationId: savedCid },
              "*",
            );
          } catch {
            /* cross-origin safeguard */
          }
        }

        setMessages((prev) => {
          const mapped = prev.map((m) =>
            m.id === optimisticId ? { ...m, id: savedMsgId } : m,
          );
          const seen = new Set<string>();
          return mapped.filter((m) => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
          });
        });

        const activeCid = savedCid || conversationId;
        if (activeCid && socketRef.current?.connected) {
          socketRef.current.emit("join", {
            key: chatKey,
            cid: activeCid,
            visitorId,
            role: "visitor",
          });
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
    },
    [
      isSending,
      chatKey,
      visitorId,
      conversationId,
      visitorPage,
      emitTypingStop,
    ],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.trim());
    }
  };

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
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const accent = widgetConfig.accentColor || "#0ea5e9";

  const bubbleVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 8, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: EASE_OUT_QUART },
    },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  const typingDotVariants = {
    animate: (i: number) => ({
      y: shouldReduceMotion ? 0 : [0, -4, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: i * 0.15,
      },
    }),
  };

  return (
    <div
      style={{
        fontFamily:
          "var(--font-schibsted-grotesk, 'Schibsted Grotesk', system-ui, sans-serif)",
      }}
      className="flex flex-col h-screen bg-neutral-50"
    >
      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: EASE_OUT_QUART }}
        style={{
          background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
        }}
        className="flex items-center gap-3 px-4 py-3 shadow-sm flex-shrink-0"
      >
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <IconMessageChatbot size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm tracking-tight leading-tight">
            Live Support
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: agentOnline ? "#4ade80" : "rgba(255,255,255,0.4)",
              }}
            />
            <span className="text-white/60 text-[10px] font-medium tracking-wide uppercase">
              {agentOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Welcome message */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT_QUART, delay: 0.1 }}
          className="flex justify-start items-end gap-2"
        >
          <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center bg-neutral-200">
            <IconRobot size={15} className="text-neutral-500" />
          </div>
          <div className="max-w-[80%] bg-white rounded-2xl rounded-tl-sm px-4 py-2.5" style={{ boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)" }}>
            <p className="text-neutral-800 text-sm font-medium leading-relaxed">
              {widgetConfig.welcomeMessage}
            </p>
          </div>
        </motion.div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              variants={bubbleVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`flex items-end gap-2 ${msg.sender === "visitor" ? "justify-end" : "justify-start"}`}
            >
              {/* Agent avatar — fixed 28px, aligned to bottom of bubble */}
              {msg.sender === "agent" && (
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center bg-neutral-200 self-end mb-5">
                  <IconRobot size={15} className="text-neutral-500" />
                </div>
              )}

              <div className="max-w-[80%]">
                <div
                  className={`rounded-2xl overflow-hidden ${
                    msg.sender === "visitor"
                      ? "rounded-tr-sm text-white"
                      : "rounded-tl-sm bg-white text-neutral-800"
                  }`}
                  style={
                    msg.sender === "visitor"
                      ? { background: accent }
                      : { boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)" }
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
                        <span className="text-xs opacity-70 truncate">
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
                        <p className="text-xs font-medium truncate max-w-[140px]">
                          {msg.body}
                        </p>
                        <button
                          onClick={async () => {
                            try {
                              const proxyUrl = `/api/chat/download-proxy?url=${encodeURIComponent(msg.mediaUrl)}&filename=${encodeURIComponent(msg.body || "file.pdf")}`;
                              const response = await fetch(proxyUrl);
                              const blob = await response.blob();
                              const blobUrl = window.URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.style.display = "none";
                              a.href = blobUrl;
                              a.download = msg.body || "file.pdf";
                              document.body.appendChild(a);
                              a.click();
                              setTimeout(() => {
                                document.body.removeChild(a);
                                window.URL.revokeObjectURL(blobUrl);
                              }, 100);
                            } catch (err) {
                              console.error("Failed to download PDF", err);
                            }
                          }}
                          className="text-xs underline opacity-70 hover:opacity-100 cursor-pointer bg-transparent border-none p-0"
                        >
                          Download PDF
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-2.5">
                      <p className="text-sm font-medium leading-relaxed">
                        {msg.body}
                      </p>
                    </div>
                  )}
                </div>
                <p
                  className={`text-[10px] font-medium mt-1 ${msg.sender === "visitor" ? "text-neutral-400 text-right" : "text-neutral-400"}`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Agent typing indicator */}
        <AnimatePresence>
          {agentTyping && (
            <motion.div
              key="typing"
              initial={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18, ease: EASE_OUT_QUART }}
              className="flex justify-start items-end gap-2"
            >
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center bg-neutral-200">
                <IconRobot size={15} className="text-neutral-500" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1" style={{ boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)" }}>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={typingDotVariants}
                    animate="animate"
                    className="w-1.5 h-1.5 rounded-full bg-neutral-400 block"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE_OUT_QUART }}
              className="flex justify-center items-center gap-1.5"
            >
              <span className="text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full flex items-center gap-1">
                <IconX size={11} />
                {error}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 bg-neutral-50 flex-shrink-0" style={{ boxShadow: "0px -1px 0px 0px rgba(0,0,0,0.04)" }}>
        <div
          className="flex items-end gap-2 bg-white rounded-2xl px-3 py-2 transition-all"
          style={{ boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)" }}
        >
          {/* File attach button */}
          <motion.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadProgress || isSending}
            whileTap={shouldReduceMotion ? {} : { scale: 0.88 }}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-40"
            aria-label="Attach file"
            title="Send image or PDF"
          >
            {uploadProgress ? (
              <IconLoader2 size={16} className="animate-spin" />
            ) : (
              <IconPaperclip size={16} />
            )}
          </motion.button>

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
            className="flex-1 bg-transparent text-sm font-medium text-neutral-800 placeholder-neutral-400 resize-none outline-none py-0.5 max-h-28 overflow-auto"
            style={{ lineHeight: "1.5" }}
            disabled={isSending || uploadProgress}
          />

          <motion.button
            onClick={() => sendMessage(input.trim())}
            disabled={!input.trim() || isSending || uploadProgress}
            whileTap={shouldReduceMotion ? {} : { scale: 0.88 }}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: accent }}
            aria-label="Send"
          >
            <IconSend
              size={15}
              className="text-white"
              style={{ transform: "translateX(1px)" }}
            />
          </motion.button>
        </div>
        <p className="text-center text-[10px] font-semibold tracking-wide uppercase text-neutral-300 mt-2">
          Powered by syncsupport
        </p>
      </div>
    </div>
  );
}
