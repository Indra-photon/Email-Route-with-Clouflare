// lib/dodo.ts
// Wrapper around the official Dodo Payments TypeScript SDK.
// Docs: https://docs.dodopayments.com

import DodoPayments from "dodopayments";

function getDodoClient() {
  const apiKey = process.env.DODO_API_KEY;
  if (!apiKey) throw new Error("DODO_API_KEY environment variable is not set");

  const environment =
    process.env.DODO_ENV === "live" ? "live_mode" : "test_mode";

  console.log(`🔍 Dodo SDK: environment=${environment}, key prefix=${apiKey.slice(0, 12)}...`);

  return new DodoPayments({
    bearerToken: apiKey,
    environment,
  });
}

// ─── Custom error class (kept for backward compatibility) ─────────────────────

export class DodoError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "DodoError";
    this.status = status;
  }
}

function wrapDodoError(err: unknown): never {
  if (err instanceof Error) {
    // SDK wraps API errors — extract status if available
    const anyErr = err as any;
    const status = anyErr.status ?? anyErr.statusCode ?? 500;
    throw new DodoError(err.message, status);
  }
  throw new DodoError("Unknown Dodo error", 500);
}

// ─── Checkout Sessions ────────────────────────────────────────────────────────

export interface DodoCheckoutSession {
  id: string;
  url: string;
}

export interface CreateCheckoutParams {
  priceId: string;          // This is the Dodo product ID (stored as dodoPriceId in DB)
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
  customerId?: string;
}

export async function createCheckoutSession(
  params: CreateCheckoutParams
): Promise<DodoCheckoutSession> {
  const client = getDodoClient();
  try {
    const session = await client.checkoutSessions.create({
      product_cart: [{ product_id: params.priceId, quantity: 1 }],
      return_url: params.successUrl,
      metadata: params.metadata ?? {},
      ...(params.customerId ? { customer: { customer_id: params.customerId } } : {}),
    });
    console.log(`✅ Checkout session created: id=${session.session_id}, url=${session.checkout_url}`);
    return { id: session.session_id, url: session.checkout_url ?? "" };
  } catch (err) {
    wrapDodoError(err);
  }
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export interface DodoSubscription {
  id: string;
  customer_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  metadata: Record<string, string>;
}

export async function getSubscription(subscriptionId: string): Promise<DodoSubscription> {
  const client = getDodoClient();
  try {
    const sub = await client.subscriptions.retrieve(subscriptionId);
    return sub as unknown as DodoSubscription;
  } catch (err) {
    wrapDodoError(err);
  }
}

export async function cancelSubscriptionAtPeriodEnd(
  subscriptionId: string
): Promise<DodoSubscription> {
  const client = getDodoClient();
  try {
    const sub = await client.subscriptions.update(subscriptionId, {
      cancel_at_next_billing_date: true,
    });
    return sub as unknown as DodoSubscription;
  } catch (err) {
    wrapDodoError(err);
  }
}

export async function resumeSubscription(
  subscriptionId: string
): Promise<DodoSubscription> {
  const client = getDodoClient();
  try {
    const sub = await client.subscriptions.update(subscriptionId, {
      cancel_at_next_billing_date: false,
    });
    return sub as unknown as DodoSubscription;
  } catch (err) {
    wrapDodoError(err);
  }
}

export async function cancelSubscriptionImmediately(
  subscriptionId: string
): Promise<void> {
  const client = getDodoClient();
  try {
    await client.subscriptions.update(subscriptionId, {
      cancel_at_next_billing_date: true,
    });
  } catch (err) {
    wrapDodoError(err);
  }
}

// ─── Customer Portal ──────────────────────────────────────────────────────────

export interface DodoPortalSession {
  url: string;
}

export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<DodoPortalSession> {
  const client = getDodoClient();
  try {
    const portal = await client.customers.customerPortal.create(customerId);
    return { url: (portal as any).link ?? "" };
  } catch (err) {
    wrapDodoError(err);
  }
}

// ─── Webhook Signature Verification ──────────────────────────────────────────

import crypto from "crypto";

export function verifyDodoSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(signatureHeader.replace(/^sha256=/, ""), "hex")
    );
  } catch {
    return false;
  }
}
