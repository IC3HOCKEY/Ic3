"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { useCart } from "@/components/cart/cart-provider";
import { Turntable } from "@/components/product/turntable";
import { formatMoney, cx } from "@/lib/format";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
};

export function ProductView({ product }: Props) {
  const { addLine } = useCart();
  const options = product.options;
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const opt of options) initial[opt.name] = opt.values[0];
    // align with first available variant if possible
    const firstAvailable = product.variants.find((v) => v.availableForSale);
    (firstAvailable ?? product.variants[0])?.selectedOptions.forEach((s) => {
      initial[s.name] = s.value;
    });
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [view, setView] = useState<"gallery" | "turntable">("turntable");
  const [addedPulse, setAddedPulse] = useState(false);

  const currentVariant = useMemo(() => {
    return (
      product.variants.find((v) =>
        v.selectedOptions.every((s) => selected[s.name] === s.value),
      ) ?? product.variants[0]
    );
  }, [product.variants, selected]);

  const turntableImages = product.turntableImages ?? product.images;
  const galleryImages = product.images;
  const price = currentVariant?.price ?? product.priceRange.minVariantPrice;
  const soldOut = !currentVariant?.availableForSale;

  function onAdd() {
    if (!currentVariant) return;
    addLine({
      variantId: currentVariant.id,
      productHandle: product.handle,
      productId: product.id,
      title: product.title,
      variantTitle: currentVariant.title,
      quantity,
      price: currentVariant.price,
      image:
        currentVariant.image ??
        product.featuredImage ??
        product.images[0] ??
        null,
    });
    setAddedPulse(true);
    window.setTimeout(() => setAddedPulse(false), 1000);
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <ToggleButton
            active={view === "turntable"}
            onClick={() => setView("turntable")}
          >
            360° viewer
          </ToggleButton>
          <ToggleButton
            active={view === "gallery"}
            onClick={() => setView("gallery")}
          >
            Galleri
          </ToggleButton>
        </div>

        {view === "turntable" ? (
          <Turntable images={turntableImages} name={product.title} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {galleryImages.map((img, i) => (
              <div
                key={img.url + i}
                className="relative aspect-square overflow-hidden rounded-sm bg-white/5"
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? product.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-8">
        <header>
          <span className="chip">
            {product.tags.includes("limited")
              ? "Limited drop"
              : "IC3 core"}
          </span>
          <h1 className="mt-5 display-heading text-4xl leading-tight text-ice-50 md:text-6xl">
            {product.title}
          </h1>
          <p className="mt-4 font-mono text-lg text-ice">
            {formatMoney(price)}
            <span className="ml-3 text-xs tracking-[0.25em] text-ice-50/50">
              inkl. moms
            </span>
          </p>
        </header>

        <p className="text-base leading-relaxed text-ice-50/80">
          {product.description}
        </p>

        {options.map((opt) => (
          <div key={opt.name} className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-ice-50/70">
              <span>{opt.name === "Size" ? "Storlek" : opt.name}</span>
              <span>{selected[opt.name]}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {opt.values.map((value) => {
                const active = selected[opt.name] === value;
                const enabled = product.variants.some(
                  (v) =>
                    v.availableForSale &&
                    v.selectedOptions.every((s) =>
                      s.name === opt.name
                        ? s.value === value
                        : selected[s.name] === s.value,
                    ),
                );
                return (
                  <button
                    key={value}
                    type="button"
                    disabled={!enabled}
                    onClick={() =>
                      setSelected((prev) => ({ ...prev, [opt.name]: value }))
                    }
                    className={cx(
                      "min-w-[3rem] rounded-sm border px-4 py-2 font-display text-sm uppercase tracking-[0.2em] transition",
                      active
                        ? "border-ice bg-ice text-ink"
                        : enabled
                          ? "border-white/10 bg-white/5 text-ice-50 hover:border-ice"
                          : "cursor-not-allowed border-white/5 bg-white/5 text-ice-50/30 line-through",
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-0 rounded-full border border-white/10">
            <button
              type="button"
              aria-label="Minska antal"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-11 w-11 text-ice-50/80 hover:text-ice"
            >
              −
            </button>
            <span className="w-10 text-center font-mono text-ice-50">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Öka antal"
              onClick={() => setQuantity((q) => q + 1)}
              className="h-11 w-11 text-ice-50/80 hover:text-ice"
            >
              +
            </button>
          </div>
          <motion.button
            type="button"
            onClick={onAdd}
            disabled={soldOut}
            animate={addedPulse ? { scale: [1, 1.03, 1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
            className={cx("btn flex-1", soldOut ? "btn-ghost" : "btn-primary")}
          >
            {soldOut ? "Slut i lager" : addedPulse ? "Tillagd ✓" : "Lägg i varukorg"}
          </motion.button>
        </div>

        <div className="grid gap-6 border-t border-white/5 pt-8">
          <details className="group" open>
            <summary className="flex cursor-pointer items-center justify-between font-display text-sm uppercase tracking-[0.3em] text-ice-50/80 hover:text-ice">
              Material & passform
              <span className="ml-auto transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 text-sm leading-relaxed text-ice-50/70">
              Huvudmaterial i premiumkvalitet. Rengör kallt, vänd ut och in vid
              tvätt. Skapad för att mjukna med bärandet. Passform och storlek
              finns i storleksguiden nedan.
            </p>
          </details>
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between font-display text-sm uppercase tracking-[0.3em] text-ice-50/80 hover:text-ice">
              Frakt & retur
              <span className="ml-auto transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 text-sm leading-relaxed text-ice-50/70">
              Fri frakt på order över 799 kr inom Sverige. 14 dagars ångerrätt
              enligt svensk lag. Returfrakt bekostas av kunden.
            </p>
          </details>
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between font-display text-sm uppercase tracking-[0.3em] text-ice-50/80 hover:text-ice">
              Storleksguide
              <span className="ml-auto transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-4 overflow-hidden rounded border border-white/5">
              <table className="w-full text-left text-xs uppercase tracking-[0.18em] text-ice-50/70">
                <thead className="bg-white/5 text-ice">
                  <tr>
                    <th className="px-4 py-2">Storlek</th>
                    <th className="px-4 py-2">Bröst (cm)</th>
                    <th className="px-4 py-2">Längd (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/5">
                    <td className="px-4 py-2">S</td>
                    <td className="px-4 py-2">104</td>
                    <td className="px-4 py-2">70</td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td className="px-4 py-2">M</td>
                    <td className="px-4 py-2">110</td>
                    <td className="px-4 py-2">72</td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td className="px-4 py-2">L</td>
                    <td className="px-4 py-2">116</td>
                    <td className="px-4 py-2">74</td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td className="px-4 py-2">XL</td>
                    <td className="px-4 py-2">122</td>
                    <td className="px-4 py-2">76</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-full border px-4 py-1.5 font-display text-[0.65rem] uppercase tracking-[0.3em] transition",
        active
          ? "border-ice bg-ice text-ink"
          : "border-white/10 bg-white/5 text-ice-50/70 hover:border-ice/50",
      )}
    >
      {children}
    </button>
  );
}
