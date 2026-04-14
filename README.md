# IC3SWEDEN.SE — Storefront

Headless Next.js 14 storefront for IC3SWEDEN, powered by Shopify's Storefront
API, Three.js / React Three Fiber, Framer Motion, and Tailwind CSS.

## What's in the repo

```
.
├── src/                   # Next.js 14 App Router source (new)
├── public/                # Brand imagery, fonts, hero video
├── legacy-html/           # Original static HTML site (archived)
├── ic3-shopify-theme/     # Existing Shopify theme (kept untouched)
├── ic3-custom-theme/      # Alternate Shopify theme (kept untouched)
├── legal-nextjs/          # Separate legal microsite (kept untouched)
└── README.md
```

The Shopify themes and `legal-nextjs` are preserved as-is; the new storefront
runs at the repo root.

## Requirements

- Node 20 or newer
- npm (or pnpm/yarn — pick one and stay with it)
- A Shopify store *(optional for local dev — the site falls back to a mock
  catalog when the Storefront API is not configured)*

## Quick start

```bash
# 1. install dependencies
npm install

# 2. copy env template (and fill in when ready)
cp .env.example .env.local

# 3. run the dev server
npm run dev
```

Open http://localhost:3000 — the site loads with the built-in mock catalog, so
every page renders even before Shopify is connected.

## Connecting Shopify (step by step)

The storefront reads products, collections, and variants from Shopify's
Storefront API. The integration lives in `src/lib/shopify.ts` — no code
changes are needed; you just provide credentials.

1. **Log in to Shopify Admin** for `ic3sweden.myshopify.com`.
2. Go to **Settings → Apps and sales channels → Develop apps**.
3. If prompted, enable custom app development.
4. Click **Create app**. Name it something like *IC3 Storefront (headless)*.
5. Open **Configure Storefront API scopes** and enable the scopes you need.
   The minimum set this site uses:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_selling_plans`
6. Save, then hit **Install app**.
7. From the **API credentials** tab copy the
   **Storefront API access token** (prefixed with `shpat_`).
8. Fill in `.env.local`:

   ```bash
   SHOPIFY_STORE_DOMAIN=ic3sweden.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   SHOPIFY_API_VERSION=2024-10
   NEXT_PUBLIC_SITE_URL=https://ic3sweden.se
   ```

9. Restart `npm run dev`. The site now pulls real products. No code swap needed.

### How the integration works

- Product pages use `getProduct(handle)` and `getProducts()` from
  `src/lib/shopify.ts`. When the env vars are missing, the module transparently
  returns the mock catalog from `src/lib/mock-data.ts`.
- The cart is local (React context + `localStorage`). When the user hits
  **Till kassan**, `/api/checkout` creates a Shopify cart via
  `cartCreate` + `cartLinesAdd` and redirects the browser to the hosted
  `checkoutUrl` — Shopify collects payment and fulfills the order.
- The site is deploy-ready on **Vercel**. Set the env vars in the Vercel
  project settings and deploy.

### Product handles ↔ mock data

The mock data in `src/lib/mock-data.ts` uses these handles so you can use them
as a reference when importing into Shopify:

- `face-off-cap` — Drop 01 cap (sold out)
- `ice-hoodie`, `crease-crew` — Hoodies & Crews
- `rink-tee` — Tees
- `puck-beanie`, `overtime-tote` — Accessories

Use the same handles in Shopify and the site will instantly pull real product
data when you switch credentials on.

## Scripts

```bash
npm run dev         # start the dev server (next dev)
npm run build       # production build
npm run start       # start production build
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
```

## Features

- **Next.js 14 App Router** with server components and route-level ISR
- **Three.js / React Three Fiber** particle hero (`src/components/hero/`)
- **Image-based 360° turntable** for products (`src/components/product/turntable.tsx`)
  — drops in GLB-driven 3D later with a minimal swap
- **Framer Motion** page entries and scroll reveals
- **Tailwind CSS** with a custom IC3 palette (ink / steel / ice / ember)
- **Slide-out cart drawer** with optimistic quantity updates + Shopify checkout
  handoff
- **SEO**: dynamic metadata, Open Graph, `sitemap.xml`, `robots.txt`,
  Product JSON-LD structured data
- **Responsive, mobile-first layouts**
- **Accessibility**: semantic landmarks, keyboard nav, `prefers-reduced-motion`
  respected
- **Performance**: dynamic import of the WebGL scene, `next/image` for assets,
  cached server fetches (`next: { revalidate: 60 }`)
- **Swedish-first copy** matching the legacy site (`/om-oss`, `/kontakt`, legal
  pages kept Swedish for compliance)

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it on https://vercel.com/new.
3. Set environment variables (see `.env.example`).
4. Vercel auto-detects Next.js; no extra build config needed.
5. Point your custom domain (`ic3sweden.se`) at Vercel's DNS records and
   TLS is handled automatically.

## Notes on preserved files

- `legacy-html/` keeps the original static site so nothing is lost. It isn't
  linked from the new site and is excluded from the TypeScript and ESLint
  scopes.
- The Shopify themes (`ic3-shopify-theme`, `ic3-custom-theme`) are untouched
  and still deployable via `shopify theme push` if you keep using them.
- `legal-nextjs/` is its own small Next.js app and isn't part of this root
  project — treat it as a separate workspace.

Cold days. Hot drops.
