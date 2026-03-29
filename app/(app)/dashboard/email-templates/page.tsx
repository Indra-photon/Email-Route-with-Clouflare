"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconTemplate,
  IconTrash,
  IconPencil,
  IconEye,
  IconPlus,
  IconX,
  IconCheck,
  IconTerminal,
  IconCode,
  IconAlignLeft,
  IconVariable,
  IconChevronDown,
} from "@tabler/icons-react";
import { Loader2 } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type EmailTemplate = {
  _id: string;
  name: string;
  subject: string;
  body: string;       // plain text body
  htmlBody?: string;  // html body (optional)
  createdAt: string;
};

type EditorMode = "plain" | "html";
type FormStatus = "idle" | "loading" | "success";

// ─── Variable reference ─────────────────────────────────────────────────────────

const VARS = [
  { key: "{name}",    desc: "Customer name" },
  { key: "{email}",   desc: "Customer email" },
  { key: "{subject}", desc: "Email subject" },
  { key: "{date}",    desc: "Today's date" },
  { key: "{agent}",   desc: "Agent / admin name" },
  { key: "[message] ... [/message]", desc: "Slack editable region (HTML mode)" },
];

// ─── Preview Modal ───────────────────────────────────────────────────────────────

function PreviewModal({
  name,
  subject,
  body,
  onClose,
}: {
  name: string;
  subject: string;
  body: string;
  onClose: () => void;
}) {
  const isHtml = /<[a-z][\s\S]*>/i.test(body);

  const sampleVars = (text: string) => {
    let result = text
      .replace(/\{name\}/g, "Jane Smith")
      .replace(/\{email\}/g, "jane@example.com")
      .replace(/\{subject\}/g, subject || "Support Request")
      .replace(/\{date\}/g, new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }))
      .replace(/\{agent\}/g, "Alex (Support)");
      
    // Drop the [message] tags for preview rendering
    result = result.replace(/\[message\]([\s\S]*?)\[\/message\]/ig, (_, match) => match);
    return result;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative z-10 w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <p className="font-schibsted font-semibold text-neutral-900 dark:text-neutral-100 text-base">
              Preview — {name || "Template"}
            </p>
            <p className="font-schibsted text-xs text-neutral-500 mt-0.5">
              Variables filled with sample data
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <IconX size={15} className="text-neutral-500" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 p-4 space-y-3">
            <div className="flex gap-2 text-xs font-schibsted">
              <span className="font-semibold text-neutral-500 w-14 shrink-0">Subject:</span>
              <span className="text-neutral-800 dark:text-neutral-200">
                {sampleVars(subject) || "(no subject)"}
              </span>
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3">
              {isHtml ? (
                <div
                  className="text-sm text-neutral-800 dark:text-neutral-200 prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: sampleVars(body) }}
                />
              ) : (
                <pre className="text-xs font-schibsted text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                  {sampleVars(body) || "(empty)"}
                </pre>
              )}
            </div>
          </div>
          <p className="text-[11px] font-schibsted text-neutral-400">
            * Variables replaced with sample data for preview purposes.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Editor section (plain + html with toggle) ──────────────────────────────────

function BodyEditor({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const inputClass =
    "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-mono text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors duration-100 focus:border-sky-600 outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300 font-medium">
          Body
        </span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={12}
        placeholder={`Hi {name},\n\nThank you for reaching out about "{subject}".\n\n...\n-- OR --\n<html>...[message]Hi {name}...[/message]...</html>`}
        className={inputClass}
      />
      <div className="mt-2 text-xs font-schibsted text-sky-800 dark:text-sky-200 bg-sky-50 dark:bg-sky-900/20 px-3 py-3 rounded-lg border border-sky-100 dark:border-sky-800">
        <strong className="block mb-1 font-semibold flex items-center gap-1.5"><IconTerminal size={14} /> Smart Slack Integration</strong>
        <ul className="list-disc pl-4 space-y-1.5 text-sky-700 dark:text-sky-300">
          <li><strong>Plain Text:</strong> Write normal text. The complete text will be editable in Slack and sent as a normal email.</li>
          <li><strong>Editable HTML:</strong> Paste your HTML and wrap your message in <code className="font-mono bg-white/60 dark:bg-sky-900/50 border border-sky-200 dark:border-sky-700 px-1 rounded text-[10px]">{"[message] Your text [/message]"}</code>. Only the content between the tags will be editable in Slack.</li>
          <li><strong>Static HTML:</strong> Paste HTML without tags. The agent in Slack will not see messy code, and the template will send exactly as designed.</li>
        </ul>
      </div>
    </div>
  );
}

