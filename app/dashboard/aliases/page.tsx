// 'use client';

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// type DomainOption = {
//   id: string;
//   domain: string;
// };

// type Alias = {
//   id: string;
//   localPart: string;
//   email: string;
//   status: string;
//   domain: string;
//   integrationId: string | null;
//   integrationName?: string | null;
//   integrationType?: string | null;
//   createdAt: string;
// };

// type IntegrationOption = {
//   id: string;
//   name: string;
//   type: "slack" | "discord";
// };

// export default function AliasesPage() {
//   const [domains, setDomains] = useState<DomainOption[]>([]);
//   const [aliases, setAliases] = useState<Alias[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [selectedDomainId, setSelectedDomainId] = useState<string>("");
//   const [localPart, setLocalPart] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [integrations, setIntegrations] = useState<IntegrationOption[]>([]);
//   const [selectedIntegrationId, setSelectedIntegrationId] = useState<string>("");

//   // Inline editing state: aliasId → selected integrationId
//   const [editingIntegration, setEditingIntegration] = useState<Record<string, string>>({});
//   const [savingId, setSavingId] = useState<string | null>(null);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [togglingId, setTogglingId] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchInitial = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const [domainsRes, aliasesRes, integrationsRes] = await Promise.all([
//           fetch("/api/domains"),
//           fetch("/api/aliases"),
//           fetch("/api/integrations"),
//         ]);

//         if (!domainsRes.ok) throw new Error("Failed to load domains");
//         if (!aliasesRes.ok) throw new Error("Failed to load aliases");
//         if (!integrationsRes.ok) throw new Error("Failed to load integrations");

//         const domainsData = await domainsRes.json();
//         const aliasesData: Alias[] = await aliasesRes.json();
//         const integrationsData = await integrationsRes.json();

//         setDomains(domainsData.map((d: any) => ({ id: d.id, domain: d.domain })));
//         setAliases(aliasesData);

//         if (domainsData.length > 0) setSelectedDomainId(domainsData[0].id);

//         const mapped = integrationsData.map((i: any) => ({
//           id: i.id,
//           name: i.name,
//           type: i.type,
//         }));
//         setIntegrations(mapped);
//         if (mapped.length > 0) setSelectedIntegrationId(mapped[0].id);

//         // Pre-fill edit dropdowns to current integration per alias
//         const editState: Record<string, string> = {};
//         aliasesData.forEach((a) => { editState[a.id] = a.integrationId ?? ""; });
//         setEditingIntegration(editState);
//       } catch (err) {
//         console.error(err);
//         setError("Could not load aliases or domains. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitial();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedDomainId || !localPart.trim()) return;

//     try {
//       setSubmitting(true);
//       setError(null);

//       const res = await fetch("/api/aliases", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           domainId: selectedDomainId,
//           localPart: localPart.trim(),
//           integrationId: selectedIntegrationId || undefined,
//         }),
//       });

//       if (!res.ok) {
//         const body = await res.json().catch(() => ({}));
//         throw new Error(body.error || "Failed to create alias");
//       }

//       const created: Alias = await res.json();
//       setAliases((prev) => [created, ...prev]);
//       setEditingIntegration((prev) => ({ ...prev, [created.id]: created.integrationId ?? "" }));
//       setLocalPart("");
//       toast.success(`Alias ${created.email} created`);
//     } catch (err) {
//       const msg = err instanceof Error ? err.message : "Failed to create alias.";
//       setError(msg);
//       toast.error(msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (alias: Alias) => {
//     if (!confirm(`Delete alias "${alias.email}"? This cannot be undone.`)) return;
//     setDeletingId(alias.id);
//     try {
//       const res = await fetch(`/api/aliases/${alias.id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error((await res.json()).error || "Failed to delete");
//       setAliases((prev) => prev.filter((a) => a.id !== alias.id));
//       toast.success(`Alias "${alias.email}" deleted`);
//     } catch (err: any) {
//       toast.error(err.message || "Failed to delete alias");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const handleSaveIntegration = async (alias: Alias) => {
//     const newIntegrationId = editingIntegration[alias.id] ?? "";
//     setSavingId(alias.id);
//     try {
//       const res = await fetch(`/api/aliases/${alias.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ integrationId: newIntegrationId || null }),
//       });
//       if (!res.ok) throw new Error((await res.json()).error || "Failed to update");
//       const updated: Alias = await res.json();
//       setAliases((prev) => prev.map((a) => (a.id === alias.id ? updated : a)));
//       toast.success("Integration updated");
//     } catch (err: any) {
//       toast.error(err.message || "Failed to update integration");
//     } finally {
//       setSavingId(null);
//     }
//   };

