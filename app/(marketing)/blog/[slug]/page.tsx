import { getPostBySlug, getAllSlugs } from "@/lib/blog/hashnode";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { CustomLink } from "@/components/CustomLink";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconArrowUp } from "@tabler/icons-react";

// ─── Use dynamic rendering — don't fail build if API is unreachable ───────────
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 3600;

// ─── Static generation (safe — returns [] if API fails) ──────────────────────
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  console.log("🔵 getAllSlugs result:", slugs); 
  return slugs.map((slug) => ({ slug }));
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found — SyncSupport Blog" };

  const keywords = post.tags?.map((tag) => tag.name.toLowerCase()) ?? [];
  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.brief;
  const url = `https://www.syncsupport.app/blog/${post.slug}`;
  const image = post.coverImage?.url || "/images/og-image.png";

  return {
    title,
    description,
    keywords, 
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@syncsupportapp",
      title,
      description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="bg-white min-h-screen">

      {/* ── Back link ── */}
      <Container className="pt-8">
        <CustomLink
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-sky-700 transition-colors"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All posts
        </CustomLink>
      </Container>

      {/* ── Hero ── */}
      <Container className="pt-8 pb-0 max-w-3xl mx-auto">

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag.slug}
                className="rounded-full bg-sky-50 px-3 py-0.5 text-xs font-semibold text-sky-700 border border-sky-100"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Heading as="h1" className="text-neutral-900 leading-tight mb-6">
          {post.title}
        </Heading>

        {/* Meta row */}
        {/* Meta row */}
      <div className="flex items-center gap-4 pb-8 border-b border-neutral-200">
        {post.author.profilePicture && (
          <Image
            src={post.author.profilePicture}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-neutral-700">
              {post.author.name}{" "}
            </p>
            <span className="text-sm font-medium text-neutral-500">
              Founder, SyncSupport
            </span>
            {/* Social links */}
            <a
              href="https://x.com/Nil_phy_dreamer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/indranil-maiti-7542941b7/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-neutral-400 hover:text-sky-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            {formatDate(post.publishedAt)} · {post.readTimeInMinutes} min read
          </p>
        </div>
      </div>
      </Container>

      {/* ── Cover image ── */}
      {post.coverImage?.url && (
        <Container className="py-8 border-b border-neutral-200 mb-8">
          <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-2xl">
            <Image
              src={post.coverImage.url}
              alt={post.title}
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </Container>
      )}

      {/* ── Content ── */}
      <Container className="pb-16 max-w-3xl mx-auto">
        <div
          className="
            prose prose-neutral max-w-none
            prose-headings:font-semibold prose-headings:text-neutral-900
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-neutral-700 prose-p:leading-relaxed
            prose-a:text-sky-700 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-neutral-900
            prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-sky-800
            prose-pre:bg-neutral-900 prose-pre:rounded-xl prose-pre:p-5
            prose-img:rounded-xl
            prose-blockquote:border-sky-300 prose-blockquote:bg-sky-50 prose-blockquote:rounded-r-xl
            prose-li:text-neutral-700
          "
          dangerouslySetInnerHTML={{ __html: post.content.html }}
        />
      </Container>

      {/* ── CTA Banner ── */}
      <div className="border-t border-neutral-200 bg-neutral-50">
        <Container className="py-16 text-center">
          <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-600 mb-4">
            Ready to get started?
          </p>
          <Heading as="h2" className="text-neutral-900 font-light tracking-tighter leading-tight mb-4">
            Handle customer support{" "}
            <span className="text-sky-800">without leaving Slack.</span>
          </Heading>
          <Paragraph variant="home-par" className="text-neutral-600 mb-8">
            Join teams who route their customer support through Slack.
            Five minutes to set up. No per-user fees.
          </Paragraph>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Get Started — black button */}
            <div className="bg-gradient-to-b from-white/20 to-transparent rounded-[16px] inline-flex">
              <Link href="/sign-up" className="block">
                <button className="group p-[4px] rounded-[12px] bg-gradient-to-b from-zinc-700 to-black shadow-[0_1px_2px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]">
                  <div className="bg-gradient-to-b from-white/[0.08] to-transparent rounded-[8px] px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-schibsted font-semibold tracking-wide uppercase text-white text-sm">Get started</span>
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <span className="absolute inset-0 rounded-full bg-white/0 backdrop-blur-0 group-hover:bg-white/20 group-hover:backdrop-blur-sm transition-all duration-150 ease-out" />
                        <IconArrowUp size={13} stroke={2.5} className="relative text-white rotate-90 transition-transform duration-100 ease-out group-hover:rotate-45" />
                      </div>
                    </div>
                  </div>
                </button>
              </Link>
            </div>

            {/* View Pricing — white button */}
            <div className="rounded-[16px] inline-flex">
              <Link href="/pricing" className="block">
                <button className="group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]">
                  <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-4 py-[6px]">
                    <span className="font-schibsted font-semibold tracking-wide uppercase text-neutral-900 text-sm">View pricing</span>
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <Footer />
    </div>
  );
}