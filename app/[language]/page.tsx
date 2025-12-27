import { Metadata } from "next";

import { BlogContextProvider } from "../../components/BlogContextProvider";
import { NotFoundLayout } from "../../components/layouts/NotFoundLayout";
import { IndexPosts } from "../../components/pages/IndexPosts";
import { getAllFilesFrontMatter } from "../../lib/mdx";
import { PostIface } from "../../lib/PostIface";
import websiteJson from "../../website.json";

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

  return {
    title,
    description,
    authors: [{ name: author }],
    openGraph: {
      type: "website",
      locale,
      url: siteUrl,
      title,
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

export default async function LangHome(props: {
  params: Promise<{ language: string }>;
}) {
  const params = await props.params;
  let filteredPosts: PostIface[];
  if (params.language !== "ja") {
    filteredPosts = null;
  } else {
    const posts = await getAllFilesFrontMatter(params.language);
    filteredPosts = posts && posts.slice(0, websiteJson.maxPosts);
  }
  return (
    <BlogContextProvider language={params.language}>
      {filteredPosts ? (
        <IndexPosts posts={filteredPosts} />
      ) : (
        <NotFoundLayout language={params.language} />
      )}
    </BlogContextProvider>
  );
}
