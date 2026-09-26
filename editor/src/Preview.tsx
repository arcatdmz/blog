import { useEffect, useRef, useState } from "react";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import remarkCodeTitles from "remark-flexible-code-titles";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import DOMPurify from "dompurify";
import articleStyles from "../../css/style.css?inline";
import { findFigures, parseFigure, type FigureRange } from "./figures";
import { mediaPath } from "../shared/model";

const processor = remark()
  .use(remarkCodeTitles)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings)
  .use(rehypeHighlight)
  .use(rehypeStringify);

export async function previewHtml(
  body: string,
  resolveImage: (path: string) => string
) {
  const html = String(await processor.process(body));
  // Parse in a detached document, replace active embeds BEFORE sanitizing.
  const document = new DOMParser().parseFromString(html, "text/html");
  for (const embed of document.querySelectorAll(
    "iframe,script,object,embed,video,audio"
  )) {
    const placeholder = document.createElement("p");
    placeholder.textContent =
      "Embedded content — available on the published blog";
    placeholder.className = "embed-placeholder";
    embed.replaceWith(placeholder);
  }
  const figures = findFigures(body);
  [...document.querySelectorAll("figure")].forEach((element, i) => {
    // IDs from the source are never used to decide which source range to edit.
    element.setAttribute("data-editor-figure", String(i));
  });
  const safe = DOMPurify.sanitize(document.body.innerHTML, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: [
      "style",
      "form",
      "input",
      "button",
      "textarea",
      "select",
      "iframe",
      "object",
      "embed",
      "svg",
      "math"
    ],
    FORBID_ATTR: [
      "style",
      "srcdoc",
      "srcset",
      "name",
      "id",
      "slot",
      "is",
      "autofocus"
    ],
    ADD_URI_SAFE_ATTR: []
  });
  document.body.innerHTML = safe;
  // Resolve trusted, application-owned URLs only AFTER sanitizing source HTML.
  // This permits local blob previews without allowing arbitrary blob: links.
  for (const image of document.querySelectorAll("img")) {
    const path = mediaPath(image.getAttribute("src") || "");
    if (path) image.setAttribute("src", resolveImage(path));
    image.removeAttribute("srcset");
    image.loading = "lazy";
  }
  return { html: document.body.innerHTML, figures };
}

export default function Preview({
  body,
  resolveImage,
  onFigure
}: {
  body: string;
  resolveImage: (path: string) => string;
  onFigure: (range: FigureRange) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    const root =
      host.current!.shadowRoot || host.current!.attachShadow({ mode: "open" });
    root.replaceChildren();
    previewHtml(body, resolveImage)
      .then(({ html, figures }) => {
        if (cancelled) return;
        const style = document.createElement("style");
        style.textContent = `${articleStyles}\n:host {display:block;color:#26362f;font:17px/1.75 system-ui,sans-serif} article{display:flow-root} img{max-width:100%} pre{overflow:auto;background:#f2f3f0;padding:1rem} .embed-placeholder{padding:1rem;background:#f1f0ec;color:#647269} article.post-item figure > figcaption{margin-bottom:0} .figure-actions{display:flex;justify-content:flex-end;padding:.5em 0 0;clear:both} .figure-edit{font:600 14px system-ui;padding:.65rem 1rem;min-height:44px;border:1px solid #a3b5a9;border-radius:6px;background:#fff;color:#244e3a;cursor:pointer;display:block;margin:0} a{color:#35684d}`;
        const article = document.createElement("article");
        article.className = "post-item";
        article.innerHTML = html;
        article.querySelectorAll("figure").forEach((figure, i) => {
          const range = figures[i];
          if (!range) return;
          const button = document.createElement("button");
          button.type = "button";
          button.className = "figure-edit";
          button.textContent = parseFigure(range.source)
            ? "Edit image layout"
            : "Edit figure in source";
          button.addEventListener("click", () => onFigure(range));
          const actions = document.createElement("div");
          actions.className = "figure-actions";
          actions.append(button);
          figure.append(actions);
        });
        article.addEventListener("click", event => {
          if ((event.target as Element).closest("a")) event.preventDefault();
        });
        root.append(style, article);
      })
      .catch(error => setError(error.message));
    return () => {
      cancelled = true;
    };
  }, [body, resolveImage, onFigure]);
  return (
    <section className="preview">
      <p className="hint">
        Article preview · links are inactive; embeds load only on the published
        blog.
      </p>
      {error && <p role="alert">{error}</p>}
      <div ref={host} />
    </section>
  );
}
