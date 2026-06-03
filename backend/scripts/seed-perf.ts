/**
 * Performance / load seeder for LuxeCart.
 *
 * Goal: append a LARGE amount of realistic-looking data on top of whatever is
 * already in the database (it never deletes existing rows) so you can see how
 * the storefront behaves at scale — which pages are fast and which get slow.
 *
 * Every row this script creates carries a recognisable marker so it can be
 * removed later with `scripts/clean-perf.ts` without touching real data:
 *   - products / categories  -> slug starts with "perf-"
 *   - users                  -> email ends with "@loadtest.local"
 *   - orders                 -> carrier = "PERFSEED"
 *   - coupons                -> code starts with "PERF-"
 *   - banners                -> title starts with "Perf Banner"
 *
 * Scale is configurable via env vars (defaults = the "Extreme" preset):
 *   PERF_PRODUCTS=50000 PERF_USERS=10000 PERF_ORDERS=40000 PERF_REVIEWS=250000 \
 *   PERF_WISHLIST=20000 PERF_CARTS=2000 PERF_CATEGORIES=20 \
 *   npx tsx scripts/seed-perf.ts
 *
 * Run from the backend/ directory:  npm run seed:perf
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ----------------------------- config -----------------------------
const num = (env: string, def: number) => {
  const v = Number(process.env[env]);
  return Number.isFinite(v) && v > 0 ? Math.floor(v) : def;
};

const PRODUCTS = num('PERF_PRODUCTS', 50_000);
const USERS = num('PERF_USERS', 10_000);
const ORDERS = num('PERF_ORDERS', 40_000);
const REVIEWS = num('PERF_REVIEWS', 250_000);
const WISHLIST = num('PERF_WISHLIST', 20_000);
const CARTS = num('PERF_CARTS', 2_000);
const EXTRA_CATEGORIES = num('PERF_CATEGORIES', 20);

// runId keeps slugs/emails unique across repeated runs; the "perf-" / marker
// prefixes stay constant so cleanup catches every run.
const runId = Date.now().toString(36);

// ----------------------------- helpers -----------------------------
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const chance = (p: number) => Math.random() < p;
const round2 = (n: number) => Math.round(n * 100) / 100;

/** Insert `rows` in chunks so we never blow past MySQL packet/placeholder limits. */
async function bulkInsert<T>(
  label: string,
  rows: T[],
  chunkSize: number,
  insert: (chunk: T[]) => Promise<unknown>,
) {
  let done = 0;
  for (let i = 0; i < rows.length; i += chunkSize) {
    await insert(rows.slice(i, i + chunkSize));
    done += Math.min(chunkSize, rows.length - i);
    if (done % (chunkSize * 10) === 0 || done === rows.length) {
      process.stdout.write(`\r  ${label}: ${done.toLocaleString()}/${rows.length.toLocaleString()}   `);
    }
  }
  process.stdout.write('\n');
}

/** Generate-and-insert in streaming chunks (keeps memory bounded for huge counts). */
async function streamInsert(
  label: string,
  total: number,
  chunkSize: number,
  makeRow: (i: number) => any,
  insert: (chunk: any[]) => Promise<unknown>,
) {
  let done = 0;
  while (done < total) {
    const n = Math.min(chunkSize, total - done);
    const chunk = new Array(n);
    for (let k = 0; k < n; k++) chunk[k] = makeRow(done + k);
    await insert(chunk);
    done += n;
    process.stdout.write(`\r  ${label}: ${done.toLocaleString()}/${total.toLocaleString()}   `);
  }
  process.stdout.write('\n');
}

