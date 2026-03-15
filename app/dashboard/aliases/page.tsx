
// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence, LayoutGroup } from "motion/react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import {
//   IconCheck,
//   IconTrash,
//   IconPlus,
//   IconX,
//   IconMail,
//   IconChevronDown,
//   IconAt,
// } from "@tabler/icons-react";
// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";
// import AnimatedDropdown from "@/components/ui/AnimatedDropdown";
// import { AnimatedSubmitButton } from "@/components/ui/AnimatedSubmitButton";
// import { AnimatedDeleteButton } from "@/components/ui/AnimatedDeleteButton";
// import { CustomLink } from "@/components/CustomLink";
// import { RefreshCw } from "lucide-react";
// import AliasesPageSkeleton from "@/components/dashboard/AliasesPageSkeleton";

// // ─── Types ────────────────────────────────────────────────────────────────────

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

// // ─── Easing ───────────────────────────────────────────────────────────────────

// const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;
// const easeOutQuint = [0.23, 1, 0.32, 1] as const;

// // ─── Alias Card ───────────────────────────────────────────────────────────────

// type BtnState = "idle" | "loading" | "success" | "error";

// function AliasCard({
//   alias,
//   integrations,
//   onDelete,
//   onUpdate,
// }: {
//   alias: Alias;
//   integrations: IntegrationOption[];
//   onDelete: (id: string) => void;
//   onUpdate: (updated: Alias) => void;
// }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [deleteState, setDeleteState] = useState<BtnState>("idle");
//   const [saveState, setSaveState] = useState<BtnState>("idle");
//   const [editIntegration, setEditIntegration] = useState(alias.integrationId ?? "");
//   const isActive = alias.status === "active";

//   const handleSaveIntegration = async () => {
//     setSaveState("loading");
//     try {
//       const res = await fetch(`/api/aliases/${alias.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ integrationId: editIntegration || null }),
//       });
//       if (!res.ok) throw new Error((await res.json()).error || "Failed to update");
//       const updated: Alias = await res.json();
//       onUpdate(updated);
//       setSaveState("success");
//       toast.success("Integration updated");
//       setTimeout(() => setSaveState("idle"), 1500);
//     } catch (err: any) {
//       toast.error(err.message || "Failed to update integration");
//       setSaveState("error");
//       setTimeout(() => setSaveState("idle"), 2000);
//     }
//   };

//   return (
//     <motion.div
//       layout
//       style={{ transformOrigin: "top center" }}
//       variants={{
//         hidden: { opacity: 0, scaleY: 0 },
//         show:   { opacity: 1, scaleY: 1 },
//       }}
//       animate="show"
//       exit={{ opacity: 0, scaleY: 0.85 }}
//       transition={{
//         layout: { type: "spring", stiffness: 400, damping: 28 },
//         opacity: {
//           duration: 0.15,
//           ease: [0.4, 0, 1, 1],  // ease-in on exit feels decisive
//         },
//         scaleY: {
//           type: "spring",
//           stiffness: 400,
//           damping: 28,
//         },
//       }}
//     >
//       <Card className="bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors duration-300 ease-out">
//         <CardContent className="p-4 flex items-center gap-4">
//           {/* Icon */}
//           <div className="shrink-0 w-8 h-8 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center">
//             <IconAt size={15} className="text-white" />
//           </div>

//           {/* Email + status — clickable */}
//           <button
//             type="button"
//             onClick={() => setIsOpen((o) => !o)}
//             className="flex-1 min-w-0 text-left cursor-pointer focus:outline-none"
//           >
//             <p className="font-schibsted font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
//               {alias.email}
//             </p>
//             <div className="mt-0.5">
//               <Badge className={`border-0 font-schibsted tracking-tight rounded-sm ${
//                 isActive
//                   ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
//                   : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
//               }`}>
//                 {isActive ? "Active" : "Inactive"}
//               </Badge>
//             </div>
//           </button>

//           {/* Chevron */}
//           <button
//             type="button"
//             onClick={() => setIsOpen((o) => !o)}
//             className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
//             aria-label={isOpen ? "Collapse" : "Expand"}
//           >
//             <motion.span
//               animate={{ rotate: isOpen ? 180 : 0 }}
//               transition={{ type: "spring", stiffness: 300, damping: 25 }}
//               className="flex items-center justify-center"
//             >
//               <IconChevronDown size={15} className="text-neutral-500" />
//             </motion.span>
//           </button>

