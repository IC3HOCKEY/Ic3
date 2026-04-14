/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "shop.ic3sweden.se" },
    ],
  },
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
