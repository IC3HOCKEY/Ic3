import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integritetspolicy",
};

export default function PrivacyPage() {
  return (
    <>
      <span className="chip">Legal</span>
      <h1>IC3 — Integritetspolicy</h1>
      <p>Senast uppdaterad: 2025-12-01</p>
      <p>
        Vi värnar om din integritet. Denna policy beskriver hur vi samlar in,
        använder och skyddar dina personuppgifter enligt GDPR.
      </p>
      <h2>1. Vilka uppgifter vi samlar in</h2>
      <ul>
        <li>namn, adress, telefonnummer</li>
        <li>e-postadress</li>
        <li>betalningsinformation (hanteras säkert av våra betalpartners)</li>
        <li>IP-adress och användardata (via cookies)</li>
      </ul>
      <h2>2. Varför vi samlar in uppgifter</h2>
      <p>Vi behandlar dina uppgifter för att:</p>
      <ul>
        <li>hantera beställningar och leveranser</li>
        <li>kommunicera med dig om order, frågor eller support</li>
        <li>skicka nyhetsbrev (endast om du aktivt godkänner det)</li>
        <li>förbättra webbplatsens funktionalitet</li>
      </ul>
      <h2>3. Delning av uppgifter</h2>
      <p>Vi delar aldrig dina uppgifter med tredje part utanför:</p>
      <ul>
        <li>betaltjänster</li>
        <li>logistik- och fraktpartners</li>
        <li>webbleverantörer (endast för drift)</li>
      </ul>
      <p>Alla samarbetspartner följer GDPR.</p>
      <h2>4. Lagringstid</h2>
      <p>
        Vi sparar dina uppgifter så länge det krävs enligt bokföringslag eller
        för att hantera kundrelationen.
      </p>
      <h2>5. Dina rättigheter</h2>
      <p>Du har rätt att:</p>
      <ul>
        <li>få tillgång till dina uppgifter</li>
        <li>begära rättning eller radering</li>
        <li>invända mot behandling</li>
        <li>få dina uppgifter exporterade (dataportabilitet)</li>
      </ul>
      <p>
        Kontakta oss på{" "}
        <a href="mailto:ic3.kontakt@outlook.com">ic3.kontakt@outlook.com</a> för
        att utöva dina rättigheter.
      </p>
      <h2>6. Säkerhet</h2>
      <p>
        Vi skyddar dina personuppgifter genom tekniska och organisatoriska
        säkerhetsåtgärder.
      </p>
    </>
  );
}
