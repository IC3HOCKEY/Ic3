import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie policy",
};

export default function CookiesPage() {
  return (
    <>
      <span className="chip">Legal</span>
      <h1>IC3 — Cookie Policy</h1>
      <p>Senast uppdaterad: 2025-12-01</p>
      <p>
        IC3 använder cookies för att webbplatsen ska fungera optimalt och för
        att ge dig en bättre upplevelse.
      </p>
      <h2>1. Vad är cookies?</h2>
      <p>
        Cookies är små textfiler som lagras i din webbläsare. De är ofarliga
        och hjälper oss att förstå hur sidan används.
      </p>
      <h2>2. Vilka cookies vi använder</h2>
      <ul>
        <li>
          <strong>Nödvändiga cookies:</strong> krävs för att sidan ska fungera
          (t.ex. varukorg).
        </li>
        <li>
          <strong>Analys-cookies:</strong> anonyma data som hjälper oss
          förbättra webbplatsen.
        </li>
        <li>
          <strong>Marknadsföringscookies:</strong> används endast om du
          godkänner dem.
        </li>
      </ul>
      <h2>3. Hur du kan kontrollera cookies</h2>
      <p>
        Du kan när som helst blockera eller ta bort cookies i
        webbläsarinställningarna.
      </p>
      <h2>4. Samtycke</h2>
      <p>
        Vid första besöket visar vi en cookie-banner där du kan välja vilka
        cookies du godkänner.
      </p>
    </>
  );
}
