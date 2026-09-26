import japanese from "../../src/ja/2024-01-01-hci-research-in-the-wild.md?raw";
import english from "../../src/default/2023-06-20-lights-animation-interaction.md?raw";
import { referencedMedia } from "../shared/references";
import { HttpError } from "./github";

const fixtures = [
  {
    path: "src/ja/2024-01-01-hci-research-in-the-wild.md",
    sha: "1".repeat(40),
    content: japanese
  },
  {
    path: "src/default/2023-06-20-lights-animation-interaction.md",
    sha: "2".repeat(40),
    content: english
  }
];
const media = [
  ...new Set(fixtures.flatMap(p => [...referencedMedia(p.content)]))
].map(path => ({ path, sha: "3".repeat(40) }));

export async function demo(request: Request): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === "/api/index")
    return Response.json({
      head: "0".repeat(40),
      posts: fixtures.map(({ content: _, ...entry }) => entry),
      media,
      demo: true
    });
  if (url.pathname === "/api/post") {
    const post = fixtures.find(p => p.path === url.searchParams.get("path"));
    if (!post) throw new HttpError(404, "Demo post not found.");
    return Response.json(post);
  }
  if (url.pathname === "/api/media")
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="#e4e9e4"/><path d="M120 260l120-140 90 100 70-70 120 110" fill="none" stroke="#789080" stroke-width="8"/><text x="320" y="320" text-anchor="middle" font-family="sans-serif" fill="#394d42">Local demo image</text></svg>',
      { headers: { "Content-Type": "image/svg+xml" } }
    );
  if (url.pathname === "/api/references") {
    const data = (await request.json()) as any;
    const texts = fixtures.filter(p => p.path !== data.post?.path);
    if (data.post) texts.push({ ...data.post, sha: "" });
    return Response.json(
      Object.fromEntries(
        (data.paths as string[]).map(path => [
          path,
          texts
            .filter(p => referencedMedia(p.content).has(path))
            .map(p => p.path)
        ])
      )
    );
  }
  throw new HttpError(
    403,
    "Local demo is read-only. Your work remains on this device; configure Cloudflare Access and GitHub to save online."
  );
}
