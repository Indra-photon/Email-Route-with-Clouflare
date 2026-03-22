// "use client";

// import { useState, useEffect, useRef } from "react";
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
//   IconPencil,
//   IconMessageDots,
//   IconMessageFilled
// } from "@tabler/icons-react";
// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";
// import AnimatedDropdown from "@/components/ui/AnimatedDropdown";
// import { AnimatedSubmitButton } from "@/components/ui/AnimatedSubmitButton";
// import { AnimatedDeleteButton } from "@/components/ui/AnimatedDeleteButton";
// import { CustomLink } from "@/components/CustomLink";
// import { RefreshCw } from "lucide-react";
// import AliasesPageSkeleton from "@/components/dashboard/AliasesPageSkeleton";
// import { AnimatedButton } from "@/components/dashboard/DomainsTable";
// import useMeasure from "react-use-measure";

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

// type CannedResponse = {
//   _id: string;
//   title: string;
//   body: string;
//   createdAt: string;
// };

// type CannedFormState = "idle" | "loading" | "success";
// type ActiveTab = "edit" | "delete";

// // ─── Easing ───────────────────────────────────────────────────────────────────

// const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;
// const easeOutQuint = [0.23, 1, 0.32, 1] as const;
// const easeInCubic = [0.55, 0.055, 0.675, 0.19] as const;

// function CannedResponseModal({
//   aliasId,
//   aliasEmail,
//   buttonPosition,
//   onClose,
// }: {
//   aliasId: string;
//   aliasEmail: string;
//   buttonPosition: { x: number; y: number };
//   onClose: () => void;
// }) {
//   const [responses, setResponses] = useState<CannedResponse[]>([]);
//   const [loading, setLoading] = useState(true);

//   // "add" | "saved" — which top-level view is active
//   const [view, setView] = useState<"add" | "saved">("add");

//   // dropdown open state for Saved Responses button
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   // which sub-tab inside saved: "edit" | "delete"
//   const [activeTab, setActiveTab] = useState<ActiveTab>("edit");

//   // Add form
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");
//   const [formState, setFormState] = useState<CannedFormState>("idle");

//   // Edit state
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [editBody, setEditBody] = useState("");
//   const [editState, setEditState] = useState<CannedFormState>("idle");

//   const [elementRef, bounds] = useMeasure();
//   console.log("bounds.height", bounds.height, "view:", view);

//   useEffect(() => {
//     const fetchResponses = async () => {
//       try {
//         const res = await fetch(`/api/canned-responses?aliasId=${aliasId}`);
//         if (!res.ok) throw new Error("Failed to fetch");
//         setResponses(await res.json());
//       } catch {
//         toast.error("Could not load canned responses");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchResponses();
//   }, [aliasId]);

//   const handleAdd = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim() || !body.trim()) return;
//     setFormState("loading");
//     try {
//       const res = await fetch("/api/canned-responses", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ aliasId, title: title.trim(), body: body.trim() }),
//       });
//       if (!res.ok) throw new Error("Failed to create");
//       const created = await res.json();
//       setResponses((prev) => [created, ...prev]);
//       setTitle("");
//       setBody("");
//       setFormState("success");
//       setTimeout(() => setFormState("idle"), 2000);
//     } catch {
//       toast.error("Failed to add canned response");
//       setFormState("idle");
//     }
//   };

//   const handleEditSave = async (id: string) => {
//     if (!editTitle.trim() || !editBody.trim()) return;
//     setEditState("loading");
//     try {
//       const res = await fetch(`/api/canned-responses/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title: editTitle.trim(), body: editBody.trim() }),
//       });
//       if (!res.ok) throw new Error("Failed to update");
//       const updated = await res.json();
//       setResponses((prev) => prev.map((r) => (r._id === id ? updated : r)));
//       setEditState("success");
//       setTimeout(() => { setEditingId(null); setEditState("idle"); }, 1000);
//     } catch {
//       toast.error("Failed to update canned response");
//       setEditState("idle");
//     }
//   };

//   const startEdit = (r: CannedResponse) => {
//     setEditingId(r._id);
//     setEditTitle(r.title);
//     setEditBody(r.body);
//     setEditState("idle");
//   };

//   return (
//     <motion.div
//     initial={{
//             opacity: 0,
//             y: -10
//           }}
//           animate={{
//             opacity: 1,
//             y: 0,
//             transition: { type: "spring", stiffness: 300, damping: 23, duration: 0.18 }
//           }}
//           exit={{
//             opacity: 0,
//             transition: { duration: 0.25, ease: "easeInOut" }
//           }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//     >
//       {/* Backdrop */}
//       <motion.div
//         className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
//         onClick={() => {
//           onClose();
//         }}
//       />

//       {/* Modal */}
//         <motion.div>
//           <motion.div
//           initial={false}
//           animate={{ height: bounds.height || "auto" }}
//           transition={{ type: "spring", stiffness: 300, damping: 23, duration: 0.18 }}
//           className="relative w-[420px] overflow-hidden rounded-xl z-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-xl">
//           <div ref={elementRef} className="overflow-hidden rounded-xl">
//               {/* Header */}
//               <motion.div  
//                 className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800"
//               >
//                 <div>
//                   <p className="text-sm font-schibsted font-semibold text-neutral-900 dark:text-neutral-100">
//                     Canned Responses
//                   </p>
//                   <p className="text-xs font-schibsted text-neutral-500 mt-0.5">{aliasEmail}</p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     onClose();
//                   }}
//                   className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
//                 >
//                   <IconX size={15} className="text-neutral-500" />
//                 </button>
//               </motion.div>

//               {/* Top bar: Add New (left) + Saved Responses dropdown (right) */}
//               <motion.div
//                 className="flex items-center justify-between px-5 pt-3 pb-2"
//               >
//                 {/* Add New button */}
//                 <motion.button
//                   type="button"
//                   onClick={() => {
//                     setView("add");
//                     setDropdownOpen(false);
//                     setEditingId(null);
//                   }}
//                   className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-schibsted font-medium transition-colors focus:outline-none cursor-pointer ${
//                     view === "add"
//                       ? "text-neutral-900 dark:text-neutral-100"
//                       : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
//                   }`}
//                 >
//                   {view === "add" && (
//                     <motion.span
//                       className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-md z-0"
//                       transition={{ type: "spring", stiffness: 400, damping: 30 }}
//                     />
//                   )}
//                   <span className="relative z-10 flex items-center gap-1.5">
//                     <IconPlus size={12} />
//                     Add New
//                   </span>
//                 </motion.button>

