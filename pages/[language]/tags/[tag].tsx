import fs from "fs";
import path from "path";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useContext } from "react";

import websiteJson from "../../../website.json";
import { TaggedPosts } from "../../../components/pages/TaggedPosts";
import { BlogContext } from "../../../lib/BlogContext";
import { generateRss } from "../../../lib/generate-rss";
import { getAllFilesFrontMatter } from "../../../lib/mdx";
import { PostIface } from "../../../lib/PostIface";
import { getAllTags } from "../../../lib/tags";
import { kebabCase } from "../../../lib/utils";

const root = process.cwd();

interface PageProps {
  posts: PostIface[];
  tag: string;
  language: string;
}

const getStaticPaths: GetStaticPaths = async () => {
  const languages = Object.keys(websiteJson.languages).filter(
    language => language !== "default"
  );
  const paths: {
    params: {
      language: string;
      tag: string;
    };
  }[] = [];

  await Promise.all(
    languages.map(async language => {
      const tags = await getAllTags(language);
      Object.keys(tags).forEach(tag =>
        paths.push({
          params: {
            language,
            tag
          }
        })
      );
    })
  );

  return {
    paths,
    fallback: false
  };
};

const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const language = params.language as string;
  const tag = params.tag as string;

  // Filter posts
  const posts = (await getAllFilesFrontMatter(language)).filter(
    post =>
      post.draft !== true && post.tags.map(t => kebabCase(t)).includes(tag)
  );

  // Write RSS file
  const rss = generateRss(posts, {
    path: `tags/${params.tag}/index.xml`,
    language
  });
  const rssPath = path.join(root, "public", language, "tags", tag);
  fs.mkdirSync(rssPath, { recursive: true });
  fs.writeFileSync(path.join(rssPath, "index.xml"), rss);

  return { props: { posts, tag, language } };
};

const Tag: NextPage<PageProps> = ({ posts, tag, language }) => {
  const currentContext = useContext(BlogContext);

  return (
    <BlogContext.Provider
      value={{
        ...currentContext,
        language,
        ...websiteJson.languages[language]
      }}
    >
      <TaggedPosts posts={posts} tag={tag} />
    </BlogContext.Provider>
  );
};

export { getStaticPaths, getStaticProps };
export default Tag;
