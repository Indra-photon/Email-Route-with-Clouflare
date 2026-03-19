// lib/checkPlanLimits.ts
// Central helpers called by API routes before creating domains, aliases, widgets, or tickets.
// Returns null if OK, or an error string with upgradeRequired hint if limit is hit.

import { Subscription } from "@/app/api/models/SubscriptionModel";
import { PricingPlan } from "@/app/api/models/PricingPlanModel";
import { Domain } from "@/app/api/models/DomainModel";
import { Alias } from "@/app/api/models/AliasModel";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import type { Types } from "mongoose";

// ─── Resolve live plan limits from DB ─────────────────────────────────────────

async function getLivePlan(planId: string) {
  return PricingPlan.findOne({ id: planId }).lean();
}

// ─── Ticket (inbound EmailThread) limit ───────────────────────────────────────

export async function checkTicketLimit(
  workspaceId: Types.ObjectId | string
): Promise<string | null> {
  const sub = await Subscription.findOne({ workspaceId }).lean();
  const planId = sub?.planId ?? "starter";
  const plan = await getLivePlan(planId);
  if (!plan) return null;

  const limit = plan.limits.ticketsPerMonth;
  if (limit === -1) return null; // unlimited

  // Count inbound tickets since the current usage period started
  const periodStart = sub?.usagePeriodStart ?? new Date(0);
  const count = await EmailThread.countDocuments({
    workspaceId,
    direction: "inbound",
    receivedAt: { $gte: periodStart },
  });

  if (count >= limit) {
    return `Ticket limit reached (${limit}/month on ${plan.name} plan)`;
  }
  return null;
}

// ─── Domain limit ─────────────────────────────────────────────────────────────

export async function checkDomainLimit(
  workspaceId: Types.ObjectId | string
): Promise<string | null> {
  const sub = await Subscription.findOne({ workspaceId }).lean();
  const planId = sub?.planId ?? "starter";
  const plan = await getLivePlan(planId);
  if (!plan) return null;

  const limit = plan.limits.domains;
  if (limit === -1) return null;

  const count = await Domain.countDocuments({ workspaceId });
  if (count >= limit) {
    return `Domain limit reached (${limit} on ${plan.name} plan)`;
  }
  return null;
}

// ─── Alias limit ──────────────────────────────────────────────────────────────

export async function checkAliasLimit(
  workspaceId: Types.ObjectId | string,
  domainId: Types.ObjectId | string
): Promise<string | null> {
  const sub = await Subscription.findOne({ workspaceId }).lean();
  const planId = sub?.planId ?? "starter";
  const plan = await getLivePlan(planId);
  if (!plan) return null;

  const limit = plan.limits.aliasesPerDomain;
  if (limit === -1) return null;

  const count = await Alias.countDocuments({ workspaceId, domainId });
  if (count >= limit) {
    return `Alias limit reached (${limit} per domain on ${plan.name} plan)`;
  }
  return null;
}

// ─── Chat widget limit ────────────────────────────────────────────────────────

export async function checkWidgetLimit(
  workspaceId: Types.ObjectId | string
): Promise<string | null> {
  const sub = await Subscription.findOne({ workspaceId }).lean();
  const planId = sub?.planId ?? "starter";
  const plan = await getLivePlan(planId);
  if (!plan) return null;

  const limit = plan.limits.chatWidgets;
  if (limit === -1) return null;

  // Dynamically import to avoid circular deps
  const { ChatWidget } = await import("@/app/api/models/ChatWidgetModel");
  const count = await ChatWidget.countDocuments({ workspaceId });
  if (count >= limit) {
    return `Chat widget limit reached (${limit} on ${plan.name} plan)`;
  }
  return null;
}