// ─── Add Template Form ──────────────────────────────────────────────────────────

function AddTemplateCard({ onAdd }: { onAdd: (t: EmailTemplate) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [previewing, setPreviewing] = useState(false);

  const isBusy = status !== "idle";

  const insertVar = (v: string) => setBody((b) => b + v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setStatus("loading");
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
      if (!res.ok) throw new Error("Failed");
      const created = await res.json();
      onAdd(created);
      setName(""); setSubject(""); setBody("");
      setStatus("success");
      toast.success("Template created!");
      setTimeout(() => { setStatus("idle"); setOpen(false); }, 1200);
    } catch {
      setStatus("idle");
      toast.error("Failed to create template");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors duration-100 focus:border-sky-600 outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <Card>
      {/* Toggle row */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer focus:outline-none group rounded-xl"
      >
        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-sky-50 dark:group-hover:bg-sky-900/20 transition-colors">
          <IconPlus size={15} className="text-neutral-500 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors" />
        </div>
        <div className="text-left flex-1">
          <p className="font-schibsted font-semibold text-sm text-neutral-700 dark:text-neutral-300">
            New Template
          </p>
          <p className="font-schibsted text-xs text-neutral-400">
            Create a reusable reply template with dynamic variables
          </p>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <IconChevronDown size={15} className="text-neutral-400" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-4">

              {/* Name */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300 font-medium">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Welcome Response"
                  disabled={isBusy}
                  required
                  className={inputClass}
                />
              </div>

              {/* Subject */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300 font-medium">
                  Email Subject
                </label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Re: {subject}"
                  disabled={isBusy}
                  className={inputClass}
                />
              </div>

              {/* Variable chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-schibsted text-neutral-500 flex items-center gap-1 mr-1">
                  <IconVariable size={12} /> Insert variable:
                </span>
                {VARS.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    title={v.desc}
                    disabled={isBusy}
                    onClick={() => insertVar(v.key)}
                    className="px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {v.key}
                  </button>
                ))}
              </div>

              {/* Body editor */}
              <BodyEditor
                value={body}
                onChange={setBody}
                disabled={isBusy}
              />

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isBusy || !name.trim() || !body.trim()}
                  className={`relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-schibsted text-sm font-medium transition-all duration-200 overflow-hidden min-w-[140px] ${
                    status === "success"
                      ? "bg-green-600 text-white"
                      : "bg-sky-600 hover:bg-sky-700 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <AnimatePresence mode="wait">
                    {status === "loading" && (
                      <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" /> Creating...
                      </motion.span>
                    )}
                    {status === "success" && (
                      <motion.span key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        <IconCheck size={15} /> Created!
                      </motion.span>
                    )}
                    {status === "idle" && (
                      <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        <IconPlus size={15} /> Create Template
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <button
                  type="button"
                  disabled={isBusy || !body.trim()}
                  onClick={() => setPreviewing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-schibsted text-sm font-medium transition-colors duration-150 disabled:opacity-50 cursor-pointer"
                >
                  <IconEye size={14} /> Preview
                </button>

                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => { setOpen(false); setName(""); setSubject(""); setBody(""); }}
                  className="px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-schibsted text-sm font-medium transition-colors duration-150 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview modal */}
      <AnimatePresence>
        {previewing && (
          <PreviewModal
            name={name || "New Template"}
            subject={subject}
            body={body}
            onClose={() => setPreviewing(false)}
          />
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Template Card ──────────────────────────────────────────────────────────────

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
  const [previewing, setPreviewing] = useState(false);
  const [editName, setEditName] = useState(template.name);
  const [editSubject, setEditSubject] = useState(template.subject);
  const [editBody, setEditBody] = useState(template.body);
  const [saveStatus, setSaveStatus] = useState<FormStatus>("idle");
  const [delStatus, setDelStatus] = useState<FormStatus>("idle");

  const isBusy = saveStatus !== "idle" || delStatus !== "idle";

  const insertVar = (v: string) => setEditBody((b) => b + v);

  const startEdit = () => {
    setEditName(template.name);
    setEditSubject(template.subject);
    setEditBody(template.htmlBody ? template.htmlBody : template.body);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!editName.trim() || !editBody.trim()) return;
    setSaveStatus("loading");
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
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      onUpdate(updated);
      setSaveStatus("success");
      toast.success("Template saved");
      setTimeout(() => { setSaveStatus("idle"); setEditing(false); }, 1000);
    } catch {
      setSaveStatus("idle");
      toast.error("Failed to save template");
    }
  };

  const handleDelete = async () => {
    setDelStatus("loading");
    try {
      const res = await fetch(`/api/email-templates/${template._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Template deleted");
      setTimeout(() => onDelete(template._id), 350);
    } catch {
      setDelStatus("idle");
      toast.error("Failed to delete template");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors duration-100 focus:border-sky-600 outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        <Card>
          <CardContent className="p-0">
            <AnimatePresence mode="wait" initial={false}>
              {!editing ? (
                /* ── View mode ── */
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 flex items-start gap-4"
                >
                  {/* Icon */}
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center mt-0.5">
                    <IconTemplate size={16} className="text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-schibsted font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
                      {template.name}
                    </p>
                    {template.subject && (
                      <p className="font-schibsted text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                        Subject: {template.subject}
                      </p>
                    )}
                    <p className="font-schibsted text-xs text-neutral-400 mt-1.5 line-clamp-2 font-mono leading-relaxed">
                      {template.body}
                    </p>

                    {/* Variable tags detected */}
                    {(() => {
                      const found = VARS.filter((v) => template.body.includes(v.key));
                      if (!found.length) return null;
                      return (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {found.map((v) => (
                            <span
                              key={v.key}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500"
                            >
                              {v.key}
                            </span>
                          ))}
                          {template.htmlBody && (
                            <span className="text-[10px] font-schibsted px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 flex items-center gap-1">
                              <IconCode size={10} /> HTML
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-1">
                    <button
                      type="button"
                      title="Preview"
                      onClick={() => setPreviewing(true)}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer focus:outline-none"
                    >
                      <IconEye size={15} />
                    </button>
                    <button
                      type="button"
                      title="Edit"
                      disabled={isBusy}
                      onClick={startEdit}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer focus:outline-none disabled:opacity-50"
                    >
                      <IconPencil size={14} />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      disabled={isBusy}
                      onClick={handleDelete}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer focus:outline-none disabled:opacity-50"
                    >
                      {delStatus === "loading"
                        ? <Loader2 size={14} className="animate-spin" />
                        : <IconTrash size={14} />}
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ── Edit mode ── */
                <motion.div
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 space-y-4"
                >
                  <p className="font-schibsted font-semibold text-sm text-neutral-700 dark:text-neutral-300">
                    Editing — {template.name}
                  </p>

                  {/* Name */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-schibsted font-medium text-neutral-600 dark:text-neutral-400">Template Name</label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Template name"
                      disabled={isBusy}
                      className={inputClass}
                    />
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-schibsted font-medium text-neutral-600 dark:text-neutral-400">Email Subject</label>
                    <input
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      placeholder="e.g. Re: {subject}"
                      disabled={isBusy}
                      className={inputClass}
                    />
                  </div>

                  {/* Variable chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-schibsted text-neutral-500 flex items-center gap-1 mr-1">
                      <IconVariable size={12} /> Insert:
                    </span>
                    {VARS.map((v) => (
                      <button
                        key={v.key}
                        type="button"
                        title={v.desc}
                        disabled={isBusy}
                        onClick={() => insertVar(v.key)}
                        className="px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {v.key}
                      </button>
                    ))}
                  </div>

                  {/* Body editor with toggle */}
                  <BodyEditor
                    value={editBody}
                    onChange={setEditBody}
                    disabled={isBusy}
                  />

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isBusy || !editName.trim() || !editBody.trim()}
                      className={`relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-schibsted text-sm font-medium transition-all duration-200 min-w-[110px] ${
                        saveStatus === "success"
                          ? "bg-green-600 text-white"
                          : "bg-sky-600 hover:bg-sky-700 text-white"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <AnimatePresence mode="wait">
                        {saveStatus === "loading" && (
                          <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                            <Loader2 className="size-4 animate-spin" /> Saving...
                          </motion.span>
                        )}
                        {saveStatus === "success" && (
                          <motion.span key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                            <IconCheck size={15} /> Saved!
                          </motion.span>
                        )}
                        {saveStatus === "idle" && (
                          <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                            <IconCheck size={15} /> Save
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewing(true)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-schibsted text-sm font-medium transition-colors duration-150 disabled:opacity-50 cursor-pointer"
                    >
                      <IconEye size={14} /> Preview
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      disabled={isBusy}
                      className="px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-schibsted text-sm font-medium transition-colors duration-150 disabled:opacity-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preview modal */}
      <AnimatePresence>
        {previewing && (
          <PreviewModal
            name={editing ? editName : template.name}
            subject={editing ? editSubject : template.subject}
            body={editing ? editBody : (template.htmlBody ? template.htmlBody : template.body)}
            onClose={() => setPreviewing(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/email-templates")
      .then((r) => r.json())
      .then(setTemplates)
      .catch(() => toast.error("Could not load templates"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="border border-neutral-400 rounded-lg p-4 min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="border border-neutral-400 rounded-lg p-4 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <Heading
          variant="muted"
          className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2"
        >
          <IconTemplate size={22} className="shrink-0" />
          Email Templates
        </Heading>
        <Paragraph className="text-sm text-neutral-600 dark:text-neutral-400">
          Create and manage reusable email templates. Your Slack team can pick a
          template, edit it, and send a polished reply — variables like{" "}
          <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono">
            {"{name}"}
          </code>{" "}
          are auto-filled from the email data.
        </Paragraph>
      </div>

      <div className="max-w-3xl space-y-6">

        {/* Variable Reference Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconVariable size={17} />
              Supported Variables
            </CardTitle>
            <CardDescription>
              Click any variable to copy it. Use these in your subject or body.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {VARS.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(v.key);
                    toast.success(`${v.key} copied!`);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors text-left cursor-pointer group border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
                >
                  <code className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:border-sky-300 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                    {v.key}
                  </code>
                  <span className="text-xs font-schibsted text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                    {v.desc}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card>
          <CardHeader>
            <CardTitle>How it works in Slack</CardTitle>
            <CardDescription>
              When an email arrives in Slack, your team sees a{" "}
              <strong>📋 Templates</strong> button. Clicking it opens a modal
              listing your templates. After selecting one, a pre-filled reply
              modal opens — the agent can edit the text and hit{" "}
              <strong>✉️ Send Email</strong>. The customer receives a properly
              formatted email.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Template list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="font-schibsted font-semibold text-sm text-neutral-700 dark:text-neutral-300">
              {templates.length} Template{templates.length !== 1 ? "s" : ""}
            </p>
          </div>

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

          {/* Add form */}
          <AddTemplateCard
            onAdd={(t) => setTemplates((prev) => [t, ...prev])}
          />
        </div>
      </div>
    </div>
  );
}
