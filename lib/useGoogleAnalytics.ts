import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const GA_TRACKING_ID = "G-7S9BW1PX94";

export function useGoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const search = window.location.search;
    const url = pathname + search;
    // https://developers.google.com/analytics/devguides/collection/gtagjs/pages
    window["gtag"]("config", GA_TRACKING_ID, {
      page_path: url
    });
  }, [pathname]);
}
