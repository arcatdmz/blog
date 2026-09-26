import { beforeAll, describe, expect, it, vi } from "vitest";
import { generateKeyPair, SignJWT } from "jose";
import worker, { authenticate, type Env } from "../worker/index";

const keys = vi.hoisted(() => ({ publicKey: null as CryptoKey | null }));
vi.mock("jose", async original => ({
  ...(await original<typeof import("jose")>()),
  createRemoteJWKSet: () => async () => keys.publicKey
}));
let privateKey: CryptoKey;
beforeAll(async () => {
  const pair = await generateKeyPair("RS256");
  keys.publicKey = pair.publicKey;
  privateKey = pair.privateKey;
});
const env: Env = {
  ACCESS_TEAM_DOMAIN: "https://example.cloudflareaccess.com",
  ACCESS_AUD: "editor-aud",
  ALLOWED_EMAIL: "owner@example.com",
  GITHUB_TOKEN: "test",
  ASSETS: { fetch: async () => new Response("editor") }
};
async function token(
  options: {
    email?: string;
    issuer?: string;
    audience?: string;
    expired?: boolean;
  } = {}
) {
  return new SignJWT({ email: options.email || env.ALLOWED_EMAIL })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(options.issuer || env.ACCESS_TEAM_DOMAIN)
    .setAudience(options.audience || env.ACCESS_AUD)
    .setExpirationTime(options.expired ? 1 : "1h")
    .sign(privateKey);
}
describe("Access boundary", () => {
  it("requires a signed token rather than trusting an email header", async () => {
    await expect(
      authenticate(
        new Request("https://editor.example/api/index", {
          headers: { "Cf-Access-Authenticated-User-Email": env.ALLOWED_EMAIL }
        }),
        env
      )
    ).rejects.toMatchObject({ status: 401 });
  });
  it("checks signature, issuer, audience, expiry, and the owner email", async () => {
    for (const value of [
      "not-a-jwt",
      await token({ email: "other@example.com" }),
      await token({ issuer: "https://evil.example" }),
      await token({ audience: "different-app" }),
      await token({ expired: true })
    ]) {
      await expect(
        authenticate(
          new Request("https://editor.example", {
            headers: { "Cf-Access-Jwt-Assertion": value }
          }),
          env
        )
      ).rejects.toMatchObject({ status: 401 });
    }
    await expect(
      authenticate(
        new Request("https://editor.example", {
          headers: { "Cf-Access-Jwt-Assertion": await token() }
        }),
        env
      )
    ).resolves.toBeUndefined();
  });
  it("protects static assets and fails closed when Access is not configured", async () => {
    expect(
      (
        await worker.fetch(
          new Request("https://editor.example/assets/app.js"),
          env
        )
      ).status
    ).toBe(401);
    expect(
      (
        await worker.fetch(new Request("https://editor.example/api/index"), {
          ...env,
          ACCESS_AUD: ""
        })
      ).status
    ).toBe(503);
    expect(
      (
        await worker.fetch(new Request("https://editor.example/api/index"), {
          ...env,
          LOCAL_DEMO: "true"
        })
      ).status
    ).toBe(401);
  });
  it("rejects cross-origin writes and adds browser isolation headers", async () => {
    const jwt = await token();
    const response = await worker.fetch(
      new Request("https://editor.example/api/save", {
        method: "POST",
        headers: {
          Origin: "https://evil.example",
          "Cf-Access-Jwt-Assertion": jwt
        },
        body: "{}"
      }),
      env
    );
    expect(response.status).toBe(403);
    expect(response.headers.get("Content-Security-Policy")).toContain(
      "object-src 'none'"
    );
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
});
