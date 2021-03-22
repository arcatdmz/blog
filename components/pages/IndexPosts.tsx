import Link from "next/link";
import { FC, useContext } from "react";
import { Divider, Icon, Menu } from "semantic-ui-react";

import { BlogContext } from "../../lib/BlogContext";
import { PostIface } from "../../lib/PostIface";

import { LayoutWrapper } from "../layouts/LayoutWrapper";
import { ListLayout } from "../layouts/ListLayout";
import { PageSeo } from "../SEO";

interface IndexPostsPageProps {
  posts: PostIface[];
}

const IndexPosts: FC<IndexPostsPageProps> = ({ posts }) => {
  const { title, description, siteUrl, language, maxPosts } = useContext(
    BlogContext
  );
  return (
    <LayoutWrapper>
      <PageSeo title={title} description={description} url={siteUrl} />
      <ListLayout
        posts={posts}
        title={language === "ja" ? "最新の投稿 5 件" : "Latest 5 posts"}
        searchEnabled={false}
      >
        {posts.length > maxPosts && (
          <>
            <Divider />
            <footer>
              <Menu stackable>
                <Link href="/posts">
                  <Menu.Item as="a" href="/posts" position="right">
                    <Icon name="angle down" />
                    {language === "ja" ? "すべての投稿を見る" : "See all posts"}
                  </Menu.Item>
                </Link>
              </Menu>
            </footer>
          </>
        )}
      </ListLayout>
    </LayoutWrapper>
  );
};

export { IndexPosts };
