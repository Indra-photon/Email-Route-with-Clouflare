import { getAllPosts } from "@/lib/blog/hashnode"
import { NavBar } from "./NavBar"

export async function NavBarServer(props: React.ComponentProps<typeof NavBar>) {
  const posts = await getAllPosts(6)
  return <NavBar {...props} initialBlogPosts={posts} />
}
