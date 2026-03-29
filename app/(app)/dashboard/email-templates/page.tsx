"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconCheck,
  IconX,
  IconTemplate,
  IconVariable,
  IconInfoCircle,
  IconLoader2,
  IconEye,
} from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EmailTemplate = {
  _id: string;
  name: string;
  subject: string;
  body: string;
  htmlWrapper: string;
  createdAt: string;
};

type FormState = "idle" | "loading" | "success" | "error";

// ─── Supported variables ──────────────────────────────────────────────────────

const SUPPORTED_VARS = [
  { key: "{name}", description: "Customer's name (from email)" },
  { key: "{email}", description: "Customer's email address" },
  { key: "{subject}", description: "Original email subject" },
  { key: "{date}", description: "Today's date" },
  { key: "{agent}", description: "Slack admin/agent name" },
];

// ─── Variable chip ────────────────────────────────────────────────────────────

function VarChip({
  varKey,
  onClick,
}: {
  varKey: string;
  onClick: (v: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(varKey)}
      title={`Click to copy ${varKey}`}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 text-[11px] font-mono font-medium hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors cursor-pointer select-none"
    >
      {varKey}
    </button>
  );
}

// ─── Preview Modal ────────────────────────────────────────────────────────────

function PreviewModal({
  template,
  onClose,
}: {
  template: EmailTemplate;
  onClose: () => void;
}) {
  const preview = template.body
    .replace(/\{name\}/g, "John Smith")
    .replace(/\{email\}/g, "john.smith@example.com")
    .replace(/\{subject\}/g, template.subject || "Support Request")
    .replace(/\{date\}/g, new Date().toLocaleDateString())
    .replace(/\{agent\}/g, "Sarah (Support)");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative z-10 w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Template Preview
            </p>
            <p className="text-xs text-neutral-500 mt-0.5">
              Variables filled with sample data
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <IconX size={14} className="text-neutral-500" />
          </button>
        </div>

        {/* Email preview */}
        <div className="p-5 space-y-3">
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 border border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-neutral-200 dark:border-neutral-700">
              <span className="text-xs font-medium text-neutral-500">Subject:</span>
              <span className="text-xs text-neutral-800 dark:text-neutral-200">
                {template.subject
                  .replace(/\{name\}/g, "John Smith")
                  .replace(/\{email\}/g, "john.smith@example.com")
                  .replace(/\{subject\}/g, "Support Request")
                  .replace(/\{date\}/g, new Date().toLocaleDateString())
                  .replace(/\{agent\}/g, "Sarah (Support)") || "(no subject)"}
              </span>
            </div>
            <pre className="text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap font-sans leading-relaxed">
              {preview}
            </pre>
          </div>
          <p className="text-[11px] text-neutral-400 flex items-center gap-1">
            <IconInfoCircle size={12} />
            This is how the email will look when sent. CSS/HTML wrapper is applied on send.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Template Card ────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  onUpdate,
  onDelete,
}: {
  template: EmailTemplate;
  onUpdate: (t: EmailTemplate) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(template.name);
  const [editSubject, setEditSubject] = useState(template.subject);
  const [editBody, setEditBody] = useState(template.body);
  const [saveState, setSaveState] = useState<FormState>("idle");
  const [deleteState, setDeleteState] = useState<FormState>("idle");
  const [previewing, setPreviewing] = useState(false);

  const insertVar = (v: string) => {
    setEditBody((b) => b + v);
  };

  const handleSave = async () => {
    if (!editName.trim() || !editBody.trim()) return;
    setSaveState("loading");
    try {
      const res = await fetch(`/api/email-templates/${template._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          subject: editSubject.trim(),
          body: editBody.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      onUpdate(updated);
      setSaveState("success");
      toast.success("Template updated");
      setTimeout(() => {
        setEditing(false);
        setSaveState("idle");
      }, 900);
    } catch {
      setSaveState("error");
      toast.error("Failed to update template");
      setTimeout(() => setSaveState("idle"), 1500);
    }
  };

  const handleDelete = async () => {
    setDeleteState("loading");
    try {
      const res = await fetch(`/api/email-templates/${template._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setDeleteState("success");
      toast.success("Template deleted");
      setTimeout(() => onDelete(template._id), 400);
    } catch {
      setDeleteState("error");
      toast.error("Failed to delete template");
      setTimeout(() => setDeleteState("idle"), 1500);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          {editing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-5 space-y-3"
            >
              {/* Template Name */}
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Template name (e.g. Welcome Response)"
                className="w-full text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 text-neutral-900 dark:text-neutral-100 transition-colors"
              />

              {/* Subject */}
              <input
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                placeholder="Email subject (e.g. Re: {subject})"
                className="w-full text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 text-neutral-900 dark:text-neutral-100 transition-colors"
              />

              {/* Variable chips */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1 mr-1">
                  <IconVariable size={12} />
                  Insert:
                </span>
                {SUPPORTED_VARS.map((v) => (
                  <VarChip key={v.key} varKey={v.key} onClick={insertVar} />
                ))}
              </div>

              {/* Body textarea */}
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={6}
                placeholder="Template body..."
                className="w-full text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 text-neutral-900 dark:text-neutral-100 resize-none transition-colors font-mono"
              />

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saveState === "loading"}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-60 transition-all cursor-pointer focus:outline-none"
                >
                  {saveState === "loading" ? (
                    <IconLoader2 size={13} className="animate-spin" />
                  ) : saveState === "success" ? (
                    <IconCheck size={13} />
                  ) : (
                    <IconCheck size={13} />
                  )}
                  {saveState === "loading"
                    ? "Saving..."
                    : saveState === "success"
                    ? "Saved!"
                    : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setEditName(template.name);
                    setEditSubject(template.subject);
                    setEditBody(template.body);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-5"
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <IconTemplate size={16} className="text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {template.name}
                  </p>
                  {template.subject && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                      Subject: {template.subject}
                    </p>
                  )}
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 line-clamp-2 font-mono leading-relaxed">
                    {template.body}
                  </p>

                  {/* Variable tags detected */}
                  {(() => {
                    const found = SUPPORTED_VARS.filter((v) =>
                      template.body.includes(v.key)
                    );
                    if (!found.length) return null;
                    return (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {found.map((v) => (
                          <span
                            key={v.key}
                            className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-800 font-mono"
                          >
                            {v.key}
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Action buttons */}
                <div className="shrink-0 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPreviewing(true)}
                    title="Preview"
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-violet-600 transition-colors cursor-pointer focus:outline-none"
                  >
                    <IconEye size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    title="Edit"
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer focus:outline-none"
                  >
                    <IconPencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteState === "loading"}
                    title="Delete"
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer focus:outline-none disabled:opacity-50"
                  >
                    {deleteState === "loading" ? (
                      <IconLoader2 size={14} className="animate-spin" />
                    ) : (
                      <IconTrash size={14} />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {previewing && (
          <PreviewModal
            template={template}
            onClose={() => setPreviewing(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Add Form ─────────────────────────────────────────────────────────────────

function AddTemplateForm({ onAdd }: { onAdd: (t: EmailTemplate) => void }) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [open, setOpen] = useState(false);

  const insertVar = (v: string) => setBody((b) => b + v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          subject: subject.trim(),
          body: body.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const created = await res.json();
      onAdd(created);
      setName("");
      setSubject("");
      setBody("");
      setState("success");
      toast.success("Template created!");
      setTimeout(() => {
        setState("idle");
        setOpen(false);
      }, 1200);
    } catch {
      setState("error");
      toast.error("Failed to create template");
      setTimeout(() => setState("idle"), 1500);
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer focus:outline-none group"
      >
        <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors">
          <IconPlus
            size={16}
            className="text-neutral-500 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors"
          />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            New Template
          </p>
          <p className="text-xs text-neutral-400">
            Create a reusable template with dynamic variables
          </p>
        </div>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="ml-auto"
        >
          <IconPlus size={14} className="text-neutral-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="px-5 pb-5 pt-2 space-y-3 border-t border-neutral-100 dark:border-neutral-800"
            >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Template name (e.g. Welcome Response)"
                required
                className="w-full text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 text-neutral-900 dark:text-neutral-100 transition-colors"
              />
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject — e.g. Re: {subject}"
                className="w-full text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 text-neutral-900 dark:text-neutral-100 transition-colors"
              />

              {/* Variable chips */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1 mr-1">
                  <IconVariable size={12} />
                  Insert variable:
                </span>
                {SUPPORTED_VARS.map((v) => (
                  <VarChip key={v.key} varKey={v.key} onClick={insertVar} />
                ))}
              </div>

              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={`Hi {name},\n\nThank you for your message regarding "{subject}"...\n\nBest,\n{agent}`}
                rows={6}
                required
                className="w-full text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 text-neutral-900 dark:text-neutral-100 resize-none transition-colors font-mono"
              />

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={state === "loading" || !name.trim() || !body.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-60 transition-all cursor-pointer focus:outline-none shadow-sm"
                >
                  {state === "loading" ? (
                    <IconLoader2 size={13} className="animate-spin" />
                  ) : state === "success" ? (
                    <IconCheck size={13} />
                  ) : (
                    <IconPlus size={13} />
                  )}
                  {state === "loading"
                    ? "Creating..."
                    : state === "success"
                    ? "Created!"
                    : "Create Template"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/email-templates");
        if (!res.ok) throw new Error("Failed to load");
        setTemplates(await res.json());
      } catch {
        toast.error("Could not load templates");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
          <IconTemplate size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Email Templates
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Create reusable templates with dynamic variables. These appear in
            Slack so your team can send polished replies instantly.
          </p>
        </div>
      </div>

      {/* Variable reference */}
      <div className="rounded-2xl bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconVariable size={15} className="text-violet-600 dark:text-violet-400" />
          <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">
            Supported Variables — click to copy
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SUPPORTED_VARS.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(v.key);
                toast.success(`${v.key} copied!`);
              }}
              className="flex items-center gap-2.5 text-left hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-xl px-3 py-2 transition-colors cursor-pointer group"
            >
              <span className="font-mono text-[11px] font-semibold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/40 px-2 py-0.5 rounded-md border border-violet-200 dark:border-violet-700">
                {v.key}
              </span>
              <span className="text-xs text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors">
                {v.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* How it works note */}
      <div className="rounded-2xl bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-800/50 p-4 flex gap-3">
        <IconInfoCircle
          size={16}
          className="text-sky-500 shrink-0 mt-0.5"
        />
        <p className="text-xs text-sky-700 dark:text-sky-300 leading-relaxed">
          <strong>How it works:</strong> When a new email arrives in Slack, your
          team sees a <strong>📋 Templates</strong> button. Clicking it opens a
          modal with your templates listed. Variables like <code>{"{name}"}</code>{" "}
          are automatically filled from the email data. The agent can edit the
          pre-filled text, then hit Send — and a properly formatted email is
          delivered to the customer.
        </p>
      </div>

      {/* Template list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            {loading
              ? "Loading..."
              : `${templates.length} Template${templates.length !== 1 ? "s" : ""}`}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-neutral-400">
            <IconLoader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading templates...</span>
          </div>
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            {templates.map((t) => (
              <TemplateCard
                key={t._id}
                template={t}
                onUpdate={(updated) =>
                  setTemplates((prev) =>
                    prev.map((x) => (x._id === updated._id ? updated : x))
                  )
                }
                onDelete={(id) =>
                  setTemplates((prev) => prev.filter((x) => x._id !== id))
                }
              />
            ))}
          </AnimatePresence>
        )}

        {/* Add form */}
        {!loading && (
          <AddTemplateForm
            onAdd={(t) => setTemplates((prev) => [t, ...prev])}
          />
        )}
      </div>
    </div>
  );
}
