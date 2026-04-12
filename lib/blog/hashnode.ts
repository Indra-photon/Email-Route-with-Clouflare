// ─── Hashnode GraphQL Client ──────────────────────────────────────────────────
// Fetches blog content from Hashnode headless CMS
// All content renders at syncsupport.app/blog — full SEO credit to your domain

const GQL_ENDPOINT = "https://gql.hashnode.com";

// ⚠️ Replace with your actual Hashnode publication host
// e.g. "syncsupport.hashnode.dev"
const PUBLICATION_HOST =
  process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST ||
  "syncsupport.hashnode.dev";

async function fetchHashnode<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(GQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 }, // ISR — revalidate every hour
  });

  if (!res.ok) throw new Error(`Hashnode API error: ${res.status}`);
  const { data, errors } = await res.json();
  if (errors) throw new Error(errors[0]?.message ?? "GraphQL error");
  return data;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type PostEdge = {
  node: Post;
};

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
    publication: { posts: { edges: PostEdge[] } };
  }>(
    `query GetPosts($host: String!, $first: Int!) {
      publication(host: $host) {
        posts(first: $first) {
          edges {
            node { ${POST_LIST_FIELDS} }
          }
        }
      }
    }`,
    { host: PUBLICATION_HOST, first }
  );
  return data.publication.posts.edges.map((e) => e.node);
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
  return data.publication.post ?? null;
}

// Get all slugs (for generateStaticParams)
export async function getAllSlugs(): Promise<string[]> {
  const posts = await getAllPosts(100);
  return posts.map((p) => p.slug);
}