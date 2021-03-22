import Router from "next/router";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import { Menu, Sidebar } from "semantic-ui-react";

import { Footer } from "../Footer";
import { Header } from "../Header";

const BaseLayout = ({ children }) => {
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
    <>
      <Sidebar.Pushable>
        <Sidebar
          as={Menu}
          animation="push"
          direction="right"
          visible={visible}
          inverted
        ></Sidebar>
        <Header onMenuClick={handleMenuClick} />
        <Sidebar.Pusher
          id="pusher"
          dimmed={visible}
          onClick={handlePusherClick}
        >
          <main id="body">{children}</main>
          <Footer />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </>
  );
};

export { BaseLayout };
