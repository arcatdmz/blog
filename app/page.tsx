import { BlogContextProvider } from "../components/BlogContextProvider";
import { IndexPosts } from "../components/pages/IndexPosts";
import { getAllFilesFrontMatter } from "../lib/mdx";
import websiteJson from "../website.json";

export default async function Page() {
  const posts = await getAllFilesFrontMatter();
  const filteredPosts = posts && posts.slice(0, websiteJson.maxPosts);
  return (
    <BlogContextProvider language="default">
      <IndexPosts posts={filteredPosts} />
    </BlogContextProvider>
  );
}
