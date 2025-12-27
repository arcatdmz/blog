import Link from "next/link";
import { FC, useContext } from "react";
import { Icon, Image, Menu } from "semantic-ui-react";

import { BlogContext } from "../../lib/BlogContext";

const SidebarMenuItems: FC = () => {
  const { language } = useContext(BlogContext);
  if (language === "ja") {
    return (
      <>
        <Menu.Item as="a" href="https://junkato.jp/ja/">
          <img
            src="https://junkato.jp/images/junkato.jpg"
            className="ui avatar image"
            alt=""
          />
          トップ
        </Menu.Item>
        <Link href="/ja" passHref legacyBehavior>
          <Menu.Item active as="a">
            <Icon name="pencil" />
            ブログ
          </Menu.Item>
        </Link>
        <Menu.Item as="a" href="https://junkato.jp/ja/#contact">
          <Icon name="address card" />
          連絡先
        </Menu.Item>
        <Menu.Item as="a" href="https://junkato.jp/ja/projects">
          <Icon name="lab" />
          プロジェクト
        </Menu.Item>
        <Menu.Item as="a" href="https://junkato.jp/ja/publications">
          <Icon name="file" />
          発表文献
        </Menu.Item>
        <Menu.Item as="a" href="https://junkato.jp/ja/design">
          <Icon name="paint brush" />
          デザイン
        </Menu.Item>
        <Menu.Item as="a" href="https://junkato.jp/ja/activities">
          <Icon name="student" />
          職務活動
        </Menu.Item>
        <Menu.Item as="a" href="https://junkato.jp/ja/timeline">
          <Icon name="history" />
          活動履歴
        </Menu.Item>
        <Menu.Item as="a" href="https://junkato.jp/ja/collaborations">
          <Icon name="handshake" />
          共同研究
        </Menu.Item>
        <Menu.Item as="a" href="https://junkato.jp">
          <Icon name="translate" />
          English
        </Menu.Item>
      </>
    );
  } else {
    return (
      <>
        <Menu.Item as="a" href="https://junkato.jp/">
          <img
            src="https://junkato.jp/images/junkato.jpg"
            className="ui avatar image"
            alt=""
          />
          Top page
        </Menu.Item>
        <Link href="/" passHref legacyBehavior>
          <Menu.Item active as="a">
            <Icon name="pencil" />
            Blog
          </Menu.Item>
        </Link>
        <Menu.Item as="a" href="https://junkato.jp/#contact">
          <Icon name="address card" />
          Contact
        </Menu.Item>
        <Menu.Item as="a" href="https://junkato.jp/projects">
          <Icon name="lab" />
          Projects
        </Menu.Item>
        <Menu.Item as="a" href="https://junkato.jp/publications">
          <Icon name="file" />
          Publications
        </Menu.Item>
        <Menu.Item as="a" href="https://junkato.jp/design">
          <Icon name="paint brush" />
          Design
        </Menu.Item>
        <Menu.Item as="a" href="https://junkato.jp/activities">
          <Icon name="student" />
          Activities
        </Menu.Item>
        <Menu.Item as="a" href="https://junkato.jp/timeline">
          <Icon name="history" />
          Timeline
        </Menu.Item>
        <Menu.Item as="a" href="https://junkato.jp/collaborations">
          <Icon name="handshake" />
          Collaborations
        </Menu.Item>
        <Menu.Item as="a" href="https://junkato.jp/ja/">
          <Icon name="translate" />
          日本語
        </Menu.Item>
      </>
    );
  }
};

export { SidebarMenuItems };
