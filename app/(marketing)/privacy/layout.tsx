import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | syncsupport",
  description:
    "Learn how syncsupport collects, uses, and protects your personal data when you use our email-to-Slack support routing platform.",
  alternates: {
    canonical: "https://syncsupport.app/privacy",
  },
  openGraph: {
    title: "Privacy Policy | syncsupport",
    description:
      "Learn how syncsupport collects, uses, and protects your personal data.",
    url: "https://syncsupport.app/privacy",
    siteName: "syncsupport",
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