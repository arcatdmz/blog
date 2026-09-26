import { useCallback, useEffect, useState } from "react";

export type EditorRoute = {
  post: string;
  view: "write" | "preview";
  dialog: "" | "new" | "images";
  language: string;
  search: string;
  zen: boolean;
  mediaSearch: string;
};
export function readRoute(search = window.location.search): EditorRoute {
  const params = new URLSearchParams(search);
  const post = params.get("post") || "";
  return {
    post:
      post === "@media" || /^src\/(ja|default)\/[^/]+\.mdx?$/.test(post)
        ? post
        : "",
    view: params.get("view") === "preview" ? "preview" : "write",
    dialog:
      params.get("dialog") === "new"
        ? "new"
        : params.get("dialog") === "images"
          ? "images"
          : "",
    language: params.get("language") === "default" ? "default" : "ja",
    search: params.get("q") || "",
    mediaSearch: params.get("media-q") || "",
    zen: params.get("zen") === "1"
  };
}
export function routeSearch(route: EditorRoute) {
  const params = new URLSearchParams();
  if (route.post) params.set("post", route.post);
  if (route.view !== "write") params.set("view", route.view);
  if (route.dialog) params.set("dialog", route.dialog);
  if (route.language !== "ja") params.set("language", route.language);
  if (route.search) params.set("q", route.search);
  if (route.mediaSearch) params.set("media-q", route.mediaSearch);
  if (route.zen) params.set("zen", "1");
  return params.size ? `?${params}` : "";
}
export function useEditorRoute() {
  const [route, setRoute] = useState(() => readRoute());
  useEffect(() => {
    const pop = () => setRoute(readRoute());
    window.addEventListener("popstate", pop);
    window.addEventListener("editor:navigate", pop);
    return () => {
      window.removeEventListener("popstate", pop);
      window.removeEventListener("editor:navigate", pop);
    };
  }, []);
  const navigate = useCallback(
    (patch: Partial<EditorRoute>, replace = false) => {
      const next = { ...readRoute(), ...patch };
      const search = routeSearch(next);
      if (search !== window.location.search) {
        window.history[replace ? "replaceState" : "pushState"](
          null,
          "",
          `${window.location.pathname}${search}`
        );
        window.dispatchEvent(new Event("editor:navigate"));
      }
    },
    []
  );
  return [route, navigate] as const;
}
