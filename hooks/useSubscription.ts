"use client";

// hooks/useSubscription.ts
// Fetches /api/billing/subscription once and provides subscription state across the dashboard.

import { useEffect, useState, useCallback } from "react";

export interface SubscriptionLimits {
  domains: number;
  aliasesPerDomain: number;
  chatWidgets: number;
  ticketsPerMonth: number;
  dataRetentionDays: number;
}

export interface SubscriptionUsage {
  ticketCountInbound: number;
  ticketCountOutbound: number;
  ticketLimit: number;
  percentUsed: number;
}

export interface SubscriptionData {
  planId: "starter" | "growth" | "scale";
  status: "active" | "trialing" | "past_due" | "cancelled" | "inactive";
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  pendingPlanId: string | null;
  daysUntilExpiry: number | null;
  isExpiringSoon: boolean;
  isExpired: boolean;
  usage: SubscriptionUsage;
  limits: SubscriptionLimits;
}

interface UseSubscriptionReturn {
  data: SubscriptionData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useSubscription(): UseSubscriptionReturn {
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/subscription", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch subscription");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refresh: fetchData };
}
