"use client";
import {
  FC,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useContext,
  useState
} from "react";
import { Menu, Sidebar } from "semantic-ui-react";

import { BlogContext } from "../../lib/BlogContext";
import { SidebarMenuItems } from "../contents/SidebarMenuItems";
import { Footer } from "../Footer";
import { Header } from "../Header";

interface BaseLayoutProps {
  children?: ReactNode;
  showFooterMeta?: boolean;
  sourceUrl?: string;
}

const BaseLayout: FC<BaseLayoutProps> = ({
  children,
  showFooterMeta = true,
  sourceUrl
}) => {
  const { sitePath } = useContext(BlogContext);
  const [visible, setVisible] = useState<boolean>(false);

  const handleMenuClick = useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  const handlePusherClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    e => {
      if (!visible) {
        return;
      }
      e.preventDefault();
      setVisible(false);
    },
    [visible]
  );

  return (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        animation="push"
        direction="right"
        visible={visible}
        inverted
        vertical
      >
        <SidebarMenuItems />
      </Sidebar>
      <Header onMenuClick={handleMenuClick} />
      <Sidebar.Pusher id="pusher" dimmed={visible} onClick={handlePusherClick}>
        <div className="content">
          <div className={`dimmer${visible ? " active" : ""}`}></div>
          <main id="body">{children}</main>
          <Footer showMeta={showFooterMeta} sourceUrl={sourceUrl} />
        </div>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export { BaseLayout };
