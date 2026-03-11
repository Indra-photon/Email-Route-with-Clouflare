// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { toast } from "sonner";
// import { Plus, Copy, Trash2, MessageSquare, Check, ExternalLink } from "lucide-react";

// interface Integration {
//     id: string;
//     type: "slack" | "discord";
//     name: string;
// }

// interface Domain {
//     id: string;
//     domain: string;
//     status: string;
//     verifiedForSending?: boolean;
// }

// interface ChatWidget {
//     id: string;
//     activationKey: string;
//     domain: string;
//     integrationId: string;
//     welcomeMessage: string;
//     accentColor: string;
//     status: "active" | "inactive";
//     createdAt: string;
//     embedScript?: string;
// }

// const COLORS = [
//     "#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899",
// ];

// export default function ChatWidgetsDashboard() {
//     const [widgets, setWidgets] = useState<ChatWidget[]>([]);
//     const [integrations, setIntegrations] = useState<Integration[]>([]);
//     const [domains, setDomains] = useState<Domain[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [showForm, setShowForm] = useState(false);
//     const [newKey, setNewKey] = useState<{ key: string; script: string } | null>(null);
//     const [copied, setCopied] = useState<string | null>(null);
//     const [deleting, setDeleting] = useState<string | null>(null);
//     const [submitting, setSubmitting] = useState(false);

//     const [form, setForm] = useState({
//         domain: "",
//         integrationId: "",
//         welcomeMessage: "Hi! How can we help you today? 👋",
//         accentColor: "#0ea5e9",
//     });

//     const fetchAll = useCallback(async () => {
//         setLoading(true);
//         try {
//             const [wRes, iRes, dRes] = await Promise.all([
//                 fetch("/api/chat/widgets"),
//                 fetch("/api/integrations"),
//                 fetch("/api/domains"),
//             ]);
//             if (wRes.ok) setWidgets(await wRes.json());
//             if (iRes.ok) setIntegrations(await iRes.json());
//             if (dRes.ok) {
//                 const allDomains = await dRes.json();
//                 // Only show verified domains
//                 setDomains(allDomains.filter((d: Domain) => d.verifiedForSending || d.status === "verified" || d.status === "active"));
//             }
//         } catch {
//             toast.error("Failed to load data");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => { fetchAll(); }, [fetchAll]);

//     const handleCreate = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!form.domain || !form.integrationId) {
//             toast.error("Please select a domain and integration");
//             return;
//         }
//         setSubmitting(true);
//         try {
//             const res = await fetch("/api/chat/widgets", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(form),
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.error || "Failed");

//             setWidgets((prev) => [data, ...prev]);
//             setNewKey({ key: data.activationKey, script: data.embedScript });
//             setShowForm(false);
//             setForm({ domain: "", integrationId: "", welcomeMessage: "Hi! How can we help you today? 👋", accentColor: "#0ea5e9" });
//             toast.success("Widget created!");
//         } catch (err: unknown) {
//             toast.error(err instanceof Error ? err.message : "Failed to create widget");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleDelete = async (id: string) => {
//         if (!confirm("Delete this widget? All conversations linked to it will remain but the key will stop working.")) return;
//         setDeleting(id);
//         try {
//             const res = await fetch(`/api/chat/widgets/${id}`, { method: "DELETE" });
//             if (!res.ok) throw new Error("Failed");
//             setWidgets((prev) => prev.filter((w) => w.id !== id));
//             toast.success("Widget deleted");
//         } catch {
//             toast.error("Failed to delete widget");
//         } finally {
//             setDeleting(null);
//         }
//     };

//     const copyText = (text: string, label: string) => {
//         navigator.clipboard.writeText(text);
//         setCopied(label);
//         toast.success("Copied!");
//         setTimeout(() => setCopied(null), 2000);
//     };

