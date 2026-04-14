import type { MetadataRoute } from "next";

import { getProducts } from "@/lib/shopify";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = [
    "",
    "/shop",
    "/drop-01",
    "/om-oss",
    "/kontakt",
    "/legal/villkor",
    "/legal/integritet",
    "/legal/cookies",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const products = await getProducts();
    const productRoutes = products.map((p) => ({
      url: `${base}/products/${p.handle}`,
      lastModified: p.createdAt ? new Date(p.createdAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
