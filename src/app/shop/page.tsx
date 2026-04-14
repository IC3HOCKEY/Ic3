import type { Metadata } from "next";

import { ShopGrid } from "@/components/shop/shop-grid";
import { getProducts } from "@/lib/shopify";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Utforska hela IC3-kollektionen — headwear, hoodies, tees och accessoarer. Byggt i Sverige, släppt i limiterade droppar.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const products = await getProducts();

  return (
    <section className="relative pb-24 pt-40">
      <div className="container-x px-6 md:px-10">
        <header className="mb-12 max-w-3xl">
          <span className="chip">Hela kollektionen</span>
          <h1 className="mt-6 display-heading text-5xl text-ice-50 md:text-7xl">
            Shop IC3
          </h1>
          <p className="mt-4 text-base text-ice-50/70 md:text-lg">
            Limiterade droppar och kärnplagg. Ju längre ner du scrollar desto
            djupare in i kulturen. Filtrera kategorin eller sortera efter pris
            för att hitta ditt nästa plagg.
          </p>
        </header>

        <ShopGrid products={products} initialCategory={searchParams?.category} />
      </div>
    </section>
  );
}
