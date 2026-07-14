import { NextResponse } from "next/server";

import { isAdminConfigured, upsertNewsletterSubscriber } from "@/lib/shopify-admin";

export const runtime = "nodejs";

type Body = { email?: unknown };

export async function POST(req: Request) {
  if (!isAdminConfigured) {
    return NextResponse.json(
      { error: "Nyhetsbrevet är inte konfigurerat ännu. Försök igen senare." },
      { status: 503 },
    );
  }
  try {
    const body = (await req.json()) as Body;
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
