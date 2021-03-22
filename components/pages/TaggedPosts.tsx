import { FC, useContext } from "react";

import { BlogContext } from "../../lib/BlogContext";
import { PostIface } from "../../lib/PostIface";

import { PageSeo } from "../SEO";
import { LayoutWrapper } from "../layouts/LayoutWrapper";
import { ListLayout } from "../layouts/ListLayout";

interface PostsProps {
  posts: PostIface[];
  tag: string;
}

const TaggedPosts: FC<PostsProps> = ({ posts, tag }) => {
  const blog = useContext(BlogContext);
  const text =
    blog.language === "ja" ? "タグ付けされた投稿: " : "Posts tagged with ";

  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(" ").join("-").slice(1);

  return (
    <LayoutWrapper>
      <PageSeo
        title={`${text}"${tag}" - ${blog.title}`}
        description={blog.description}
        url={blog.siteUrl}
      />
      <ListLayout posts={posts} title={`${text}"${tag}"`} />
    </LayoutWrapper>
  );
};

export { TaggedPosts };
