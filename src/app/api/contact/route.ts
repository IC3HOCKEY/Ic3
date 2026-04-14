import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  topic?: unknown;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message =
      typeof body.message === "string" ? body.message.trim() : "";
    const topic = typeof body.topic === "string" ? body.topic.trim() : "";

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

    console.log("[contact] new message", { name, email, topic, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] error", err);
    return NextResponse.json({ error: "Internt fel" }, { status: 500 });
  }
}
