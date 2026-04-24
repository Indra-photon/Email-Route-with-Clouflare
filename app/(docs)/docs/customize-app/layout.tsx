import type { Metadata } from "next";

const BASE_URL = "https://www.syncsupport.app";

export const metadata: Metadata = {
  title: "How to Customize Your Slack Bot",
  description:
    "Give your Slack bot a name, avatar, and description per domain. Personalise how SyncSupport appears in your Slack channels when posting email notifications.",
  keywords: [
    "customize Slack bot SyncSupport",
    "Slack bot name avatar setup",
    "SyncSupport bot branding",
    "how to change Slack bot name",
    "custom Slack webhook bot appearance",
  ],
  openGraph: {
    title: "How to Customize Your Slack Bot — SyncSupport Docs",
    description:
      "Set a name, avatar, and description for your Slack bot — per domain. Control exactly how SyncSupport appears in your channels when new emails arrive.",
    url: `${BASE_URL}/docs/customize-app`,
    siteName: "SyncSupport",
    locale: "en_US",
    type: "article",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Customize App — SyncSupport Docs" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@syncsupportapp",
    title: "How to Customize Your Slack Bot — SyncSupport",
    description: "Set a bot name, avatar, and description per domain in minutes.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${BASE_URL}/docs/customize-app`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

function CustomizeAppJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/docs/customize-app`,
        url: `${BASE_URL}/docs/customize-app`,
        name: "How to Customize Your Slack Bot — SyncSupport",
        isPartOf: { "@id": BASE_URL },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Docs", item: `${BASE_URL}/docs` },
            { "@type": "ListItem", position: 3, name: "Customize App", item: `${BASE_URL}/docs/customize-app` },
          ],
        },
      },
      {
        "@type": "HowTo",
        "@id": `${BASE_URL}/docs/customize-app#howto`,
        name: "How to Customize Your Slack Bot in SyncSupport",
        description:
          "Set a bot name, avatar image, and description for each domain so your Slack notifications have a branded identity instead of a generic webhook.",
        step: [
          { "@type": "HowToStep", position: 1, name: "Go to Customize App", text: "Navigate to Dashboard → Customize App from the sidebar." },
          { "@type": "HowToStep", position: 2, name: "Select a domain", text: "Pick the domain you want to brand from the tab bar at the top of the page." },
          { "@type": "HowToStep", position: 3, name: "Fill in the settings", text: "Enter a bot name, upload an avatar image, and write an optional description." },
          { "@type": "HowToStep", position: 4, name: "Save Changes", text: "Click Save Changes. From that point on, all Slack notifications for that domain use your new bot identity." },
        ],
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export default function CustomizeAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomizeAppJsonLd />
      {children}
    </>
  );
}
