import { FC, MouseEventHandler, useCallback, useState } from "react";
import { Menu, Sidebar } from "semantic-ui-react";

import { SidebarMenuItems } from "../contents/SidebarMenuItems";

import { Footer } from "../Footer";
import { Header } from "../Header";

interface BaseLayoutProps {
  showFooterMeta?: boolean;
}

const BaseLayout: FC<BaseLayoutProps> = ({
  showFooterMeta = true,
  children
}) => {
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
        <main id="body">{children}</main>
        <Footer showMeta={showFooterMeta} />
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export { BaseLayout };
