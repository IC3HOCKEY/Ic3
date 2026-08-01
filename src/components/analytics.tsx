"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

/**
 * Google Analytics 4 för den headless-butiken.
 *
 * Varför den här filen behövs: Shopifys egen statistik ser bara sessioner som
 * når Shopify-kassan. Allt som händer på ic3sweden.se — startsida, produktsida,
 * varifrån trafiken kommer — är helt osynligt för Shopify. Utan GA vet vi
 * alltså inte hur många som besöker sajten, bara hur många som redan bestämt
 * sig. Det gör all marknadsföring omöjlig att mäta.
 *
 * Aktiveras bara när NEXT_PUBLIC_GA_ID är satt, så en glömd env-variabel ger
 * en tyst no-op istället för en krasch.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Skickar ett GA4-event. Säker att anropa även när GA inte är konfigurerat. */
export function trackEvent(
  name: string,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

/**
 * App Router gör klientnavigering utan sidladdning, så GA:s automatiska
 * page_view missar allt utom första sidan. Vi skickar därför page_view själva
 * vid varje ruta.
 */
function PageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID || !window.gtag) return;
    const query = searchParams.toString();
    window.gtag("event", "page_view", {
      page_path: query ? `${pathname}?${query}` : pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          // send_page_view: false — vi skickar page_view själva i PageViews(),
          // annars dubbelräknas första sidan.
          gtag('config', '${GA_ID}', { send_page_view: false, anonymize_ip: true });
        `}
      </Script>
      {/* useSearchParams kräver en Suspense-gräns för att inte tvinga
          hela trädet till dynamisk rendering. */}
      <Suspense fallback={null}>
        <PageViews />
      </Suspense>
    </>
  );
}
