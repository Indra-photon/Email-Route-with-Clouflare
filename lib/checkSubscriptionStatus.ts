// lib/checkSubscriptionStatus.ts
// Used by all dashboard write-action routes and Slack event handlers.
// Returns whether the workspace's plan is currently expired/inactive.

import { Subscription, type ISubscription } from "@/app/api/models/SubscriptionModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import type { Types } from "mongoose";

export interface SubscriptionGuard {
  isExpired: boolean;
  hasNoPlan: boolean;   // true = new user who has never purchased
  sub: ISubscription | null;
}

export async function getSubscriptionGuard(
  workspaceId: Types.ObjectId | string
): Promise<SubscriptionGuard> {
  const [sub, workspace] = await Promise.all([
    Subscription.findOne({ workspaceId }),
    Workspace.findById(workspaceId).lean(),
  ]);

  // No plan purchased yet — block all write actions
  if (!workspace?.planId) {
    return { isExpired: false, hasNoPlan: true, sub: null };
  }

  if (!sub) {
    // Has a planId in workspace but no subscription record (edge case after manual DB edits)
    return { isExpired: false, hasNoPlan: false, sub: null };
  }

  const now = new Date();
  const isExpired =
    sub.status === "cancelled" ||
    sub.status === "inactive" ||
    (sub.currentPeriodEnd !== null && now > sub.currentPeriodEnd);

  return { isExpired, hasNoPlan: false, sub };
}
