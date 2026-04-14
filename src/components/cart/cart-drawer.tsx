"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { formatMoney } from "@/lib/format";

export function CartDrawer() {
  const {
    lines,
    isOpen,
    subtotal,
    closeCart,
    updateQuantity,
    removeLine,
    itemCount,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCheckout() {
    if (!lines.length) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            merchandiseId: l.variantId,
            quantity: l.quantity,
          })),
        }),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? "Kunde inte skapa checkout.");
      }
      const json = (await res.json()) as { checkoutUrl?: string };
      if (!json.checkoutUrl) throw new Error("Ingen checkout-url mottagen.");
      window.location.href = json.checkoutUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Något gick fel i kassan.",
      );
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="cart-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-ink/75 backdrop-blur-sm"
          onClick={closeCart}
          aria-hidden="true"
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Varukorg"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.35,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="absolute right-0 top-0 h-full w-full max-w-md overflow-hidden bg-ink shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full flex-col">
              <header className="flex items-center justify-between border-b border-white/5 px-6 py-5">
                <div>
                  <p className="display-heading text-[0.7rem] tracking-[0.3em] text-ice/80">
                    Din varukorg
                  </p>
                  <h2 className="display-heading text-2xl text-ice-50">
                    {itemCount} plagg
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ice-50 hover:border-ice hover:text-ice"
                  aria-label="Stäng varukorg"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </svg>
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                {lines.length === 0 ? (
                  <EmptyState onClose={closeCart} />
                ) : (
                  <ul className="flex flex-col gap-6">
                    {lines.map((line) => (
                      <li
                        key={line.variantId}
                        className="flex gap-4 border-b border-white/5 pb-6"
                      >
                        <div className="relative h-24 w-20 flex-none overflow-hidden rounded-md bg-white/5">
                          {line.image ? (
                            <Image
                              src={line.image.url}
                              alt={line.image.altText ?? line.title}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link
                                href={`/products/${line.productHandle}`}
                                onClick={closeCart}
                                className="font-display text-lg uppercase text-ice-50 hover:text-ice"
                              >
                                {line.title}
                              </Link>
                              <p className="text-xs uppercase tracking-[0.25em] text-ice-50/50">
                                {line.variantTitle}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLine(line.variantId)}
                              className="text-xs uppercase tracking-[0.25em] text-ice-50/50 hover:text-ember"
                              aria-label={`Ta bort ${line.title}`}
                            >
                              Ta bort
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <QtyControl
                              qty={line.quantity}
                              onInc={() =>
                                updateQuantity(
                                  line.variantId,
                                  line.quantity + 1,
                                )
                              }
                              onDec={() =>
                                updateQuantity(
                                  line.variantId,
                                  line.quantity - 1,
                                )
                              }
                            />
                            <p className="font-mono text-sm text-ice-50">
                              {formatMoney({
                                amount: (
                                  Number(line.price.amount) * line.quantity
                                ).toFixed(2),
                                currencyCode: line.price.currencyCode,
                              })}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {lines.length > 0 ? (
                <footer className="border-t border-white/5 bg-ink px-6 py-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="display-heading text-sm tracking-[0.3em] text-ice-50/70">
                      Summa
                    </span>
                    <span className="font-mono text-lg text-ice-50">
                      {formatMoney(subtotal)}
                    </span>
                  </div>
                  <p className="mb-5 text-xs text-ice-50/50">
                    Frakt och moms räknas i Shopify-kassan.
                  </p>
                  {error ? (
                    <p
                      role="alert"
                      className="mb-4 rounded border border-ember/30 bg-ember/10 px-3 py-2 text-xs text-ember"
                    >
                      {error}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={onCheckout}
                    disabled={loading}
                    className="btn btn-primary w-full"
                  >
                    {loading ? "Laddar kassan…" : "Till kassan"}
                  </button>
                </footer>
              ) : null}
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function QtyControl({
  qty,
  onInc,
  onDec,
}: {
  qty: number;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-0 rounded-full border border-white/10">
      <button
        type="button"
        onClick={onDec}
        aria-label="Minska antal"
        className="h-8 w-8 text-ice-50/70 transition hover:text-ice"
      >
        −
      </button>
      <span className="w-6 text-center text-sm font-mono text-ice-50">
        {qty}
      </span>
      <button
        type="button"
        onClick={onInc}
        aria-label="Öka antal"
        className="h-8 w-8 text-ice-50/70 transition hover:text-ice"
      >
        +
      </button>
    </div>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="h-20 w-20 rounded-full border border-dashed border-ice/40" />
      <h3 className="display-heading text-2xl text-ice-50">Korgen är tom</h3>
      <p className="max-w-[22ch] text-sm text-ice-50/60">
        Upptäck senaste droppen och bygg din IC3-uniform.
      </p>
      <Link href="/shop" onClick={onClose} className="btn btn-ghost mt-2">
        Till shoppen
      </Link>
    </div>
  );
}
