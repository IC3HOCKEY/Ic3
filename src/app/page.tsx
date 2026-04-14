import Image from "next/image";
import Link from "next/link";

import { Hero } from "@/components/hero/hero";
import { Marquee } from "@/components/marquee";
import { ProductCard } from "@/components/product-card";
import { RevealSection } from "@/components/reveal-section";
import { getProducts } from "@/lib/shopify";
import { siteConfig } from "@/lib/site";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 4);

  return (
    <>
      <Hero />

      <Marquee
        items={[
          "Cold days. Hot drops.",
          "Face-Off Cap",
          "Made in Sweden",
          "Drop 02 incoming",
          "Hockey roots, urban edge",
        ]}
      />

      <section className="section">
        <div className="container-x">
          <RevealSection>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="chip">Senaste plaggen</span>
                <h2 className="mt-4 display-heading text-4xl text-ice-50 md:text-6xl">
                  Utvalda droppar
                </h2>
                <p className="mt-3 max-w-xl text-sm text-ice-50/60 md:text-base">
                  Handplockade plagg från senaste kollektionen. Limiterade
                  upplagor, släpps sällan, försvinner snabbt.
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.25em] text-ice hover:text-ice-200"
              >
                Se hela shoppen <span aria-hidden>→</span>
              </Link>
            </div>
          </RevealSection>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={i < 2}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section relative overflow-hidden">
        <div className="grid-divider absolute inset-0 -z-10" />
        <div className="container-x grid items-center gap-12 md:grid-cols-2">
          <RevealSection>
            <span className="chip">Drop 01 · Face-Off Cap</span>
            <h2 className="mt-6 display-heading text-5xl text-ice-50 md:text-7xl">
              Född ur <br />
              kalla hallar
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ice-50/70 md:text-lg">
              Drop 01 — Face-Off Cap är vår första limiterade keps. Strukturerad
              6-panel, broderad frontlogga, metallspänne. Producerad i en
              upplaga om 250 exemplar, numrerad för varje bärare.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ice-50/70 md:text-lg">
              Stilren, självsäker och full av attityd — precis som communityn
              bakom märket.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products/face-off-cap" className="btn btn-primary">
                Utforska Face-Off Cap
              </Link>
              <Link href="/om-oss" className="btn btn-ghost">
                Historien bakom IC3
              </Link>
            </div>
          </RevealSection>
          <RevealSection className="relative">
            <div className="relative aspect-square overflow-hidden rounded-sm">
              <Image
                src="/images/limited-drop/KepsD1.jpeg"
                alt="IC3 Face-Off Cap"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden h-44 w-44 overflow-hidden border-4 border-ink bg-white/5 md:block">
              <Image
                src="/images/limited-drop/KepsD4.jpeg"
                alt="IC3 Face-Off Cap detail"
                fill
                sizes="176px"
                className="object-cover"
              />
            </div>
          </RevealSection>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-12 md:grid-cols-12">
          <RevealSection className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/brand/Hemsida-2.png"
                alt="IC3 brand imagery"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </RevealSection>
          <RevealSection className="md:col-span-7 flex flex-col justify-center">
            <span className="chip">Manifestet</span>
            <h2 className="mt-6 display-heading text-5xl text-ice-50 md:text-6xl">
              Vi klär inte bara spelare.
              <br />
              <span className="shimmer-text">Vi klär kulturen.</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ice-50/70 md:text-lg">
              IC3 står för tre grundare — tre personligheter, ett lag. Vi
              översätter känslan av hockeylivet — intensiteten, gemenskapen och
              karaktären — till plagg som bärs lika rätt på läktaren som på
              gatan.
            </p>
            <dl className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                {
                  k: "01",
                  t: "Rooted in Sweden",
                  d: "Designat i Stockholm, producerat i små serier.",
                },
                {
                  k: "02",
                  t: "Made to last",
                  d: "Premiummaterial och förstärkta sömmar.",
                },
                {
                  k: "03",
                  t: "Limited by design",
                  d: "Droppar släpps i numrerade upplagor.",
                },
              ].map((item) => (
                <div key={item.k} className="border-t border-white/10 pt-4">
                  <dt className="display-heading text-3xl text-ice">
                    {item.k}
                  </dt>
                  <dd className="mt-3">
                    <p className="display-heading text-sm tracking-[0.25em] text-ice-50">
                      {item.t}
                    </p>
                    <p className="mt-2 text-sm text-ice-50/60">{item.d}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </RevealSection>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="chip">På isen & på stan</span>
              <h2 className="mt-4 display-heading text-4xl text-ice-50 md:text-6xl">
                IC3 in the wild
              </h2>
            </div>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.25em] text-ice hover:text-ice-200"
            >
              @ic3sweden <span aria-hidden>→</span>
            </a>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
            {[
              "/images/drop1/Drop1-1.jpeg",
              "/images/drop1/Drop1-2.jpeg",
              "/images/drop1/Drop1-3.jpeg",
              "/images/drop1/Drop1-5.jpeg",
              "/images/drop1/Drop1-6.jpeg",
              "/images/drop1/Drop1-7.jpeg",
            ].map((src, i) => (
              <RevealSection
                key={src}
                className="relative aspect-square overflow-hidden"
                delay={i * 0.05}
              >
                <Image
                  src={src}
                  alt="IC3 drop 01 imagery"
                  fill
                  sizes="(min-width: 768px) 16vw, 33vw"
                  className="object-cover transition duration-700 hover:scale-105"
                />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
