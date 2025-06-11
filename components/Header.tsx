"use client"
import Link from "next/link";
import { FC, MouseEventHandler, useCallback, useContext } from "react";
import { Icon, Menu } from "semantic-ui-react";

import { BlogContext } from "../lib/BlogContext";

interface HeaderProps {
  onMenuClick?(): void;
}

const Header: FC<HeaderProps> = ({ onMenuClick }) => {
  const { language, sitePath, title, authorUrl } = useContext(BlogContext);

  const handleMenuClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    e => {
      e.preventDefault();
      onMenuClick && onMenuClick();
    },
    [onMenuClick]
  );

  return (
    <Menu fixed="top" id="fixed-menu">
      <Link href={sitePath} passHref legacyBehavior>
        <Menu.Item as="a">
          <span className="mobile hidden">{title}</span>
          <span className="print-hidden mobile only">
            <Icon name="pencil" />
          </span>
        </Menu.Item>
      </Link>
      <Menu.Menu position="right">
        <Menu.Item as="a" href={authorUrl}>
          <span className="mobile hidden">
            {language === "ja" ? "自己紹介" : "Portfolio"}
          </span>
          <span className="print-hidden mobile only">
            <Icon name="user" />
          </span>
        </Menu.Item>
        <Menu.Item as="a" href={language === "ja" ? "/" : "/ja"}>
          <Icon name="translate" />
          {language === "ja" ? "English" : "日本語"}
        </Menu.Item>
        <Menu.Item
          className="print-hidden sidebar-button"
          onClick={handleMenuClick}
        >
          <Icon name="sidebar" />
          <span className="widescreen monitor only">
            {language === "ja" ? "メニュー" : "Menu"}
          </span>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export { Header };
