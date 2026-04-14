import { NextResponse } from "next/server";

import {
  addCartLines,
  createCart,
  isShopifyConfigured,
} from "@/lib/shopify";

export const runtime = "nodejs";

type RequestBody = {
  lines?: { merchandiseId?: string; quantity?: number }[];
};

export async function POST(req: Request) {
  if (!isShopifyConfigured) {
    return NextResponse.json(
      {
        error:
          "Shopify är inte konfigurerat ännu. Lägg in SHOPIFY_STORE_DOMAIN och SHOPIFY_STOREFRONT_ACCESS_TOKEN i .env.local.",
      },
      { status: 503 },
    );
  }
  try {
    const body = (await req.json()) as RequestBody;
    const lines = Array.isArray(body.lines)
      ? body.lines
          .filter(
            (l): l is { merchandiseId: string; quantity: number } =>
              typeof l?.merchandiseId === "string" &&
              typeof l?.quantity === "number" &&
              l.quantity > 0,
          )
          .map((l) => ({
            merchandiseId: l.merchandiseId,
            quantity: l.quantity,
          }))
      : [];
    if (!lines.length) {
      return NextResponse.json({ error: "Korgen är tom." }, { status: 400 });
    }
    const cart = await createCart();
    const updated = await addCartLines(cart.id, lines);
    return NextResponse.json({ checkoutUrl: updated.checkoutUrl });
  } catch (err) {
    console.error("[checkout] error", err);
    const message =
      err instanceof Error ? err.message : "Kunde inte skapa checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
