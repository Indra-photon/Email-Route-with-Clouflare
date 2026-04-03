import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | syncsupport",
  description:
    "Read the Terms and Conditions for syncsupport — understand the rules, responsibilities, and agreements that apply when using our email-to-Slack support routing platform.",
  alternates: {
    canonical: "https://syncsupport.app/terms-and-conditions",
  },
  openGraph: {
    title: "Terms and Conditions | syncsupport",
    description:
      "Read the Terms and Conditions for syncsupport — the Slack-native email support routing platform.",
    url: "https://syncsupport.app/terms-and-conditions",
    siteName: "syncsupport",
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