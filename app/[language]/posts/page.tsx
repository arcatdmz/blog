import fs from "fs";
import { Metadata } from "next";
import path from "path";

import { BlogContextProvider } from "../../../components/BlogContextProvider";
import { Posts } from "../../../components/pages/Posts";
import { generateRss } from "../../../lib/generate-rss";
import { getAllFilesFrontMatter } from "../../../lib/mdx";
import websiteJson from "../../../website.json";

const root = process.cwd();

export async function generateStaticParams() {
  const languages = Object.keys(websiteJson.languages).filter(
    l => l !== "default"
  );
  return languages.map(language => ({ language }));
}

export async function generateMetadata(props: {
  params: Promise<{ language: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const langConfig =
    websiteJson.languages[params.language] || websiteJson.languages.default;
  const { siteUrl, locale, author, title, description, bannerUrl } = langConfig;
  const url = `${siteUrl}posts/`;
  const postsTitle =
    params.language === "ja" ? "日本語の投稿" : "English posts";

  return {
    title: postsTitle,
    description,
    authors: [{ name: author }],
    openGraph: {
      type: "website",
      locale,
      url,
      title: postsTitle,
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

export default async function PostsPage(props: {
  params: Promise<{ language: string }>;
}) {
  const params = await props.params;
  const posts = await getAllFilesFrontMatter(params.language);
  const rss = generateRss(posts, { path: `/${params.language}/index.xml`, language: params.language });
  const rssPath = path.join(root, "public", params.language);
  fs.mkdirSync(rssPath, { recursive: true });
  fs.writeFileSync(path.join(rssPath, "index.xml"), rss);
  return (
    <BlogContextProvider language={params.language}>
      <Posts posts={posts} />
    </BlogContextProvider>
  );
}