//   const handleToggleStatus = async (alias: Alias) => {
//     const newStatus = alias.status === "active" ? "inactive" : "active";
//     setTogglingId(alias.id);
//     try {
//       const res = await fetch(`/api/aliases/${alias.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });
//       if (!res.ok) throw new Error((await res.json()).error || "Failed to update status");
//       const updated: Alias = await res.json();
//       setAliases((prev) => prev.map((a) => (a.id === alias.id ? updated : a)));
//       toast.success(`Alias ${newStatus === "active" ? "enabled" : "disabled"}`);
//     } catch (err: any) {
//       toast.error(err.message || "Failed to update status");
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-semibold">Aliases</h1>
//         <p className="text-sm text-neutral-600">
//           Create aliases for your domains. Each alias is stored in MongoDB and linked to a domain.
//         </p>
//       </div>

//       {/* Create form */}
//       <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
//         <label className="text-sm font-medium text-neutral-700">Domain</label>
//         <select
//           value={selectedDomainId}
//           onChange={(e) => setSelectedDomainId(e.target.value)}
//           className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
//         >
//           {domains.length === 0 ? (
//             <option value="">No domains available</option>
//           ) : (
//             domains.map((d) => (
//               <option key={d.id} value={d.id}>
//                 {d.domain}
//               </option>
//             ))
//           )}
//         </select>

//         <label className="mt-3 text-sm font-medium text-neutral-700">Local part</label>
//         <input
//           type="text"
//           value={localPart}
//           onChange={(e) => setLocalPart(e.target.value)}
//           placeholder="support"
//           className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
//         />

//         <label className="mt-3 text-sm font-medium text-neutral-700">
//           Target integration (optional)
//         </label>
//         <select
//           value={selectedIntegrationId}
//           onChange={(e) => setSelectedIntegrationId(e.target.value)}
//           className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
//         >
//           <option value="">None</option>
//           {integrations.map((i) => (
//             <option key={i.id} value={i.id}>
//               {i.name} ({i.type})
//             </option>
//           ))}
//         </select>

//         <Button
//           type="submit"
//           disabled={submitting || domains.length === 0}
//           className="mt-3 self-start"
//         >
//           {submitting ? "Adding..." : "Add Alias"}
//         </Button>
//       </form>

//       {error && (
//         <p className="text-sm text-red-600" role="alert">
//           {error}
//         </p>
//       )}

//       {/* Aliases table */}
//       <div className="border border-neutral-200 rounded-lg overflow-x-auto">
//         <table className="min-w-full text-sm">
//           <thead className="bg-neutral-50">
//             <tr>
//               <th className="px-4 py-2 text-left font-medium text-neutral-700">Email</th>
//               <th className="px-4 py-2 text-left font-medium text-neutral-700">Local part</th>
//               <th className="px-4 py-2 text-left font-medium text-neutral-700">Domain</th>
//               <th className="px-4 py-2 text-left font-medium text-neutral-700">Status</th>
//               <th className="px-4 py-2 text-left font-medium text-neutral-700">Created</th>
//               <th className="px-4 py-2 text-left font-medium text-neutral-700">Integration</th>
//               <th className="px-4 py-2 text-left font-medium text-neutral-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
//                   Loading aliases...
//                 </td>
//               </tr>
//             ) : aliases.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
//                   No aliases yet. Create one using the form above.
//                 </td>
//               </tr>
//             ) : (
//               aliases.map((a) => {
//                 const currentEdit = editingIntegration[a.id] ?? a.integrationId ?? "";
//                 const isDirty = currentEdit !== (a.integrationId ?? "");

