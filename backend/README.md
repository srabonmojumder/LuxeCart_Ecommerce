# LuxeCart API

Node.js + Express + Prisma + MySQL REST API for the LuxeCart storefront.

## Quick start

```bash
cd backend
cp .env.example .env          # adjust DATABASE_URL if your MySQL differs
npm install

npm run extract               # data/products.ts -> prisma/data/*.json
npm run prisma:generate       # generate Prisma client
npm run prisma:migrate        # create DB + tables (name it e.g. "init")
npm run seed                  # load products & categories into MySQL

npm run dev                   # http://localhost:4000/api
```

> Local MySQL: Laravel Herd ships one (user `root`, no password, `127.0.0.1:3306`).
> Create the `luxecart` database, or let `prisma migrate dev` create it for you.

## Endpoints (Phase 1–2)

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List products — `?page&limit&category&q&tag&minPrice&maxPrice&inStock&sort` |
| GET | `/api/products/:slug` | Single product |
| GET | `/api/products/:slug/related` | Related products (same category) |
| GET | `/api/categories` | List categories |
| GET | `/api/categories/:slug` | Single category |

`sort` ∈ `featured | price_asc | price_desc | rating | newest | name`.

## Roadmap

- ✅ Phase 1: schema + seed from static data
- ✅ Phase 2: catalog API (products, categories, search, filtering, pagination)
- ⬜ Phase 3: JWT auth, server-side cart & wishlist, addresses
- ⬜ Phase 4: orders + Stripe checkout & webhooks
- ⬜ Phase 5: frontend integration (replace `data/products.ts` imports)
- ⬜ Phase 6: admin CRUD + image uploads
- ⬜ Phase 7: deployment
