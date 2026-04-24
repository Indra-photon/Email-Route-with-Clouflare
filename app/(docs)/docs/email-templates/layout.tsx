import type { Metadata } from "next";

const BASE_URL = "https://www.syncsupport.app";

export const metadata: Metadata = {
  title: "How to Use Email Templates",
  description:
    "Create pre-written reply templates with smart placeholders for your support team. Speed up ticket responses in Slack with reusable, variable-filled email templates.",
  keywords: [
    "email reply templates Slack",
    "support ticket templates SyncSupport",
    "canned responses Slack helpdesk",
    "how to create email template SyncSupport",
    "auto-fill email placeholders support",
  ],
  openGraph: {
    title: "How to Use Email Templates — SyncSupport Docs",
    description:
      "Save pre-written replies with smart placeholders. Your team picks a template in Slack, variables auto-fill with real customer data, and the reply goes out in seconds.",
    url: `${BASE_URL}/docs/email-templates`,
    siteName: "SyncSupport",
    locale: "en_US",
    type: "article",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Email Templates — SyncSupport Docs" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@syncsupportapp",
    title: "How to Use Email Templates — SyncSupport",
    description: "Pre-written replies with smart placeholders. Cut reply time to seconds.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${BASE_URL}/docs/email-templates`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

function EmailTemplatesJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/docs/email-templates`,
        url: `${BASE_URL}/docs/email-templates`,
        name: "How to Use Email Templates — SyncSupport",
        isPartOf: { "@id": BASE_URL },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Docs", item: `${BASE_URL}/docs` },
            { "@type": "ListItem", position: 3, name: "Email Templates", item: `${BASE_URL}/docs/email-templates` },
          ],
        },
      },
      {
        "@type": "HowTo",
        "@id": `${BASE_URL}/docs/email-templates#howto`,
        name: "How to Create and Use Email Templates in SyncSupport",
        description:
          "Create reusable reply templates with smart placeholders. Your Slack team picks a template, variables fill automatically, and the reply is sent to the customer in seconds.",
        step: [
          { "@type": "HowToStep", position: 1, name: "Go to Email Templates", text: "Navigate to Dashboard → Email Templates from the sidebar." },
          { "@type": "HowToStep", position: 2, name: "Click Add Template", text: "Give the template a name your team will recognise, like 'Welcome Response' or 'Refund Policy'." },
          { "@type": "HowToStep", position: 3, name: "Write subject and body", text: "Use placeholders like {name} and {subject}. Choose plain text, editable HTML, or static HTML body mode." },
          { "@type": "HowToStep", position: 4, name: "Click Create Template", text: "The template is now available for your team to use when replying to tickets from Slack." },
        ],
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export default function EmailTemplatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EmailTemplatesJsonLd />
      {children}
    </>
  );
}
