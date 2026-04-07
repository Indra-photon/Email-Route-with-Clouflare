import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.syncsupport.app"),

  // ── Core ──────────────────────────────────────────────────────────────────
  title: "About SyncSupport — Why We Built a Slack-Native Helpdesk",
  description:
    "SyncSupport routes support emails and live chat directly into Slack so your team can claim, reply, and close tickets without ever leaving their workspace. Learn why we built it, who it's for, and how it compares to Zendesk, Front, and Help Scout.",

  // ── Keywords — question-intent + comparison + feature ────────────────────
  keywords: [
    // Who / what is SyncSupport
    "what is SyncSupport",
    "SyncSupport about",
    "Slack-native helpdesk",
    "email to Slack support tool",
    "who made SyncSupport",

    // Problem-aware searches
    "shared inbox problems",
    "shared inbox alternative Slack",
    "replace shared Gmail inbox for support",
    "stop missing support emails",
    "why teams miss support tickets",
    "support email chaos small team",

    // Comparison / switching intent
    "Zendesk alternative small team Slack",
    "Front app alternative 2025",
    "Help Scout alternative Slack",
    "Freshdesk alternative affordable",
    "cheaper than Zendesk customer support",
    "per seat helpdesk too expensive",
    "flat rate helpdesk no per user fees",
    "lightweight customer support software",

    // How it works
    "how to route support email to Slack",
    "email forwarding to Slack channel",
    "Slack ticket claiming workflow",
    "reply to customers from Slack",
    "live chat to Slack channel",
    "website chat widget Slack integration",
    "send files in live chat",
    "PDF image support in live chat",

    // Team / use case
    "customer support tool for startups",
    "helpdesk for small SaaS teams",
    "support tool for agencies",
    "founder handling support alone",
    "support manager visibility tool",
    "flat rate team helpdesk",

    // Long-tail question intent
    "why is my team missing support emails",
    "how to manage support inbox in Slack",
    "best helpdesk for teams that use Slack",
    "do I need Zendesk for a small team",
    "can I reply to customer emails from Slack",
    "how to set up support email routing in 5 minutes",
  ],

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    title: "About SyncSupport — The Slack-Native Helpdesk Built for Small Teams",
    description:
      "We built SyncSupport because shared inboxes are broken and Zendesk is overkill. Route emails and live chat to Slack, claim tickets, reply without switching tools. Flat-rate from $19/mo.",
    url: "https://www.syncsupport.app/about",
    siteName: "SyncSupport",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "SyncSupport — Slack-native helpdesk for fast-moving support teams",
      },
    ],
  },

  // ── Twitter / X ───────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@syncsupportapp",
    title: "About SyncSupport — Slack-Native Helpdesk for Small Teams",
    description:
      "We built the support tool we couldn't find anywhere else. Route emails + live chat to Slack, reply without switching apps, flat-rate pricing.",
    images: ["/images/og-image.png"],
  },

  // ── Canonical ─────────────────────────────────────────────────────────────
  alternates: {
    canonical: "https://www.syncsupport.app/about",
  },

  // ── Robots ────────────────────────────────────────────────────────────────
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
};

// ─── JSON-LD — AboutPage + FAQPage schema ─────────────────────────────────────
function AboutJsonLd() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About SyncSupport",
      url: "https://www.syncsupport.app/about",
      description:
        "SyncSupport is a Slack-native helpdesk that routes support emails and live chat to Slack channels, enables ticket claiming and replies without leaving Slack, and offers flat-rate pricing for unlimited team members.",
      mainEntity: {
        "@type": "Organization",
        name: "SyncSupport",
        url: "https://www.syncsupport.app",
        description:
          "SyncSupport builds Slack-native customer support tooling for small and medium teams. Route emails, embed live chat, reply from Slack — no per-seat fees.",
        foundingDate: "2026",
        founder: {
          "@type": "Person",
          name: "Indranil Maiti",
          url: "https://github.com/Indra-photon",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is SyncSupport?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SyncSupport is a Slack-native helpdesk that routes customer support emails directly to Slack channels, embeds live chat on your website, and lets your team claim, reply to, and resolve tickets without ever leaving Slack.",
          },
        },
        {
          "@type": "Question",
          name: "How is SyncSupport different from Zendesk?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Zendesk is a full enterprise help desk starting at $55 per agent per month. SyncSupport is Slack-native, flat-rate from $19/month for unlimited team members, and takes 5 minutes to set up. It's designed for small teams that already work in Slack and don't want a separate tool.",
          },
        },
        {
          "@type": "Question",
          name: "Can I reply to customer emails from Slack?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. SyncSupport lets you reply directly from Slack. Your reply lands in the customer's inbox as a proper email from your domain. No switching to Gmail or Outlook required.",
          },
        },
        {
          "@type": "Question",
          name: "Does SyncSupport support live chat?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. You can embed a live chat widget on your website in one line of code. Customer messages — including file attachments like PDFs and images — appear in your Slack channel in real time.",
          },
        },
        {
          "@type": "Question",
          name: "Is SyncSupport free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SyncSupport offers paid plans starting from $19/month with a flat-rate pricing model — no per-user fees. You can add unlimited team members without your bill increasing.",
          },
        },
        {
          "@type": "Question",
          name: "How long does SyncSupport take to set up?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most teams are up and running in under 5 minutes. You connect your Slack workspace, add your domain, create an email alias, and start receiving tickets immediately. No engineering work required.",
          },
        },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AboutJsonLd />
      {children}
    </>
  );
}