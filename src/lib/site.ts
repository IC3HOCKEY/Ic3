/** Face-Off Cap restock — buying is locked until this moment (Swedish time). */
export const RELEASE_DATE = new Date("2026-08-01T00:00:00+02:00");

export const isReleased = () => Date.now() >= RELEASE_DATE.getTime();

/**
 * Handle of the product the marketing pages link to. This MUST match the
 * product handle in Shopify (admin → product → "Sökmotorlistning" → URL-handtag),
 * otherwise every hardcoded product link 404:ar. Keep mock-data.ts in sync too.
 *
 * Server components should prefer the handle from the fetched product and fall
 * back to this constant — only client components need the constant directly.
 */
export const FEATURED_PRODUCT_HANDLE = "drop-01-face-off-cap";

export const siteConfig = {
  name: "IC3SWEDEN",
  shortName: "IC3",
  tagline: "Cold days. Hot drops.",
  subtagline: "Swedish streetwear forged in the rink.",
  description:
    "IC3SWEDEN är klädmärket för dig som lever för hockeykulturen – på och utanför isen. Limiterade droppar, byggda i Sverige.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ic3sweden.se",
  email: "ic3.kontakt@outlook.com",
  legalEntity: "FerdinSweden AB",
  locale: "sv-SE",
  currency: "SEK",
  social: {
    instagram: "https://www.instagram.com/ic3sweden/",
    tiktok: "https://www.tiktok.com/@ic3sweden?lang=sv-SE",
  },
  nav: [
    { href: "/", label: "Hem" },
    { href: "/shop", label: "Shop" },
    { href: "/drop-01", label: "Drop 01" },
    { href: "/om-oss", label: "Om oss" },
    { href: "/kontakt", label: "Kontakt" },
  ],
  productCategories: [{ handle: "drop-01", label: "Drop 01" }],
} as const;

export type SiteConfig = typeof siteConfig;
