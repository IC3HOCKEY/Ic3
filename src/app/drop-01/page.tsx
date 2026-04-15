import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RevealSection } from "@/components/reveal-section";
import { getProduct } from "@/lib/shopify";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Drop 01 — Face-Off Cap",
  description:
    "Drop 01 är IC3:s premiärdropp — den limiterade Face-Off Cap. 250 exemplar, designat i Stockholm, inspirerat av den svenska hockeykulturen.",
};

export const revalidate = 60;

export default async function Drop01Page() {
  const product = await getProduct("face-off-cap");
  if (!product) notFound();

  return (
    <div className="relative pb-24">
      <section className="relative flex min-h-[88vh] items-center overflow-hidden pt-32">
        <Image
          src="/images/limited-drop/KepsD1.jpeg"
          alt="IC3 Drop 01 — Face-Off Cap"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover opacity-60"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/30 via-ink/60 to-ink" />
        <div className="container-x px-6 md:px-10">
          <span className="chip">Drop 01 · 250 numrerade</span>
          <h1 className="mt-6 display-heading text-[clamp(3rem,12vw,9rem)] leading-none text-ice-50">
            Face-Off
            <br />
            <span className="shimmer-text">Cap</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-ice-50/80 md:text-lg">
            Vår premiärkeps är en kärleksförklaring till hockeyns kultur. En
            strukturerad 6-panel, broderad IC3-logotyp, curved brim och
            metallspänne i borstat stål. Numrerad, signerad och byggd för att
            hålla.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <p className="font-mono text-xl text-ice">
              {formatMoney(product.priceRange.minVariantPrice)}
            </p>
            <Link
              href={`/products/${product.handle}`}
              className="btn btn-primary"
            >
              Öppna produkten
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-12 px-6 md:grid-cols-3 md:px-10">
          {[
            {
              k: "01",
              t: "Designat",
              d: "Ritat i Stockholm tillsammans med tre barndomsvänner som alla spelat hockey.",
            },
            {
              k: "02",
              t: "Byggt",
              d: "100 % bomullstwill, broderad frontpatch och nickelfritt metallspänne.",
            },
            {
              k: "03",
              t: "Limiterat",
              d: "250 exemplar. När de är slut släpps kepsen aldrig igen i samma färg.",
            },
          ].map((item) => (
            <RevealSection key={item.k} className="border-t border-white/10 pt-6">
              <p className="display-heading text-3xl text-ice">{item.k}</p>
              <h2 className="mt-4 display-heading text-2xl text-ice-50">
                {item.t}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ice-50/70">
                {item.d}
              </p>
            </RevealSection>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-4 px-6 md:grid-cols-4 md:px-10">
          {[
            "/images/limited-drop/KepsD2.jpeg",
            "/images/limited-drop/KepsD3.jpeg",
            "/images/limited-drop/KepsD4.jpeg",
            "/images/limited-drop/KepsD5.jpeg",
            "/images/limited-drop/KepsD6.jpeg",
            "/images/limited-drop/KepsD7.jpeg",
            "/images/limited-drop/KepsD.jpeg",
            "/images/limited-drop/KepsD1.jpeg",
          ].map((src, i) => (
            <RevealSection
              key={src}
              delay={i * 0.04}
              className="relative aspect-square overflow-hidden"
            >
              <Image
                src={src}
                alt="Drop 01 editorial"
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition duration-700 hover:scale-105"
              />
            </RevealSection>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-x px-6 md:px-10">
          <RevealSection className="mx-auto max-w-3xl rounded border border-white/10 bg-white/5 p-10 text-center">
            <h2 className="display-heading text-4xl text-ice-50 md:text-5xl">
              Inget Drop 02 — men möjlig restock
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ice-50/70 md:text-base">
              Vi planerar inget Drop 02 i nuläget. Däremot utvärderar vi en
              restock av Face-Off Cap. Anmäl ditt intresse så hör vi av oss
              först om kepsen kommer tillbaka.
            </p>
            <Link href="/kontakt" className="btn btn-primary mt-8">
              Anmäl intresse för restock
            </Link>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
