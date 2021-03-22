import Router from "next/router";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import { Menu, Sidebar } from "semantic-ui-react";

import { Footer } from "../Footer";
import { Header } from "../Header";

const LayoutWrapper = ({ children }) => {
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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const onComplete = () => {
      // Re-validate web fonts
      if (
        typeof window["TypeSquareJS"] &&
        ["localhost", "127.0.0.1"].indexOf(location.hostname.toLowerCase()) < 0
      ) {
        const TypeSquareJS = window["TypeSquareJS"];
        TypeSquareJS.loadFont && TypeSquareJS.loadFont();
      }
    };
    Router.events.on("routeChangeComplete", onComplete);
    return () => {
      Router.events.off("routeChangeComplete", onComplete);
    };
  }, []);

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

export { LayoutWrapper };
