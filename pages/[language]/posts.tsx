import fs from "fs";
import path from "path";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";

import websiteJson from "../../website.json";
import { Posts } from "../../components/pages/Posts";
import { BlogContext } from "../../lib/BlogContext";
import { generateRss } from "../../lib/generate-rss";
import { getAllFilesFrontMatter } from "../../lib/mdx";
import { PostIface } from "../../lib/PostIface";

const root = process.cwd();

interface PageProps {
  posts: PostIface[];
  language: string;
}

const getStaticPaths: GetStaticPaths = async () => {
  const languages = Object.keys(websiteJson.languages).filter(
    language => language !== "default"
  );
  return {
    paths: languages.map(language => ({
      params: {
        language
      }
    })),
    fallback: false
  };
};

const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const language = params.language as string;
  const posts = await getAllFilesFrontMatter(language);

  // Write RSS file
  const rss = generateRss(posts, { path: `${language}/index.xml`, language });
  const rssPath = path.join(root, "public", language);
  fs.mkdirSync(rssPath, { recursive: true });
  fs.writeFileSync(path.join(rssPath, "index.xml"), rss);

  return { props: { posts, language } };
};

const PostsPage: NextPage<PageProps> = ({ posts, language }) => {
  return (
    <BlogContext.Provider
      value={{
        language,
        ...websiteJson.languages[language]
      }}
    >
      <Posts posts={posts} />
    </BlogContext.Provider>
  );
};

export { getStaticPaths, getStaticProps };
export default PostsPage;
