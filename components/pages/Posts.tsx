import { FC, useContext } from "react";

import { BlogContext } from "../../lib/BlogContext";
import { PostIface } from "../../lib/PostIface";

import { PageSeo } from "../SEO";
import { LayoutWrapper } from "../layouts/LayoutWrapper";
import { ListLayout } from "../layouts/ListLayout";

interface PostsProps {
  posts: PostIface[];
}

const Posts: FC<PostsProps> = ({ posts }) => {
  const blog = useContext(BlogContext);
  const text = blog.language === "ja" ? "日本語の投稿" : "English posts";
  return (
    <LayoutWrapper>
      <PageSeo
        title={`${text} - ${blog.title}`}
        description={blog.description}
        url={blog.siteUrl}
      />
      <ListLayout posts={posts} title={text} />
    </LayoutWrapper>
  );
};

export { Posts };
