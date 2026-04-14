import Image from "next/image";
import Link from "next/link";

import { NewsletterForm } from "@/components/newsletter-form";
import { siteConfig } from "@/lib/site";

const linkClasses =
  "text-sm uppercase tracking-[0.2em] text-ice-50/70 hover:text-ice transition";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-ink">
      <div className="container-x px-6 pb-12 pt-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/images/brand/Loga-ic3.png"
                alt={`${siteConfig.name} logotyp`}
                width={56}
                height={56}
                className="h-12 w-12 object-contain"
              />
              <span className="display-heading text-3xl text-ice-50">
                {siteConfig.name}
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-ice-50/70">
              {siteConfig.description}
            </p>
            <NewsletterForm />
          </div>

          <div className="md:col-span-3">
            <h3 className="display-heading text-sm tracking-[0.3em] text-ice">
              Shop
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {siteConfig.productCategories.map((cat) => (
                <li key={cat.handle}>
                  <Link
                    href={`/shop?category=${cat.handle}`}
                    className={linkClasses}
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="display-heading text-sm tracking-[0.3em] text-ice">
              Brand
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <Link href="/om-oss" className={linkClasses}>
                  Om oss
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className={linkClasses}>
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/legal/villkor" className={linkClasses}>
                  Villkor
                </Link>
              </li>
              <li>
                <Link href="/legal/integritet" className={linkClasses}>
                  Integritet
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className={linkClasses}>
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="display-heading text-sm tracking-[0.3em] text-ice">
              Connect
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <a href={`mailto:${siteConfig.email}`} className={linkClasses}>
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs tracking-[0.25em] uppercase text-ice-50/50 md:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalEntity}. Built cold.
          </p>
          <p className="text-ice-50/80">{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
