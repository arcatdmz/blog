/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  trailingSlash: true,
  webpack: config => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|mp4)$/i,
      use: [
        {
          loader: "file-loader",
          options: {
            publicPath: "/_next",
            name: "static/media/[name].[hash].[ext]"
          }
        }
      ]
    });
    return config;
  }
};

module.exports = nextConfig;
