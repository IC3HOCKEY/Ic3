import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Användarvillkor",
};

export default function TermsPage() {
  return (
    <>
      <span className="chip">Legal</span>
      <h1>IC3 — Användarvillkor</h1>
      <p>Senast uppdaterad: 2025-12-01</p>
      <p>
        Välkommen till IC3. Genom att besöka vår webbplats eller genomföra ett köp
        godkänner du dessa användarvillkor. Läs dem noggrant innan du använder
        sidan.
      </p>
      <h2>1. Allmänt</h2>
      <p>
        IC3 drivs av FerdinSweden AB. Alla produkter, tjänster och allt innehåll på
        webbplatsen tillhör IC3.
      </p>
      <h2>2. Beställning &amp; köp</h2>
      <ul>
        <li>du är minst 18 år, eller har målsmans godkännande</li>
        <li>de uppgifter du lämnar är korrekta</li>
        <li>du godkänner våra priser, leveransvillkor och betalningsmetoder</li>
      </ul>
      <p>En order är bindande först när den bekräftats via e-post.</p>
      <h2>3. Priser &amp; betalning</h2>
      <p>
        Alla priser anges i SEK och inkluderar moms om inget annat anges. Vi
        accepterar betalning via de metoder som visas i kassan.
      </p>
      <h2>4. Leverans</h2>
      <p>
        Leveranstider varierar beroende på produkt och destination. Förseningar
        kan uppstå vid hög belastning eller leverantörshinder.
      </p>
      <h2>5. Ångerrätt &amp; returer</h2>
      <p>
        Du har 14 dagars ångerrätt enligt svensk lag. Produkten ska vara i
        originalskick och oanvänd. Kunden står för returfrakt.
      </p>
      <h2>6. Garanti &amp; reklamation</h2>
      <p>
        Vid fel på vara följer vi svensk konsumentlagstiftning. Kontakta oss på{" "}
        <a href="mailto:ic3.kontakt@outlook.com">ic3.kontakt@outlook.com</a> om
        du vill reklamera en produkt.
      </p>
      <h2>7. Ansvarsbegränsning</h2>
      <p>
        IC3 ansvarar inte för indirekta skador, datasäkerhetsproblem,
        leveransförseningar eller fel som ligger utanför vår kontroll.
      </p>
      <h2>8. Ändringar</h2>
      <p>
        Vi kan uppdatera dessa villkor när som helst. Den senaste versionen
        finns alltid på webbplatsen.
      </p>
    </>
  );
}