//     if (loading) {
//         return (
//             <div className="space-y-4 animate-pulse">
//                 {[1, 2, 3].map((i) => (
//                     <div key={i} className="h-28 rounded-xl bg-neutral-100" />
//                 ))}
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h1 className="text-xl font-semibold text-neutral-900 font-schibsted">Chat Widgets</h1>
//                     <p className="text-sm text-neutral-500 mt-0.5">
//                         Create embeddable live chat widgets for your verified domains.
//                     </p>
//                 </div>
//                 <button
//                     onClick={() => { setShowForm(true); setNewKey(null); }}
//                     className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
//                 >
//                     <Plus size={16} />
//                     Create Widget
//                 </button>
//             </div>

//             {/* New Key Banner */}
//             {newKey && (
//                 <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4">
//                     <div className="flex items-start gap-3">
//                         <span className="text-2xl">🎉</span>
//                         <div>
//                             <p className="font-semibold text-emerald-900">Widget created! Copy your embed script.</p>
//                             <p className="text-sm text-emerald-700 mt-0.5">Paste this before <code className="bg-emerald-100 px-1 rounded">{`</body>`}</code> on your website.</p>
//                         </div>
//                     </div>

//                     <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                             <span className="text-xs font-medium text-emerald-800 uppercase tracking-wide">Activation Key</span>
//                             <button
//                                 onClick={() => copyText(newKey.key, "key")}
//                                 className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900"
//                             >
//                                 {copied === "key" ? <Check size={13} /> : <Copy size={13} />}
//                                 Copy
//                             </button>
//                         </div>
//                         <code className="block bg-white border border-emerald-200 rounded-lg px-3 py-2 text-sm font-mono text-emerald-900">
//                             {newKey.key}
//                         </code>
//                     </div>

//                     <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                             <span className="text-xs font-medium text-emerald-800 uppercase tracking-wide">Embed Script</span>
//                             <button
//                                 onClick={() => copyText(newKey.script, "script")}
//                                 className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900"
//                             >
//                                 {copied === "script" ? <Check size={13} /> : <Copy size={13} />}
//                                 Copy
//                             </button>
//                         </div>
//                         <pre className="bg-white border border-emerald-200 rounded-lg px-3 py-2 text-xs font-mono text-neutral-800 whitespace-pre-wrap overflow-auto max-h-28">
//                             {newKey.script}
//                         </pre>
//                     </div>

//                     <button onClick={() => setNewKey(null)} className="text-xs text-emerald-600 hover:text-emerald-800 underline">
//                         Dismiss
//                     </button>
//                 </div>
//             )}

//             {/* Create Form */}
//             {showForm && (
//                 <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
//                     <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
//                         <h2 className="text-sm font-semibold text-neutral-900">New Chat Widget</h2>
//                         <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-neutral-600 text-xl leading-none">×</button>
//                     </div>
//                     <form onSubmit={handleCreate} className="p-5 space-y-4">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-xs font-medium text-neutral-700 mb-1.5">Domain *</label>
//                                 <select
//                                     value={form.domain}
//                                     onChange={(e) => setForm({ ...form, domain: e.target.value })}
//                                     className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
//                                     required
//                                 >
//                                     <option value="">Select a verified domain…</option>
//                                     {domains.map((d) => (
//                                         <option key={d.id} value={d.domain}>{d.domain}</option>
//                                     ))}
//                                 </select>
//                                 {domains.length === 0 && (
//                                     <p className="text-xs text-amber-600 mt-1">No verified domains found. Verify a domain first.</p>
//                                 )}
//                             </div>

//                             <div>
//                                 <label className="block text-xs font-medium text-neutral-700 mb-1.5">Integration (Slack/Discord) *</label>
//                                 <select
//                                     value={form.integrationId}
//                                     onChange={(e) => setForm({ ...form, integrationId: e.target.value })}
//                                     className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
//                                     required
//                                 >
//                                     <option value="">Select an integration…</option>
//                                     {integrations.map((i) => (
//                                         <option key={i.id} value={i.id}>
//                                             {i.type === "slack" ? "🟣" : "🎮"} {i.name} ({i.type})
//                                         </option>
//                                     ))}
//                                 </select>
//                                 {integrations.length === 0 && (
//                                     <p className="text-xs text-amber-600 mt-1">No integrations found. Add Slack/Discord first.</p>
//                                 )}
//                             </div>
//                         </div>

