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
