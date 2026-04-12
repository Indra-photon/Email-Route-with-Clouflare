import { getPostBySlug, getAllSlugs, type PostFull } from "@/lib/blog/hashnode";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { CustomLink } from "@/components/CustomLink";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.brief;
  const url = `https://www.syncsupport.app/blog/${post.slug}`;
  const image = post.coverImage?.url || "/images/og-image.png";

  return {
    title,
    description,
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
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <div className="bg-white min-h-screen">

      {/* ── Back link ── */}
      <Container className="pt-8">
        <CustomLink
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-schibsted font-medium text-neutral-500 hover:text-sky-700 transition-colors"
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
                className="rounded-full bg-sky-50 px-3 py-0.5 text-xs font-semibold font-schibsted text-sky-700 border border-sky-100"
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
          <div>
            <p className="text-sm font-semibold font-schibsted text-neutral-900">
              {post.author.name}
            </p>
            <p className="text-xs font-schibsted text-neutral-400">
              {formatDate(post.publishedAt)} · {post.readTimeInMinutes} min read
            </p>
          </div>
        </div>
      </Container>

      {/* ── Cover image ── */}
      {post.coverImage?.url && (
        <Container className="py-8 max-w-3xl mx-auto">
          <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-2xl bg-neutral-100">
            <Image
              src={post.coverImage.url}
              alt={post.title}
              fill
              className="object-cover"
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
            prose-headings:font-schibsted prose-headings:font-semibold prose-headings:text-neutral-900
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-neutral-700 prose-p:leading-relaxed prose-p:font-schibsted
            prose-a:text-sky-700 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-neutral-900 prose-strong:font-semibold
            prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-sky-800
            prose-pre:bg-neutral-900 prose-pre:rounded-xl prose-pre:p-5
            prose-img:rounded-xl prose-img:shadow-sm
            prose-blockquote:border-sky-300 prose-blockquote:bg-sky-50 prose-blockquote:rounded-r-xl prose-blockquote:py-1
            prose-li:text-neutral-700 prose-li:font-schibsted
          "
          dangerouslySetInnerHTML={{ __html: post.content.html }}
        />
      </Container>

      {/* ── CTA Banner ── */}
      <div className="bg-neutral-900 border-t border-neutral-800">
        <Container className="py-16 max-w-3xl mx-auto text-center">
          <Heading as="h3" className="text-white mb-4">
            Run your support from Slack — starting at $19/mo.
          </Heading>
          <Paragraph className="text-neutral-400 mb-8">
            No per-seat fees. Route emails, embed live chat, reply with canned
            responses — all without leaving Slack.
          </Paragraph>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CustomLink
              href="/sign-up"
              className="px-7 py-3.5 bg-white text-neutral-900 font-schibsted font-semibold text-sm rounded-xl hover:bg-neutral-100 transition-colors"
            >
              Get started free
            </CustomLink>
            <CustomLink
              href="/pricing"
              className="px-7 py-3.5 border border-neutral-700 text-neutral-300 font-schibsted font-semibold text-sm rounded-xl hover:border-neutral-500 transition-colors"
            >
              View pricing
            </CustomLink>
          </div>
        </Container>
      </div>

      <Footer />
    </div>
  );
}