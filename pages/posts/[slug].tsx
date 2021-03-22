import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { MdxRemote } from "next-mdx-remote/types";

import { Post } from "../../components/pages/Post";
import {
  getFiles,
  getFileBySlug,
  getAllFilesFrontMatter,
  formatSlug
} from "../../lib/mdx";
import { PostIface } from "../../lib/PostIface";

interface PageProps {
  post: {
    mdxSource: MdxRemote.Source;
    frontMatter: PostIface;
  };
  prev?: PostIface;
  next?: PostIface;
}

const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getFiles();

  return {
    paths: posts.map(p => ({
      params: {
        slug: formatSlug(p)
      }
    })),
    fallback: false
  };
};

const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const allPosts = await getAllFilesFrontMatter();
  const postIndex = allPosts.findIndex(post => post.slug === params.slug);
  const prev = allPosts[postIndex + 1] || null;
  const next = allPosts[postIndex - 1] || null;
  const post = await getFileBySlug(params.slug as string);
  return { props: { post, prev, next } };
};

const PostPage: NextPage<PageProps> = Post;

export { getStaticPaths, getStaticProps };
export default PostPage;