//                 <div>
//                   <AnimatePresence mode="wait" initial={false}>
//                     {view === "add" ? (
//                       <motion.button
//                         key="saved-btn"
//                         type="button"
//                         onClick={() => {
//                           setView("saved");
//                           setActiveTab("edit");
//                           setEditingId(null);
//                         }}
//                         initial={{ opacity: 0, y: -6 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -6 }}
//                         transition={{ duration: 0.13, ease: [0.23, 1, 0.32, 1] }}
//                         className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-schibsted font-medium text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors focus:outline-none cursor-pointer"
//                       >
//                         <IconMessageDots size={12} />
//                         Saved Responses
//                       </motion.button>
//                     ) : (
//                       <motion.div
//                         key="sub-tabs"
//                         initial={{ opacity: 0, y: -6 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -6 }}
//                         transition={{ duration: 0.13, ease: [0.23, 1, 0.32, 1] }}
//                         className="flex items-center gap-0.5"
//                       >
//                         {(["edit", "delete"] as ActiveTab[]).map((tab) => (
//                           <button
//                             key={tab}
//                             type="button"
//                             onClick={() => {
//                               setActiveTab(tab);
//                               setEditingId(null);
//                             }}
//                             className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-schibsted font-medium transition-colors focus:outline-none cursor-pointer capitalize ${
//                               activeTab === tab
//                                 ? "text-neutral-900 dark:text-neutral-100"
//                                 : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
//                             }`}
//                           >
//                             {activeTab === tab && (
//                               <motion.span
//                                 layoutId={`subtab-bubble-${aliasId}`}
//                                 className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-md z-0"
//                                 transition={{ type: "spring", stiffness: 400, damping: 30 }}
//                               />
//                             )}
//                             <span className="relative z-10 flex items-center gap-1.5">
//                               {tab === "edit" ? <IconPencil size={11} /> : <IconTrash size={11} />}
//                               {tab === "edit" ? "Edit" : "Delete"}
//                             </span>
//                           </button>
//                         ))}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>

//               </motion.div>

//               {/* Content area */}
//               <motion.div
//               className="px-5 pb-1 rounded-b-xl">
//                 <AnimatePresence mode="popLayout" initial={false}>

//                   {/* ── Add New view ── */}
//                   {view === "add" && (
//                     <motion.form
//                       key="add-view"
//                       onSubmit={handleAdd}
//                       initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
//                       animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//                       exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
//                       transition={{ duration: 0.20, ease: "easeOut" }}
//                       className="pt-1 pb-4 space-y-2"
//                     >
//                       <input
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         placeholder="Title (e.g. Password Reset)"
//                         className="w-full text-xs font-schibsted bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md px-3 py-2 focus:outline-none focus:border-sky-400"
//                       />
//                       <textarea
//                         value={body}
//                         onChange={(e) => setBody(e.target.value)}
//                         placeholder="Response body... Use {customer_name}, {agent_name}"
//                         rows={4}
//                         className="w-full text-xs font-schibsted bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md px-3 py-2 focus:outline-none focus:border-sky-400 resize-none"
//                       />
//                       <AnimatedSubmitButton
//                         idleLabel="Add Response"
//                         loadingLabel="Adding..."
//                         successLabel="Added!"
//                         idleIcon={<IconPlus size={12} />}
//                         state={formState}
//                         idleWidth={110}
//                         loadingWidth={90}
//                         successWidth={76}
//                         className="px-3 py-1.5 rounded-md text-xs font-schibsted text-white bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center gap-1.5 overflow-hidden border-0 focus:outline-none cursor-pointer disabled:opacity-60"
//                       />
//                     </motion.form>
//                   )}

//                   {/* ── Saved Responses view ── */}
//                   {view === "saved" && (
//                     <motion.div
//                       key="saved-view"
//                       initial={{ opacity: 0, y: 6 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -6 }}
//                       transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
//                       className="pb-4"
//                     >
//                       {loading ? (
//                         <div className="flex items-center justify-center py-8 gap-2">
//                           <motion.div
//                             animate={{ rotate: 360 }}
//                             transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//                             className="w-3.5 h-3.5 border-2 border-neutral-300 border-t-neutral-500 rounded-full"
//                           />
//                           <p className="text-xs font-schibsted text-neutral-400">Loading...</p>
//                         </div>
//                       ) : responses.length === 0 ? (
//                         <p className="text-xs font-schibsted text-neutral-400 py-6 text-center">
//                           No canned responses yet. Use Add New to create one.
//                         </p>
//                       ) : (
//                         <AnimatePresence mode="wait" initial={false}>

//                           {/* Edit sub-tab */}
//                           {activeTab === "edit" && (
//                             <motion.div
//                               key="edit-tab"
//                               initial={{ opacity: 0, y: 4 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               exit={{ opacity: 0, y: -4 }}
//                               transition={{ duration: 0.13, ease: [0.23, 1, 0.32, 1] }}
//                               className="space-y-2 pt-1"
//                             >
//                               <AnimatePresence initial={false}>
//                                 {responses.map((r) => (
//                                   <motion.div
//                                     key={r._id}
//                                     layout
//                                     initial={{ opacity: 0, height: 0 }}
//                                     animate={{ opacity: 1, height: "auto" }}
//                                     exit={{ opacity: 0, height: 0, marginBottom: 0 }}
//                                     transition={{ type: "spring", stiffness: 300, damping: 28 }}
//                                     className="overflow-hidden"
//                                   >
//                                     <div className="border border-neutral-100 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-800/40">
//                                       <AnimatePresence mode="wait" initial={false}>
//                                         {editingId === r._id ? (
//                                           <motion.div
//                                             key="editing"
//                                             layout
//                                             initial={{ opacity: 0 }}
//                                             animate={{ opacity: 1 }}
//                                             exit={{ opacity: 0 }}
//                                             transition={{ duration: 0.12 }}
//                                             className="space-y-2"
//                                           >
//                                             <input
//                                               value={editTitle}
//                                               onChange={(e) => setEditTitle(e.target.value)}
//                                               className="w-full text-xs font-schibsted font-semibold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-sky-400"
//                                               placeholder="Title"
//                                             />
//                                             <textarea
//                                               value={editBody}
//                                               onChange={(e) => setEditBody(e.target.value)}
//                                               rows={3}
//                                               className="w-full text-xs font-schibsted bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-sky-400 resize-none"
//                                               placeholder="Response body..."
//                                             />
//                                             <div className="flex items-center gap-2">
//                                               <AnimatedButton
//                                                 idleLabel="Save"
//                                                 loadingLabel="Saving..."
//                                                 successLabel="Saved!"
//                                                 errorLabel="Failed"
//                                                 idleIcon={<IconCheck size={12} />}
//                                                 state={editState}
//                                                 onClick={() => handleEditSave(r._id)}
//                                                 idleWidth={60}
//                                                 loadingWidth={74}
//                                                 successWidth={66}
//                                                 errorWidth={60}
//                                                 className="px-3 py-1.5 rounded-md text-xs font-schibsted text-white bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center gap-1.5 overflow-hidden border-0 focus:outline-none cursor-pointer disabled:opacity-60"
//                                               />
//                                               <button
//                                                 type="button"
//                                                 onClick={() => setEditingId(null)}
//                                                 className="px-3 py-1.5 rounded-md text-xs font-schibsted text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
//                                               >
//                                                 Cancel
//                                               </button>
//                                             </div>
//                                           </motion.div>
//                                         ) : (
//                                           <motion.div
//                                             key="viewing"
//                                             layout
//                                             initial={{ opacity: 0 }}
//                                             animate={{ opacity: 1 }}
//                                             exit={{ opacity: 0 }}
//                                             transition={{ duration: 0.12 }}
//                                             className="flex items-start justify-between gap-3"
//                                           >
//                                             <div className="min-w-0">
//                                               <p className="text-xs font-schibsted font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">
//                                                 {r.title}
//                                               </p>
//                                               <p className="text-xs font-schibsted text-neutral-500 line-clamp-2">
//                                                 {r.body}
//                                               </p>
//                                             </div>
//                                             <button
//                                               type="button"
//                                               onClick={() => startEdit(r)}
//                                               className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-schibsted text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
//                                             >
//                                               <IconPencil size={11} />
//                                               Edit
//                                             </button>
//                                           </motion.div>
//                                         )}
//                                       </AnimatePresence>
//                                     </div>
//                                   </motion.div>
//                                 ))}
//                               </AnimatePresence>
//                             </motion.div>
//                           )}

