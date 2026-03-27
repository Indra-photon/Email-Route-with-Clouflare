import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | 5MinutesSupport",
  description:
    "Read the Terms of Service for 5MinutesSupport — the Slack-native email support routing platform. Understand your rights and obligations when using our service.",
  alternates: {
    canonical: "https://5minutessupport.com/terms-of-service",
  },
  openGraph: {
    title: "Terms of Service | 5MinutesSupport",
    description:
      "Read the Terms of Service for 5MinutesSupport — the Slack-native email support routing platform.",
    url: "https://5minutessupport.com/terms-of-service",
    siteName: "5MinutesSupport",
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