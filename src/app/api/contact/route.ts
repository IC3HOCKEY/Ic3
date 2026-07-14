import { NextResponse } from "next/server";

import { isAdminConfigured, recordContactMessage } from "@/lib/shopify-admin";

export const runtime = "nodejs";

type Body = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  topic?: unknown;
};

export async function POST(req: Request) {
  if (!isAdminConfigured) {
    return NextResponse.json(
      { error: "Kontaktformuläret är inte konfigurerat ännu. Mejla oss direkt på ic3.kontakt@outlook.com." },
      { status: 503 },
    );
  }
  try {
    const body = (await req.json()) as Body;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message =
      typeof body.message === "string" ? body.message.trim() : "";
    const topic =
      typeof body.topic === "string" && body.topic.trim()
        ? body.topic.trim()
        : "Allmän fråga";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Namn, e-post och meddelande krävs." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Ogiltig e-postadress." },
        { status: 400 },
      );
    }
    if (message.length > 4000) {
      return NextResponse.json(
        { error: "Meddelandet är för långt (max 4000 tecken)." },
        { status: 400 },
      );
    }

    await recordContactMessage({ name, email, topic, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] error", err);
    return NextResponse.json(
      { error: "Kunde inte skicka meddelandet just nu. Mejla oss gärna direkt på ic3.kontakt@outlook.com." },
      { status: 502 },
    );
  }
}
