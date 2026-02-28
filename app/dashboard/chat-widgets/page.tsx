"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Copy, Trash2, MessageSquare, Check, ExternalLink } from "lucide-react";

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

const COLORS = [
    "#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899",
];

export default function ChatWidgetsDashboard() {
    const [widgets, setWidgets] = useState<ChatWidget[]>([]);
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newKey, setNewKey] = useState<{ key: string; script: string } | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        domain: "",
        integrationId: "",
        welcomeMessage: "Hi! How can we help you today? 👋",
        accentColor: "#0ea5e9",
    });

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
                // Only show verified domains
                setDomains(allDomains.filter((d: Domain) => d.verifiedForSending || d.status === "verified" || d.status === "active"));
            }
        } catch {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.domain || !form.integrationId) {
            toast.error("Please select a domain and integration");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("/api/chat/widgets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed");

            setWidgets((prev) => [data, ...prev]);
            setNewKey({ key: data.activationKey, script: data.embedScript });
            setShowForm(false);
            setForm({ domain: "", integrationId: "", welcomeMessage: "Hi! How can we help you today? 👋", accentColor: "#0ea5e9" });
            toast.success("Widget created!");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to create widget");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this widget? All conversations linked to it will remain but the key will stop working.")) return;
        setDeleting(id);
        try {
            const res = await fetch(`/api/chat/widgets/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed");
            setWidgets((prev) => prev.filter((w) => w.id !== id));
            toast.success("Widget deleted");
        } catch {
            toast.error("Failed to delete widget");
        } finally {
            setDeleting(null);
        }
    };

    const copyText = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        toast.success("Copied!");
        setTimeout(() => setCopied(null), 2000);
    };

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-28 rounded-xl bg-neutral-100" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-neutral-900 font-schibsted">Chat Widgets</h1>
                    <p className="text-sm text-neutral-500 mt-0.5">
                        Create embeddable live chat widgets for your verified domains.
                    </p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setNewKey(null); }}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    Create Widget
                </button>
            </div>

            {/* New Key Banner */}
            {newKey && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🎉</span>
                        <div>
                            <p className="font-semibold text-emerald-900">Widget created! Copy your embed script.</p>
                            <p className="text-sm text-emerald-700 mt-0.5">Paste this before <code className="bg-emerald-100 px-1 rounded">{`</body>`}</code> on your website.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-emerald-800 uppercase tracking-wide">Activation Key</span>
                            <button
                                onClick={() => copyText(newKey.key, "key")}
                                className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900"
                            >
                                {copied === "key" ? <Check size={13} /> : <Copy size={13} />}
                                Copy
                            </button>
                        </div>
                        <code className="block bg-white border border-emerald-200 rounded-lg px-3 py-2 text-sm font-mono text-emerald-900">
                            {newKey.key}
                        </code>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-emerald-800 uppercase tracking-wide">Embed Script</span>
                            <button
                                onClick={() => copyText(newKey.script, "script")}
                                className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900"
                            >
                                {copied === "script" ? <Check size={13} /> : <Copy size={13} />}
                                Copy
                            </button>
                        </div>
                        <pre className="bg-white border border-emerald-200 rounded-lg px-3 py-2 text-xs font-mono text-neutral-800 whitespace-pre-wrap overflow-auto max-h-28">
                            {newKey.script}
                        </pre>
                    </div>

                    <button onClick={() => setNewKey(null)} className="text-xs text-emerald-600 hover:text-emerald-800 underline">
                        Dismiss
                    </button>
                </div>
            )}

            {/* Create Form */}
            {showForm && (
                <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-neutral-900">New Chat Widget</h2>
                        <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-neutral-600 text-xl leading-none">×</button>
                    </div>
                    <form onSubmit={handleCreate} className="p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Domain *</label>
                                <select
                                    value={form.domain}
                                    onChange={(e) => setForm({ ...form, domain: e.target.value })}
                                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
                                    required
                                >
                                    <option value="">Select a verified domain…</option>
                                    {domains.map((d) => (
                                        <option key={d.id} value={d.domain}>{d.domain}</option>
                                    ))}
                                </select>
                                {domains.length === 0 && (
                                    <p className="text-xs text-amber-600 mt-1">No verified domains found. Verify a domain first.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Integration (Slack/Discord) *</label>
                                <select
                                    value={form.integrationId}
                                    onChange={(e) => setForm({ ...form, integrationId: e.target.value })}
                                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
                                    required
                                >
                                    <option value="">Select an integration…</option>
                                    {integrations.map((i) => (
                                        <option key={i.id} value={i.id}>
                                            {i.type === "slack" ? "🟣" : "🎮"} {i.name} ({i.type})
                                        </option>
                                    ))}
                                </select>
                                {integrations.length === 0 && (
                                    <p className="text-xs text-amber-600 mt-1">No integrations found. Add Slack/Discord first.</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">Welcome Message</label>
                            <input
                                type="text"
                                value={form.welcomeMessage}
                                onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
                                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
                                placeholder="Hi! How can we help you today?"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-2">Accent Color</label>
                            <div className="flex items-center gap-2 flex-wrap">
                                {COLORS.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setForm({ ...form, accentColor: c })}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${form.accentColor === c ? "border-neutral-900 scale-110" : "border-transparent"}`}
                                        style={{ background: c }}
                                    />
                                ))}
                                <input
                                    type="color"
                                    value={form.accentColor}
                                    onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                                    className="w-8 h-8 rounded-full border border-neutral-200 cursor-pointer"
                                    title="Custom color"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                            >
                                {submitting ? "Creating…" : "Create Widget"}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-neutral-500 hover:text-neutral-700">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Widgets List */}
            {widgets.length === 0 && !showForm ? (
                <div className="text-center py-16 border-2 border-dashed border-neutral-200 rounded-xl">
                    <MessageSquare className="size-10 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-700 font-medium">No chat widgets yet</p>
                    <p className="text-sm text-neutral-400 mt-1 mb-5">
                        Create a widget and embed it on your website in seconds.
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Create your first widget
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {widgets.map((widget) => {
                        const script = `<script>window.CHAT_KEY = '${widget.activationKey}';</script>\n<script async src="${process.env.NEXT_PUBLIC_BASE_URL || ''}/chat/widget.js"></script>`;
                        return (
                            <div
                                key={widget.id}
                                className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <div
                                            className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-lg shadow-sm"
                                            style={{ background: widget.accentColor }}
                                        >
                                            💬
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-medium text-neutral-900 font-mono text-sm">{widget.domain}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${widget.status === "active" ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                                                    {widget.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-neutral-400 mt-0.5 truncate">{widget.welcomeMessage}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <code className="text-xs font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">
                                                    {widget.activationKey}
                                                </code>
                                                <button
                                                    onClick={() => copyText(widget.activationKey, widget.id + "key")}
                                                    className="text-neutral-400 hover:text-neutral-600 transition-colors"
                                                    title="Copy key"
                                                >
                                                    {copied === widget.id + "key" ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                                                </button>
                                                <button
                                                    onClick={() => copyText(script, widget.id + "script")}
                                                    className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 transition-colors"
                                                    title="Copy embed script"
                                                >
                                                    {copied === widget.id + "script" ? <Check size={13} /> : <ExternalLink size={13} />}
                                                    {copied === widget.id + "script" ? "Copied!" : "Copy Embed"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(widget.id)}
                                        disabled={deleting === widget.id}
                                        className="flex-shrink-0 text-neutral-300 hover:text-red-500 transition-colors disabled:opacity-50"
                                        title="Delete widget"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
