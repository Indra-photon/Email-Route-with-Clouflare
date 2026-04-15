import { getAllPosts } from "@/lib/blog/hashnode"
import { NextResponse } from "next/server"

export async function GET() {
  const posts = await getAllPosts(6)
  return NextResponse.json(posts, {
    headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate" },
  })
}
