/** @type {import('next').NextConfig} */

const TerserPlugin = require("terser-webpack-plugin");

const createBundleStatsPlugin = require("next-plugin-bundle-stats");

const BASE_URL = process.env.NEXT_PUBLIC_API || "https://api.dapdap.net";
const GAME_BASE_URL = process.env.NEXT_PUBLIC_GAME_API_DOMAIN || "https://dev-api-game.beratown.app";

const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  rewrites: async () => [
    {
      source: "/assets/:path*",
      destination: "https://asset.dapdap.net/:path*"
    },
    {
      source: "/dapdap/:path*",
      destination: BASE_URL + "/:path*"
    },
    {
      source: "/api.dolomite.io/:path*",
      destination: "https://api.dolomite.io/:path*"
    },
    {
      source: "/api.kingdomly/:path*",
      destination: "https://www.kingdomly.app/:path*"
    },
    {
      source: "/api.infrared.finance/:path*",
      destination: "https://api.infrared.finance/:path*"
    },
    {
      source: "/dapdap.game/:path*",
      destination: `${GAME_BASE_URL}/:path*`
    }
  ],
  webpack: (config, { dev }) => {
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
      moduleIds: "deterministic",
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    };

    config.optimization.emitOnErrors = true;
    if (process.env.NEXT_PUBLIC_API === 'https://dev-api.beratown.app') {
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ["console.warn"]
            },
            mangle: {
              safari10: true
            },
            format: {
              comments: false
            },
            ecma: 2015
          },
          parallel: true
        })
      ];
    }
    return config;
  },
  experimental: {
    optimizePackageImports: [
      "d3",
      "ahooks",
      "clsx",
      "lodash",
      "react",
      "react-dom",
      "framer-motion",
      "wagmi",
      "viem",
      "zustand",
      "react-loading-skeleton",
      "date-fns",
      "ethers"
    ]
  }
};

const withBundleStatsPlugin =
  process.env.ANALYZE_STATS === "true"
    ? createBundleStatsPlugin({
      outDir: "./analyze"
    })
    : (conf) => conf;

module.exports = withBundleStatsPlugin(nextConfig);
