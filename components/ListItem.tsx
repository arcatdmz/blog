import { FC } from "react";
import { List } from "semantic-ui-react";

import Link from "./Link";
import Tag from "./Tag";
import siteMetdata from "../website.json";

interface ListItemProps {
  slug: string;
  date: string;
  title: string;
  summary?: string;
  tags: string[];
}

const ListItem: FC<ListItemProps> = ({ slug, date, title, summary, tags }) => (
  <List.Item as="article">
    <List.Content>
      <List.Header as="h2">
        <Link href={`/posts/${slug}`}>{title}</Link>
      </List.Header>
      <List.Description>
        {summary && <p>{summary}</p>}
        <List horizontal divided size="small">
          <List.Item>
            {new Date(date).toLocaleDateString(siteMetdata.locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </List.Item>
          {tags.map((tag) => (
            <List.Item>{<Tag text={tag} />}</List.Item>
          ))}
        </List>
      </List.Description>
    </List.Content>
  </List.Item>
);

export default ListItem;
