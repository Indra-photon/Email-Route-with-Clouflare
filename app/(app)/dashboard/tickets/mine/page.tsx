// "use client";

// import { useEffect, useRef, useState, useCallback } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { ArrowLeft, RefreshCw, Send, Inbox, X } from "lucide-react";
// import { toast } from "sonner";
// import AnimatedDropdown, {
//   DropdownOption,
// } from "@/components/ui/AnimatedDropdown";
// import { Paragraph } from "@/components/Paragraph";
// import { Heading } from "@/components/Heading";
// import { AnimatePresence, motion } from "motion/react";

// // ── Types ─────────────────────────────────────────────────────────────────────

// interface Ticket {
//   id: string;
//   from: string;
//   fromName: string;
//   subject: string;
//   status: string;
//   receivedAt: string;
//   repliedAt?: string | null;
//   assignedTo?: string;
//   assignedToEmail?: string;
//   assignedToName?: string;
//   claimedAt?: string;
// }

// interface ConversationMessage {
//   id: string;
//   direction: "inbound" | "outbound";
//   from: string;
//   fromName: string;
//   to: string;
//   subject: string;
//   textBody: string;
//   attachments: Array<{
//     id: string;
//     filename: string;
//     content_type: string;
//     size?: number;
//   }>;
//   createdAt: string;
//   receivedAt: string;
// }

// interface ThreadDetail {
//   id: string;
//   from: string;
//   fromName: string;
//   to: string;
//   subject: string;
//   status: string;
//   assignedTo?: string;
//   assignedToEmail?: string;
//   assignedToName?: string;
//   claimedAt?: string;
//   receivedAt: string;
//   repliedAt?: string | null;
// }

// // ── Helpers ───────────────────────────────────────────────────────────────────

// function timeAgo(date: string) {
//   const diff = Date.now() - new Date(date).getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return "just now";
//   if (mins < 60) return `${mins}m ago`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs}h ago`;
//   if (hrs < 48) return "yesterday";
//   const days = Math.floor(hrs / 24);
//   if (days < 7) return `${days}d ago`;
//   return new Date(date).toLocaleDateString();
// }

// function formatTime(date: string) {
//   return new Date(date).toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// function formatDateLabel(date: string) {
//   const d = new Date(date);
//   const today = new Date();
//   const yesterday = new Date(today);
//   yesterday.setDate(today.getDate() - 1);
//   if (d.toDateString() === today.toDateString()) return "Today";
//   if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
//   return d.toLocaleDateString([], {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// }

// function senderInitial(name: string, email: string) {
//   return (name || email || "?").charAt(0).toUpperCase();
// }

// const STATUS_CONFIG: Record<
//   string,
//   { label: string; className: string; dot: string }
// > = {
//   open: {
//     label: "Open",
//     className: "bg-amber-100 text-amber-700",
//     dot: "bg-amber-400",
//   },
//   in_progress: {
//     label: "In Progress",
//     className: "bg-sky-100 text-sky-700",
//     dot: "bg-sky-400",
//   },
//   waiting: {
//     label: "Waiting",
//     className: "bg-purple-100 text-purple-700",
//     dot: "bg-purple-400",
//   },
//   resolved: {
//     label: "Resolved",
//     className: "bg-green-100 text-green-700",
//     dot: "bg-green-400",
//   },
// };

// function StatusBadge({ status }: { status: string }) {
//   const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open;
//   return (
//     <Badge
//       variant="secondary"
//       className={`${cfg.className} font-schibsted font-medium text-xs`}
//     >
//       {cfg.label}
//     </Badge>
//   );
// }

// // ── Main Component ────────────────────────────────────────────────────────────

// export default function MyTicketsPage() {
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentFilter, setCurrentFilter] = useState("all");
//   const [selectedDomain, setSelectedDomain] = useState("all");
//   const [dateRange, setDateRange] = useState("7d");
//   const [domains, setDomains] = useState<DropdownOption[]>([]);

//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [thread, setThread] = useState<ThreadDetail | null>(null);
//   const [messages, setMessages] = useState<ConversationMessage[]>([]);
//   const [convLoading, setConvLoading] = useState(false);

//   const [reply, setReply] = useState("");
//   const [sending, setSending] = useState(false);
//   const [convRefreshing, setConvRefreshing] = useState(false);

//   // Mobile: show list or chat
//   const [mobileView, setMobileView] = useState<"list" | "chat">("list");

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const ticketListRef = useRef<HTMLDivElement>(null);
//   const ticketItemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
//   const [clipPath, setClipPath] = useState("inset(0 0 100% 0 round 0px)");

//   // ── Fetch ticket list ────────────────────────────────────────────────────
//   const fetchTickets = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/emails/tickets/mine");
//       if (!res.ok) throw new Error();
//       const data = await res.json();
//       setTickets(data.tickets || []);
//       const domRes = await fetch("/api/domains");
//       if (domRes.ok) {
//         const domData = await domRes.json();
//         setDomains([
//           { value: "all", label: "All Domains" },
//           ...domData.map((d: any) => ({ value: d.id, label: d.domain })),
//         ]);
//       }
//     } catch {
//       toast.error("Failed to load tickets");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchTickets();
//   }, [fetchTickets]);

//   // ── Fetch conversation when ticket selected ──────────────────────────────
//   const fetchConversation = useCallback(async (id: string) => {
//     setConvLoading(true);
//     setThread(null);
//     setMessages([]);
//     try {
//       const res = await fetch(`/api/emails/threads/${id}`);
//       if (!res.ok) throw new Error();
//       const data = await res.json();
//       setThread(data.thread);
//       setMessages(data.messages);
//     } catch {
//       toast.error("Failed to load conversation");
//     } finally {
//       setConvLoading(false);
//     }
//   }, []);

//   const updateClipPath = useCallback((id: string) => {
//     const container = ticketListRef.current;
//     const item = ticketItemRefs.current.get(id);
//     if (!container || !item) return;

//     const containerTop = container.getBoundingClientRect().top;
//     const itemTop = item.getBoundingClientRect().top;
//     const offsetTop = itemTop - containerTop + container.scrollTop;
//     const offsetBottom = container.offsetHeight - offsetTop - item.offsetHeight;

//     setClipPath(`inset(${offsetTop}px 0 ${offsetBottom}px 0 round 0px)`);
//   }, []);

//   const selectTicket = (id: string) => {
//     setSelectedId(id);
//     setMobileView("chat");
//     fetchConversation(id);
//     updateClipPath(id);
//   };

//   // ── Silently refresh the right-side conversation (no full-screen skeleton) ──
//   const refreshConversation = useCallback(async () => {
//     if (!selectedId) return;
//     setConvRefreshing(true);
//     try {
//       const res = await fetch(`/api/emails/threads/${selectedId}`);
//       if (!res.ok) throw new Error();
//       const data = await res.json();
//       setThread(data.thread);
//       setMessages(data.messages);
//     } catch {
//       // silent fail — don't toast on background auto-refresh
//     } finally {
//       setConvRefreshing(false);
//     }
//   }, [selectedId]);

//   // ── Auto-refresh right panel every 10s when a conversation is open ────────
//   useEffect(() => {
//     if (!selectedId) return;
//     const interval = setInterval(refreshConversation, 60000);
//     return () => clearInterval(interval);
//   }, [selectedId, refreshConversation]);

