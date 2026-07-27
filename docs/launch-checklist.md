# IC3SWEDEN — checklista inför release 1 augusti 2026

Uppdaterad 2026-07-27 efter full genomgång av sajt + Shopify. Sorterad efter
risk. ✅ = klart och verifierat i produktion.

---

## Klart och verifierat (2026-07-27)

- ✅ **Produkten syns men går inte att köpa.** Face-Off Cap är publicerad till
  Headless-kanalen och visas på sajten med bilder, 360°-vy och pris 299 kr.
  Köpknappen visar "Släpps 1 augusti" och både knapp och `/api/checkout` är
  låsta av `RELEASE_DATE` i `src/lib/site.ts` — låset öppnas automatiskt
  2026-08-01 kl 00:00 svensk tid, ingen deploy behövs.
- ✅ **Trasiga produktlänkar lagade.** Sajten länkade till `/products/face-off-cap`
  men Shopify-handtaget är `drop-01-face-off-cap` → hero-CTA:erna 404:ade och
  `/drop-01` var en hel-sides-404. Handtaget ligger nu i
  `FEATURED_PRODUCT_HANDLE` (`src/lib/site.ts`), sidorna löser det ur
  katalogen, och den gamla adressen 308-redirectar.
- ✅ **Om oss-bilderna.** Tre av fyra pekade på filer som aldrig funnits
  (`team-1..3.jpg`). Nu: `grundarna/laget/mission/vision.jpg` i
  `public/images/om-oss/`, rätt bildformat per sektion, riktiga alt-texter.
- ✅ **Canonical per sida.** Root-layouten pekade varje sidas canonical mot
  startsidan — allvarligaste SEO-felet. Varje sida har nu sin egen.
- ✅ **Strukturerad data.** Produkten rapporterade "InStock" trots stängd kassa;
  nu `PreOrder` + `availabilityStarts` fram till releasen.
- ✅ **Formulärskydd.** Rate limiting (5/min per IP) + honeypot på
  `/api/contact` och `/api/newsletter`.
- ✅ **Redirects** för gamla `*.html`-sajten, `/collections`, `/pages` m.m.
- ✅ **Kassalåset i varukorgen** — "Kassan öppnar 1 augusti" istället för rått fel.
- ✅ **3D-scenen kan inte fälla sidan** — lokala reflektioner istället för
  extern HDR + felgräns.
- ✅ **Skyddsnät:** tom Storefront-respons visar lokal katalog (ej köpbar)
  istället för 404.
- ✅ **orders/paid-webhook** (HMAC-verifierad, idempotent) driftsatt men vilande
  tills `SHOPIFY_WEBHOOK_SECRET` sätts — grunden för egen fraktautomation.

---

## Kvar att göra — kräver Shopify-admin eller beslut (ägare: Riccardo)

### A. Frakt/PostNord — testa skarpt FÖRE 1 augusti (högsta risk)

PostNord by SYNKA+ är installerad och kopplingen är AKTIV i båda ändar
(avsändare Ferdin Sweden AB #20969705, tjänst Home Small Prio/Varubrev mappad
mot fraktsättet "Standard 2-4 arbetsdagar", BAS-plan aktiv). **Men** vid testet
14 juli visade appens Orderlista 0 ordrar och etikettutskrift gav 500-fel för
en API-importerad testorder. Oklart om felet gäller riktiga checkout-ordrar.

1. Mejla SYNKA+ support nu (dagar av svarstid kvar): beskriv 500-felet vid
   etikettutskrift + tom orderlista. (Utkast: se `docs/postnord-integration.md`.)
2. Lägg en riktig testorder via kassan (aktivera testläge i Shopify Payments,
   eller sätt 1 st lager + 100% rabattkod och köp själv) och verifiera hela
   kedjan: order → syns i SYNKA+ → etikett skrivs ut → spårningsnummer på
   ordern → leveransmejl till kund.
3. Funkar inte SYNKA+ i tid: releasen klarar sig med manuella etiketter i
   PostNord Portal (250 ex är hanterbart), fixa automationen vecka 1.

### B. Släppet 1 augusti — gör i Shopify-admin

- [ ] **Sätt lagersaldot** på Face-Off Cap (styr köpbarheten; sajtens lås
      öppnas automatiskt vid midnatt).
- [ ] Webbshop-kanalen (shop.ic3sweden.se) republiceras schemalagt
      2026-07-31 kl 22:00 UTC — redan inlagt. **Shop- och Köpknapp-kanalerna
      stödjer inte schemaläggning** — publicera manuellt efter releasen om de
      ska användas.
- [ ] **Swish:** kräver "Verifiera identitet" med BankID i Shopify Payments —
      bara du kan göra det. Klarna är redan aktiv.
- [ ] **Bocka ur den förikryssade marknadsförings-checkboxen i kassan**
      (GDPR-risk med pre-checkad consent).
- [ ] Momssats 25 % och att 299 kr är inkl. moms.
- [ ] Orderbekräftelse/leveransmejl på svenska.
- [ ] Ett skarpt köp direkt efter midnatt 1 augusti som slutverifiering.

### C. Juridik — uppgifter som saknas på sajten (lagkrav)

- [ ] **Organisationsnummer** för Ferdin Sweden AB — saknas helt.
- [ ] **Postadress** — saknas helt.
- [ ] Hänvisning till **ARN + EU:s ODR-plattform** för tvister.
- [ ] Skriv ut faktiska **betalmetoder** i villkoren när Swish-frågan är löst.
- [ ] Ångerrätt: ange att 14 dagar räknas från mottagandet + länka
      Konsumentverkets ångerblankett.

### D. Beslut (inte blockerande)

- [ ] "Fri frakt över 799 kr" när enda produkten kostar 299 kr — avsiktligt
      (flerköp) eller arv? Fraktkostnad ska ändå framgå före kassan.
- [ ] Nyhetsbrevet är single opt-in — double opt-in kräver Shopify Email/
      Klaviyo. Rekommenderas men är ett verktygsbeslut.
- [ ] Sitemap inskickad i Google Search Console (nu när canonical-felet är
      lagat är det värt att skicka in på nytt).

---

## Fraktautomation — vald väg

Se `docs/postnord-integration.md` för hela resonemanget. Kort:

1. **Nu → 1 aug:** SYNKA+ (redan installerad) sköter order → etikett →
   spårningsnummer. Verifiera med skarp testorder (punkt A).
2. **Fallback:** manuella etiketter i PostNord Portal.
3. **Senare, vid behov:** egen integration mot PostNord Booking API — den
   fraktbolagsoberoende halvan (verifierad orders/paid-webhook) är redan
   driftsatt och loggar exakt den nyttolast en bokning behöver.
