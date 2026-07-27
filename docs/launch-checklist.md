# IC3SWEDEN — analys och checklista inför release 1 augusti

Genomgång av sajten och Shopify-uppsättningen. Skriven 2026-07-27, fem dagar
före release. Punkterna är sorterade efter hur mycket de riskerar releasen.

---

## 1. Varför produktsidan visade "OFFSIDE" (åtgärdad i koden)

Detta var grundorsaken till 404-sidan, och den är värd att förstå eftersom
samma sak kan hända igen.

Sajten är driftsatt med `SHOPIFY_STORE_DOMAIN` och
`SHOPIFY_STOREFRONT_ACCESS_TOKEN` satta. Så snart de finns slutar sajten läsa
den lokala katalogen och läser bara Shopify. Storefront API svarade med en tom
produktlista, `getProduct("face-off-cap")` blev `null`, och produktsidan
anropade `notFound()` — alltså OFFSIDE-sidan.

Storefront API returnerar tomt i två fall, och båda ser identiska ut utifrån:

1. Produkten ligger som **Draft** i stället för **Active**.
2. Produkten är **inte publicerad till den försäljningskanal som
   Storefront-token tillhör**. Det här är den vanligaste fällan i en headless-
   uppsättning: produkten syns i Shopify-admin och i den vanliga butiken, men
   token för det egna appen/Headless-kanalen ser den ändå inte.

**Åtgärdat i koden:** returnerar Shopify inga produkter faller sajten tillbaka
på den lokala katalogen, loggar en varning, och markerar produkterna som
`isPlaceholder`. Produkten *syns* då — bilder, story, 360°-vy, pris — men kan
aldrig köpas, eftersom placeholder-varianterna saknar riktiga Shopify-id:n.
Både produktsidan och kassan vägrar. Sajten kan alltså inte längre hamna på
404 för sin enda produkt bara för att butiken inte är klar.

Det är ett skyddsnät, inte en ersättning för steg 2.

---

## 2. Ladda upp produkten i Shopify — synlig men inte köpbar

Färdig importfil ligger i `docs/shopify/face-off-cap.csv`.

**Import:** Shopify-admin → Products → Import → välj filen. Bildernas `Image
Src` pekar på `https://ic3sweden.se/images/limited-drop/…`, så Shopify hämtar
och lagrar dem själv — inga bilder behöver laddas upp för hand. Det kräver att
sajten är live när importen körs.

Filen är satt för exakt "syns men går inte att köpa":

| Fält | Värde | Effekt |
| --- | --- | --- |
| `Status` | `active` | Produkten är publicerad, inte draft |
| `Published` | `TRUE` | Syns i försäljningskanalen |
| `Variant Inventory Qty` | `0` | Inget lager |
| `Variant Inventory Policy` | `deny` | Sälj inte vid slut → visas som slutsåld |
| `Variant Price` | `299.00` | |
| `Variant SKU` | `IC3-CAP-01` | Behövs för fraktbokning |
| `Variant Grams` | `250` | Behövs för fraktpris — **verifiera den riktiga vikten** |

**Efter importen, gör detta — annars syns produkten fortfarande inte:**

1. Öppna produkten → **Publishing** → bekräfta att den är publicerad till den
   kanal som Storefront-token läser (Headless, eller den egna appen). Det är
   det här steget som saknades.
2. Kontrollera att handtaget är exakt `face-off-cap`. Byter det namn följer
   sajten med numera (den matchar suffix och redirectar till rätt adress), men
   exakt matchning är renast.
3. Vänta ut cachen. `revalidate` är 60 sekunder och Next cachar Shopify-svaret
   på disk — nypublicerat slår igenom inom en minut, eller direkt vid en ny
   deploy.

**Släppet 1 augusti** görs sedan på ett ställe: sätt lagret i Shopify. Sajtens
egen spärr (`RELEASE_DATE` i `src/lib/site.ts`, satt till
`2026-08-01T00:00:00+02:00`) öppnar kassan automatiskt vid midnatt svensk tid.
Ingen deploy behövs.

---

## 3. Åtgärdat i den här genomgången

