// ─── Hashnode GraphQL Client ──────────────────────────────────────────────────
// Fetches blog content from Hashnode headless CMS
// All content renders at syncsupport.app/blog — full SEO credit to your domain

const GQL_ENDPOINT = "https://gql.hashnode.com";

const PUBLICATION_HOST =
  process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST ||
  "syncsupport.hashnode.dev";

async function fetchHashnode<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T | null> {
  try {
    const res = await fetch(GQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Hashnode API error: ${res.status}`, errorBody);
      return null;
    }

    const json = await res.json();

    if (json.errors) {
      console.error("Hashnode GraphQL errors:", json.errors);
      return null;
    }

    return json.data as T;
  } catch (err) {
    console.error("Hashnode fetch failed:", err);
    return null;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type Post = {
  id: string;
  title: string;
  slug: string;
  brief: string;
  publishedAt: string;
  readTimeInMinutes: number;
  coverImage?: { url: string };
  tags?: { name: string; slug: string }[];
  author: {
    name: string;
    profilePicture?: string;
  };
};

export type PostFull = Post & {
  content: { html: string };
  seo?: { title?: string; description?: string };
};

// ─── Queries ──────────────────────────────────────────────────────────────────

const POST_LIST_FIELDS = `
  id
  title
  slug
  brief
  publishedAt
  readTimeInMinutes
  coverImage { url }
  tags { name slug }
  author { name profilePicture }
`;

// Get all posts (for listing page)
export async function getAllPosts(first = 20): Promise<Post[]> {
  const data = await fetchHashnode<{
    publication: { posts: { edges: { node: Post }[] } };
  }>(
    `query GetPosts($host: String!, $first: Int!) {
      publication(host: $host) {
        posts(first: $first) {
          edges {
            node {
              ${POST_LIST_FIELDS}
            }
          }
        }
      }
    }`,
    { host: PUBLICATION_HOST, first }
  );

  return data?.publication?.posts?.edges?.map((e) => e.node) ?? [];
}

// Get single post by slug
export async function getPostBySlug(slug: string): Promise<PostFull | null> {
  const data = await fetchHashnode<{
    publication: { post: PostFull | null };
  }>(
    `query GetPost($host: String!, $slug: String!) {
      publication(host: $host) {
        post(slug: $slug) {
          ${POST_LIST_FIELDS}
          content { html }
          seo { title description }
        }
      }
    }`,
    { host: PUBLICATION_HOST, slug }
  );

  return data?.publication?.post ?? null;
}

// Get all slugs (for generateStaticParams)
// Returns empty array safely if API fails — build won't break
export async function getAllSlugs(): Promise<string[]> {
  try {
    const posts = await getAllPosts(50);
    return posts.map((p) => p.slug);
  } catch {
    return [];
  }
}