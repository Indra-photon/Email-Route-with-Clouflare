// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "motion/react";
// import { Button } from "@/components/ui/button";
// import { IconCheck, IconPlus } from "@tabler/icons-react";
// import { toast } from "sonner";
// import { set } from "mongoose";
// import { CustomLink } from "../CustomLink";


// type Status = "idle" | "loading" | "success";

// const outCubic = [0.215, 0.61, 0.355, 1] as const;
// const outQuint = [0.23, 1, 0.32, 1] as const;

// const loaderStyle = `
//   .domain-loader {
//     width: 18px;
//     height: 18px;
//     --b: 3px;
//     aspect-ratio: 1;
//     border-radius: 50%;
//     padding: 1px;
//     background: conic-gradient(#0000 10%, #ffffff) content-box;
//     -webkit-mask:
//       repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
//       radial-gradient(farthest-side, #0000 calc(100% - var(--b) - 1px), #000 calc(100% - var(--b)));
//     -webkit-mask-composite: destination-in;
//     mask-composite: intersect;
//     animation: domain-spin 1s infinite steps(10);
//     flex-shrink: 0;
//   }
//   @keyframes domain-spin {
//     to { transform: rotate(1turn); }
//   }
// `;

// export default function DomainAddForm() {
//   const router = useRouter();
//   const [status, setStatus] = useState<Status>("idle");
//   const [value, setValue] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const domain = value.trim().toLowerCase();
//     if (!domain || status !== "idle") return;

//     // Stage 1: Start loading
//     setStatus("loading");

//     try {
//       const res = await fetch("/api/domains", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ domain }),
//       });

//       const body = await res.json().catch(() => ({}));

//       if (!res.ok && res.status !== 409) {
//         throw new Error(body.error || "Failed to add domain");
//       }

//       const domainId = body.id;

//       // Fire-and-forget: add to Resend
//       fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/domains/add-to-resend`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ domainId }),
//       }).catch(() => {});

//       // Stage 2: Show loading state for 1500ms
//       setTimeout(() => {
//         // Stage 3: Show success state
//         setStatus("success");
//         toast.success("Domain added successfully! Please verify your domain to start using it.");
//         setValue("");

//         // Stage 4: After another 1500ms, redirect
//         setTimeout(() => {
//           router.push(`/dashboard/domains/${domainId}/verify`);
//         }, 1500);
//       }, 1500);

//     } catch (err) {
//       setStatus("idle");
//       toast.error("Failed to add domain");
//     }
//   };


// // const handleSubmit = async (e: React.FormEvent) => {
// //   e.preventDefault();
// //   const domain = value.trim().toLowerCase();
// //   if (!domain || status !== "idle") return;

// //   setStatus("loading");

// //   await new Promise((resolve) => setTimeout(resolve, 2000));

// //   setStatus("success");
// //   setValue("");
// // };

//   const isLoading = status === "loading";
//   const isSuccess = status === "success";
//   const isBusy = isLoading || isSuccess;

//   return (
//     <>
//       <style>{loaderStyle}</style>
//       <form onSubmit={handleSubmit} className="flex gap-2">
//         <input
//           type="text"
//           name="domain"
//           placeholder="example.com"
//           required
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//           className="w-64 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors duration-100 focus:border-sky-800 dark:focus:border-neutral-400 outline-none focus:outline-none [box-shadow:none] focus:[box-shadow:none] disabled:opacity-50 disabled:cursor-not-allowed"
//         />
//           <motion.button
//             type="submit"
//             className="shrink-0  font-schibsted px-4 py-2 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 text-white border-0 shadow-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 cursor-pointer flex items-center justify-center gap-2 overflow-hidden"
//             animate={{ width: isLoading ? 140 : isSuccess ? 230 : 180 }}
//             transition={{ type: "spring", stiffness: 300, damping: 25 }}
//         >
//             <AnimatePresence mode="wait" initial={false}>
//               {isLoading && (
//                 <motion.span
//                   key="loader"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   transition={{ duration: 0.15, ease: outCubic }}
//                   className="flex items-center justify-center gap-2"
//                 >
//                   <span className="domain-loader" />
//                   <span className="">Adding...</span>
//                 </motion.span>
//               )}

//               {isSuccess && (
//                 <motion.span
//                   key="check"
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 10 }}
//                   transition={{ duration: 0.2, ease: outQuint }}
//                   className="flex items-center justify-center"
//                 >
//                   <IconCheck size={16} strokeWidth={2.5} />
//                   <span className="">Added Successfully</span>
//                 </motion.span>
//               )}

