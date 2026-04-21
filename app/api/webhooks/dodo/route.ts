import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { Subscription } from "@/app/api/models/SubscriptionModel";
import { Alias } from "@/app/api/models/AliasModel";
import { verifyDodoSignature } from "@/lib/dodo";
import { getPostHogClient } from "@/lib/posthog-server";
import mongoose from "mongoose";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("dodo-signature");
  const webhookSecret = process.env.DODO_WEBHOOK_SECRET;

  // ── Verify signature ───────────────────────────────────────────────────────
  if (!webhookSecret || !verifyDodoSignature(rawBody, signatureHeader, webhookSecret)) {
    console.error("❌ Dodo webhook: invalid signature");
    return new Response("Invalid signature", { status: 400 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const type = event.type as string;
  const data = (event.data ?? {}) as Record<string, unknown>;
  const metadata = (event.metadata ?? data.metadata ?? {}) as Record<string, string>;

  // ── Log the raw metadata so we can debug Dodo payload structure issues ─────
  console.log(`📦 Dodo webhook [${type}] — raw metadata:`, JSON.stringify(metadata));
  console.log(`📦 Dodo webhook [${type}] — event keys:`, Object.keys(event));
  console.log(`📦 Dodo webhook [${type}] — data keys:`, Object.keys(data));

  await dbConnect();

  const workspaceIdRaw = metadata.workspaceId;
  // Explicitly cast to ObjectId so Mongoose never does a silent string-comparison fail
  const workspaceId = workspaceIdRaw && mongoose.Types.ObjectId.isValid(workspaceIdRaw)
    ? new mongoose.Types.ObjectId(workspaceIdRaw)
    : null;

  try {
    switch (type) {
      // ── Subscription activated (new purchase OR upgrade OR trial converted) ──
      // Dodo may send either "subscription.active" or "subscription.activated"
      case "subscription.active":
      case "subscription.activated": {
        if (!workspaceId) {
          console.error(`❌ Dodo webhook [${type}]: workspaceId missing from metadata — cannot link subscription! Raw metadata:`, JSON.stringify(metadata));
          break;
        }

        const planId = (metadata.planId ?? "starter") as "starter" | "growth" | "scale";
        const periodStart = data.current_period_start
          ? new Date(data.current_period_start as string)
          : new Date();
        const periodEnd = data.current_period_end
          ? new Date(data.current_period_end as string)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        const sub = await Subscription.findOneAndUpdate(
          { workspaceId },
          {
            planId,
            status: "active",
            dodoCustomerId: data.customer_id as string,
            dodoSubscriptionId: data.id as string,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: false,
            pendingPlanId: null,
            ticketCountInbound: 0,
            ticketCountOutbound: 0,
            usagePeriodStart: new Date(),
          },
          { upsert: true, new: true }
        );

        // ── Update workspace — verify it was actually found ─────────────────
        const workspaceResult = await Workspace.findByIdAndUpdate(
          workspaceId,
          { planId, subscriptionId: sub._id },
          { new: true }
        );
        if (!workspaceResult) {
          // This is the root cause of the historical null subscriptionId bug:
          // The subscription was created but the workspace was never linked.
          console.error(
            `❌ CRITICAL: Workspace not found for workspaceId=${workspaceId.toString()} during ${type} webhook.`,
            `Subscription ${sub._id} created/updated but workspace.subscriptionId NOT set.`,
            `Manual fix required.`
          );
        } else {
          console.log(`✅ Workspace ${workspaceId} updated: planId=${planId}, subscriptionId=${sub._id}`);
        }

        // Re-activate all aliases that were paused due to limit
        await Alias.updateMany(
          { workspaceId },
          { $set: { status: "active" } }
        );

        const userId = metadata.userId;
        if (userId) {
          const posthog = getPostHogClient();
          posthog.capture({
            distinctId: userId,
            event: "subscription_activated",
            properties: {
              plan_id: planId,
              workspace_id: workspaceId,
              webhook_type: type,
            },
          });
        }

        console.log(`✅ Webhook: ${type} — workspace ${workspaceId} → ${planId}`);
        break;
      }

      // ── Subscription cancelled ─────────────────────────────────────────────
      case "subscription.cancelled": {
        const subId = data.id as string;
        const sub = await Subscription.findOne({ dodoSubscriptionId: subId });
        if (!sub) break;

        // If a downgrade was pending → auto-activate the new plan checkout
        // (In practice, you'd redirect user to the new plan checkout via email,
        //  or handle via a scheduled job. For now, reset to starter.)
        const newPlanId = sub.pendingPlanId ?? "starter";

        sub.status = "cancelled";
        sub.planId = newPlanId;
        sub.cancelAtPeriodEnd = false;
        sub.pendingPlanId = null;
        await sub.save();

        await Workspace.findByIdAndUpdate(sub.workspaceId, { planId: newPlanId });

        console.log(`✅ Webhook: subscription cancelled → reset to ${newPlanId}`);
        break;
      }

      // ── Subscription past due ─────────────────────────────────────────────
      case "subscription.past_due":
      // ── Subscription on_hold (payment failed after trial, or billing issue) ─
      case "subscription.on_hold": {
        const subId = data.id as string;
        await Subscription.findOneAndUpdate(
          { dodoSubscriptionId: subId },
          { status: "past_due" }
        );
        console.log(`⚠️ Webhook: ${type} → past_due for sub ${subId}`);
        break;
      }

      // ── Payment succeeded (monthly renewal) ───────────────────────────────
      case "payment.succeeded": {
        const subId = (data.subscription_id ?? data.id) as string | undefined;
        if (!subId) break;

        const periodStart = data.current_period_start
          ? new Date(data.current_period_start as string)
          : new Date();
        const periodEnd = data.current_period_end
          ? new Date(data.current_period_end as string)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        const updatedSub = await Subscription.findOneAndUpdate(
          { dodoSubscriptionId: subId },
          {
            status: "active",
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            ticketCountInbound: 0,
            ticketCountOutbound: 0,
            usagePeriodStart: new Date(),
          },
          { new: true }
        );

        // Re-activate all aliases that were paused due to limit
        if (updatedSub?.workspaceId) {
          await Alias.updateMany(
            { workspaceId: updatedSub.workspaceId },
            { $set: { status: "active" } }
          );
        }

        if (updatedSub?.workspaceId) {
          const posthog = getPostHogClient();
          posthog.capture({
            distinctId: updatedSub.workspaceId.toString(),
            event: "payment_succeeded",
            properties: {
              plan_id: updatedSub.planId,
              workspace_id: updatedSub.workspaceId.toString(),
              subscription_id: subId,
            },
          });
        }

        console.log(`✅ Webhook: payment.succeeded — counters reset for sub ${subId}`);
        break;
      }

      // ── Payment failed ─────────────────────────────────────────────────────
      case "payment.failed": {
        const subId = (data.subscription_id ?? data.id) as string | undefined;
        if (!subId) break;

        const failedSub = await Subscription.findOneAndUpdate(
          { dodoSubscriptionId: subId },
          { status: "past_due" },
          { new: true }
        );

        if (failedSub?.workspaceId) {
          const posthog = getPostHogClient();
          posthog.capture({
            distinctId: failedSub.workspaceId.toString(),
            event: "payment_failed",
            properties: {
              plan_id: failedSub.planId,
              workspace_id: failedSub.workspaceId.toString(),
              subscription_id: subId,
            },
          });
        }

        console.log(`❌ Webhook: payment.failed → past_due for sub ${subId}`);
        break;
      }

      default:
        console.log(`ℹ️ Dodo webhook: unhandled event type "${type}"`);
    }
  } catch (err) {
    console.error("❌ Dodo webhook handler error:", err);
    // Still return 200 to Dodo — don't trigger retries for handler errors
  }

  // Always return 200 to acknowledge receipt
  return new Response("ok", { status: 200 });
}
