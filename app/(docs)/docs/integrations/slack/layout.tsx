import type { Metadata } from "next";

const BASE_URL = "https://www.syncsupport.app";

export const metadata: Metadata = {
  title: "How to Connect Slack to SyncSupport",
  description:
    "Learn how to connect your Slack workspace to SyncSupport and route customer emails to channels. Fix the problem of missing emails — your team sees every message in Slack within 2–5 seconds.",
  keywords: [
    "how to connect Slack to email support",
    "Slack email routing integration setup",
    "SyncSupport Slack integration",
    "route support emails to Slack channel",
    "Slack customer support setup guide",
  ],
  openGraph: {
    title: "How to Connect Slack to SyncSupport — Integration Guide",
    description:
      "Authorize SyncSupport in your Slack workspace, connect an email alias to a channel, and receive customer emails in Slack in under a minute. No more missed support requests.",
    url: `${BASE_URL}/docs/integrations/slack`,
    siteName: "SyncSupport",
    locale: "en_US",
    type: "article",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Slack Integration — SyncSupport Docs" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@syncsupportapp",
    title: "How to Connect Slack to SyncSupport",
    description: "Authorize, connect an alias to a channel, and get emails in Slack in under a minute.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${BASE_URL}/docs/integrations/slack`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

function SlackIntegrationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/docs/integrations/slack`,
        url: `${BASE_URL}/docs/integrations/slack`,
        name: "How to Connect Slack to SyncSupport — Integration Guide",
        isPartOf: { "@id": BASE_URL },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Docs", item: `${BASE_URL}/docs` },
            { "@type": "ListItem", position: 3, name: "Integrations", item: `${BASE_URL}/docs/integrations` },
            { "@type": "ListItem", position: 4, name: "Slack", item: `${BASE_URL}/docs/integrations/slack` },
          ],
        },
      },
      {
        "@type": "HowTo",
        "@id": `${BASE_URL}/docs/integrations/slack#howto`,
        name: "How to Connect Slack to SyncSupport for Email Routing",
        description:
          "Authorize SyncSupport in your Slack workspace, add a Slack integration in the dashboard, and connect an email alias to a channel to receive customer emails directly in Slack.",
        step: [
          { "@type": "HowToStep", position: 1, name: "Go to Integrations", text: "Navigate to Integrations in the SyncSupport dashboard sidebar." },
          { "@type": "HowToStep", position: 2, name: "Add a Slack integration", text: "Click Add Integration and select Slack from the list." },
          { "@type": "HowToStep", position: 3, name: "Authorize with Slack", text: "Click Connect Slack and complete the OAuth flow to authorize SyncSupport in your workspace." },
          { "@type": "HowToStep", position: 4, name: "Connect an email alias", text: "Select a Slack channel and link it to an email alias so incoming emails post to that channel." },
        ],
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export default function SlackIntegrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SlackIntegrationJsonLd />
      {children}
    </>
  );
}
