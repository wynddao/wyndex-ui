const withTM = require("next-transpile-modules")(["@0xsquid/widget"]);
const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_I18N: i18n,
  },
};

module.exports = withTM(nextConfig);
