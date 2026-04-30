import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SyncSupport vs Zendesk — Flat Pricing vs Per-Agent Costs (2025)",
  description:
    "Compare SyncSupport and Zendesk on pricing, setup, and Slack integration. A 5-agent team saves $2,592/year switching from Zendesk Suite Team to SyncSupport Growth.",
  openGraph: {
    title: "SyncSupport vs Zendesk — Is Zendesk worth $275/month?",
    description:
      "Zendesk Suite Team costs $55/agent/month. SyncSupport Growth is $59/month flat. See the full feature and cost comparison.",
    url: "https://www.syncsupport.app/syncsupport-vs-zendesk",
    siteName: "SyncSupport",
    type: "website",
  },
  alternates: {
    canonical: "https://www.syncsupport.app/syncsupport-vs-zendesk",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.syncsupport.app",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "SyncSupport vs Zendesk",
          item: "https://www.syncsupport.app/syncsupport-vs-zendesk",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is SyncSupport cheaper than Zendesk?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. SyncSupport Growth is $59/month flat for unlimited agents. Zendesk Suite Team costs $55/agent/month — $275/month for 5 agents, $550/month for 10. A 5-agent team saves $2,592/year with SyncSupport.",
          },
        },
        {
          "@type": "Question",
          name: "Does SyncSupport work with Slack natively?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. SyncSupport is Slack-native — emails route directly to Slack channels, agents reply from Slack, and tickets are managed entirely within Slack. Zendesk offers only a limited Slack notification integration, not a full Slack-native workflow.",
          },
        },
        {
          "@type": "Question",
          name: "How long does SyncSupport take to set up compared to Zendesk?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SyncSupport takes about 5 minutes: connect Slack, add a DNS record, create email aliases, and go live. Zendesk typically takes days to weeks, including configuration, routing rules, agent training, and often an onboarding call with their team.",
          },
        },
        {
          "@type": "Question",
          name: "What does Zendesk really cost with add-ons?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Zendesk Suite Team is $55/agent/month, but real-world costs are much higher. AI features add $50/agent/month, QA tools add $35/agent, and workforce management adds $25/agent. For a 5-agent team, the total lands at $650–$950/month — versus SyncSupport Growth at $59/month flat.",
          },
        },
      ],
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
