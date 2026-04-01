import type { Metadata } from "next";

const BASE_URL = "https://www.syncsupport.app";

export const metadata: Metadata = {
  // ── Core ────────────────────────────────────────────────────────────────────
  // Title inherits template "%s | SyncSupport" from root layout
  title: "Pricing — Flat-Rate Plans With Live Chat, Canned Responses & Slack Ticketing",
  description:
    "SyncSupport starts at $19/mo flat — no per-user fees. Route support emails to Slack, embed live chat widgets on your website, reply from Slack, use canned responses for instant answers, and track every ticket. 3x cheaper than Zendesk or Front.",

  // ── Keywords — full feature surface + purchase intent ──────────────────────
  keywords: [
    // Pricing intent
    "SyncSupport pricing",
    "Slack helpdesk pricing",
    "flat rate helpdesk software",
    "no per user pricing helpdesk",
    "affordable Slack support tool",
    "helpdesk software under $20",
    "cheap Zendesk alternative",
    "Freshdesk cheaper alternative",
    "Front app pricing alternative",

    // Live chat feature
    "live chat widget for website",
    "live chat Slack integration",
    "embed live chat on website",
    "reply to live chat from Slack",
    "website chat widget Slack",
    "customer chat widget SaaS",

    // Canned responses feature
    "canned responses helpdesk",
    "pre-built email responses",
    "email response templates Slack",
    "one click support replies",
    "support reply templates tool",

    // Email routing + ticketing
    "email to Slack ticket routing",
    "Slack support ticket system",
    "reply from Slack to customers",
    "ticket claiming Slack",
    "shared inbox Slack alternative",

    // All-in-one angle
    "email support live chat Slack",
    "support tool email and chat",
    "Slack helpdesk live chat canned responses",
    "support tool for startups",
    "support tool for small teams",
  ],

  // ── Open Graph ──────────────────────────────────────────────────────────────
  openGraph: {
    title: "SyncSupport Pricing — Email, Live Chat & Canned Responses From $19/mo",
    description:
      "Route emails to Slack, embed live chat on your site, reply with canned responses in one click — all from $19/mo flat. No per-user fees, no contracts.",
    url: `${BASE_URL}/pricing`,
    siteName: "SyncSupport",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "SyncSupport Pricing — Starter $19, Growth $59, Scale $159",
      },
    ],
  },

  // ── Twitter / X ─────────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@syncsupportapp",
    title: "SyncSupport Pricing — Email, Live Chat & Canned Responses From $19/mo",
    description:
      "Route emails to Slack, add live chat to your site, reply with canned responses — flat-rate from $19/mo. No per-user fees.",
    images: ["/images/og-image.png"],
  },

  // ── Canonical ───────────────────────────────────────────────────────────────
  alternates: {
    canonical: `${BASE_URL}/pricing`,
  },

  // ── Indexing ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ─── JSON-LD structured data ──────────────────────────────────────────────────

function PricingJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // ── WebPage + Breadcrumb ──────────────────────────────────────────────
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/pricing`,
        url: `${BASE_URL}/pricing`,
        name: "SyncSupport Pricing",
        description:
          "Flat-rate plans for email-to-Slack routing, live chat widgets, canned responses, and ticket management. From $19/mo — no per-user fees.",
        isPartOf: { "@id": BASE_URL },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: BASE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Pricing",
              item: `${BASE_URL}/pricing`,
            },
          ],
        },
      },

      // ── Starter Plan ─────────────────────────────────────────────────────
      {
        "@type": "Offer",
        name: "Starter — $19/mo",
        description:
          "Perfect for solo founders and small teams. Includes email-to-Slack routing, 1 live chat widget, ticket claiming, reply from Slack, and basic reports.",
        price: "19.00",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "19.00",
          priceCurrency: "USD",
          unitText: "MONTH",
        },
        url: `${BASE_URL}/pricing`,
        seller: {
          "@type": "Organization",
          name: "SyncSupport",
          url: BASE_URL,
        },
        itemOffered: {
          "@type": "Service",
          name: "SyncSupport Starter",
          description:
            "1 domain, 3 email aliases routed to dedicated Slack channels, 1 live chat widget (text only), reply from Slack, ticket claiming and assignment, basic reports, 200 inbound tickets per month, 15-day data retention.",
        },
      },

      // ── Growth Plan ──────────────────────────────────────────────────────
      {
        "@type": "Offer",
        name: "Growth — $59/mo",
        description:
          "For growing teams. Includes everything in Starter plus live chat with file sending, canned responses, pre-filled email templates, detailed reports, and priority support.",
        price: "59.00",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "59.00",
          priceCurrency: "USD",
          unitText: "MONTH",
        },
        url: `${BASE_URL}/pricing`,
        seller: {
          "@type": "Organization",
          name: "SyncSupport",
          url: BASE_URL,
        },
        itemOffered: {
          "@type": "Service",
          name: "SyncSupport Growth",
          description:
            "3 domains, 5 email aliases per domain, 1 live chat widget per domain with file sending, canned responses and pre-filled reply templates, reply from Slack, ticket claiming, detailed analytics reports, 600 inbound tickets per month, 90-day data retention, priority email support.",
        },
      },

      // ── Scale Plan ───────────────────────────────────────────────────────
      {
        "@type": "Offer",
        name: "Scale — $159/mo",
        description:
          "Unlimited everything. Unlimited domains, aliases, chat widgets, tickets, and forever data retention. Includes AI-powered monthly digest and content suggestions.",
        price: "159.00",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "159.00",
          priceCurrency: "USD",
          unitText: "MONTH",
        },
        url: `${BASE_URL}/pricing`,
        seller: {
          "@type": "Organization",
          name: "SyncSupport",
          url: BASE_URL,
        },
        itemOffered: {
          "@type": "Service",
          name: "SyncSupport Scale",
          description:
            "Unlimited domains, unlimited email aliases, unlimited live chat widgets, unlimited inbound tickets, forever data retention, canned responses, pre-filled templates, detailed reports, AI analysis with monthly digest and content suggestions.",
        },
      },

      // ── FAQ — covers every feature question people Google before buying ───
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Does SyncSupport include a live chat widget?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Every plan includes at least one live chat widget you can embed on your website. Visitors chat from your site, your team replies directly from Slack — no extra tool or tab switching needed.",
            },
          },
          {
            "@type": "Question",
            name: "What are canned responses in SyncSupport?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Canned responses are pre-written reply templates for your most common support questions — billing, password resets, feature FAQs, and more. Your team can insert any template with one click when replying from Slack, keeping responses fast, consistent, and on-brand.",
            },
          },
          {
            "@type": "Question",
            name: "Can I reply to customer emails directly from Slack?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. When a customer email arrives, SyncSupport posts it to your chosen Slack channel. Your team can claim the ticket, pick a canned response or write a custom reply, and send — all without leaving Slack.",
            },
          },
          {
            "@type": "Question",
            name: "How much does SyncSupport cost?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "SyncSupport uses flat-rate pricing — not per user. Starter is $19/month, Growth is $59/month, and Scale is $159/month. Your entire team can use it for the same cost.",
            },
          },
          {
            "@type": "Question",
            name: "Is SyncSupport cheaper than Zendesk?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Zendesk charges $55+ per agent per month. SyncSupport charges a flat monthly rate for the whole workspace regardless of team size, making it 3–10x cheaper for small and mid-sized teams.",
            },
          },
          {
            "@type": "Question",
            name: "Does SyncSupport work with Discord as well as Slack?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. SyncSupport supports both Slack and Discord webhooks. You can route support emails and live chat notifications to whichever platform your team uses.",
            },
          },
          {
            "@type": "Question",
            name: "Is there a free trial?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Starter and Growth plans both include a free trial so you can test email routing, live chat, and canned responses before committing.",
            },
          },
          {
            "@type": "Question",
            name: "Can I cancel anytime?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. No annual contracts. Cancel at any time — your plan stays active until the end of the current billing period.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PricingJsonLd />
      {children}
    </>
  );
}