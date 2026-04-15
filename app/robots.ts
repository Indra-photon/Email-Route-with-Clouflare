// import type { MetadataRoute } from "next";

// const BASE_URL = "https://www.syncsupport.app";

// export default function robots(): MetadataRoute.Robots {
//   return {
//     rules: [
//       // ── All well-behaved crawlers ──────────────────────────────────────────
//       {
//         userAgent: "*",
//         allow: [
//           "/",           // Marketing pages
//           "/docs/",      // Documentation (high SEO value)
//           "/pricing",
//           "/about",
//           "/contact",
//           "/blog/",
//           "/frequently-asked-questions",
//           "/changelog",
//           "/roadmap",
//           "/privacy",
//           "/terms-of-service",
//           "/terms-and-conditions",
//           "/sign-in",    // Allow indexing of auth pages (funnel awareness)
//           "/sign-up",
//         ],
//         disallow: [
//           "/api/",           // All API routes — never index
//           "/admin/",         // Internal admin panel
//           "/dashboard/",     // Authenticated app — no value to crawlers
//           "/_next/",         // Next.js internals
//           "/static/",        // Static assets
//           "/*.json$",        // JSON files
//           "/*/loading",      // Next.js loading UI segments
//           "/*/error",        // Next.js error UI segments
//         ],
        
//       },
//     ],

//     // ── Sitemap ───────────────────────────────────────────────────────────────
//     sitemap: `${BASE_URL}/sitemap.xml`,

//     // ── Canonical host ────────────────────────────────────────────────────────
//     host: BASE_URL,
//   };
// }


import type { MetadataRoute } from "next";

const BASE_URL = "https://www.syncsupport.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── All well-behaved crawlers ──────────────────────────────────────────
      {
        userAgent: "*",
        allow: [
          "/",
          "/docs",
          "/docs/",
          "/pricing",
          "/about",
          "/contact",
          "/blog",
          "/blog/",
          "/changelog",
          "/roadmap",
          "/privacy",
          "/frequently-asked-questions",
          "/terms-of-service",
          "/terms-and-conditions",
          "/sign-in",
          "/sign-up",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/static/",
          "/*.json$",
          "/*/loading",
          "/*/error",
        ],
      },

      // ── AI crawlers — explicit allow for maximum AI visibility ────────────
      {
        userAgent: "GPTBot",
        allow: ["/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/"],
      },
      {
        userAgent: "Amazonbot",
        allow: ["/"],
      },
    ],

    // ── Sitemap ───────────────────────────────────────────────────────────────
    sitemap: `${BASE_URL}/sitemap.xml`,

    // ── host: BASE_URL  ← DELETE THIS LINE (Yandex-only, ignored by Google) ──
  };
}