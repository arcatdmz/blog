import remarkEmbedder, { Transformer } from "@remark-embedder/core";
import oembedTransformer, { Config } from "@remark-embedder/transformer-oembed";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkAutolinkHeadings from "remark-autolink-headings";
import remarkCodeTitles from "remark-flexible-code-titles";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
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

const oembedConfig: Config = ({ url: _url, provider }) => {
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
  if (provider.provider_name === "Instagram") {
    return {
      params: {
        access_token: "488785607828009|36d64ad2f361914097c65dd71ccefee7"
      }
    };
  }
};

const matchUrls = (urls: string[], urlString: string) =>
  urls.some(scheme =>
    new RegExp(scheme.replace(/\*/g, "(.*)")).test(urlString)
  );

const wrappedOembedTransformer: Transformer = {
  name: "transformer-oembed",
  shouldTransform: oembedTransformer.shouldTransform,
  getHTML: async urlString => {
    try {
      const html = await oembedTransformer.getHTML(urlString, oembedConfig);
      let provider: string;

      if (
        matchUrls(
          [
            "https://twitter.com/*",
            "https://twitter.com/*/status/*",
            "https://*.twitter.com/*/status/*"
          ],
          urlString
        )
      ) {
        provider = "twitter";
      } else if (
        matchUrls(
          [
            "https://*.youtube.com/watch*",
            "https://*.youtube.com/v/*",
            "https://youtu.be/*",
            "https://*.youtube.com/playlist?list=*",
            "https://youtube.com/playlist?list=*",
            "https://*.youtube.com/shorts*"
          ],
          urlString
        )
      ) {
        provider = "youtube";
      }
      return `<div class="remark-oembed-inline remark-oembed-${
        provider ||
        (lastProvider ? lastProvider.toLowerCase() : "unknown-provider")
      }">${html || `<a href="${urlString}">${urlString}</a>`}</div>`;
    } catch (error) {
      // Fallback to a simple link if oEmbed fetch fails (e.g., during static generation)
      console.warn(`Failed to fetch oEmbed for ${urlString}:`, error);
      return `<a href="${urlString}">${urlString}</a>`;
    }
  }
};

export async function getFileBySlug(
  slug: string,
  language: string = "default"
) {
  const mdxPath = path.join(root, "src", language, `${slug}.mdx`);
  const mdPath = path.join(root, "src", language, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;
  const source = fs.readFileSync(filePath, "utf8");

  const { data, content } = matter(source);

  // Convert Markdown to HTML using remark and rehype with all plugins
  const processedContent = await remark()
    .use(remarkSlug as any)
    .use(remarkAutolinkHeadings as any)
    .use(remarkCodeTitles as any)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  const contentHtml = processedContent.toString();

  return {
    contentHtml,
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
