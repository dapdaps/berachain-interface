/** @type {import('next').NextConfig} */

const BASE_URL = process.env.NEXT_PUBLIC_API || 'https://api.dapdap.net';

const nextConfig = {
  reactStrictMode: false,
  rewrites: async () => [
    {
      source: '/assets/:path*',
      destination: 'https://asset.dapdap.net/:path*'
    },
    {
      source: '/dapdap/:path*',
      destination: BASE_URL + '/:path*'
    },
    {
      source: '/api.dolomite.io/:path*',
      destination: 'https://api.dolomite.io/:path*'
    }
  ],
  webpack: (config) => {
    config.resolve.alias.stream = 'stream-browserify';

    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
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
        use: ['@svgr/webpack']
      }
    );
    fileLoaderRule.exclude = /\.svg$/i;
    return config;
  }
};

export default nextConfig;
