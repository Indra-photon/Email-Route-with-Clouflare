import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | 5MinutesSupport",
  description:
    "Read the Terms and Conditions for 5MinutesSupport — understand the rules, responsibilities, and agreements that apply when using our email-to-Slack support routing platform.",
  alternates: {
    canonical: "https://5minutessupport.com/terms-and-conditions",
  },
  openGraph: {
    title: "Terms and Conditions | 5MinutesSupport",
    description:
      "Read the Terms and Conditions for 5MinutesSupport — the Slack-native email support routing platform.",
    url: "https://5minutessupport.com/terms-and-conditions",
    siteName: "5MinutesSupport",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsAndConditionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}