import Link from "next/link";
import { FC, useContext } from "react";
import {
  Divider,
  Grid,
  Header,
  Icon,
  List,
  Menu,
  Segment
} from "semantic-ui-react";

import { BlogContext } from "../../lib/BlogContext";
import { PostIface } from "../../lib/PostIface";
import { About } from "../contents/About";
import { PostsForStudents } from "../contents/PostsForStudents";

import { BaseLayout } from "../layouts/BaseLayout";
import { ListLayout } from "../layouts/ListLayout";
import { PageSeo } from "../SEO";

interface IndexPostsPageProps {
  posts: PostIface[];
}

const IndexPosts: FC<IndexPostsPageProps> = ({ posts }) => {
  const { title, description, siteUrl, sitePath, language } =
    useContext(BlogContext);
  return (
    <BaseLayout showFooterMeta={false}>
      <PageSeo title={title} description={description} url={siteUrl} />
      <ListLayout
        posts={posts}
        header={
          language === "ja" ? (
            <>
              <Grid stackable columns={2}>
                <Grid.Column width={10}>
                  <article>
                    <Header as="h1">{title}</Header>
                    <About />
                  </article>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Segment as="article">
                    <PostsForStudents size="mini" />
                  </Segment>
                </Grid.Column>
              </Grid>
              <Header as="h2" dividing>
                最新の投稿 5 件
              </Header>
            </>
          ) : (
            <>
              <article>
                <Header as="h1">{title}</Header>
                <About />
              </article>
              <Header as="h2" dividing>
                Latest 5 posts
              </Header>
            </>
          )
        }
        searchEnabled={false}
      >
        <Divider />
        <footer>
          <Menu stackable>
            <Link href={`${sitePath}posts`} passHref legacyBehavior>
              <Menu.Item as="a" position="right">
                <Icon name="angle down" />
                {language === "ja" ? "すべての投稿を見る" : "See all posts"}
              </Menu.Item>
            </Link>
          </Menu>
        </footer>
      </ListLayout>
    </BaseLayout>
  );
};

export { IndexPosts };
