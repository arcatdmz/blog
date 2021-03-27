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
        if (TypeSquareJS.loadFont) {
          // Wait until the components are mounted?
          setTimeout(() => TypeSquareJS.loadFont(), 10);
        }
      }
    };
    Router.events.on("routeChangeComplete", onComplete);
    return () => {
      Router.events.off("routeChangeComplete", onComplete);
    };
  }, [Router.events]);
}