//           <AnimatedDeleteButton
//             onDelete={async () => {
//               try {
//                 const res = await fetch(`/api/aliases/${alias.id}`, { method: "DELETE" });
//                 if (!res.ok) throw new Error((await res.json()).error || "Failed to delete");
//                 toast.success(`Alias "${alias.email}" deleted`);
//                 setTimeout(() => onDelete(alias.id), 400);
//                 return "success";
//               } catch (err: any) {
//                 toast.error(err.message || "Failed to delete alias");
//                 return "error";
//               }
//             }}
//           />
//         </CardContent>

//         {/* Expanded panel — always mounted so state is preserved */}
//         <motion.div
//           initial={false}
//           animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
//           transition={{ duration: 0.3, ease: easeOutQuint }}
//           style={{ overflow: "hidden" }}
//         >
//           <div className="px-4 pb-4 pt-1 border-t border-neutral-100 dark:border-neutral-800 mt-1 space-y-4">
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Local Part</p>
//                 <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">{alias.localPart}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Domain</p>
//                 <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">{alias.domain}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Created</p>
//                 <p className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300 tabular-nums">
//                   {new Date(alias.createdAt).toLocaleString()}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Status</p>
//                 <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">{alias.status}</p>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </Card>
//     </motion.div>
//   );
// }

// // ─── Add Alias Form ───────────────────────────────────────────────────────────

// type FormStatus = "idle" | "loading" | "success";

// function AliasAddForm({
//   domains,
//   integrations,
//   onAliasAdded,
// }: {
//   domains: DomainOption[];
//   integrations: IntegrationOption[];
//   onAliasAdded: (alias: Alias) => void;
// }) {
//   const [status, setStatus] = useState<FormStatus>("idle");
//   const [selectedDomainId, setSelectedDomainId] = useState(domains[0]?.id ?? "");
//   const [localPart, setLocalPart] = useState("");
//   const [selectedIntegrationId, setSelectedIntegrationId] = useState(integrations[0]?.id ?? "");

//   useEffect(() => {
//     if (!selectedDomainId && domains.length > 0) setSelectedDomainId(domains[0].id);
//   }, [domains, selectedDomainId]);

//   useEffect(() => {
//     if (!selectedIntegrationId && integrations.length > 0) setSelectedIntegrationId(integrations[0].id);
//   }, [integrations, selectedIntegrationId]);

//   const isBusy = status !== "idle";
//   const selectedDomain = domains.find((d) => d.id === selectedDomainId);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedDomainId || !localPart.trim() || isBusy) return;

//     setStatus("loading");

//     try {
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

//       setTimeout(() => {
//         setStatus("success");
//         toast.success(`Alias ${created.email} created`);
//         setLocalPart("");
//         onAliasAdded(created);
//         setTimeout(() => setStatus("idle"), 100);
//       }, 1000);
//     } catch (err) {
//       setStatus("idle");
//       toast.error(err instanceof Error ? err.message : "Failed to create alias");
//     }
//   };

//   return (
//     <div className="flex items-end gap-4">
//       <form onSubmit={handleSubmit} className="space-y-3">
//         <div className="flex flex-wrap gap-2 items-end">
//           <div className="flex flex-col space-y-1">
//             <label className="text-lg font-schibsted text-neutral-700 dark:text-neutral-300">Local part</label>
//             <input
//               type="text"
//               value={localPart}
//               onChange={(e) => setLocalPart(e.target.value)}
//               placeholder="support"
//               required
//               disabled={isBusy || domains.length === 0}
//               className="w-40 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors duration-100 focus:border-sky-800 dark:focus:border-neutral-400 outline-none focus:outline-none [box-shadow:none] focus:[box-shadow:none] disabled:opacity-50 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div className="flex flex-col space-y-1">
//             <AnimatedDropdown
//               label="Domain"
//               options={domains.map((d) => ({ value: d.id, label: d.domain }))}
//               value={selectedDomainId}
//               onChange={setSelectedDomainId}
//               placeholder="No domains available"
//               disabled={isBusy || domains.length === 0}
//               width="w-48"
//             />
//           </div>