//   // ── Scroll to bottom when messages change ────────────────────────────────
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({
//       behavior: "smooth",
//       block: "nearest",
//     });
//   }, [messages]);

//   // ── Send reply ───────────────────────────────────────────────────────────
//   const sendReply = async () => {
//     if (!reply.trim() || !selectedId || sending) return;
//     setSending(true);
//     const text = reply.trim();
//     setReply("");

//     // Optimistic message
//     const optimisticId = "temp_" + Date.now();
//     const now = new Date().toISOString();
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: optimisticId,
//         direction: "outbound",
//         from: thread?.to || "",
//         fromName: "You",
//         to: thread?.from || "",
//         subject: thread?.subject || "",
//         textBody: text,
//         attachments: [],
//         createdAt: now,
//         receivedAt: now,
//       },
//     ]);

//     try {
//       const res = await fetch("/api/emails/reply", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ threadId: selectedId, replyText: text }),
//       });
//       if (!res.ok) throw new Error();
//       toast.success("Reply sent");
//       // Refresh conversation to get real saved message
//       const convRes = await fetch(`/api/emails/threads/${selectedId}`);
//       if (convRes.ok) {
//         const data = await convRes.json();
//         setThread(data.thread);
//         setMessages(data.messages);
//         // Also refresh ticket list to update repliedAt / status
//         fetchTickets();
//       }
//     } catch {
//       toast.error("Failed to send reply");
//       setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
//       setReply(text);
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendReply();
//     }
//   };

//   // ── Update ticket status ─────────────────────────────────────────────────
//   const updateStatus = async (status: string) => {
//     if (!selectedId || !thread) return;
//     try {
//       const res = await fetch("/api/emails/update-status", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ threadId: selectedId, status }),
//       });
//       if (!res.ok) throw new Error();
//       setThread((prev) => (prev ? { ...prev, status } : prev));
//       setTickets((prev) =>
//         prev.map((t) => (t.id === selectedId ? { ...t, status } : t)),
//       );
//       toast.success(`Marked as ${STATUS_CONFIG[status]?.label || status}`);
//     } catch {
//       toast.error("Failed to update status");
//     }
//   };

//   // ── Filter ───────────────────────────────────────────────────────────────
//   const filtered =
//     currentFilter === "all"
//       ? tickets
//       : tickets.filter((t) => t.status === currentFilter);

//   const statusCounts = {
//     all: tickets.length,
//     open: tickets.filter((t) => t.status === "open").length,
//     in_progress: tickets.filter((t) => t.status === "in_progress").length,
//     waiting: tickets.filter((t) => t.status === "waiting").length,
//     resolved: tickets.filter((t) => t.status === "resolved").length,
//   };

//   useEffect(() => {
//     if (!selectedId) return;
//     // Small timeout to ensure refs are populated after render
//     const t = setTimeout(() => updateClipPath(selectedId), 50);
//     return () => clearTimeout(t);
//   }, [selectedId, filtered, updateClipPath]);

//   // ── Date-separator grouping ───────────────────────────────────────────────
//   function renderMessages() {
//     const nodes: React.ReactNode[] = [];
//     let lastDateLabel = "";

//     messages.forEach((msg) => {
//       const dateLabel = formatDateLabel(msg.createdAt || msg.receivedAt);
//       if (dateLabel !== lastDateLabel) {
//         lastDateLabel = dateLabel;
//         nodes.push(
//           <div key={`sep-${msg.id}`} className="flex items-center gap-3 my-4">
//             <div className="flex-1 h-px bg-neutral-200" />
//             <span className="text-xs text-neutral-400 font-schibsted font-medium px-2 whitespace-nowrap">
//               {dateLabel}
//             </span>
//             <div className="flex-1 h-px bg-neutral-200" />
//           </div>,
//         );
//       }

//       const isOut = msg.direction === "outbound";
//       nodes.push(
//         <div
//           key={msg.id}
//           className={`flex ${isOut ? "justify-end" : "justify-start"}`}
//         >
//           <div className="max-w-[72%]">
//             <div
//               className={`rounded-2xl px-4 py-2.5 ${
//                 isOut
//                   ? "rounded-tr-sm bg-sky-500 text-white"
//                   : "rounded-tl-sm bg-neutral-100 text-neutral-800"
//               }`}
//             >
//               <p className="text-sm leading-relaxed whitespace-pre-wrap">
//                 {msg.textBody}
//               </p>
//               {msg.attachments?.length > 0 && (
//                 <div className="mt-2 space-y-1">
//                   {msg.attachments.map((a) => (
//                     <div
//                       key={a.id}
//                       className={`flex items-center gap-2 text-xs rounded-lg px-2 py-1.5 ${
//                         isOut ? "bg-sky-600/40" : "bg-neutral-200"
//                       }`}
//                     >
//                       <span>📎</span>
//                       <span className="truncate font-medium">{a.filename}</span>
//                       {a.size && (
//                         <span className="opacity-60 shrink-0">
//                           ({Math.round(a.size / 1024)}KB)
//                         </span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <p
//               className={`text-[10px] mt-1 text-neutral-400 font-schibsted ${isOut ? "text-right" : ""}`}
//             >
//               {isOut ? "You" : msg.fromName || msg.from} ·{" "}
//               {formatTime(msg.createdAt || msg.receivedAt)}
//             </p>
//           </div>
//         </div>,
//       );
//     });

//     return nodes;
//   }

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <div className="flex h-full overflow-hidden bg-white border border-neutral-400 rounded-lg min-h-dvh">
//       {/* ── Left Panel: Ticket List ────────────────────────────────────── */}
//       <div
//         className={`flex flex-col w-full sm:w-[520px] flex-shrink-0 border-r border-neutral-400 ${
//           mobileView === "chat" ? "hidden sm:flex" : "flex"
//         }`}
//       >
//         {/* ── Page Header ── */}
//         <div className="p-4 border-b border-neutral-100 flex-shrink-0">
//           <div className="flex items-start justify-between mb-3">
//             <div>
//               <Heading variant="muted" className="font-bold text-neutral-900">
//                 My Tickets
//               </Heading>
//               <Paragraph variant="default" className="text-neutral-600 mt-1">
//                 Your support queue. Filter by domain or date to find what you
//                 need.
//               </Paragraph>
//             </div>
//           </div>

//           {/* Controls row */}
//           <div className="flex items-center gap-2 flex-wrap">
//             <AnimatedDropdown
//               options={domains}
//               value={selectedDomain}
//               onChange={setSelectedDomain}
//               placeholder="All Domains"
//               width="w-44"
//             />
//             <AnimatedDropdown
//               options={[
//                 { value: "24h", label: "Last 24 hrs" },
//                 { value: "7d", label: "Last 7 days" },
//                 { value: "15d", label: "Last 15 days" },
//               ]}
//               value={dateRange}
//               onChange={setDateRange}
//               width="w-36"
//             />
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={fetchTickets}
//               disabled={loading}
//               className="h-8 w-8"
//               title="Refresh"
//             >
//               <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
//             </Button>
//           </div>
//         </div>

//         <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-b from-sky-800 to-cyan-600 border-b border-neutral-100 overflow-x-auto">
//           {[
//             { key: "all", label: "All" },
//             { key: "open", label: "Open" },
//             { key: "in_progress", label: "In Progress" },
//             { key: "waiting", label: "Waiting" },
//             { key: "resolved", label: "Resolved" },
//           ].map((f) => (
//             <button
//               key={f.key}
//               onClick={() => setCurrentFilter(f.key)}
//               style={{ WebkitTapHighlightColor: "transparent" }}
//               className="relative rounded-lg px-2.5 py-1 text-xs font-schibsted font-medium cursor-pointer whitespace-nowrap"
//             >
//               {currentFilter === f.key && (
//                 <motion.div
//                   layoutId="filter-bubble"
//                   className="absolute inset-0 bg-sky-100 rounded-lg"
//                   style={{ borderRadius: 8 }}
//                   transition={{ type: "spring", bounce: 0.1, duration: 0.2 }}
//                 />
//               )}

//               <span
//                 className={`relative z-10 transition-colors duration-250 ${
//                   currentFilter === f.key ? "text-sky-800" : "text-neutral-100"
//                 }`}
//               >
//                 {f.label}
//                 <span className="ml-1">
//                   ({statusCounts[f.key as keyof typeof statusCounts]})
//                 </span>
//               </span>
//             </button>
//           ))}
//         </div>

//         {/* Ticket List */}
//         <div className="flex-1 overflow-y-auto">
//           {loading ? (
//             <div className="flex flex-col gap-3 p-4">
//               {[1, 2, 3].map((n) => (
//                 <div key={n} className="animate-pulse flex gap-3">
//                   <div className="w-9 h-9 rounded-full bg-neutral-200 flex-shrink-0" />
//                   <div className="flex-1 space-y-2">
//                     <div className="h-3 bg-neutral-200 rounded w-3/4" />
//                     <div className="h-3 bg-neutral-200 rounded w-1/2" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full text-center px-4">
//               <p className="text-sm text-neutral-400 font-schibsted">
//                 No tickets found
//               </p>
//             </div>
//           ) : (
//             <div
//               ref={ticketListRef}
//               className="relative divide-y divide-neutral-100"
//             >
//               {/* ── Base layer ── */}
//               {filtered.map((ticket) => {
//                 const cfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
//                 return (
//                   <button
//                     key={ticket.id}
//                     ref={(el) => {
//                       if (el) ticketItemRefs.current.set(ticket.id, el);
//                     }}
//                     onClick={() => selectTicket(ticket.id)}
//                     className="w-full text-left flex items-start gap-3 px-4 py-3 transition-colors hover:bg-neutral-50"
//                   >
//                     <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-bold flex-shrink-0 font-schibsted">
//                       {senderInitial(ticket.fromName, ticket.from)}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between gap-1">
//                         <p className="text-sm font-semibold text-neutral-900 font-schibsted truncate leading-tight">
//                           {ticket.fromName || ticket.from}
//                         </p>
//                         <span className="text-[10px] text-neutral-400 font-schibsted shrink-0">
//                           {timeAgo(ticket.receivedAt)}
//                         </span>
//                       </div>
//                       <p className="text-xs text-neutral-500 font-schibsted truncate mt-0.5 leading-tight">
//                         {ticket.subject}
//                       </p>
//                       <div className="mt-1.5 flex items-center gap-1.5">
//                         <span
//                           className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`}
//                         />
//                         <span
//                           className={`text-[10px] font-schibsted font-medium ${cfg.className.split(" ")[1]}`}
//                         >
//                           {cfg.label}
//                         </span>
//                       </div>
//                     </div>
//                   </button>
//                 );
//               })}

//               {/* ── Overlay layer (clipped) ── */}
//               <div
//                 className="absolute inset-0 overflow-hidden pointer-events-none"
//                 style={{
//                   clipPath,
//                   transition: "clip-path 0.15s ease",
//                 }}
//               >
//                 <div className="bg-sky-100 divide-y divide-sky-100">
//                   {filtered.map((ticket) => {
//                     const cfg =
//                       STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
//                     return (
//                       <div
//                         key={ticket.id}
//                         className="w-full text-left flex items-start gap-3 px-4 py-3"
//                       >
//                         <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-bold flex-shrink-0 font-schibsted">
//                           {senderInitial(ticket.fromName, ticket.from)}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center justify-between gap-1">
//                             <p className="text-sm font-semibold text-sky-900 font-schibsted truncate leading-tight">
//                               {ticket.fromName || ticket.from}
//                             </p>
//                             <span className="text-[10px] text-sky-400 font-schibsted shrink-0">
//                               {timeAgo(ticket.receivedAt)}
//                             </span>
//                           </div>
//                           <p className="text-xs text-sky-500 font-schibsted truncate mt-0.5 leading-tight">
//                             {ticket.subject}
//                           </p>
//                           <div className="mt-1.5 flex items-center gap-1.5">
//                             <span
//                               className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`}
//                             />
//                             <span
//                               className={`text-[10px] font-schibsted font-medium ${cfg.className.split(" ")[1]}`}
//                             >
//                               {cfg.label}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Right Panel: Conversation ──────────────────────────────────────── */}
//       <div className="hidden sm:flex flex-col flex-1 min-w-0">
//         {!selectedId ? (
//           /* Empty state */
//           <div className="flex flex-col items-center justify-center h-full text-center px-6">
//             <div className="w-14 h-14 rounded-full bg-sky-50 flex items-center justify-center mb-4">
//               <Send size={22} className="text-sky-400" />
//             </div>
//             <p className="text-base font-semibold text-neutral-700 font-schibsted">
//               Select a conversation
//             </p>
//             <p className="text-sm text-neutral-400 font-schibsted mt-1">
//               Click any ticket on the left to read and reply
//             </p>
//           </div>
//         ) : (
//           <>
//             {/* Conversation Header */}
//             <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 flex-shrink-0 bg-white">
//               {/* Back (mobile) */}
//               <button
//                 className="sm:hidden text-neutral-400 hover:text-neutral-700 transition-colors"
//                 onClick={() => setMobileView("list")}
//               >
//                 <ArrowLeft size={18} />
//               </button>

//               {thread && (
//                 <>
//                   {/* Avatar */}
//                   <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-bold flex-shrink-0 font-schibsted">
//                     {senderInitial(thread.fromName, thread.from)}
//                   </div>
//                   {/* Info */}
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-neutral-900 font-schibsted leading-tight truncate">
//                       {thread.fromName || thread.from}
//                     </p>
//                     <p className="text-[11px] text-neutral-400 font-schibsted truncate leading-tight">
//                       {thread.subject}
//                     </p>
//                   </div>
//                   {/* Status + change */}
//                   <div className="flex items-center gap-2 flex-shrink-0">
//                     <AnimatedDropdown
//                       options={[
//                         { value: "open", label: "Open" },
//                         { value: "in_progress", label: "In Progress" },
//                         { value: "waiting", label: "Waiting" },
//                         { value: "resolved", label: "Resolved" },
//                       ]}
//                       value={thread.status}
//                       onChange={(val) => updateStatus(val)}
//                       width="w-36"
//                       className="[&_button]:focus:ring-0 [&_button]:focus:outline-none [&_button]:focus:border-neutral-300"
//                     />
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={refreshConversation}
//                       disabled={convRefreshing}
//                       className="h-8 w-8"
//                       title="Refresh conversation"
//                     >
//                       <RefreshCw
//                         size={14}
//                         className={convRefreshing ? "animate-spin" : ""}
//                       />
//                     </Button>
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Messages */}
//             <motion.div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
//               <AnimatePresence>
//                 {/* {convLoading && (
//                   <div className="flex flex-col gap-3 pt-6">
//                     {[1, 2, 3].map((n) => (
//                       <div key={n} className={`flex ${n % 2 === 0 ? "justify-end" : "justify-start"}`}>
//                         <div className="animate-pulse h-10 w-48 rounded-2xl bg-neutral-200" />
//                       </div>
//                     ))}
//                   </div>
//                 )} */}
//                 {!convLoading && messages.length === 0 && (
//                   <div className="text-center text-sm text-neutral-400 py-8 font-schibsted">
//                     No messages yet.
//                   </div>
//                 )}
//                 {!convLoading && messages.length > 0 && (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.1, ease: "easeOut" }}
//                   >
//                     {renderMessages()}
//                   </motion.div>
//                 )}

//                 <div ref={messagesEndRef} />
//               </AnimatePresence>
//             </motion.div>

//             {/* Reply Box */}
//             <div className="border-t border-neutral-200 px-4 py-3 flex-shrink-0 bg-white">
//               <div className="flex items-end gap-2 bg-white border border-neutral-200 rounded-xl px-3 py-2 focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-500/10 transition-all">
//                 <textarea
//                   value={reply}
//                   onChange={(e) => setReply(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   placeholder="Type a reply… (Enter to send, Shift+Enter for new line)"
//                   rows={2}
//                   className="flex-1 resize-none text-sm text-neutral-800 placeholder-neutral-400 outline-none bg-transparent max-h-32 overflow-auto font-schibsted"
//                 />
//                 <button
//                   onClick={sendReply}
//                   disabled={!reply.trim() || sending}
//                   className="flex-shrink-0 w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-white transition-all hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed"
//                   aria-label="Send reply"
//                 >
//                   {sending ? (
//                     <RefreshCw size={14} className="animate-spin" />
//                   ) : (
//                     <Send size={14} />
//                   )}
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       <AnimatePresence>
//         {mobileView === "chat" && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               className="fixed inset-0 z-40 bg-black/20 sm:hidden"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.25 }}
//               onClick={() => {
//                 setMobileView("list");
//                 setSelectedId(null);
//               }}
//             />

//             {/* Sheet panel */}
//             <motion.div
//               className="fixed inset-x-0 bottom-0 z-50 h-[92vh] bg-white rounded-t-2xl flex flex-col sm:hidden"
//               initial={{ y: "100%" }}
//               animate={{ y: 0 }}
//               exit={{ y: "100%" }}
//               transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
//             >
//               {/* Handle + close */}
//               <div className="flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0">
//                 <div className="w-8 h-1 rounded-full bg-neutral-300 mx-auto absolute left-1/2 -translate-x-1/2" />
//                 <div className="flex-1" />
//                 <button
//                   onClick={() => {
//                     setMobileView("list");
//                     setSelectedId(null);
//                   }}
//                   className="w-7 h-7 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
//                 >
//                   <X size={14} className="text-neutral-500" />
//                 </button>
//               </div>

//               {/* Conversation goes here next */}
//               {selectedId && (
//                 <>
//                   {/* Conversation Header */}
//                   <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 flex-shrink-0 bg-white">
//                     {thread && (
//                       <>
//                         {/* Avatar */}
//                         <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-bold flex-shrink-0 font-schibsted">
//                           {senderInitial(thread.fromName, thread.from)}
//                         </div>
//                         {/* Info */}
//                         <div className="flex-1 min-w-0">
//                           <p className="text-[11px] font-semibold text-neutral-900 font-schibsted leading-tight truncate">
//                             {thread.fromName || thread.from}
//                           </p>
//                           <p className="text-[11px] text-neutral-400 font-schibsted truncate leading-tight">
//                             {thread.subject}
//                           </p>
//                         </div>
//                         {/* Status + change */}
//                         <div className="flex items-center gap-2 flex-shrink-0">
//                           <AnimatedDropdown
//                             options={[
//                               { value: "open", label: "Open" },
//                               { value: "in_progress", label: "In Progress" },
//                               { value: "waiting", label: "Waiting" },
//                               { value: "resolved", label: "Resolved" },
//                             ]}
//                             value={thread.status}
//                             onChange={(val) => updateStatus(val)}
//                             width="w-24"
//                             className="[&_button]:focus:ring-0 [&_button]:focus:outline-none [&_button]:focus:border-neutral-300"
//                           />
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={refreshConversation}
//                             disabled={convRefreshing}
//                             className="h-8 w-8"
//                             title="Refresh conversation"
//                           >
//                             <RefreshCw
//                               size={14}
//                               className={convRefreshing ? "animate-spin" : ""}
//                             />
//                           </Button>
//                         </div>
//                       </>
//                     )}
//                   </div>

//                   {/* Messages */}
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.25, delay: 0.4 }}
//                     className="flex-1 overflow-y-auto px-4 py-2 space-y-1"
//                   >
//                     {convLoading ? (
//                       <div className="flex flex-col gap-3 pt-6">
//                         {[1, 2, 3].map((n) => (
//                           <div
//                             key={n}
//                             className={`flex ${n % 2 === 0 ? "justify-end" : "justify-start"}`}
//                           >
//                             <div className="animate-pulse h-10 w-48 rounded-2xl bg-neutral-200" />
//                           </div>
//                         ))}
//                       </div>
//                     ) : messages.length === 0 ? (
//                       <p className="text-center text-sm text-neutral-400 py-8 font-schibsted">
//                         No messages yet.
//                       </p>
//                     ) : (
//                       renderMessages()
//                     )}
//                     <div ref={messagesEndRef} />
//                   </motion.div>