//                           {/* Delete sub-tab */}
//                           {activeTab === "delete" && (
//                             <motion.div
//                               key="delete-tab"
//                               initial={{ opacity: 0, y: 4 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               exit={{ opacity: 0, y: -4 }}
//                               transition={{ duration: 0.13, ease: [0.23, 1, 0.32, 1] }}
//                               className="space-y-2 pt-1"
//                             >
//                               <AnimatePresence initial={false}>
//                                 {responses.map((r) => (
//                                   <motion.div
//                                     key={r._id}
//                                     layout
//                                     initial={{ opacity: 0, height: 0 }}
//                                     animate={{ opacity: 1, height: "auto" }}
//                                     exit={{ opacity: 0, height: 0, marginBottom: 0 }}
//                                     transition={{ type: "spring", stiffness: 300, damping: 28 }}
//                                     className="overflow-hidden"
//                                   >
//                                     <div className="border border-neutral-100 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-800/40 flex items-start justify-between gap-3">
//                                       <div className="min-w-0">
//                                         <p className="text-xs font-schibsted font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">
//                                           {r.title}
//                                         </p>
//                                         <p className="text-xs font-schibsted text-neutral-500 line-clamp-2">
//                                           {r.body}
//                                         </p>
//                                       </div>
//                                       <div className="shrink-0">
//                                         <AnimatedDeleteButton
//                                           onDelete={async () => {
//                                             try {
//                                               const res = await fetch(`/api/canned-responses/${r._id}`, {
//                                                 method: "DELETE",
//                                               });
//                                               if (!res.ok) throw new Error("Failed");
//                                               setTimeout(() => {
//                                                 setResponses((prev) => prev.filter((x) => x._id !== r._id));
//                                               }, 300);
//                                               return "success";
//                                             } catch {
//                                               toast.error("Failed to delete");
//                                               return "error";
//                                             }
//                                           }}
//                                         />
//                                       </div>
//                                     </div>
//                                   </motion.div>
//                                 ))}
//                               </AnimatePresence>
//                             </motion.div>
//                           )}

//                         </AnimatePresence>
//                       )}
//                     </motion.div>
//                   )}

//                 </AnimatePresence>
//               </motion.div>
//             </div>
//           </motion.div>
//         </motion.div>
//     </motion.div>
//   );
// }

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
//   const [cannedOpen, setCannedOpen] = useState(false);
//   const [originRect, setOriginRect] = useState<DOMRect | null>(null);
//   const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
//   const triggerRef = useRef<HTMLButtonElement>(null);

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

//             <div className="flex items-center gap-2 pt-1">
//               <button
//                 ref={triggerRef}
//                 type="button"
//                 onClick={() => {
//                   const rect = triggerRef.current?.getBoundingClientRect();
//                   if (rect) setButtonPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
//                   setCannedOpen(true);
//                 }}
//                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-schibsted font-semibold text-neutral-600 dark:text-neutral-400 border border-neutral-400 dark:border-neutral-700 hover:border-neutral-600 dark:hover:bg-neutral-800 transition-colors duration-150 ease-out cursor-pointer focus:outline-none"
//               >
//                 <IconMessageFilled size={13} />
//                 Canned Responses
//               </button>
//             </div>
//           </div>
//         </motion.div>


//         <AnimatePresence>
//           {cannedOpen && (
//             <CannedResponseModal
//               aliasId={alias.id}
//               aliasEmail={alias.email}
//               buttonPosition={buttonPosition}
//               onClose={() => setCannedOpen(false)}
//             />
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
//         toast.success(`Alias "${created.email}" created`);
//         setLocalPart("");  // ← correct
//         onAliasAdded(created);
//         setTimeout(() => setStatus("idle"), 2500);
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



// // ─── Root Export ──────────────────────────────────────────────────────────────

// export default function AliasesPage() {
//   const [domains, setDomains] = useState<DomainOption[]>([]);
//   const [aliases, setAliases] = useState<Alias[]>([]);
//   const [integrations, setIntegrations] = useState<IntegrationOption[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [cannedButtonPos, setCannedButtonPos] = useState({ x: 0, y: 0 });
// const cannedTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
// const [cannedAliasId, setCannedAliasId] = useState<string | null>(null);
// const [mobileAlias, setMobileAlias] = useState<Alias | null>(null);


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
//       className="space-y-6 border border-neutral-400 rounded-lg p-4 min-h-screen"
//     >
//       <div>
//         <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
//           Create Email Aliases for Your Domains
//         </Heading>
//         <Paragraph variant="small" className="text-neutral-600 dark:text-neutral-400 mt-1">
//           Set up email addresses like support@yourdomain.com and route them to your Slack or Discord channels. Each alias can be connected to any integration.
//         </Paragraph>
//       </div>

//       <AliasAddForm
//         domains={domains}
//         integrations={integrations}
//         onAliasAdded={handleAliasAdded}
//       />

//       <div className="border-t border-neutral-400 dark:border-neutral-800" />

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

//             <AnimatePresence mode="wait" initial={false}>
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

//               {!loading && aliases.length === 0 && (
//                 <motion.div
//                   key="empty"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.15, ease: easeOutCubic }}
//                 >
//                   <EmptyState />
//                 </motion.div>
//               )}


//               {!loading && aliases.length > 0 && (
//                 <motion.div
//                   key="table"
//                   initial={{ opacity: 0.90, scale: 0.98 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0.90, scale: 0.98 }}
//                   transition={{ duration: 0.15, ease: easeOutCubic }}
//                   style={{ transformOrigin: "top center" }}
//                   className="hidden md:block overflow-x-auto rounded-lg border border-neutral-900 dark:border-neutral-700">

