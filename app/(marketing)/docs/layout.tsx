import { Container } from "@/components/Container";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsTableOfContents } from "@/components/docs/DocsTableOfContents";
import { DocSearch } from "@/components/docs/DocSearch";
import { CustomLink } from "@/components/CustomLink";
import { Mail } from "lucide-react";

import type { Metadata } from "next";

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

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      {/* <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <DocSearch />
          </div>
        </Container>
      </header> */}

      {/* Main Content */}
      <Container className="py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <DocsSidebar />

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <div className="max-w-4xl">{children}</div>
          </main>

          {/* Right Sidebar - Will be populated by page content */}
          <DocsTableOfContents />
        </div>
      </Container>
    </div>
  );
}