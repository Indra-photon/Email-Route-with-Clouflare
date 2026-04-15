"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

/**
 * A link to a dashboard route used inside public docs pages.
 * - Logged in  → goes directly to the dashboard path
 * - Logged out → goes to /sign-up
 * Always carries rel="nofollow" so crawlers don't try to follow
 * auth-protected routes.
 */
export function DashboardLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { isSignedIn } = useUser();
  const resolvedHref = isSignedIn ? href : "/sign-up";

  return (
    <Link
      href={resolvedHref}
      rel="nofollow"
      className={className}
    >
      {children}
    </Link>
  );
}
