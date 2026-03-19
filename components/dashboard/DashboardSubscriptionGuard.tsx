"use client";

// A thin client wrapper that fetches subscription state and renders
// the ExpiryWarningPopup inside the dashboard layout (which is a server component).

import { useSubscription } from "@/hooks/useSubscription";
import { ExpiryWarningPopup } from "@/components/billing/ExpiryWarningPopup";

export function DashboardSubscriptionGuard() {
  const { data, isLoading } = useSubscription();

  if (isLoading || !data) return null;

  return (
    <ExpiryWarningPopup
      daysUntilExpiry={data.daysUntilExpiry}
      planName={data.planId.charAt(0).toUpperCase() + data.planId.slice(1)}
      currentPlanId={data.planId}
      currentPeriodEnd={data.currentPeriodEnd}
    />
  );
}
