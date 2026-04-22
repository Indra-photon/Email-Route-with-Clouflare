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

// ─── Domain parser / validator ────────────────────────────────────────────────
function parseDomain(input: string): { clean: string } | { error: string } {
  let s = input.trim().toLowerCase();
  // Strip protocol
  s = s.replace(/^https?:\/\//, "");
  // Strip www.
  s = s.replace(/^www\./, "");
  // Strip trailing slashes and paths
  s = s.split("/")[0];
  // Strip port
  s = s.split(":")[0];

  const valid =
    /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(s);
  if (!valid || !s) {
    return {
      error:
        'Use plain domain format, e.g. "example.com" or "mail.example.co.uk"',
    };
  }
  return { clean: s };
}

export default function DomainAddForm({
  onDomainAdded,
  onSuccess,
}: {
  onDomainAdded: (domain: DomainRow) => void;
  onSuccess?: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [value, setValue] = useState("");
  const [domainError, setDomainError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;

    const parsed = parseDomain(value);
    if ("error" in parsed) {
      setDomainError(parsed.error);
      toast.error("Invalid domain format — please check the field below.");
      return;
    }

    setDomainError(null);
    const domain = parsed.clean;

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
            onClick: () => (window.location.href = "/pricing"),
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
        toast.success(
          "Domain added — expand the card below to see your DNS records.",
        );
        setValue("");
        onDomainAdded({ ...newDomain, prefetchedDetail });
        onSuccess?.();
        setTimeout(() => setStatus("idle"), 2500); // ← holds success for 2.5s
      }, 1000); // ← holds loading for 1s after API resolves
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
      <form onSubmit={handleSubmit} className="flex gap-2 items-start">
        <div className="flex flex-col gap-1">
          <input
            type="text"
            name="domain"
            placeholder="example.com"
            disabled={isBusy}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setDomainError(null);
            }}
            className={`w-64 flex-1 text-sm tracking-tighter font-schibsted text-neutral-800 placeholder-neutral-500 bg-transparent outline-none rounded-lg border dark:bg-neutral-800 px-3 py-2 dark:text-neutral-100 transition-colors duration-100 focus:outline-none [box-shadow:none] focus:[box-shadow:none] disabled:opacity-50 disabled:cursor-not-allowed ${
              domainError
                ? "border-red-400 focus:border-red-500"
                : "border-neutral-300 dark:border-neutral-600 focus:border-sky-800 dark:focus:border-neutral-400"
            }`}
          />
          <AnimatePresence>
            {domainError && (
              <motion.p
                key="domain-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: outCubic }}
                className="text-xs text-red-500 leading-tight max-w-sm"
              >
                {domainError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

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
          className="font-schibsted w-32 px-4 py-2 rounded-md bg-gradient-to-b from-sky-900 to-cyan-700 text-white border-0 shadow-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 cursor-pointer flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed self-start"
        />

        {/* <div className="flex items-start pt-2">
          <CustomLink
            href="/docs/domains"
            className="text-sm text-sky-700 hover:text-sky-900 transition-colors underline"
          >
            Read our docs
          </CustomLink>
        </div> */}
      </form>
    </>
  );
}
