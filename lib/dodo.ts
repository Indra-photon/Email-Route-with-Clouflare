// lib/dodo.ts
// Thin typed wrapper around Dodo Payments REST API.
// Docs: https://docs.dodopayments.com

const DODO_BASE_URL = "https://api.dodopayments.com";

type DodoHttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export class DodoError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "DodoError";
    this.status = status;
  }
}

async function dodoRequest<T = unknown>(
  method: DodoHttpMethod,
  path: string,
  body?: Record<string, unknown>
): Promise<T> {
  const apiKey = process.env.DODO_API_KEY;
  if (!apiKey) throw new Error("DODO_API_KEY environment variable is not set");

  const res = await fetch(`${DODO_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    let message = `Dodo API error ${res.status}`;
    try {
      const err = await res.json();
      message = err.message || err.error || message;
    } catch {}
    throw new DodoError(message, res.status);
  }

  // 204 No Content responses
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ─── Checkout Sessions ────────────────────────────────────────────────────────

export interface DodoCheckoutSession {
  id: string;
  url: string;
}

export interface CreateCheckoutParams {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
  customerId?: string;
}

export async function createCheckoutSession(
  params: CreateCheckoutParams
): Promise<DodoCheckoutSession> {
  return dodoRequest<DodoCheckoutSession>("POST", "/checkout/sessions", {
    price_id: params.priceId,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata ?? {},
    ...(params.customerId ? { customer_id: params.customerId } : {}),
  });
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
  return dodoRequest<DodoSubscription>("GET", `/subscriptions/${subscriptionId}`);
}

export async function cancelSubscriptionAtPeriodEnd(
  subscriptionId: string
): Promise<DodoSubscription> {
  return dodoRequest<DodoSubscription>("PATCH", `/subscriptions/${subscriptionId}`, {
    cancel_at_period_end: true,
  });
}

export async function resumeSubscription(
  subscriptionId: string
): Promise<DodoSubscription> {
  return dodoRequest<DodoSubscription>("PATCH", `/subscriptions/${subscriptionId}`, {
    cancel_at_period_end: false,
  });
}

export async function cancelSubscriptionImmediately(
  subscriptionId: string
): Promise<void> {
  return dodoRequest<void>("DELETE", `/subscriptions/${subscriptionId}`);
}

// ─── Customer Portal ──────────────────────────────────────────────────────────

export interface DodoPortalSession {
  url: string;
}

export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<DodoPortalSession> {
  return dodoRequest<DodoPortalSession>("POST", "/portal/sessions", {
    customer_id: customerId,
    return_url: returnUrl,
  });
}

// ─── Webhook Signature Verification ──────────────────────────────────────────

import crypto from "crypto";

export function verifyDodoSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader) return false;
  // Dodo uses HMAC-SHA256: signature = hmac(secret, rawBody)
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