//                   <motion.table className="min-w-full text-xs overflow-visible font-schibsted">
//                     <thead>
//                       <tr>
//                         {["Email", "Status", "Domain", "Integration", "Created At", "Canned Responses", "Actions"].map((h) => (
//                           <th key={h} className="px-3 py-2 text-left font-schibsted bg-linear-to-b from-sky-700 to-cyan-600 text-neutral-50">
//                             {h}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {aliases.map((a) => (
//                         <tr key={a.id} className="border-t border-neutral-900 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors duration-150">
//                           <td className="px-3 py-2 font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">
//                             {a.email}
//                           </td>
//                           <td className="px-3 py-2">
//                             <span className={`inline-flex items-center rounded-sm px-2 py-0.5 font-schibsted font-semibold border ${
//                               a.status === "active"
//                                 ? "bg-green-50 border-green-900 text-green-800 dark:bg-green-900/30 dark:text-green-400"
//                                 : "bg-neutral-100 border-neutral-400 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
//                             }`}>
//                               {a.status === "active" ? "Active" : "Inactive"}
//                             </span>
//                           </td>
//                           <td className="px-3 py-2 font-schibsted text-neutral-500 dark:text-neutral-400">
//                             {a.domain}
//                           </td>
//                           <td className="px-3 py-2 font-schibsted text-neutral-500 dark:text-neutral-400">
//                             {a.integrationName ?? "—"}
//                           </td>
//                           <td className="px-3 py-2 font-schibsted text-neutral-500 dark:text-neutral-400 tabular-nums">
//                             {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
//                           </td>
//                           <td className="px-3 py-2">
//                               <button
//                                 type="button"
//                                 ref={(el) => { cannedTriggerRefs.current[a.id] = el; }}
//                                 onClick={() => {
//                                   const rect = cannedTriggerRefs.current[a.id]?.getBoundingClientRect();
//                                   if (rect) setCannedButtonPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
//                                   setCannedAliasId(a.id);
//                                 }}
//                                 className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-schibsted font-semibold text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-600 hover:text-neutral-900 dark:hover:bg-neutral-800 transition-colors duration-150 cursor-pointer focus:outline-none"
//                               >
//                                 <IconMessageFilled size={12} />
//                                 Canned Responses
//                               </button>
//                           </td>
//                           <td className="px-3 py-2">
//                               <div className="flex items-center gap-2">
//                                 <button
//                                   type="button"
//                                   className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-schibsted text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
//                                 >
//                                   <IconPencil size={11} />
//                                   Edit
//                                 </button>
//                                 <button
//                                   type="button"
//                                   onClick={async () => {
//                                     try {
//                                       const res = await fetch(`/api/aliases/${a.id}`, { method: "DELETE" });
//                                       if (!res.ok) throw new Error((await res.json()).error || "Failed to delete");
//                                       toast.success(`Alias "${a.email}" deleted`);
//                                       handleDelete(a.id);
//                                     } catch (err: any) {
//                                       toast.error(err.message || "Failed to delete alias");
//                                     }
//                                   }}
//                                   className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-schibsted text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer focus:outline-none"
//                                 >
//                                   <IconTrash size={11} />
//                                   Delete
//                                 </button>
//                               </div>
//                             </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </motion.table>

//                   <div className="block md:hidden space-y-px rounded-lg border border-neutral-900 dark:border-neutral-700 overflow-hidden">
//                   {aliases.map((a) => (
//                     <button
//                       key={a.id}
//                       type="button"
//                       onClick={() => setMobileAlias(a)}
//                       className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer focus:outline-none"
//                     >
//                       <div className="min-w-0 text-left">
//                         <p className="text-xs font-schibsted font-semibold text-neutral-800 dark:text-neutral-200 truncate">{a.email}</p>
//                         <p className="text-xs font-schibsted text-neutral-400 truncate">{a.domain}</p>
//                       </div>
//                       <span className={`ml-3 shrink-0 inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-schibsted font-semibold border ${
//                         a.status === "active"
//                           ? "bg-green-50 border-green-900 text-green-800"
//                           : "bg-neutral-100 border-neutral-400 text-neutral-600"
//                       }`}>
//                         {a.status === "active" ? "Active" : "Inactive"}
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//                 </motion.div>

        
//               )}
//             </AnimatePresence>
//         </Card>
//       </motion.div>

//       <AnimatePresence>
//           {cannedAliasId && (
//             <CannedResponseModal
//               aliasId={cannedAliasId}
//               aliasEmail={aliases.find((a) => a.id === cannedAliasId)?.email ?? ""}
//               buttonPosition={cannedButtonPos}
//               onClose={() => setCannedAliasId(null)}
//             />
//           )}
//         </AnimatePresence>

//         <AnimatePresence>
//   {mobileAlias && (
//     <>
//       <motion.div
//         className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.2 }}
//         onClick={() => setMobileAlias(null)}
//       />
//       <motion.div
//         className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 rounded-t-2xl border-t border-neutral-200 dark:border-neutral-700 shadow-xl"
//         initial={{ y: "100%" }}
//         animate={{ y: 0 }}
//         exit={{ y: "100%" }}
//         transition={{ type: "spring", stiffness: 300, damping: 30 }}
//       >
//         {/* Handle */}
//         <div className="flex justify-center pt-3 pb-1">
//           <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
//         </div>

//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 dark:border-neutral-800">
//           <p className="text-sm font-schibsted font-semibold text-neutral-900 dark:text-neutral-100">{mobileAlias.email}</p>
//           <button
//             type="button"
//             onClick={() => setMobileAlias(null)}
//             className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none"
//           >
//             <IconX size={15} className="text-neutral-500" />
//           </button>
//         </div>