//                 return (
//                   <tr key={a.id} className={`border-t border-neutral-200 ${a.status === "inactive" ? "opacity-50" : ""}`}>
//                     <td className="px-4 py-2 font-mono">{a.email}</td>
//                     <td className="px-4 py-2">{a.localPart}</td>
//                     <td className="px-4 py-2">{a.domain}</td>
//                     <td className="px-4 py-2">
//                       <span
//                         className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${a.status === "active"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-neutral-100 text-neutral-600"
//                           }`}
//                       >
//                         {a.status === "active" ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="px-4 py-2 text-neutral-500">
//                       {new Date(a.createdAt).toLocaleString()}
//                     </td>

//                     {/* Editable integration dropdown */}
//                     <td className="px-4 py-2">
//                       <div className="flex items-center gap-2">
//                         <select
//                           value={currentEdit}
//                           onChange={(e) =>
//                             setEditingIntegration((prev) => ({
//                               ...prev,
//                               [a.id]: e.target.value,
//                             }))
//                           }
//                           className="rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-700"
//                           disabled={savingId === a.id}
//                         >
//                           <option value="">None</option>
//                           {integrations.map((i) => (
//                             <option key={i.id} value={i.id}>
//                               {i.name} ({i.type})
//                             </option>
//                           ))}
//                         </select>
//                         {isDirty && (
//                           <button
//                             onClick={() => handleSaveIntegration(a)}
//                             disabled={savingId === a.id}
//                             className="text-xs text-blue-600 hover:underline font-medium disabled:opacity-50"
//                           >
//                             {savingId === a.id ? "Saving..." : "Save"}
//                           </button>
//                         )}
//                       </div>
//                     </td>

//                     {/* Actions */}
//                     <td className="px-4 py-2">
//                       <div className="flex items-center gap-2">
//                         {/* Enable / Disable toggle */}
//                         <button
//                           onClick={() => handleToggleStatus(a)}
//                           disabled={togglingId === a.id}
//                           className={`text-xs font-medium px-2 py-1 rounded border transition-colors disabled:opacity-50 ${a.status === "active"
//                               ? "border-neutral-300 text-neutral-600 hover:bg-neutral-100"
//                               : "border-green-300 text-green-700 hover:bg-green-50"
//                             }`}
//                         >
//                           {togglingId === a.id
//                             ? "..."
//                             : a.status === "active"
//                               ? "Disable"
//                               : "Enable"}
//                         </button>

//                         {/* Delete */}
//                         <button
//                           onClick={() => handleDelete(a)}
//                           disabled={deletingId === a.id}
//                           className="text-xs font-medium px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
//                         >
//                           {deletingId === a.id ? "..." : "Delete"}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  IconCheck,
  IconTrash,
  IconPlus,
  IconX,
  IconMail,
  IconChevronDown,
  IconPlugConnected,
  IconToggleLeft,
  IconToggleRight,
  IconAt,
} from "@tabler/icons-react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import AnimatedDropdown from "@/components/ui/AnimatedDropdown";

// ─── Types ────────────────────────────────────────────────────────────────────

type DomainOption = {
  id: string;
  domain: string;
};

type Alias = {
  id: string;
  localPart: string;
  email: string;
  status: string;
  domain: string;
  integrationId: string | null;
  integrationName?: string | null;
  integrationType?: string | null;
  createdAt: string;
};

type IntegrationOption = {
  id: string;
  name: string;
  type: "slack" | "discord";
};

// ─── Easing ───────────────────────────────────────────────────────────────────

const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;
const easeOutQuint = [0.23, 1, 0.32, 1] as const;
const easeOutExpo = [0.19, 1, 0.22, 1] as const;
const easeInOutCirc = [0.785, 0.135, 0.15, 0.86] as const;
const easeOutQuart = [0.165, 0.84, 0.44, 1] as const;

// ─── Loader CSS ───────────────────────────────────────────────────────────────

