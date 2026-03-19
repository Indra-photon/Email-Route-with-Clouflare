"use client";

/**
 * PlanGuardProvider
 *
 * Wraps the dashboard. Any code anywhere in the app can fire:
 *   window.dispatchEvent(new CustomEvent("upgrade-required", { detail: { errorMessage: "..." } }))
 *
 * The provider listens for that event and displays the ExpiredPlanModal.
 *
 * The useSafeFetch hook (exported below) automatically does this when any
 * fetch returns { upgradeRequired: true } at status 403.
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { ExpiredPlanModal } from "@/components/billing/ExpiredPlanModal";

// ─── Context ──────────────────────────────────────────────────────────────────

interface PlanGuardContextValue {
  triggerUpgradeRequired: (message?: string) => void;
}

const PlanGuardContext = createContext<PlanGuardContextValue>({
  triggerUpgradeRequired: () => {},
});

export function usePlanGuard() {
  return useContext(PlanGuardContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function PlanGuardProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const triggerUpgradeRequired = useCallback((msg?: string) => {
    setMessage(msg);
    setOpen(true);
  }, []);

  // Also listen to a DOM event so non-React code (plain fetch wrappers, etc.) can trigger this
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ errorMessage?: string }>).detail;
      triggerUpgradeRequired(detail?.errorMessage);
    };
    window.addEventListener("upgrade-required", handler);
    return () => window.removeEventListener("upgrade-required", handler);
  }, [triggerUpgradeRequired]);

  return (
    <PlanGuardContext.Provider value={{ triggerUpgradeRequired }}>
      {children}
      <ExpiredPlanModal
        isOpen={open}
        onClose={() => setOpen(false)}
        message={message}
      />
    </PlanGuardContext.Provider>
  );
}

// ─── useSafeFetch drop-in ─────────────────────────────────────────────────────

/**
 * A thin wrapper around fetch that intercepts 403 + upgradeRequired responses
 * and shows the ExpiredPlanModal automatically.
 *
 * Usage (inside any dashboard component):
 *   const safeFetch = useSafeFetch();
 *   const res = await safeFetch("/api/domains", { method: "POST", body: ... });
 */
export function useSafeFetch() {
  const { triggerUpgradeRequired } = usePlanGuard();

  return useCallback(
    async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const res = await fetch(input, init);

      if (res.status === 403) {
        // Clone so callers can still read the body
        const cloned = res.clone();
        try {
          const data = await cloned.json();
          if (data.upgradeRequired) {
            triggerUpgradeRequired(data.error);
          }
        } catch {
          // not JSON — ignore
        }
      }

      return res;
    },
    [triggerUpgradeRequired]
  );
}
