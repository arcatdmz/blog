import { FC, useContext } from "react";
import { Container, Divider, Grid, List, Segment } from "semantic-ui-react";

import { BlogContext } from "../lib/BlogContext";
import { Meta } from "./contents/Meta";

interface FooterProps {
  showMeta?: boolean;
}

const Footer: FC<FooterProps> = ({ showMeta = true }) => {
  const { language, author, authorUrl } = useContext(BlogContext);
  return (
    <footer>
      <Container>
        {showMeta && <Meta inverted />}
        <Segment basic inverted textAlign="center">
          {showMeta && <Divider inverted />}
          <List horizontal divided inverted>
            <List.Item>
              © <a href={`${authorUrl}#contact`}>{author}</a>
            </List.Item>
            <List.Item>2012-{new Date().getFullYear()}</List.Item>
            <List.Item as="a" href={`${authorUrl}privacy`}>
              <i className="envelope open outline icon"></i>{" "}
              {language === "ja" ? "プライバシーポリシー" : "Privacy Policy"}
            </List.Item>
            <List.Item as="a" href={language === "ja" ? "/" : "/ja"}>
              <i className="translate icon"></i>{" "}
              {language === "ja" ? "English" : "日本語"}
            </List.Item>
          </List>
        </Segment>
      </Container>
    </footer>
  );
};

export { Footer };
