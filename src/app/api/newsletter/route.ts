import { NextResponse } from "next/server";

import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isAdminConfigured, upsertNewsletterSubscriber } from "@/lib/shopify-admin";

export const runtime = "nodejs";

/** Dolt fält som bara ifylls av bottar. */
type Body = { email?: unknown; company?: unknown };

export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "newsletter"), 5, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "För många försök. Vänta en stund och försök igen." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }
  if (!isAdminConfigured) {
    return NextResponse.json(
      { error: "Nyhetsbrevet är inte konfigurerat ännu. Försök igen senare." },
      { status: 503 },
    );
  }
  try {
    const body = (await req.json()) as Body;
    // Honeypot: fältet är osynligt för besökare, så ifyllt = bot. Svara ok så
    // att boten inte lär sig att fältet avslöjade den.
    if (typeof body.company === "string" && body.company.trim()) {
      return NextResponse.json({ ok: true });
    }
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Ogiltig e-postadress." },
        { status: 400 },
      );
    }
    await upsertNewsletterSubscriber(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter] error", err);
    return NextResponse.json(
      { error: "Kunde inte registrera dig just nu, försök igen om en stund." },
      { status: 502 },
    );
  }
}
