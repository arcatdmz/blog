import Router from "next/router";
import { useEffect } from "react";

export const GA_TRACKING_ID = "G-7S9BW1PX94";

export function useGoogleAnalytics() {
  useEffect(() => {
    if (typeof window === "undefined" || !Router?.events) {
      return;
    }
    const onComplete = (url: string) => {
      // https://developers.google.com/analytics/devguides/collection/gtagjs/pages
      window["gtag"]("config", GA_TRACKING_ID, {
        page_path: url
      });
    };
    Router.events.on("routeChangeComplete", onComplete);
    return () => {
      Router.events.off("routeChangeComplete", onComplete);
    };
  }, [Router.events]);
}
