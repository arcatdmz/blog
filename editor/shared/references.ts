import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import { splitDocument } from "./document";
import { mediaPath } from "./model";

const parser = remark()
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw);

/** Scan rendered URL attributes, including reference-style Markdown and raw HTML. */
export function referencedMedia(source: string): Set<string> {
  const { data, body } = splitDocument(source);
  const paths = new Set<string>();
  const add = (value: unknown) => {
    if (typeof value !== "string") return;
    const path = mediaPath(value);
    if (path) paths.add(path);
  };
  add(data.coverImage);
  const root = parser.runSync(parser.parse(body));
  function visit(node: any) {
    const props = node.properties;
    if (props) {
      for (const name of ["src", "href", "poster", "data"]) add(props[name]);
      if (typeof props.srcSet === "string")
        for (const item of props.srcSet.split(","))
          add(item.trim().split(/\s+/)[0]);
    }
    node.children?.forEach(visit);
  }
  visit(root);
  return paths;
}
