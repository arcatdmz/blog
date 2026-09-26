// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import ThemeSelect from "../src/ThemeSelect";
import { readTheme } from "../../shared/theme";

vi.mock("../src/i18n", () => ({ useI18n: () => ({ t: (en: string) => en }) }));
let container: HTMLDivElement;
let root: Root;
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  }));
  localStorage.clear();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it("rechecks a preference changed between initial render and storage subscription", () => {
  vi.spyOn(Storage.prototype, "getItem")
    .mockReturnValueOnce(null)
    .mockReturnValue("dark");
  act(() => root.render(createElement(ThemeSelect)));
  expect(container.querySelector("select")!.value).toBe("dark");
  expect(document.documentElement.dataset.theme).toBe("dark");
});
it("resynchronizes when a suspended page is shown again", () => {
  act(() => root.render(createElement(ThemeSelect)));
  localStorage.setItem("theme", "dark");
  act(() => window.dispatchEvent(new Event("pageshow")));
  expect(container.querySelector("select")!.value).toBe("dark");
  localStorage.removeItem("theme");
  act(() => window.dispatchEvent(new Event("focus")));
  expect(container.querySelector("select")!.value).toBe("system");
});
it("keeps an in-memory preference if reading storage is denied", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("Denied");
  });
  expect(readTheme()).toBe("system");
  expect(readTheme("dark")).toBe("dark");
});
