import { afterEach, describe, expect, it, vi } from "vitest";
import { api, type Env } from "../worker/index";

const env = { GITHUB_TOKEN: "token" } as Env;
afterEach(() => vi.unstubAllGlobals());
describe("repository API validation", () => {
  it("loads the index with the receiver required by Workers' native fetch", async () => {
    const fetcher = vi.fn(function (this: unknown, url: string) {
      if (this !== globalThis) throw new TypeError("Illegal invocation");
      const data = url.includes("/git/ref/")
        ? { object: { sha: "a".repeat(40) } }
        : url.includes("/git/commits/")
          ? { tree: { sha: "b".repeat(40) } }
          : { tree: [], truncated: false };
      return Promise.resolve(Response.json(data));
    });
    vi.stubGlobal("fetch", fetcher);
    const response = await api(new Request("https://editor.example/api/index"), env);
    expect(await response.json()).toEqual({
      head: "a".repeat(40), posts: [], media: []
    });
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
  it("rejects unsafe paths before contacting GitHub", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    for (const url of [
      "post?path=.github/workflows/publish.yml",
      "media?path=public/images/../secret.jpg&ref=" + "a".repeat(40)
    ]) {
      await expect(
        api(new Request(`https://editor.example/api/${url}`), env)
      ).rejects.toMatchObject({ status: 400 });
    }
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("rejects forged image types and oversized upload bodies before creating a blob", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    await expect(
      api(
        new Request(
          "https://editor.example/api/upload?path=public/images/fake.jpg",
          { method: "POST", body: "<svg onload=alert(1)>" }
        ),
        env
      )
    ).rejects.toMatchObject({ status: 415 });
    await expect(
      api(
        new Request(
          "https://editor.example/api/upload?path=public/images/large.jpg",
          {
            method: "POST",
            headers: { "Content-Length": String(11 * 1024 * 1024) },
            body: new Uint8Array([255, 216, 255])
          }
        ),
        env
      )
    ).rejects.toMatchObject({ status: 413 });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("returns a signed receipt for validated image bytes without updating the branch", async () => {
    const fetcher = vi.fn(async (_url: string) =>
      Response.json({ sha: "a".repeat(40) })
    );
    vi.stubGlobal("fetch", fetcher);
    const response = await api(
      new Request(
        "https://editor.example/api/upload?path=public/images/photo.jpg",
        { method: "POST", body: new Uint8Array([255, 216, 255, 1]) }
      ),
      env
    );
    const result = await response.json();
    expect(result).toMatchObject({
      path: "public/images/photo.jpg",
      sha: "a".repeat(40)
    });
    expect(result.receipt.split(".")).toHaveLength(3);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0][0]).toBe(
      "https://api.github.com/repos/arcatdmz/blog/git/blobs"
    );
  });
  it("uses the blob endpoint to serve committed images larger than the Contents API limit", async () => {
    const fetcher = vi.fn(async (url: string) =>
      url.includes("/contents/")
        ? Response.json({
            type: "file",
            size: 2 * 1024 * 1024,
            sha: "b".repeat(40),
            encoding: "none",
            content: ""
          })
        : Response.json({ encoding: "base64", content: "/9j/AQ==" })
    );
    vi.stubGlobal("fetch", fetcher);
    const response = await api(
      new Request(
        `https://editor.example/api/media?path=public/images/photo.jpg&ref=${"a".repeat(40)}`
      ),
      env
    );
    expect(response.headers.get("Content-Type")).toBe("image/jpeg");
    expect([...new Uint8Array(await response.arrayBuffer())]).toEqual([
      255, 216, 255, 1
    ]);
    expect(fetcher.mock.calls[1][0]).toContain("/git/blobs/");
  });
});
