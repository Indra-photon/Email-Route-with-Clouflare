import type { Metadata } from "next";

const BASE_URL = "https://www.syncsupport.app";

export const metadata: Metadata = {
  title: "How to Embed a Live Chat Widget",
  description:
    "Learn how to embed SyncSupport's live chat widget on your website and reply to visitors directly from Slack. Fix slow response times — your team never needs to open another tab.",
  keywords: [
    "how to add live chat widget to website",
    "embed chat widget Slack",
    "live chat Slack integration setup",
    "website chat widget no code",
    "reply to website visitors from Slack",
  ],
  openGraph: {
    title: "How to Embed a Live Chat Widget — SyncSupport Docs",
    description:
      "Add a live chat widget to your website in minutes and reply to visitors from Slack. No npm, no build step — one script tag and you're live.",
    url: `${BASE_URL}/docs/chatbot`,
    siteName: "SyncSupport",
    locale: "en_US",
    type: "article",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Live Chat Widget — SyncSupport Docs" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@syncsupportapp",
    title: "How to Embed a Live Chat Widget — SyncSupport",
    description: "One script tag. Website chat connected to Slack instantly.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${BASE_URL}/docs/chatbot`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

function ChatbotJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/docs/chatbot`,
        url: `${BASE_URL}/docs/chatbot`,
        name: "How to Embed a Live Chat Widget — SyncSupport",
        isPartOf: { "@id": BASE_URL },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Docs", item: `${BASE_URL}/docs` },
            { "@type": "ListItem", position: 3, name: "Live Chat Widget", item: `${BASE_URL}/docs/chatbot` },
          ],
        },
      },
      {
        "@type": "HowTo",
        "@id": `${BASE_URL}/docs/chatbot#howto`,
        name: "How to Embed a Live Chat Widget and Reply from Slack",
        description:
          "Create a chat widget in SyncSupport, paste one script tag into your website, and start replying to visitors in real time from your Slack workspace.",
        step: [
          { "@type": "HowToStep", position: 1, name: "Go to Chat Widgets", text: "Navigate to Chat Widgets in the SyncSupport dashboard." },
          { "@type": "HowToStep", position: 2, name: "Create a widget", text: "Click Create Widget, name it, and select the Slack channel for incoming chats." },
          { "@type": "HowToStep", position: 3, name: "Embed the script on your website", text: "Copy the one-line script tag from your dashboard and paste it into your site's <head>. No npm or build step required." },
          { "@type": "HowToStep", position: 4, name: "Reply to visitors in real time", text: "When a visitor starts a chat, it appears in Slack. Reply directly from the thread — your visitor sees your message instantly." },
        ],
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export default function ChatbotLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChatbotJsonLd />
      {children}
    </>
  );
}
