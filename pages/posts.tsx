import fs from "fs";
import path from "path";
import { GetStaticProps, NextPage } from "next";

import { ListLayout } from "../components/ListLayout";
import { PageSeo } from "../components/SEO";
import { generateRss } from "../lib/generate-rss";
import { getAllFilesFrontMatter } from "../lib/mdx";
import { PostIface } from "../lib/PostIface";

import websiteJson from "../website.json";

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

const Posts: NextPage<PageProps> = ({ posts }) => {
  return (
    <>
      <PageSeo
        title={`すべての投稿 - ${websiteJson.title}`}
        description={`すべての投稿 - ${websiteJson.title}`}
        url={websiteJson.siteUrl}
      />
      <ListLayout posts={posts} title="すべての投稿" />
    </>
  );
};

export { getStaticProps };
export default Posts;