//                   {/* Reply Box */}
//                   <div className="border-t border-neutral-200 px-4 py-3 flex-shrink-0 bg-white">
//                     <div className="flex items-end gap-2 bg-white border border-neutral-200 rounded-xl px-3 py-2 focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-500/10 transition-all">
//                       <textarea
//                         value={reply}
//                         onChange={(e) => setReply(e.target.value)}
//                         onKeyDown={handleKeyDown}
//                         placeholder="Type a reply… (Enter to send, Shift+Enter for new line)"
//                         rows={2}
//                         className="flex-1 resize-none text-sm text-neutral-800 placeholder-neutral-400 outline-none bg-transparent max-h-32 overflow-auto font-schibsted"
//                       />
//                       <button
//                         onClick={sendReply}
//                         disabled={!reply.trim() || sending}
//                         className="flex-shrink-0 w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-white transition-all hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed"
//                         aria-label="Send reply"
//                       >
//                         {sending ? (
//                           <RefreshCw size={14} className="animate-spin" />
//                         ) : (
//                           <Send size={14} />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTicketPanelStore } from "@/components/dashboard/right-panel/useTicketPanelStore";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Circle,
  Clock,
  Pause,
  CheckCircle2,
  Mail,
  Search,
  RefreshCw,
  Send,
  X,
  CheckCheck,
  MoreHorizontal,
  SlidersHorizontal,
} from "lucide-react";

