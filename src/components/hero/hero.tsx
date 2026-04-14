"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const ParticleField = dynamic(
  () => import("./particle-field").then((m) => m.ParticleField),
  { ssr: false, loading: () => null },
);

const lines = ["Cold days.", "Hot drops."];

export function Hero() {
  return (
    <section
      aria-label="Hero"
      className="relative flex min-h-[88vh] items-center overflow-hidden pt-28"
    >
      <ParticleField />
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-20 mix-blend-screen"
        poster="/images/drop1/Drop1-4.jpeg"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      <div className="container-x relative px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <span className="chip">Drop 01 · Face-Off Cap · Sold Out</span>
          <h1 className="mt-6 display-heading text-[clamp(3rem,10vw,9rem)] leading-none text-ice-50">
            {lines.map((line, idx) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 60, rotateX: -40 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.2 + idx * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block"
              >
                <span className={idx === 1 ? "shimmer-text" : undefined}>
                  {line}
                </span>
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-8 max-w-xl text-base leading-relaxed text-ice-50/80 md:text-lg"
          >
            IC3 är klädmärket för dig som lever för hockeykulturen — på och
            utanför isen. Limiterade droppar, byggda i Sverige. Välkommen dit
            där stil möter is.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link href="/shop" className="btn btn-primary">
              Shoppa kollektionen
            </Link>
            <Link href="/drop-01" className="btn btn-ghost">
              Drop 01 — bakom designen
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="mt-16 grid max-w-xl grid-cols-3 gap-6"
          >
            {[
              { k: "250", v: "Exemplar / drop" },
              { k: "100 %", v: "Svenskt ägt" },
              { k: "24h", v: "Retur fri frakt" },
            ].map((item) => (
              <div key={item.v} className="border-l border-white/10 pl-4">
                <p className="display-heading text-3xl text-ice">{item.k}</p>
                <p className="mt-1 text-[0.7rem] uppercase tracking-[0.3em] text-ice-50/50">
                  {item.v}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-col items-center text-ice-50/60"
        >
          <span className="display-heading text-xs tracking-[0.35em]">
            Scroll
          </span>
          <span className="mt-3 block h-8 w-[1px] bg-gradient-to-b from-ice to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
