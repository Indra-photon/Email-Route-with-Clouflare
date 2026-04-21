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
  // ── Always look up the subscription directly by workspaceId ──────────────
  // We do NOT rely on workspace.planId being set — that field can be null if
  // the Workspace.findByIdAndUpdate call in the Dodo webhook silently failed.
  const sub = await Subscription.findOne({ workspaceId });

  // No subscription record at all → genuinely new user
  if (!sub) {
    return { isExpired: false, hasNoPlan: true, sub: null };
  }

  // ── Self-heal: if workspace.subscriptionId is null, fix it now ───────────
  // This handles the edge case where the Dodo webhook updated the Subscription
  // correctly but the Workspace.findByIdAndUpdate call failed silently.
  try {
    await Workspace.updateOne(
      { _id: workspaceId, $or: [{ subscriptionId: null }, { subscriptionId: { $exists: false } }, { planId: null }] },
      { $set: { subscriptionId: sub._id, planId: sub.planId } }
    );
  } catch {
    // Non-critical — don't block the request if self-heal fails
  }

  const now = new Date();
  const isExpired =
    sub.status === "cancelled" ||
    sub.status === "inactive" ||
    sub.status === "past_due" ||
    (sub.currentPeriodEnd !== null && now > sub.currentPeriodEnd);

  return { isExpired, hasNoPlan: false, sub };
}
