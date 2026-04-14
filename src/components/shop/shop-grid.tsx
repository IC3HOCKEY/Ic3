"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { ProductCard } from "@/components/product-card";
import { cx } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import type { Product, SortKey } from "@/lib/types";

type ShopGridProps = {
  products: Product[];
  initialCategory?: string;
};

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Senaste" },
  { value: "price-asc", label: "Pris — lågt till högt" },
  { value: "price-desc", label: "Pris — högt till lågt" },
  { value: "popular", label: "Mest populära" },
];

export function ShopGrid({ products, initialCategory }: ShopGridProps) {
  const [category, setCategory] = useState<string | "all">(
    initialCategory && initialCategory !== "all" ? initialCategory : "all",
  );
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    const base =
      category === "all"
        ? products
        : products.filter(
            (p) =>
              p.collectionHandles?.includes(category) ||
              p.tags.includes(category),
          );
    const copy = [...base];
    switch (sort) {
      case "price-asc":
        copy.sort(
          (a, b) =>
            Number(a.priceRange.minVariantPrice.amount) -
            Number(b.priceRange.minVariantPrice.amount),
        );
        break;
      case "price-desc":
        copy.sort(
          (a, b) =>
            Number(b.priceRange.minVariantPrice.amount) -
            Number(a.priceRange.minVariantPrice.amount),
        );
        break;
      case "newest":
        copy.sort(
          (a, b) =>
            (b.createdAt ? Date.parse(b.createdAt) : 0) -
            (a.createdAt ? Date.parse(a.createdAt) : 0),
        );
        break;
      case "popular":
        copy.sort((a, b) => {
          const score = (p: Product) =>
            (p.tags.includes("limited") ? 2 : 0) +
            (p.tags.includes("core") ? 1 : 0);
          return score(b) - score(a);
        });
        break;
      default:
        break;
    }
    return copy;
  }, [category, sort, products]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="-mx-2 overflow-x-auto">
          <div className="flex items-center gap-2 px-2">
            <FilterChip
              label="Alla plagg"
              active={category === "all"}
              onClick={() => setCategory("all")}
            />
            {siteConfig.productCategories.map((cat) => (
              <FilterChip
                key={cat.handle}
                label={cat.label}
                active={category === cat.handle}
                onClick={() => setCategory(cat.handle)}
              />
            ))}
          </div>
        </div>
        <label className="flex items-center gap-3 self-end text-xs uppercase tracking-[0.25em] text-ice-50/60">
          Sortera
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-ice-50 focus:border-ice focus:outline-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-ink">
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <motion.div
        key={`${category}-${sort}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {filtered.length === 0 ? (
          <p className="col-span-full py-16 text-center text-sm text-ice-50/60">
            Inget att visa här just nu — nästa drop snart.
          </p>
        ) : (
          filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              priority={i < 4}
            />
          ))
        )}
      </motion.div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "whitespace-nowrap rounded-full border px-4 py-2 font-display text-xs uppercase tracking-[0.25em] transition",
        active
          ? "border-ice bg-ice text-ink shadow-ice"
          : "border-white/10 bg-white/5 text-ice-50/70 hover:border-ice/50 hover:text-ice",
      )}
    >
      {label}
    </button>
  );
}
