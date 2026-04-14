import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product-card";
import { ProductView } from "@/components/product/product-view";
import { getProduct, getProducts } from "@/lib/shopify";
import { siteConfig } from "@/lib/site";

type PageProps = {
  params: { handle: string };
};

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const product = await getProduct(params.handle);
  if (!product) return {};
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.featuredImage
        ? [{ url: product.featuredImage.url }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const [product, all] = await Promise.all([
    getProduct(params.handle),
    getProducts(),
  ]);
  if (!product) notFound();
  const related = all
    .filter(
      (p) =>
        p.handle !== product.handle &&
        p.collectionHandles?.some((h) =>
          product.collectionHandles?.includes(h),
        ),
    )
    .slice(0, 4);
  if (related.length < 3) {
    related.push(
      ...all
        .filter((p) => p.handle !== product.handle && !related.includes(p))
        .slice(0, 4 - related.length),
    );
  }

  const structured = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((i) =>
      i.url.startsWith("http") ? i.url : `${siteConfig.url}${i.url}`,
    ),
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/products/${product.handle}`,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      price: product.priceRange.minVariantPrice.amount,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="relative pb-24 pt-32">
      <div className="container-x px-6 md:px-10">
        <nav
          aria-label="Breadcrumb"
          className="mb-10 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-ice-50/50"
        >
          <Link href="/" className="hover:text-ice">
            Hem
          </Link>
          <span aria-hidden>/</span>
          <Link href="/shop" className="hover:text-ice">
            Shop
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ice-50">{product.title}</span>
        </nav>
        <ProductView product={product} />
      </div>

      {related.length ? (
        <section className="section">
          <div className="container-x">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="display-heading text-3xl text-ice-50 md:text-5xl">
                Fortsätt shoppa
              </h2>
              <Link
                href="/shop"
                className="font-display text-xs uppercase tracking-[0.25em] text-ice hover:text-ice-200"
              >
                Se allt →
              </Link>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.slice(0, 4).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }}
      />
    </div>
  );
}
