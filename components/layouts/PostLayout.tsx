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
import { ShareButtons } from "../ShareButtons";
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
  const { language, siteUrl, sitePath, author } = useContext(BlogContext);
  const { slug, date, title, tags, altUrl } = frontMatter;

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
    return (
      <List.Item>
        {language === "ja" ? "カテゴリ: " : "filed under "}
        {elems}
      </List.Item>
    );
  }, [tags]);

  const url = `${siteUrl}posts/${slug}`;

  return (
    <Container id="main">
      <BlogSeo url={url} {...frontMatter} />
      <article className="post-item">
        <Menu className="top nav" fluid secondary>
          <Link href={sitePath}>
            <Menu.Item
              as="a"
              href={sitePath}
              icon={<Icon circular name="home" />}
              title={language === "ja" ? "ブログのトップへ" : "Blog top page"}
            />
          </Link>
          {prev && (
            <Link href={`${sitePath}posts/${prev.slug}`}>
              <Menu.Item
                as="a"
                href={`${sitePath}posts/${prev.slug}`}
                icon={<Icon circular name="angle left" />}
                title={prev.title}
              />
            </Link>
          )}
          {next && (
            <Link href={`${sitePath}posts/${next.slug}`}>
              <Menu.Item
                as="a"
                href={`${sitePath}posts/${next.slug}`}
                icon={<Icon circular name="angle right" title={next.title} />}
                title={next.title}
              />
            </Link>
          )}
          <Menu.Menu position="right" className="share-buttons">
            <ShareButtons url={url} title={title} />
          </Menu.Menu>
        </Menu>
        <Divider />
        <header>
          <PageTitle>{title}</PageTitle>
        </header>
        <List horizontal divided className="meta">
          <List.Item>
            {language === "ja" ? "投稿者: " : "by "}
            <strong>{author}</strong>
          </List.Item>
          <List.Item>
            {language === "ja" ? "投稿日: " : "posted on "}
            <strong>
              <Date value={date} />
            </strong>
          </List.Item>
          {tagComponents}
        </List>
        <Segment.Group>
          <Segment>{children}</Segment>
          <Segment className="bottom nav" secondary size="small">
            <Menu className="share-buttons" secondary floated="right">
              <ShareButtons url={url} title={title} />
            </Menu>
            <List className="links">
              <List.Item className="permalink">
                {language === "ja" ? "パーマリンク: " : "Permalink: "}
                <a href={url}>{url}</a>
              </List.Item>
              {altUrl && (
                <List.Item className="altlink">
                  {language === "ja" ? "旧ブログページ: " : "Old page: "}
                  <a href={altUrl}>{altUrl}</a>
                </List.Item>
              )}
            </List>
          </Segment>
        </Segment.Group>
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
            <Menu.Menu position="right">
              <Menu.Item
                as="a"
                href="#"
                icon="angle up"
                title={
                  language === "ja" ? "ページのトップへ" : "Top of this page"
                }
              />
              <Link href={sitePath}>
                <Menu.Item
                  as="a"
                  href={sitePath}
                  icon="home"
                  title={
                    language === "ja" ? "ブログのトップへ" : "Blog top page"
                  }
                />
              </Link>
            </Menu.Menu>
          </Menu>
        </footer>
      </article>
    </Container>
  );
};

export { PostLayout };
