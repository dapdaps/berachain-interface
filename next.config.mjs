/** @type {import('next').NextConfig} */

const BASE_URL = process.env.NEXT_PUBLIC_API || "https://test-api.beratown.app";

const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: (config, { isServer }) => {
    config.optimization = {
      ...config.optimization,
      emitOnErrors: true // 即使有错误也继续构建
    };

    return config;
  },
  rewrites: async () => [
    {
      source: "/assets/:path*",
      destination: "https://asset.dapdap.net/:path*"
    },
    {
      source: "/dapdap/:path*",
      destination: "https://test-api.dapdap.net/:path*" // TODO: wait mainnet
    },
    {
      source: "/api.dolomite.io/:path*",
      destination: "https://api.dolomite.io/:path*"
    }
  ],
  webpack: (config) => {
    config.resolve.alias.stream = "stream-browserify";

    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/ // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"]
      }
    );
    fileLoaderRule.exclude = /\.svg$/i;

    config.optimization = {
      ...config.optimization,
      emitOnErrors: true // 即使有错误也继续构建
    };

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.db3.net",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "assets.db3.app",
        port: "",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
