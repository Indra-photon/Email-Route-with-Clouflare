import "./fumadocs.css";
import "./fumadocs-theme.css";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { FumaProvider } from "@/components/FumaProvider";
import { NavBar } from "@/components/NavBar";
import React, { type ReactNode } from "react";
import type { Metadata } from "next";
import * as PageTree from "fumadocs-core/page-tree";
import { CustomItem, CustomFolder } from "@/components/docs/SidebarComponents";

export const metadata: Metadata = {
  title: "Documentation — Setup Guides, API Reference & Integrations",
  description:
    "Learn how to set up SyncSupport in 5 minutes. Step-by-step guides for routing support emails to Slack, connecting Discord, creating email aliases, embedding live chat widgets, managing tickets, and using the REST API.",

  keywords: [
    "how to route support emails to Slack",
    "SyncSupport setup guide",
    "email to Slack setup",
    "Slack webhook email setup",
    "connect email to Slack channel",
    "how to create email alias Slack",
    "how to embed live chat widget website",
    "live chat Slack setup guide",
    "canned responses setup helpdesk",
    "Slack ticket management guide",
    "Discord email routing setup",
    "DNS MX record email forwarding setup",
    "SyncSupport API reference",
    "email routing API docs",
    "SyncSupport documentation",
  ],

  openGraph: {
    title: "SyncSupport Docs — Set Up Email-to-Slack Routing in 5 Minutes",
    description:
      "Step-by-step guides for email routing, Slack and Discord integrations, live chat widget setup, canned responses, ticket management, and the SyncSupport API.",
    url: "https://www.syncsupport.app/docs",
    siteName: "SyncSupport",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "SyncSupport Documentation",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@syncsupportapp",
    title: "SyncSupport Docs — Set Up Email-to-Slack Routing in 5 Minutes",
    description:
      "Guides for email routing, Slack & Discord setup, live chat widgets, canned responses, and the REST API.",
    images: ["/images/og-image.png"],
  },

  alternates: {
    canonical: "https://www.syncsupport.app/docs",
  },

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

// ─── Page tree ────────────────────────────────────────────────────────────────

const tree: PageTree.Root = {
  name: "SyncSupport Docs",
  children: [
    { type: "page", name: "Introduction", url: "/docs" },
    // { type: "page", name: "Quick Start", url: "/docs/getting-started" },
    {
      type: "folder",
      name: "Setup",
      defaultOpen: true,
      children: [
        { type: "page", name: "Add Your Domain", url: "/docs/domains" },
        // { type: "page", name: "Integrations", url: "/docs/integrations" },
        {
          type: "page",
          name: "Slack Integration",
          url: "/docs/integrations/slack",
        },
        // {
        //   type: "page",
        //   name: "Discord Integration",
        //   url: "/docs/integrations/discord",
        // },
        { type: "page", name: "Email Aliases", url: "/docs/aliases" },
        {
          type: "page",
          name: "Chat Widget Integration",
          url: "/docs/chatbot",
        },
      ],
    },
    {
      type: "folder",
      name: "Features",
      defaultOpen: true,
      children: [
        { type: "page", name: "Ticket Management", url: "/docs/tickets" },
        // { type: "page", name: "Chat Widget", url: "/docs/chatbot" },
        // { type: "page", name: "API Reference", url: "/docs/api" },
        // { type: "page", name: "Advanced", url: "/docs/advanced" },
        // { type: "page", name: "Resources", url: "/docs/resources" },
        // { type: "page", name: "Troubleshooting", url: "/docs/troubleshooting" },
      ],
    },
  ],
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function DocsLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <FumaProvider>
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
