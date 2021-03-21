import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import hydrate from "next-mdx-remote/hydrate";
import { MdxRemote } from "next-mdx-remote/types";

import { MDXComponents } from "../../components/MDXComponents";
import { NotFoundLayout } from "../../components/NotFoundLayout";
import { PostLayout } from "../../components/PostLayout";
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

const Post: NextPage<PageProps> = ({ post, prev, next }) => {
  const { mdxSource, frontMatter } = post;
  const content = hydrate(mdxSource, {
    components: MDXComponents
  });
  return frontMatter.draft !== true ? (
    <PostLayout frontMatter={frontMatter} prev={prev} next={next}>
      {content}
    </PostLayout>
  ) : (
    <NotFoundLayout />
  );
};

export { getStaticPaths, getStaticProps };
export default Post;
