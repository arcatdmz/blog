// Resolve before first paint; keep the persisted contract in shared/theme.ts.
(function () {
  var theme;
  try {
    theme = localStorage.getItem("theme");
  } catch (_) {}
  if (theme !== "light" && theme !== "dark")
    theme = matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
