import Router from "next/router";
import { useEffect } from "react";

export function useTypeSquareJS() {
  useEffect(() => {
    if (typeof window === "undefined" || !Router?.events) {
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
  }, [Router.events]);
}
