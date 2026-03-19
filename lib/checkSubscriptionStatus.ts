// lib/checkSubscriptionStatus.ts
// Used by all dashboard write-action routes and Slack event handlers.
// Returns whether the workspace's plan is currently expired/inactive.

import { Subscription, type ISubscription } from "@/app/api/models/SubscriptionModel";
import type { Types } from "mongoose";

export interface SubscriptionGuard {
  isExpired: boolean;
  sub: ISubscription | null;
}

export async function getSubscriptionGuard(
  workspaceId: Types.ObjectId | string
): Promise<SubscriptionGuard> {
  const sub = await Subscription.findOne({ workspaceId });

  if (!sub) {
    // No subscription record at all — treat as inactive (free trial / default starter)
    return { isExpired: false, sub: null };
  }

  const now = new Date();
  const isExpired =
    sub.status === "cancelled" ||
    sub.status === "inactive" ||
    (sub.currentPeriodEnd !== null && now > sub.currentPeriodEnd);

  return { isExpired, sub };
}
