/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "export",
  pageExtensions: ["tsx", "md"],
  trailingSlash: true,
  adapterPath: require.resolve("./lib/adapter.js")
};

module.exports = nextConfig;