| Vad | Varför det spelade roll |
| --- | --- |
| Produkten faller tillbaka på lokal katalog, låst för köp | Ingen 404 på enda produkten (avsnitt 1) |
| Canonical-URL per sida | Root-layouten pekade **varje** sidas canonical mot startsidan. Google hade behandlat `/shop`, `/om-oss`, `/drop-01` och `/kontakt` som dubbletter av startsidan och kunnat avindexera dem. Allvarligast SEO-felet inför en kampanj |
| Om oss-bilderna | Tre av fyra bilder pekade på filer som aldrig committats. Bilderna ligger nu i `public/images/om-oss/` med begripliga namn |
| Startsidan kraschade | `<Environment preset="night" />` hämtade en HDR-fil på flera MB från ett externt CDN; misslyckades den släcktes hela sidan med "Application error". Reflektionerna byggs nu lokalt, och en felgräns hindrar 3D-scenen från att ta ner sidan |
| Redirects för gamla adresser | Den gamla statiska sajtens `*.html` och Shopify-butikens `/collections`, `/pages` låg kvar i Google och i bokmärken, och gick till 404 |
| Hastighetsbegränsning + honeypot på formulären | `/api/contact` och `/api/newsletter` skrev rakt in i Shopifys kundregister helt oskyddat. En bot hade kunnat fylla registret och bränna Admin API-kvoten på releasedagen |
| Kassan låst i varukorgen | Med en sparad varukorg gick "Till kassan" att klicka före releasen och gav ett rått felmeddelande. Nu står det "Kassan öppnar 1 augusti" |
| Fake-variant-spärr i kassan | Placeholder-varianter kan inte längre skickas till Shopify och ge ett kryptiskt GraphQL-fel |
| Escaping i kundsökningen | `findCustomerByEmail` tog bort citattecken i stället för att escapa dem |
| OG-bildens mått | Angavs som 1200×1200, filen är 1560×878 — delningsbilden beskars fel |
| Formulären visar serverns felmeddelande | Nyhetsbrevet slängde det och visade en generisk text, så en 429 eller ogiltig adress blev obegriplig |

---

## 4. Kvar att bestämma — kräver dig

### 4a. Juridiken saknar uppgifter som krävs enligt lag

`/legal/villkor` och `/legal/integritet` är rimligt skrivna men saknar
uppgifter som e-handelslagen och distansavtalslagen kräver att kunden lätt ska
hitta. Jag kan inte hitta på dem:

- **Organisationsnummer** för FerdinSweden AB — saknas helt på sajten.
- **Postadress** till företaget — saknas helt.
- **ARN och EU:s ODR-plattform** — konsumenten ska informeras om var en
  tvist kan prövas.
- **Betalmetoder** står som "de metoder som visas i kassan". Skriv ut dem när
  Klarna/Swish/kort är beslutat.
- **Ångerrätten** bör ange att de 14 dagarna räknas från mottagandet, och
  hänvisa till Konsumentverkets ångerblankett.

Skicka org.nr och postadress så lägger jag in dem och kompletterar texterna.

### 4b. Fri frakt över 799 kr när produkten kostar 299 kr

Toppbanderollen lovar "FRI FRAKT ÖVER 799 KR". Enda produkten kostar 299 kr,
så tröskeln nås först vid tre kepsar. Antingen är det avsiktligt (styr mot
flerköp) eller så är det ett arv från en större planerad kollektion. Värt ett
beslut före releasen — och fraktkostnaden måste ändå framgå före kassan.

### 4c. Nyhetsbrevet är single opt-in

`upsertNewsletterSubscriber` sätter `SUBSCRIBED` direkt från en inskriven
adress, utan bekräftelsemejl. Vem som helst kan alltså anmäla någon annans
adress. Det är laglig gråzon och dålig avsändarrykte-hygien. Rekommendation:
double opt-in, vilket kräver utskicksfunktion (Shopify Email eller Klaviyo).
Inte gjort — det är ett beslut om verktyg, inte en kodrad.

### 4d. Bildvikt

`public/images/` är 38 MB. De tre Om oss-bilderna är fotografier sparade som
PNG: `bakgrund.png` 2,4 MB, `mission.png` 1,7 MB, `vision.png` 1,7 MB. Som
JPEG/WebP i samma upplösning hade de landat på ~200–400 kB styck. `next/image`
optimerar vid leverans så besökaren drabbas inte direkt, men repot och första
optimeringen blir onödigt tunga. Vill du att jag konverterar dem säger du till
— jag lät designfilerna vara orörda.

---

## 5. Innan du släpper — kontrollera i Shopify-admin

Detta ligger utanför koden och kan bara göras i admin:

- [ ] Produkten importerad, `active`, publicerad till Storefront-kanalen
- [ ] Fraktzoner och fraktpriser för Sverige (och Norden om det ska säljas dit)
- [ ] Betalleverantör aktiverad och testköp genomfört i testläge
- [ ] Momssats 25 % och att priset 299 kr är inkl. moms
- [ ] Orderbekräftelse och leveransmejl översatta till svenska
- [ ] `NEXT_PUBLIC_SITE_URL=https://ic3sweden.se` satt i Vercel
- [ ] Domän + SSL verifierat, `www` redirectar till apex (eller omvänt)
- [ ] Sitemap inskickad i Google Search Console
- [ ] Ett riktigt köp genomfört skarpt direkt efter midnatt 1 augusti