// ----------------------------- word pools -----------------------------
const ADJ = ['Premium', 'Classic', 'Modern', 'Luxe', 'Eco', 'Ultra', 'Pro', 'Smart', 'Vintage', 'Sleek', 'Bold', 'Cozy', 'Urban', 'Elite', 'Pure', 'Nova', 'Prime', 'Soft', 'Rugged', 'Compact'];
const NOUN = ['Headphones', 'Sneakers', 'Backpack', 'Watch', 'Lamp', 'Jacket', 'Bottle', 'Speaker', 'Chair', 'Mug', 'Wallet', 'Keyboard', 'Sunglasses', 'Blender', 'Camera', 'Notebook', 'Sofa', 'Tripod', 'Charger', 'Hoodie', 'Drone', 'Toaster', 'Pillow', 'Cooker', 'Monitor', 'Mouse', 'Perfume', 'Sandals'];
const COLORS = ['#000000', '#FFFFFF', '#4A5568', '#E53E3E', '#3182CE', '#38A169', '#D69E2E', '#805AD5', '#DD6B20'];
const SIZE_SETS = [['One Size'], ['S', 'M', 'L', 'XL'], ['38', '40', '42', '44'], ['Small', 'Medium', 'Large']];
const REVIEW_COMMENTS = [
  'Great quality, exactly as described.',
  'Fast shipping and works perfectly.',
  'Decent for the price, would buy again.',
  'Not bad but packaging could be better.',
  'Absolutely love it! Highly recommend.',
  'It is okay, does the job.',
  'Exceeded my expectations.',
  'A little smaller than I thought.',
  'Excellent value for money.',
  'Five stars, no complaints.',
  'Stopped working after a week, disappointed.',
  'Comfortable and stylish.',
];
const FIRST = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Jamie', 'Avery', 'Quinn', 'Drew', 'Skyler'];
const LAST = ['Smith', 'Johnson', 'Lee', 'Patel', 'Garcia', 'Khan', 'Brown', 'Davis', 'Wilson', 'Roy', 'Das', 'Ali'];
const CITIES = ['New York', 'Dhaka', 'London', 'Toronto', 'Sydney', 'Berlin', 'Dubai', 'Singapore'];
const COUNTRIES = ['USA', 'Bangladesh', 'UK', 'Canada', 'Australia', 'Germany', 'UAE', 'Singapore'];
const ORDER_STATUSES = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

function ratingWeighted() {
  // skew toward 4-5 stars like real review data
  const r = Math.random();
  if (r < 0.5) return 5;
  if (r < 0.75) return 4;
  if (r < 0.88) return 3;
  if (r < 0.95) return 2;
  return 1;
}