const loaderStyle = `
  .alias-loader {
    width: 18px;
    height: 18px;
    --b: 3px;
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 1px;
    background: conic-gradient(#0000 10%, #ffffff) content-box;
    -webkit-mask:
      repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
      radial-gradient(farthest-side, #0000 calc(100% - var(--b) - 1px), #000 calc(100% - var(--b)));
    -webkit-mask-composite: destination-in;
    mask-composite: intersect;
    animation: alias-spin 1s infinite steps(10);
    flex-shrink: 0;
  }
  .alias-btn-loader {
    width: 13px;
    height: 13px;
    --b: 2px;
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 1px;
    background: conic-gradient(#0000 10%, currentColor) content-box;
    -webkit-mask:
      repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
      radial-gradient(farthest-side, #0000 calc(100% - var(--b) - 1px), #000 calc(100% - var(--b)));
    -webkit-mask-composite: destination-in;
    mask-composite: intersect;
    animation: alias-spin 1s infinite steps(10);
    flex-shrink: 0;
  }
  @keyframes alias-spin { to { transform: rotate(1turn); } }
`;

// ─── Animated Button ──────────────────────────────────────────────────────────

type BtnState = "idle" | "loading" | "success" | "error";

function AnimBtn({
  label,
  loadingLabel,
  successLabel,
  errorLabel,
  icon,
  onClick,
  state,
  widths,
  className,
  disabled,
}: {
  label: string;
  loadingLabel: string;
  successLabel: string;
  errorLabel?: string;
  icon: React.ReactNode;
  onClick: () => void;
  state: BtnState;
  widths: [number, number, number, number?]; // idle, loading, success, error
  className: string;
  disabled?: boolean;
}) {
  const width =
    state === "loading" ? widths[1]
    : state === "success" ? widths[2]
    : state === "error" ? (widths[3] ?? widths[0])
    : widths[0];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || state === "loading"}
      className={className}
      animate={{ width }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "loading" && (
          <motion.span key="loading"
            initial={{ opacity: 0.5, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0.4, y: -4 }}
            transition={{ duration: 0.15, ease: easeOutCubic }}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="alias-btn-loader" />
            <span>{loadingLabel}</span>
          </motion.span>
        )}
        {state === "success" && (
          <motion.span key="success"
            initial={{ opacity: 0.5, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0.4, y: -4 }}
            transition={{ duration: 0.2, ease: easeOutQuint }}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <IconCheck size={13} />
            <span>{successLabel}</span>
          </motion.span>
        )}
        {state === "error" && (
          <motion.span key="error"
            initial={{ opacity: 0.5, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0.4, y: -4 }}
            transition={{ duration: 0.15, ease: easeOutCubic }}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <IconX size={13} />
            <span>{errorLabel ?? "Failed"}</span>
          </motion.span>
        )}
        {state === "idle" && (
          <motion.span key="idle"
            initial={{ opacity: 0.5, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0.4, y: -4 }}
            transition={{ duration: 0.1, ease: easeOutCubic }}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            {icon}
            <span>{label}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Alias Card ───────────────────────────────────────────────────────────────

function AliasCard({
  alias,
  integrations,
  onDelete,
  onUpdate,
}: {
  alias: Alias;
  integrations: IntegrationOption[];
  onDelete: (id: string) => void;
  onUpdate: (updated: Alias) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteState, setDeleteState] = useState<BtnState>("idle");
  const [toggleState, setToggleState] = useState<BtnState>("idle");
  const [saveState, setSaveState] = useState<BtnState>("idle");
  const [editIntegration, setEditIntegration] = useState(alias.integrationId ?? "");

  const isActive = alias.status === "active";
  const isDirty = editIntegration !== (alias.integrationId ?? "");

  const handleDelete = async () => {
    if (!confirm(`Delete alias "${alias.email}"? This cannot be undone.`)) return;
    setIsOpen(false);
    setDeleteState("loading");
    try {
      const res = await fetch(`/api/aliases/${alias.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to delete");
      setDeleteState("success");
      toast.success(`Alias "${alias.email}" deleted`);
      setTimeout(() => onDelete(alias.id), 400);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete alias");
      setDeleteState("error");
      setTimeout(() => setDeleteState("idle"), 2000);
    }
  };

  const handleToggle = async () => {
    const newStatus = isActive ? "inactive" : "active";
    setToggleState("loading");
    try {
      const res = await fetch(`/api/aliases/${alias.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to update");
      const updated: Alias = await res.json();
      onUpdate(updated);
      setToggleState("success");
      toast.success(`Alias ${newStatus === "active" ? "enabled" : "disabled"}`);
      setTimeout(() => setToggleState("idle"), 1500);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
      setToggleState("error");
      setTimeout(() => setToggleState("idle"), 2000);
    }
  };

  const handleSaveIntegration = async () => {
    setSaveState("loading");
    try {
      const res = await fetch(`/api/aliases/${alias.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integrationId: editIntegration || null }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to update");
      const updated: Alias = await res.json();
      onUpdate(updated);
      setSaveState("success");
      toast.success("Integration updated");
      setTimeout(() => setSaveState("idle"), 1500);
    } catch (err: any) {
      toast.error(err.message || "Failed to update integration");
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 2000);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{
        opacity: deleteState === "success" ? 0 : isActive ? 1 : 0.6,
        scale: deleteState === "success" ? 0.97 : 1,
        y: 0,
      }}
      exit={{ opacity: 0, scale: 0.97, y: -8 }}
      transition={{ duration: 0.25, ease: easeOutCubic }}
    >
      <Card className={`border shadow-none transition-colors duration-150 rounded-md overflow-hidden ${
        isOpen
          ? "border-sky-600 dark:border-sky-800"
          : "border-sky-600 dark:border-neutral-700 hover:border-sky-800 dark:hover:border-neutral-600"
      }`}>
        <CardContent className="p-4 flex items-center gap-4">
          {/* Icon */}
          <div className="shrink-0 w-8 h-8 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center">
            <IconAt size={15} className="text-white" />
          </div>

          {/* Email + domain — clickable */}
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            className="flex-1 min-w-0 text-left cursor-pointer focus:outline-none"
          >
            <p className="font-schibsted font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
              {alias.email}
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              <Badge className={`border-0 font-schibsted tracking-tight ${
                isActive
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              }`}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
              {alias.integrationName && (
                <span className="text-xs font-schibsted text-neutral-500 dark:text-neutral-400 truncate">
                  → {alias.integrationName} ({alias.integrationType})
                </span>
              )}
            </div>
          </button>

          {/* Toggle */}
          <AnimBtn
            label={isActive ? "Disable" : "Enable"}
            loadingLabel="..."
            successLabel="Done!"
            errorLabel="Failed"
            icon={isActive ? <IconToggleRight size={13} /> : <IconToggleLeft size={13} />}
            onClick={handleToggle}
            state={toggleState}
            widths={[80, 56, 72, 72]}
            className={`shrink-0 px-3 py-1 rounded-md text-xs font-schibsted flex items-center justify-center gap-1.5 overflow-hidden border focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ${
              isActive
                ? "border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                : "border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
            }`}
          />

          {/* Chevron */}
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
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
          <AnimBtn
            label="Delete"
            loadingLabel="..."
            successLabel="Done"
            errorLabel="Failed"
            icon={<IconTrash size={13} />}
            onClick={handleDelete}
            state={deleteState}
            widths={[68, 56, 68, 72]}
            disabled={deleteState === "success"}
            className="shrink-0 px-3 py-1 rounded-md text-xs font-schibsted flex items-center justify-center gap-1.5 overflow-hidden border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          />
        </CardContent>

        {/* Expanded panel */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: easeOutQuint }}
              style={{ overflow: "hidden" }}
            >
              <motion.div
                layout
                transition={{ duration: 0.25, ease: easeOutQuart }}
                className="px-4 pb-4 pt-1 border-t border-neutral-100 dark:border-neutral-800 mt-1 space-y-4"
              >
                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Local Part</p>
                    <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">{alias.localPart}</p>
                  </div>
                  <div>
                    <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Domain</p>
                    <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">{alias.domain}</p>
                  </div>
                  <div>
                    <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Created</p>
                    <p className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300 tabular-nums">{new Date(alias.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Status</p>
                    <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">{alias.status}</p>
                  </div>
                </div>

                {/* Integration editor */}
                <div className="space-y-2">
                  <p className="text-xs font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">Target Integration</p>
                  <div className="flex items-center gap-2">
                    <select
                      value={editIntegration}
                      onChange={(e) => setEditIntegration(e.target.value)}
                      disabled={saveState === "loading"}
                      className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-1.5 text-xs font-schibsted text-neutral-700 dark:text-neutral-300 focus:border-sky-800 dark:focus:border-neutral-400 outline-none focus:outline-none transition-colors duration-100 disabled:opacity-50"
                    >
                      <option value="">None</option>
                      {integrations.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name} ({i.type})
                        </option>
                      ))}
                    </select>

                    <AnimatePresence>
                      {isDirty && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, width: 0 }}
                          animate={{ opacity: 1, scale: 1, width: "auto" }}
                          exit={{ opacity: 0, scale: 0.9, width: 0 }}
                          transition={{ duration: 0.2, ease: easeOutCubic }}
                        >
                          <AnimBtn
                            label="Save"
                            loadingLabel="..."
                            successLabel="Saved"
                            errorLabel="Failed"
                            icon={<IconPlugConnected size={12} />}
                            onClick={handleSaveIntegration}
                            state={saveState}
                            widths={[68, 48, 72, 72]}
                            className="shrink-0 px-3 py-1.5 rounded-md text-xs font-schibsted text-white bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center gap-1.5 overflow-hidden border-0 focus:outline-none cursor-pointer disabled:opacity-60"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// ─── Add Alias Form ───────────────────────────────────────────────────────────

type FormStatus = "idle" | "loading" | "success";

function AliasAddForm({
  domains,
  integrations,
  onAliasAdded,
}: {
  domains: DomainOption[];
  integrations: IntegrationOption[];
  onAliasAdded: (alias: Alias) => void;
}) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [selectedDomainId, setSelectedDomainId] = useState(domains[0]?.id ?? "");
  const [localPart, setLocalPart] = useState("");
  const [selectedIntegrationId, setSelectedIntegrationId] = useState(integrations[0]?.id ?? "");

  // Keep domain selection in sync if domains load after mount
  useEffect(() => {
    if (!selectedDomainId && domains.length > 0) setSelectedDomainId(domains[0].id);
  }, [domains, selectedDomainId]);

  useEffect(() => {
    if (!selectedIntegrationId && integrations.length > 0) setSelectedIntegrationId(integrations[0].id);
  }, [integrations, selectedIntegrationId]);

  const isBusy = status !== "idle";
  const selectedDomain = domains.find((d) => d.id === selectedDomainId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDomainId || !localPart.trim() || isBusy) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/aliases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domainId: selectedDomainId,
          localPart: localPart.trim(),
          integrationId: selectedIntegrationId || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create alias");
      }

      const created: Alias = await res.json();

      setTimeout(() => {
        setStatus("success");
        toast.success(`Alias ${created.email} created`);
        setLocalPart("");
        onAliasAdded(created);
        setTimeout(() => setStatus("idle"), 100);
      }, 1000);
    } catch (err) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Failed to create alias");
    }
  };

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-wrap gap-2 items-end">
        {/* Local part */}
        <div className="flex flex-col space-y-1">
          <label className="text-lg font-schibsted text-neutral-700 dark:text-neutral-300">Local part</label>
          <input
            type="text"
            value={localPart}
            onChange={(e) => setLocalPart(e.target.value)}
            placeholder="support"
            required
            disabled={isBusy || domains.length === 0}
            className="w-40 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors duration-100 focus:border-sky-800 dark:focus:border-neutral-400 outline-none focus:outline-none [box-shadow:none] focus:[box-shadow:none] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <AnimatedDropdown
            label="Domain"
            options={domains.map((d) => ({ value: d.id, label: d.domain }))}
            value={selectedDomainId}
            onChange={setSelectedDomainId}
            placeholder="No domains available"
            disabled={isBusy || domains.length === 0}
            width="w-48"
          />
        </div>

        {/* Integration */}
        <div className="flex flex-col space-y-1">
          <AnimatedDropdown
            label="Integration"
            options={[
              { value: "", label: "None" },
              ...integrations.map((i) => ({ value: i.id, label: `${i.name} (${i.type})` })),
            ]}
            value={selectedIntegrationId}
            onChange={setSelectedIntegrationId}
            placeholder="Select integration"
            disabled={isBusy}
            width="w-48"
          />
        </div>

        {/* Submit */}
        <motion.button
          layout
          type="submit"
          disabled={isBusy || domains.length === 0}
          className="font-schibsted px-4 py-2 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 text-white border-0 shadow-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 cursor-pointer flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
          animate={{ width: isLoading ? 130 : isSuccess ? 200 : 150 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isLoading && (
              <motion.span key="loader"
                initial={{ opacity: 0.5, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0.4, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: easeOutCubic }}
                className="flex items-center justify-center gap-2"
              >
                <span className="alias-loader" />
                <span>Adding...</span>
              </motion.span>
            )}
            {isSuccess && (
              <motion.span key="check"
                initial={{ opacity: 0.5, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0.4, y: -4, scale: 0.98 }}
                transition={{ duration: 0.2, ease: easeOutQuint }}
                className="flex items-center justify-center gap-1.5"
              >
                <IconCheck size={16} strokeWidth={2.5} />
                <span>Added Successfully</span>
              </motion.span>
            )}
            {!isBusy && (
              <motion.span key="label"
                initial={{ opacity: 0.5, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0.4, y: -4, scale: 0.98 }}
                transition={{ duration: 0.1, ease: easeOutCubic }}
                className="flex items-center justify-center gap-2"
              >
                <IconPlus size={16} strokeWidth={2.5} />
                Add Alias
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Preview */}
      <AnimatePresence>
        {localPart.trim() && selectedDomain && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: easeOutCubic }}
            className="text-xs font-schibsted text-neutral-500 dark:text-neutral-400"
          >
            Will create: <span className="font-medium text-neutral-700 dark:text-neutral-200">{localPart.trim().toLowerCase()}@{selectedDomain.domain}</span>
          </motion.p>
        )}
      </AnimatePresence>
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
        <IconMail size={18} className="text-white" />
      </div>
      <Paragraph variant="muted" className="text-center max-w-lg">
        No aliases yet. Create one using the form above to start routing emails to your integrations.
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
      <span className="alias-btn-loader text-neutral-400" />
      <Paragraph variant="muted" className="text-xs">Loading aliases...</Paragraph>
    </motion.div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export default function AliasesPage() {
  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [aliases, setAliases] = useState<Alias[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);

        const [domainsRes, aliasesRes, integrationsRes] = await Promise.all([
          fetch("/api/domains"),
          fetch("/api/aliases"),
          fetch("/api/integrations"),
        ]);

        if (!domainsRes.ok) throw new Error("Failed to load domains");
        if (!aliasesRes.ok) throw new Error("Failed to load aliases");
        if (!integrationsRes.ok) throw new Error("Failed to load integrations");

        const domainsData = await domainsRes.json();
        const aliasesData: Alias[] = await aliasesRes.json();
        const integrationsData = await integrationsRes.json();

        setDomains(domainsData.map((d: any) => ({ id: d.id, domain: d.domain })));
        setAliases(aliasesData);
        setIntegrations(
          integrationsData.map((i: any) => ({ id: i.id, name: i.name, type: i.type }))
        );
      } catch (err) {
        console.error(err);
        toast.error("Could not load aliases or domains. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, []);

  const handleDelete = (id: string) => {
    setAliases((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdate = (updated: Alias) => {
    setAliases((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleAliasAdded = (alias: Alias) => {
    setAliases((prev) => [alias, ...prev]);
  };

  return (
    <>
      <style>{loaderStyle}</style>
      <div className="space-y-6">
        <div>
          <Heading variant="muted" className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Aliases
          </Heading>
          <Paragraph variant="small" className="text-neutral-600 dark:text-neutral-400 mt-1">
            Create email aliases for your domains. Each alias routes to a Slack or Discord integration.
          </Paragraph>
        </div>

        <AliasAddForm
          domains={domains}
          integrations={integrations}
          onAliasAdded={handleAliasAdded}
        />

        <Card className="min-h-[120px] overflow-hidden">
          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingState key="loading" />
            ) : aliases.length === 0 ? (
              <EmptyState key="empty" />
            ) : (
              <motion.div
                key="list"
                layout
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.7 }}
                transition={{ duration: 0.15, ease: easeOutCubic }}
                className="p-2 space-y-2"
              >
                <LayoutGroup>
                  {aliases.map((a) => (
                    <AliasCard
                      key={a.id}
                      alias={a}
                      integrations={integrations}
                      onDelete={handleDelete}
                      onUpdate={handleUpdate}
                    />
                  ))}
                </LayoutGroup>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </>
  );
}