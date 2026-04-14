import type { Metadata } from "next";

const BASE_URL = "https://www.syncsupport.app";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  // ── Core ──────────────────────────────────────────────────────────────────
  title: "FAQ — Frequently Asked Questions About SyncSupport",
  description:
    "Answers to the most common questions about SyncSupport — the customer support tool built inside Slack. Learn about setup, email routing, live chat, canned responses, ticket tracking, pricing, and security.",

  // ── Keywords ──────────────────────────────────────────────────────────────
  keywords: [
    "SyncSupport FAQ",
    "SyncSupport questions",
    "how does SyncSupport work",
    "Slack customer support tool FAQ",
    "email to Slack routing questions",
    "Slack helpdesk setup",
    "SyncSupport pricing questions",
    "live chat Slack FAQ",
    "canned responses Slack",
    "Slack ticket tracking questions",
    "SyncSupport vs Zendesk",
    "Slack support tool for small teams",
    "customer support Slack integration help",
    "SyncSupport security",
    "SyncSupport free trial",
  ],

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    title: "FAQ — Frequently Asked Questions About SyncSupport",
    description:
      "Everything you need to know about SyncSupport — email routing, live chat, canned responses, ticket tracking, pricing and security. All answered in one place.",
    url: `${BASE_URL}/faq`,
    siteName: "SyncSupport",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "SyncSupport FAQ — Customer Support Built Inside Slack",
      },
    ],
  },

  // ── Twitter / X ───────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@syncsupportapp",
    title: "FAQ — Frequently Asked Questions About SyncSupport",
    description:
      "Answers to common questions about SyncSupport — the customer support tool built inside Slack. Setup, features, pricing, and security.",
    images: ["/images/og-image.png"],
  },

  // ── Canonical ─────────────────────────────────────────────────────────────
  alternates: {
    canonical: `${BASE_URL}/faq`,
  },

  // ── Robots ────────────────────────────────────────────────────────────────
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

// ─── FAQPage JSON-LD ──────────────────────────────────────────────────────────
// This is the dedicated /faq page schema — covers all questions across all
// categories. The homepage FAQSection schema only covers the 6 hero questions.
// Having a full FAQPage schema here maximises AI citation surface.

function FaqJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // ── WebPage + Breadcrumb ────────────────────────────────────────────
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/faq`,
        url: `${BASE_URL}/faq`,
        name: "SyncSupport FAQ — Frequently Asked Questions",
        description:
          "Answers to common questions about SyncSupport — the customer support tool built inside Slack. Covers setup, email routing, live chat, canned responses, ticket tracking, pricing and security.",
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
              name: "FAQ",
              item: `${BASE_URL}/faq`,
            },
          ],
        },
      },

      // ── FAQPage schema ──────────────────────────────────────────────────
      {
        "@type": "FAQPage",
        "@id": `${BASE_URL}/faq#faqpage`,
        url: `${BASE_URL}/faq`,
        name: "SyncSupport Frequently Asked Questions",
        mainEntity: [
          // ── Getting Started ────────────────────────────────────────────
          {
            "@type": "Question",
            name: "What is SyncSupport?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "SyncSupport is a customer support tool built inside Slack. It routes your support emails to Slack channels, lets your team handle live chat from the website, track tickets, send canned responses, and reply to customers — all without leaving Slack.",
            },
          },
          {
            "@type": "Question",
            name: "How long does setup take?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Most teams are up and running in under 5 minutes. Connect your Slack workspace, add your domain, set up your email aliases, and you're live. No complex configuration, no training required.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need to change my email provider?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Not at all. You can keep using Gmail, Zoho, Outlook, or any other provider. Simply set up email forwarding to your SyncSupport address. Emails arrive in both your inbox and your Slack channel simultaneously.",
            },
          },
          {
            "@type": "Question",
            name: "Can I use my own custom domain?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Add and verify your own domain inside SyncSupport and we'll provide DNS instructions to configure your MX records. You can also start immediately using our test domain while DNS propagates.",
            },
          },
          {
            "@type": "Question",
            name: "What do I need to get started with SyncSupport?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A Slack workspace and a support email address. That's it. No technical knowledge required — if you can set up a Slack channel, you can set up SyncSupport.",
            },
          },

          // ── Features ──────────────────────────────────────────────────
          {
            "@type": "Question",
            name: "How quickly do emails arrive in Slack?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Emails are routed to your Slack channel in 2–5 seconds on average. SyncSupport is built for real-time — your team sees new customer messages the moment they arrive.",
            },
          },
          {
            "@type": "Question",
            name: "How many email aliases can I create?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can create unlimited email aliases on your verified domains — support@, sales@, billing@, help@, and more. Each alias routes to a dedicated Slack channel so your team stays organised by function.",
            },
          },
          {
            "@type": "Question",
            name: "Can I reply to customers directly from Slack?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Claim a ticket with one click, then reply directly from Slack. Your customer receives the reply from your branded email address. Your team never has to open an email client.",
            },
          },
          {
            "@type": "Question",
            name: "What are canned responses?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Canned responses are pre-written reply templates for your most common questions. Instead of typing the same answer ten times a day, your team picks a template and sends it in one click. You can create unlimited templates and organise them by category.",
            },
          },
          {
            "@type": "Question",
            name: "Does SyncSupport support live chat on my website?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Embed a live chat widget on your website in minutes. When a visitor starts a chat, it appears in your Slack channel in real time. Your team replies from Slack — no extra tool, no new tab.",
            },
          },
          {
            "@type": "Question",
            name: "Can multiple team members handle the same inbox?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. All teammates in the Slack channel can see incoming tickets. Anyone can claim a ticket to assign it to themselves, preventing duplicate replies. Team visibility is real-time — everyone always knows what's being handled.",
            },
          },

          // ── Pricing ───────────────────────────────────────────────────
          {
            "@type": "Question",
            name: "How is SyncSupport pricing structured?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "SyncSupport uses flat-rate pricing — not per-user fees. You pay one monthly price regardless of how many team members use the workspace. Plans start at $19/month for Starter, $59/month for Growth, and $159/month for Scale.",
            },
          },
          {
            "@type": "Question",
            name: "Is there a free trial for SyncSupport?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. You can start with our free tier to test email routing and basic ticket handling before committing to a paid plan. No credit card required to get started.",
            },
          },
          {
            "@type": "Question",
            name: "Can I cancel SyncSupport anytime?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. No contracts, no lock-in. Cancel from your dashboard at any time and your subscription ends at the close of the current billing period.",
            },
          },
          {
            "@type": "Question",
            name: "How does SyncSupport compare to Zendesk or Front?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "SyncSupport is purpose-built for teams already living in Slack. Zendesk and Front require your team to context-switch into a separate tool. SyncSupport is 3–10x cheaper, takes minutes to set up rather than days, and has zero per-user fees — making it ideal for startups and growing teams.",
            },
          },

          // ── Security ──────────────────────────────────────────────────
          {
            "@type": "Question",
            name: "Is my email data secure with SyncSupport?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. All data is encrypted in transit and at rest. Email content is stored with strict access controls and we never read, analyse, or share your customer emails. Your data is yours.",
            },
          },
          {
            "@type": "Question",
            name: "What happens if a Slack notification fails?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "SyncSupport uses retry logic with exponential backoff. If a notification fails to deliver, the system retries automatically multiple times before alerting you. No messages are silently dropped.",
            },
          },
          {
            "@type": "Question",
            name: "What is SyncSupport's uptime guarantee?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We target 99.9% uptime. Our infrastructure is built on reliable cloud providers with redundancy at every layer. Status and incident history are available on our status page.",
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

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FaqJsonLd />
      {children}
    </>
  );
}