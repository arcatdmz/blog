import fs from "fs";
import path from "path";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";

import { ListLayout } from "../../components/ListLayout";
import { PageSeo } from "../../components/SEO";
import { generateRss } from "../../lib/generate-rss";
import { getAllFilesFrontMatter } from "../../lib/mdx";
import { PostIface } from "../../lib/PostIface";
import { getAllTags } from "../../lib/tags";
import { kebabCase } from "../../lib/utils";

import websiteJson from "../../website.json";

const root = process.cwd();

interface PageProps {
  posts: PostIface[];
  tag: string;
}

const getStaticPaths: GetStaticPaths = async () => {
  const tags = await getAllTags();

  return {
    paths: Object.keys(tags).map(tag => ({
      params: {
        tag
      }
    })),
    fallback: false
  };
};

const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const tag = params.tag as string;

  // Filter posts
  const posts = (await getAllFilesFrontMatter()).filter(
    post =>
      post.draft !== true && post.tags.map(t => kebabCase(t)).includes(tag)
  );

  // Write RSS file
  const rss = generateRss(posts, `tags/${params.tag}/index.xml`);
  const rssPath = path.join(root, "public", "tags", tag);
  fs.mkdirSync(rssPath, { recursive: true });
  fs.writeFileSync(path.join(rssPath, "index.xml"), rss);

  return { props: { posts, tag } };
};

const Tag: NextPage<PageProps> = ({ posts, tag }) => {
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(" ").join("-").slice(1);

  return (
    <>
      <PageSeo
        title={`${title} - ${websiteJson.title}`}
        description={`Posts tagged with ${tag} - ${websiteJson.title}`}
        url={`${websiteJson.siteUrl}/tags/${tag}`}
      />
      <ListLayout posts={posts} title={title} />
    </>
  );
};

export { getStaticPaths, getStaticProps };
export default Tag;
