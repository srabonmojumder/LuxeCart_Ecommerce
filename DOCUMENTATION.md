# LuxeCart — Technical Documentation

A full-stack e-commerce platform: a **Next.js** storefront backed by a standalone **Node.js + Express + Prisma + MySQL** REST API.

- [1. Overview & Architecture](#1-overview--architecture)
- [2. Tech Stack](#2-tech-stack)
- [3. Project Structure](#3-project-structure)
- [4. Getting Started](#4-getting-started)
- [5. Environment Variables](#5-environment-variables)
- [6. Database Schema](#6-database-schema)
- [7. Authentication](#7-authentication)
- [8. API Reference](#8-api-reference)
- [9. Frontend Architecture](#9-frontend-architecture)
- [10. Admin Guide](#10-admin-guide)
- [11. Payments](#11-payments)
- [12. Operations](#12-operations)
- [13. Deployment](#13-deployment)
- [14. Troubleshooting](#14-troubleshooting)

---

## 1. Overview & Architecture

LuxeCart is split into two deployable apps in one repository:

```
┌──────────────────────────┐         ┌──────────────────────────┐         ┌─────────────┐
│  Storefront (Next.js)     │  HTTPS  │  API (Express)            │  SQL    │   MySQL     │
│  - SSR/ISR product pages  │ ──────► │  - REST endpoints         │ ──────► │  (Prisma)   │
│  - SWR client fetching    │ ◄────── │  - JWT auth               │ ◄────── │             │
│  - Zustand cart/wishlist  │  JSON   │  - Stripe payments        │         │             │
└──────────────────────────┘         └──────────────────────────┘         └─────────────┘
        :3000                                  :4000                            :3306
```

- The **storefront** (`/`, `/components`, `/lib`, `/store`) renders the UI and calls the API over HTTP.
- The **API** (`/backend`) owns all business logic and database access.
- Data flows one way for writes: the browser never touches MySQL directly.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion |
| Data fetching | SWR (server state) + Zustand (cart/wishlist/auth client state) |
| Backend | Node.js, Express 4, TypeScript (ESM) |
| Validation | Zod |
| ORM / DB | Prisma + MySQL 8 |
| Auth | JWT (access + refresh) with `bcryptjs`, httpOnly refresh cookie |
| Payments | Stripe (`stripe` server SDK, `@stripe/react-stripe-js` Elements) |
| Security | `helmet`, `cors`, `express-rate-limit` |

---

## 3. Project Structure

```
LuxeCart_Ecommerce/
├── app/                      # Next.js routes (App Router)
│   ├── page.tsx              # Home
│   ├── products/             # List + [id] detail (SSR, slug-based)
│   ├── categories/           # Category grid
│   ├── cart/ wishlist/ compare/
│   ├── checkout/             # Order creation + Stripe modal
│   ├── order-success/        # Real order receipt
│   ├── account/              # Auth gate, orders, addresses, profile
│   ├── admin/                # Admin dashboard (role-gated)
│   └── sitemap.ts            # Dynamic sitemap from API
├── components/               # UI components
│   ├── auth/AuthForm.tsx
│   ├── account/ProfileForm.tsx, AddressBook.tsx
│   ├── checkout/StripePayment.tsx
│   ├── product/ReviewSection.tsx, ProductCard.tsx, ...
│   └── providers/AuthProvider.tsx
├── lib/
│   ├── api.ts                # Fetch client (auto token-refresh on 401)
│   ├── authToken.ts          # Access-token storage helper
│   ├── hooks.ts              # SWR hooks (products, categories, orders, ...)
│   └── seo.ts
├── store/
│   ├── useStore.ts           # Cart + wishlist (with server sync)
│   └── useAuthStore.ts       # Auth state + session
├── data/products.ts          # Seed source of truth (read by backend extractor)
├── backend/                  # ── The API ──
│   ├── prisma/
│   │   ├── schema.prisma     # DB schema
│   │   ├── seed.ts           # Seeds products/categories/admin
│   │   └── data/*.json       # Generated from data/products.ts
│   ├── scripts/extract-data.mjs
│   ├── src/
│   │   ├── index.ts          # Server entry
│   │   ├── app.ts            # Express app + middleware
│   │   ├── lib/              # env, prisma, jwt, stripe
│   │   ├── middleware/       # auth, error handling
│   │   ├── controllers/      # request handlers
│   │   ├── routes/           # route definitions
│   │   └── serializers/      # DB → API shape
│   ├── Dockerfile
│   └── .env
├── docker-compose.yml        # MySQL + API for local/prod
└── next.config.mjs
```

---

## 4. Getting Started

**Prerequisites:** Node 20+, a running MySQL 8 server.

### Backend

```bash
cd backend
cp .env.example .env          # set DATABASE_URL + JWT secrets
npm install
npm run extract               # data/products.ts -> prisma/data/*.json
npm run prisma:migrate        # create DB + tables (auto-runs seed)
npm run dev                   # http://localhost:4000/api
```

Seeds **48 products / 7 categories / 148 tags** and an admin user:
**`admin@luxecart.com` / `admin123`**.

### Frontend

```bash
# project root
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev                        # http://localhost:3000
```

### One-command infra (alternative)

```bash
docker compose up            # MySQL + API; run the frontend separately with npm run dev
```

---

## 5. Environment Variables

### Backend (`backend/.env`)

| Variable | Example | Notes |
|---|---|---|
| `PORT` | `4000` | API port |
| `NODE_ENV` | `development` | `development` / `production` / `test` |
| `CORS_ORIGINS` | `http://localhost:3000` | comma-separated allowed origins |
| `DATABASE_URL` | `mysql://root:password@127.0.0.1:3306/luxecart` | Prisma connection |
| `JWT_ACCESS_SECRET` | `…` | signs short-lived access tokens |
| `JWT_REFRESH_SECRET` | `…` | signs refresh tokens |
| `JWT_ACCESS_EXPIRES` | `15m` | access token TTL |
| `JWT_REFRESH_EXPIRES` | `7d` | refresh token TTL |
| `STRIPE_SECRET_KEY` | `sk_test_…` | optional; omit/placeholder = mock mode |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` | optional; required for live webhooks |

### Frontend (`.env.local`)

| Variable | Example | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` | API base URL |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | used for SEO/canonical |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_…` | optional; set = real Stripe checkout |

---

## 6. Database Schema

Defined in [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma).

### Catalog
- **Category** — `id, name, slug, image?, description?, gradient?, count` → has many Products
- **Product** — `id, name, slug, description, price(Decimal), discount, image, stock, inStock, isActive, ratingAvg, reviewCount, colors(JSON), sizes(JSON), categoryId` → images, variants, tags, reviews
- **ProductImage** — gallery images (`url, alt, position`)
- **ProductVariant** — `color?, size?, sku?, price?, stock` (normalized; for future inventory)
- **Tag** + **ProductTag** — many-to-many tags
- **Review** — `rating, comment?, productId, userId` (one per user per product; aggregates recomputed on write)

### Users & Auth
- **User** — `id, email, passwordHash, displayName?, photoURL?, role(CUSTOMER|ADMIN)`
- **RefreshToken** — hashed refresh tokens for rotation/revocation
- **Address** — saved shipping addresses (`isDefault`)

### Commerce
- **Cart** (one per user) + **CartItem** (`productId, variantId?, quantity`)
- **Order** — `status, subtotal, shipping, tax, total, shippingAddress(JSON)` + **OrderItem** (price/name snapshots)
- **Payment** — `provider, status, amount, stripeIntentId?` (1:1 with Order)
- **WishlistItem** — `userId, productId`

### Enums
- `Role`: `CUSTOMER`, `ADMIN`
- `OrderStatus`: `PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED`

---

## 7. Authentication

JWT-based with token rotation:

1. **Register/Login** → API returns `{ user, accessToken }` and sets an **httpOnly refresh-token cookie**.
2. The **access token** (15m) is stored client-side ([`lib/authToken.ts`](lib/authToken.ts)) and sent as `Authorization: Bearer <token>`.
3. On a `401`, [`lib/api.ts`](lib/api.ts) silently calls `POST /auth/refresh` (using the cookie), gets a new access token, and retries — single-flight so concurrent 401s trigger one refresh.
4. **Refresh tokens are rotated** on every use and stored hashed in the DB, so they can be revoked.
5. **Logout** deletes the stored refresh token and clears the cookie.

**Roles:** routes under `/admin/*` require `role = ADMIN` (enforced by `requireAdmin` middleware). The frontend `/admin` page also gates on role.

**Guest → user merge:** a guest's localStorage cart/wishlist is pushed to the server (`POST /cart/merge`) on login, then hydrated from the server.

---

## 8. API Reference

Base URL: `http://localhost:4000/api`. All bodies are JSON. **41 endpoints.**

**Auth column:** `—` public · `user` Bearer token · `admin` admin token · `cookie` refresh cookie.

### Conventions
- Success: `200/201` with `{ data: ... }` (or resource-specific shape).
- Error: `4xx/5xx` with `{ error: string, details?: any }`.

### Health
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | — | `{ status: "ok", timestamp }` |

### Products
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/products` | — | List with filters (see below) |
| GET | `/products/:slug` | — | Single product |
| GET | `/products/:slug/related` | — | Up to 4 same-category products |
| GET | `/products/:slug/reviews` | — | Reviews for a product |
| POST | `/products/:slug/reviews` | user | Create/update your review |

**`GET /products` query params:** `page` (default 1), `limit` (1–500, default 12), `category` (slug), `q` (search), `tag`, `minPrice`, `maxPrice`, `inStock` (bool), `sort` (`featured|price_asc|price_desc|rating|newest|name`).

```jsonc
// GET /products?category=electronics&sort=price_asc&limit=2
{
  "data": [ { "id": 1, "name": "...", "slug": "...", "price": 49.99, "image": "...",
              "category": "Electronics", "rating": 4.5, "reviews": 120, "inStock": true,
              "discount": 10, "stock": 30, "colors": [...], "sizes": [...], "tags": [...] } ],
  "pagination": { "page": 1, "limit": 2, "total": 11, "totalPages": 6 }
}
```

```jsonc
// POST /products/gaming-mechanical-keyboard/reviews   (Bearer)
{ "rating": 5, "comment": "Great!" }   // -> { "success": true }
```

### Categories
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/categories` | — | All categories (with live product counts) |
| GET | `/categories/:slug` | — | Single category |

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | `{ email, password, displayName }` → `{ user, accessToken }` + cookie |
| POST | `/auth/login` | — | `{ email, password }` → `{ user, accessToken }` + cookie |
| POST | `/auth/refresh` | cookie | New access token (rotates refresh) |
| POST | `/auth/logout` | — | Revoke refresh token, clear cookie |
| GET | `/auth/me` | user | Current user |

### Cart  (all `user`)
| Method | Path | Description |
|---|---|---|
| GET | `/cart` | `{ items, totalItems, totalPrice }` |
| POST | `/cart` | `{ productId, quantity? }` — add/increment |
| POST | `/cart/merge` | `{ items: [{ productId, quantity }] }` — merge guest cart |
| PATCH | `/cart/:productId` | `{ quantity }` — set (0 removes) |
| DELETE | `/cart/:productId` | Remove one item |
| DELETE | `/cart` | Empty the cart |

### Wishlist  (all `user`)
| Method | Path | Description |
|---|---|---|
| GET | `/wishlist` | `{ items: Product[] }` |
| POST | `/wishlist` | `{ productId }` |
| DELETE | `/wishlist/:productId` | Remove |

### Account  (all `user`)
| Method | Path | Description |
|---|---|---|
| PATCH | `/account/profile` | `{ displayName?, photoURL? }` |
| GET | `/account/addresses` | List addresses |
| POST | `/account/addresses` | Create (`{ fullName, line1, line2?, city, state?, postalCode, country, phone?, isDefault? }`) |
| PATCH | `/account/addresses/:id` | Update / set default |
| DELETE | `/account/addresses/:id` | Delete |

### Orders  (all `user`)
| Method | Path | Description |
|---|---|---|
| POST | `/orders` | Create from cart. Body: `{ addressId }` or `{ shippingAddress }`. Validates stock, snapshots prices, decrements stock, clears cart. Auto-`PAID` in mock mode. |
| GET | `/orders` | Your orders |
| GET | `/orders/:id` | Single order (owner or admin) |

### Payments
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/payments/create-intent` | user | `{ orderId }` → `{ clientSecret }` (503 if Stripe not configured) |
| POST | `/payments/webhook` | Stripe sig | Marks order `PAID` on `payment_intent.succeeded` (raw body, signature-verified) |

### Admin  (all `admin`)
| Method | Path | Description |
|---|---|---|
| GET | `/admin/products` | All products (incl. inactive) |
| POST | `/admin/products` | Create (`{ name, description, price, image, categoryId, discount?, stock?, tags?, colors?, sizes? }`) |
| PATCH | `/admin/products/:id` | Update (partial) |
| DELETE | `/admin/products/:id` | Soft-delete (`isActive=false`) |
| POST | `/admin/categories` | Create (`{ name, image?, description?, gradient? }`) |
| PATCH | `/admin/categories/:id` | Update |
| DELETE | `/admin/categories/:id` | Delete (must have 0 products) |
| GET | `/admin/orders` | All orders with customer info |
| PATCH | `/admin/orders/:id/status` | `{ status }` |

---

## 9. Frontend Architecture

### Data fetching
- **Read** state uses **SWR** hooks in [`lib/hooks.ts`](lib/hooks.ts): `useProducts`, `useProduct(slug)`, `useRelatedProducts(slug)`, `useCategories`, `useCategory(slug)`, `useProductReviews(slug)`, `useOrders(enabled)`, `useOrder(id)`, `useAddresses(enabled)`, `useAdminProducts`, `useAdminOrders`.
- **Mutations** go through [`lib/api.ts`](lib/api.ts): `api.get/post/patch/del(path, body?, auth?)`. Pass `auth=true` to attach the Bearer token; it auto-refreshes on 401.

### Client state (Zustand)
- [`store/useStore.ts`](store/useStore.ts) — cart & wishlist. Optimistic local updates; when logged in, each change also syncs to the server. `hydrateFromServer()` / `syncGuestStateToServer()` handle login.
- [`store/useAuthStore.ts`](store/useAuthStore.ts) — `user`, `status` (`loading|authenticated|guest`), `login/register/logout/loadSession/refreshUser`.
- [`components/providers/AuthProvider.tsx`](components/providers/AuthProvider.tsx) restores the session once on app load.

### Rendering
- `next.config.mjs` is **not** a static export — product/category/sitemap routes render dynamically (SSR/ISR) so SEO sees live data. Product detail pages fetch server-side for `<title>` + JSON-LD.

---

## 10. Admin Guide

Sign in as an admin, then open **`/admin`** (a shortcut also appears in Account).

- **Products** — create/edit (modal form), deactivate.
- **Categories** — create, rename (inline), delete.
- **Orders** — view all, change status via dropdown.

**Make a user an admin:** open Prisma Studio (`cd backend && npm run prisma:studio`), edit the `User` row, set `role = ADMIN`.

---

## 11. Payments

Two modes, switched automatically:

- **Mock mode (default)** — no real Stripe key. Orders are created and immediately marked `PAID` (`payment.provider = "mock"`). Good for demos/dev.
- **Live mode** — set `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` (backend) and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (frontend). Flow:
  1. Checkout creates the order (`PENDING`).
  2. Frontend calls `POST /payments/create-intent` → `clientSecret`.
  3. Stripe **PaymentElement** ([`components/checkout/StripePayment.tsx`](components/checkout/StripePayment.tsx)) collects the card and confirms.
  4. Stripe calls `POST /payments/webhook` → order marked `PAID`.

> A placeholder key like `sk_test_xxx` counts as "not configured" (stays in mock mode).

---

## 12. Operations

Run inside `backend/`:

| Command | Purpose |
|---|---|
| `npm run dev` | Start API (watch mode) |
| `npm run build` / `npm start` | Compile / run production build |
| `npm run extract` | Regenerate seed JSON from `data/products.ts` |
| `npm run prisma:migrate` | Create/apply migrations (dev) |
| `npm run prisma:studio` | Visual DB editor |
| `npm run seed` | (Re)seed catalog + admin user |
| `npm run db:reset` | **Wipe**, migrate, reseed (dev only) |

**Backup / restore (MySQL):**
```bash
mysqldump -h 127.0.0.1 -u root -p luxecart > backup.sql
mysql     -h 127.0.0.1 -u root -p luxecart < backup.sql
```

---

## 13. Deployment

**API + MySQL** — build the [`backend/Dockerfile`](backend/Dockerfile) on Railway/Render/Fly (or `docker compose up`). The container runs `prisma migrate deploy` then starts. Provide production env vars (DB URL, JWT secrets, CORS origin, Stripe keys).

**Storefront** — deploy to Vercel or Firebase App Hosting (SSR; not plain static hosting). Set `NEXT_PUBLIC_API_URL` to the deployed API and ensure the API's `CORS_ORIGINS` includes the storefront domain.

**Go-live checklist:**
- [ ] Change the default admin password
- [ ] Strong `JWT_*` secrets
- [ ] Real Stripe keys + webhook endpoint
- [ ] `CORS_ORIGINS` = production storefront URL
- [ ] `NEXT_PUBLIC_SITE_URL` = production domain
- [ ] Database backups scheduled

---

## 14. Troubleshooting

| Symptom | Cause / Fix |
|---|---|
| Products don't load | API not running, or `NEXT_PUBLIC_API_URL` wrong. Check `GET /api/health`. |
| `EADDRINUSE :4000/:3000` | A server is already running on that port — stop it first. |
| 401 loops / logged out instantly | Refresh cookie blocked (cross-site). Keep frontend+API same-site, or set cookie `SameSite=None; Secure` in prod over HTTPS. |
| CORS error in browser | Add the frontend origin to `CORS_ORIGINS` and restart the API. |
| `Access denied` on migrate | Wrong `DATABASE_URL` credentials. |
| Checkout says "Stripe not configured" | Expected without keys — mock mode auto-pays. Add keys for live. |
| Empty product list after many reseeds | Auto-increment IDs climb; use **slugs** (stable) not numeric IDs to reference products. |

---

_For a quick-start summary see [README.md](README.md); for the API-only quick reference see [backend/README.md](backend/README.md)._
