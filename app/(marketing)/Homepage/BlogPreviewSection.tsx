import { getAllPosts, type Post } from "@/lib/blog/hashnode";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import Image from "next/image";
import Link from "next/link";
import { BlogPreviewHeading } from "./BlogPreviewHeading";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Left: Featured magazine-cover card ───────────────────────────────────────

function FeaturedCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col justify-end rounded-2xl border border-neutral-200 overflow-hidden bg-neutral-900 h-full min-h-[280px] md:min-h-[200px]"
    >
      {/* Cover image */}
      {post.coverImage?.url && (
        <Image
          src={post.coverImage.url}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500"
          priority
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content sits at the bottom */}
      <div className="relative z-10 p-6 flex flex-col gap-3">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.slug}
                className="rounded-full bg-white/15 backdrop-blur-sm px-3 py-0.5 text-xs font-semibold font-schibsted text-white/90 border border-white/20"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <Heading
          as="h3"
          variant="small"
          className="text-white leading-snug group-hover:text-sky-200 transition-colors"
        >
          {post.title}
        </Heading>

        {/* <p className="text-sm font-schibsted text-white/70 line-clamp-2 leading-relaxed">
          {post.brief}
        </p> */}

        {/* <div className="flex items-center gap-2 pt-2 border-t border-white/15">
          {post.author.profilePicture && (
            <Image
              src={post.author.profilePicture}
              alt={post.author.name}
              width={20}
              height={20}
              className="rounded-full opacity-90"
            />
          )}
          <span className="text-xs font-schibsted text-white/60">{post.author.name}</span>
          <span className="text-white/30 text-xs">·</span>
          <span className="text-xs font-schibsted text-white/50">{formatDate(post.publishedAt)}</span>
          <span className="text-white/30 text-xs">·</span>
          <span className="text-xs font-schibsted text-white/50">{post.readTimeInMinutes} min read</span>
        </div> */}
      </div>
    </Link>
  );
}

// ─── Right: Horizontal mini card ─────────────────────────────────────────────

function MiniCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-4 rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:border-neutral-300 transition-colors duration-200 h-full"
    >
      {/* Thumbnail */}
      {post.coverImage?.url ? (
        <div className="relative w-1/3 flex-shrink-0 bg-neutral-100 overflow-hidden">
          <Image
            src={post.coverImage.url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="w-32 flex-shrink-0 bg-neutral-100" />
      )}

      {/* Text */}
      <div className="flex flex-col justify-center gap-2 py-4 pr-5">
        {post.tags && post.tags.length > 0 && (
          <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold font-schibsted text-sky-700 border border-sky-100 self-start">
            {post.tags[0].name}
          </span>
        )}

        <Heading
          as="h4"
          variant="small"
          className="text-neutral-900 group-hover:text-sky-800 transition-colors leading-snug line-clamp-2 text-sm"
        >
          {post.title}
        </Heading>

        <p className="text-xs font-schibsted text-neutral-500 line-clamp-2 leading-relaxed">
          {post.brief}
        </p>

        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs font-schibsted text-neutral-400">{formatDate(post.publishedAt)}</span>
          <span className="text-neutral-300 text-xs">·</span>
          <span className="text-xs font-schibsted text-neutral-400">{post.readTimeInMinutes} min read</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Right: CTA row ───────────────────────────────────────────────────────────

function CTACard() {
  return (
    <div className="flex flex-col justify-center gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-6 h-full">
      <p className="font-schibsted text-sm md:text-xs font-semibold uppercase tracking-widest text-sky-800 text-left">
        Stay sharp
      </p>
      <Heading as="h4" variant="small" className="text-neutral-900 leading-snug">
        New guides on support, Slack workflows, and SaaS growth — every week.
      </Heading>
      <div className="rounded-[16px] inline-flex self-start">
        <Link href="/blog" className="block">
          <button className="group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]">
            <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-4 py-[5px] flex items-center gap-2">
              <span className="font-schibsted font-semibold tracking-wide uppercase text-neutral-900 text-sm">
                View all posts
              </span>
              <svg
                width="13" height="13" viewBox="0 0 13 13" fill="none"
                className="text-neutral-600 group-hover:translate-x-0.5 transition-transform duration-150"
              >
                <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export async function BlogPreviewSection() {
  const posts = await getAllPosts(3);
  if (posts.length === 0) return null;

  const [featured, second, third] = posts;

  return (
    <section className="w-full bg-white py-8 md:py-12">
      <Container className="px-4 md:px-0">

        {/* Eyebrow */}
        <p className="font-schibsted text-sm md:text-xs font-semibold uppercase tracking-widest text-sky-800 mb-4 text-left">
          From the blog
        </p>

        {/* Animated heading */}
        <BlogPreviewHeading />

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Left — featured card, spans all 3 rows */}
          <div className="md:row-span-3">
            <FeaturedCard post={featured} />
          </div>

          {/* Right row 1 — second post or CTA spanning all */}
          {second ? (
            <MiniCard post={second} />
          ) : (
            <div className="md:row-span-3">
              <CTACard />
            </div>
          )}

          {/* Right row 2 — third post or CTA spanning rows 2+3 */}
          {second && (
            third ? (
              <MiniCard post={third} />
            ) : (
              <div className="md:row-span-2">
                <CTACard />
              </div>
            )
          )}

          {/* Right row 3 — CTA (only when both second and third exist) */}
          {second && third && <CTACard />}

        </div>

      </Container>
    </section>
  );
}
