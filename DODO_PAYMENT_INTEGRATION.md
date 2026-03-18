# Dodo Payment Integration Plan

> **Codebase:** Next.js 14 App Router · MongoDB (Mongoose) · Clerk Auth · Framer Motion
> **Payment Provider:** Dodo Payments
> **Date drafted:** 2026-03-17

---

## Table of Contents

1. [Current Pricing Plans](#1-current-pricing-plans)
2. [What Counts as a Ticket](#2-what-counts-as-a-ticket)
3. [Phase 1 — Database Layer](#3-phase-1--database-layer)
4. [Phase 2 — Backend API Routes](#4-phase-2--backend-api-routes)
5. [Phase 3 — Plan Limit Enforcement](#5-phase-3--plan-limit-enforcement)
6. [Phase 4 — Frontend Components](#6-phase-4--frontend-components)
7. [Phase 5 — Environment Variables](#7-phase-5--environment-variables)
8. [Complete Flow Diagrams](#8-complete-flow-diagrams)
9. [Files to Create / Modify](#9-files-to-create--modify)

---

## 1. Current Pricing Plans

Defined in `constants/pricing.ts`. These are the three plans users can subscribe to.

| Plan | Price | Tickets/mo | Domains | Aliases/domain | Chat Widgets | Data Retention |
|------|-------|-----------|---------|----------------|--------------|----------------|
| **Starter** | $19/mo | 200 | 1 | 3 | 1 | 15 days | 
| **Growth** | $59/mo | 600 | 3 | 5 | 3 | 90 days |
| **Scale** | $159/mo | 2,000 | ∞ | ∞ | ∞ | Forever |

**Note:** Scale plan uses a "Book a demo" CTA (`/contact`) — no automated Dodo checkout needed.

### What each CTA does today

```
Starter card → ctaLabel: "Start free trial"  →  ctaHref: "/sign-up"
Growth card  → ctaLabel: "Start free trial"  →  ctaHref: "/sign-up"
Scale card   → ctaLabel: "Book a demo"        →  ctaHref: "/contact"
```

After integration, Starter and Growth CTAs will behave differently based on authentication state (see [Phase 4](#6-phase-4--frontend-components)).

---

## 2. What Counts as a Ticket

A **ticket** is an `EmailThread` document with `direction: "inbound"`. Every new customer email that arrives creates one inbound `EmailThread`, and that counts against the monthly limit.

Outbound replies (`direction: "outbound"`) are **tracked** but **not limited** — they are informational for the usage dashboard.

```typescript
// Example inbound EmailThread (the one that counts):
{
  workspaceId: ObjectId("6995964c..."),
  aliasId:     ObjectId("69b503c0..."),
  direction:   "inbound",          // ← this counts as 1 ticket
  status:      "open",
  from:        "indranilmaiti1@gmail.com",
  to:          "support@git-cv.com",
  subject:     "Re: Payment issue",
  receivedAt:  ISODate("2026-03-15T12:04:11Z"),
  ...
}

// Example outbound EmailThread (tracked, not limited):
{
  workspaceId: ObjectId("6995964c..."),
  direction:   "outbound",         // ← tracked but NOT counted against ticket limit
  status:      "waiting",
  from:        "file@git-cv.com",
  to:          "adityasingh7402@gmail.com",
  subject:     "Re: hey this testing thread",
  ...
}
```

**Monthly reset:** At the start of each new billing period (triggered by Dodo's `payment.succeeded` webhook), both counters reset to `0`.

---

## 3. Phase 1 — Database Layer

### 3.1 New File: `app/api/models/SubscriptionModel.ts`

This is the central subscription record. One subscription per workspace.

```typescript
import mongoose, { Schema, type Document, type Model, Types } from "mongoose";
import type { PlanId } from "@/constants/pricing";

export interface ISubscription extends Document {
  workspaceId: Types.ObjectId;
  planId: PlanId;                   // "starter" | "growth" | "scale"
  status: "active" | "trialing" | "past_due" | "cancelled" | "inactive";

  // Dodo Payments identifiers
  dodoCustomerId: string;           // e.g. "cus_01JV..."
  dodoSubscriptionId: string;       // e.g. "sub_01JV..."

  // Current billing period
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;       // true = cancels at period end, not immediately

  // Monthly usage counters — reset on payment.succeeded webhook
  ticketCountInbound: number;       // EmailThreads with direction:"inbound" this period
  ticketCountOutbound: number;      // EmailThreads with direction:"outbound" this period
  usagePeriodStart: Date;           // when the current usage window started

  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    workspaceId:        { type: Schema.Types.ObjectId, ref: "Workspace", required: true, unique: true, index: true },
    planId:             { type: String, enum: ["starter", "growth", "scale"], required: true },
    status:             { type: String, enum: ["active", "trialing", "past_due", "cancelled", "inactive"], default: "inactive" },
    dodoCustomerId:     { type: String, default: null },
    dodoSubscriptionId: { type: String, default: null, index: true },
    currentPeriodStart: { type: Date, default: null },
    currentPeriodEnd:   { type: Date, default: null },
    cancelAtPeriodEnd:  { type: Boolean, default: false },
    ticketCountInbound: { type: Number, default: 0 },
    ticketCountOutbound:{ type: Number, default: 0 },
    usagePeriodStart:   { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Subscription: Model<ISubscription> =
  (mongoose.models.Subscription as Model<ISubscription>) ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
```

---

### 3.2 Modify: `app/api/models/WorkspaceModel.ts`

Add two convenience fields so any route can quickly know the plan without a subscription lookup:

```typescript
// Before (current):
export interface IWorkspace extends Document {
  ownerUserId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// After (add these two fields):
export interface IWorkspace extends Document {
  ownerUserId: string;
  name: string;
  planId: "starter" | "growth" | "scale";        // ← NEW (default "starter")
  subscriptionId?: Types.ObjectId;                // ← NEW (ref to Subscription)
  createdAt: Date;
  updatedAt: Date;
}

// Schema additions:
planId: {
  type: String,
  enum: ["starter", "growth", "scale"],
  default: "starter",
},
subscriptionId: {
  type: Schema.Types.ObjectId,
  ref: "Subscription",
  default: null,
},
```

---

### 3.3 Modify: `constants/pricing.ts`

Add `dodoPriceId` to `PricingPlan` interface so the checkout route can look up the Dodo price to charge:

```typescript
// Add to PricingPlan interface:
dodoPriceId: string;  // Dodo product/price ID from your Dodo dashboard

// Update each plan:
{
  id: "starter",
  name: "Starter",
  price: 19,
  dodoPriceId: process.env.DODO_PRICE_ID_STARTER!,   // ← NEW
  ...
},
{
  id: "growth",
  name: "Growth",
  price: 59,
  dodoPriceId: process.env.DODO_PRICE_ID_GROWTH!,    // ← NEW
  ...
},
{
  id: "scale",
  name: "Scale",
  price: 159,
  dodoPriceId: process.env.DODO_PRICE_ID_SCALE!,     // ← NEW
  ...
},
```

---

## 4. Phase 2 — Backend API Routes

### 4.1 `POST /api/billing/checkout`

Creates a Dodo checkout session and returns the URL to redirect the user to.

**File:** `app/api/billing/checkout/route.ts`

**Request:**
```json
POST /api/billing/checkout
{ "planId": "growth" }
```

**Logic:**
1. Get `userId` from Clerk `auth()`
2. Find workspace by `ownerUserId`
3. Look up `dodoPriceId` from `PRICING_PLANS` for the given `planId`
4. Call Dodo API to create a checkout session:
   - `success_url`: `https://yourdomain.com/billing/success?session_id={CHECKOUT_SESSION_ID}`
   - `cancel_url`: `https://yourdomain.com/billing/cancelled`
   - Include workspace ID in metadata so the webhook knows which workspace to update
5. Return `{ checkoutUrl: "https://checkout.dodopayments.com/..." }`

**Response:**
```json
{ "checkoutUrl": "https://checkout.dodopayments.com/pay/cs_01JV..." }
```

**Frontend then does:**
```typescript
const { checkoutUrl } = await res.json();
window.location.href = checkoutUrl;  // full redirect to Dodo hosted checkout
```

---

### 4.2 `GET /api/billing/subscription`

Returns the workspace's active subscription with usage counts.

**File:** `app/api/billing/subscription/route.ts`

**Response example (active Growth plan):**
```json
{
  "planId": "growth",
  "status": "active",
  "currentPeriodStart": "2026-03-01T00:00:00.000Z",
  "currentPeriodEnd": "2026-04-01T00:00:00.000Z",
  "cancelAtPeriodEnd": false,
  "usage": {
    "ticketCountInbound": 143,
    "ticketCountOutbound": 89,
    "ticketLimit": 600,
    "percentUsed": 23.8
  },
  "limits": {
    "domains": 3,
    "aliasesPerDomain": 5,
    "chatWidgets": 3,
    "ticketsPerMonth": 600,
    "dataRetentionDays": 90
  }
}
```

**Response example (no subscription / free tier):**
```json
{
  "planId": "starter",
  "status": "inactive",
  "currentPeriodStart": null,
  "currentPeriodEnd": null,
  "cancelAtPeriodEnd": false,
  "usage": {
    "ticketCountInbound": 0,
    "ticketCountOutbound": 0,
    "ticketLimit": 200,
    "percentUsed": 0
  }
}
```

---

### 4.3 `POST /api/billing/cancel`

Cancels the subscription at the end of the current period (not immediately).

**File:** `app/api/billing/cancel/route.ts`

**Logic:**
1. Find workspace subscription
2. Call Dodo API: `PATCH /subscriptions/{dodoSubscriptionId}` with `{ cancel_at_period_end: true }`
3. Update local `Subscription.cancelAtPeriodEnd = true`
4. Return updated subscription

**Response:**
```json
{
  "cancelAtPeriodEnd": true,
  "currentPeriodEnd": "2026-04-01T00:00:00.000Z",
  "message": "Your plan will remain active until Apr 1, 2026."
}
```

---

### 4.4 `POST /api/billing/resume`

Re-activates a subscription that was set to cancel at period end.

**File:** `app/api/billing/resume/route.ts`

**Logic:**
1. Call Dodo API: `PATCH /subscriptions/{dodoSubscriptionId}` with `{ cancel_at_period_end: false }`
2. Update local `Subscription.cancelAtPeriodEnd = false`

**Response:**
```json
{
  "cancelAtPeriodEnd": false,
  "message": "Your subscription has been resumed successfully."
}
```

---

### 4.5 `POST /api/billing/portal`

Generates a Dodo customer portal URL so the user can manage payment methods and download invoices.

**File:** `app/api/billing/portal/route.ts`

**Response:**
```json
{ "portalUrl": "https://portal.dodopayments.com/session/cps_01JV..." }
```

**Frontend:**
```typescript
const { portalUrl } = await res.json();
window.open(portalUrl, "_blank");
```

---

### 4.6 `GET /api/billing/usage`

Returns raw inbound/outbound ticket counts for the current billing period.

**File:** `app/api/billing/usage/route.ts`

**Logic:** Queries `EmailThread` collection:
```typescript
// Count inbound tickets this period
const inboundCount = await EmailThread.countDocuments({
  workspaceId: workspace._id,
  direction: "inbound",
  receivedAt: { $gte: subscription.usagePeriodStart },
});

// Count outbound replies this period
const outboundCount = await EmailThread.countDocuments({
  workspaceId: workspace._id,
  direction: "outbound",
  createdAt: { $gte: subscription.usagePeriodStart },
});
```

**Response:**
```json
{
  "inbound": 143,
  "outbound": 89,
  "periodStart": "2026-03-01T00:00:00.000Z",
  "limit": 600
}
```

---

### 4.7 `POST /api/webhooks/dodo` ← Public, no Clerk auth

This is the most critical route. Dodo calls this URL server-side after every payment event.

**File:** `app/api/webhooks/dodo/route.ts`

**Security:** Verify Dodo's signature using the raw request body + `DODO_WEBHOOK_SECRET`.

```typescript
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("dodo-signature");

  // 1. Verify signature — reject if invalid (return 400)
  const isValid = verifyDodoSignature(rawBody, signature, process.env.DODO_WEBHOOK_SECRET!);
  if (!isValid) return new Response("Invalid signature", { status: 400 });

  const event = JSON.parse(rawBody);

  switch (event.type) {
    case "subscription.activated":   // handle below
    case "subscription.cancelled":   // handle below
    case "subscription.past_due":    // handle below
    case "payment.succeeded":        // handle below
    case "payment.failed":           // handle below
  }

  return new Response("ok", { status: 200 });
}
```

**Event handling table:**

| Dodo Event | DB Action |
|-----------|-----------|
| `subscription.activated` | `Subscription.status = "active"`, `planId = event.metadata.planId`, `Workspace.planId = planId`, set period dates |
| `subscription.cancelled` | `Subscription.status = "cancelled"`, `Workspace.planId = "starter"` |
| `subscription.past_due` | `Subscription.status = "past_due"` — user sees warning in dashboard |
| `payment.succeeded` | Reset `ticketCountInbound = 0`, `ticketCountOutbound = 0`, update `currentPeriodStart/End`, `usagePeriodStart = now` |
| `payment.failed` | `Subscription.status = "past_due"` — same as past_due event |

**Example subscription.activated payload from Dodo:**
```json
{
  "type": "subscription.activated",
  "data": {
    "id": "sub_01JV...",
    "customer_id": "cus_01JV...",
    "current_period_start": "2026-03-17T00:00:00Z",
    "current_period_end": "2026-04-17T00:00:00Z"
  },
  "metadata": {
    "workspaceId": "6995964cc2db3bebdae073ad",
    "planId": "growth"
  }
}
```

> **Important:** Pass `workspaceId` and `planId` as metadata when creating the checkout session so the webhook knows which workspace and plan to activate.

---

## 5. Phase 3 — Plan Limit Enforcement

### 5.1 New File: `lib/checkPlanLimits.ts`

Central helper used by API routes before creating domains, aliases, widgets, or counting tickets.

```typescript
import { getPlanById } from "@/constants/pricing";
import { Subscription } from "@/app/api/models/SubscriptionModel";
import { Domain } from "@/app/api/models/DomainModel";
import { Alias } from "@/app/api/models/AliasModel";
import { ChatWidget } from "@/app/api/models/ChatWidgetModel";
import { Types } from "mongoose";

// Returns null if OK, returns error string if limit reached
export async function checkTicketLimit(workspaceId: Types.ObjectId): Promise<string | null> {
  const sub = await Subscription.findOne({ workspaceId });
  if (!sub) return null; // no subscription = free tier, has its own 200 limit
  const plan = getPlanById(sub.planId);
  if (!plan) return null;
  if (plan.limits.ticketsPerMonth === "unlimited") return null;
  if (sub.ticketCountInbound >= plan.limits.ticketsPerMonth) {
    return `Ticket limit reached (${plan.limits.ticketsPerMonth}/month on ${plan.name} plan)`;
  }
  return null;
}

export async function checkDomainLimit(workspaceId: Types.ObjectId): Promise<string | null> {
  const sub = await Subscription.findOne({ workspaceId });
  const plan = getPlanById(sub?.planId ?? "starter");
  if (plan?.limits.domains === "unlimited") return null;
  const count = await Domain.countDocuments({ workspaceId });
  if (count >= (plan?.limits.domains ?? 1)) {
    return `Domain limit reached (${plan?.limits.domains} on ${plan?.name} plan)`;
  }
  return null;
}

export async function checkAliasLimit(workspaceId: Types.ObjectId, domainId: Types.ObjectId): Promise<string | null> {
  const sub = await Subscription.findOne({ workspaceId });
  const plan = getPlanById(sub?.planId ?? "starter");
  if (plan?.limits.aliasesPerDomain === "unlimited") return null;
  const count = await Alias.countDocuments({ workspaceId, domainId });
  if (count >= (plan?.limits.aliasesPerDomain ?? 3)) {
    return `Alias limit reached (${plan?.limits.aliasesPerDomain} per domain on ${plan?.name} plan)`;
  }
  return null;
}

export async function checkWidgetLimit(workspaceId: Types.ObjectId): Promise<string | null> {
  const sub = await Subscription.findOne({ workspaceId });
  const plan = getPlanById(sub?.planId ?? "starter");
  if (plan?.limits.chatWidgets === "unlimited") return null;
  const count = await ChatWidget.countDocuments({ workspaceId });
  if (count >= (plan?.limits.chatWidgets ?? 1)) {
    return `Chat widget limit reached (${plan?.limits.chatWidgets} on ${plan?.name} plan)`;
  }
  return null;
}
```

### 5.2 Gate inbound email creation

In the route that saves new inbound `EmailThread` records:

```typescript
// Somewhere in your inbound email route handler:
import { checkTicketLimit } from "@/lib/checkPlanLimits";
import { Subscription } from "@/app/api/models/SubscriptionModel";

const limitError = await checkTicketLimit(workspace._id);
if (limitError) {
  // Save the email anyway but with a "queued" status
  // (you can add "queued" to the EmailThread status enum)
  emailData.status = "queued";

  // Notify workspace owner
  await sendLimitNotificationEmail(workspace.ownerUserId);
}

// Save EmailThread regardless (queued or open)
const thread = await EmailThread.create(emailData);

// If under limit, increment the counter
if (!limitError) {
  await Subscription.updateOne(
    { workspaceId: workspace._id },
    { $inc: { ticketCountInbound: 1 } }
  );
}
```

### 5.3 Gate domain/alias/widget creation

Pattern is the same for all three. Example for alias creation in `POST /api/aliases`:

```typescript
import { checkAliasLimit } from "@/lib/checkPlanLimits";

const limitError = await checkAliasLimit(workspace._id, domainId);
if (limitError) {
  return Response.json(
    { error: limitError, upgradeRequired: true },
    { status: 403 }
  );
}
// proceed with creating alias...
```

The `upgradeRequired: true` flag tells the frontend to show the `UpgradeModal` rather than a generic error.

---

## 6. Phase 4 — Frontend Components

### 6.1 New: `components/billing/UpgradeModal.tsx`

A Framer Motion modal that matches the existing animation style in the codebase (same easing curves).

**Props:**
```typescript
interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlanId: "starter" | "growth" | "scale";
  triggerReason?: "manual" | "domain_limit" | "alias_limit" | "ticket_limit" | "widget_limit";
}
```

**What it shows:**
```
┌─────────────────────────────────────────────┐
│  Upgrade to Growth                          │
│                                             │
│  $59/month                                  │
│                                             │
│  ✓ 3 domains                               │
│  ✓ 5 aliases per domain                    │
│  ✓ 600 tickets/month                       │
│  ✓ Detailed reports                         │
│  ✓ 3-month data retention                  │
│                                             │
│  [  Subscribe now  ]  [  Maybe later  ]    │
└─────────────────────────────────────────────┘
```

**On "Subscribe now" click:**
```typescript
const handleSubscribe = async () => {
  setLoading(true);
  const res = await fetch("/api/billing/checkout", {
    method: "POST",
    body: JSON.stringify({ planId: targetPlanId }),
    headers: { "Content-Type": "application/json" },
  });
  const { checkoutUrl } = await res.json();
  window.location.href = checkoutUrl;  // full redirect to Dodo
};
```

---

### 6.2 New: `components/billing/PlanLimitBanner.tsx`

Shown inside the dashboard when the user is approaching or has hit their ticket limit.

**Props:**
```typescript
interface PlanLimitBannerProps {
  current: number;      // inbound ticket count this period
  limit: number;        // plan limit
  planName: string;     // "Starter", "Growth", etc.
  onUpgradeClick: () => void;
}
```

**Visual states:**

| Usage | Color | Message |
|-------|-------|---------|
| < 80% | Hidden | (not shown) |
| 80–99% | Amber | "You've used X/Y tickets this month (Z% of your Starter limit)" |
| 100% | Red | "You've hit your 200 ticket limit. New tickets are queued." |

**Example rendered output (80% state):**
```
┌─────────────────────────────────────────────────────────────┐
│  ⚠  You've used 160/200 tickets this month (80%)          │
│  [████████████████░░░░]  Upgrade to Growth to get 600/mo  │
│                                              [Upgrade plan] │
└─────────────────────────────────────────────────────────────┘
```

---

### 6.3 New: `components/billing/UsageBar.tsx`

Reusable progress bar used on the `/dashboard/billing` page.

```typescript
interface UsageBarProps {
  label: string;
  current: number;
  max: number | "unlimited";
}

// Examples of usage:
<UsageBar label="Inbound tickets" current={143} max={600} />
<UsageBar label="Outbound replies" current={89} max="unlimited" />
<UsageBar label="Domains" current={2} max={3} />
```

---

### 6.4 New: `components/billing/CurrentPlanCard.tsx`

Shown at the top of the `/dashboard/billing` page.

```
┌──────────────────────────────────────────────────────┐
│  Growth Plan                       [Active ●]        │
│  $59/month                                           │
│                                                      │
│  Next billing date: April 17, 2026                   │
│  Payment: Visa ending in 4242                        │
│                                                      │
│  [Manage payment methods]  [Cancel subscription]     │
└──────────────────────────────────────────────────────┘
```

**Status badge variants:**
- `Active` → green dot
- `Trialing` → blue dot
- `Past Due` → red dot + "Update payment method" CTA
- `Cancelling` → amber dot + "Cancels on [date]" + "Resume" button

---

### 6.5 New: `app/dashboard/billing/page.tsx`

Full billing management page at `/dashboard/billing`.

**Full page layout:**
```
/dashboard/billing
│
├── <CurrentPlanCard />
│     Plan: Growth · Status: Active · Next billing: Apr 17
│     [Manage payment methods]  [Cancel subscription]
│
├── Usage This Month (Mar 1 – Apr 1)
│     <UsageBar label="Inbound tickets"  current=143 max=600 />
│     <UsageBar label="Outbound replies" current=89  max="unlimited" />
│     <UsageBar label="Domains"          current=2   max=3 />
│     <UsageBar label="Aliases / domain" current=3   max=5 />
│     <UsageBar label="Chat widgets"     current=1   max=3 />
│
└── Change Plan
      [Starter $19]   [Growth $59 (current)]   [Scale $159]
```

---

### 6.6 New: `app/billing/success/page.tsx`

Dodo redirects here after a successful payment. URL looks like:
`/billing/success?session_id=cs_01JV...`

**What this page does:**
1. Shows a spinner while fetching `/api/billing/subscription`
2. Once confirmed active, shows:

```
        ✓

   You're on Growth now.

   600 tickets/month · 3 domains · 3-month retention

          [Go to Dashboard →]
```

---

### 6.7 New: `app/billing/cancelled/page.tsx`

Dodo redirects here if user closes the checkout popup without paying.

```
   You're back.

   No charge was made. Your plan hasn't changed.

          [Back to pricing]   [Go to Dashboard]
```

---

### 6.8 Modify: `app/pricing/PricingTableSection.tsx`

Change the CTA button in `PricingCard` to be auth-aware:

```typescript
// Add to PricingCard component:
import { useUser } from "@clerk/nextjs";

const { isSignedIn } = useUser();
const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
const [currentUserPlanId, setCurrentUserPlanId] = useState<string | null>(null);

// Fetch current plan on mount (if signed in)
useEffect(() => {
  if (!isSignedIn) return;
  fetch("/api/billing/subscription")
    .then(r => r.json())
    .then(data => setCurrentUserPlanId(data.planId));
}, [isSignedIn]);

// CTA logic per plan:
const isCurrentPlan = currentUserPlanId === plan.id;
const isScalePlan   = plan.id === "scale";

// Render CTA:
{isScalePlan ? (
  <a href="/contact">Book a demo</a>        // always link for Scale
) : isCurrentPlan ? (
  <button disabled>Current plan</button>    // grey disabled state
) : isSignedIn ? (
  <button onClick={() => setUpgradeModalOpen(true)}>
    {plan.ctaLabel}
  </button>                                 // opens UpgradeModal
) : (
  <a href="/sign-up">{plan.ctaLabel}</a>   // redirect to sign-up
)}

<UpgradeModal
  isOpen={upgradeModalOpen}
  onClose={() => setUpgradeModalOpen(false)}
  targetPlanId={plan.id}
/>
```

---

### 6.9 Modify: `components/dashboard/DashboardNav.tsx`

Add a **Billing** nav item. Find the existing nav items array and add:

```typescript
// Example of what to add in the nav items list:
{
  label: "Billing",
  href: "/dashboard/billing",
  icon: <CreditCardIcon />,   // use a simple SVG credit card icon matching existing style
}
```

---

## 7. Phase 5 — Environment Variables

Add all of these to `.env.local` (and to your production environment secrets):

```env
# ── Dodo Payments ─────────────────────────────────────────────────────────────
DODO_API_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DODO_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Dodo Price IDs — get these from your Dodo dashboard after creating products
DODO_PRICE_ID_STARTER=price_01JV...
DODO_PRICE_ID_GROWTH=price_01JV...
DODO_PRICE_ID_SCALE=price_01JV...

# Your app's public URL (needed for success/cancel redirect URLs)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Where each variable is used:**

| Variable | Used in |
|----------|---------|
| `DODO_API_KEY` | All `/api/billing/*` routes (server-side Dodo API calls) |
| `DODO_WEBHOOK_SECRET` | `/api/webhooks/dodo` (signature verification) |
| `DODO_PRICE_ID_*` | `constants/pricing.ts` → `dodoPriceId` field |
| `NEXT_PUBLIC_APP_URL` | `/api/billing/checkout` success/cancel redirect URLs |

---

## 8. Complete Flow Diagrams

### Flow A — New user subscribes (Growth plan)

```
1.  User visits /pricing (logged out)
2.  Clicks "Start free trial" on Growth card
3.  Redirected to /sign-up (existing Clerk sign-up)
4.  After sign-up, Clerk redirects to /pricing (configure afterSignUpUrl)
5.  Now logged in — Growth CTA triggers UpgradeModal
6.  User clicks "Subscribe now"
7.  POST /api/billing/checkout  { planId: "growth" }
8.  Route creates Dodo checkout session with metadata:
       { workspaceId: "...", planId: "growth" }
9.  Returns { checkoutUrl: "https://checkout.dodopayments.com/..." }
10. Browser redirected to Dodo hosted checkout page
11. User enters card details and pays
12. Dodo fires webhook → POST /api/webhooks/dodo
        event.type = "subscription.activated"
        event.metadata.workspaceId = "..."
        event.metadata.planId = "growth"
13. Webhook handler:
       - Upsert Subscription { planId:"growth", status:"active", period dates }
       - Update Workspace { planId:"growth", subscriptionId: sub._id }
14. Dodo redirects to /billing/success?session_id=cs_01JV...
15. Success page fetches /api/billing/subscription → shows "You're on Growth now"
16. User clicks "Go to Dashboard"
```

---

### Flow B — Ticket limit hit (Starter plan, 200 tickets)

```
1.  Inbound email arrives at support@yourdomain.com
2.  Email inbound route handler runs
3.  Calls checkTicketLimit(workspaceId)
4.  sub.ticketCountInbound = 200 >= plan.limits.ticketsPerMonth (200)
5.  Returns error string → email saved with status:"queued"
6.  Owner gets email: "You've hit your 200 ticket limit on the Starter plan.
     New emails have been queued. Upgrade or wait for next month."
7.  Owner logs into dashboard
8.  PlanLimitBanner shows at top of tickets page (red state):
     "You've hit your 200 ticket limit. New tickets are queued."
9.  Owner clicks "Upgrade plan"
10. UpgradeModal opens pre-filled with Growth plan ($59)
11. Same checkout flow as Flow A above
12. On payment.succeeded webhook → ticketCountInbound resets to 0
13. Queued tickets automatically re-open (background job or on-demand)
```

---

### Flow C — Cancel subscription

```
1.  User goes to /dashboard/billing
2.  Clicks "Cancel subscription"
3.  Confirmation dialog: "Your plan stays active until Apr 17. Cancel anyway?"
4.  User confirms → POST /api/billing/cancel
5.  Route calls Dodo API: PATCH /subscriptions/sub_01JV... { cancel_at_period_end: true }
6.  Local DB: Subscription.cancelAtPeriodEnd = true
7.  UI updates to show CurrentPlanCard in "Cancelling" state:
     "Growth plan · Cancels on April 17, 2026"
     [Resume subscription]
8.  On April 17: Dodo fires webhook subscription.cancelled
9.  Webhook: Subscription.status = "cancelled", Workspace.planId = "starter"
10. User is now on Starter limits (1 domain, 3 aliases, 200 tickets)
```

---

### Flow D — Payment fails (past due)

```
1.  Dodo tries to renew subscription on April 17
2.  Card is declined
3.  Dodo fires webhook payment.failed
4.  Webhook: Subscription.status = "past_due"
5.  User logs in → dashboard shows red banner:
     "Your payment failed. Update your payment method to keep access."
     [Update payment method]
6.  User clicks → POST /api/billing/portal → redirected to Dodo portal
7.  User updates card in Dodo portal
8.  Dodo retries payment → payment.succeeded fires
9.  Webhook: Subscription.status = "active", reset ticket counters
```

---

### Flow E — Alias limit hit

```
1.  User (on Starter: 3 aliases per domain) tries to add a 4th alias
2.  POST /api/aliases fires
3.  Route calls checkAliasLimit(workspaceId, domainId)
4.  count (3) >= plan.limits.aliasesPerDomain (3) → returns error
5.  Route returns 403: { error: "Alias limit reached", upgradeRequired: true }
6.  Frontend detects upgradeRequired: true
7.  Opens UpgradeModal targeting Growth plan (5 aliases per domain)
```

---

## 9. Files to Create / Modify

### New files

| File | Purpose |
|------|---------|
| `app/api/models/SubscriptionModel.ts` | Mongoose model for subscription + usage counters |
| `app/api/billing/checkout/route.ts` | Create Dodo checkout session |
| `app/api/billing/subscription/route.ts` | Get current plan + usage |
| `app/api/billing/cancel/route.ts` | Cancel at period end |
| `app/api/billing/resume/route.ts` | Undo pending cancellation |
| `app/api/billing/portal/route.ts` | Dodo customer portal URL |
| `app/api/billing/usage/route.ts` | Raw inbound/outbound counts |
| `app/api/webhooks/dodo/route.ts` | Dodo webhook event handler |
| `lib/dodo.ts` | Dodo API client wrapper (thin fetch wrapper around Dodo REST) |
| `lib/checkPlanLimits.ts` | Limit check helpers used by API routes |
| `app/billing/success/page.tsx` | Post-payment success page |
| `app/billing/cancelled/page.tsx` | Post-checkout-cancel page |
| `app/dashboard/billing/page.tsx` | Billing management dashboard page |
| `components/billing/UpgradeModal.tsx` | Animated upgrade confirmation modal |
| `components/billing/PlanLimitBanner.tsx` | In-dashboard limit warning strip |
| `components/billing/CurrentPlanCard.tsx` | Active plan + status card |
| `components/billing/UsageBar.tsx` | Reusable usage progress bar |

### Modified files

| File | What changes |
|------|-------------|
| `app/api/models/WorkspaceModel.ts` | Add `planId` + `subscriptionId` fields |
| `constants/pricing.ts` | Add `dodoPriceId: string` to `PricingPlan` interface and each plan |
| `app/pricing/PricingTableSection.tsx` | Smart CTA — auth-aware, opens UpgradeModal for logged-in users |
| `components/dashboard/DashboardNav.tsx` | Add Billing nav item → `/dashboard/billing` |
| Inbound email creation route | Add `checkTicketLimit()` gate + counter increment |
| `app/api/aliases/route.ts` | Add `checkAliasLimit()` gate |
| `app/api/domains/…/route.ts` | Add `checkDomainLimit()` gate |
| Chat widget creation route | Add `checkWidgetLimit()` gate |

---

## Quick Reference — API Route Map

```
GET  /api/billing/subscription   → current plan info + usage counts
POST /api/billing/checkout       → create Dodo checkout session → returns checkoutUrl
POST /api/billing/cancel         → cancel subscription at period end
POST /api/billing/resume         → undo pending cancellation
POST /api/billing/portal         → Dodo customer portal URL
GET  /api/billing/usage          → raw ticket counts this period

POST /api/webhooks/dodo          → (Dodo calls this) handle subscription/payment events
```

---

*Last updated: 2026-03-17*
