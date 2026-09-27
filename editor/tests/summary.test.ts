import { afterEach, describe, expect, it, vi } from "vitest";
import { api, type Env } from "../worker/index";
import { generateSummary } from "../worker/summary";

const input = {
  title: "Current title",
  body: "Unsaved article body.",
  prompt: "My edited prompt"
};
const env = {
  OPENAI_API_KEY: "private-test-key",
  OPENAI_SUMMARY_MODEL: "configured-model"
} as Env;
afterEach(() => vi.unstubAllGlobals());
describe("OpenAI summary candidates", () => {
  it("uses current contents and custom prompt without GitHub credentials, and extracts only assistant text", async () => {
    const fetcher = vi.fn(async () =>
      Response.json({
        status: "completed",
        output: [
          {
            type: "reasoning",
            content: [{ type: "output_text", text: "Do not display" }]
          },
          {
            type: "message",
            role: "assistant",
            content: [{ type: "output_text", text: " Candidate " }]
          }
        ]
      })
    );
    vi.stubGlobal("fetch", fetcher);
    const response = await api(
      new Request("https://editor.example/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      }),
      env
    );
    expect(await response.json()).toEqual({
      summary: "Candidate",
      model: "configured-model"
    });
    const [url, init] = fetcher.mock.calls[0] as unknown as [
      string,
      RequestInit
    ];
    expect(url).toBe("https://api.openai.com/v1/responses");
    const payload = JSON.parse(init.body as string);
    expect(payload).toMatchObject({
      model: "configured-model",
      store: false,
      instructions: input.prompt,
      max_output_tokens: 2048
    });
    expect(payload.input[0].content).toContain(input.title);
    expect(payload.input[0].content).toContain(input.body);
    expect(init.headers).toMatchObject({
      Authorization: "Bearer private-test-key"
    });
  });
  it("exposes model and availability without exposing a secret or contacting OpenAI", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    const response = await api(
      new Request("https://editor.example/api/summary/config"),
      env
    );
    expect(await response.json()).toEqual({
      configured: true,
      model: "configured-model"
    });
    const unconfigured = await api(
      new Request("https://editor.example/api/summary/config"),
      {} as Env
    );
    expect(await unconfigured.json()).toEqual({
      configured: false,
      model: "gpt-5.4-mini"
    });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("rejects empty or excessive article/prompt contents before using the key", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    for (const invalid of [
      null,
      { ...input, body: " " },
      { ...input, prompt: "" },
      { ...input, prompt: "a".repeat(10001) },
      { ...input, body: "a".repeat(512 * 1024 + 1) }
    ])
      await expect(generateSummary(invalid as any, env)).rejects.toMatchObject({
        status: 400
      });
    await expect(generateSummary(input, {})).rejects.toMatchObject({
      status: 503
    });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([401, 400, 429, 500])(
    "sanitizes provider errors (%i)",
    async status => {
      vi.stubGlobal(
        "fetch",
        vi.fn(async () =>
          Response.json(
            { error: { message: "private-test-key or article contents" } },
            { status }
          )
        )
      );
      await expect(generateSummary(input, env)).rejects.toMatchObject({
        status: status === 429 ? 429 : 502
      });
      await expect(generateSummary(input, env)).rejects.not.toMatchObject({
        message: expect.stringContaining("private-test-key")
      });
    }
  );
  it.each([
    {
      status: "incomplete",
      output: [
        {
          type: "message",
          role: "assistant",
          content: [{ type: "output_text", text: "Truncated" }]
        }
      ]
    },
    { status: "completed", output: [] },
    {
      status: "completed",
      output: [
        {
          type: "message",
          role: "assistant",
          content: [{ type: "refusal", refusal: "No" }]
        }
      ]
    }
  ])("rejects incomplete, empty or refused candidates", async data => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json(data))
    );
    await expect(generateSummary(input, env)).rejects.toMatchObject({
      status: 502
    });
  });
  it("reports network/timeout failures without losing contents", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("private provider detail");
      })
    );
    await expect(generateSummary(input, env)).rejects.toMatchObject({
      status: 504
    });
  });
});
