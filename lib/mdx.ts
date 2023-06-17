import remarkEmbedder, { Transformer } from "@remark-embedder/core";
import oembedTransformer, { Config } from "@remark-embedder/transformer-oembed";
import fs from "fs";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import rehypePrism from "rehype-prism-plus";
import remarkAutolinkHeadings from "remark-autolink-headings";
import remarkCodeTitles from "remark-flexible-code-titles";
import remarkSlug from "remark-slug";

import { FrontMatterIface } from "./FrontMatterIface";
import { PostIface } from "./PostIface";

const root = process.cwd();

export async function getFiles(language: string = "default") {
  return fs.readdirSync(path.join(root, "src", language));
}

export function formatSlug(slug: string) {
  return slug.replace(/\.(mdx|md)/, "");
}

export function dateSortDesc(a: number | string, b: number | string) {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
}

let lastProvider: string;

const oembedConfig: Config = ({ url, provider }) => {
  lastProvider = provider.provider_name;
  if (provider.provider_name === "Twitter") {
    return {
      params: {
        omit_script: true,
        link_color: "#269eab",
        dnt: true
      }
    };
  }
};

const wrappedOembedTransformer: Transformer = {
  name: "transformer-oembed",
  shouldTransform: oembedTransformer.shouldTransform,
  getHTML: async (urlString, getConfig = {}) => {
    const html = await oembedTransformer.getHTML(urlString, getConfig);
    return `<div class="remark-oembed-inline remark-oembed-${
      lastProvider ? lastProvider.toLowerCase() : "unknown-provider"
    }">${html}</div>`;
  }
};

export async function getFileBySlug(
  slug: string,
  language: string = "default"
) {
  const mdxPath = path.join(root, "src", language, `${slug}.mdx`);
  const mdPath = path.join(root, "src", language, `${slug}.md`);
  const source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, "utf8")
    : fs.readFileSync(mdPath, "utf8");

  const { data, content } = matter(source);
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        remarkSlug,
        remarkAutolinkHeadings,
        remarkCodeTitles,
        [
          remarkEmbedder,
          { transformers: [[wrappedOembedTransformer, oembedConfig]] }
        ]
      ],
      rehypePlugins: [rehypePrism]
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

export async function getAllFilesFrontMatter(language: string = "default") {
  const files = fs.readdirSync(path.join(root, "src", language));

  const allFrontMatter: PostIface[] = [];

  files.forEach(file => {
    const source = fs.readFileSync(
      path.join(root, "src", language, file),
      "utf8"
    );
    const data = matter(source).data as FrontMatterIface;
    if (data.draft !== true) {
      allFrontMatter.push({ ...data, slug: formatSlug(file) });
    }
  });

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date));
}
