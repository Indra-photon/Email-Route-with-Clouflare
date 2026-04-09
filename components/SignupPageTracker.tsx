"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function SignupPageTracker() {
  useEffect(() => {
    posthog.capture("signup_page_viewed");
  }, []);

  return null;
}