// ----------------------------- main -----------------------------
async function main() {
  const t0 = Date.now();
  console.log(`\n🚀 Perf seed (runId=${runId})`);
  console.log(`   products=${PRODUCTS} users=${USERS} orders=${ORDERS} reviews=${REVIEWS} wishlist=${WISHLIST} carts=${CARTS}\n`);

  // pull a handful of real image URLs to rotate through (keeps the storefront looking real)
  const existingImages = (await prisma.product.findMany({ select: { image: true }, take: 30 }))
    .map((p) => p.image)
    .filter(Boolean);
  const IMAGES = existingImages.length ? existingImages : ['/photo-1505740420928-5e560c06d30e.webp'];

  // ---- 1. extra categories ----
  console.log('① Categories');
  await bulkInsert(
    'categories',
    Array.from({ length: EXTRA_CATEGORIES }, (_, i) => ({
      name: `Perf Category ${runId}-${i}`,
      slug: `perf-${runId}-c${i}`,
      image: pick(IMAGES),
      description: 'Auto-generated category for performance testing.',
      gradient: 'from-slate-500 to-slate-700',
      count: 0,
    })),
    500,
    (c) => prisma.category.createMany({ data: c, skipDuplicates: true }),
  );
  const allCategoryIds = (await prisma.category.findMany({ select: { id: true } })).map((c) => c.id);
  const allTagIds = (await prisma.tag.findMany({ select: { id: true } })).map((t) => t.id);

  // ---- 2. products ----
  console.log('② Products');
  await streamInsert(
    'products',
    PRODUCTS,
    1000,
    (i) => {
      const base = randInt(5, 800) + (chance(0.5) ? 0.99 : 0);
      return {
        name: `${pick(ADJ)} ${pick(NOUN)}`,
        slug: `perf-${runId}-p${i}`,
        description: `${pick(ADJ)} quality ${pick(NOUN).toLowerCase()} built for everyday use. Performance-test seed item #${i}.`,
        price: round2(base),
        discount: chance(0.4) ? pick([5, 10, 15, 20, 25, 30, 50]) : 0,
        image: pick(IMAGES),
        stock: randInt(0, 500),
        inStock: chance(0.9),
        isActive: true,
        featured: chance(0.05),
        ratingAvg: 0,
        reviewCount: 0,
        colors: COLORS.slice(0, randInt(2, 5)),
        sizes: pick(SIZE_SETS),
        categoryId: pick(allCategoryIds),
      };
    },
    (c) => prisma.product.createMany({ data: c, skipDuplicates: true }),
  );
  const seededProducts = await prisma.product.findMany({
    where: { slug: { startsWith: `perf-${runId}-p` } },
    select: { id: true, name: true, price: true },
  });
  const seededProductIds = seededProducts.map((p) => p.id);
  console.log(`   -> ${seededProductIds.length.toLocaleString()} product ids collected`);

  // ---- 3. product images (1 each) ----
  console.log('③ Product images');
  await streamInsert(
    'images',
    seededProductIds.length,
    4000,
    (i) => ({ productId: seededProductIds[i], url: pick(IMAGES), alt: 'product image', position: 0 }),
    (c) => prisma.productImage.createMany({ data: c, skipDuplicates: true }),
  );

  // ---- 4. product tags (0-3 each) ----
  if (allTagIds.length) {
    console.log('④ Product tags');
    const tagRows: { productId: number; tagId: number }[] = [];
    for (const pid of seededProductIds) {
      const n = randInt(0, 3);
      const used = new Set<number>();
      for (let k = 0; k < n; k++) {
        const tid = pick(allTagIds);
        if (used.has(tid)) continue;
        used.add(tid);
        tagRows.push({ productId: pid, tagId: tid });
      }
    }
    await bulkInsert('product_tags', tagRows, 4000, (c) =>
      prisma.productTag.createMany({ data: c, skipDuplicates: true }),
    );
  }

  // ---- 5. users ----
  console.log('⑤ Users');
  const passwordHash = bcrypt.hashSync('Password123!', 10); // hashed once, reused
  await streamInsert(
    'users',
    USERS,
    2000,
    (i) => ({
      email: `perf-${runId}-u${i}@loadtest.local`,
      passwordHash,
      displayName: `${pick(FIRST)} ${pick(LAST)}`,
      role: 'CUSTOMER',
    }),
    (c) => prisma.user.createMany({ data: c, skipDuplicates: true }),
  );
  const seededUserIds = (
    await prisma.user.findMany({
      where: { email: { startsWith: `perf-${runId}-u` } },
      select: { id: true },
    })
  ).map((u) => u.id);
  console.log(`   -> ${seededUserIds.length.toLocaleString()} user ids collected`);

  // ---- 6. reviews ----
  console.log('⑥ Reviews');
  await streamInsert(
    'reviews',
    REVIEWS,
    4000,
    () => ({
      productId: pick(seededProductIds),
      userId: pick(seededUserIds),
      rating: ratingWeighted(),
      comment: chance(0.8) ? pick(REVIEW_COMMENTS) : null,
    }),
    // skipDuplicates handles the unique (productId, userId) constraint
    (c) => prisma.review.createMany({ data: c, skipDuplicates: true }),
  );

  // ---- 6b. recompute product rating aggregates from the new reviews ----
  console.log('   updating product rating aggregates...');
  await prisma.$executeRawUnsafe(
    `UPDATE Product p
       JOIN (SELECT productId, COUNT(*) c, AVG(rating) a FROM Review GROUP BY productId) r
         ON p.id = r.productId
        SET p.reviewCount = r.c, p.ratingAvg = r.a
      WHERE p.slug LIKE 'perf-${runId}-p%'`,
  );

  // ---- 7. orders + order items ----
  console.log('⑦ Orders');
  await streamInsert(
    'orders',
    ORDERS,
    1000,
    (i) => {
      const guest = chance(0.1);
      const subtotal = round2(randInt(20, 1500) + 0.99);
      const shipping = chance(0.6) ? 0 : 9.99;
      const tax = round2(subtotal * 0.08);
      const discount = chance(0.2) ? round2(subtotal * 0.1) : 0;
      return {
        userId: guest ? null : pick(seededUserIds),
        email: `perf-${runId}-o${i}@loadtest.local`,
        status: pick(ORDER_STATUSES),
        subtotal,
        shipping,
        tax,
        discount,
        total: round2(subtotal + shipping + tax - discount),
        carrier: 'PERFSEED', // marker for cleanup
        trackingNumber: `perf-${runId}-o${i}`,
        shippingAddress: {
          fullName: `${pick(FIRST)} ${pick(LAST)}`,
          line1: `${randInt(1, 999)} ${pick(NOUN)} St`,
          city: pick(CITIES),
          state: 'NA',
          postalCode: String(randInt(10000, 99999)),
          country: pick(COUNTRIES),
          phone: `+1${randInt(2000000000, 9999999999)}`,
        },
      };
    },
    (c) => prisma.order.createMany({ data: c, skipDuplicates: true }),
  );
  const seededOrderIds = (
    await prisma.order.findMany({
      where: { carrier: 'PERFSEED', trackingNumber: { startsWith: `perf-${runId}-o` } },
      select: { id: true },
    })
  ).map((o) => o.id);
  console.log(`   -> ${seededOrderIds.length.toLocaleString()} order ids collected`);

  console.log('⑦b Order items');
  // Build a quick lookup so item snapshots carry a realistic name/price.
  const prodById = new Map(seededProducts.map((p) => [p.id, p]));
  let oIdx = 0;
  await streamInsert(
    'order_items',
    seededOrderIds.length,
    1500,
    () => {
      const orderId = seededOrderIds[oIdx++];
      const items = randInt(1, 4);
      const rows: any[] = [];
      for (let k = 0; k < items; k++) {
        const pid = pick(seededProductIds);
        const p = prodById.get(pid);
        rows.push({
          orderId,
          productId: pid,
          name: p?.name ?? 'Product',
          price: p?.price ?? 9.99,
          quantity: randInt(1, 3),
        });
      }
      return rows;
    },
    // each "row" is actually an array of items -> flatten before insert
    async (chunkOfArrays: any[][]) => {
      const flat = chunkOfArrays.flat();
      await prisma.orderItem.createMany({ data: flat, skipDuplicates: true });
    },
  );

  // ---- 8. wishlist ----
  console.log('⑧ Wishlist');
  await streamInsert(
    'wishlist',
    WISHLIST,
    4000,
    () => ({ userId: pick(seededUserIds), productId: pick(seededProductIds) }),
    (c) => prisma.wishlistItem.createMany({ data: c, skipDuplicates: true }),
  );

  // ---- 9. carts + cart items ----
  console.log('⑨ Carts');
  const cartUserIds = seededUserIds.slice(0, Math.min(CARTS, seededUserIds.length));
  await bulkInsert(
    'carts',
    cartUserIds.map((userId) => ({ userId })),
    2000,
    (c) => prisma.cart.createMany({ data: c, skipDuplicates: true }),
  );
  const cartIds = (
    await prisma.cart.findMany({ where: { userId: { in: cartUserIds } }, select: { id: true } })
  ).map((c) => c.id);
  const cartItemRows: any[] = [];
  for (const cartId of cartIds) {
    const n = randInt(1, 5);
    const used = new Set<number>();
    for (let k = 0; k < n; k++) {
      const pid = pick(seededProductIds);
      if (used.has(pid)) continue;
      used.add(pid);
      cartItemRows.push({ cartId, productId: pid, quantity: randInt(1, 3) });
    }
  }
  await bulkInsert('cart_items', cartItemRows, 3000, (c) =>
    prisma.cartItem.createMany({ data: c, skipDuplicates: true }),
  );

  // ---- 10. coupons + banners ----
  console.log('⑩ Coupons & banners');
  await prisma.coupon.createMany({
    data: Array.from({ length: 10 }, (_, i) => ({
      code: `PERF-${runId}-${i}`,
      type: chance(0.5) ? 'PERCENT' : 'FIXED',
      value: chance(0.5) ? randInt(5, 30) : randInt(5, 50),
      minSubtotal: pick([0, 25, 50, 100]),
      active: true,
      maxUses: pick([null, 100, 500]),
    })),
    skipDuplicates: true,
  });
  await prisma.banner.createMany({
    data: Array.from({ length: 5 }, (_, i) => ({
      title: `Perf Banner ${runId}-${i}`,
      subtitle: 'Performance test banner',
      image: pick(IMAGES),
      ctaText: 'Shop now',
      ctaLink: '/products',
      active: true,
      position: i,
    })),
    skipDuplicates: true,
  });

  // ---- summary ----
  const [cat, prod, usr, ord, rev, oi, wl, ci] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.count(),
    prisma.review.count(),
    prisma.orderItem.count(),
    prisma.wishlistItem.count(),
    prisma.cartItem.count(),
  ]);
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n✅ Done in ${secs}s. Totals now in DB:`);
  console.table({ categories: cat, products: prod, users: usr, orders: ord, reviews: rev, orderItems: oi, wishlist: wl, cartItems: ci });
  console.log(`\nTo remove ONLY this perf data later:  npm run clean:perf\n`);
}

main()
  .catch((e) => {
    console.error('\n❌ Perf seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
