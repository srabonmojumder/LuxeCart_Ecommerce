/**
 * Removes ONLY the data created by scripts/seed-perf.ts, in foreign-key-safe
 * order. Real data (anything without the perf markers) is left untouched.
 *
 * Markers:
 *   products / categories -> slug starts with "perf-"
 *   users                 -> email ends with "@loadtest.local"
 *   orders                -> carrier = "PERFSEED"
 *   coupons               -> code starts with "PERF-"
 *   banners               -> title starts with "Perf Banner"
 *
 * Run from backend/:  npm run clean:perf
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PERF_SLUG = { slug: { startsWith: 'perf-' } } as const;
const PERF_USER = { email: { endsWith: '@loadtest.local' } } as const;
const PERF_ORDER = { carrier: 'PERFSEED' } as const;

async function del(label: string, fn: () => Promise<{ count: number }>) {
  const { count } = await fn();
  console.log(`  ${label}: ${count.toLocaleString()} deleted`);
}

async function main() {
  const t0 = Date.now();
  console.log('\n🧹 Cleaning perf-seed data...\n');

  // --- order subtree first (OrderItem.product / Order.user are RESTRICT) ---
  await del('order items', () => prisma.orderItem.deleteMany({ where: { order: PERF_ORDER } }));
  await del('payments', () => prisma.payment.deleteMany({ where: { order: PERF_ORDER } }));
  await del('order events', () => prisma.orderEvent.deleteMany({ where: { order: PERF_ORDER } }));
  await del('return requests', () => prisma.returnRequest.deleteMany({ where: { order: PERF_ORDER } }));
  await del('orders', () => prisma.order.deleteMany({ where: PERF_ORDER }));

  // --- cart + wishlist (CartItem.product is RESTRICT, so clear before products) ---
  await del('cart items', () =>
    prisma.cartItem.deleteMany({ where: { cart: { user: PERF_USER } } }),
  );
  await del('carts', () => prisma.cart.deleteMany({ where: { user: PERF_USER } }));
  await del('wishlist (by user)', () => prisma.wishlistItem.deleteMany({ where: { user: PERF_USER } }));
  await del('wishlist (by product)', () =>
    prisma.wishlistItem.deleteMany({ where: { product: PERF_SLUG } }),
  );

  // --- reviews (cascade on product/user delete, but explicit is safer) ---
  await del('reviews (by product)', () => prisma.review.deleteMany({ where: { product: PERF_SLUG } }));
  await del('reviews (by user)', () => prisma.review.deleteMany({ where: { user: PERF_USER } }));

  // --- product subtree (these cascade, but delete explicitly to be safe) ---
  await del('product tags', () => prisma.productTag.deleteMany({ where: { product: PERF_SLUG } }));
  await del('product images', () => prisma.productImage.deleteMany({ where: { product: PERF_SLUG } }));
  await del('product variants', () => prisma.productVariant.deleteMany({ where: { product: PERF_SLUG } }));
  await del('products', () => prisma.product.deleteMany({ where: PERF_SLUG }));

  // --- users (addresses / tokens / loyalty cascade automatically) ---
  await del('users', () => prisma.user.deleteMany({ where: PERF_USER }));

  // --- catalog config ---
  await del('categories', () => prisma.category.deleteMany({ where: PERF_SLUG }));
  await del('coupons', () => prisma.coupon.deleteMany({ where: { code: { startsWith: 'PERF-' } } }));
  await del('banners', () => prisma.banner.deleteMany({ where: { title: { startsWith: 'Perf Banner' } } }));

  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n✅ Perf data removed in ${secs}s.\n`);
}

main()
  .catch((e) => {
    console.error('\n❌ Clean failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
