



"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomLink } from "@/components/CustomLink";
import { AnimatedSubmitButton } from "@/components/ui/AnimatedSubmitButton";
import { AnimatedDeleteButton } from "@/components/ui/AnimatedDeleteButton";
import { AnimatedButton } from "@/components/dashboard/DomainsTable";
import {
  IconTemplate,
  IconTrash,
  IconPencil,
  IconEye,
  IconPlus,
  IconX,
  IconCheck,
  IconVariable,
  IconChevronDown,
  IconCode,
  IconTerminal,
  IconTable,
  IconInfoCircle,
} from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EmailTemplate = {
  _id: string;
  name: string;
  subject: string;
  body: string;
  htmlBody?: string;
  createdAt: string;
};

type FormStatus = "idle" | "loading" | "success";
type PageTab = "templates" | "add" | "edit" | "delete";

// ─── Easing ───────────────────────────────────────────────────────────────────

const easeOutQuint = [0.23, 1, 0.32, 1] as const;
const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;

// ─── Variables ────────────────────────────────────────────────────────────────

const VARS = [
  { key: "{name}",    desc: "Customer name" },
  { key: "{email}",   desc: "Customer email" },
  { key: "{subject}", desc: "Email subject" },
  { key: "{date}",    desc: "Today's date" },
  { key: "{agent}",   desc: "Agent name" },
  { key: "[message]...[/message]", desc: "Slack editable region" },
];

// ─── Page Tabs ────────────────────────────────────────────────────────────────

const PAGE_TABS: { id: PageTab; label: string; icon: React.ReactNode }[] = [
  { id: "add",       label: "Add Template",  icon: <IconPlus size={15} /> },
  { id: "templates", label: "Templates",     icon: <IconTable size={15} /> },
  { id: "edit",      label: "Edit",          icon: <IconPencil size={15} /> },
  { id: "delete",    label: "Delete",        icon: <IconTrash size={15} /> },
];

// ─── Preview Modal ────────────────────────────────────────────────────────────

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

  const sampleVars = (text: string) =>
    text
      .replace(/\{name\}/g, "Jane Smith")
      .replace(/\{email\}/g, "jane@example.com")
      .replace(/\{subject\}/g, subject || "Support Request")
      .replace(/\{date\}/g, new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }))
      .replace(/\{agent\}/g, "Alex (Support)")
      .replace(/\[message\]([\s\S]*?)\[\/message\]/ig, (_, m) => m);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 23 }}
        className="relative z-10 w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <p className="text-sm font-schibsted font-semibold text-neutral-900 dark:text-neutral-100">
              Preview — {name || "Template"}
            </p>
            <p className="text-xs font-schibsted text-neutral-500 mt-0.5">
              Variables filled with sample data
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
          >
            <IconX size={15} className="text-neutral-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 p-4 space-y-3">
            <div className="flex gap-2">
              <span className="text-xs font-schibsted font-semibold text-neutral-500 w-14 shrink-0">Subject:</span>
              <span className="text-xs font-schibsted text-neutral-800 dark:text-neutral-200">
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

// ─── Body Editor ──────────────────────────────────────────────────────────────

function BodyEditor({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-schibsted font-semibold text-neutral-500 dark:text-neutral-400">Body</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={10}
        placeholder={`Hi {name},\n\nThank you for reaching out about "{subject}".\n\n...\n\n-- OR wrap HTML --\n<html>...[message]Hi {name}...[/message]...</html>`}
        className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-xs font-mono text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors focus:border-sky-600 outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {/* Info callout — matches sky callout style from aliases page */}
      <div className="text-xs font-schibsted text-sky-800 dark:text-sky-200 bg-sky-50 dark:bg-sky-900/20 px-3 py-3 rounded-lg border border-sky-100 dark:border-sky-800 space-y-1.5">
        <p className="font-semibold flex items-center gap-1.5 text-sky-900 dark:text-sky-100">
          <IconTerminal size={13} /> Smart Slack Integration
        </p>
        <ul className="list-disc pl-4 space-y-1 text-sky-700 dark:text-sky-300">
          <li><strong>Plain Text:</strong> Write normal text. Fully editable in Slack.</li>
          <li>
            <strong>Editable HTML:</strong> Wrap message in{" "}
            <code className="font-mono bg-white/60 dark:bg-sky-900/50 border border-sky-200 dark:border-sky-700 px-1 rounded text-[10px]">
              {"[message]...[/message]"}
            </code>{" "}
            — only that region is editable in Slack.
          </li>
          <li><strong>Static HTML:</strong> HTML without tags sends exactly as designed.</li>
        </ul>
      </div>
    </div>
  );
}

// ─── Variable Chips ───────────────────────────────────────────────────────────

