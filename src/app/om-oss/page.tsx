import type { Metadata } from "next";
import Image from "next/image";

import { RevealSection } from "@/components/reveal-section";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Historien bakom IC3 — tre barndomsvänner som översatte hockeykulturen till svensk streetwear.",
};

type Section = {
  badge: string;
  title: string;
  body: string[];
  image: string;
  align: "left" | "right";
  /** "cover" = fyll bildrutan (croppar), "contain" = visa hela bilden */
  fit?: "cover" | "contain";
  /** Custom aspect ratio class — default is aspect-[4/5] */
  aspect?: string;
};

const sections: Section[] = [
  {
    badge: "Vår historia",
    title: "Från hockeytejp till streetwear",
    body: [
      "IC3 föddes ur kalla hallar, sena kvällar och slitna skridskor.",
      "Vi är tre barndomsvänner som växte upp med hockey som vår gemensamma drivkraft. Vi delade allt — morgonpass på frusna isar, bussresor till bortamatcher och timmar i omklädningsrum som luktade tejp, svett och framtidsdrömmar.",
      "Men när vi klev av isen saknades något. Det fanns tröjor med klubbmärken och jackor med sponsorer — men inget som speglade hockeylivet på riktigt. Så vi skapade IC3.",
    ],
    image: "/images/brand/Hemsida-1.JPG",
    align: "left",
    // Mindre inzoomad — bredare format + contain så hela bilden syns
    aspect: "aspect-[4/3]",
    fit: "contain",
  },
  {
    badge: "Bakgrund",
    title: "Tre personligheter, ett lag",
    body: [
      "Namnet IC3 står för tre grundare — tre personligheter, ett gemensamt mål.",
      "Vi har olika roller idag — design, marknadsföring och vision — men vi har alltid varit ett lag.",
      "Vi delar minnet av kalla morgnar, slitna handskar och drömmen om att skapa något som lever längre än sista perioden.",
    ],
    image: "/images/om-oss/team-1.jpg",
    align: "right",
  },
  {
    badge: "Mission",
    title: "Vi bygger inte bara kläder. Vi bygger kultur.",
    body: [
      "IC3 är mer än ett varumärke — det är en identitet för nästa generations hockeyälskare.",
      "Vi vill förena hockeyns rötter med ett modernt uttryck — där varje plagg bär på känslan av att tillhöra något större.",
      "Kläder som låter dig bära ditt hockeyhjärta med stolthet, oavsett om du är på väg till match, träning eller stan.",
    ],
    image: "/images/om-oss/team-2.jpg",
    align: "left",
  },
  {
    badge: "Vision",
    title: "Vi klär kulturen, inte bara spelarna.",
    body: [
      "IC3 ska vara det självklara valet för den urbana hockeygenerationen.",
      "Vår vision är att bygga ett internationellt varumärke där unga människor känner sig sedda, inspirerade och representerade.",
      "För oss handlar det om gemenskap, stil och att aldrig vika sig. IC3 är för dem som förstår att hockey inte bara är en sport — det är ett sätt att leva.",
    ],
    image: "/images/om-oss/team-3.jpg",
    align: "right",
  },
];

export default function AboutPage() {
  return (
    <div className="relative pb-24 pt-40">
      <div className="container-x px-6 md:px-10">
        <header className="max-w-3xl">
          <span className="chip">Om IC3</span>
          <h1 className="mt-6 display-heading text-5xl text-ice-50 md:text-8xl">
            Vilka är vi?
          </h1>
          <p className="mt-6 text-base text-ice-50/70 md:text-lg">
            Tre barndomsvänner. Tre perspektiv. Ett gemensamt mål: att ta med sig
            hockeykulturen ut från hallen och klä en hel generation i den.
          </p>
        </header>

        <div className="mt-24 flex flex-col gap-24">
          {sections.map((sec) => {
            const aspect = sec.aspect ?? "aspect-[4/5]";
            const fit = sec.fit === "contain" ? "object-contain" : "object-cover";
            return (
              <RevealSection
                key={sec.title}
                className="grid gap-10 md:grid-cols-12 md:items-center"
              >
                <div
                  className={
                    sec.align === "left"
                      ? "md:col-span-5 md:order-1"
                      : "md:col-span-5 md:order-2"
                  }
                >
                  <div
                    className={`relative ${aspect} overflow-hidden rounded-sm bg-white/5`}
                  >
                    <Image
                      src={sec.image}
                      alt={sec.title}
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className={fit}
                    />
                  </div>
                </div>
                <div
                  className={
                    sec.align === "left"
                      ? "md:col-span-7 md:order-2"
                      : "md:col-span-7 md:order-1"
                  }
                >
                  <span className="chip">{sec.badge}</span>
                  <h2 className="mt-5 display-heading text-4xl leading-tight text-ice-50 md:text-6xl">
                    {sec.title}
                  </h2>
                  <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-ice-50/75 md:text-lg">
                    {sec.body.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </div>
  );
}
