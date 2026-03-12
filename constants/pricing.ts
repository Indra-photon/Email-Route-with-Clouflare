// constants/pricing.ts
// Central source of truth for all pricing tiers, features, and limits.
// Update this file whenever pricing or features change — no other file needs editing.

export type PlanId = "starter" | "growth" | "scale";

export interface PricingFeature {
  label: string;
  included: boolean;
  soon?: boolean;       // true → shows "Coming Soon" badge
  note?: string;        // optional clarification shown as subtext
}

export interface PricingPlan {
  id: PlanId;
  name: string;
  price: number;                // monthly price in USD
  description: string;          // one-line tagline shown under plan name
  highlight: boolean;           // true → renders as the "recommended" card
  ctaLabel: string;
  ctaHref: string;

  limits: {
    domains: number | "unlimited";
    aliasesPerDomain: number | "unlimited";
    chatWidgets: number | "unlimited";
    ticketsPerMonth: number | "unlimited";
    dataRetentionDays: number | "unlimited";  // "unlimited" = full retention
  };

  features: PricingFeature[];
}

export const PRICING_PLANS: PricingPlan[] = [
  // ─── Starter ─────────────────────────────────────────────────────────────
  {
    id: "starter",
    name: "Starter",
    price: 19,
    description: "Perfect for solo founders and tiny teams just getting started.",
    highlight: false,
    ctaLabel: "Start free trial",
    ctaHref: "/sign-up",

    limits: {
      domains: 1,
      aliasesPerDomain: 3,
      chatWidgets: 1,
      ticketsPerMonth: 200,
      dataRetentionDays: 15,
    },

    features: [
      { label: "1 domain",                           included: true  },
      { label: "3 email aliases → dedicated Slack channels", included: true },
      { label: "1 chat widget (text only)",           included: true  },
      { label: "Reply from Slack",                    included: true  },
      { label: "Ticket claiming & assignment",        included: true  },
      { label: "Basic reports",                       included: true  },
      { label: "200 tickets / month",                 included: true  },
      { label: "15-day data retention",               included: true  },
      { label: "Email support",                       included: true  },
      { label: "Detailed reports",                    included: false },
      { label: "Canned responses",                    included: false },
      { label: "AI analysis & content suggestions",   included: false },
    ],
  },

  // ─── Growth ──────────────────────────────────────────────────────────────
  {
    id: "growth",
    name: "Growth",
    price: 59,
    description: "For growing teams handling real support volume across multiple products.",
    highlight: true,   // recommended / featured card
    ctaLabel: "Start free trial",
    ctaHref: "/sign-up",

    limits: {
      domains: 3,
      aliasesPerDomain: 5,
      chatWidgets: 3,           // 1 per domain
      ticketsPerMonth: 600,
      dataRetentionDays: 90,    // 3 months
    },

    features: [
      { label: "3 domains",                                   included: true  },
      { label: "5 email aliases per domain → dedicated Slack channels", included: true },
      { label: "1 chat widget per domain (with file sending)", included: true  },
      { label: "Reply from Slack",                            included: true  },
      { label: "Ticket claiming & assignment",                included: true  },
      { label: "Detailed reports",                            included: true  },
      { label: "600 tickets / month",                         included: true  },
      { label: "3-month data retention",                      included: true  },
      { label: "Priority email support",                      included: true  },
      {
        label: "Canned responses",
        included: true,
        soon: true,
      },
      {
        label: "AI analysis — monthly digest & content suggestions",
        included: true,
        soon: true,
      },
    ],
  },

  // ─── Scale ───────────────────────────────────────────────────────────────
  {
    id: "scale",
    name: "Scale",
    price: 159,
    description: "Unlimited everything for teams that have outgrown the basics.",
    highlight: false,
    ctaLabel: "Book a demo",
    ctaHref: "/contact",

    limits: {
      domains: "unlimited",
      aliasesPerDomain: "unlimited",
      chatWidgets: "unlimited",
      ticketsPerMonth: 2000,
      dataRetentionDays: "unlimited",
    },

    features: [
      { label: "Unlimited domains",                           included: true  },
      { label: "Unlimited email aliases → dedicated Slack channels", included: true },
      { label: "Unlimited chat widgets (with file sending)",  included: true  },
      { label: "Reply from Slack",                            included: true  },
      { label: "Ticket claiming & assignment",                included: true  },
      { label: "Detailed reports",                            included: true  },
      { label: "2,000 tickets / month",                       included: true  },
      { label: "Full data retention",                         included: true  },
      { label: "Priority support via Slack",                  included: true  },
      {
        label: "Canned responses",
        included: true,
        soon: true,
      },
      {
        label: "AI analysis — on-demand + weekly digest & content suggestions",
        included: true,
        soon: true,
      },
    ],
  },
];

// ─── Helper: look up a plan by id ────────────────────────────────────────────
export const getPlanById = (id: PlanId): PricingPlan | undefined =>
  PRICING_PLANS.find((p) => p.id === id);

// ─── Billing period toggle labels (for annual/monthly switch if added later) ─
export const BILLING_PERIODS = {
  monthly: "Monthly",
  annual: "Annual",
} as const;

export type BillingPeriod = keyof typeof BILLING_PERIODS;

// Annual discount percentage — update here if you add annual billing later
export const ANNUAL_DISCOUNT_PERCENT = 20;