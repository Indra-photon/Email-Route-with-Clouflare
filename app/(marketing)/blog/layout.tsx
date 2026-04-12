import type { Metadata } from "next";

const BASE_URL = "https://www.syncsupport.app";

export const metadata: Metadata = {
  title: "Blog — Slack Support Tips, Helpdesk Guides & SaaS Growth",
  description:
    "Practical guides on running customer support from Slack, reducing response times, replacing Zendesk, and growing a SaaS business. Written by the SyncSupport team.",

  keywords: [
    "slack support tips",
    "helpdesk guides",
    "route email to slack",
    "zendesk alternative guide",
    "customer support saas",
    "slack ticketing tips",
    "support team productivity",
    "syncsupport blog",
  ],

  openGraph: {
    title: "SyncSupport Blog — Slack Support Tips & Helpdesk Guides",
    description:
      "Practical guides on running customer support from Slack, reducing response times, and growing a SaaS business.",
    url: `${BASE_URL}/blog`,
    siteName: "SyncSupport",
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
  },

  twitter: {
    card: "summary_large_image",
    site: "@syncsupportapp",
    title: "SyncSupport Blog — Slack Support Tips & Helpdesk Guides",
    description:
      "Practical guides on customer support, Slack workflows, and SaaS growth.",
    images: ["/images/og-image.png"],
  },

  alternates: { canonical: `${BASE_URL}/blog` },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}