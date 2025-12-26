import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";

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

export async function getFileBySlug(
  slug: string,
  language: string = "default"
) {
  const mdxPath = path.join(root, "src", language, `${slug}.mdx`);
  const mdPath = path.join(root, "src", language, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;
  const source = fs.readFileSync(filePath, "utf8");

  const { data, content } = matter(source);
  
  // Convert Markdown to HTML using remark and rehype
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
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