//           <div className="flex flex-col space-y-1">
//             <AnimatedDropdown
//               label="Integration"
//               options={[
//                 { value: "", label: "None" },
//                 ...integrations.map((i) => ({ value: i.id, label: `${i.name} (${i.type})` })),
//               ]}
//               value={selectedIntegrationId}
//               onChange={setSelectedIntegrationId}
//               placeholder="Select integration"
//               disabled={isBusy}
//               width="w-48"
//             />
//           </div>

//           <AnimatedSubmitButton
//             idleLabel="Add"
//             loadingLabel="Adding..."
//             successLabel="Added"
//             idleIcon={<IconPlus size={16} strokeWidth={2.5} />}
//             state={status}
//             idleWidth={230}
//             loadingWidth={110}
//             successWidth={200}
//             disabled={isBusy || domains.length === 0}
//             className="font-schibsted w-32 px-4 py-2 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 text-white border-0 shadow-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 cursor-pointer flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
//           />

//           <CustomLink
//             href="/docs/aliases"
//             className="text-sm font-schibsted text-sky-700 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300 transition-colors underline pb-2"
//           >
//             Read our docs
//           </CustomLink>
//         </div>

//         {/* <AnimatePresence>
//           {localPart.trim() && selectedDomain && (
//             <motion.p
//               initial={{ opacity: 0, y: -4 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -4 }}
//               transition={{ duration: 0.15, ease: easeOutCubic }}
//               className="text-xs font-schibsted text-neutral-500 dark:text-neutral-400"
//             >
//               Your email address becomes:{" "}
//               <span className="font-medium text-neutral-700 dark:text-neutral-200">
//                 {localPart.trim().toLowerCase()}@{selectedDomain.domain}
//               </span>
//             </motion.p>
//           )}
//         </AnimatePresence> */}
//       </form>
//     </div>
//   );
// }

// // ─── Empty State ──────────────────────────────────────────────────────────────

// function EmptyState() {
//   return (
//     <motion.div
//       key="empty"
//       initial={{ scale: 0.95, y: 10 }}
//       animate={{scale: 1, y: 0 }}
//       transition={{ duration: 0.10, ease: easeOutCubic }}
//       className="flex flex-col items-center justify-center py-12 px-6 gap-3"
//     >
//       <div className="w-10 h-10 rounded-full bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center opacity-40">
//         <IconMail size={18} className="text-white" />
//       </div>
//       <Paragraph variant="muted" className="text-center max-w-lg">
//         No aliases yet. Create one using the form above to start routing emails to your integrations.
//       </Paragraph>
//     </motion.div>
//   );
// }

// // ─── Loading State ────────────────────────────────────────────────────────────

// function LoadingState() {
//   return (
//     <motion.div
//       key="loading"
//       initial={{ opacity: 0.6 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.2, ease: easeOutCubic }}
//       className="flex items-center justify-center py-12 gap-2"
//     >
//       <div className="flex flex-col items-center gap-4">
//         <RefreshCw className="size-8 text-neutral-400 animate-spin" />
//       <Paragraph variant="muted" className="text-xs">Loading aliases...</Paragraph>
//       </div>
//     </motion.div>
//   );
// }

// // ─── Root Export ──────────────────────────────────────────────────────────────

// export default function AliasesPage() {
//   const [domains, setDomains] = useState<DomainOption[]>([]);
//   const [aliases, setAliases] = useState<Alias[]>([]);
//   const [integrations, setIntegrations] = useState<IntegrationOption[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchInitial = async () => {
//       try {
//         setLoading(true);

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
//         setIntegrations(
//           integrationsData.map((i: any) => ({ id: i.id, name: i.name, type: i.type }))
//         );
//       } catch (err) {
//         console.error(err);
//         toast.error("Could not load aliases or domains. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitial();
//   }, []);

//   const handleDelete = (id: string) => {
//     setAliases((prev) => prev.filter((a) => a.id !== id));
//   };

//   const handleUpdate = (updated: Alias) => {
//     setAliases((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
//   };

//   const handleAliasAdded = (alias: Alias) => {
//     setAliases((prev) => [alias, ...prev]);
//   };

