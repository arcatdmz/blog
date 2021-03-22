import Link from "next/link";
import { FC, Fragment, useContext, useMemo } from "react";
import {
  Container,
  Divider,
  Icon,
  List,
  Menu,
  Segment
} from "semantic-ui-react";

import { BlogContext } from "../../lib/BlogContext";
import { PostIface } from "../../lib/PostIface";

import { Date } from "../Date";
import { PageTitle } from "../PageTitle";
import { BlogSeo } from "../SEO";
import { Tag } from "../Tag";

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
  const { language, rootPath, siteUrl, sitePath, author } = useContext(
    BlogContext
  );
  const { slug, date, title, tags } = frontMatter;

  const tagComponents = useMemo(() => {
    if (!tags) {
      return null;
    }
    const elems: JSX.Element[] = [];
    tags.forEach((tag: string, i: number) => {
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
      <BlogSeo url={`${siteUrl}posts/${slug}`} {...frontMatter} />
      <article>
        <header>
          <PageTitle>{title}</PageTitle>
        </header>
        <List horizontal divided>
          <List.Item>
            by <strong>{author}</strong>
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
              <Link href={`${sitePath}posts/${prev.slug}`}>
                <Menu.Item as="a" href={`${sitePath}posts/${prev.slug}`}>
                  <Icon name="angle left" />
                  {prev.title}
                </Menu.Item>
              </Link>
            )}
            {next && (
              <Link href={`${sitePath}posts/${next.slug}`}>
                <Menu.Item as="a" href={`${sitePath}posts/${next.slug}`}>
                  <Icon name="angle right" />
                  {next.title}
                </Menu.Item>
              </Link>
            )}
            <Link href={rootPath}>
              <Menu.Item as="a" href={rootPath} position="right">
                <Icon name="angle up" />
                {language === "ja" ? "ブログのトップへ" : "Blog top page"}
              </Menu.Item>
            </Link>
          </Menu>
        </footer>
      </article>
    </Container>
  );
};

export { PostLayout };
