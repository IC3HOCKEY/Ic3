import "server-only";

/**
 * Enkel hastighetsbegränsning per IP för de publika formulären.
 *
 * Räknaren lever i minnet, vilket betyder en räknare per serverinstans — på
 * en serverlös plattform delas den alltså inte mellan alla anrop. Den stoppar
 * ändå den vanligaste sortens missbruk (en bot som spammar samma endpoint) och
 * kostar inget extra beroende. Behöver vi hårda garanturer över alla
 * instanser är nästa steg Vercel KV eller Upstash Redis.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
/** Städa bort utgångna nycklar när kartan börjar växa. */
const MAX_KEYS = 10_000;

function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  /** Sekunder kvar till fönstret nollställs — för Retry-After. */
  retryAfter: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  if (buckets.size > MAX_KEYS) sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  existing.count += 1;
  if (existing.count > limit) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfter: 0 };
}

/**
 * Klientens IP. Vercel sätter x-forwarded-for; första värdet är besökaren.
 * Utan header faller vi tillbaka på en delad nyckel, vilket är strängare men
 * aldrig läcker igenom obegränsat.
 */
export function clientKey(req: Request, scope: string): string {
  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  const ip =
    forwarded.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown";
  return `${scope}:${ip}`;
}
