"use client";

import { FC, useContext } from "react";

import { BlogContext } from "../../lib/BlogContext";
import { PostIface } from "../../lib/PostIface";
import { BaseLayout } from "../layouts/BaseLayout";
import { ListLayout } from "../layouts/ListLayout";

interface PostsProps {
  posts: PostIface[];
  tag: string;
}

const TaggedPosts: FC<PostsProps> = ({ posts, tag }) => {
  const { language } = useContext(BlogContext);
  const text =
    language === "ja" ? "タグ付けされた投稿: " : "Posts tagged with ";

  return (
    <BaseLayout>
      <ListLayout posts={posts} title={`${text}"${tag}"`} />
    </BaseLayout>
  );
};

export { TaggedPosts };