//   return (
//     <motion.div
//       // initial={{ scale: 0.95, y: 2 }}
//       // animate={{ scale: 1, y: 0 }}
//       // transition={{ duration: 0.03, ease: easeOutCubic }}
//       className="space-y-6"
//     >
//       <div>
//         <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
//           Create Email Aliases for Your Domains
//         </Heading>
//         <Paragraph variant="default" className="text-neutral-600 dark:text-neutral-400 mt-1">
//           Set up email addresses like support@yourdomain.com and route them to your Slack or Discord channels. Each alias can be connected to any integration.
//         </Paragraph>
//       </div>

//       <AliasAddForm
//         domains={domains}
//         integrations={integrations}
//         onAliasAdded={handleAliasAdded}
//       />



//       <motion.div
//       // transition={{ type: "spring", stiffness: 300, damping: 28 }}
//       className="pt-3 pb-3">
//         <Card className="min-h-[120px]">
//           <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
//             Your Email Aliases
//           </Heading>
//           <Paragraph variant="small" className="text-neutral-600 dark:text-neutral-400 mt-1 pb-5">
//             View and manage all your email aliases. Click any alias to see details or update its integration settings.
//             </Paragraph>

//             <AnimatePresence mode="wait">
//               {loading && (
//                 <motion.div
//                   key="skeleton"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.15, ease: easeOutCubic }}
//                 >
//                   <AliasesPageSkeleton />
//                 </motion.div>
//               )}

//               {!loading && aliases.length === 0 && <EmptyState key="empty" />}

//               {!loading && aliases.length > 0 && (
//                 <motion.div
//                   key="list"
//                   layout
//                   className="space-y-2"
//                 >
//                   <AnimatePresence mode="popLayout">
//                     {aliases.map((a) => (
//                       <AliasCard
//                         key={a.id}
//                         alias={a}
//                         integrations={integrations}
//                         onDelete={handleDelete}
//                         onUpdate={handleUpdate}
//                       />
//                     ))}
//                   </AnimatePresence>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//         </Card>
//       </motion.div>
//     </motion.div>
//   );
// }




"use client";

import { useState, useEffect, useRef } from "react";
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
  IconAt,
  IconPencil,
  IconMessageDots,
  IconMessageFilled
} from "@tabler/icons-react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import AnimatedDropdown from "@/components/ui/AnimatedDropdown";
import { AnimatedSubmitButton } from "@/components/ui/AnimatedSubmitButton";
import { AnimatedDeleteButton } from "@/components/ui/AnimatedDeleteButton";
import { CustomLink } from "@/components/CustomLink";
import { RefreshCw } from "lucide-react";
import AliasesPageSkeleton from "@/components/dashboard/AliasesPageSkeleton";
import { AnimatedButton } from "@/components/dashboard/DomainsTable";

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

type CannedResponse = {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
};

type CannedFormState = "idle" | "loading" | "success";
type ActiveTab = "edit" | "delete";

// ─── Easing ───────────────────────────────────────────────────────────────────

const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;
const easeOutQuint = [0.23, 1, 0.32, 1] as const;
const easeInCubic = [0.55, 0.055, 0.675, 0.19] as const;