//                         <div>
//                             <label className="block text-xs font-medium text-neutral-700 mb-1.5">Welcome Message</label>
//                             <input
//                                 type="text"
//                                 value={form.welcomeMessage}
//                                 onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
//                                 className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
//                                 placeholder="Hi! How can we help you today?"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-xs font-medium text-neutral-700 mb-2">Accent Color</label>
//                             <div className="flex items-center gap-2 flex-wrap">
//                                 {COLORS.map((c) => (
//                                     <button
//                                         key={c}
//                                         type="button"
//                                         onClick={() => setForm({ ...form, accentColor: c })}
//                                         className={`w-8 h-8 rounded-full border-2 transition-all ${form.accentColor === c ? "border-neutral-900 scale-110" : "border-transparent"}`}
//                                         style={{ background: c }}
//                                     />
//                                 ))}
//                                 <input
//                                     type="color"
//                                     value={form.accentColor}
//                                     onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
//                                     className="w-8 h-8 rounded-full border border-neutral-200 cursor-pointer"
//                                     title="Custom color"
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-3 pt-2">
//                             <button
//                                 type="submit"
//                                 disabled={submitting}
//                                 className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
//                             >
//                                 {submitting ? "Creating…" : "Create Widget"}
//                             </button>
//                             <button type="button" onClick={() => setShowForm(false)} className="text-sm text-neutral-500 hover:text-neutral-700">
//                                 Cancel
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             )}

//             {/* Widgets List */}
//             {widgets.length === 0 && !showForm ? (
//                 <div className="text-center py-16 border-2 border-dashed border-neutral-200 rounded-xl">
//                     <MessageSquare className="size-10 text-neutral-300 mx-auto mb-3" />
//                     <p className="text-neutral-700 font-medium">No chat widgets yet</p>
//                     <p className="text-sm text-neutral-400 mt-1 mb-5">
//                         Create a widget and embed it on your website in seconds.
//                     </p>
//                     <button
//                         onClick={() => setShowForm(true)}
//                         className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
//                     >
//                         Create your first widget
//                     </button>
//                 </div>
//             ) : (
//                 <div className="space-y-3">
//                     {widgets.map((widget) => {
//                         const script = widget.embedScript || `<script>window.CHAT_KEY = '${widget.activationKey}';</script>\n<script async src="${process.env.NEXT_PUBLIC_BASE_URL || ''}/chat/widget.js"></script>`;
//                         return (
//                             <div
//                                 key={widget.id}
//                                 className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-colors"
//                             >
//                                 <div className="flex items-start justify-between gap-4">
//                                     <div className="flex items-start gap-3 min-w-0">
//                                         <div
//                                             className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-lg shadow-sm"
//                                             style={{ background: widget.accentColor }}
//                                         >
//                                             💬
//                                         </div>
//                                         <div className="min-w-0">
//                                             <div className="flex items-center gap-2 flex-wrap">
//                                                 <span className="font-medium text-neutral-900 font-mono text-sm">{widget.domain}</span>
//                                                 <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${widget.status === "active" ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
//                                                     {widget.status}
//                                                 </span>
//                                             </div>
//                                             <p className="text-xs text-neutral-400 mt-0.5 truncate">{widget.welcomeMessage}</p>
//                                             <div className="flex items-center gap-2 mt-2">
//                                                 <code className="text-xs font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">
//                                                     {widget.activationKey}
//                                                 </code>
//                                                 <button
//                                                     onClick={() => copyText(widget.activationKey, widget.id + "key")}
//                                                     className="text-neutral-400 hover:text-neutral-600 transition-colors"
//                                                     title="Copy key"
//                                                 >
//                                                     {copied === widget.id + "key" ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
//                                                 </button>
//                                                 <button
//                                                     onClick={() => copyText(script, widget.id + "script")}
//                                                     className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 transition-colors"
//                                                     title="Copy embed script"
//                                                 >
//                                                     {copied === widget.id + "script" ? <Check size={13} /> : <ExternalLink size={13} />}
//                                                     {copied === widget.id + "script" ? "Copied!" : "Copy Embed"}
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <button
//                                         onClick={() => handleDelete(widget.id)}
//                                         disabled={deleting === widget.id}
//                                         className="flex-shrink-0 text-neutral-300 hover:text-red-500 transition-colors disabled:opacity-50"
//                                         title="Delete widget"
//                                     >
//                                         <Trash2 size={16} />
//                                     </button>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// }



