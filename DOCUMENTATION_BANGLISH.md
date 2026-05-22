# LuxeCart — Documentation (Banglish)

> Eta holo LuxeCart er full technical documentation, Banglish e lekha. Code, command ar endpoint gula English/code-i ache (oigula exact thaka lagbe), kintu bujhano gula Banglish e.
> English version chaile dekhun: [DOCUMENTATION.md](DOCUMENTATION.md)

LuxeCart ekta **full-stack e-commerce** — **Next.js** diye banano storefront (frontend), ar tar pichone ekta alada **Node.js + Express + Prisma + MySQL** REST API (backend).

## Sucipotro (Table of Contents)
- [1. Overview & Architecture](#1-overview--architecture)
- [2. Tech Stack](#2-tech-stack)
- [3. Project Structure](#3-project-structure)
- [4. Setup / Kivabe Cholabo](#4-setup--kivabe-cholabo)
- [5. Environment Variables](#5-environment-variables)
- [6. Database Schema](#6-database-schema)
- [7. Authentication (Login System)](#7-authentication-login-system)
- [8. API Reference](#8-api-reference)
- [9. Frontend Architecture](#9-frontend-architecture)
- [10. Admin Guide](#10-admin-guide)
- [11. Payments](#11-payments)
- [12. Operations (Daily Kaj)](#12-operations-daily-kaj)
- [13. Deployment (Live Kora)](#13-deployment-live-kora)
- [14. Troubleshooting (Somossha Solve)](#14-troubleshooting-somossha-solve)

---

## 1. Overview & Architecture

Project ta **dui ta alada app** — kintu ekta-i repo te:

```
┌──────────────────────────┐         ┌──────────────────────────┐         ┌─────────────┐
│  Storefront (Next.js)     │  HTTPS  │  API (Express)            │  SQL    │   MySQL     │
│  - SSR product pages      │ ──────► │  - REST endpoints         │ ──────► │  (Prisma)   │
│  - SWR diye data fetch     │ ◄────── │  - JWT auth               │ ◄────── │             │
│  - Zustand cart/wishlist  │  JSON   │  - Stripe payments        │         │             │
└──────────────────────────┘         └──────────────────────────┘         └─────────────┘
        :3000                                  :4000                            :3306
```

- **Storefront** (`/app`, `/components`, `/lib`, `/store`) — UI dekhায়, ar API te HTTP request kore.
- **API** (`/backend`) — shob business logic ar database er kaj eikhane hoy.
- Browser **kokhono direct MySQL** e jaay na — shob kichu API er moddhe diye jaay (eta secure).

---

## 2. Tech Stack

| Layer | Ki use hoyeche |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion |
| Data fetch | SWR (server data) + Zustand (cart/wishlist/auth er client state) |
| Backend | Node.js, Express 4, TypeScript (ESM) |
| Validation | Zod (input check korar jonno) |
| ORM / DB | Prisma + MySQL 8 |
| Auth | JWT (access + refresh), `bcryptjs` diye password hash, httpOnly refresh cookie |
| Payments | Stripe (`stripe` server SDK, `@stripe/react-stripe-js` Elements) |
| Security | `helmet`, `cors`, `express-rate-limit` |

---

## 3. Project Structure

```
LuxeCart_Ecommerce/
├── app/                      # Next.js er shob page (route)
│   ├── page.tsx              # Home page
│   ├── products/             # List + [id] detail (SSR, slug diye)
│   ├── categories/           # Category gula
│   ├── cart/ wishlist/ compare/
│   ├── checkout/             # Order create + Stripe payment modal
│   ├── order-success/        # Real order er receipt
│   ├── account/              # Login gate, orders, addresses, profile
│   ├── admin/                # Admin dashboard (sudhu admin er jonno)
│   └── sitemap.ts            # API theke dynamic sitemap
├── components/               # UI component gula
│   ├── auth/AuthForm.tsx
│   ├── account/ProfileForm.tsx, AddressBook.tsx
│   ├── checkout/StripePayment.tsx
│   ├── product/ReviewSection.tsx, ProductCard.tsx ...
│   └── providers/AuthProvider.tsx
├── lib/
│   ├── api.ts                # Fetch client (401 hole nije refresh kore)
│   ├── authToken.ts          # Access token store kore rakhe
│   ├── hooks.ts              # SWR hooks (products, categories, orders ...)
│   └── seo.ts
├── store/
│   ├── useStore.ts           # Cart + wishlist (server er sathe sync hoy)
│   └── useAuthStore.ts       # Auth/login state
├── data/products.ts          # Seed er mul data (backend extract kore eta theke)
├── backend/                  # ── API ekhane ──
│   ├── prisma/
│   │   ├── schema.prisma     # Database design
│   │   ├── seed.ts           # Products/categories/admin seed kore
│   │   └── data/*.json       # data/products.ts theke generate hoy
│   ├── scripts/extract-data.mjs
│   ├── src/
│   │   ├── index.ts          # Server start hoy ekhane
│   │   ├── app.ts            # Express app + middleware
│   │   ├── lib/              # env, prisma, jwt, stripe
│   │   ├── middleware/       # auth, error handle
│   │   ├── controllers/      # request handle kora logic
│   │   ├── routes/           # route gula define
│   │   └── serializers/      # DB data -> API shape
│   ├── Dockerfile
│   └── .env
├── docker-compose.yml        # MySQL + API ek sathe
└── next.config.mjs
```

---

## 4. Setup / Kivabe Cholabo

**Lagbe:** Node 20+, ar ekta chalu MySQL 8 server.

### Backend chalu kora

```bash
cd backend
cp .env.example .env          # DATABASE_URL + JWT secret bosao
npm install
npm run extract               # data/products.ts -> prisma/data/*.json
npm run prisma:migrate        # DB + table banabe (seed o nije run hobe)
npm run dev                   # http://localhost:4000/api
```

Eita **48 ta product / 7 ta category / 148 ta tag** ar ekta admin user seed kore:
**`admin@luxecart.com` / `admin123`**.

### Frontend chalu kora

```bash
# project root e
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev                        # http://localhost:3000
```

### Ek command e (Docker diye)

```bash
docker compose up            # MySQL + API; frontend ta alada vabe npm run dev diye chalao
```

> **Mone rakho:** backend ar frontend — dui ta ek sathe chalu thakte hobe.

---

## 5. Environment Variables

### Backend (`backend/.env`)

| Variable | Example | Mane |
|---|---|---|
| `PORT` | `4000` | API kon port e cholbe |
| `NODE_ENV` | `development` | `development` / `production` / `test` |
| `CORS_ORIGINS` | `http://localhost:3000` | kon frontend allow korbe (comma diye onek) |
| `DATABASE_URL` | `mysql://root:password@127.0.0.1:3306/luxecart` | Prisma connection |
| `JWT_ACCESS_SECRET` | `…` | access token sign kore |
| `JWT_REFRESH_SECRET` | `…` | refresh token sign kore |
| `JWT_ACCESS_EXPIRES` | `15m` | access token koto khon thakbe |
| `JWT_REFRESH_EXPIRES` | `7d` | refresh token koto din thakbe |
| `STRIPE_SECRET_KEY` | `sk_test_…` | optional; na dile mock mode |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` | optional; live webhook er jonno lagbe |

### Frontend (`.env.local`)

| Variable | Example | Mane |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` | API er address |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | SEO/canonical er jonno |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_…` | optional; dile real Stripe checkout cholbe |

---

## 6. Database Schema

Shob design ache [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma) file e.

### Catalog (product related)
- **Category** — `id, name, slug, image?, description?, gradient?, count` → onek Product er sathe somporko.
- **Product** — `id, name, slug, description, price, discount, image, stock, inStock, isActive, ratingAvg, reviewCount, colors(JSON), sizes(JSON), categoryId`.
- **ProductImage** — gallery er chobi (`url, alt, position`).
- **ProductVariant** — `color?, size?, sku?, price?, stock` (future inventory er jonno).
- **Tag** + **ProductTag** — product ar tag er many-to-many somporko.
- **Review** — `rating, comment?, productId, userId` (per user ekta review; rating average auto hisab hoy).

### User & Auth
- **User** — `id, email, passwordHash, displayName?, photoURL?, role(CUSTOMER|ADMIN)`.
- **RefreshToken** — refresh token hashed kore rakha (rotate/revoke korar jonno).
- **Address** — save kora shipping address (`isDefault`).

### Commerce
- **Cart** (per user ekta) + **CartItem** (`productId, variantId?, quantity`).
- **Order** — `status, subtotal, shipping, tax, total, shippingAddress(JSON)` + **OrderItem** (price/name snapshot).
- **Payment** — `provider, status, amount, stripeIntentId?` (Order er sathe 1:1).
- **WishlistItem** — `userId, productId`.

### Enums
- `Role`: `CUSTOMER`, `ADMIN`
- `OrderStatus`: `PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED`

---

## 7. Authentication (Login System)

JWT diye kora, sathe token rotation:

1. **Register/Login** korle API `{ user, accessToken }` dey, ar ekta **httpOnly refresh-token cookie** set kore.
2. **Access token** (15 min) client e thake ([`lib/authToken.ts`](lib/authToken.ts)), ar protita request e `Authorization: Bearer <token>` hisebe jaay.
3. Token expire hoye `401` ele, [`lib/api.ts`](lib/api.ts) chupichupi `POST /auth/refresh` call kore (cookie diye), notun token niye request ta abar chalay. (single-flight — onek 401 ek sathe ele ekbar-i refresh hoy)
4. **Refresh token protibar rotate hoy** ar DB te hashed thake, tai dorkar hole revoke kora jaay.
5. **Logout** korle refresh token delete hoy + cookie clear hoy.

**Role:** `/admin/*` route gula te `role = ADMIN` lagbe (`requireAdmin` middleware check kore). Frontend `/admin` page o role check kore.

**Guest → user merge:** guest thakakalin localStorage er cart/wishlist, login korle server e push hoy (`POST /cart/merge`), tarpor server theke load hoy.

---

## 8. API Reference

Base URL: `http://localhost:4000/api`. Shob body JSON. **Mot 41 ta endpoint.**

**Auth column er mane:** `—` public · `user` Bearer token lagbe · `admin` admin token lagbe · `cookie` refresh cookie lagbe.

### Niyom
- Success: `200/201`, response `{ data: ... }` (ba resource-specific shape).
- Error: `4xx/5xx`, response `{ error: string, details?: any }`.

### Health
| Method | Path | Auth | Ki kore |
|---|---|---|---|
| GET | `/health` | — | `{ status: "ok", timestamp }` |

### Products
| Method | Path | Auth | Ki kore |
|---|---|---|---|
| GET | `/products` | — | Filter soho list (niche dekho) |
| GET | `/products/:slug` | — | Ekta product |
| GET | `/products/:slug/related` | — | Same category er 4 ta product |
| GET | `/products/:slug/reviews` | — | Product er review gula |
| POST | `/products/:slug/reviews` | user | Tomar review add/update |

**`GET /products` query param:** `page` (default 1), `limit` (1–500, default 12), `category` (slug), `q` (search), `tag`, `minPrice`, `maxPrice`, `inStock` (bool), `sort` (`featured|price_asc|price_desc|rating|newest|name`).

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
// POST /products/gaming-mechanical-keyboard/reviews   (Bearer token soho)
{ "rating": 5, "comment": "Great!" }   // -> { "success": true }
```

### Categories
| Method | Path | Auth | Ki kore |
|---|---|---|---|
| GET | `/categories` | — | Shob category (live product count soho) |
| GET | `/categories/:slug` | — | Ekta category |

### Auth
| Method | Path | Auth | Ki kore |
|---|---|---|---|
| POST | `/auth/register` | — | `{ email, password, displayName }` → `{ user, accessToken }` + cookie |
| POST | `/auth/login` | — | `{ email, password }` → `{ user, accessToken }` + cookie |
| POST | `/auth/refresh` | cookie | Notun access token (refresh rotate hoy) |
| POST | `/auth/logout` | — | Refresh token bad + cookie clear |
| GET | `/auth/me` | user | Ekhonkar user |

### Cart  (shob `user`)
| Method | Path | Ki kore |
|---|---|---|
| GET | `/cart` | `{ items, totalItems, totalPrice }` |
| POST | `/cart` | `{ productId, quantity? }` — add/baray |
| POST | `/cart/merge` | `{ items: [{ productId, quantity }] }` — guest cart merge |
| PATCH | `/cart/:productId` | `{ quantity }` — set kore (0 dile remove) |
| DELETE | `/cart/:productId` | Ekta item remove |
| DELETE | `/cart` | Pura cart khali |

### Wishlist  (shob `user`)
| Method | Path | Ki kore |
|---|---|---|
| GET | `/wishlist` | `{ items: Product[] }` |
| POST | `/wishlist` | `{ productId }` |
| DELETE | `/wishlist/:productId` | Remove |

### Account  (shob `user`)
| Method | Path | Ki kore |
|---|---|---|
| PATCH | `/account/profile` | `{ displayName?, photoURL? }` |
| GET | `/account/addresses` | Address list |
| POST | `/account/addresses` | Notun address (`{ fullName, line1, line2?, city, state?, postalCode, country, phone?, isDefault? }`) |
| PATCH | `/account/addresses/:id` | Update / default set |
| DELETE | `/account/addresses/:id` | Delete |

### Orders  (shob `user`)
| Method | Path | Ki kore |
|---|---|---|
| POST | `/orders` | Cart theke order. Body: `{ addressId }` ba `{ shippingAddress }`. Stock check, price snapshot, stock kombe, cart khali hobe. Mock mode e auto-`PAID`. |
| GET | `/orders` | Tomar order gula |
| GET | `/orders/:id` | Ekta order (malik ba admin) |

### Payments
| Method | Path | Auth | Ki kore |
|---|---|---|---|
| POST | `/payments/create-intent` | user | `{ orderId }` → `{ clientSecret }` (Stripe na thakle 503) |
| POST | `/payments/webhook` | Stripe sig | `payment_intent.succeeded` ele order `PAID` kore (raw body, signature verify) |

### Admin  (shob `admin`)
| Method | Path | Ki kore |
|---|---|---|
| GET | `/admin/products` | Shob product (inactive soho) |
| POST | `/admin/products` | Notun (`{ name, description, price, image, categoryId, discount?, stock?, tags?, colors?, sizes? }`) |
| PATCH | `/admin/products/:id` | Update (partial) |
| DELETE | `/admin/products/:id` | Soft-delete (`isActive=false`) |
| POST | `/admin/categories` | Notun category (`{ name, image?, description?, gradient? }`) |
| PATCH | `/admin/categories/:id` | Update |
| DELETE | `/admin/categories/:id` | Delete (product 0 thakle) |
| GET | `/admin/orders` | Shob order, customer info soho |
| PATCH | `/admin/orders/:id/status` | `{ status }` |

---

## 9. Frontend Architecture

### Data fetch
- **Read** korar jonno **SWR** hooks ([`lib/hooks.ts`](lib/hooks.ts)): `useProducts`, `useProduct(slug)`, `useRelatedProducts(slug)`, `useCategories`, `useCategory(slug)`, `useProductReviews(slug)`, `useOrders(enabled)`, `useOrder(id)`, `useAddresses(enabled)`, `useAdminProducts`, `useAdminOrders`.
- **Mutation** (create/update/delete) hoy [`lib/api.ts`](lib/api.ts) diye: `api.get/post/patch/del(path, body?, auth?)`. `auth=true` dile Bearer token juড়ে, ar 401 hole nije refresh kore.

### Client state (Zustand)
- [`store/useStore.ts`](store/useStore.ts) — cart & wishlist. UI te sathe sathe update hoy (optimistic); login thakle protita change server eo jaay. `hydrateFromServer()` / `syncGuestStateToServer()` login er somoy kaj kore.
- [`store/useAuthStore.ts`](store/useAuthStore.ts) — `user`, `status` (`loading|authenticated|guest`), `login/register/logout/loadSession/refreshUser`.
- [`components/providers/AuthProvider.tsx`](components/providers/AuthProvider.tsx) — app load er somoy ekbar session restore kore.

### Rendering
- `next.config.mjs` te ar **static export nai** — product/category/sitemap route gula dynamic (SSR/ISR), tai SEO live data dekhe. Product detail page server side e fetch kore `<title>` + JSON-LD er jonno.

---

## 10. Admin Guide

Admin diye login kore **`/admin`** e jao (Account er moddhe shortcut o ache).

- **Products** — product add (modal form), edit, ba deactivate.
- **Categories** — create, rename (inline), delete.
- **Orders** — shob order dekho, dropdown diye status change koro.

**Kawke admin banate:** Prisma Studio kholo (`cd backend && npm run prisma:studio`), `User` table e tar `role` ke `ADMIN` koro, save.

---

## 11. Payments

Dui ta mode, nije nije switch hoy:

- **Mock mode (default)** — real Stripe key nai. Order create hoye sathe sathe `PAID` hoye jaay (`payment.provider = "mock"`). Demo/dev er jonno bhalo.
- **Live mode** — `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` (backend) ar `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (frontend) set koro. Flow:
  1. Checkout order create kore (`PENDING`).
  2. Frontend `POST /payments/create-intent` call kore → `clientSecret`.
  3. Stripe **PaymentElement** ([`components/checkout/StripePayment.tsx`](components/checkout/StripePayment.tsx)) card niye confirm kore.
  4. Stripe `POST /payments/webhook` call kore → order `PAID` hoy.

> `sk_test_xxx` er moto placeholder key "configured na" dhora hoy (mock mode-i thake).

---

## 12. Operations (Daily Kaj)

`backend/` folder er bhitore run koro:

| Command | Ki kore |
|---|---|
| `npm run dev` | API chalu (watch mode) |
| `npm run build` / `npm start` | Compile / production e cholbe |
| `npm run extract` | `data/products.ts` theke seed JSON abar banay |
| `npm run prisma:migrate` | Migration create/apply (dev) |
| `npm run prisma:studio` | Visual database editor (GUI) |
| `npm run seed` | Catalog + admin user (re)seed |
| `npm run db:reset` | **Sob mucche** diye migrate + reseed (sudhu dev) |

> ⚠️ `db:reset` shob data delete kore (real order/customer soho) — sudhu development e use koro.

**Backup / restore (MySQL):**
```bash
mysqldump -h 127.0.0.1 -u root -p luxecart > backup.sql
mysql     -h 127.0.0.1 -u root -p luxecart < backup.sql
```

---

## 13. Deployment (Live Kora)

**API + MySQL** — [`backend/Dockerfile`](backend/Dockerfile) diye Railway/Render/Fly e deploy koro (ba `docker compose up`). Container start er somoy `prisma migrate deploy` chole. Production env var (DB URL, JWT secret, CORS origin, Stripe key) dite hobe.

**Storefront** — Vercel ba Firebase App Hosting e deploy koro (SSR; sadha static hosting e cholbe na). `NEXT_PUBLIC_API_URL` ke deployed API er URL koro, ar API er `CORS_ORIGINS` e storefront domain rakho.

**Live korar age checklist:**
- [ ] Default admin password change koro
- [ ] Strong `JWT_*` secret bosao
- [ ] Real Stripe key + webhook endpoint
- [ ] `CORS_ORIGINS` = production storefront URL
- [ ] `NEXT_PUBLIC_SITE_URL` = production domain
- [ ] Database backup schedule koro

---

## 14. Troubleshooting (Somossha Solve)

| Somossha | Karon / Solution |
|---|---|
| Product load hoy na | API chalu nai, ba `NEXT_PUBLIC_API_URL` vul. `GET /api/health` check koro. |
| `EADDRINUSE :4000/:3000` | Oi port e age thekei kichu cholche — age bondho koro. |
| 401 loop / sathe sathe logout | Refresh cookie block hocche (cross-site). Frontend+API same-site rakho, ba production e HTTPS te cookie `SameSite=None; Secure` koro. |
| Browser e CORS error | `CORS_ORIGINS` e frontend origin add koro, API restart koro. |
| Migrate e `Access denied` | `DATABASE_URL` er user/password vul. |
| Checkout "Stripe not configured" bole | Key chara eta normal — mock mode auto-pay kore. Live er jonno key dao. |
| Onek reseed er por list khali | Auto-increment ID baртe thake; product reference e numeric ID na, **slug** (stable) use koro. |

---

_Quick start er jonno [README.md](README.md); sudhu API quick reference er jonno [backend/README.md](backend/README.md); full English version [DOCUMENTATION.md](DOCUMENTATION.md)._
