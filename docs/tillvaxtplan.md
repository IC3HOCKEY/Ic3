# IC3 — tillväxtplan för massdistribution

Skriven 1 augusti 2026, releasedagen, utifrån faktiska siffror ur Shopify.
Målet enligt ägarna: **massdistribution**, 299 kr styck, ingen fri frakt.

---

## 1. Utgångsläget, i siffror

| Mått | Värde | Kommentar |
|---|---|---|
| Sålda kepsar totalt | **35** | 32 st dec 2025 (à 399 kr) + 3 st 1 aug 2026 (à 299 kr) |
| Lager | **218 st** | ~5 års försäljning i nuvarande takt |
| Sessioner releasedagen | **8** | och nästan bara `/checkouts/…` — se punkt 2 |
| Återkommande kunder | **0 %** | dec-kohorten: 10 % månad 1, sedan 0 % i sju månader |
| Trafikkälla | **100 % "direct"** | ingen sök, ingen social attribution |
| Övergivna varukorgar | 1 (samma person som köpte) | kassan läcker inte |

**Slutsatsen är obekväm men entydig: problemet är inte sajten, kassan eller
frakten. Problemet är att ingen vet att IC3 finns.** 218 kepsar i lager är den
enskilt största bundna tillgången i bolaget, och den löses bara med trafik.

### Vad "massdistribution" kräver i faktiska tal

Vid en realistisk konverteringsgrad för **kall** trafik (1–3 %) krävs
**7 000–20 000 sessioner** för att sälja ut 218 kepsar. De 25 % vi ser idag
gäller **varm** trafik — personer som redan fått en länk och bestämt sig — och
går inte att extrapolera. Planera efter kall trafik.

---

## 2. Mätning — gjort, men kräver en nyckel

Shopify ser **bara sessioner som når Shopifys kassa**. All trafik på
ic3sweden.se var alltså osynlig: ingen visste hur många som besökte sajten,
varifrån de kom eller var de föll av.

GA4 är nu inbyggt i sajten (`src/components/analytics.tsx`) med `page_view`,
`view_item`, `add_to_cart` och `begin_checkout`.

**Aktiveras genom att sätta `NEXT_PUBLIC_GA_ID` i Vercel** (Project ic3 →
Settings → Environment Variables → `G-XXXXXXXXXX` från
analytics.google.com → Admin → Dataströmmar → Webb). Utan den är koden en
tyst no-op. Detta är det billigaste och viktigaste steget i hela planen —
utan mätning är varje marknadsföringskrona blind.

---

## 3. Kanaler för massdistribution, rangordnade efter kostnad per krona

### 3a. Egen publik (billigast, börja här)
- **Instagram + TikTok** finns men driver noll mätbar trafik idag. Hockey-content
  presterar bra organiskt i Sverige: rink-klipp, "behind the drop", spelare som
  bär kepsen. Kostar tid, inte pengar.
- **De 35 befintliga kunderna** är den varmaste listan som finns. De har betalat
  en gång. Idag får de ingenting — därför 0 % återköp.
- **Nyhetsbrevet** finns men är single opt-in. Bör bli double opt-in för
  leveransbarhet och juridik.

### 3b. Ambassadörer / lagförsäljning (bäst passform för IC3)
Hockeykultur är lokal och lagbaserad. En keps säljs bäst av någon som spelar.
- Ge kepsar till 10–20 spelare i div 1/junior mot content och rabattkod.
- **Lagpaket**: 15–20 kepsar till ett lag/förening till rabatterat pris. Det är
  den snabbaste vägen att flytta 218 enheter — ett lag = 20 kepsar = 5 % av
  lagret i en order.
- Detta är också vad som gör "massdistribution" realistiskt utan annonsbudget.

### 3c. Återförsäljare / B2B
Hockeybutiker, klubbshoppar, sportbutiker. Marginalen halveras (ca 150 kr/st
grossistpris) men volymen per affär är 10–50x en DTC-order. För att tömma
lager är detta effektivare än DTC. Kräver: prislista, produktblad, org.nr.

