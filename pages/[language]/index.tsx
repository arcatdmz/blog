import { GetStaticPaths, GetStaticProps, NextPage } from "next";

import websiteJson from "../../website.json";
import { IndexPosts } from "../../components/pages/IndexPosts";
import { BlogContext } from "../../lib/BlogContext";
import { getAllFilesFrontMatter } from "../../lib/mdx";
import { PostIface } from "../../lib/PostIface";

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
  return { props: { posts, language } };
};

const Home: NextPage<PageProps> = ({ posts, language }) => {
  const filteredPosts = posts && posts.slice(0, websiteJson.maxPosts);

  return (
    <BlogContext.Provider
      value={{
        language,
        ...websiteJson.languages[language]
      }}
    >
      <IndexPosts posts={filteredPosts} />
    </BlogContext.Provider>
  );
};

export { getStaticPaths, getStaticProps };
export default Home;
