import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | syncsupport",
  description:
    "Read the Terms of Service for syncsupport — the Slack-native email support routing platform. Understand your rights and obligations when using our service.",
  alternates: {
    canonical: "https://syncsupport.app/terms-of-service",
  },
  openGraph: {
    title: "Terms of Service | syncsupport",
    description:
      "Read the Terms of Service for syncsupport — the Slack-native email support routing platform.",
    url: "https://syncsupport.app/terms-of-service",
    siteName: "syncsupport",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}