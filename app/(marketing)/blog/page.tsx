import { getAllPosts, type Post } from "@/lib/blog/hashnode";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { CustomLink } from "@/components/CustomLink";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-200"
    >
      {/* Cover image */}
      {post.coverImage?.url && (
        <div className="relative h-48 w-full overflow-hidden rounded-xl bg-neutral-100">
          <Image
            src={post.coverImage.url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
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
      <Heading
        as="h2"
        variant="small"
        className="text-neutral-900 group-hover:text-sky-800 transition-colors leading-snug"
      >
        {post.title}
      </Heading>

      {/* Brief */}
      <Paragraph variant="muted" className="text-neutral-600 line-clamp-2">
        {post.brief}
      </Paragraph>

      {/* Meta */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
        <div className="flex items-center gap-2">
          {post.author.profilePicture && (
            <Image
              src={post.author.profilePicture}
              alt={post.author.name}
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          <span className="text-xs font-schibsted text-neutral-500">
            {post.author.name}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-schibsted text-neutral-400">
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span>{post.readTimeInMinutes} min read</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Featured Post (first post, larger) ──────────────────────────────────────

function FeaturedPost({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-1 md:grid-cols-2 gap-8 rounded-2xl border border-neutral-200 bg-white p-8 transition-all duration-200"
    >
      {/* Cover image */}
      {post.coverImage?.url && (
        <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-xl ">
        <Image
            src={post.coverImage.url}
            alt={post.title}
            fill
            style={{ objectFit: "contain" }}
            priority
        />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col justify-center gap-4">
        <span className="text-xs font-semibold font-schibsted uppercase tracking-widest text-sky-600">
          Featured
        </span>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.slug}
                className="rounded-full bg-sky-50 px-3 py-0.5 text-xs font-semibold font-schibsted text-sky-700 border border-sky-100"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <Heading
          variant="blogHeader"
          as="h1"
          className="text-neutral-900 leading-tighter"
        >
          {post.title}
        </Heading>

        <Paragraph className="text-neutral-600">{post.brief}</Paragraph>

        <div className="flex flex-col gap-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-3 text-xs font-schibsted text-neutral-400">
            {post.author.profilePicture && (
              <Image
                src={post.author.profilePicture}
                alt={post.author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="text-neutral-500">{post.author.name}</span>
            <span>·</span>
            <span className="text-xs font-medium text-neutral-700">
                Founder, SyncSupport
              </span>
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
          {/* <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
            <span>{formatDate(post.publishedAt)}</span>
            <span>·</span>
            <span>{post.readTimeInMinutes} min read</span>
          </div> */}
        </div>
      </div>
    </Link>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="size-16 rounded-2xl bg-sky-50 flex items-center justify-center">
        <svg className="size-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>
      <Heading as="h3" variant="small" className="text-neutral-900">
        No posts yet
      </Heading>
      <Paragraph variant="muted" className="text-neutral-500 max-w-sm">
        We're working on our first articles. Check back soon for guides on
        Slack support, helpdesk tips, and SaaS growth.
      </Paragraph>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPage() {
  const posts = await getAllPosts(20);
  const [featured, ...rest] = posts;

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* ── Hero ── */}
      <div className="bg-white border-b border-neutral-200">
        <Container className="py-16 md:py-20">
          <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-600 mb-4">
            SyncSupport Blog
          </p>
          <Heading as="h1" className="text-neutral-900 leading-tight mb-4">
            Guides for teams that{" "}
            <span className="text-sky-800 font-extralight">support customers from Slack.</span>
          </Heading>
          <Paragraph className="text-neutral-600">
            Practical tips on helpdesk workflows, Slack integrations, response
            time improvements, and growing a SaaS business without losing your
            mind.
          </Paragraph>
        </Container>
      </div>

      {/* ── Posts ── */}
      <Container className="py-12 md:py-16">
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-8">
            {/* Featured post */}
            {featured && <FeaturedPost post={featured} />}

            {/* Grid of remaining posts */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}
      </Container>

      <Footer />
    </div>
  );
}