//         {/* Details */}
//         <div className="px-5 py-4 grid grid-cols-2 gap-4">
//           <div>
//             <p className="text-xs font-schibsted font-semibold text-neutral-400 mb-0.5">Local Part</p>
//             <p className="text-sm font-schibsted text-neutral-800 dark:text-neutral-200">{mobileAlias.localPart}</p>
//           </div>
//           <div>
//             <p className="text-xs font-schibsted font-semibold text-neutral-400 mb-0.5">Domain</p>
//             <p className="text-sm font-schibsted text-neutral-800 dark:text-neutral-200">{mobileAlias.domain}</p>
//           </div>
//           <div>
//             <p className="text-xs font-schibsted font-semibold text-neutral-400 mb-0.5">Integration</p>
//             <p className="text-sm font-schibsted text-neutral-800 dark:text-neutral-200">{mobileAlias.integrationName ?? "—"}</p>
//           </div>
//           <div>
//             <p className="text-xs font-schibsted font-semibold text-neutral-400 mb-0.5">Status</p>
//             <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-schibsted font-semibold border ${
//               mobileAlias.status === "active"
//                 ? "bg-green-50 border-green-900 text-green-800"
//                 : "bg-neutral-100 border-neutral-400 text-neutral-600"
//             }`}>
//               {mobileAlias.status === "active" ? "Active" : "Inactive"}
//             </span>
//           </div>
//           <div>
//             <p className="text-xs font-schibsted font-semibold text-neutral-400 mb-0.5">Created At</p>
//             <p className="text-sm font-schibsted text-neutral-800 dark:text-neutral-200 tabular-nums">
//               {new Date(mobileAlias.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
//             </p>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="px-5 pb-8 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
//           <button
//             type="button"
//             onClick={() => {
//               const rect = cannedTriggerRefs.current[mobileAlias.id]?.getBoundingClientRect();
//               if (rect) setCannedButtonPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
//               setCannedAliasId(mobileAlias.id);
//               setMobileAlias(null);
//             }}
//             className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-schibsted font-semibold text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-600 transition-colors cursor-pointer focus:outline-none"
//           >
//             <IconMessageFilled size={12} />
//             Canned Responses
//           </button>
//           <button
//             type="button"
//             onClick={async () => {
//               try {
//                 const res = await fetch(`/api/aliases/${mobileAlias.id}`, { method: "DELETE" });
//                 if (!res.ok) throw new Error((await res.json()).error || "Failed to delete");
//                 toast.success(`Alias "${mobileAlias.email}" deleted`);
//                 handleDelete(mobileAlias.id);
//                 setMobileAlias(null);
//               } catch (err: any) {
//                 toast.error(err.message || "Failed to delete alias");
//               }
//             }}
//             className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-schibsted font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-50 transition-colors cursor-pointer focus:outline-none"
//           >
//             <IconTrash size={12} />
//             Delete
//           </button>
//         </div>
//       </motion.div>
//     </>
//   )}
// </AnimatePresence>
//     </motion.div>
//   );
// }


"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  IconCheck,
  IconTrash,
  IconPlus,
  IconX,
  IconMail,
  IconAt,
  IconPencil,
  IconMessageDots,
  IconMessageFilled,
  IconTable,
} from "@tabler/icons-react";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import AnimatedDropdown from "@/components/ui/AnimatedDropdown";
import { AnimatedSubmitButton } from "@/components/ui/AnimatedSubmitButton";
import { AnimatedDeleteButton } from "@/components/ui/AnimatedDeleteButton";
import { CustomLink } from "@/components/CustomLink";
import AliasesPageSkeleton from "@/components/dashboard/AliasesPageSkeleton";
import { AnimatedButton } from "@/components/dashboard/DomainsTable";
import useMeasure from "react-use-measure";

// ─── Types ────────────────────────────────────────────────────────────────────

type DomainOption = { id: string; domain: string };

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

type IntegrationOption = { id: string; name: string; type: "slack" | "discord" };
type CannedResponse = { _id: string; title: string; body: string; createdAt: string };
type CannedFormState = "idle" | "loading" | "success";
type ActiveTab = "edit" | "delete";
type PageTab = "aliases" | "add" | "edit" | "delete";

// ─── Easing ───────────────────────────────────────────────────────────────────

const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;
const easeOutQuint = [0.23, 1, 0.32, 1] as const;

// ─── Canned Response Modal ────────────────────────────────────────────────────

