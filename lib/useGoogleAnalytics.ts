import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const GA_TRACKING_ID = "G-7S9BW1PX94";

export function useGoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const search = searchParams.toString();
    const url = pathname + (search ? `?${search}` : '');
    // https://developers.google.com/analytics/devguides/collection/gtagjs/pages
    window["gtag"]("config", GA_TRACKING_ID, {
      page_path: url
    });
  }, [pathname, searchParams]);
}
