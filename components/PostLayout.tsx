import Link from "next/link";
import { FC, Fragment, useMemo } from "react";
import {
  Container,
  Divider,
  Icon,
  List,
  Menu,
  Segment
} from "semantic-ui-react";

import websiteJson from "../website.json";
import { PostIface } from "../lib/PostIface";

import { Date } from "./Date";
import { PageTitle } from "./PageTitle";
import { BlogSeo } from "./SEO";
import { Tag } from "./Tag";

interface PostLayoutProps {
  frontMatter: PostIface;
  next?: PostIface;
  prev?: PostIface;
}

const PostLayout: FC<PostLayoutProps> = ({
  children,
  frontMatter,
  next,
  prev
}) => {
  const { slug, date, title, tags } = frontMatter;

  const tagComponents = useMemo(() => {
    if (!tags) {
      return null;
    }
    const elems: JSX.Element[] = [];
    tags.forEach((tag, i) => {
      elems.push(
        <Tag key={tag} text={tag} />,
        <Fragment key={i}>{", "}</Fragment>
      );
    });
    elems.pop();
    return <List.Item>filed under {elems}</List.Item>;
  }, [tags]);

  return (
    <Container id="main">
      <BlogSeo url={`${websiteJson.siteUrl}/posts/${slug}`} {...frontMatter} />
      <article>
        <header>
          <PageTitle>{title}</PageTitle>
        </header>
        <List horizontal divided>
          <List.Item>
            by <strong>{websiteJson.author}</strong>
          </List.Item>
          <List.Item>
            posted on{" "}
            <strong>
              <Date value={date} />
            </strong>
          </List.Item>
          {tagComponents}
        </List>
        <Segment>{children}</Segment>
        <Divider />
        <footer>
          <Menu stackable>
            {prev && (
              <Link href={`/posts/${prev.slug}`}>
                <Menu.Item as="a" href={`/posts/${prev.slug}`}>
                  <Icon name="angle left" />
                  {prev.title}
                </Menu.Item>
              </Link>
            )}
            {next && (
              <Link href={`/posts/${next.slug}`}>
                <Menu.Item as="a" href={`/posts/${next.slug}`}>
                  <Icon name="angle right" />
                  {next.title}
                </Menu.Item>
              </Link>
            )}
            <Link href="/">
              <Menu.Item as="a" href="/" position="right">
                <Icon name="angle up" />
                ブログのトップへ
              </Menu.Item>
            </Link>
          </Menu>
        </footer>
      </article>
    </Container>
  );
};

export { PostLayout };