import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconClock,
  IconCalendarWeek,
  IconCalendar,
  IconCalendarMonth,
  IconWorld,
  IconAt,
  IconMail,
  IconMailCheck,
  IconMailX,
  IconCheck,
  IconChevronDown,
  IconPaperclip,
} from "@tabler/icons-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Ticket {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  status: "open" | "in_progress" | "waiting" | "resolved";
  receivedAt: string;
  repliedAt?: string | null;
  assignedTo?: string;
  assignedToEmail?: string;
  assignedToName?: string;
  claimedAt?: string;
  aliasId?: string;
  attachmentCount?: number;
  lastMessageDirection?: "inbound" | "outbound";
}

interface ThreadDetail {
  id: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  status: string;
  assignedToName?: string;
  receivedAt: string;
  repliedAt?: string | null;
}

interface ConversationMessage {
  id: string;
  direction: "inbound" | "outbound";
  from: string;
  fromName?: string;
  to: string;
  subject: string;
  textBody: string;
  attachments: Array<{ id: string; filename: string; size?: number }>;
  createdAt?: string;
  receivedAt?: string;
}

interface DropdownOption {
  value: string;
  label: string;
}

interface AliasOption {
  value: string;
  label: string;
  domainId: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const COLUMNS = [
  {
    key: "open" as const,
    label: "Open",
    icon: Circle,
    iconColor: "text-amber-500",
    badgeClass: "bg-amber-100 text-amber-700",
    headerBorder: "border-amber-200",
    headerBg: "bg-amber-50/50",
  },
  {
    key: "in_progress" as const,
    label: "In Progress",
    icon: Clock,
    iconColor: "text-sky-500",
    badgeClass: "bg-sky-100 text-sky-700",
    headerBorder: "border-sky-200",
    headerBg: "bg-sky-50/50",
  },
  {
    key: "waiting" as const,
    label: "Waiting",
    icon: Pause,
    iconColor: "text-purple-500",
    badgeClass: "bg-purple-100 text-purple-700",
    headerBorder: "border-purple-200",
    headerBg: "bg-purple-50/50",
  },
  {
    key: "resolved" as const,
    label: "Resolved",
    icon: CheckCircle2,
    iconColor: "text-green-500",
    badgeClass: "bg-green-100 text-green-700",
    headerBorder: "border-green-200",
    headerBg: "bg-green-50/50",
  },
] as const;

const STATUS_CONFIG = {
  open: {
    label: "Open",
    className: "bg-amber-100 text-amber-700",
    dot: "bg-amber-400",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-sky-100 text-sky-700",
    dot: "bg-sky-400",
  },
  waiting: {
    label: "Waiting",
    className: "bg-purple-100 text-purple-700",
    dot: "bg-purple-400",
  },
  resolved: {
    label: "Resolved",
    className: "bg-green-100 text-green-700",
    dot: "bg-green-400",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  if (hrs < 24) return `${hrs}h`;
  return `${days}d`;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function senderInitial(name?: string, email?: string): string {
  return (name || email || "?").charAt(0).toUpperCase();
}

function applyDateFilter(ticket: Ticket, range: string): boolean {
  const ms = Date.now() - new Date(ticket.receivedAt).getTime();
  const days = ms / 86400000;
  if (range === "24h") return days <= 1;
  if (range === "7d") return days <= 7;
  if (range === "15d") return days <= 15;
  if (range === "30d") return days <= 30;
  return true;
}

// ── Ticket Card ───────────────────────────────────────────────────────────────

function TicketCard({
  ticket,
  onClick,
}: {
  ticket: Ticket;
  onClick: () => void;
}) {
  const ageHours =
    (Date.now() - new Date(ticket.receivedAt).getTime()) / 3600000;
  const isResolved = ticket.status === "resolved";
  const isWaiting = ticket.status === "waiting";
  const urgent = !isResolved && !isWaiting && ageHours >= 4;

  const timeColor =
    isResolved || isWaiting
      ? "text-neutral-300"
      : ageHours < 1
        ? "text-neutral-500"
        : ageHours < 4
          ? "text-amber-500"
          : "text-red-500";

  const lastReplyLabel = (() => {
    if (!ticket.repliedAt && !ticket.lastMessageDirection) return null;
    const byAgent =
      ticket.lastMessageDirection === "outbound" ||
      (!!ticket.repliedAt && !ticket.lastMessageDirection);
    return byAgent
      ? `↩ ${ticket.assignedToName || "Agent"}`
      : `↩ ${ticket.fromName || ticket.from}`;
  })();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
    >
      <Card
        onClick={onClick}
        className="cursor-pointer border border-neutral-200 bg-white hover:border-neutral-600 rounded-2xl p-1.5 transition-all duration-150 group"
      >
        <CardContent className="p-3 rounded-[10px] bg-neutral-50">
          {/* Top row — mail icon + urgency time */}
          <div className="flex items-center justify-between mb-2.5">
            <Mail size={13} className="text-neutral-300 shrink-0" />
            <span
              className={`flex items-center gap-1.5 text-[10px] font-schibsted font-medium ${timeColor}`}
            >
              {urgent && (
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                </span>
              )}
              {timeAgo(ticket.receivedAt)}
            </span>
          </div>

          {/* Subject */}
          <p className="text-sm font-schibsted font-light text-neutral-600 leading-snug line-clamp-2 mb-3 group-hover:text-sky-900 transition-colors duration-150">
            {ticket.subject}
          </p>

          {/* Sender + last reply */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-schibsted text-neutral-400 truncate max-w-[130px]">
              {ticket.from}
            </span>
            {lastReplyLabel ? (
              <span className="text-[10px] font-schibsted font-medium text-sky-500 truncate shrink-0 max-w-[110px]">
                {lastReplyLabel}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-schibsted font-medium text-amber-500 shrink-0">
                <Clock size={11} />
                No reply yet
              </span>
            )}
          </div>

          {/* Attachments — only if present */}
          {(ticket.attachmentCount ?? 0) > 0 && (
            <div className="border-t border-neutral-100 mt-2.5 pt-2">
              <span className="flex items-center gap-1 text-[10px] font-schibsted text-neutral-700">
                <IconPaperclip size={11} className="shrink-0" />
                {ticket.attachmentCount} attachment
                {ticket.attachmentCount! > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Kanban Column ─────────────────────────────────────────────────────────────

function KanbanColumn({
  col,
  tickets,
  onCardClick,
  onUpdateStatus,
}: {
  col: (typeof COLUMNS)[number];
  tickets: Ticket[];
  onCardClick: (ticket: Ticket) => void;
  onUpdateStatus: (id: string, status: string) => void;
}) {
  const Icon = col.icon;

  return (
    <div className="flex flex-col min-w-[290px] max-w-[290px] bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden">
      {/* Column header */}
      <div
        className={`flex items-center justify-between px-3.5 py-3 border-b ${col.headerBorder} ${col.headerBg} flex-shrink-0`}
      >
        <div className="flex items-center gap-2">
          <Icon size={14} className={col.iconColor} />
          <span className="text-sm font-schibsted font-semibold text-neutral-700">
            {col.label}
          </span>
          <span
            className={`text-[10px] font-schibsted font-semibold px-1.5 py-0.5 rounded-full ${col.badgeClass}`}
          >
            {tickets.length}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-neutral-300 hover:text-neutral-500 transition-colors p-0.5 rounded">
              <MoreHorizontal size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-xs font-schibsted">
            <DropdownMenuItem className="text-xs font-schibsted">
              Sort by date
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs font-schibsted">
              Sort by name
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cards */}
      <ScrollArea className="flex-1 h-[calc(100vh-220px)]">
        <div className="p-2.5 flex flex-col gap-2.5">
          <AnimatePresence mode="popLayout" initial={false}>
            {tickets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <Icon
                  size={20}
                  className={`${col.iconColor} opacity-30 mb-2`}
                />
                <p className="text-xs font-schibsted text-neutral-400">
                  No tickets
                </p>
              </motion.div>
            ) : (
              tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => onCardClick(ticket)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}

// ── Filter Dropdown (with per-option icons) ───────────────────────────────────

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
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const SelectedIcon = selected?.icon;

  return (
    <div className={`relative ${width}`} ref={ref}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className={`w-full flex items-center justify-between gap-2 rounded-lg border px-3 h-9 text-xs tracking-tighter font-schibsted text-left transition-colors duration-100 outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-white ${
          open
            ? "border-sky-800"
            : "border-neutral-600 hover:border-neutral-900"
        } ${selected ? "text-neutral-800" : "text-neutral-400"}`}
      >
        <span className="flex items-center gap-1.5 truncate">
          {SelectedIcon && (
            <SelectedIcon
              size={13}
              className={`shrink-0 ${selected ? "text-neutral-800" : "text-neutral-400"}`}
            />
          )}
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
                    transition={{
                      duration: 0.12,
                      delay: i * 0.02,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs tracking-tighter font-schibsted text-left transition-colors duration-75 cursor-pointer ${
                        isSelected
                          ? "text-sky-800 font-medium"
                          : "text-neutral-800 hover:bg-neutral-50"
                      }`}
                    >
                      {Icon && (
                        <Icon
                          size={13}
                          className={
                            isSelected ? "text-sky-600" : "text-neutral-400"
                          }
                        />
                      )}
                      <span className="flex-1 truncate">{opt.label}</span>
                      {isSelected && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.15 }}
                        >
                          <IconCheck
                            size={13}
                            className="text-sky-700 shrink-0"
                          />
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

// ── Columns Popover ───────────────────────────────────────────────────────────

function ColumnsPopover({
  visibleStatuses,
  setVisibleStatuses,
}: {
  visibleStatuses: string[];
  setVisibleStatuses: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const toggle = (key: string) => {
    if (visibleStatuses.includes(key)) {
      if (visibleStatuses.length > 1)
        setVisibleStatuses(visibleStatuses.filter((s) => s !== key));
    } else {
      setVisibleStatuses([...visibleStatuses, key]);
    }
  };

  const allSelected = visibleStatuses.length === COLUMNS.length;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between gap-1 rounded-lg border px-3 h-9 text-xs tracking-tighter font-schibsted text-left transition-colors duration-100 outline-none w-36 ${
          open
            ? "border-sky-800 bg-white"
            : "border-neutral-300 bg-white hover:border-neutral-400"
        } ${!allSelected ? "text-sky-700" : "text-neutral-800"}`}
      >
        <span className="flex items-center gap-1.5 truncate">
          <SlidersHorizontal
            size={12}
            className={`shrink-0 ${!allSelected ? "text-sky-700" : "text-neutral-800"}`}
          />
          <span className="truncate">
            {allSelected ? "Status" : `Status (${visibleStatuses.length})`}
          </span>
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
          <motion.div
            initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 4, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: "top" }}
            className="absolute z-50 right-0 mt-0 w-44 rounded-lg border border-neutral-200 bg-white shadow-lg shadow-neutral-200/50 py-1.5 px-2 space-y-0.5"
          >
            {COLUMNS.map((col) => {
              const Icon = col.icon;
              const isChecked = visibleStatuses.includes(col.key);
              return (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => toggle(col.key)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 transition-colors text-left"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggle(col.key)}
                    className="border-neutral-300 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600 pointer-events-none"
                  />
                  <span
                    className={`flex-1 text-xs tracking-tighter font-schibsted ${isChecked ? "text-neutral-800 font-medium" : "text-neutral-400"}`}
                  >
                    {col.label}
                  </span>
                  <Icon
                    size={12}
                    className={
                      isChecked ? "text-neutral-800" : "text-neutral-400"
                    }
                  />
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Conversation Sheet ────────────────────────────────────────────────────────

function ConversationSheet({
  open,
  onClose,
  ticket,
  thread,
  messages,
  loading,
  refreshing,
  reply,
  setReply,
  sending,
  onSend,
  onUnclaim,
  onUpdateStatus,
}: {
  open: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  thread: ThreadDetail | null;
  messages: ConversationMessage[];
  loading: boolean;
  refreshing: boolean;
  reply: string;
  setReply: (v: string) => void;
  sending: boolean;
  onSend: () => void;
  onUnclaim: () => void;
  onUpdateStatus: (status: string) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const statusCfg = ticket
    ? STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open
    : STATUS_CONFIG.open;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[560px] p-0 flex flex-col gap-0 [&>button]:hidden"
      >
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 px-5 pt-5 pb-4 border-b border-neutral-100 flex-shrink-0 bg-white">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-base font-bold flex-shrink-0 font-schibsted">
            {thread ? senderInitial(thread.fromName, thread.from) : "?"}
          </div>

          {/* Sender info + subject */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-schibsted font-semibold text-neutral-900 leading-tight truncate">
              {thread?.fromName || thread?.from || "—"}
            </p>
            <p className="text-[11px] font-schibsted text-neutral-400 truncate leading-tight mt-0.5">
              {thread?.from}
            </p>
            <p className="text-xs font-schibsted font-medium text-neutral-700 leading-snug mt-2 line-clamp-2">
              {thread?.subject}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="flex items-center justify-center size-7 rounded-lg border border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:border-neutral-300 transition-colors flex-shrink-0"
          >
            <X size={13} />
          </button>
        </div>

        {/* ── Action bar ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-neutral-100 bg-neutral-50 flex-shrink-0">
          {/* Status badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-schibsted font-semibold ${statusCfg.className}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            {statusCfg.label}
          </span>

          <div className="flex-1" />

          {/* Mark as buttons */}
          {COLUMNS.filter((col) => col.key !== ticket?.status).map((col) => (
            <button
              key={col.key}
              onClick={() => onUpdateStatus(col.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-schibsted font-semibold border transition-colors duration-150 ${col.badgeClass} border-transparent hover:border-current`}
            >
              <col.icon size={11} />
              {col.label}
            </button>
          ))}

          {/* Divider */}
          <div className="w-px h-4 bg-neutral-200" />

          {/* Unclaim */}
          <button
            onClick={onUnclaim}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-schibsted font-semibold text-red-500 bg-red-50 border border-transparent hover:border-red-200 transition-colors duration-150"
          >
            Unclaim
          </button>

          {/* Refresh */}
          <button
            onClick={() => {}}
            className="flex items-center justify-center size-6 rounded-md text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>

        {/* ── Messages ─────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-white">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
                >
                  <div className="h-16 w-56 rounded-xl bg-neutral-100 animate-pulse" />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
              <Send size={22} className="text-neutral-200" />
              <p className="text-xs font-schibsted text-neutral-400">
                No messages yet
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOut = msg.direction === "outbound";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOut ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[82%]">
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap font-schibsted ${
                        isOut
                          ? "rounded-tr-sm bg-sky-500 text-white"
                          : "rounded-tl-sm bg-neutral-100 text-neutral-800"
                      }`}
                    >
                      {msg.textBody}
                      {msg.attachments?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {msg.attachments.map((a) => (
                            <div
                              key={a.id}
                              className={`flex items-center gap-2 text-xs rounded-lg px-2 py-1.5 ${isOut ? "bg-sky-600/40" : "bg-neutral-200"}`}
                            >
                              <IconPaperclip size={11} />
                              <span className="truncate font-medium">
                                {a.filename}
                              </span>
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
                    <p
                      className={`text-[10px] mt-1 text-neutral-400 font-schibsted ${isOut ? "text-right" : ""}`}
                    >
                      {isOut ? "You" : msg.fromName || msg.from} ·{" "}
                      {formatTime(msg.createdAt || msg.receivedAt || "")}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Reply composer ────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 bg-white border-t border-neutral-100 px-5 py-4">
          <div className="rounded-xl border border-neutral-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/10 transition-all bg-white overflow-hidden">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a reply… (Enter to send, Shift+Enter for new line)"
              rows={3}
              className="w-full resize-none px-4 pt-3 pb-2 text-sm font-schibsted text-neutral-800 placeholder-neutral-400 focus:outline-none bg-transparent"
            />
            <div className="flex items-center justify-between px-3 py-2 border-t border-neutral-100 bg-neutral-50">
              <span className="text-[10px] font-schibsted text-neutral-400">
                {reply.length > 0
                  ? `${reply.length} chars`
                  : "Replying as agent"}
              </span>
              <button
                onClick={onSend}
                disabled={!reply.trim() || sending}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-schibsted font-semibold hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <Send size={12} />
                )}
                Send reply
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MyTicketsPage() {
  // ── Data state ───────────────────────────────────────────────────────────
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [domains, setDomains] = useState<DropdownOption[]>([
    { value: "all", label: "All Domains" },
  ]);
  const [aliases, setAliases] = useState<AliasOption[]>([]);

  // ── Filter state ─────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("7d");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedAlias, setSelectedAlias] = useState("all");
  const [visibleStatuses, setVisibleStatuses] = useState<string[]>([
    "open",
    "in_progress",
    "waiting",
    "resolved",
  ]);
  const [repliedFilter, setRepliedFilter] = useState("all");

  // ── Conversation state ───────────────────────────────────────────────────
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [thread, setThread] = useState<ThreadDetail | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [convLoading, setConvLoading] = useState(false);
  const [convRefreshing, setConvRefreshing] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // ── Fetch tickets ─────────────────────────────────────────────────────────
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      // ── MOCK ──────────────────────────────────────────────────────────────
      // const [ticketRes, domRes, aliasRes] = await Promise.all([
      //   fetch("/mock-data/tickets.json"),
      //   fetch("/mock-data/domains.json"),
      //   fetch("/mock-data/aliases.json"),
      // ]);
      // const ticketData = await ticketRes.json();
      // setTickets(ticketData.tickets || []);
      // const domData = await domRes.json();
      // setDomains([
      //   { value: "all", label: "All Domains" },
      //   ...domData.map((d: any) => ({ value: d.id, label: d.domain })),
      // ]);
      // const aliasData = await aliasRes.json();
      // setAliases(
      //   aliasData.map((a: any) => ({
      //     value: a.id,
      //     label: a.email,
      //     domainId: a.domainId ?? "unknown",
      //   })),
      // );
      // ── END MOCK ──────────────────────────────────────────────────────────

      // ── LIVE ──────────────────────────────────────────────────────────────
      const res = await fetch("/api/emails/tickets/mine");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTickets(data.tickets || []);
      const [domRes, aliasRes] = await Promise.all([
        fetch("/api/domains"),
        fetch("/api/aliases"),
      ]);
      if (domRes.ok) {
        const domData = await domRes.json();
        setDomains([
          { value: "all", label: "All Domains" },
          ...domData.map((d: any) => ({ value: d.id, label: d.domain })),
        ]);
      }
      if (aliasRes.ok) {
        const aliasData = await aliasRes.json();
        setAliases(
          aliasData.map((a: any) => ({
            value: a.id,
            label: a.email,
            domainId: a.domainId ?? "unknown",
          })),
        );
      }
      // ──────────────────────────────────────────────────────────────────────
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // ── Fetch conversation ────────────────────────────────────────────────────
  const fetchConversation = useCallback(async (id: string) => {
    setConvLoading(true);
    setThread(null);
    setMessages([]);
    try {
      // ── MOCK ──────────────────────────────────────────────────────────────
      // const res = await fetch("/mock-data/threads.json");
      // const allThreads = await res.json();
      // const data = allThreads[id];
      // if (!data) throw new Error();
      // setThread(data.thread);
      // setMessages(data.messages);
      // ── END MOCK ──────────────────────────────────────────────────────────

      // ── LIVE ──────────────────────────────────────────────────────────────
      const res = await fetch(`/api/emails/threads/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setThread(data.thread);
      setMessages(data.messages);
      // ──────────────────────────────────────────────────────────────────────
    } catch {
      toast.error("Failed to load conversation");
    } finally {
      setConvLoading(false);
    }
  }, []);

  // ── Auto-refresh open conversation ───────────────────────────────────────
  const refreshConversation = useCallback(async () => {
    if (!selectedTicket) return;
    setConvRefreshing(true);
    try {
      // ── MOCK ──────────────────────────────────────────────────────────────
      // const res = await fetch("/mock-data/threads.json");
      // const allThreads = await res.json();
      // const data = allThreads[selectedTicket.id];
      // if (data) { setThread(data.thread); setMessages(data.messages); }
      // ── END MOCK ──────────────────────────────────────────────────────────

      // ── LIVE ──────────────────────────────────────────────────────────────
      const res = await fetch(`/api/emails/threads/${selectedTicket.id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setThread(data.thread);
      setMessages(data.messages);
      // ──────────────────────────────────────────────────────────────────────
    } catch {
      /* silent */
    } finally {
      setConvRefreshing(false);
    }
  }, [selectedTicket]);

  useEffect(() => {
    if (!selectedTicket) return;
    const iv = setInterval(refreshConversation, 60000);
    return () => clearInterval(iv);
  }, [selectedTicket, refreshConversation]);

  // ── Ticket panel store ────────────────────────────────────────────────────
  const setPanelTicket = useTicketPanelStore((s) => s.setSelectedTicket);

  // Clear panel selection when leaving the page
  useEffect(() => {
    const clearPanel = useTicketPanelStore.getState().clearSelected;
    return () => clearPanel();
  }, []);

  // ── Card click ───────────────────────────────────────────────────────────
  const handleCardClick = (ticket: Ticket) => {
    // Write to panel store — fills the right panel
    setPanelTicket({
      id: ticket.id,
      from: ticket.from,
      fromName: ticket.fromName,
      subject: ticket.subject,
      status: ticket.status,
      receivedAt: ticket.receivedAt,
      assignedTo: ticket.assignedTo,
      assignedToName: ticket.assignedToName,
      assignedToEmail: ticket.assignedToEmail,
    });
  };

  // ── Send reply ───────────────────────────────────────────────────────────
  const sendReply = async () => {
    if (!reply.trim() || !selectedTicket || sending) return;
    setSending(true);
    const text = reply.trim();
    setReply("");

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
      // ── MOCK (re-enable for design testing) ──────────────────────────────
      // await new Promise((r) => setTimeout(r, 600));
      // toast.success("Reply sent (mock)");
      // setTickets((prev) =>
      //   prev.map((t) =>
      //     t.id === selectedTicket.id ? { ...t, repliedAt: now } : t,
      //   ),
      // );
      // ── END MOCK ──────────────────────────────────────────────────────────

      // ── LIVE ──────────────────────────────────────────────────────────────
      const res = await fetch("/api/emails/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: selectedTicket.id, replyText: text }),
      });
      if (!res.ok) throw new Error();
      toast.success("Reply sent");
      const convRes = await fetch(`/api/emails/threads/${selectedTicket.id}`);
      if (convRes.ok) {
        const data = await convRes.json();
        setThread(data.thread);
        setMessages(data.messages);
        fetchTickets();
      }
      // ─────────────────────────────────────────────────────────────────────
    } catch {
      toast.error("Failed to send reply");
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setReply(text);
    } finally {
      setSending(false);
    }
  };

  // ── Update status ─────────────────────────────────────────────────────────
  const updateStatus = async (status: string) => {
    if (!selectedTicket) return;
    try {
      // ── MOCK (re-enable for design testing) ──────────────────────────────
      // setThread((prev) => (prev ? { ...prev, status } : prev));
      // setTickets((prev) =>
      //   prev.map((t) =>
      //     t.id === selectedTicket.id
      //       ? { ...t, status: status as Ticket["status"] }
      //       : t,
      //   ),
      // );
      // setSelectedTicket((prev) =>
      //   prev ? { ...prev, status: status as Ticket["status"] } : prev,
      // );
      // toast.success(`Marked as ${STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label || status} (mock)`);
      // ── END MOCK ──────────────────────────────────────────────────────────

      // ── LIVE ──────────────────────────────────────────────────────────────
      const res = await fetch("/api/emails/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: selectedTicket.id, status }),
      });
      if (!res.ok) throw new Error();
      setThread((prev) => (prev ? { ...prev, status } : prev));
      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id
            ? { ...t, status: status as Ticket["status"] }
            : t,
        ),
      );
      setSelectedTicket((prev) =>
        prev ? { ...prev, status: status as Ticket["status"] } : prev,
      );
      toast.success(
        `Marked as ${STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label || status}`,
      );
      // ─────────────────────────────────────────────────────────────────────
    } catch {
      toast.error("Failed to update status");
    }
  };

  // ── Unclaim ───────────────────────────────────────────────────────────────
  const handleUnclaim = async () => {
    if (!selectedTicket) return;
    try {
      // ── MOCK (re-enable for design testing) ──────────────────────────────
      // toast.success("Ticket unclaimed (mock)");
      // setSheetOpen(false);
      // setTickets((prev) => prev.filter((t) => t.id !== selectedTicket.id));
      // ── END MOCK ──────────────────────────────────────────────────────────

      // ── LIVE ──────────────────────────────────────────────────────────────
      const res = await fetch("/api/emails/unclaim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: selectedTicket.id }),
      });
      if (!res.ok) throw new Error();
      toast.success("Ticket unclaimed");
      setSheetOpen(false);
      fetchTickets();
      // ─────────────────────────────────────────────────────────────────────
    } catch {
      toast.error("Failed to unclaim ticket");
    }
  };

  // ── Clear filters ─────────────────────────────────────────────────────────
  const clearAllFilters = () => {
    setSearchQuery("");
    setDateRange("7d");
    setSelectedDomain("all");
    setSelectedAlias("all");
    setVisibleStatuses(["open", "in_progress", "waiting", "resolved"]);
    setRepliedFilter("all");
  };

  // ── Filter tickets ────────────────────────────────────────────────────────
  const filteredTickets = tickets.filter((t) => {
    if (!applyDateFilter(t, dateRange)) return false;

    if (selectedAlias !== "all" && t.aliasId !== selectedAlias) return false;

    if (repliedFilter === "replied" && !t.repliedAt) return false;
    if (repliedFilter === "pending" && t.repliedAt) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !t.subject.toLowerCase().includes(q) &&
        !t.from.toLowerCase().includes(q) &&
        !(t.fromName || "").toLowerCase().includes(q)
      )
        return false;
    }

    return true;
  });

  // Group by status
  const byStatus = (status: string) =>
    filteredTickets.filter((t) => t.status === status);

  // Active filter count for badge
  const activeFilterCount = [
    dateRange !== "7d",
    selectedDomain !== "all",
    selectedAlias !== "all",
    visibleStatuses.length < 4,
    repliedFilter !== "all",
  ].filter(Boolean).length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full min-h-dvh bg-neutral-50 -mx-10 -my-6">
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-neutral-200 flex-shrink-0">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-sm max-w-[400px] bg-white border border-neutral-600 rounded-full px-3.5 h-9 transition-colors">
          <Search size={13} className="text-neutral-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject, customer, or email…"
            className="flex-1 text-sm tracking-tighter font-schibsted text-neutral-800 placeholder-neutral-500 bg-transparent outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-neutral-300 hover:text-neutral-500"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex-1" />

        {/* Filter dropdowns */}
        <FilterDropdown
          options={[
            { value: "24h", label: "Last 24 hours", icon: IconClock },
            { value: "7d", label: "Last 7 days", icon: IconCalendarWeek },
            { value: "15d", label: "Last 15 days", icon: IconCalendar },
            { value: "30d", label: "Last 30 days", icon: IconCalendarMonth },
          ]}
          value={dateRange}
          onChange={setDateRange}
          width="w-36"
        />
        <FilterDropdown
          options={domains.map((d) => ({ ...d, icon: IconWorld }))}
          value={selectedDomain}
          onChange={(v) => {
            setSelectedDomain(v);
            setSelectedAlias("all");
          }}
          placeholder="All Domains"
          width="w-36"
        />
        <FilterDropdown
          options={[
            { value: "all", label: "All Aliases", icon: IconAt },
            ...(selectedDomain === "all"
              ? aliases
              : aliases.filter((a) => a.domainId === selectedDomain)
            ).map((a) => ({ value: a.value, label: a.label, icon: IconAt })),
          ]}
          value={selectedAlias}
          onChange={setSelectedAlias}
          placeholder="All Aliases"
          width="w-36"
          disabled={aliases.length === 0}
        />
        <ColumnsPopover
          visibleStatuses={visibleStatuses}
          setVisibleStatuses={setVisibleStatuses}
        />
        <FilterDropdown
          options={[
            { value: "all", label: "All tickets", icon: IconMail },
            { value: "replied", label: "Replied only", icon: IconMailCheck },
            { value: "pending", label: "Unreplied only", icon: IconMailX },
          ]}
          value={repliedFilter}
          onChange={setRepliedFilter}
          width="w-36"
        />

        {/* Refresh */}
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchTickets}
          disabled={loading}
          className="h-8 w-8 text-neutral-400 hover:text-neutral-600"
          title="Refresh"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {/* ── Body: Kanban + Filter Panel ──────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Kanban Board ────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          {loading ? (
            <div className="flex gap-4 p-5 h-full">
              {COLUMNS.map((col) => (
                <div
                  key={col.key}
                  className="min-w-[290px] max-w-[290px] bg-neutral-100 rounded-xl animate-pulse h-64"
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 p-5 h-full items-start">
              {COLUMNS.filter((col) => visibleStatuses.includes(col.key)).map(
                (col) => (
                  <KanbanColumn
                    key={col.key}
                    col={col}
                    tickets={byStatus(col.key)}
                    onCardClick={handleCardClick}
                    onUpdateStatus={(id, status) => {
                      setTickets((prev) =>
                        prev.map((t) =>
                          t.id === id
                            ? { ...t, status: status as Ticket["status"] }
                            : t,
                        ),
                      );
                    }}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Conversation Sheet ───────────────────────────────────────────── */}
      <ConversationSheet
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        thread={thread}
        messages={messages}
        loading={convLoading}
        refreshing={convRefreshing}
        reply={reply}
        setReply={setReply}
        sending={sending}
        onSend={sendReply}
        onUnclaim={handleUnclaim}
        onUpdateStatus={updateStatus}
      />
    </div>
  );
}
