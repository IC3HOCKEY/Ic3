import { NextResponse } from "next/server";

import {
  isDuplicateDelivery,
  isWebhookConfigured,
  verifyShopifyWebhook,
} from "@/lib/shopify-webhook";

export const runtime = "nodejs";
/** Signaturen räknas på råa bytes — ingen cache eller ombearbetning får ske. */
export const dynamic = "force-dynamic";

/**
 * Tar emot `orders/paid` från Shopify och plockar ut det en fraktbokning
 * behöver. Det här är fraktbolagsoberoende: samma nyttolast fungerar oavsett
 * om bokningen sker via PostNords Booking API eller via en fraktplattform.
 *
 * Anropet mot fraktbolaget är medvetet inte implementerat här. PostNords
 * Booking API kräver ett tecknat kundavtal, ett kundnummer med issuer-kod och
 * nycklar från deras utvecklarportal — utan dem går formatet inte att
 * verifiera, och en gissad nyttolast hade bokat fel eller inget alls. Se
 * docs/postnord-integration.md för vilken väg som är vald och vad som ska in
 * här.
 */
type ShopifyOrder = {
  id?: number;
  name?: string;
  email?: string;
  total_weight?: number;
  shipping_address?: {
    first_name?: string;
    last_name?: string;
    address1?: string;
    address2?: string;
    zip?: string;
    city?: string;
    country_code?: string;
    phone?: string;
  } | null;
  shipping_lines?: { code?: string; title?: string }[];
  line_items?: { sku?: string; quantity?: number; grams?: number }[];
};

export async function POST(req: Request) {
  if (!isWebhookConfigured) {
    // Inaktiv tills SHOPIFY_WEBHOOK_SECRET finns. 503 gör att Shopify försöker
    // igen senare istället för att räkna leveransen som levererad.
    return NextResponse.json(
      { error: "Webhooken är inte konfigurerad." },
      { status: 503 },
    );
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-shopify-hmac-sha256");

  if (!verifyShopifyWebhook(rawBody, signature)) {
    // 401 utan detaljer — svara aldrig med varför signaturen inte stämde.
    return NextResponse.json({ error: "Ogiltig signatur." }, { status: 401 });
  }

  // Efter verifiering: kvittera dubbletter med 200 så att Shopify slutar
  // försöka igen. Ett fel här hade gett en ny retry och riskerat dubbelbokning.
  if (isDuplicateDelivery(req.headers.get("x-shopify-webhook-id"))) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  let order: ShopifyOrder;
  try {
    order = JSON.parse(rawBody) as ShopifyOrder;
  } catch {
    // Trasig body kommer inte att bli giltig vid en retry — kvittera bort den.
    return NextResponse.json({ ok: true, ignored: "invalid-json" });
  }

  const address = order.shipping_address;
  if (!address) {
    // Digitala eller upphämtade ordrar ska inte bokas som frakt.
    return NextResponse.json({ ok: true, ignored: "no-shipping-address" });
  }

  const shipment = {
    orderId: order.id,
    orderName: order.name,
    email: order.email,
    service: order.shipping_lines?.[0]?.code ?? null,
    receiver: {
      name: [address.first_name, address.last_name].filter(Boolean).join(" "),
      address1: address.address1,
      address2: address.address2,
      postalCode: address.zip,
      city: address.city,
      countryCode: address.country_code,
      phone: address.phone,
    },
    // Shopify rapporterar total_weight i gram; falla tillbaka på radvikterna.
    weightGrams:
      order.total_weight ??
      order.line_items?.reduce(
        (sum, l) => sum + (l.grams ?? 0) * (l.quantity ?? 1),
        0,
      ) ??
      null,
    items: order.line_items?.map((l) => ({
      sku: l.sku,
      quantity: l.quantity,
    })),
  };

  // Loggen är avsiktligt strukturerad: den är spårbarheten fram till att
  // bokningen kopplas in, och visar exakt vad som skulle skickas vidare.
  console.info("[webhook orders/paid] klar för fraktbokning", shipment);

  return NextResponse.json({ ok: true });
}
