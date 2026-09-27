import { mediaPath } from "./model";

export function datedImageName(name: string, date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw new Error("Date must be a valid YYYY-MM-DD date.");
  return date + "-" + name.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

/** Replace local image URLs, preserving origin, query, fragment and encoding. */
export function renameMediaReferences(
  source: string,
  renames: Map<string, string>
) {
  return source.replace(
    /(?:(?:https?:)?\/\/[^/\s<>"'()\[\]]+)?\/images\/[^\s<>"'()\[\]]+|(?<![\w/.-])[A-Za-z0-9][A-Za-z0-9._%-]*\.(?:jpe?g|png|webp|gif)(?:[?#][^\s<>"'()\[\]]*)?/gi,
    value => {
      const old = mediaPath(value);
      const next = old && renames.get(old);
      if (!next) return value;
      const suffix = value.match(/[?#].*$/)?.[0] || "";
      const origin = value.startsWith("https://")
        ? "https://blog.junkato.jp"
        : value.startsWith("//")
        ? "//blog.junkato.jp"
        : "";
      const name = next.slice("public/images/".length);
      const encoded = value.includes("%") ? encodeURIComponent(name) : name;
      return (
        (value.includes("/images/") ? origin + "/images/" : "") +
        encoded +
        suffix
      );
    }
  );
}