"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  IconPlus,
  IconMessageCircle,
  IconChevronDown,
  IconCopy,
  IconCheck,
  IconCode,
  IconPalette,
} from "@tabler/icons-react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import AnimatedDropdown from "@/components/ui/AnimatedDropdown";
import { AnimatedSubmitButton } from "@/components/ui/AnimatedSubmitButton";
import { AnimatedDeleteButton } from "@/components/ui/AnimatedDeleteButton";
import { CopyIconButton } from "@/components/ui/CopyIconButton";
import { CustomLink } from "@/components/CustomLink";
import { CopyIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Integration {
  id: string;
  type: "slack" | "discord";
  name: string;
}

interface Domain {
  id: string;
  domain: string;
  status: string;
  verifiedForSending?: boolean;
}

interface ChatWidget {
  id: string;
  activationKey: string;
  domain: string;
  integrationId: string;
  welcomeMessage: string;
  accentColor: string;
  status: "active" | "inactive";
  createdAt: string;
  embedScript?: string;
}



// ─── Easing ───────────────────────────────────────────────────────────────────

const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;
const easeOutQuint = [0.23, 1, 0.32, 1] as const;

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = [
  "#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899",
];

// ─── Widget Card ──────────────────────────────────────────────────────────────

function WidgetCard({
  widget,
  onDelete,
}: {
  widget: ChatWidget;
  onDelete: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const isActive = widget.status === "active";

  const script =
    widget.embedScript ||
    `<script>window.CHAT_KEY = '${widget.activationKey}';</script>\n<script async src="${process.env.NEXT_PUBLIC_BASE_URL || ""}/chat/widget.js"></script>`;


  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: -2 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -2 }}
      transition={{ duration: 0.15, ease: easeOutCubic }}
      style={{ transformOrigin: "top left" }}
    >
      <Card className="bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors duration-300 ease-out">
        <CardContent className="p-4 flex items-center gap-4">
          {/* Icon with accent color dot */}
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center">
              <IconMessageCircle size={15} className="text-white" />
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
              style={{ background: widget.accentColor }}
            />
          </div>

          {/* Domain + status — clickable */}
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            className="flex-1 min-w-0 text-left cursor-pointer focus:outline-none"
          >
            <p className="font-schibsted font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
              {widget.domain}
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              <Badge
                className={`border-0 font-schibsted tracking-tight rounded-sm ${
                  isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
              <span className="text-xs font-schibsted text-neutral-500 truncate">
                {widget.welcomeMessage}
              </span>
            </div>
          </button>

          {/* Chevron */}
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex items-center justify-center"
            >
              <IconChevronDown size={15} className="text-neutral-500" />
            </motion.span>
          </button>

          {/* Delete */}
          <AnimatedDeleteButton
            onDelete={async () => {
              try {
                const res = await fetch(`/api/chat/widgets/${widget.id}`, {
                  method: "DELETE",
                });
                if (!res.ok) throw new Error("Failed to delete");
                toast.success("Widget deleted");
                setTimeout(() => onDelete(widget.id), 400);
                return "success";
              } catch (err: any) {
                toast.error(err.message || "Failed to delete widget");
                return "error";
              }
            }}
          />
        </CardContent>

        {/* Expanded panel — always mounted */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: easeOutQuint }}
          style={{ overflow: "hidden" }}
        >
          <div className="px-4 pb-4 pt-1 border-t border-neutral-200 dark:border-neutral-800 mt-1 space-y-4">
            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Domain</p>
                <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">{widget.domain}</p>
              </div>
              <div>
                <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Status</p>
                <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100 capitalize">{widget.status}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Welcome Message</p>
                <p className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300">{widget.welcomeMessage}</p>
              </div>
              <div>
                <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Accent Color</p>
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-neutral-200"
                    style={{ background: widget.accentColor }}
                  />
                  <p className="text-sm font-schibsted font-mono text-neutral-700 dark:text-neutral-300">{widget.accentColor}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Created</p>
                <p className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300 tabular-nums">
                  {new Date(widget.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Activation Key */}
            <div className="space-y-1.5">
              <p className="text-xs font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">Activation Key</p>
              <div className="flex items-center gap-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 px-3 py-2">
                <code className="flex-1 text-xs font-mono text-neutral-700 dark:text-neutral-300 truncate">
                  {widget.activationKey}
                </code>
                <CopyIconButton value={widget.activationKey} />
              </div>
            </div>

            {/* Embed Script */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">Embed Script</p>
              </div>
              <div className="flex items-between justify-between rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 px-3 py-2 text-xs font-mono text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap overflow-auto max-h-28">
                {script}
                <CopyIconButton value={script} />
              </div>
            </div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}

// ─── New Widget Banner ────────────────────────────────────────────────────────

function NewKeyBanner({
  activationKey,
  script,
  onDismiss,
}: {
  activationKey: string;
  script: string;
  onDismiss: () => void;
}) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const handleCopy = (text: string, type: "key" | "script") => {
    navigator.clipboard.writeText(text);
    if (type === "key") {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
    toast.success("Copied!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: easeOutCubic }}
      className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800 p-5 space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-schibsted font-semibold text-green-900 dark:text-green-300">
            Widget created — copy your embed script
          </p>
          <p className="text-xs font-schibsted text-green-700 dark:text-green-400 mt-0.5">
            Paste this before{" "}
            <code className="bg-green-100 dark:bg-green-900/30 px-1 rounded">{`</body>`}</code>{" "}
            on your website.
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-green-600 hover:text-green-800 text-xs font-schibsted underline shrink-0"
        >
          Dismiss
        </button>
      </div>

      {/* Key */}
      <div className="space-y-1.5">
        <p className="text-xs font-schibsted font-semibold text-green-800 dark:text-green-400">Activation Key</p>
        <div className="flex items-center gap-2 rounded-md border border-green-200 dark:border-green-800 bg-white dark:bg-neutral-900 px-3 py-2">
          <code className="flex-1 text-xs font-mono text-neutral-700 dark:text-neutral-300 truncate">
            {activationKey}
          </code>
          <button
            type="button"
            onClick={() => handleCopy(activationKey, "key")}
            className="shrink-0 text-green-600 hover:text-green-800 transition-colors"
          >
            {copiedKey ? <IconCheck size={14} /> : <IconCopy size={14} />}
          </button>
        </div>
      </div>

      {/* Script */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-schibsted font-semibold text-green-800 dark:text-green-400">Embed Script</p>
          <button
            type="button"
            onClick={() => handleCopy(script, "script")}
            className="flex items-center gap-1 text-xs font-schibsted text-green-700 hover:text-green-900 transition-colors"
          >
            {copiedScript ? <IconCheck size={12} /> : <IconCode size={12} />}
            {copiedScript ? "Copied!" : "Copy script"}
          </button>
        </div>
        <pre className="rounded-md border border-green-200 dark:border-green-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs font-mono text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap overflow-auto max-h-28">
          {script}
        </pre>
      </div>
    </motion.div>
  );
}

// ─── Add Widget Form ──────────────────────────────────────────────────────────

type FormStatus = "idle" | "loading" | "success";

function WidgetAddForm({
  domains,
  integrations,
  onWidgetAdded,
}: {
  domains: Domain[];
  integrations: Integration[];
  onWidgetAdded: (widget: ChatWidget) => void;
}) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [selectedDomain, setSelectedDomain] = useState(domains[0]?.domain ?? "");
  const [selectedIntegrationId, setSelectedIntegrationId] = useState(integrations[0]?.id ?? "");
  const [welcomeMessage, setWelcomeMessage] = useState("Hi! How can we help you today? 👋");
  const [accentColor, setAccentColor] = useState("#0ea5e9");

  useEffect(() => {
    if (!selectedDomain && domains.length > 0) setSelectedDomain(domains[0].domain);
  }, [domains, selectedDomain]);

  useEffect(() => {
    if (!selectedIntegrationId && integrations.length > 0) setSelectedIntegrationId(integrations[0].id);
  }, [integrations, selectedIntegrationId]);

  const isBusy = status !== "idle";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDomain || !selectedIntegrationId || isBusy) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/chat/widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: selectedDomain,
          integrationId: selectedIntegrationId,
          welcomeMessage: welcomeMessage.trim(),
          accentColor,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create widget");
      }

      const created: ChatWidget = await res.json();

      setTimeout(() => {
        setStatus("success");
        toast.success(`Widget for ${created.domain} created`);
        onWidgetAdded(created);
        setTimeout(() => setStatus("idle"), 100);
      }, 1000);
    } catch (err) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Failed to create widget");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-wrap gap-2 items-end">
        {/* Domain */}
        <AnimatedDropdown
          label="Domain"
          options={domains.map((d) => ({ value: d.domain, label: d.domain }))}
          value={selectedDomain}
          onChange={setSelectedDomain}
          placeholder="No verified domains"
          disabled={isBusy || domains.length === 0}
          width="w-52"
        />

        {/* Integration */}
        <AnimatedDropdown
          label="Integration"
          options={integrations.map((i) => ({
            value: i.id,
            label: `${i.name} (${i.type})`,
          }))}
          value={selectedIntegrationId}
          onChange={setSelectedIntegrationId}
          placeholder="No integrations"
          disabled={isBusy || integrations.length === 0}
          width="w-52"
        />

        {/* Welcome message */}
        <div className="flex flex-col space-y-1">
          <label className="text-lg font-schibsted text-neutral-700 dark:text-neutral-300">
            Welcome Message
          </label>
          <input
            type="text"
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            placeholder="Hi! How can we help?"
            disabled={isBusy}
            className="w-64 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors duration-100 focus:border-sky-800 dark:focus:border-neutral-400 outline-none focus:outline-none [box-shadow:none] focus:[box-shadow:none] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Accent color */}
        <div className="flex flex-col space-y-1">
          <label className="text-lg font-schibsted text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
            <IconPalette size={14} />
            Color
          </label>
          <div className="flex items-center gap-1.5 h-[38px]">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                disabled={isBusy}
                onClick={() => setAccentColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-150 focus:outline-none disabled:opacity-50 ${
                  accentColor === c
                    ? "border-neutral-800 dark:border-neutral-200 scale-110"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ background: c }}
              />
            ))}
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              disabled={isBusy}
              className="w-6 h-6 rounded-full border border-neutral-300 cursor-pointer disabled:opacity-50"
              title="Custom color"
            />
          </div>
        </div>

        <AnimatedSubmitButton
          idleLabel="Create"
          loadingLabel="Creating..."
          successLabel="Created"
          idleIcon={<IconPlus size={16} strokeWidth={2.5} />}
          state={status}
          idleWidth={200}
          loadingWidth={120}
          successWidth={200}
          disabled={isBusy || domains.length === 0 || integrations.length === 0}
          className="font-schibsted w-32 px-4 py-2 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 text-white border-0 shadow-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 cursor-pointer flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
        />

        <CustomLink
          href="/docs/chatbot"
          className="text-sm font-schibsted text-sky-700 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300 transition-colors underline pb-2"
        >
          Read our docs
        </CustomLink>
      </div>
{/* 
      {domains.length === 0 && (
        <p className="text-xs font-schibsted text-amber-600 dark:text-amber-400">
          No verified domains found.{" "}
          <CustomLink href="/dashboard/domains" className="underline">
            Verify a domain first.
          </CustomLink>
        </p>
      )}
      {integrations.length === 0 && (
        <p className="text-xs font-schibsted text-amber-600 dark:text-amber-400">
          No integrations found.{" "}
          <CustomLink href="/dashboard/integrations" className="underline">
            Add Slack or Discord first.
          </CustomLink>
        </p>
      )} */}
    </form>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2, ease: easeOutCubic }}
      className="flex flex-col items-center justify-center py-12 px-6 gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center opacity-40">
        <IconMessageCircle size={18} className="text-white" />
      </div>
      <Paragraph variant="muted" className="text-center max-w-lg">
        No chat widgets yet. Create one above and embed it on your website in seconds.
      </Paragraph>
    </motion.div>
  );
}

// ─── Loading State ────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: easeOutCubic }}
      className="flex items-center justify-center py-12 gap-2"
    >
      <Paragraph variant="muted" className="text-xs">Loading widgets...</Paragraph>
    </motion.div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export default function ChatWidgetsDashboard() {
  const [widgets, setWidgets] = useState<ChatWidget[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState<{ key: string; script: string } | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [wRes, iRes, dRes] = await Promise.all([
        fetch("/api/chat/widgets"),
        fetch("/api/integrations"),
        fetch("/api/domains"),
      ]);
      if (wRes.ok) setWidgets(await wRes.json());
      if (iRes.ok) setIntegrations(await iRes.json());
      if (dRes.ok) {
        const allDomains = await dRes.json();
        setDomains(
          allDomains.filter(
            (d: Domain) =>
              d.verifiedForSending || d.status === "verified" || d.status === "active"
          )
        );
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  const handleWidgetAdded = (widget: ChatWidget) => {
    setWidgets((prev) => [widget, ...prev]);
    if (widget.activationKey) {
      const script =
        widget.embedScript ||
        `<script>window.CHAT_KEY = '${widget.activationKey}';</script>\n<script async src="${process.env.NEXT_PUBLIC_BASE_URL || ""}/chat/widget.js"></script>`;
      setNewKey({ key: widget.activationKey, script });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
          Configure your chat widgets for embedding on your website.
        </Heading>
        <Paragraph variant="default" className="text-neutral-600 dark:text-neutral-400 mt-1">
          Create embeddable live chat widgets for your verified domains. Each widget routes conversations to a Slack or Discord integration.
        </Paragraph>
      </div>

      <WidgetAddForm
        domains={domains}
        integrations={integrations}
        onWidgetAdded={handleWidgetAdded}
      />

      {/* <AnimatePresence>
        {newKey && (
          <NewKeyBanner
            activationKey={newKey.key}
            script={newKey.script}
            onDismiss={() => setNewKey(null)}
          />
        )}
      </AnimatePresence> */}

       <div className="border-2 border-dashed border-neutral-200 rounded-xl px-4 pt-3 pb-3">

      <Card className="min-h-[120px] overflow-hidden">
        <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
          Your Widgets
        </Heading>
        <Paragraph variant="small" className="text-neutral-600 dark:text-neutral-400 mt-1 pb-5">
            Manage your existing chat widgets. Click on a widget to view details, copy its activation key or embed script, or delete it.
        </Paragraph>

        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingState key="loading" />
          ) : widgets.length === 0 ? (
            <EmptyState key="empty" />
          ) : (
            <motion.div
              key="list"
              layout
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.7 }}
              transition={{ duration: 0.15, type: "spring", stiffness: 300, damping: 20 }}
              className="space-y-2"
            >
              {widgets.map((w) => (
                <WidgetCard key={w.id} widget={w} onDelete={handleDelete} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      </div>
    </div>
  );
}