



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
//   IconPlugConnected,
//   IconToggleLeft,
//   IconToggleRight,
//   IconAt,
// } from "@tabler/icons-react";
// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";
// import AnimatedDropdown from "@/components/ui/AnimatedDropdown";
// import { AnimatedSubmitButton } from "@/components/ui/AnimatedSubmitButton";
// import {TrashIconShake} from '@/constants/icons'
// import { AnimatedDeleteButton } from "@/components/ui/AnimatedDeleteButton";
// import { CustomLink } from "@/components/CustomLink";

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
// const easeOutExpo = [0.19, 1, 0.22, 1] as const;
// const easeOutCirc = [.075, .82, .165, 1] as const;
// const easeOutQuart = [0.165, 0.84, 0.44, 1] as const;


// // ─── Animated Button ──────────────────────────────────────────────────────────

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
//   const isDirty = editIntegration !== (alias.integrationId ?? "");

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
//       initial={{ opacity: 0, scale: 0.95, y: -4 }}
//       animate={{
//         opacity: 1, scale: 1, y: 0
//       }}
//       exit={{ opacity: 0, scale: 0.97, y: -4 }}
//       transition={{ 
//         duration: 0.25,
//         ease: [.075, .82, .165, 1]
//       }}
//       style={{ transformOrigin: "top left" }}
//     >
//       <Card className={`border shadow-none transition-colors duration-150 rounded-md overflow-hidden ${
//         isOpen
//           ? "border-sky-600 dark:border-sky-800"
//           : "border-sky-600 dark:border-neutral-700 hover:border-sky-800 dark:hover:border-neutral-600"
//       }`}>
//         <CardContent className="p-4 flex items-center gap-4">
//           {/* Icon */}
//           <div className="shrink-0 w-8 h-8 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center">
//             <IconAt size={15} className="text-white" />
//           </div>

//           {/* Email + domain — clickable */}
//           <button
//             type="button"
//             onClick={() => setIsOpen((o) => !o)}
//             className="flex-1 min-w-0 text-left cursor-pointer focus:outline-none"
//           >
//             <p className="font-schibsted font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
//               {alias.email}
//             </p>
//             <div className="mt-0.5 flex items-center gap-2">
//               <Badge className={`border-0 font-schibsted tracking-tight ${
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

//         {/* Expanded panel */}
//         <AnimatePresence initial={false}>
//           {isOpen && (
//             <motion.div
//               key="panel"
//                initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.3, ease: easeOutQuint }}
//               style={{ overflow: "hidden"
//                }}
//             >
//               <motion.div
//                 transition={{ duration: 0.25, ease: easeOutQuart }}
//                 className="px-4 pb-4 pt-1 border-t border-neutral-100 dark:border-neutral-800 mt-1 space-y-4"
//               >
//                 {/* Details grid */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <p className="text-sm font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Local Part</p>
//                     <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">{alias.localPart}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Domain</p>
//                     <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">{alias.domain}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Created</p>
//                     <p className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300 tabular-nums">{new Date(alias.createdAt).toLocaleString()}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Status</p>
//                     <p className="text-sm font-schibsted font-medium text-neutral-900 dark:text-neutral-100">{alias.status}</p>
//                   </div>
//                 </div>

//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
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

//   // Keep domain selection in sync if domains load after mount
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

//   const isLoading = status === "loading";
//   const isSuccess = status === "success";

//   return (
//     <div className="flex items-end gap-4">
//       <form onSubmit={handleSubmit} className="space-y-3">
//         <div className="flex flex-wrap gap-2 items-end">
//           {/* Local part */}
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

//           {/* Integration */}
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

//         {/* Preview */}
//         <AnimatePresence>
//           {localPart.trim() && selectedDomain && (
//             <motion.p
//               initial={{ opacity: 0, y: -4 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -4 }}
//               transition={{ duration: 0.15, ease: easeOutCubic }}
//               className="text-xs font-schibsted text-neutral-500 dark:text-neutral-400"
//             >
//               Your email address becomes: <span className="font-medium text-neutral-700 dark:text-neutral-200">{localPart.trim().toLowerCase()}@{selectedDomain.domain}</span>
//             </motion.p>
//           )}
//         </AnimatePresence>
//       </form>
//     </div>


