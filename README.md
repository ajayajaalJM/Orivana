# Orivana

A luxury Mediterranean heritage food house — premium dates, cold-pressed olive oil, and raw honey. Built as a headless ecommerce experience with Next.js, Shopify Storefront API, and Sanity CMS.

## Stack

- **Next.js 15** (App Router) — experience layer
- **Tailwind CSS 4** — design system
- **Framer Motion** — luxury animations
- **Shopify Storefront API** — products, collections, cart, checkout
- **Sanity CMS** — homepage, journal, editorial content
- **NextAuth** — Inner Circle membership (no "Account" — everything is Inner Circle)

## Getting Started

```bash
npm install
cp .env.example .env.local   # already created if missing
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Development tips

**Quick start (recommended):**

```bash
npm run go
```

This script kills any stale dev servers, clears the `.next` cache, and starts live reload on [http://localhost:3000](http://localhost:3000).

Or run directly:

```bash
./scripts/dev.sh
```

- Use **`npm run dev`** for day-to-day work if a server is already clean.
- If you see a 500 error or blank page after refresh, run **`npm run dev:clean`** or **`npm run go`** again.
- **Do not run `npm run build` while the dev server is running** — it corrupts the dev cache and causes refresh errors.
- Only run one dev server at a time.
- Optional faster mode: `npm run dev:turbo` (Turbopack). Use `npm run go` if it misbehaves.

### Demo Mode

Without Shopify or Sanity credentials, the site runs with curated mock data so you can explore the full experience immediately.

### Inner Circle Demo

- **Login:** any email + password `member` (or any 6+ character password)
- **Signup:** join the Inner Circle with any credentials

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Your Shopify store domain |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API access token |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (default: production) |
| `NEXTAUTH_URL` | App URL for auth callbacks |
| `NEXTAUTH_SECRET` | Random secret for JWT signing |

## Project Structure

```
/app                    # Pages (App Router)
/components/ui          # Base design system components
/components/sections    # Homepage section blocks
/lib                    # shopify.ts, sanity.ts, auth.ts
/styles/tokens.css      # CSS design tokens
/sanity/schemas         # Sanity content schemas
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Cinematic homepage with all sections |
| `/shop` | Product catalog |
| `/shop/[handle]` | Collection page |
| `/product/[id]` | Product detail with CMS storytelling |
| `/journal` | The Harvest Journal — land, tradition, and harvest stories |
| `/membership` | Inner Circle — orders and saved selections |
| `/membership/login` | Inner Circle login |
| `/story` | Brand story page |
| `/studio` | Embedded Sanity CMS Studio (requires `NEXT_PUBLIC_SANITY_PROJECT_ID`) |

## Design System

Colors, typography, spacing, and animation tokens live in `styles/tokens.css` and `lib/design-tokens.ts`. All UI uses the luxury dark palette with gold accent (`#C6A15B`).

## Sanity Setup

Embedded Studio lives at **`/studio`** when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set.

### Content types

- **homepage** — hero, featured harvest (Shopify product handle + editorial copy), brand story
- **journalPost** — Harvest Journal articles (Portable Text body)
- **recipe** — culinary journal recipes (linked to Shopify product handles)
- **productStory** — product page storytelling (linked by Shopify handle)
- **collectionEditorial** — collection page hero, story, featured recipe, related journal posts

### Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset (default: `production`) |
| `SANITY_API_WRITE_TOKEN` | Editor token for `npm run seed:sanity` |
| `SANITY_REVALIDATE_SECRET` | Bearer token for `POST /api/revalidate` webhook |

### First-time content import

```bash
# Add SANITY_API_WRITE_TOKEN to .env.local, then:
npm run seed:sanity
```

### Featured harvest

In Studio → **Homepage** → **Featured Harvest**, set **Shopify Product Handle** to the product you want on the homepage. Price, image, and cart data still come from Shopify.

### On-demand revalidation

Configure a Sanity webhook on publish to `POST https://your-domain/api/revalidate` with header `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`.

## Shopify Setup

1. Create a Storefront API access token in Shopify Admin → Settings → Apps
2. Add domain and token to `.env.local`
3. Products and collections sync automatically via GraphQL

## License

Private — Orivana
