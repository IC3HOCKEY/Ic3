import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { Faq } from "@/components/faq";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontakta IC3 — frågor om order, samarbeten eller press. Vi svarar inom 24h på vardagar.",
};

const faqItems = [
  {
    q: "När skickas min beställning?",
    a: "Beställningar packas och skickas inom 1–3 arbetsdagar. Du får ett spårningsnummer via mejl så fort paketet lämnat vår studio.",
  },
  {
    q: "Vad kostar frakt?",
    a: "Fri frakt inom Sverige vid order över 799 kr. Under det är standardfrakt 59 kr. Internationell frakt räknas ut i kassan.",
  },
  {
    q: "Har ni retur?",
    a: "Ja — 14 dagars ångerrätt enligt svensk lag. Plaggen ska vara oanvända och i originalskick. Kunden står för returfrakt.",
  },
  {
    q: "Hur vet jag när nästa drop släpps?",
    a: "Anmäl dig till nyhetsbrevet i sidfoten eller följ oss på Instagram och TikTok — vi announcar varje drop 48h i förväg där.",
  },
  {
    q: "Jag vill samarbeta / göra content — vart vänder jag mig?",
    a: "Mejla ic3.kontakt@outlook.com med rubriken 'Samarbete'. Berätta kort om dig och din plattform så återkommer vi.",
  },
];

export default function ContactPage() {
  return (
    <div className="relative pb-24 pt-40">
      <div className="container-x grid gap-16 px-6 md:grid-cols-2 md:px-10">
        <header className="flex flex-col justify-between gap-12">
          <div>
            <span className="chip">Kontakt</span>
            <h1 className="mt-6 display-heading text-5xl text-ice-50 md:text-7xl">
              Säg hej
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ice-50/75">
              Frågor om order, passform, samarbeten eller press? Skicka ett
              meddelande så hör vi av oss inom 24h på vardagar.
            </p>
          </div>
          <div className="flex flex-col gap-4 text-sm text-ice-50/75">
            <InfoRow label="E-post" value={siteConfig.email} href={`mailto:${siteConfig.email}`} />
            <InfoRow
              label="Instagram"
              value="@ic3sweden"
              href={siteConfig.social.instagram}
            />
            <InfoRow
              label="TikTok"
              value="@ic3sweden"
              href={siteConfig.social.tiktok}
            />
            <InfoRow label="Bolag" value={`${siteConfig.legalEntity}, Stockholm`} />
          </div>
        </header>
        <section aria-label="Kontaktformulär">
          <ContactForm />
        </section>
      </div>

      <section className="section">
        <div className="container-x px-6 md:px-10">
          <div className="mb-10 flex flex-col gap-4">
            <span className="chip">FAQ</span>
            <h2 className="display-heading text-4xl text-ice-50 md:text-6xl">
              Vanliga frågor
            </h2>
          </div>
          <Faq items={faqItems} />
        </div>
      </section>
    </div>
  );
}

function InfoRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <span className="flex flex-col">
      <span className="text-[0.65rem] uppercase tracking-[0.35em] text-ice-50/50">
        {label}
      </span>
      <span className="mt-1 font-display text-lg text-ice-50 group-hover:text-ice">
        {value}
      </span>
    </span>
  );
  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
        className="group border-l border-white/10 pl-4 transition hover:border-ice"
      >
        {content}
      </a>
    );
  }
  return <div className="border-l border-white/10 pl-4">{content}</div>;
}
