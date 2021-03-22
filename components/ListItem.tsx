import Link from "next/link";
import { FC, useContext } from "react";
import { List, Segment } from "semantic-ui-react";

import { BlogContext } from "../lib/BlogContext";

import { Tag } from "./Tag";

interface ListItemProps {
  slug: string;
  date: string;
  title: string;
  summary?: string;
  tags: string[];
}

const ListItem: FC<ListItemProps> = ({ slug, date, title, summary, tags }) => {
  const { sitePath, locale } = useContext(BlogContext);
  return (
    <Segment as="article">
      <List.Header as="h2">
        <Link href={`${sitePath}posts/${slug}`}>
          <a>{title}</a>
        </Link>
      </List.Header>
      {summary && <p>{summary}</p>}
      <List horizontal divided size="small">
        <List.Item>
          {new Date(date).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </List.Item>
        {tags.map(tag => (
          <List.Item key={tag}>{<Tag text={tag} />}</List.Item>
        ))}
      </List>
    </Segment>
  );
};

export { ListItem };