//               {!isBusy && (
//                 <motion.span
//                   key="label"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 10 }}
//                   transition={{ duration: 0.1, ease: outCubic }}
//                     className="flex items-center justify-center gap-2"
//                 >
//                   <IconPlus size={16} strokeWidth={2.5} />
//                   Add Domain
//                 </motion.span>
//               )}
//             </AnimatePresence>
//           </motion.button>

//           <div className="flex items-center">
//             <CustomLink href="/docs/domains" className="text-sm text-sky-700 hover:text-sky-900 transition-colors underline">
//               Read our docs
//             </CustomLink>
//           </div>
//       </form>
//     </>
//   );
// }



// ─── DomainAddForm.tsx ────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { motion, AnimatePresence, easeOut } from "motion/react";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import { CustomLink } from "../CustomLink";
import { AnimatedSubmitButton } from "@/components/ui/AnimatedSubmitButton";

type Status = "idle" | "loading" | "success";

interface DomainRow {
  id: string;
  domain: string;
  status: string;
  verifiedForSending?: boolean;
  receivingEnabled?: boolean;
  createdAt: string;
  // Pre-loaded detail so ExpandedPanel shows instantly with no extra fetch
  prefetchedDetail?: {
    resendDomainId?: string | null;
    dnsRecords?: any[];
    receivingEnabled?: boolean;
    receivingMxRecords?: any[];
    lastCheckedAt?: string | null;
  };
}

const outCubic = [0.215, 0.61, 0.355, 1] as const;
const outQuint = [0.23, 1, 0.32, 1] as const;


export default function DomainAddForm({
  onDomainAdded,
}: {
  onDomainAdded: (domain: DomainRow) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [value, setValue] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const domain = value.trim().toLowerCase();
  if (!domain || status !== "idle") return;

  setStatus("loading");

  try {
    const res = await fetch("/api/domains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
    });

      const body = await res.json().catch(() => ({}));

      // ── Plan / limit guard ────────────────────────────────────────────────
      if (res.status === 403 && body.upgradeRequired) {
        setStatus("idle");
        toast.error(body.error || "Plan required", {
          action: {
            label: "View Plans →",
            onClick: () => window.location.href = "/pricing",
          },
          duration: 6000,
        });
        return;
      }

    if (!res.ok && res.status !== 409) {
      throw new Error(body.error || "Failed to add domain");
    }

    const newDomain: DomainRow = body;

    let prefetchedDetail: DomainRow["prefetchedDetail"] = undefined;
    try {
      const resendRes = await fetch("/api/domains/add-to-resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId: newDomain.id }),
      });
      if (resendRes.ok) {
        const resendBody = await resendRes.json();
        if (resendBody.domain) {
          prefetchedDetail = {
            resendDomainId: resendBody.domain.resendDomainId,
            dnsRecords: resendBody.domain.dnsRecords || [],
            receivingEnabled: resendBody.domain.receivingEnabled || false,
            receivingMxRecords: resendBody.domain.receivingMxRecords || [],
            lastCheckedAt: null,
          };
        }
      }
    } catch {
      // Non-fatal
    }

    // ← same pattern as integration
    setTimeout(() => {
      setStatus("success");
      toast.success("Domain added — expand the card below to see your DNS records.");
      setValue("");
      onDomainAdded({ ...newDomain, prefetchedDetail });
      setTimeout(() => setStatus("idle"), 2500);  // ← holds success for 2.5s
    }, 1000);  // ← holds loading for 1s after API resolves

  } catch (err) {
    setStatus("idle");
    toast.error(err instanceof Error ? err.message : "Failed to add domain");
  }
};

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isBusy = isLoading || isSuccess;

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          name="domain"
          placeholder="example.com"
          required
          disabled={isBusy}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-64 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors duration-100 focus:border-sky-800 dark:focus:border-neutral-400 outline-none focus:outline-none [box-shadow:none] focus:[box-shadow:none] disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <AnimatedSubmitButton
            idleLabel="Add"
            loadingLabel="Adding..."
            successLabel="Added"
            idleIcon={<IconPlus size={16} strokeWidth={2.5} />}
            state={status}
            idleWidth={180}
            loadingWidth={140}
            successWidth={210}
            disabled={isBusy}
            className="font-schibsted w-32 px-4 py-2 rounded-md bg-gradient-to-t from-sky-900 to-cyan-600 text-white border-0 shadow-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 cursor-pointer flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
        />

        <div className="flex items-center">
          <CustomLink
            href="/docs/domains"
            className="text-sm text-sky-700 hover:text-sky-900 transition-colors underline"
          >
            Read our docs
          </CustomLink>
        </div>
      </form>
    </>
  );
}