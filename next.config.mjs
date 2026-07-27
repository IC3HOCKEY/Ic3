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
  /**
   * Bevarar länkar från tidigare versioner av sajten. Den statiska HTML-sajten
   * låg på `*.html`-adresser och Shopify-butiken på `/collections` och
   * `/pages` — de finns kvar i Google, i bokmärken och i delade länkar, och
   * landade annars på 404-sidan.
   */
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/om-oss.html", destination: "/om-oss", permanent: true },
      { source: "/kontakt.html", destination: "/kontakt", permanent: true },
      {
        source: "/limited-drop.html",
        destination: "/drop-01",
        permanent: true,
      },
      {
        source: "/limited-drop-fixed.html",
        destination: "/drop-01",
        permanent: true,
      },
      { source: "/ic3-drop.html", destination: "/drop-01", permanent: true },
      {
        source: "/ic3-drop-fixed.html",
        destination: "/drop-01",
        permanent: true,
      },
      { source: "/cart.html", destination: "/shop", permanent: true },
      { source: "/simple-cart.html", destination: "/shop", permanent: true },

      // Shopify-butikens adresser.
      { source: "/pages/om-oss", destination: "/om-oss", permanent: true },
      { source: "/pages/kontakt", destination: "/kontakt", permanent: true },
      { source: "/collections", destination: "/shop", permanent: true },
      {
        source: "/collections/:handle",
        destination: "/shop?category=:handle",
        permanent: true,
      },
      { source: "/products", destination: "/shop", permanent: true },

      // Produktens handle i Shopify är drop-01-face-off-cap — den korta
      // varianten låg länkad från sajten fram till 2026-07-27 och kan finnas
      // kvar i delade länkar. (Fuzzy-matchningen i getProduct täcker bara
      // suffix, inte prefix, så den här behövs som exakt regel.)
      {
        source: "/products/face-off-cap",
        destination: "/products/drop-01-face-off-cap",
        permanent: true,
      },

      // Vanliga gissningar på adresser som inte finns.
      { source: "/om", destination: "/om-oss", permanent: true },
      { source: "/about", destination: "/om-oss", permanent: true },
      { source: "/contact", destination: "/kontakt", permanent: true },
      { source: "/drop", destination: "/drop-01", permanent: true },
      { source: "/drop-1", destination: "/drop-01", permanent: true },
      { source: "/drop01", destination: "/drop-01", permanent: true },
    ];
  },
};

export default nextConfig;
