import fs from "fs";
import { Metadata } from "next";
import path from "path";

import { BlogContextProvider } from "../../../components/BlogContextProvider";
import { TaggedPosts } from "../../../components/pages/TaggedPosts";
import { generateRss } from "../../../lib/generate-rss";
import { getAllFilesFrontMatter } from "../../../lib/mdx";
import { getAllTags } from "../../../lib/tags";
import { kebabCase } from "../../../lib/utils";
import websiteJson from "../../../website.json";

const root = process.cwd();

export async function generateStaticParams() {
  const tags = await getAllTags();
  return Object.keys(tags).map(tag => ({ tag }));
}

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { siteUrl, locale, author, title, description, bannerUrl } =
    websiteJson.languages.default;
  const url = `${siteUrl}tags/${params.tag}/`;
  const tagTitle = `Posts tagged with "${params.tag}"`;

  return {
    title: tagTitle,
    description,
    authors: [{ name: author }],
    openGraph: {
      type: "website",
      locale,
      url,
      title: tagTitle,
      description,
      ...(bannerUrl && {
        images: [
          {
            url: bannerUrl,
            alt: title,
            width: 1200,
            height: 600
          }
        ]
      })
    }
  };
}

export default async function Tag(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params;
  const tag = params.tag;
  const posts = (await getAllFilesFrontMatter()).filter(
    post =>
      post.draft !== true &&
      post.tags &&
      post.tags.map(t => kebabCase(t)).includes(tag)
  );
  const rss = generateRss(posts, { path: `tags/${tag}/index.xml` });
  const rssPath = path.join(root, "public", "tags", tag);
  fs.mkdirSync(rssPath, { recursive: true });
  fs.writeFileSync(path.join(rssPath, "index.xml"), rss);
  return (
    <BlogContextProvider language="default">
      <TaggedPosts posts={posts} tag={tag} />
    </BlogContextProvider>
  );
}
