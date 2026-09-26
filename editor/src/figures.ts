import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export interface FigureImage {
  src: string;
  alt: string;
  link: string;
  title?: string;
  width?: string;
}
export interface Figure {
  placement: "" | "left" | "right" | "center";
  small: boolean;
  fixed: boolean;
  columns: 1 | 2 | 3 | 4;
  sharedLink: string;
  sharedTitle?: string;
  caption: string;
  images: FigureImage[];
  originalCaption?: string;
  originalCaptionHtml?: string;
}
export interface FigureRange {
  start: number;
  end: number;
  source: string;
}
export const emptyFigure = (): Figure => ({
  placement: "center",
  small: false,
  fixed: false,
  columns: 1,
  sharedLink: "",
  caption: "",
  images: []
});

export function findFigures(body: string): FigureRange[] {
  const tree = remark().parse(body);
  const ranges: FigureRange[] = [];
  function visit(node: any) {
    if (node.type === "html" && node.position) {
      const start = node.position.start.offset as number;
      const end = node.position.end.offset as number;
      const raw = body.slice(start, end);
      for (const match of raw.matchAll(/<figure\b/gi)) {
        const from = start + match.index!;
        if (ranges.some(range => from >= range.start && from < range.end))
          continue;
        const close = /<\/figure\s*>/gi;
        close.lastIndex = from;
        const closing = close.exec(body);
        if (closing)
          ranges.push({
            start: from,
            end: close.lastIndex,
            source: body.slice(from, close.lastIndex)
          });
      }
    }
    node.children?.forEach(visit);
  }
  visit(tree);
  return ranges;
}
function permittedAttributes(element: Element, names: string[]) {
  return [...element.attributes].every(attribute =>
    names.includes(attribute.name)
  );
}
function safeUrl(value: string) {
  return (
    !/[\u0000-\u0020]/.test(value) && /^(https?:\/\/|\/[^/]|#)/i.test(value)
  );
}
function captionText(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE)
    return (node.textContent || "").replace(/([\\`*_[\]])/g, "\\$1");
  const el = node as Element;
  const content = [...node.childNodes].map(captionText).join("");
  switch (el.tagName?.toLowerCase()) {
    case "a":
      return `[${content}](${el.getAttribute("href") || ""})`;
    case "b":
    case "strong":
      return `**${content}**`;
    case "i":
    case "em":
      return `*${content}*`;
    case "br":
      return "  \n";
    default:
      return content;
  }
}
export function parseFigure(source: string): Figure | null {
  const document = new DOMParser().parseFromString(source, "text/html");
  const element = document.body.firstElementChild;
  if (
    !element ||
    element.tagName !== "FIGURE" ||
    document.body.children.length !== 1 ||
    !permittedAttributes(element, ["class"])
  )
    return null;
  const classes = [...element.classList];
  if (
    classes.some(
      name => !["left", "right", "center", "small", "fixed-size"].includes(name)
    )
  )
    return null;
  if (
    classes.filter(name => ["left", "right", "center"].includes(name)).length >
    1
  )
    return null;
  const figure = emptyFigure();
  figure.placement = (classes.find(name =>
    ["left", "right", "center"].includes(name)
  ) || "") as Figure["placement"];
  figure.small = classes.includes("small");
  figure.fixed = classes.includes("fixed-size");
  const captions = element.querySelectorAll("figcaption");
  if (
    captions.length > 1 ||
    (captions[0] && captions[0].parentElement !== element)
  )
    return null;
  const caption = captions[0];
  if (caption) {
    if (!permittedAttributes(caption, [])) return null;
    for (const child of caption.querySelectorAll("*")) {
      if (
        !["A", "B", "STRONG", "I", "EM", "BR"].includes(child.tagName) ||
        !permittedAttributes(
          child,
          child.tagName === "A" ? ["href", "title"] : []
        )
      )
        return null;
      if (child.tagName === "A" && !safeUrl(child.getAttribute("href") || ""))
        return null;
    }
    figure.caption = [...caption.childNodes].map(captionText).join("");
    figure.originalCaption = figure.caption;
    figure.originalCaptionHtml = caption.innerHTML;
  }
  let container = element;
  const content = [...element.children].filter(el => el !== caption);
  if (
    content.length === 1 &&
    ["DIV", "A"].includes(content[0].tagName) &&
    content[0].classList.contains("columns")
  ) {
    container = content[0];
    const allowed =
      container.tagName === "A" ? ["class", "href", "title"] : ["class"];
    if (
      !permittedAttributes(container, allowed) ||
      [...container.classList].some(
        name => !["two", "three", "four", "columns"].includes(name)
      )
    )
      return null;
    const counts = [...container.classList].filter(name =>
      ["two", "three", "four"].includes(name)
    );
    if (counts.length !== 1) return null;
    figure.columns = ({ two: 2, three: 3, four: 4 } as const)[
      counts[0] as "two" | "three" | "four"
    ];
    if (container.tagName === "A") {
      figure.sharedLink = container.getAttribute("href") || "";
      figure.sharedTitle = container.getAttribute("title") || undefined;
      if (!safeUrl(figure.sharedLink)) return null;
    }
  }
  for (const child of container.childNodes) {
    if (child === caption) continue;
    if (child.nodeType === Node.TEXT_NODE && !child.textContent?.trim())
      continue;
    if (!(child instanceof Element)) return null;
    let image = child;
    let link = "";
    let title: string | undefined;
    if (child.tagName === "A") {
      if (
        figure.sharedLink ||
        !permittedAttributes(child, ["href", "title"]) ||
        child.children.length !== 1 ||
        [...child.childNodes].some(
          n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()
        )
      )
        return null;
      link = child.getAttribute("href") || "";
      title = child.getAttribute("title") || undefined;
      if (!safeUrl(link)) return null;
      image = child.children[0];
    }
    if (
      image.tagName !== "IMG" ||
      !permittedAttributes(image, ["src", "alt", "width"])
    )
      return null;
    const src = image.getAttribute("src") || "";
    if (!safeUrl(src)) return null;
    figure.images.push({
      src,
      alt: image.getAttribute("alt") || "",
      link,
      title,
      width: image.getAttribute("width") || undefined
    });
  }
  return figure.images.length ? figure : null;
}
export function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
export function serializeFigure(figure: Figure): string {
  if (!figure.images.length) throw new Error("Add at least one image.");
  const classes = [
    figure.small && "small",
    figure.fixed && "fixed-size",
    figure.placement
  ]
    .filter(Boolean)
    .join(" ");
  const link = (href: string, inner: string, title?: string) => {
    if (!safeUrl(href))
      throw new Error("Use an https://, http://, /path, or #anchor link.");
    return `<a href="${escapeHtml(href)}"${title ? ` title="${escapeHtml(title)}"` : ""}>${inner}</a>`;
  };
  const images = figure.images.map(image => {
    if (!safeUrl(image.src)) throw new Error("Each image needs a valid URL.");
    const html = `<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}"${image.width ? ` width="${escapeHtml(image.width)}"` : ""} />`;
    return !figure.sharedLink && image.link
      ? link(image.link, html, image.title)
      : html;
  });
  const lines = [`<figure${classes ? ` class="${classes}"` : ""}>`];
  if (figure.columns > 1) {
    const columnClass = `${({ 2: "two", 3: "three", 4: "four" } as const)[figure.columns as 2 | 3 | 4]} columns`;
    if (figure.sharedLink) {
      if (!safeUrl(figure.sharedLink)) throw new Error("Invalid shared link.");
      lines.push(
        `  <a class="${columnClass}" href="${escapeHtml(figure.sharedLink)}"${figure.sharedTitle ? ` title="${escapeHtml(figure.sharedTitle)}"` : ""}>`,
        ...images.map(html => `    ${html}`),
        "  </a>"
      );
    } else
      lines.push(
        `  <div class="${columnClass}">`,
        ...images.map(html => `    ${html}`),
        "  </div>"
      );
  } else
    lines.push(
      ...images.map(
        html =>
          `  ${figure.sharedLink ? link(figure.sharedLink, html, figure.sharedTitle) : html}`
      )
    );
  if (figure.caption) {
    const caption =
      figure.caption === figure.originalCaption &&
      figure.originalCaptionHtml !== undefined
        ? figure.originalCaptionHtml
        : String(
            remark()
              .use(remarkRehype)
              .use(rehypeStringify)
              .processSync(figure.caption)
          )
            .trim()
            .replace(/^<p>/, "")
            .replace(/<\/p>$/, "");
    lines.push(`  <figcaption>${caption}</figcaption>`);
  }
  lines.push("</figure>");
  return lines.join("\n");
}
