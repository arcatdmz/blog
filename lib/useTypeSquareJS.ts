import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function useTypeSquareJS() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
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
  }, [pathname]);
}
