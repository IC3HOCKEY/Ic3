"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  index?: number;
};

export function ProductCard({ product, priority, index = 0 }: ProductCardProps) {
  const primary = product.featuredImage ?? product.images[0] ?? null;
  const secondary = product.images.find((img) => img.url !== primary?.url) ?? primary;
  const soldOut = !product.availableForSale;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.05, 0.4),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative flex flex-col"
    >
      <Link
        href={`/products/${product.handle}`}
        className="relative block aspect-[4/5] overflow-hidden bg-white/5"
      >
        {primary ? (
          <Image
            src={primary.url}
            alt={primary.altText ?? product.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            priority={priority}
            className="object-cover transition duration-700 will-change-transform group-hover:scale-[1.04]"
          />
        ) : null}
        {secondary && secondary !== primary ? (
          <Image
            src={secondary.url}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="absolute inset-0 object-cover opacity-0 transition duration-500 group-hover:opacity-100"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-70" />
        {soldOut ? (
          <span className="absolute left-4 top-4 rounded-full bg-ink/75 px-3 py-1 font-display text-[0.65rem] tracking-[0.3em] text-ember">
            Slut i lager
          </span>
        ) : null}
        {product.tags.includes("limited") ? (
          <span className="absolute right-4 top-4 rounded-full border border-ice/50 bg-ink/70 px-3 py-1 font-display text-[0.65rem] tracking-[0.3em] text-ice">
            Limited
          </span>
        ) : null}
        <span className="pointer-events-none absolute inset-x-4 bottom-4 flex translate-y-3 items-center justify-between text-xs uppercase tracking-[0.25em] text-ice-50/80 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Visa produkt
          <span aria-hidden>→</span>
        </span>
      </Link>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <Link
            href={`/products/${product.handle}`}
            className="font-display text-lg uppercase tracking-[0.12em] text-ice-50 transition hover:text-ice"
          >
            {product.title}
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-ice-50/50">
            {product.tags
              .filter((t) => t !== "core" && t !== "limited")
              .slice(0, 2)
              .join(" · ") || "IC3 Essentials"}
          </p>
        </div>
        <p className="font-mono text-sm text-ice-50">
          {formatMoney(product.priceRange.minVariantPrice)}
        </p>
      </div>
    </motion.article>
  );
}
