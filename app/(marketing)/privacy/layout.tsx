import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | 5MinutesSupport",
  description:
    "Learn how 5MinutesSupport collects, uses, and protects your personal data when you use our email-to-Slack support routing platform.",
  alternates: {
    canonical: "https://5minutessupport.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | 5MinutesSupport",
    description:
      "Learn how 5MinutesSupport collects, uses, and protects your personal data.",
    url: "https://5minutessupport.com/privacy",
    siteName: "5MinutesSupport",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}