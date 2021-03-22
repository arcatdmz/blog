import fs from "fs";
import path from "path";
import { GetStaticProps, NextPage } from "next";

import { Posts } from "../components/pages/Posts";
import { generateRss } from "../lib/generate-rss";
import { getAllFilesFrontMatter } from "../lib/mdx";
import { PostIface } from "../lib/PostIface";

const root = process.cwd();

interface PageProps {
  posts: PostIface[];
}

const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const posts = await getAllFilesFrontMatter();

  // Write RSS file
  const rssPath = path.join(root, "public", "index.xml");
  const rss = generateRss(posts);
  fs.writeFileSync(rssPath, rss);

  return { props: { posts } };
};

const PostsPage: NextPage<PageProps> = ({ posts }) => {
  return <Posts posts={posts} />;
};

export { getStaticProps };
export default PostsPage;