function VarChips({ onInsert, disabled }: { onInsert: (v: string) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs font-schibsted text-neutral-500 flex items-center gap-1 mr-1">
        <IconVariable size={12} /> Insert:
      </span>
      {VARS.map((v) => (
        <button
          key={v.key}
          type="button"
          title={v.desc}
          disabled={disabled}
          onClick={() => onInsert(v.key)}
          className="px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer disabled:opacity-50"
        >
          {v.key}
        </button>
      ))}
    </div>
  );
}

// ─── Templates Table (view mode) ──────────────────────────────────────────────

function TemplatesTable({
  templates,
  mode,
  onEdit,
  onDelete,
  onPreview,
}: {
  templates: EmailTemplate[];
  mode: "view" | "edit" | "delete";
  onEdit?: (t: EmailTemplate) => void;
  onDelete: (id: string) => void;
  onPreview?: (t: EmailTemplate) => void;
}) {
  const columns =
    mode === "view"
      ? ["Name", "Subject", "Variables", "Created", "Actions"]
      : mode === "edit"
      ? ["Name", "Subject", "Variables", "Created", "Edit"]
      : ["Name", "Subject", "Variables", "Created", "Delete"];

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-900 dark:border-neutral-700">
      <table className="min-w-full text-xs font-schibsted">
        <thead>
          <tr>
            {columns.map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-left font-schibsted bg-linear-to-b from-sky-700 to-cyan-600 text-neutral-50"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {templates.map((t) => {
            const foundVars = VARS.filter((v) => t.body.includes(v.key));
            return (
              <tr
                key={t._id}
                className="border-t border-neutral-900 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors duration-150"
              >
                {/* Name */}
                <td className="px-3 py-2 font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">
                  <div className="flex items-center gap-2">
                    <div className="shrink-0 w-6 h-6 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center">
                      <IconTemplate size={12} className="text-white" />
                    </div>
                    {t.name}
                  </div>
                </td>

                {/* Subject */}
                <td className="px-3 py-2 font-schibsted text-neutral-500 dark:text-neutral-400 max-w-[180px] truncate">
                  {t.subject || "—"}
                </td>

                {/* Variables */}
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {foundVars.length === 0 ? (
                      <span className="text-neutral-400">—</span>
                    ) : (
                      foundVars.slice(0, 3).map((v) => (
                        <span
                          key={v.key}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500"
                        >
                          {v.key}
                        </span>
                      ))
                    )}
                    {t.htmlBody && (
                      <span className="text-[10px] font-schibsted px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 flex items-center gap-1">
                        <IconCode size={9} /> HTML
                      </span>
                    )}
                  </div>
                </td>

                {/* Created */}
                <td className="px-3 py-2 font-schibsted text-neutral-500 dark:text-neutral-400 tabular-nums">
                  {new Date(t.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>

                {/* Actions column */}
                {mode === "view" && (
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onPreview?.(t)}
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-schibsted text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
                      >
                        <IconEye size={11} /> Preview
                      </button>
                    </div>
                  </td>
                )}

                {mode === "edit" && (
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(t)}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-schibsted text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
                    >
                      <IconPencil size={11} /> Edit
                    </button>
                  </td>
                )}

                {mode === "delete" && (
                  <td className="px-3 py-2">
                    <AnimatedDeleteButton
                      onDelete={async () => {
                        try {
                          const res = await fetch(`/api/email-templates/${t._id}`, { method: "DELETE" });
                          if (!res.ok) throw new Error("Failed");
                          toast.success("Template deleted");
                          setTimeout(() => onDelete(t._id), 400);
                          return "success";
                        } catch {
                          toast.error("Failed to delete template");
                          return "error";
                        }
                      }}
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({
  template,
  onClose,
  onUpdate,
}: {
  template: EmailTemplate;
  onClose: () => void;
  onUpdate: (t: EmailTemplate) => void;
}) {
  const [name, setName] = useState(template.name);
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.htmlBody ?? template.body);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [previewing, setPreviewing] = useState(false);

  const isBusy = status !== "idle";

  const inputClass =
    "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors focus:border-sky-600 outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const handleSave = async () => {
    if (!name.trim() || !body.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch(`/api/email-templates/${template._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), subject: subject.trim(), body: body.trim() }),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      onUpdate(updated);
      setStatus("success");
      toast.success("Template saved");
      setTimeout(() => { setStatus("idle"); onClose(); }, 1000);
    } catch {
      setStatus("idle");
      toast.error("Failed to save template");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 23 }}
        className="relative z-10 w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 sticky top-0 bg-white dark:bg-neutral-900 z-10">
          <div>
            <p className="text-sm font-schibsted font-semibold text-neutral-900 dark:text-neutral-100">
              Edit Template
            </p>
            <p className="text-xs font-schibsted text-neutral-500 mt-0.5">{template.name}</p>
          </div>
          <button type="button" onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none">
            <IconX size={15} className="text-neutral-500" />
          </button>
        </div>

        {/* Form */}
        <div className="px-5 py-4 space-y-4">
          {/* Name */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400">
              Template Name <span className="text-red-500">*</span>
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Welcome Response" disabled={isBusy} className={inputClass} />
          </div>

          {/* Subject */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400">Email Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Re: {subject}" disabled={isBusy} className={inputClass} />
          </div>

          {/* Var chips */}
          <VarChips onInsert={(v) => setBody((b) => b + v)} disabled={isBusy} />

          {/* Body */}
          <BodyEditor value={body} onChange={setBody} disabled={isBusy} />

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1 pb-2">
            <AnimatedButton
              idleLabel="Save"
              loadingLabel="Saving..."
              successLabel="Saved!"
              errorLabel="Failed"
              idleIcon={<IconCheck size={13} />}
              state={status === "loading" ? "loading" : status === "success" ? "success" : "idle"}
              onClick={handleSave}
              idleWidth={80}
              loadingWidth={90}
              successWidth={76}
              errorWidth={72}
              className="px-3 py-2 rounded-md text-xs font-schibsted text-white bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center gap-1.5 overflow-hidden border-0 focus:outline-none cursor-pointer disabled:opacity-60"
            />
            <button
              type="button"
              disabled={isBusy}
              onClick={() => setPreviewing(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-schibsted font-semibold text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-600 hover:text-neutral-900 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none disabled:opacity-50"
            >
              <IconEye size={13} /> Preview
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={onClose}
              className="px-3 py-2 rounded-md text-xs font-schibsted text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer focus:outline-none disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {previewing && (
          <PreviewModal name={name} subject={subject} body={body} onClose={() => setPreviewing(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15, ease: easeOutCubic }}
      className="flex flex-col items-center justify-center py-12 px-6 gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center opacity-40">
        <IconTemplate size={18} className="text-white" />
      </div>
      <Paragraph variant="muted" className="text-center max-w-sm">
        No templates yet. Go to Add Template to create your first one.{" "}
        <CustomLink href="/docs/email-templates" className="text-sky-800 underline font-schibsted font-bold">
          Read our docs
        </CustomLink>
      </Paragraph>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TemplatesSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
      ))}
    </div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PageTab>("add");

  // Add form state
  const [addName, setAddName] = useState("");
  const [addSubject, setAddSubject] = useState("");
  const [addBody, setAddBody] = useState("");
  const [addStatus, setAddStatus] = useState<FormStatus>("idle");
  const [addPreviewing, setAddPreviewing] = useState(false);

  // Edit modal
  const [editTarget, setEditTarget] = useState<EmailTemplate | null>(null);

  // Preview (view tab)
  const [previewTarget, setPreviewTarget] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    fetch("/api/email-templates")
      .then((r) => r.json())
      .then(setTemplates)
      .catch(() => toast.error("Could not load templates"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: string) => setTemplates((prev) => prev.filter((t) => t._id !== id));
  const handleUpdate = (updated: EmailTemplate) =>
    setTemplates((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addBody.trim() || addStatus !== "idle") return;
    setAddStatus("loading");
    try {
      const res = await fetch("/api/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: addName.trim(), subject: addSubject.trim(), body: addBody.trim() }),
      });
      if (!res.ok) throw new Error("Failed");
      const created = await res.json();
      setTemplates((prev) => [created, ...prev]);
      setAddStatus("success");
      toast.success("Template created!");
      setActiveTab("templates");
      setAddName(""); setAddSubject(""); setAddBody("");
      setTimeout(() => setAddStatus("idle"), 2000);
    } catch {
      setAddStatus("idle");
      toast.error("Failed to create template");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors focus:border-sky-600 outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-6 border border-neutral-400 rounded-lg p-4 min-h-screen">

      {/* Page Heading */}
      <div>
        <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
          Email Templates
        </Heading>
        <Paragraph className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Create reusable reply templates for your Slack team. Variables like{" "}
          <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono">{"{name}"}</code>{" "}
          are auto-filled from incoming email data.
        </Paragraph>
      </div>

      {/* Main tabbed card */}
      <Card className="min-h-[300px] overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center gap-1.5 pb-4 border-b border-neutral-100 dark:border-neutral-800 flex-wrap">
          {PAGE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-schibsted font-semibold transition-all duration-150 focus:outline-none cursor-pointer ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              {activeTab === tab.id && (
                <motion.span
                  layoutId="email-tab-bg"
                  className="absolute inset-0 bg-gradient-to-r from-sky-800 to-cyan-700 rounded-lg z-0 shadow-sm"
                  transition={{ type: "spring", stiffness: 280, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          <AnimatePresence mode="wait" initial={false}>

            {/* ── Templates tab ── */}
            {activeTab === "templates" && (
              <motion.div key="templates"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                {loading ? <TemplatesSkeleton /> : templates.length === 0 ? <EmptyState /> : (
                  <>
                    {/* Variable reference row */}
                    <div className="mb-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40 px-4 py-3">
                      <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mb-2">
                        <IconVariable size={12} /> Available Variables — click to copy
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {VARS.map((v) => (
                          <button
                            key={v.key}
                            type="button"
                            title={v.desc}
                            onClick={() => { navigator.clipboard.writeText(v.key); toast.success(`${v.key} copied!`); }}
                            className="px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                          >
                            {v.key}
                          </button>
                        ))}
                      </div>
                    </div>

                    <TemplatesTable
                      templates={templates}
                      mode="view"
                      onDelete={handleDelete}
                      onPreview={(t) => setPreviewTarget(t)}
                    />
                  </>
                )}
              </motion.div>
            )}

            {/* ── Add tab ── */}
            {activeTab === "add" && (
              <motion.div key="add"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                <form onSubmit={handleAddSubmit} className="space-y-4 max-w-2xl">
                  {/* Name */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400">
                      Template Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={addName}
                      onChange={(e) => setAddName(e.target.value)}
                      placeholder="e.g. Welcome Response"
                      required
                      disabled={addStatus !== "idle"}
                      className={inputClass}
                    />
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400">
                      Email Subject
                    </label>
                    <input
                      value={addSubject}
                      onChange={(e) => setAddSubject(e.target.value)}
                      placeholder="e.g. Re: {subject}"
                      disabled={addStatus !== "idle"}
                      className={inputClass}
                    />
                  </div>

                  {/* Var chips */}
                  <VarChips onInsert={(v) => setAddBody((b) => b + v)} disabled={addStatus !== "idle"} />

                  {/* Body */}
                  <BodyEditor value={addBody} onChange={setAddBody} disabled={addStatus !== "idle"} />

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <AnimatedSubmitButton
                      idleLabel="Create Template"
                      loadingLabel="Creating..."
                      successLabel="Created!"
                      idleIcon={<IconPlus size={14} strokeWidth={2.5} />}
                      state={addStatus}
                      idleWidth={140}
                      loadingWidth={110}
                      successWidth={100}
                      disabled={addStatus !== "idle" || !addName.trim() || !addBody.trim()}
                      className="font-schibsted px-4 py-2 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 text-white border-0 focus:outline-none cursor-pointer flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      disabled={addStatus !== "idle" || !addBody.trim()}
                      onClick={() => setAddPreviewing(true)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-schibsted font-semibold text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-600 hover:text-neutral-900 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none disabled:opacity-50"
                    >
                      <IconEye size={13} /> Preview
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── Edit tab ── */}
            {activeTab === "edit" && (
              <motion.div key="edit"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                {loading ? <TemplatesSkeleton /> : templates.length === 0 ? <EmptyState /> : (
                  <>
                    <p className="text-xs font-schibsted text-neutral-400 mb-3">Click Edit on a row to modify that template.</p>
                    <TemplatesTable
                      templates={templates}
                      mode="edit"
                      onEdit={(t) => setEditTarget(t)}
                      onDelete={handleDelete}
                    />
                  </>
                )}
              </motion.div>
            )}

            {/* ── Delete tab ── */}
            {activeTab === "delete" && (
              <motion.div key="delete"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                {loading ? <TemplatesSkeleton /> : templates.length === 0 ? <EmptyState /> : (
                  <>
                    <p className="text-xs font-schibsted text-neutral-400 mb-3">Delete a template permanently.</p>
                    <TemplatesTable
                      templates={templates}
                      mode="delete"
                      onDelete={handleDelete}
                    />
                  </>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </Card>

      {/* Edit modal */}
      <AnimatePresence>
        {editTarget && (
          <EditModal
            template={editTarget}
            onClose={() => setEditTarget(null)}
            onUpdate={(t) => { handleUpdate(t); setEditTarget(null); }}
          />
        )}
      </AnimatePresence>

      {/* Preview modal (view tab) */}
      <AnimatePresence>
        {previewTarget && (
          <PreviewModal
            name={previewTarget.name}
            subject={previewTarget.subject}
            body={previewTarget.htmlBody ?? previewTarget.body}
            onClose={() => setPreviewTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* Preview modal (add tab) */}
      <AnimatePresence>
        {addPreviewing && (
          <PreviewModal
            name={addName || "New Template"}
            subject={addSubject}
            body={addBody}
            onClose={() => setAddPreviewing(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}