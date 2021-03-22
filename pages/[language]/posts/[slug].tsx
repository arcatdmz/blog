import { GetStaticPaths, GetStaticProps, NextPage } from "next";

import websiteJson from "../../../website.json";
import { Post, PostProps } from "../../../components/pages/Post";
import { BlogContext } from "../../../lib/BlogContext";
import {
  getFiles,
  getFileBySlug,
  getAllFilesFrontMatter,
  formatSlug
} from "../../../lib/mdx";

interface PageProps extends PostProps {
  language: string;
}

const getStaticPaths: GetStaticPaths = async () => {
  const languages = Object.keys(websiteJson.languages).filter(
    language => language !== "default"
  );
  const paths: {
    params: {
      language: string;
      slug: string;
    };
  }[] = [];

  await Promise.all(
    languages.map(async language => {
      const posts = await getFiles(language);
      posts.forEach(post =>
        paths.push({
          params: {
            language,
            slug: formatSlug(post)
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
  const allPosts = await getAllFilesFrontMatter(language);
  const postIndex = allPosts.findIndex(post => post.slug === params.slug);
  const prev = allPosts[postIndex + 1] || null;
  const next = allPosts[postIndex - 1] || null;
  const post = await getFileBySlug(params.slug as string, language);
  return { props: { post, prev, next, language } };
};

const PostPage: NextPage<PageProps> = ({ post, prev, next, language }) => {
  return (
    <BlogContext.Provider
      value={{
        language,
        ...websiteJson.languages[language]
      }}
    >
      <Post {...{ post, prev, next }} />
    </BlogContext.Provider>
  );
};

export { getStaticPaths, getStaticProps };
export default PostPage;
