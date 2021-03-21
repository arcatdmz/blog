import fs from "fs";
import matter from "gray-matter";
import renderToString from "next-mdx-remote/render-to-string";
import path from "path";
import visit from "unist-util-visit";

import { MDXComponents } from "../components/MDXComponents";

import { FrontMatterIface } from "./FrontMatterIface";
import { PostIface } from "./PostIface";

const root = process.cwd();

const tokenClassNames = {
  tag: "text-code-red",
  "attr-name": "text-code-yellow",
  "attr-value": "text-code-green",
  deleted: "text-code-red",
  inserted: "text-code-green",
  punctuation: "text-code-white",
  keyword: "text-code-purple",
  string: "text-code-green",
  function: "text-code-blue",
  boolean: "text-code-red",
  comment: "text-gray-400 italic"
};

export async function getFiles() {
  return fs.readdirSync(path.join(root, "src"));
}

export function formatSlug(slug: string) {
  return slug.replace(/\.(mdx|md)/, "");
}

export function dateSortDesc(a: number | string, b: number | string) {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
}

export async function getFileBySlug(slug: string) {
  const mdxPath = path.join(root, "src", `${slug}.mdx`);
  const mdPath = path.join(root, "src", `${slug}.md`);
  const source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, "utf8")
    : fs.readFileSync(mdPath, "utf8");

  const { data, content } = matter(source);
  const mdxSource = await renderToString(content, {
    components: MDXComponents,
    mdxOptions: {
      remarkPlugins: [
        require("remark-slug"),
        require("remark-autolink-headings"),
        require("remark-code-titles")
      ],
      rehypePlugins: [
        require("@mapbox/rehype-prism"),
        () => {
          return tree => {
            visit(tree, "element", (node, _index, _parent) => {
              const className = node.properties["className"] as string[];
              let [token, type] = className || [];
              if (token === "token") {
                node.properties["className"] = [tokenClassNames[type]];
              }
            });
          };
        }
      ]
    }
  });

  return {
    mdxSource,
    frontMatter: {
      wordCount: content.split(/\s+/gu).length,
      slug: slug || null,
      fileName: fs.existsSync(mdxPath) ? `${slug}.mdx` : `${slug}.md`,
      ...data
    } as PostIface
  };
}

export async function getAllFilesFrontMatter() {
  const files = fs.readdirSync(path.join(root, "src"));

  const allFrontMatter: PostIface[] = [];

  files.forEach(file => {
    const source = fs.readFileSync(path.join(root, "src", file), "utf8");
    const data = matter(source).data as FrontMatterIface;
    if (data.draft !== true) {
      allFrontMatter.push({ ...data, slug: formatSlug(file) });
    }
  });

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date));
}
