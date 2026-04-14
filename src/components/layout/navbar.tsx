"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { siteConfig } from "@/lib/site";
import { cx } from "@/lib/format";

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-ink/80 backdrop-blur-md border-b border-white/5 shadow-glass"
          : "bg-transparent",
      )}
    >
      <div className="bg-ice/10 text-[0.72rem] uppercase tracking-[0.3em] text-ice-50/90 py-2 text-center font-display">
        <span className="inline-block px-4">
          Fri frakt över 799 kr · Drop 02 laddar snart
        </span>
      </div>

      <nav
        aria-label="Primary"
        className="container-x flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10"
      >
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={`${siteConfig.name} hem`}
        >
          <Image
            src="/images/brand/Loga-ic3.png"
            alt={`${siteConfig.name} logotyp`}
            width={48}
            height={48}
            priority
            className="h-9 w-9 object-contain sm:h-11 sm:w-11"
          />
          <span className="display-heading text-xl sm:text-2xl text-ice-50">
            {siteConfig.name}
          </span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cx(
                    "relative text-sm tracking-[0.25em] uppercase font-display transition",
                    active ? "text-ice" : "text-ice-50/75 hover:text-ice",
                  )}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-2 left-0 right-0 h-[2px] bg-ice shadow-ice"
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCart}
            aria-label="Öppna varukorg"
            className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ice-50 transition hover:border-ice hover:text-ice"
          >
            <CartIcon />
            <AnimatePresence>
              {itemCount > 0 ? (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ice px-1 text-[0.65rem] font-bold text-ink"
                >
                  {itemCount}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Öppna meny"
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ice-50 lg:hidden"
          >
            <BurgerIcon open={mobileOpen} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-white/5 bg-ink/95 backdrop-blur-lg"
          >
            <ul className="container-x flex flex-col gap-4 px-6 py-6">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="display-heading text-3xl text-ice-50 hover:text-ice"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M4 6h16l-1.5 11.5a2 2 0 0 1-2 1.5h-9a2 2 0 0 1-2-1.5L4 6Z" />
      <path d="M8 6V5a4 4 0 0 1 8 0v1" />
    </svg>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h10" />
        </>
      )}
    </svg>
  );
}
