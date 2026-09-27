import HTML from "html-parse-stringify";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";

// Preserve the old parser's omission of whitespace-only text after sibling tags.
const keepSummaryNode = (node, index) =>
  index === 0 || node.type !== "text" || node.content.trim() !== "";

const toString = node => {
  if (node.type === "text") {
    return node.content;
  }
  if (!Array.isArray(node.children)) {
    return "";
  }
  return node.children.filter(keepSummaryNode).map(toString).join("");
};

export function generateSummary(
  content,
  language,
  summaryLength = language === "ja" ? 140 : 200
) {
  const html = micromark(content, {
    allowDangerousHtml: true,
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()]
  });
  const ast = HTML.parse(html).filter(keepSummaryNode);
  const headerIndex = ast.findIndex(
    v => v.type === "tag" && /h[0-9]+/.test(v.name)
  );
  const intro = headerIndex > 0 ? ast.slice(0, headerIndex) : ast;
  const text = intro.map(toString).join(language === "ja" ? "" : " ");
  return text.length > summaryLength
    ? text.slice(0, summaryLength - 3) + "..."
    : text;
}
