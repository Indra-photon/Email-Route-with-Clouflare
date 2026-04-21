import type { Metadata } from "next";
import { Geist, Geist_Mono, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { UserSync } from "@/components/UserSync";
import { ChatWidgetScript } from "@/components/ChatWidgetScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// ─── Drop-in replacement for app/layout.tsx ──────────────────────────────────
// Replace ONLY the `metadata` export and `JsonLd` function.
// Everything else in the file stays exactly as-is.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL("https://www.syncsupport.app"),

  // ── Core ──────────────────────────────────────────────────────────────────
  title: {
    default:
      "SyncSupport | Slack-Native Helpdesk — Email, Live Chat & Canned Responses",
    template: "%s | SyncSupport",
  },
  description:
    "SyncSupport is the Slack-native helpdesk for fast-moving teams. Route support emails to Slack channels, embed live chat widgets on your website, reply with canned responses in one click, claim and track tickets — all without ever leaving Slack. Flat-rate pricing from $19/mo.",

  // ── Keywords (TOFU → BOFU) ─────────────────────────────────────────────────
  keywords: [
    // ── Core product ──
    "SyncSupport",
    "external support slack integration",
    "Slack helpdesk",
    "Slack-native ticketing",
    "email to Slack",
    "email to Slack routing",
    "route support emails to Slack",
    "Slack support ticket system",
    "Slack ticketing software",
    "Slack customer support tool",
    "Discord support ticket routing",

    // ── Live chat ──
    "live chat widget for website",
    "embed live chat on website",
    "reply to live chat from Slack",
    "website live chat Slack integration",
    "customer chat widget SaaS",
    "live chat tool for small teams",

    // ── Canned responses ──
    "canned responses helpdesk",
    "pre-filled email responses",
    "support reply templates Slack",
    "one click support replies",
    "email response templates helpdesk",

    // ── Ticket management ──
    "ticket claiming in Slack",
    "reply from Slack to customers",
    "support email management",
    "email ticket routing",
    "customer support email automation",
    "Slack support workflow",

    // ── Shared inbox pain ──
    "shared inbox alternative",
    "replace shared inbox",
    "shared mailbox for teams",
    "support inbox for small teams",

    // ── Feature-specific ──
    "email alias routing",
    "support email to Slack channel",
    "Slack webhook email forwarding",
    "multi-domain email routing",
    "response time analytics helpdesk",
    "AI support analysis monthly digest",

    // ── Comparisons / alternatives ──
    "Zendesk alternative for small teams",
    "Freshdesk alternative Slack",
    "Front app alternative",
    "Help Scout alternative Slack",
    "lightweight helpdesk software",
    "affordable customer support SaaS",
    "flat rate helpdesk no per user fee",

    // ── Long-tail ──
    "how to route support emails to Slack",
    "Slack-first support tool for startups",
    "best Slack integration for customer support 2025",
    "email support without leaving Slack",
    "sync email and Slack for support teams",
    "helpdesk with live chat and canned responses",
  ],

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    title: "SyncSupport — Email, Live Chat & Canned Responses, All From Slack",
    description:
      "Route support emails to Slack, embed live chat on your website, reply with canned responses in one click, and track every ticket — without ever leaving Slack. From $19/mo flat.",
    url: "https://www.syncsupport.app",
    siteName: "SyncSupport",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "SyncSupport — Slack-native helpdesk with email routing, live chat and canned responses",
      },
    ],
  },

  // ── Twitter / X ───────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@syncsupportapp",
    title: "SyncSupport — Email, Live Chat & Canned Responses, All From Slack",
    description:
      "Route emails to Slack, embed live chat on your site, reply with canned responses — flat-rate from $19/mo. No per-user fees.",
    images: ["/images/og-image.png"],
  },

  // ── Canonical ─────────────────────────────────────────────────────────────
  alternates: {
    canonical: "https://www.syncsupport.app",
  },

  // ── Crawling & Indexing ───────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Authorship ────────────────────────────────────────────────────────────
  authors: [
    {
      name: "Indranil Maiti",
      url: "https://github.com/Indra-photon",
    },
  ],
  creator: "Indranil Maiti",
  publisher: "SyncSupport",

  // ── Search Console Verification ───────────────────────────────────────────
  verification: {
    google: "V7Hk-rKDbXepGrnfoGhPcQFry849TsKGLuVHCZ4O69A",
  },

  // ── App / PWA ─────────────────────────────────────────────────────────────
  applicationName: "SyncSupport",
  category: "Business Software",
  classification: "Customer Support / Helpdesk",

  // ── Icons ─────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },

  // ── Manifest ──────────────────────────────────────────────────────────────
  manifest: "/site.webmanifest",

  // ── AI / LLM discoverability ──────────────────────────────────────────────
  // Points AI crawlers (ChatGPT, Claude, Perplexity, etc.) to the llms.txt
  // file that describes this product in a structured, LLM-friendly format.
  // Standard: https://llmstxt.org
  other: {
    "llms-txt": "/llms.txt",
  },
};

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SyncSupport",
    url: "https://www.syncsupport.app",
    description:
      "SyncSupport is a Slack-native helpdesk that routes support emails to Slack channels, embeds live chat widgets on websites, provides canned responses for one-click replies, and manages support tickets — all without leaving Slack. Supports Slack and Discord. Flat-rate pricing from $19/month.",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Customer Support Software",
    operatingSystem: "Web",

    // ── Pricing ──
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "19",
      highPrice: "159",
      offerCount: "3",
      offers: [
        {
          "@type": "Offer",
          name: "Starter",
          price: "19",
          priceCurrency: "USD",
          description:
            "1 domain, 3 email aliases, 1 live chat widget, 200 tickets/month, reply from Slack, ticket claiming, basic reports.",
        },
        {
          "@type": "Offer",
          name: "Growth",
          price: "59",
          priceCurrency: "USD",
          description:
            "3 domains, 5 aliases/domain, 3 live chat widgets with file sending, canned responses, pre-filled reply templates, 600 tickets/month, detailed reports, AI digest.",
        },
        {
          "@type": "Offer",
          name: "Scale",
          price: "159",
          priceCurrency: "USD",
          description:
            "Unlimited domains, aliases, chat widgets, and tickets. Forever data retention. AI analysis and content suggestions.",
        },
      ],
    },

    // ── Features — complete list ──
    featureList: [
      "Email-to-Slack ticket routing",
      "Email-to-Discord ticket routing",
      "Custom email aliases per domain",
      "Multi-domain support",
      "Slack & Discord webhook integration",
      "Ticket claiming and assignment",
      "Reply from Slack to customers",
      "Reply from Discord to customers",
      "Live chat widget for websites",
      "Real-time visitor chat from Slack",
      "Canned responses and pre-filled reply templates",
      "One-click template insertion in Slack",
      "Ticket status tracking (Open, In Progress, Resolved)",
      "Response time analytics and reports",
      "AI-powered monthly support digest",
      "AI content suggestions for replies",
      "File sending in live chat",
      "15-day to forever data retention",
      "Flat-rate pricing — no per-user fees",
    ],

    // ── Authorship ──
    author: {
      "@type": "Person",
      name: "Indranil Maiti",
      url: "https://github.com/Indra-photon",
    },

    // ── Publisher ──
    publisher: {
      "@type": "Organization",
      name: "SyncSupport",
      url: "https://www.syncsupport.app",
      logo: {
        "@type": "ImageObject",
        url: "https://www.syncsupport.app/images/logo.png",
        width: 512,
        height: 512,
      },
    },

    screenshot: "https://www.syncsupport.app/images/og-image.png",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          suppressHydrationWarning
          className={`${geistSans.variable} ${geistMono.variable} ${schibstedGrotesk.variable} antialiased`}
        >
          <UserSync />
          <JsonLd />
          {children}
          <GoogleTagManager gtmId="GTM-KDWNBW63" />
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id="3ec71afb-dca0-4a4c-808f-34fd434c9999"
          />
          <ChatWidgetScript />
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
