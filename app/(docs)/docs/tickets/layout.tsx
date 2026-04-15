import type { Metadata } from "next";

const BASE_URL = "https://www.syncsupport.app";

export const metadata: Metadata = {
  title: "How to Manage Support Tickets",
  description:
    "Learn how to claim, reply to, and resolve support tickets in SyncSupport. Track ticket status, assign tickets to teammates, and manage your entire support queue without leaving Slack.",
  keywords: [
    "support ticket management Slack",
    "how to claim support ticket Slack",
    "reply to support ticket from Slack",
    "resolve ticket SyncSupport",
    "Slack helpdesk ticket tracking",
  ],
  openGraph: {
    title: "How to Manage Support Tickets — SyncSupport Docs",
    description:
      "Claim, reply to, and resolve support tickets directly from Slack. Track status, assign to teammates, and close tickets — all without leaving Slack.",
    url: `${BASE_URL}/docs/tickets`,
    siteName: "SyncSupport",
    locale: "en_US",
    type: "article",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Ticket Management — SyncSupport Docs" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@syncsupportapp",
    title: "How to Manage Support Tickets — SyncSupport",
    description: "Claim, reply, and resolve support tickets from Slack in seconds.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${BASE_URL}/docs/tickets`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

function TicketsJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/docs/tickets`,
        url: `${BASE_URL}/docs/tickets`,
        name: "How to Manage Support Tickets — SyncSupport",
        isPartOf: { "@id": BASE_URL },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Docs", item: `${BASE_URL}/docs` },
            { "@type": "ListItem", position: 3, name: "Tickets", item: `${BASE_URL}/docs/tickets` },
          ],
        },
      },
      {
        "@type": "HowTo",
        "@id": `${BASE_URL}/docs/tickets#howto`,
        name: "How to Claim and Resolve Support Tickets in SyncSupport",
        description:
          "Manage support tickets from Slack — claim incoming tickets, reply to customers, and mark them as resolved without leaving your workspace.",
        step: [
          { "@type": "HowToStep", position: 1, name: "Receive a ticket", text: "An inbound email creates a ticket and posts it to your configured Slack channel." },
          { "@type": "HowToStep", position: 2, name: "Claim the ticket", text: "Click Claim in Slack to assign the ticket to yourself and set its status to In Progress." },
          { "@type": "HowToStep", position: 3, name: "Reply to the customer", text: "Use the Reply button in Slack to send a response directly to the customer's email." },
          { "@type": "HowToStep", position: 4, name: "Mark as resolved", text: "Once the issue is resolved, click Mark Resolved to close the ticket." },
        ],
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export default function TicketsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TicketsJsonLd />
      {children}
    </>
  );
}
