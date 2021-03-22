import { GetStaticProps, NextPage } from "next";
import { IndexPosts } from "../components/pages/IndexPosts";

import { getAllFilesFrontMatter } from "../lib/mdx";
import { PostIface } from "../lib/PostIface";

import websiteJson from "../website.json";

interface PageProps {
  posts: PostIface[];
}

const getStaticProps: GetStaticProps<PageProps> = async () => {
  const posts = await getAllFilesFrontMatter();
  return { props: { posts } };
};

const Home: NextPage<PageProps> = ({ posts }) => {
  const filteredPosts = posts && posts.slice(0, websiteJson.maxPosts);
  return <IndexPosts posts={filteredPosts} />;
};

export { getStaticProps };
export default Home;
