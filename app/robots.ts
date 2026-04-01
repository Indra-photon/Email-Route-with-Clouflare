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
          "/*.xml$",         // XML files except sitemap (handled separately)
          "/*/loading",      // Next.js loading UI segments
          "/*/error",        // Next.js error UI segments
        ],
      },

      // ── Block AI training crawlers ─────────────────────────────────────────
      // These do not contribute to SEO and scrape content for model training.
    //   {
    //     userAgent: "GPTBot",
    //     disallow: "/",
    //   },
    //   {
    //     userAgent: "ChatGPT-User",
    //     disallow: "/",
    //   },
    //   {
    //     userAgent: "Google-Extended",
    //     disallow: "/",
    //   },
    //   {
    //     userAgent: "CCBot",
    //     disallow: "/",
    //   },
    //   {
    //     userAgent: "anthropic-ai",
    //     disallow: "/",
    //   },
    //   {
    //     userAgent: "Claude-Web",
    //     disallow: "/",
    //   },
    //   {
    //     userAgent: "Omgilibot",
    //     disallow: "/",
    //   },
    //   {
    //     userAgent: "FacebookBot",
    //     disallow: "/",
    //   },
    ],

    // ── Sitemap ───────────────────────────────────────────────────────────────
    sitemap: `${BASE_URL}/sitemap.xml`,

    // ── Canonical host ────────────────────────────────────────────────────────
    host: BASE_URL,
  };
}