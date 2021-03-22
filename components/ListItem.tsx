import Link from "next/link";
import { FC, useContext } from "react";
import { Grid, Image, List, Segment } from "semantic-ui-react";

import { BlogContext } from "../lib/BlogContext";
import { PostIface } from "../lib/PostIface";

import { Date } from "./Date";
import { Tag } from "./Tag";

const ListItem: FC<PostIface> = ({
  slug,
  date,
  title,
  summary,
  summary_generated,
  tags,
  coverImage
}) => {
  const { sitePath, imageRoot } = useContext(BlogContext);
  const body = summary || summary_generated;
  const main = (
    <>
      <List.Header as="h2">
        <Link href={`${sitePath}posts/${slug}`}>
          <a>{title}</a>
        </Link>
      </List.Header>
      {body && <p>{body}</p>}
      <List horizontal divided size="small">
        <List.Item>
          <Date value={date} />
        </List.Item>
        {tags.map(tag => (
          <List.Item key={tag}>{<Tag text={tag} />}</List.Item>
        ))}
      </List>
    </>
  );
  return (
    <Segment as="article">
      {coverImage ? (
        <Grid stackable columns={2}>
          <Grid.Column width={11}>{main}</Grid.Column>
          <Grid.Column width={5}>
            <Image src={`${imageRoot}${coverImage}`} fluid rounded bordered />
          </Grid.Column>
        </Grid>
      ) : (
        main
      )}
    </Segment>
  );
};

export { ListItem };
