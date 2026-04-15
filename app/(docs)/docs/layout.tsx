import "./fumadocs.css";
import "./fumadocs-theme.css";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { FumaProvider } from "@/components/FumaProvider";
import { NavBar } from "@/components/NavBar";
import React, { type ReactNode } from "react";
import type { Metadata } from "next";
import * as PageTree from "fumadocs-core/page-tree";
import { CustomItem, CustomFolder } from "@/components/docs/SidebarComponents";

const BASE_URL = "https://www.syncsupport.app";

export const metadata: Metadata = {
  title: {
    default: "SyncSupport Docs",
    template: "%s — SyncSupport Docs",
  },
  description:
    "Learn how to route support emails to Slack, embed a live chat widget, create email aliases, and manage customer tickets — all without leaving Slack. Set up in under 5 minutes.",
  keywords: [
    "SyncSupport documentation",
    "email to Slack routing setup",
    "Slack customer support docs",
    "how to route email to Slack",
    "SyncSupport getting started",
    "how to create email alias Slack",
    "how to embed live chat widget website",
    "DNS MX record email forwarding setup",
  ],
  openGraph: {
    title: "SyncSupport Docs — Set Up Email-to-Slack Support in 5 Minutes",
    description:
      "Step-by-step guides for email routing, Slack setup, live chat widgets, email aliases, and ticket management. Everything your team needs to handle support without leaving Slack.",
    url: `${BASE_URL}/docs`,
    siteName: "SyncSupport",
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "SyncSupport Docs" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@syncsupportapp",
    title: "SyncSupport Docs — Email-to-Slack Support Setup",
    description: "Guides for routing emails to Slack, live chat, aliases, and ticket management.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${BASE_URL}/docs`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// ─── Page tree ────────────────────────────────────────────────────────────────

const tree: PageTree.Root = {
  name: "SyncSupport Docs",
  children: [
    { type: "page", name: "Introduction", url: "/docs" },
    {
      type: "folder",
      name: "Setup",
      defaultOpen: true,
      children: [
        { type: "page", name: "Add Your Domain", url: "/docs/domains" },
        { type: "page", name: "Slack Integration", url: "/docs/integrations/slack" },
        { type: "page", name: "Email Aliases", url: "/docs/aliases" },
        { type: "page", name: "Chat Widget Integration", url: "/docs/chatbot" },
      ],
    },
    {
      type: "folder",
      name: "Features",
      defaultOpen: true,
      children: [
        { type: "page", name: "Ticket Management", url: "/docs/tickets" },
      ],
    },
  ],
};

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

function DocsJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/docs`,
        url: `${BASE_URL}/docs`,
        name: "SyncSupport Documentation",
        description:
          "Official documentation for SyncSupport — how to route support emails to Slack, set up live chat, create aliases, and manage tickets.",
        isPartOf: { "@id": BASE_URL },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Docs", item: `${BASE_URL}/docs` },
          ],
        },
      },
      {
        "@type": "TechArticle",
        "@id": `${BASE_URL}/docs#article`,
        headline: "How to Set Up SyncSupport — Email-to-Slack Support Routing",
        description:
          "Complete setup guide: connect Slack, add your domain, create email aliases, embed a chat widget, and start handling customer support without leaving Slack.",
        url: `${BASE_URL}/docs`,
        publisher: { "@type": "Organization", name: "SyncSupport", url: BASE_URL },
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function DocsLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <FumaProvider>
      <DocsJsonLd />
      <NavBar />
      <div className="docs-layout" style={{ "--fd-nav-height": "57px" } as React.CSSProperties}>
        <DocsLayout
          tree={tree}
          nav={{ enabled: false }}
          searchToggle={{ enabled: false }}
          slots={{ themeSwitch: false }}
          sidebar={{
            defaultOpenLevel: 1,
            collapsible: true,
            footer: null,
            components: {
              Item: CustomItem,
              Folder: CustomFolder,
            },
          }}
        >
          {children}
        </DocsLayout>
      </div>
    </FumaProvider>
  );
}
