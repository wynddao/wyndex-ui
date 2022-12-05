/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true, esmExternals: false },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
