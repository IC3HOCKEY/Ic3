# PostNord + Shopify — automatiserad orderhantering

Mål: en betald order i Shopify ska automatiskt bli en bokad PostNord-frakt, en
utskriven etikett, och ett spårningsnummer tillbaka på ordern så att kunden får
sitt leveransmejl utan handpåläggning.

Det finns två vägar dit. Det här dokumentet säger vilken som bör väljas för
1 augusti och varför, och vad som redan är byggt.

---

## Rekommendation för releasen: fraktplattform, inte egen integration

**Använd en fraktplattform med färdig Shopify-app.** PostNord hänvisar själva
Shopify-handlare till partners (Sendcloud och HubBox nämns på deras
Shopify-sida) snarare än till egen integration mot deras API. Vanliga val i
Sverige är Sendcloud, Shipmondo och nShift (tidigare Unifaun/Pacsoft).

Plattformen sköter hela kedjan: fraktpriser i kassan, utlämningsställen,
etiketter, spårningsnummer tillbaka till Shopify och kundnotiser. Uppsättningen
är en eftermiddag i ett webbgränssnitt, inte ett utvecklingsprojekt.

Skälen att välja det nu:

1. **Tiden.** Fem dagar kvar. En egen integration mot PostNords Booking API
   kräver ett tecknat kundavtal, ett kundnummer med issuer-kod och nycklar från
   deras utvecklarportal — PostNord skriver uttryckligen att man ska kontakta
   dem för att få förutsättningarna på plats. Det hinner inte bli testat.
2. **Volymen.** Drop 01 är 250 exemplar. Även helt manuell etiketthantering i
   PostNord Portal är fullt görbar första veckorna. Automationen är en
   effektivisering, inte ett släppkrav.
3. **Underhållet.** Etiketter, tullformat och tjänsteutbud ändras. En plattform
   underhåller det; en egen integration blir er att underhålla.

Rimlig ordning: flat fraktavgift i Shopify till releasen → plattform inkopplad
när ordrarna börjar komma → egen integration bara om plattformen inte räcker.

---

## Vad som är byggt i repot

Den fraktbolagsoberoende halvan, och bara den:
`src/app/api/webhooks/shopify/orders-paid/route.ts` tar emot Shopifys
`orders/paid`, verifierar den, och plockar ut precis de fält en fraktbokning
behöver (mottagare, adress, vikt, tjänstekod, artiklar).

Den är verifierad mot åtta fall: giltig signatur, omsänd leverans, fel
hemlighet, manipulerad body, saknad signatur, avhuggen signatur, order utan
leveransadress och trasig JSON.

Detaljer som är lätta att göra fel och som är gjorda rätt här:

- **Signaturen räknas på råa bytes.** Shopify signerar HMAC-SHA256 över exakt
  det som skickades. Bodyn läses med `req.text()` innan någon JSON-parsning —
  omserialisering ändrar bytes och signaturen slutar stämma.
- **Jämförelsen är timing-säker** (`timingSafeEqual`), med längdkontroll först.
- **Omsända leveranser kvitteras med 200.** Shopify skickar om vid timeout. Ett
  fel hade gett en ny retry och riskerat dubbelbokad frakt.
- **Inaktiv utan `SHOPIFY_WEBHOOK_SECRET`** — svarar 503, så Shopify försöker
  igen senare i stället för att räkna leveransen som mottagen.
- **Ogiltig signatur svarar 401 utan förklaring.**

### Vad som medvetet *inte* är byggt

Själva anropet mot fraktbolaget. PostNords dokumentation kräver inloggning och
Booking API kräver deras avtalsuppgifter, så nyttolastens format går inte att
verifiera härifrån. En gissad struktur hade sett färdig ut och bokat fel — det
är sämre än ett tydligt tomrum. Loggraden i webhooken visar exakt vad som ska
skickas vidare när vägen är vald.

Väljer ni plattformsvägen behövs den här webhooken sannolikt inte alls —
plattformens app gör jobbet. Den ligger kvar som grund för egen automation och
är ofarlig så länge hemligheten inte är satt.

---

## Om ni ändå bygger egen integration senare

Förutsättningar att ha på plats först:

1. Kundavtal med PostNord, kundnummer och issuer-kod.
2. API-nyckel och application-id från PostNords utvecklarportal.
3. `write_fulfillments` (och `read_orders`) i Shopify-appen, så
   spårningsnumret kan skrivas tillbaka.

Flödet blir:

```
Shopify orders/paid
  → verifiera HMAC                     (byggt)
  → plocka ut mottagare/vikt/tjänst    (byggt)
  → boka frakt hos PostNord            (kräver avtalsuppgifter)
  → hämta etikett (PDF) + kolli-id     (kräver avtalsuppgifter)
  → fulfillmentCreateV2 i Shopify med spårningsnummer
  → Shopify mejlar kunden automatiskt
```

Två saker att inte missa:

- **Idempotens på riktigt.** Minnesdedupen i webhooken skyddar mot
  retry-stormar på en instans, inte mer. Innan en bokning görs: kontrollera i
  Shopify att ordern inte redan har en fulfillment.
- **Vikten måste stämma.** `Variant Grams` är satt till 250 g för kepsen i
  importfilen. Är den fel blir fraktpriset fel, och en plattform kan neka
  bokningen.

## Miljövariabler

```
SHOPIFY_WEBHOOK_SECRET=      # från webhookens signeringshemlighet i Shopify
```

Skapas i Shopify-admin → Settings → Notifications → Webhooks (eller i appens
webhook-konfiguration). Utan den är endpointen inaktiv.
