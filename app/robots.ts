import type { MetadataRoute } from "next";

const BASE_URL = "https://www.syncsupport.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── All well-behaved crawlers ──────────────────────────────────────────
      {
        userAgent: "*",
        allow: [
          "/",           // Marketing pages
          "/docs/",      // Documentation (high SEO value)
          "/pricing",
          "/about",
          "/contact",
          "/blog/",
          "/changelog",
          "/roadmap",
          "/privacy",
          "/terms-of-service",
          "/terms-and-conditions",
          "/sign-in",    // Allow indexing of auth pages (funnel awareness)
          "/sign-up",
        ],
        disallow: [
          "/api/",           // All API routes — never index
          "/admin/",         // Internal admin panel
          "/dashboard/",     // Authenticated app — no value to crawlers
          "/_next/",         // Next.js internals
          "/static/",        // Static assets
          "/*.json$",        // JSON files
          "/*/loading",      // Next.js loading UI segments
          "/*/error",        // Next.js error UI segments
        ],
      },
    ],

    // ── Sitemap ───────────────────────────────────────────────────────────────
    sitemap: `${BASE_URL}/sitemap.xml`,

    // ── Canonical host ────────────────────────────────────────────────────────
    host: BASE_URL,
  };
}