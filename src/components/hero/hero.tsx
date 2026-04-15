"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

import { Magnetic } from "@/components/fx/magnetic";
import { TiltCard } from "@/components/fx/tilt-card";

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

      <div className="container-x relative px-6 md:px-10">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-7"
          >
            <span className="chip">Drop 01 · Face-Off Cap · Slutsåld</span>
            <h1 className="mt-6 display-heading text-[clamp(3rem,9vw,8rem)] leading-none text-ice-50">
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
              utanför isen. En limiterad premiärkeps, byggd i Sverige. Face-Off
              Cap är just nu slutsåld — vi utvärderar en restock.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.05 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Magnetic>
                <Link href="/products/face-off-cap" className="btn btn-primary">
                  Se Face-Off Cap
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/drop-01" className="btn btn-ghost">
                  Drop 01 — bakom designen
                </Link>
              </Magnetic>
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
                { k: "1", v: "Limiterad modell" },
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

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5"
          >
            <TiltCard
              intensity={12}
              className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-sm border border-white/10 shadow-[0_25px_80px_-30px_rgba(153,223,251,0.5)]"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/limited-drop/KepsD1.jpeg"
                className="h-full w-full object-cover"
              >
                <source src="/videos/hero-bg.mp4" type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-ice-50/80">
                  Drop 01 / Face-Off Cap
                </span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-ice">
                  ● Live loop
                </span>
              </div>
            </TiltCard>
          </motion.div>
        </div>
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
