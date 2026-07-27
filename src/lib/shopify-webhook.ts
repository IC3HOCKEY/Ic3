import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifiering av Shopify-webhooks.
 *
 * Shopify signerar varje leverans med HMAC-SHA256 över den råa bodyn, base64-
 * kodad i `X-Shopify-Hmac-Sha256`. Signaturen måste räknas på exakt de bytes
 * som skickades — parsa alltså aldrig JSON innan verifieringen, för
 * omserialisering ändrar bytes och signaturen slutar stämma.
 */
const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

export const isWebhookConfigured = Boolean(secret);

export function verifyShopifyWebhook(
  rawBody: string,
  headerSignature: string | null,
): boolean {
  if (!secret || !headerSignature) return false;

  const expected = createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(headerSignature, "utf8");
  // timingSafeEqual kräver samma längd — olika längd är per definition fel.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Shopify levererar samma webhook igen vid timeout eller fel, så en order kan
 * komma flera gånger. Vi minns de senaste leverans-id:na för att inte boka
 * dubbla frakter. Minnet är per instans, vilket räcker mot retry-stormar men
 * inte som garanti — den slutliga spärren hör hemma hos mottagaren (kolla om
 * ordern redan har en fulfillment i Shopify innan du bokar).
 */
const seen = new Map<string, number>();
const DEDUPE_TTL_MS = 60 * 60 * 1000;

export function isDuplicateDelivery(webhookId: string | null): boolean {
  if (!webhookId) return false;
  const now = Date.now();
  for (const [id, at] of seen) {
    if (now - at > DEDUPE_TTL_MS) seen.delete(id);
  }
  if (seen.has(webhookId)) return true;
  seen.set(webhookId, now);
  return false;
}
