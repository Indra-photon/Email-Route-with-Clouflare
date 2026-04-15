import type { Metadata } from "next";

const BASE_URL = "https://www.syncsupport.app";

export const metadata: Metadata = {
  title: "How to Add and Configure Your Domain",
  description:
    "Step-by-step guide to adding your domain to SyncSupport, retrieving MX records, configuring DNS with Cloudflare, GoDaddy, or Namecheap, and verifying your domain for email routing to Slack.",
  keywords: [
    "how to add domain SyncSupport",
    "configure MX records for email routing",
    "email domain DNS setup Slack",
    "verify domain email routing",
    "how to set up MX records Cloudflare GoDaddy",
  ],
  openGraph: {
    title: "How to Add and Configure Your Domain — SyncSupport Docs",
    description:
      "Add your domain, retrieve MX records, paste them into your DNS provider, and verify — four steps to route support emails to Slack from your own domain.",
    url: `${BASE_URL}/docs/domains`,
    siteName: "SyncSupport",
    locale: "en_US",
    type: "article",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Domain Setup — SyncSupport Docs" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@syncsupportapp",
    title: "How to Add and Configure Your Domain — SyncSupport",
    description: "Add your domain, set up MX records, and verify in four steps to route emails to Slack.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${BASE_URL}/docs/domains`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

function DomainsJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/docs/domains`,
        url: `${BASE_URL}/docs/domains`,
        name: "How to Add and Configure Your Domain — SyncSupport",
        isPartOf: { "@id": BASE_URL },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Docs", item: `${BASE_URL}/docs` },
            { "@type": "ListItem", position: 3, name: "Add Your Domain", item: `${BASE_URL}/docs/domains` },
          ],
        },
      },
      {
        "@type": "HowTo",
        "@id": `${BASE_URL}/docs/domains#howto`,
        name: "How to Add and Configure Your Domain for Email Routing",
        description:
          "Add your domain to SyncSupport, retrieve MX records, configure your DNS provider, and verify your domain to start routing support emails to Slack.",
        step: [
          { "@type": "HowToStep", position: 1, name: "Add your domain", text: "Navigate to Domains in the dashboard, enter your domain name, and click Add Domain." },
          { "@type": "HowToStep", position: 2, name: "Retrieve MX records", text: "Click Add to Resend on your domain card to generate and copy the four MX records." },
          { "@type": "HowToStep", position: 3, name: "Paste MX records in your DNS provider", text: "Add the four MX records to your DNS provider (Cloudflare, GoDaddy, or Namecheap)." },
          { "@type": "HowToStep", position: 4, name: "Verify your MX records", text: "Click Check Verification in the dashboard until all records show Verified status." },
        ],
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export default function DomainsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DomainsJsonLd />
      {children}
    </>
  );
}
