const withTM = require("next-transpile-modules")(["@0xsquid/widget"]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    appDir: true,
  },
};

module.exports = withTM(nextConfig);
