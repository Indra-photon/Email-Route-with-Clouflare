// constants/pricing.ts
// ─── SEED / FALLBACK ONLY ─────────────────────────────────────────────────────
// This file is the source of truth for seeding the PricingPlan MongoDB collection.
// At runtime, the pricing page fetches from /api/public/pricing (DB-driven, ISR-cached).
// Admin panel writes are stored in MongoDB and do NOT require code changes here.
// Update this file only when you want to reset the DB seed to new baseline values.

export type PlanId = "starter" | "growth" | "scale";

export interface PricingFeature {
  label: string;
  included: boolean;
  soon?: boolean;
  note?: string;
}

export interface PricingPlanLimits {
  domains: number | -1;             // -1 = unlimited
  aliasesPerDomain: number | -1;
  chatWidgets: number | -1;
  ticketsPerMonth: number | -1;     // renamed from totalEmails — inbound tickets only
  dataRetentionDays: number | -1;
}

export interface PricingPlan {
  id: PlanId;
  name: string;
  price: number;              // monthly USD
  description: string;
  highlight: boolean;         // true = "recommended" card
  ctaLabel: string;
  dodoPriceId: string;        // Dodo Payments product price ID (from env)
  limits: PricingPlanLimits;
  features: PricingFeature[];
  sortOrder: number;
  isVisible: boolean;
}

// ─── Seed data ────────────────────────────────────────────────────────────────
// Used ONLY by lib/seedPricingPlans.ts on first run (when DB collection is empty).

export const PRICING_PLANS_SEED: PricingPlan[] = [
  // ─── Starter ───────────────────────────────────────────────────────────────
  {
    id: "starter",
    name: "Starter",
    price: 19,
    description: "Perfect for solo founders and tiny teams just getting started.",
    highlight: false,
    ctaLabel: "Start free trial",
    dodoPriceId: process.env.DODO_PRICE_ID_STARTER ?? "",
    sortOrder: 0,
    isVisible: true,
    limits: {
      domains: 1,
      aliasesPerDomain: 3,
      chatWidgets: 1,
      ticketsPerMonth: 200,
      dataRetentionDays: 15,
    },
    features: [
      { label: "1 domain",                                      included: true  },
      { label: "3 email aliases → dedicated Slack channels",    included: true  },
      { label: "1 chat widget (text only)",                     included: true  },
      { label: "Reply from Slack",                              included: true  },
      { label: "Ticket claiming & assignment",                  included: true  },
      { label: "Basic reports",                                 included: true  },
      { label: "200 inbound tickets / month",                   included: true  },
      { label: "15-day data retention",                         included: true  },
      { label: "Email support",                                 included: true  },
      { label: "Detailed reports",                              included: false },
      { label: "Pre-filled responses",                          included: false },
      { label: "AI analysis & content suggestions",             included: false },
    ],
  },

  // ─── Growth ────────────────────────────────────────────────────────────────
  {
    id: "growth",
    name: "Growth",
    price: 59,
    description: "For growing teams handling real support volume across multiple products.",
    highlight: true,
    ctaLabel: "Start free trial",
    dodoPriceId: process.env.DODO_PRICE_ID_GROWTH ?? "",
    sortOrder: 1,
    isVisible: true,
    limits: {
      domains: 3,
      aliasesPerDomain: 5,
      chatWidgets: 3,
      ticketsPerMonth: 600,
      dataRetentionDays: 90,
    },
    features: [
      { label: "3 domains",                                                     included: true  },
      { label: "5 email aliases per domain → dedicated Slack channels",         included: true  },
      { label: "1 chat widget per domain (with file sending)",                  included: true  },
      { label: "Reply from Slack",                                              included: true  },
      { label: "Ticket claiming & assignment",                                  included: true  },
      { label: "Detailed reports",                                              included: true  },
      { label: "600 inbound tickets / month",                                   included: true  },
      { label: "3-month data retention",                                        included: true  },
      { label: "Priority email support",                                        included: true  },
      { label: "Pre-filled responses",                                          included: true  },
      { label: "AI analysis — monthly digest & content suggestions", included: true, soon: true },
    ],
  },

  // ─── Scale ─────────────────────────────────────────────────────────────────
  {
    id: "scale",
    name: "Scale",
    price: 159,
    description: "Unlimited everything for teams that have outgrown the basics.",
    highlight: false,
    ctaLabel: "Book a demo",
    dodoPriceId: process.env.DODO_PRICE_ID_SCALE ?? "",
    sortOrder: 2,
    isVisible: true,
    limits: {
      domains: -1,
      aliasesPerDomain: -1,
      chatWidgets: -1,
      ticketsPerMonth: -1,
      dataRetentionDays: -1,
    },
    features: [
      { label: "Unlimited domains",                                             included: true  },
      { label: "Unlimited email aliases → dedicated Slack channels",            included: true  },
      { label: "Unlimited chat widgets (with file sending)",                    included: true  },
      { label: "Reply from Slack",                                              included: true  },
      { label: "Ticket claiming & assignment",                                  included: true  },
      { label: "Detailed reports",                                              included: true  },
      { label: "Unlimited inbound tickets",                                     included: true  },
      { label: "Full data retention",                                           included: true  },
      { label: "Priority support via Slack",                                    included: true  },
      { label: "Pre-filled responses",                                          included: true  },
      { label: "AI analysis — on-demand + weekly digest & suggestions", included: true, soon: true },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true if the limit value means "unlimited" */
export const isUnlimited = (val: number | -1): val is -1 => val === -1;

/** Display string for a limit value */
export const displayLimit = (val: number | -1): string =>
  val === -1 ? "∞" : val.toLocaleString();

// ─── Billing period labels ────────────────────────────────────────────────────

export const BILLING_PERIODS = { monthly: "Monthly", annual: "Annual" } as const;
export type BillingPeriod = keyof typeof BILLING_PERIODS;
export const ANNUAL_DISCOUNT_PERCENT = 20;