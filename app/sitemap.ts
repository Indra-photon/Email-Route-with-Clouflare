import { MetadataRoute } from "next";
import dbConnect from "@/lib/dbConnect";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { getAllPosts } from "@/lib/blog/hashnode";

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE_URL = "https://www.syncsupport.app";

export const revalidate = 3600; // Rebuild sitemap every hour (ISR)

// ─── Types ────────────────────────────────────────────────────────────────────

type SitemapEntry = MetadataRoute.Sitemap[number];
type ChangeFreq = SitemapEntry["changeFrequency"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function url(
  path: string,
  opts: {
    priority: number;
    changeFreq: ChangeFreq;
    lastMod?: Date;
  }
): SitemapEntry {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: opts.lastMod ?? new Date(),
    changeFrequency: opts.changeFreq,
    priority: opts.priority,
  };
}

// ─── Static Pages ─────────────────────────────────────────────────────────────

const MARKETING_PAGES: SitemapEntry[] = [
  // ── Core ──
  url("/",          { priority: 1.0, changeFreq: "weekly" }),
  url("/pricing",   { priority: 0.9, changeFreq: "weekly" }),
  url("/about",     { priority: 0.7, changeFreq: "monthly" }),
  // url("/contact",   { priority: 0.6, changeFreq: "monthly" }),
  // url("/changelog", { priority: 0.7, changeFreq: "weekly" }),
  // url("/roadmap",   { priority: 0.7, changeFreq: "weekly" }),
  url("/blog",      { priority: 0.8, changeFreq: "weekly" }),
  url("/frequently-asked-questions", { priority: 0.8, changeFreq: "monthly" }),

  // ── Legal ──
  url("/privacy",               { priority: 0.4, changeFreq: "yearly" }),
  url("/terms-of-service",      { priority: 0.4, changeFreq: "yearly" }),
  url("/terms-and-conditions",  { priority: 0.4, changeFreq: "yearly" }),

  // ── Auth ── (indexed so Google understands the funnel)
  url("/sign-in",  { priority: 0.5, changeFreq: "yearly" }),
  url("/sign-up",  { priority: 0.6, changeFreq: "yearly" }),
];

// ─── Docs Pages ───────────────────────────────────────────────────────────────
// Docs rank on long-tail queries ("how to route email to Slack", etc.)
// Keep them at high priority so Googlebot crawls them eagerly.

const DOCS_PAGES: SitemapEntry[] = [
  url("/docs",                          { priority: 0.9, changeFreq: "weekly" }),
  url("/docs/domains",                  { priority: 0.8, changeFreq: "monthly" }),
  // url("/docs/integrations",             { priority: 0.8, changeFreq: "monthly" }),
  url("/docs/integrations/slack",       { priority: 0.8, changeFreq: "monthly" }),
  // url("/docs/integrations/discord",     { priority: 0.7, changeFreq: "monthly" }),
  url("/docs/aliases",                  { priority: 0.8, changeFreq: "monthly" }),
  url("/docs/tickets",                  { priority: 0.7, changeFreq: "monthly" }),
  url("/docs/chatbot",                  { priority: 0.7, changeFreq: "monthly" }),
  // url("/docs/api",                      { priority: 0.7, changeFreq: "monthly" }),
];

// ─── Dynamic: Public workspace landing pages (future) ─────────────────────────
// If you ever add public-facing workspace pages, fetch them here.

async function getWorkspacePages(): Promise<SitemapEntry[]> {
  try {
    await dbConnect();

    // Only index workspaces that have opted into a public profile (future flag).
    // For now this is a no-op placeholder — returns [] safely.
    const workspaces = await Workspace.find({ publicProfile: true })
      .select("slug updatedAt")
      .limit(5000)
      .lean();

    return workspaces.map((ws: any) =>
      url(`/w/${ws.slug}`, {
        priority: 0.6,
        changeFreq: "weekly",
        lastMod: new Date(ws.updatedAt),
      })
    );
  } catch {
    // Never let sitemap crash the build
    console.warn("⚠️  sitemap: could not fetch workspace pages");
    return [];
  }
}

async function getBlogPages(): Promise<SitemapEntry[]> {
  try {
    const posts = await getAllPosts(100);
    return posts.map((post) =>
      url(`/blog/${post.slug}`, {
        priority: 0.7,
        changeFreq: "weekly",
        lastMod: new Date(post.publishedAt),
      })
    );
  } catch {
    console.warn("⚠️  sitemap: could not fetch blog posts");
    return [];
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [workspacePages, blogPages] = await Promise.all([
    getWorkspacePages(),
    getBlogPages(), 
  ]);

  const allRoutes: MetadataRoute.Sitemap = [
    ...MARKETING_PAGES,
    ...DOCS_PAGES,
    ...blogPages,
    ...workspacePages,
  ];

  // ── Debug log (visible in Vercel build logs) ──
  console.log(`✅ sitemap: ${allRoutes.length} URLs`);
  console.log(`   Marketing : ${MARKETING_PAGES.length}`);
  console.log(`   Docs      : ${DOCS_PAGES.length}`);
  console.log(`   Workspaces: ${workspacePages.length}`);

  return allRoutes;
}