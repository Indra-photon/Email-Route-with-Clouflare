"use client";

import { ReactNode } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { useUserStore } from "@/lib/store";

interface CTAWrapperProps {
  loggedInHref: string;
  loggedOutHref: string;
  loggedInText: string;
  loggedOutText: string;
  children: (props: { isLoggedIn: boolean; text: string }) => ReactNode;
}

export default function CTAWrapper({
  loggedInHref,
  loggedOutHref,
  loggedInText,
  loggedOutText,
  children,
}: CTAWrapperProps) {
  const user = useUserStore((state) => state.user);
  const isLoggedIn = user !== null;

  const href = isLoggedIn ? loggedInHref : loggedOutHref;
  const text = isLoggedIn ? loggedInText : loggedOutText;

  const handleClick = () => {
    posthog.capture("cta_clicked", {
      location: "hero",
      cta_text: text,
      destination: href,
      user_state: isLoggedIn ? "logged_in" : "logged_out",
    });
  };

  return (
    <Link href={href} onClick={handleClick}>
      {children({ isLoggedIn, text })}
    </Link>
  );
}