function CannedResponseModal({
  aliasId,
  aliasEmail,
  originRect,
  onClose,
}: {
  aliasId: string;
  aliasEmail: string;
  originRect: DOMRect | null;
  onClose: () => void;
}) {
  const [responses, setResponses] = useState<CannedResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // "add" | "saved" — which top-level view is active
  const [view, setView] = useState<"add" | "saved">("add");

  // dropdown open state for Saved Responses button
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // which sub-tab inside saved: "edit" | "delete"
  const [activeTab, setActiveTab] = useState<ActiveTab>("edit");

  // Add form
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [formState, setFormState] = useState<CannedFormState>("idle");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editState, setEditState] = useState<CannedFormState>("idle");

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch(`/api/canned-responses?aliasId=${aliasId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        setResponses(await res.json());
      } catch {
        toast.error("Could not load canned responses");
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, [aliasId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setFormState("loading");
    try {
      const res = await fetch("/api/canned-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aliasId, title: title.trim(), body: body.trim() }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const created = await res.json();
      setResponses((prev) => [created, ...prev]);
      setTitle("");
      setBody("");
      setFormState("success");
      setTimeout(() => setFormState("idle"), 2000);
    } catch {
      toast.error("Failed to add canned response");
      setFormState("idle");
    }
  };

  const handleEditSave = async (id: string) => {
    if (!editTitle.trim() || !editBody.trim()) return;
    setEditState("loading");
    try {
      const res = await fetch(`/api/canned-responses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim(), body: editBody.trim() }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setResponses((prev) => prev.map((r) => (r._id === id ? updated : r)));
      setEditState("success");
      setTimeout(() => { setEditingId(null); setEditState("idle"); }, 1000);
    } catch {
      toast.error("Failed to update canned response");
      setEditState("idle");
    }
  };

  const startEdit = (r: CannedResponse) => {
    setEditingId(r._id);
    setEditTitle(r.title);
    setEditBody(r.body);
    setEditState("idle");
  };

  return (
    <motion.div
      layout
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // exit={{ opacity: 0 }}
      // transition={{ duration: 0.15 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.08 }}
      />

      {/* Modal */}
      <motion.div
        initial={originRect ? {
          position: "fixed" as const,
          top: originRect.top,
          left: originRect.left,
          width: originRect.width,
          height: originRect.height,
          borderRadius: 8,
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        } : {
          opacity: 0,
          y: 2,
        }}
        animate={{
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          width: 512,
          height: "auto",
          borderRadius: 12,
          opacity: 1,
          scale: 1,
          position: "fixed" as const,
        }}
        exit={originRect ? {
          top: originRect.top,
          left: originRect.left,
          x: 0,
          y: 0,
          width: originRect.width,
          height: originRect.height,
          borderRadius: 8,
          opacity: 0,
        } : {
          opacity: 0,
          y: 2,
        }}
        transition={{ ease: [.23, 1, .32, 1], duration: 0.30 }}
        className="relative min-h-[400px] z-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-xl overflow-hidden"
      >
        {/* Header */}
        <motion.div
          // layout
          // initial={{ opacity: 0, y: 6 }}
          // animate={{ opacity: 1, y: 0 }}
          // exit={{ opacity: 0, y: 4 }}
          // transition={{ duration: 0.18, delay: 0.05 }}
          className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800"
        >
          <div>
            <p className="text-sm font-schibsted font-semibold text-neutral-900 dark:text-neutral-100">
              Canned Responses
            </p>
            <p className="text-xs font-schibsted text-neutral-500 mt-0.5">{aliasEmail}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
          >
            <IconX size={15} className="text-neutral-500" />
          </button>
        </motion.div>

        {/* Top bar: Add New (left) + Saved Responses dropdown (right) */}
        <motion.div
          // layout
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // exit={{ opacity: 0 }}
          // transition={{ duration: 0.15, delay: 0.06 }}
          className="flex items-center justify-between px-5 pt-3 pb-2"
        >
          {/* Add New button */}
          <motion.button
            layout
            type="button"
            onClick={() => {
              setView("add");
              setDropdownOpen(false);
              setEditingId(null);
            }}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-schibsted font-medium transition-colors focus:outline-none cursor-pointer ${
              view === "add"
                ? "text-neutral-900 dark:text-neutral-100"
                : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
            }`}
          >
            {view === "add" && (
              <motion.span
                layout
                className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-md z-0"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <IconPlus size={12} />
              Add New
            </span>
          </motion.button>

          {/* Saved Responses dropdown trigger */}
          {/* Right slot — swaps between "Saved Responses" button and Edit/Delete tabs */}
          <AnimatePresence mode="wait" initial={false}>
            {view === "add" ? (
              <motion.button
                key="saved-btn"
                type="button"
                onClick={() => {
                  setView("saved");
                  setActiveTab("edit");
                  setEditingId(null);
                }}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.13, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-schibsted font-medium text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors focus:outline-none cursor-pointer"
              >
                <IconMessageDots size={12} />
                Saved Responses
              </motion.button>
            ) : (
              <motion.div
                key="sub-tabs"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.13, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center gap-0.5"
              >
                {(["edit", "delete"] as ActiveTab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setEditingId(null);
                    }}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-schibsted font-medium transition-colors focus:outline-none cursor-pointer capitalize ${
                      activeTab === tab
                        ? "text-neutral-900 dark:text-neutral-100"
                        : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
                    }`}
                  >
                    {activeTab === tab && (
                      <motion.span
                        layoutId={`subtab-bubble-${aliasId}`}
                        className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-md z-0"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {tab === "edit" ? <IconPencil size={11} /> : <IconTrash size={11} />}
                      {tab === "edit" ? "Edit" : "Delete"}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

        {/* Content area */}
        <motion.div  className="px-5 pb-1 overflow-hidden rounded-b-xl">
          <AnimatePresence mode="wait" initial={false}>

            {/* ── Add New view ── */}
            {view === "add" && (
              <motion.form
                key="add-view"
                layout
                onSubmit={handleAdd}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                className="pt-1 pb-4 space-y-2"
              >
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title (e.g. Password Reset)"
                  className="w-full text-xs font-schibsted bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md px-3 py-2 focus:outline-none focus:border-sky-400"
                />
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Response body... Use {customer_name}, {agent_name}"
                  rows={4}
                  className="w-full text-xs font-schibsted bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md px-3 py-2 focus:outline-none focus:border-sky-400 resize-none"
                />
                <AnimatedSubmitButton
                  idleLabel="Add Response"
                  loadingLabel="Adding..."
                  successLabel="Added!"
                  idleIcon={<IconPlus size={12} />}
                  state={formState}
                  idleWidth={110}
                  loadingWidth={90}
                  successWidth={76}
                  className="px-3 py-1.5 rounded-md text-xs font-schibsted text-white bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center gap-1.5 overflow-hidden border-0 focus:outline-none cursor-pointer disabled:opacity-60"
                />
              </motion.form>
            )}

            {/* ── Saved Responses view ── */}
            {view === "saved" && (
              <motion.div
                key="saved-view"
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                className="pb-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center py-8 gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-3.5 h-3.5 border-2 border-neutral-300 border-t-neutral-500 rounded-full"
                    />
                    <p className="text-xs font-schibsted text-neutral-400">Loading...</p>
                  </div>
                ) : responses.length === 0 ? (
                  <p className="text-xs font-schibsted text-neutral-400 py-6 text-center">
                    No canned responses yet. Use Add New to create one.
                  </p>
                ) : (
                  <AnimatePresence mode="wait" initial={false}>

                    {/* Edit sub-tab */}
                    {activeTab === "edit" && (
                      <motion.div
                        key="edit-tab"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.13, ease: [0.23, 1, 0.32, 1] }}
                        className="space-y-2 pt-1"
                      >
                        <AnimatePresence initial={false}>
                          {responses.map((r) => (
                            <motion.div
                              key={r._id}
                              layout
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 28 }}
                              className="overflow-hidden"
                            >
                              <div className="border border-neutral-100 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-800/40">
                                <AnimatePresence mode="wait" initial={false}>
                                  {editingId === r._id ? (
                                    <motion.div
                                      key="editing"
                                      layout
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.12 }}
                                      className="space-y-2"
                                    >
                                      <input
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full text-xs font-schibsted font-semibold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-sky-400"
                                        placeholder="Title"
                                      />
                                      <textarea
                                        value={editBody}
                                        onChange={(e) => setEditBody(e.target.value)}
                                        rows={3}
                                        className="w-full text-xs font-schibsted bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-sky-400 resize-none"
                                        placeholder="Response body..."
                                      />
                                      <div className="flex items-center gap-2">
                                        <AnimatedButton
                                          idleLabel="Save"
                                          loadingLabel="Saving..."
                                          successLabel="Saved!"
                                          errorLabel="Failed"
                                          idleIcon={<IconCheck size={12} />}
                                          state={editState}
                                          onClick={() => handleEditSave(r._id)}
                                          idleWidth={60}
                                          loadingWidth={74}
                                          successWidth={66}
                                          errorWidth={60}
                                          className="px-3 py-1.5 rounded-md text-xs font-schibsted text-white bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center gap-1.5 overflow-hidden border-0 focus:outline-none cursor-pointer disabled:opacity-60"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setEditingId(null)}
                                          className="px-3 py-1.5 rounded-md text-xs font-schibsted text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </motion.div>
                                  ) : (
                                    <motion.div
                                      key="viewing"
                                      layout
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.12 }}
                                      className="flex items-start justify-between gap-3"
                                    >
                                      <div className="min-w-0">
                                        <p className="text-xs font-schibsted font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">
                                          {r.title}
                                        </p>
                                        <p className="text-xs font-schibsted text-neutral-500 line-clamp-2">
                                          {r.body}
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => startEdit(r)}
                                        className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-schibsted text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
                                      >
                                        <IconPencil size={11} />
                                        Edit
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    )}

                    {/* Delete sub-tab */}
                    {activeTab === "delete" && (
                      <motion.div
                        key="delete-tab"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.13, ease: [0.23, 1, 0.32, 1] }}
                        className="space-y-2 pt-1"
                      >
                        <AnimatePresence initial={false}>
                          {responses.map((r) => (
                            <motion.div
                              key={r._id}
                              layout
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 28 }}
                              className="overflow-hidden"
                            >
                              <div className="border border-neutral-100 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-800/40 flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-xs font-schibsted font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">
                                    {r.title}
                                  </p>
                                  <p className="text-xs font-schibsted text-neutral-500 line-clamp-2">
                                    {r.body}
                                  </p>
                                </div>
                                <div className="shrink-0">
                                  <AnimatedDeleteButton
                                    onDelete={async () => {
                                      try {
                                        const res = await fetch(`/api/canned-responses/${r._id}`, {
                                          method: "DELETE",
                                        });
                                        if (!res.ok) throw new Error("Failed");
                                        setTimeout(() => {
                                          setResponses((prev) => prev.filter((x) => x._id !== r._id));
                                        }, 300);
                                        return "success";
                                      } catch {
                                        toast.error("Failed to delete");
                                        return "error";
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    )}

                  </AnimatePresence>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Alias Card ───────────────────────────────────────────────────────────────

type BtnState = "idle" | "loading" | "success" | "error";

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
  const [saveState, setSaveState] = useState<BtnState>("idle");
  const [editIntegration, setEditIntegration] = useState(alias.integrationId ?? "");
  const isActive = alias.status === "active";
  const [cannedOpen, setCannedOpen] = useState(false);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
      style={{ transformOrigin: "top center" }}
      variants={{
        hidden: { opacity: 0, scaleY: 0 },
        show:   { opacity: 1, scaleY: 1 },
      }}
      animate="show"
      exit={{ opacity: 0, scaleY: 0.85 }}
      transition={{
        layout: { type: "spring", stiffness: 400, damping: 28 },
        opacity: {
          duration: 0.15,
          ease: [0.4, 0, 1, 1],  // ease-in on exit feels decisive
        },
        scaleY: {
          type: "spring",
          stiffness: 400,
          damping: 28,
        },
      }}
    >
      <Card className="bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors duration-300 ease-out">
        <CardContent className="p-4 flex items-center gap-4">
          {/* Icon */}
          <div className="shrink-0 w-8 h-8 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center">
            <IconAt size={15} className="text-white" />
          </div>

          {/* Email + status — clickable */}
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            className="flex-1 min-w-0 text-left cursor-pointer focus:outline-none"
          >
            <p className="font-schibsted font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
              {alias.email}
            </p>
            <div className="mt-0.5">
              <Badge className={`border-0 font-schibsted tracking-tight rounded-sm ${
                isActive
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              }`}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </button>

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

          <AnimatedDeleteButton
            onDelete={async () => {
              try {
                const res = await fetch(`/api/aliases/${alias.id}`, { method: "DELETE" });
                if (!res.ok) throw new Error((await res.json()).error || "Failed to delete");
                toast.success(`Alias "${alias.email}" deleted`);
                setTimeout(() => onDelete(alias.id), 400);
                return "success";
              } catch (err: any) {
                toast.error(err.message || "Failed to delete alias");
                return "error";
              }
            }}
          />
        </CardContent>

        {/* Expanded panel — always mounted so state is preserved */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: easeOutQuint }}
          style={{ overflow: "hidden" }}
        >
          <div className="px-4 pb-4 pt-1 border-t border-neutral-100 dark:border-neutral-800 mt-1 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Local Part</p>
                <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">{alias.localPart}</p>
              </div>
              <div>
                <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Domain</p>
                <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">{alias.domain}</p>
              </div>
              <div>
                <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Created</p>
                <p className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300 tabular-nums">
                  {new Date(alias.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Status</p>
                <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">{alias.status}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                ref={triggerRef}
                type="button"
                onClick={() => {
                  setOriginRect(triggerRef.current?.getBoundingClientRect() ?? null);
                  setCannedOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-schibsted font-semibold text-neutral-600 dark:text-neutral-400 border border-neutral-400 dark:border-neutral-700 hover:border-neutral-600 dark:hover:bg-neutral-800 transition-colors duration-150 ease-out cursor-pointer focus:outline-none"
              >
                <IconMessageFilled size={13} />
                Canned Responses
              </button>
            </div>
          </div>
        </motion.div>


        <AnimatePresence>
          {cannedOpen && (
            <CannedResponseModal
              aliasId={alias.id}
              aliasEmail={alias.email}
              originRect={originRect}
              onClose={() => setCannedOpen(false)}
            />
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

  return (
    <div className="flex items-end gap-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-wrap gap-2 items-end">
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

          <AnimatedSubmitButton
            idleLabel="Add"
            loadingLabel="Adding..."
            successLabel="Added"
            idleIcon={<IconPlus size={16} strokeWidth={2.5} />}
            state={status}
            idleWidth={230}
            loadingWidth={110}
            successWidth={200}
            disabled={isBusy || domains.length === 0}
            className="font-schibsted w-32 px-4 py-2 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 text-white border-0 shadow-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 cursor-pointer flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
          />

          <CustomLink
            href="/docs/aliases"
            className="text-sm font-schibsted text-sky-700 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300 transition-colors underline pb-2"
          >
            Read our docs
          </CustomLink>
        </div>

        {/* <AnimatePresence>
          {localPart.trim() && selectedDomain && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: easeOutCubic }}
              className="text-xs font-schibsted text-neutral-500 dark:text-neutral-400"
            >
              Your email address becomes:{" "}
              <span className="font-medium text-neutral-700 dark:text-neutral-200">
                {localPart.trim().toLowerCase()}@{selectedDomain.domain}
              </span>
            </motion.p>
          )}
        </AnimatePresence> */}
      </form>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      key="empty"
      initial={{ scale: 0.95, y: 10 }}
      animate={{scale: 1, y: 0 }}
      transition={{ duration: 0.10, ease: easeOutCubic }}
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
    <motion.div
      // initial={{ scale: 0.95, y: 2 }}
      // animate={{ scale: 1, y: 0 }}
      // transition={{ duration: 0.03, ease: easeOutCubic }}
      className="space-y-6"
    >
      <div>
        <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
          Create Email Aliases for Your Domains
        </Heading>
        <Paragraph variant="default" className="text-neutral-600 dark:text-neutral-400 mt-1">
          Set up email addresses like support@yourdomain.com and route them to your Slack or Discord channels. Each alias can be connected to any integration.
        </Paragraph>
      </div>

      <AliasAddForm
        domains={domains}
        integrations={integrations}
        onAliasAdded={handleAliasAdded}
      />



      <motion.div
      // transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="pt-3 pb-3">
        <Card className="min-h-[120px]">
          <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
            Your Email Aliases
          </Heading>
          <Paragraph variant="small" className="text-neutral-600 dark:text-neutral-400 mt-1 pb-5">
            View and manage all your email aliases. Click any alias to see details or update its integration settings.
            </Paragraph>

            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: easeOutCubic }}
                >
                  <AliasesPageSkeleton />
                </motion.div>
              )}

              {!loading && aliases.length === 0 && <EmptyState key="empty" />}

              {!loading && aliases.length > 0 && (
                <motion.div
                  key="list"
                  layout
                  className="space-y-2"
                >
                  <AnimatePresence mode="popLayout">
                    {aliases.map((a) => (
                      <AliasCard
                        key={a.id}
                        alias={a}
                        integrations={integrations}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
        </Card>
      </motion.div>
    </motion.div>
  );
}