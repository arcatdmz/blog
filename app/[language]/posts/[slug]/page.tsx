import { Metadata } from "next";

import { BlogContextProvider } from "../../../../components/BlogContextProvider";
import { NotFoundLayout } from "../../../../components/layouts/NotFoundLayout";
import { Post } from "../../../../components/pages/Post";
import {
  formatSlug,
  getAllFilesFrontMatter,
  getFileBySlug,
  getFiles
} from "../../../../lib/mdx";
import websiteJson from "../../../../website.json";

export async function generateStaticParams() {
  const languages = Object.keys(websiteJson.languages).filter(
    l => l !== "default"
  );
  const paths: { language: string; slug: string }[] = [];
  await Promise.all(
    languages.map(async language => {
      const posts = await getFiles(language);
      posts.forEach(post => paths.push({ language, slug: formatSlug(post) }));
    })
  );
  return paths;
}

export async function generateMetadata(props: {
  params: Promise<{ language: string; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = await getFileBySlug(params.slug, params.language);
  const { title, date, tags, coverImage, summary } = post.frontMatter;
  const langConfig =
    websiteJson.languages[params.language] || websiteJson.languages.default;
  const { siteUrl, locale, author, bannerUrl } = langConfig;
  const url = `${siteUrl}posts/${params.slug}/`;
  const imageUrl =
    (coverImage && `${websiteJson.imageRoot}${coverImage}`) || bannerUrl;

  return {
    title,
    description: summary || langConfig.description,
    authors: [{ name: author }],
    openGraph: {
      type: "article",
      locale,
      url,
      title,
      description: summary || langConfig.description,
      publishedTime: date,
      tags: tags || [],
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            alt: title
          }
        ]
      })
    }
  };
}

export default async function PostPage(props: {
  params: Promise<{ language: string; slug: string }>;
}) {
  const params = await props.params;
  const allPosts = await getAllFilesFrontMatter(params.language);
  const postIndex = allPosts.findIndex(post => post.slug === params.slug);
  const prev = allPosts[postIndex + 1] || null;
  const next = allPosts[postIndex - 1] || null;
  const post = await getFileBySlug(params.slug, params.language);
  return (
    <BlogContextProvider language={params.language}>
      {post ? (
        <Post
          post={post}
          prev={prev}
          next={next}
          language={params.language}
          sourceRoot={websiteJson.sourceRoot}
        />
      ) : (
        <NotFoundLayout language={params.language} />
      )}
    </BlogContextProvider>
  );
}
