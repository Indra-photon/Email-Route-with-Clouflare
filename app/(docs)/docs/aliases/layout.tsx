import type { Metadata } from "next";

const BASE_URL = "https://www.syncsupport.app";

export const metadata: Metadata = {
  title: "How to Create Email Aliases",
  description:
    "Learn how to create email aliases in SyncSupport to route support@, sales@, and billing@ to dedicated Slack channels. Fix the problem of all emails landing in one inbox — separate them by team.",
  keywords: [
    "how to create email alias Slack",
    "route support email to Slack channel",
    "email alias setup SyncSupport",
    "sales@ billing@ support@ Slack routing",
    "how to separate emails by team Slack",
  ],
  openGraph: {
    title: "How to Create Email Aliases — SyncSupport Docs",
    description:
      "Create support@, sales@, and billing@ aliases and route each to a dedicated Slack channel. Stop all emails landing in one place — give every team their own inbox.",
    url: `${BASE_URL}/docs/aliases`,
    siteName: "SyncSupport",
    locale: "en_US",
    type: "article",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Email Aliases — SyncSupport Docs" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@syncsupportapp",
    title: "How to Create Email Aliases — SyncSupport",
    description: "Route support@, sales@, and billing@ to separate Slack channels in minutes.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${BASE_URL}/docs/aliases`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

function AliasesJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/docs/aliases`,
        url: `${BASE_URL}/docs/aliases`,
        name: "How to Create Email Aliases — SyncSupport",
        isPartOf: { "@id": BASE_URL },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Docs", item: `${BASE_URL}/docs` },
            { "@type": "ListItem", position: 3, name: "Email Aliases", item: `${BASE_URL}/docs/aliases` },
          ],
        },
      },
      {
        "@type": "HowTo",
        "@id": `${BASE_URL}/docs/aliases#howto`,
        name: "How to Create Email Aliases and Route Them to Slack Channels",
        description:
          "Create email aliases like support@, sales@, and billing@ in SyncSupport and map each to a dedicated Slack channel so every team only sees their own emails.",
        step: [
          { "@type": "HowToStep", position: 1, name: "Go to Aliases", text: "Navigate to Aliases in the dashboard sidebar." },
          { "@type": "HowToStep", position: 2, name: "Click Add Alias", text: "Click the Add Alias button to open the creation form." },
          { "@type": "HowToStep", position: 3, name: "Select your domain and enter the local part", text: "Choose your verified domain and type the alias prefix (e.g. support, sales, billing)." },
          { "@type": "HowToStep", position: 4, name: "Select the target integration", text: "Pick the Slack or Discord channel where this alias should deliver emails." },
          { "@type": "HowToStep", position: 5, name: "Click Create Alias", text: "Save the alias. Emails sent to that address will now appear in the selected channel." },
        ],
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export default function AliasesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AliasesJsonLd />
      {children}
    </>
  );
}
