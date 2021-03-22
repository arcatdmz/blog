import { FC, useContext } from "react";
import { Container, Divider, List, Segment } from "semantic-ui-react";
import { BlogContext } from "../lib/BlogContext";

const Footer: FC = () => {
  const { language, author, authorUrl } = useContext(BlogContext);
  return (
    <Segment as="footer" basic textAlign="center">
      <Container>
        <Divider />
        <List horizontal divided>
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
      </Container>
    </Segment>
  );
};

export { Footer };
