"use client";

// A thin client wrapper that fetches subscription state and renders
// the ExpiryWarningPopup inside the dashboard layout (which is a server component).

import { useSubscription } from "@/hooks/useSubscription";
import { ExpiryWarningPopup } from "@/components/billing/ExpiryWarningPopup";

export function DashboardSubscriptionGuard() {
  const { data, isLoading } = useSubscription();

  // No plan yet (new user) or still loading — nothing to warn about
  if (isLoading || !data || !data.planId) return null;

  const planName = data.planId.charAt(0).toUpperCase() + data.planId.slice(1);

  return (
    <ExpiryWarningPopup
      daysUntilExpiry={data.daysUntilExpiry}
      planName={planName}
      currentPlanId={data.planId}
      currentPeriodEnd={data.currentPeriodEnd}
    />
  );
}
