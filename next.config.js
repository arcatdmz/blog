/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "export",
  pageExtensions: ["tsx", "md"],
  trailingSlash: true,
  experimental: {
    adapterPath: require.resolve("./lib/adapter.js")
  }
};

module.exports = nextConfig;