### 3d. Betald annonsering (först när GA4 mäter)
Meta/TikTok mot hockeyintressen i Sverige. **Gör inte detta före punkt 2 är
klar** — utan mätning går det inte att se vad som fungerar, och budgeten
brinner. Rimlig testbudget: 3 000–5 000 kr över två veckor, mätt på CAC.

### 3e. Organisk sök (långsam, men gratis och sammansatt)
Sajten är nu tekniskt ren (canonicals per sida, sitemap, snabb). Noll organisk
trafik idag. Innehåll som kan ranka: "hockey streetwear sverige",
"hockeykeps", "supporterkläder hockey". 3–6 månader till effekt.

---

## 4. Sortimentet är den strukturella flaskhalsen

**0 % återköp i sju månader är inte ett marknadsföringsproblem — det är
aritmetik.** Med en produkt finns inget att köpa en andra gång.

En andra produkt gör tre saker samtidigt:
1. **Höjer ordervärdet** — idag exakt 299 kr, varje order.
2. **Ger anledning att återkomma** — de 35 befintliga kunderna blir köpbara igen.
3. **Ger något att annonsera** — varje släpp är en trafikhändelse.

Rekommendation: **mössa/beanie** (låg produktionsrisk, samma målgrupp, samma
säsong som hockey, 249–349 kr) före hoodie (dyrare, storleksrisk, returer).

---

## 5. Enhetsekonomi — blockerad, kräver ett tal från er

Utan inköpspris per keps går det inte att säga om 299 kr är lönsamt. Sätt in
COGS och räkna:

```
Intäkt per keps                        299 kr
− moms (om momsregistrerad, 25 %)      −59,80 kr  → 239,20 kr netto
− COGS (inköp/produktion)              −? kr
− fraktdifferens (49 kr in vs faktisk PostNord-kostnad)  ±? kr
− kortavgift (~1,9 % + 1,80 kr)        −7,50 kr
= bruttomarginal per keps              ? kr
```

Två saker som redan syns:
- **Priset sänktes 399 → 299 kr (−25 % marginal).** Dec-kunderna betalade 399
  utan invändning. Om sänkningen inte höjde volymen har den bara gett bort
  marginal — och 3 ordrar på releasedagen tyder inte på ett volymlyft.
  *Beslutat av ägarna att ligga på 299 kr; noteras här som en sak att mäta.*
- **Momsen är inte aktiverad i Shopify** medan sajten säger "inkl. moms". Om
  bolaget är momsregistrerat är den faktiska intäkten 239 kr, inte 299 kr —
  det ändrar hela marginalkalkylen. Måste avgöras.

---

## 6. Ordning att arbeta i

| # | Åtgärd | Ägare | Blockerad av |
|---|---|---|---|
| 1 | Sätt `NEXT_PUBLIC_GA_ID` i Vercel | Riccardo | — |
| 2 | Skicka de 3 betalda ordrarna | Riccardo | — |
| 3 | Avgör momsfrågan | Riccardo | revisor |
| 4 | Skicka COGS så enhetsekonomin kan räknas | Riccardo | — |
| 5 | Content-plan Instagram/TikTok, 4 veckor | Claude | — |
| 6 | Flöden till de 35 kunderna + nya köpare | Claude | Klaviyo-access |
| 7 | Lagpaket-erbjudande + B2B-prislista | Claude + Riccardo | COGS |
| 8 | Spec och pris på produkt 2 (mössa) | Claude + Riccardo | leverantör |
| 9 | Annonstest 3–5 tkr, mätt på CAC | Riccardo | #1 |

---

## 7. Vad som redan är gjort (1 aug 2026)

- Flat frakt 49 kr; tröskeln på 799 kr borttagen i Shopify och i all copy
- GA4 + e-handelsevents inbyggt (väntar på nyckel)
- Flow-arbetsflöde aktivt: daglig varning om ordrar äldre än 2 dagar ligger opackade
- Flow-arbetsflöden som redan fanns: låg lagernivå, ny kontaktformulär-kund,
  återställ övergiven varukorg
- Kassans marknadsföringsruta är inte längre förikryssad (GDPR)
- Sajten säljer: verifierat att `/api/checkout` bygger en giltig Shopify-kassa