//   );
// }

// // ─── Empty State ──────────────────────────────────────────────────────────────

// function EmptyState() {
//   return (
//     <motion.div
//       key="empty"
//       initial={{ opacity: 0, scale: 0.95, y: 10 }}
//       animate={{ opacity: 1, scale: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.95, y: 10 }}
//       transition={{ duration: 0.2, ease: easeOutCubic }}
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
//       <span className="alias-btn-loader text-neutral-400" />
//       <Paragraph variant="muted" className="text-xs">Loading aliases...</Paragraph>
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
//     <>
//       <div className="space-y-6">
//         <div>
//           <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
//             Create and Connect Email Aliases
//           </Heading>
//           <Paragraph variant="default" className="text-neutral-600 dark:text-neutral-400 mt-1">
//             Create email aliases for your domains. Each alias routes to a Slack or Discord integration.
//           </Paragraph>
//         </div>

//         <AliasAddForm
//           domains={domains}
//           integrations={integrations}
//           onAliasAdded={handleAliasAdded}
//         />

//         <Card className="">
//           <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100 pb-5">Your Email Aliases</Heading>
//           <AnimatePresence mode="sync">

//             {loading && (
//               <LoadingState key="loading" />
//             )}

//             {!loading && aliases.length === 0 && (
//               <EmptyState key="empty" />
//             )}
            
//             {!loading && aliases.length > 0 && (
//               <motion.div 
//               layout
//               transition={{ duration: 0.25, ease: easeOutQuart }}
//               className="space-y-2">
//                 <AnimatePresence mode="popLayout">
//                   {aliases.map((a) => (
//                     <AliasCard 
//                      key={a.id}
//                      alias={a}
//                      integrations={integrations}
//                      onDelete={handleDelete}
//                      onUpdate={handleUpdate}
//                     />
//                   ))}
//                 </AnimatePresence>
//               </motion.div>
//             )}
          
          
//           </AnimatePresence>
//         </Card>
//       </div>
//     </>
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
  IconAt,
} from "@tabler/icons-react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import AnimatedDropdown from "@/components/ui/AnimatedDropdown";
import { AnimatedSubmitButton } from "@/components/ui/AnimatedSubmitButton";
import { AnimatedDeleteButton } from "@/components/ui/AnimatedDeleteButton";
import { CustomLink } from "@/components/CustomLink";

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
      initial={{ opacity: 0, scale: 0.95, y: -2 }}
      animate={{
        opacity: deleteState === "success" ? 0 : 1,
        scale: deleteState === "success" ? 0.97 : 1,
        y: 0,
      }}
      exit={{ opacity: 0, scale: 0.97, y: -2 }}
      transition={{ duration: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
      style={{ transformOrigin: "top left" }}
    >
      <Card className="bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors duration-300 ease-out">
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
              <Badge className={`border-0 font-schibsted tracking-tight ${
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
          </div>
        </motion.div>
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
    <div className="space-y-6">
      <div>
        <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
          Create and Connect Email Aliases
        </Heading>
        <Paragraph variant="default" className="text-neutral-600 dark:text-neutral-400 mt-1">
          Create email aliases for your domains. Each alias routes to a Slack or Discord integration.
        </Paragraph>
      </div>

      <AliasAddForm
        domains={domains}
        integrations={integrations}
        onAliasAdded={handleAliasAdded}
      />



      <div className="border-2 border-dashed border-neutral-200 rounded-xl px-4 pt-3 pb-3">
        <Card className="min-h-[120px] overflow-hidden">
          <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
            Your Email Aliases
          </Heading>
          <Paragraph variant="small" className="text-neutral-600 dark:text-neutral-400 mt-1 pb-5">
            Manage your email aliases below. Click on an alias to view details or change its integration.
            </Paragraph>

            <AnimatePresence mode="wait">
              {loading && <LoadingState key="loading" />}

              {!loading && aliases.length === 0 && <EmptyState key="empty" />}

              {!loading && aliases.length > 0 && (
                <motion.div
                  key="list"
                  layout
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.7 }}
                  transition={{ duration: 0.15, ease: easeOutCubic }}
                  style={{ transformOrigin: "top left" }}
                  className="space-y-2"
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
    </div>
  );
}