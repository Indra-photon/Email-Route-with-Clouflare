"use client";

import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";

export function FumaProvider({ children }: { children: ReactNode }) {
  return (
    <RootProvider theme={{ defaultTheme: "light", forcedTheme: "light" }}>
      {children}
    </RootProvider>
  );
}
