import Link from "next/link";
import { FC, MouseEventHandler, useCallback } from "react";
import { Icon, Menu } from "semantic-ui-react";

import websiteJson from "../website.json";

interface HeaderProps {
  onMenuClick?(): void;
}

const Header: FC<HeaderProps> = ({ onMenuClick }) => {
  const handleMenuClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    e => {
      e.preventDefault();
      onMenuClick && onMenuClick();
    },
    [onMenuClick]
  );

  return (
    <Menu fixed="top" id="fixed-menu">
      <Link href="/">
        <Menu.Item as="a" href="/">
          <span className="mobile hidden">{websiteJson.title}</span>
          <span className="print-hidden mobile only">
            <Icon name="pencil" />
          </span>
        </Menu.Item>
      </Link>
      <Menu.Menu position="right">
        <Menu.Item as="a" href="//junkato.jp/ja">
          <span className="mobile hidden">自己紹介</span>
          <span className="print-hidden mobile only">
            <Icon name="user" />
          </span>
        </Menu.Item>
        <Menu.Item
          className="print-hidden sidebar-button"
          onClick={handleMenuClick}
        >
          <Icon name="sidebar" />
          <span className="widescreen monitor only">メニュー</span>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export { Header };