function CannedResponseModal({
  aliasId,
  aliasEmail,
  onClose,
}: {
  aliasId: string;
  aliasEmail: string;
  onClose: () => void;
}) {
  const [responses, setResponses] = useState<CannedResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"add" | "saved">("add");
  const [activeTab, setActiveTab] = useState<ActiveTab>("edit");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [formState, setFormState] = useState<CannedFormState>("idle");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editState, setEditState] = useState<CannedFormState>("idle");
  const [elementRef, bounds] = useMeasure();

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
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <motion.div
          initial={false}
          animate={{ height: bounds.height ? bounds.height : "" }}
          transition={{ type: "spring", stiffness: 300, damping: 23 }}
          className="relative w-[420px] overflow-hidden rounded-xl z-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-xl"
        >
          <div ref={elementRef}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <p className="text-sm font-schibsted font-semibold text-neutral-900 dark:text-neutral-100">Canned Responses</p>
                <p className="text-xs font-schibsted text-neutral-500 mt-0.5">{aliasEmail}</p>
              </div>
              <button type="button" onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none">
                <IconX size={15} className="text-neutral-500" />
              </button>
            </div>

            {/* Tab bar */}
            <div className="flex items-center justify-between px-5 pt-3 pb-2">
              <motion.button
                type="button"
                onClick={() => { setView("add"); setEditingId(null); }}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-schibsted font-medium transition-colors focus:outline-none cursor-pointer ${view === "add" ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600"}`}
              >
                {view === "add" && (
                  <motion.span layoutId="canned-tab-bg" className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-md z-0" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                <span className="relative z-10 flex items-center gap-1.5"><IconPlus size={12} />Add New</span>
              </motion.button>

              <div>
                <AnimatePresence mode="wait" initial={false}>
                  {view === "add" ? (
                    <motion.button key="saved-btn" type="button" onClick={() => { setView("saved"); setActiveTab("edit"); setEditingId(null); }}
                      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.13, ease: [0.23, 1, 0.32, 1] }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-schibsted font-medium text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 transition-colors focus:outline-none cursor-pointer"
                    >
                      <IconMessageDots size={12} />Saved Responses
                    </motion.button>
                  ) : (
                    <motion.div key="sub-tabs" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.13, ease: [0.23, 1, 0.32, 1] }} className="flex items-center gap-0.5"
                    >
                      {(["edit", "delete"] as ActiveTab[]).map((tab) => (
                        <button key={tab} type="button" onClick={() => { setActiveTab(tab); setEditingId(null); }}
                          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-schibsted font-medium transition-colors focus:outline-none cursor-pointer capitalize ${activeTab === tab ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600"}`}
                        >
                          {activeTab === tab && (
                            <motion.span layoutId={`subtab-bubble-${aliasId}`} className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-md z-0" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
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
              </div>
            </div>

            {/* Content */}
            <div className="px-5 pb-1">
              <AnimatePresence mode="popLayout" initial={false}>
                {view === "add" && (
                  <motion.form key="add-view" onSubmit={handleAdd}
                    initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.20, ease: "easeOut" }}
                    className="pt-1 pb-4 space-y-2"
                  >
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (e.g. Password Reset)"
                      className="w-full text-xs font-schibsted bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md px-3 py-2 focus:outline-none focus:border-sky-400" />
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Response body... Use {customer_name}, {agent_name}" rows={4}
                      className="w-full text-xs font-schibsted bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md px-3 py-2 focus:outline-none focus:border-sky-400 resize-none" />
                    <AnimatedSubmitButton idleLabel="Add Response" loadingLabel="Adding..." successLabel="Added!" idleIcon={<IconPlus size={12} />}
                      state={formState} idleWidth={110} loadingWidth={90} successWidth={76}
                      className="px-3 py-1.5 rounded-md text-xs font-schibsted text-white bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center gap-1.5 overflow-hidden border-0 focus:outline-none cursor-pointer disabled:opacity-60" />
                  </motion.form>
                )}

                {view === "saved" && (
                  <motion.div key="saved-view"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }} className="pb-4"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center py-8 gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-3.5 h-3.5 border-2 border-neutral-300 border-t-neutral-500 rounded-full" />
                        <p className="text-xs font-schibsted text-neutral-400">Loading...</p>
                      </div>
                    ) : responses.length === 0 ? (
                      <p className="text-xs font-schibsted text-neutral-400 py-6 text-center">No canned responses yet. Use Add New to create one.</p>
                    ) : (
                      <AnimatePresence mode="wait" initial={false}>
                        {activeTab === "edit" && (
                          <motion.div key="edit-tab" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.13, ease: [0.23, 1, 0.32, 1] }} className="space-y-2 pt-1"
                          >
                            <AnimatePresence initial={false}>
                              {responses.map((r) => (
                                <motion.div key={r._id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }} transition={{ type: "spring", stiffness: 300, damping: 28 }} className="overflow-hidden"
                                >
                                  <div className="border border-neutral-100 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-800/40">
                                    <AnimatePresence mode="wait" initial={false}>
                                      {editingId === r._id ? (
                                        <motion.div key="editing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="space-y-2">
                                          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                                            className="w-full text-xs font-schibsted font-semibold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-sky-400" placeholder="Title" />
                                          <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={3}
                                            className="w-full text-xs font-schibsted bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-sky-400 resize-none" placeholder="Response body..." />
                                          <div className="flex items-center gap-2">
                                            <AnimatedButton idleLabel="Save" loadingLabel="Saving..." successLabel="Saved!" errorLabel="Failed"
                                              idleIcon={<IconCheck size={12} />} state={editState} onClick={() => handleEditSave(r._id)}
                                              idleWidth={60} loadingWidth={74} successWidth={66} errorWidth={60}
                                              className="px-3 py-1.5 rounded-md text-xs font-schibsted text-white bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center gap-1.5 overflow-hidden border-0 focus:outline-none cursor-pointer disabled:opacity-60" />
                                            <button type="button" onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-md text-xs font-schibsted text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none">Cancel</button>
                                          </div>
                                        </motion.div>
                                      ) : (
                                        <motion.div key="viewing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="flex items-start justify-between gap-3">
                                          <div className="min-w-0">
                                            <p className="text-xs font-schibsted font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">{r.title}</p>
                                            <p className="text-xs font-schibsted text-neutral-500 line-clamp-2">{r.body}</p>
                                          </div>
                                          <button type="button" onClick={() => startEdit(r)} className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-schibsted text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none">
                                            <IconPencil size={11} />Edit
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

                        {activeTab === "delete" && (
                          <motion.div key="delete-tab" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.13, ease: [0.23, 1, 0.32, 1] }} className="space-y-2 pt-1"
                          >
                            <AnimatePresence initial={false}>
                              {responses.map((r) => (
                                <motion.div key={r._id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }} transition={{ type: "spring", stiffness: 300, damping: 28 }} className="overflow-hidden"
                                >
                                  <div className="border border-neutral-100 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-800/40 flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="text-xs font-schibsted font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">{r.title}</p>
                                      <p className="text-xs font-schibsted text-neutral-500 line-clamp-2">{r.body}</p>
                                    </div>
                                    <div className="shrink-0">
                                      <AnimatedDeleteButton onDelete={async () => {
                                        try {
                                          const res = await fetch(`/api/canned-responses/${r._id}`, { method: "DELETE" });
                                          if (!res.ok) throw new Error("Failed");
                                          setTimeout(() => setResponses((prev) => prev.filter((x) => x._id !== r._id)), 300);
                                          return "success";
                                        } catch { toast.error("Failed to delete"); return "error"; }
                                      }} />
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
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Aliases Table (shared across tabs) ──────────────────────────────────────

function AliasesTable({
  aliases,
  mode,
  integrations,
  cannedTriggerRefs,
  onCannedOpen,
  onDelete,
  onUpdate,
}: {
  aliases: Alias[];
  mode: "view" | "edit" | "delete";
  integrations: IntegrationOption[];
  cannedTriggerRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
  onCannedOpen: (aliasId: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (updated: Alias) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editIntegration, setEditIntegration] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleRowClick = (aliasId: string, currentIntegrationId: string | null) => {
    if (mode !== "edit") return;
    if (expandedId === aliasId) {
      setExpandedId(null);
    } else {
      setExpandedId(aliasId);
      setEditIntegration(currentIntegrationId ?? "");
      setSaveState("idle");
    }
  };

  const handleSave = async (alias: Alias) => {
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
      setTimeout(() => { setSaveState("idle"); setExpandedId(null); }, 1500);
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 2000);
    }
  };

  const columns = mode === "view"
    ? ["Email", "Status", "Domain", "Integration", "Created At", "Canned Responses"]
    : mode === "edit"
    ? ["Email", "Status", "Domain", "Integration", "Created At"]
    : ["Email", "Status", "Domain", "Integration", "Created At", "Delete"];

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-900 dark:border-neutral-700">
      <table className="min-w-full text-xs font-schibsted">
        <thead>
          <tr>
            {columns.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-schibsted bg-linear-to-b from-sky-700 to-cyan-600 text-neutral-50">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {aliases.map((a) => (
            <>
              <tr
                key={a.id}
                onClick={() => handleRowClick(a.id, a.integrationId)}
                className={`border-t border-neutral-900 dark:border-neutral-700 transition-colors duration-150 ${
                  mode === "edit" ? "cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/10" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                } ${expandedId === a.id ? "bg-sky-50 dark:bg-sky-900/10" : ""}`}
              >
                <td className="px-3 py-2 font-schibsted font-semibold text-neutral-700 dark:text-neutral-300">
                  <div className="flex items-center gap-2">
                    {mode === "edit" && (
                      <motion.span animate={{ rotate: expandedId === a.id ? 90 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="text-neutral-400">
                        ›
                      </motion.span>
                    )}
                    {a.email}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center rounded-sm px-2 py-0.5 font-schibsted font-semibold border ${
                    a.status === "active"
                      ? "bg-green-50 border-green-900 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-neutral-100 border-neutral-400 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                  }`}>
                    {a.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 py-2 font-schibsted text-neutral-500 dark:text-neutral-400">{a.domain}</td>
                <td className="px-3 py-2 font-schibsted text-neutral-500 dark:text-neutral-400">{a.integrationName ?? "—"}</td>
                <td className="px-3 py-2 font-schibsted text-neutral-500 dark:text-neutral-400 tabular-nums">
                  {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>

                {mode === "view" && (
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      ref={(el) => { cannedTriggerRefs.current[a.id] = el; }}
                      onClick={(e) => { e.stopPropagation(); onCannedOpen(a.id); }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-schibsted font-semibold text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-600 hover:text-neutral-900 dark:hover:bg-neutral-800 transition-colors duration-150 cursor-pointer focus:outline-none"
                    >
                      <IconMessageFilled size={12} />Canned Responses
                    </button>
                  </td>
                )}

                {mode === "delete" && (
                  <td className="px-3 py-2">
                    <AnimatedDeleteButton onDelete={async () => {
                      try {
                        const res = await fetch(`/api/aliases/${a.id}`, { method: "DELETE" });
                        if (!res.ok) throw new Error((await res.json()).error || "Failed to delete");
                        toast.success(`Alias "${a.email}" deleted`);
                        setTimeout(() => onDelete(a.id), 400);
                        return "success";
                      } catch (err: any) {
                        toast.error(err.message || "Failed to delete alias");
                        return "error";
                      }
                    }} />
                  </td>
                )}
              </tr>

              {/* Inline edit row */}
              {mode === "edit" && expandedId === a.id && (
                <tr key={`${a.id}-edit`} className="border-t border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-900/5">
                  <td colSpan={5} className="px-4 py-3">
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                      className="flex items-center gap-3 flex-wrap"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-schibsted font-semibold text-neutral-500">Integration</label>
                        <AnimatedDropdown
                          label=""
                          options={[
                            { value: "", label: "None" },
                            ...integrations.map((i) => ({ value: i.id, label: `${i.name} (${i.type})` })),
                          ]}
                          value={editIntegration}
                          onChange={setEditIntegration}
                          placeholder="Select integration"
                          disabled={saveState === "loading"}
                          width="w-52"
                        />
                      </div>
                      <div className="flex items-end gap-2 pb-0.5 mt-4">
                        <AnimatedButton
                          idleLabel="Save"
                          loadingLabel="Saving..."
                          successLabel="Saved!"
                          errorLabel="Failed"
                          idleIcon={<IconCheck size={12} />}
                          state={saveState}
                          onClick={() => handleSave(a)}
                          idleWidth={72}
                          loadingWidth={84}
                          successWidth={72}
                          errorWidth={72}
                          className="px-3 py-1.5 rounded-md text-xs font-schibsted text-white bg-gradient-to-t from-sky-900 to-cyan-600 flex items-center justify-center gap-1.5 overflow-hidden border-0 focus:outline-none cursor-pointer disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={() => setExpandedId(null)}
                          className="px-3 py-1.5 rounded-md text-xs font-schibsted text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer focus:outline-none"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
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
        <IconMail size={18} className="text-white" />
      </div>
      <Paragraph variant="muted" className="text-center max-w-lg">
        No aliases yet. Go to Add Alias to create your first one. <br/>
        <CustomLink href="/docs/aliases" className="text-sky-800 underline font-schibsted font-bold ">Read our docs</CustomLink>
      </Paragraph>
    </motion.div>
  );
}

// ─── Mobile Bottom Sheet ──────────────────────────────────────────────────────

function MobileBottomSheet({
  alias,
  onClose,
  onDelete,
  onCannedOpen,
}: {
  alias: Alias;
  onClose: () => void;
  onDelete: (id: string) => void;
  onCannedOpen: (aliasId: string) => void;
}) {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }} onClick={onClose}
      />
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 rounded-t-2xl border-t border-neutral-200 dark:border-neutral-700 shadow-xl"
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 dark:border-neutral-800">
          <p className="text-sm font-schibsted font-semibold text-neutral-900 dark:text-neutral-100">{alias.email}</p>
          <button type="button" onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none">
            <IconX size={15} className="text-neutral-500" />
          </button>
        </div>
        <div className="px-5 py-4 grid grid-cols-2 gap-4">
          {[
            ["Local Part", alias.localPart],
            ["Domain", alias.domain],
            ["Integration", alias.integrationName ?? "—"],
            ["Status", alias.status],
            ["Created At", new Date(alias.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs font-schibsted font-semibold text-neutral-400 mb-0.5">{label}</p>
              <p className="text-sm font-schibsted text-neutral-800 dark:text-neutral-200">{value}</p>
            </div>
          ))}
        </div>
        <div className="px-5 pb-8 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
          <button type="button" onClick={() => { onCannedOpen(alias.id); onClose(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-schibsted font-semibold text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-600 transition-colors cursor-pointer focus:outline-none"
          >
            <IconMessageFilled size={12} />Canned Responses
          </button>
          <button type="button"
            onClick={async () => {
              try {
                const res = await fetch(`/api/aliases/${alias.id}`, { method: "DELETE" });
                if (!res.ok) throw new Error((await res.json()).error || "Failed to delete");
                toast.success(`Alias "${alias.email}" deleted`);
                onDelete(alias.id);
                onClose();
              } catch (err: any) { toast.error(err.message || "Failed to delete alias"); }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-schibsted font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-50 transition-colors cursor-pointer focus:outline-none"
          >
            <IconTrash size={12} />Delete
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Page Tabs Config ─────────────────────────────────────────────────────────

const PAGE_TABS: { id: PageTab; label: string; icon: React.ReactNode }[] = [
  { id: "aliases", label: "Email Aliases", icon: <IconTable size={13} /> },
  { id: "add", label: "Add Alias", icon: <IconPlus size={13} /> },
  { id: "edit", label: "Edit", icon: <IconPencil size={13} /> },
  { id: "delete", label: "Delete", icon: <IconTrash size={13} /> },
];

// ─── Root Export ──────────────────────────────────────────────────────────────

export default function AliasesPage() {
  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [aliases, setAliases] = useState<Alias[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePageTab, setActivePageTab] = useState<PageTab>("aliases");

  // Add form state
  const [addStatus, setAddStatus] = useState<"idle" | "loading" | "success">("idle");
  const [selectedDomainId, setSelectedDomainId] = useState("");
  const [localPart, setLocalPart] = useState("");
  const [selectedIntegrationId, setSelectedIntegrationId] = useState("");

  // Canned modal
  const [cannedAliasId, setCannedAliasId] = useState<string | null>(null);
  const cannedTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Mobile
  const [mobileAlias, setMobileAlias] = useState<Alias | null>(null);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        const [domainsRes, aliasesRes, integrationsRes] = await Promise.all([
          fetch("/api/domains"),
          fetch("/api/aliases"),
          fetch("/api/integrations"),
        ]);
        if (!domainsRes.ok || !aliasesRes.ok || !integrationsRes.ok) throw new Error("Failed to load");
        const domainsData = await domainsRes.json();
        const aliasesData: Alias[] = await aliasesRes.json();
        const integrationsData = await integrationsRes.json();
        setDomains(domainsData.map((d: any) => ({ id: d.id, domain: d.domain })));
        setAliases(aliasesData);
        setIntegrations(integrationsData.map((i: any) => ({ id: i.id, name: i.name, type: i.type })));
        setSelectedDomainId(domainsData[0]?.id ?? "");
        setSelectedIntegrationId(integrationsData[0]?.id ?? "");
      } catch (err) {
        toast.error("Could not load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleDelete = (id: string) => setAliases((prev) => prev.filter((a) => a.id !== id));
  const handleUpdate = (updated: Alias) => setAliases((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDomainId || !localPart.trim() || addStatus !== "idle") return;
    setAddStatus("loading");
    try {
      const res = await fetch("/api/aliases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId: selectedDomainId, localPart: localPart.trim(), integrationId: selectedIntegrationId || undefined }),
      });
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || "Failed to create alias"); }
      const created: Alias = await res.json();
      setTimeout(() => {
        setAddStatus("success");
        toast.success(`Alias "${created.email}" created`);
        setLocalPart("");
        setAliases((prev) => [created, ...prev]);
        setTimeout(() => setAddStatus("idle"), 2500);
      }, 1000);
    } catch (err) {
      setAddStatus("idle");
      toast.error(err instanceof Error ? err.message : "Failed to create alias");
    }
  };

  return (
    <div className="space-y-6 border border-neutral-400 rounded-lg p-4 max-h-screen">
      {/* Page heading */}
      <div>
        <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
          Create Email Aliases for Your Domains
        </Heading>
        <Paragraph variant="small" className="text-neutral-600 dark:text-neutral-400 mt-1">
          Set up email addresses like support@yourdomain.com and route them to your Slack or Discord channels.
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
              onClick={() => setActivePageTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-schibsted font-semibold transition-all duration-150 focus:outline-none cursor-pointer ${
                activePageTab === tab.id
                  ? "text-white"
                  : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              {activePageTab === tab.id && (
                <motion.span
                  layoutId="page-tab-bg"
                  className="absolute inset-0 bg-gradient-to-r from-sky-800 to-cyan-700 rounded-lg z-0 shadow-sm"
                  transition={{ type: "spring", stiffness: 280, damping: 30, duration: 0.3 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.id === "aliases" && <IconTable size={15} />}
                {tab.id === "add" && <IconPlus size={15} />}
                {tab.id === "edit" && <IconPencil size={15} />}
                {tab.id === "delete" && <IconTrash size={15} />}
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="pt-4">
          <AnimatePresence mode="wait" initial={false}>

            {/* ── Email Aliases tab ── */}
            {activePageTab === "aliases" && (
              <motion.div key="aliases"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                {loading ? (
                  <AliasesPageSkeleton />
                ) : aliases.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    {/* Desktop table */}
                    <div className="hidden md:block">
                      <AliasesTable
                        aliases={aliases} mode="view" integrations={integrations}
                        cannedTriggerRefs={cannedTriggerRefs}
                        onCannedOpen={(id) => setCannedAliasId(id)}
                        onDelete={handleDelete} onUpdate={handleUpdate}
                      />
                    </div>
                    {/* Mobile list */}
                    <div className="block md:hidden space-y-px rounded-lg border border-neutral-900 dark:border-neutral-700 overflow-hidden">
                      {aliases.map((a) => (
                        <button key={a.id} type="button" onClick={() => setMobileAlias(a)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer focus:outline-none"
                        >
                          <div className="min-w-0 text-left">
                            <p className="text-xs font-schibsted font-semibold text-neutral-800 dark:text-neutral-200 truncate">{a.email}</p>
                            <p className="text-xs font-schibsted text-neutral-400 truncate">{a.domain}</p>
                          </div>
                          <span className={`ml-3 shrink-0 inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-schibsted font-semibold border ${a.status === "active" ? "bg-green-50 border-green-900 text-green-800" : "bg-neutral-100 border-neutral-400 text-neutral-600"}`}>
                            {a.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ── Add Alias tab ── */}
            {activePageTab === "add" && (
              <motion.div key="add"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                <form onSubmit={handleAddSubmit} className="space-y-4">
                  <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-schibsted text-neutral-700 dark:text-neutral-300">Local part</label>
                      <input type="text" value={localPart} onChange={(e) => setLocalPart(e.target.value)}
                        placeholder="support" required disabled={addStatus !== "idle" || domains.length === 0}
                        className="w-40 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors focus:border-sky-800 outline-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <AnimatedDropdown label="Domain" options={domains.map((d) => ({ value: d.id, label: d.domain }))}
                      value={selectedDomainId} onChange={setSelectedDomainId} placeholder="No domains available"
                      disabled={addStatus !== "idle" || domains.length === 0} width="w-48" />
                    <AnimatedDropdown label="Integration"
                      options={[{ value: "", label: "None" }, ...integrations.map((i) => ({ value: i.id, label: `${i.name} (${i.type})` }))]}
                      value={selectedIntegrationId} onChange={setSelectedIntegrationId} placeholder="Select integration"
                      disabled={addStatus !== "idle"} width="w-48" />
                    <AnimatedSubmitButton idleLabel="Add Alias" loadingLabel="Adding..." successLabel="Added!"
                      idleIcon={<IconPlus size={16} strokeWidth={2.5} />} state={addStatus}
                      idleWidth={110} loadingWidth={110} successWidth={90}
                      disabled={addStatus !== "idle" || domains.length === 0}
                      className="font-schibsted px-4 py-2 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 text-white border-0 focus:outline-none cursor-pointer flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed" />
                  </div>
                 
                </form>
              </motion.div>
            )}

            {/* ── Edit tab ── */}
            {activePageTab === "edit" && (
              <motion.div key="edit"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                {loading ? <AliasesPageSkeleton /> : aliases.length === 0 ? <EmptyState /> : (
                  <div className="hidden md:block">
                    <p className="text-xs font-schibsted text-neutral-400 mb-3">Click a row to edit its integration.</p>
                    <AliasesTable aliases={aliases} mode="edit" integrations={integrations}
                      cannedTriggerRefs={cannedTriggerRefs}
                      onCannedOpen={(id) => setCannedAliasId(id)}
                      onDelete={handleDelete} onUpdate={handleUpdate} />
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Delete tab ── */}
            {activePageTab === "delete" && (
              <motion.div key="delete"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                {loading ? <AliasesPageSkeleton /> : aliases.length === 0 ? <EmptyState /> : (
                  <div className="hidden md:block">
                    <p className="text-xs font-schibsted text-neutral-400 mb-3">Select an alias to delete it permanently.</p>
                    <AliasesTable aliases={aliases} mode="delete" integrations={integrations}
                      cannedTriggerRefs={cannedTriggerRefs}
                      onCannedOpen={(id) => setCannedAliasId(id)}
                      onDelete={handleDelete} onUpdate={handleUpdate} />
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
        
      </Card>

      

      {/* Canned responses modal */}
      <AnimatePresence>
        {cannedAliasId && (
          <CannedResponseModal
            aliasId={cannedAliasId}
            aliasEmail={aliases.find((a) => a.id === cannedAliasId)?.email ?? ""}
            onClose={() => setCannedAliasId(null)}
          />
        )}
      </AnimatePresence>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {mobileAlias && (
          <MobileBottomSheet
            alias={mobileAlias}
            onClose={() => setMobileAlias(null)}
            onDelete={handleDelete}
            onCannedOpen={(id) => setCannedAliasId(id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}