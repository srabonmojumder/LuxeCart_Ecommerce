import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { slugify } from '../utils/slug.js';
import { notifyOrderStatus, notifyReturnStatus } from '../lib/notify.js';
import { runMaintenance } from '../lib/maintenance.js';

/** Generate a slug unique across products (optionally ignoring one id on update). */
async function uniqueProductSlug(name: string, ignoreId?: number): Promise<string> {
  const base = slugify(name);
  let candidate = base;
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const clash = await prisma.product.findFirst({ where: { slug: candidate, NOT: ignoreId ? { id: ignoreId } : undefined } });
    if (!clash) return candidate;
    candidate = `${base}-${i++}`;
  }
}

async function setProductTags(productId: number, tagNames: string[]) {
  await prisma.productTag.deleteMany({ where: { productId } });
  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({ where: { name }, create: { name }, update: {} });
    await prisma.productTag.create({ data: { productId, tagId: tag.id } });
  }
}

// ---------------- Products ----------------

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  discount: z.number().int().min(0).max(100).default(0),
  image: z.string().min(1),
  stock: z.number().int().min(0).default(0),
  inStock: z.boolean().default(true),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
  categoryId: z.number().int().positive(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

/** GET /api/admin/products — includes inactive */
export const adminListProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    include: { category: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ data: products });
});

/** POST /api/admin/products */
export const adminCreateProduct = asyncHandler(async (req: Request, res: Response) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const { tags, colors, sizes, ...data } = parsed.data;

  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) throw new HttpError(400, 'Category does not exist');

  const product = await prisma.product.create({
    data: {
      ...data,
      slug: await uniqueProductSlug(data.name),
      colors: colors ?? undefined,
      sizes: sizes ?? undefined,
      images: { create: [{ url: data.image, alt: data.name, position: 0 }] },
    },
  });
  if (tags?.length) await setProductTags(product.id, tags);

  res.status(201).json({ data: product });
});

/** PATCH /api/admin/products/:id */
export const adminUpdateProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = productSchema.partial().safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'Product not found');
  const { tags, colors, sizes, name, ...rest } = parsed.data;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...rest,
      ...(name ? { name, slug: await uniqueProductSlug(name, id) } : {}),
      ...(colors !== undefined ? { colors } : {}),
      ...(sizes !== undefined ? { sizes } : {}),
    },
  });
  if (tags) await setProductTags(id, tags);

  res.json({ data: product });
});

/** DELETE /api/admin/products/:id — soft delete (kept for order history). */
export const adminDeleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'Product not found');
  await prisma.product.update({ where: { id }, data: { isActive: false } });
  res.json({ success: true });
});

const bulkSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1),
  action: z.enum(['activate', 'deactivate', 'feature', 'unfeature', 'delete']),
});

/** POST /api/admin/products/bulk — apply one action to many products at once. */
export const adminBulkProducts = asyncHandler(async (req: Request, res: Response) => {
  const parsed = bulkSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const { ids, action } = parsed.data;

  const dataByAction: Record<typeof action, { isActive?: boolean; featured?: boolean }> = {
    activate: { isActive: true },
    deactivate: { isActive: false },
    feature: { featured: true },
    unfeature: { featured: false },
    delete: { isActive: false }, // soft delete to preserve order history
  };

  const result = await prisma.product.updateMany({ where: { id: { in: ids } }, data: dataByAction[action] });
  res.json({ success: true, count: result.count });
});

// ---------------- Categories ----------------

const categorySchema = z.object({
  name: z.string().min(1),
  image: z.string().optional(),
  description: z.string().optional(),
  gradient: z.string().optional(),
});

/** POST /api/admin/categories */
export const adminCreateCategory = asyncHandler(async (req: Request, res: Response) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const category = await prisma.category.create({
    data: { ...parsed.data, slug: slugify(parsed.data.name) },
  });
  res.status(201).json({ data: category });
});

/** PATCH /api/admin/categories/:id */
export const adminUpdateCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = categorySchema.partial().safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'Category not found');
  const category = await prisma.category.update({
    where: { id },
    data: { ...parsed.data, ...(parsed.data.name ? { slug: slugify(parsed.data.name) } : {}) },
  });
  res.json({ data: category });
});

/** DELETE /api/admin/categories/:id */
export const adminDeleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) throw new HttpError(409, 'Cannot delete a category that still has products');
  await prisma.category.delete({ where: { id } });
  res.json({ success: true });
});

// ---------------- Orders ----------------

/** GET /api/admin/orders */
export const adminListOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: { user: { select: { email: true, displayName: true } }, payment: true, items: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ data: orders });
});

const statusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
  note: z.string().max(500).optional(),
  trackingNumber: z.string().max(120).optional(),
  carrier: z.string().max(120).optional(),
});

/** PATCH /api/admin/orders/:id/status — updates status + tracking and logs a timeline event. */
export const adminUpdateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'Order not found');

  const { status, note, trackingNumber, carrier } = parsed.data;
  const order = await prisma.order.update({
    where: { id },
    data: {
      status,
      ...(trackingNumber !== undefined ? { trackingNumber } : {}),
      ...(carrier !== undefined ? { carrier } : {}),
      events: {
        create: {
          status,
          note: note || (trackingNumber ? `Tracking: ${trackingNumber}` : null),
        },
      },
    },
    include: { user: { select: { email: true, displayName: true } } },
  });

  // Notify the customer about the status change (email + SMS), fire-and-forget.
  const sa = order.shippingAddress as Record<string, string> | null;
  const to = order.email ?? order.user?.email;
  if (to) {
    void notifyOrderStatus({
      to,
      phone: sa?.phone ?? null,
      name: order.user?.displayName ?? null,
      orderId: order.id,
      status: order.status,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      note,
    });
  }

  res.json({ data: order });
});

// ---------------- Dashboard stats ----------------

const REVENUE_STATUSES = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as const;

/** GET /api/admin/stats — headline metrics for the dashboard. */
export const adminStats = asyncHandler(async (_req: Request, res: Response) => {
  const [products, activeProducts, categories, users, orders, pendingOrders, revenueAgg, recentOrders, lowStock] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { in: [...REVENUE_STATUSES] } } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, displayName: true } } },
      }),
      prisma.product.findMany({
        where: { isActive: true, stock: { lt: 10 } },
        select: { id: true, name: true, slug: true, stock: true },
        orderBy: { stock: 'asc' },
        take: 6,
      }),
    ]);

  res.json({
    data: {
      products,
      activeProducts,
      categories,
      users,
      orders,
      pendingOrders,
      revenue: Number(revenueAgg._sum.total ?? 0),
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        total: Number(o.total),
        status: o.status,
        createdAt: o.createdAt,
        customer: o.user?.email ?? '—',
      })),
      lowStock,
    },
  });
});

/** GET /api/admin/analytics?days=30 — time-series revenue/orders + top products + status mix. */
export const adminAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const days = Math.min(365, Math.max(7, Number(req.query.days) || 30));
  const now = new Date();
  // UTC midnight, (days-1) days ago, so the window includes today.
  const since = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (days - 1)));

  const [orders, statusGroups] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: since }, status: { in: [...REVENUE_STATUSES] } },
      select: {
        createdAt: true,
        total: true,
        items: { select: { productId: true, name: true, price: true, quantity: true } },
      },
    }),
    prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);

  // Build one bucket per day (UTC) so the chart has no gaps.
  const buckets = new Map<string, { date: string; revenue: number; orders: number }>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setUTCDate(since.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, { date: key, revenue: 0, orders: 0 });
  }

  const productTotals = new Map<number, { name: string; qty: number; revenue: number }>();
  let totalRevenue = 0;
  for (const o of orders) {
    const key = o.createdAt.toISOString().slice(0, 10);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.revenue += Number(o.total);
      bucket.orders += 1;
    }
    totalRevenue += Number(o.total);
    for (const it of o.items) {
      const e = productTotals.get(it.productId) ?? { name: it.name, qty: 0, revenue: 0 };
      e.qty += it.quantity;
      e.revenue += Number(it.price) * it.quantity;
      productTotals.set(it.productId, e);
    }
  }

  const topProducts = [...productTotals.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8);

  res.json({
    data: {
      days,
      series: [...buckets.values()],
      topProducts,
      totalRevenue,
      totalOrders: orders.length,
      avgOrderValue: orders.length ? totalRevenue / orders.length : 0,
      statusBreakdown: statusGroups.map((g) => ({ status: g.status, count: g._count._all })),
    },
  });
});

/**
 * GET /api/admin/dashboard — single payload powering the redesigned dashboard.
 * Every figure is computed from live DB data (no static placeholders):
 *  - stat tiles, sales-goal gauge, revenue-by-month chart, growth %, customer count,
 *    orders-by-hour heatmap, review-rating distribution, and a recent-orders table.
 */
export const adminDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const now = new Date();
  const Y = now.getUTCFullYear();
  const Mo = now.getUTCMonth();
  const startOfThisMonth = new Date(Date.UTC(Y, Mo, 1));
  const startOfPrevMonth = new Date(Date.UTC(Y, Mo - 1, 1));
  const since12 = new Date(Date.UTC(Y, Mo - 11, 1));
  const since30 = new Date(now.getTime() - 30 * 864e5);
  const since60 = new Date(now.getTime() - 60 * 864e5);

  const [
    availableProducts, pendingOrders, totalOrders, totalCustomers,
    revenueAgg, reviewAgg,
    monthlyRaw, heatRaw, ratingRaw,
    newThisMonth, newPrevMonth, last30Agg, prev30Agg, recent,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { in: [...REVENUE_STATUSES] } } }),
    prisma.review.aggregate({ _avg: { rating: true }, _count: true }),
    prisma.$queryRaw<{ ym: string; rev: string | null; cnt: bigint }[]>`
      SELECT DATE_FORMAT(createdAt, '%Y-%m') AS ym, SUM(total) AS rev, COUNT(*) AS cnt
      FROM \`Order\`
      WHERE status IN ('PAID','PROCESSING','SHIPPED','DELIVERED') AND createdAt >= ${since12}
      GROUP BY ym ORDER BY ym`,
    prisma.$queryRaw<{ wd: number; hr: number; c: bigint }[]>`
      SELECT (DAYOFWEEK(createdAt) - 1) AS wd, HOUR(createdAt) AS hr, COUNT(*) AS c
      FROM \`Order\` GROUP BY wd, hr`,
    prisma.$queryRaw<{ rating: number; c: bigint }[]>`
      SELECT rating, COUNT(*) AS c FROM \`Review\` GROUP BY rating`,
    prisma.user.count({ where: { createdAt: { gte: startOfThisMonth } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfPrevMonth, lt: startOfThisMonth } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { in: [...REVENUE_STATUSES] }, createdAt: { gte: since30 } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { in: [...REVENUE_STATUSES] }, createdAt: { gte: since60, lt: since30 } } }),
    prisma.order.findMany({
      take: 6, orderBy: { createdAt: 'desc' },
      select: {
        id: true, total: true, status: true, createdAt: true, email: true, shippingAddress: true,
        user: { select: { displayName: true, email: true } },
      },
    }),
  ]);

  // --- monthly revenue (last 7 months, gap-filled) ---
  const monthMap = new Map<string, number>();
  for (const r of monthlyRaw) monthMap.set(r.ym, Number(r.rev ?? 0));
  const monthly: { ym: string; month: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.UTC(Y, Mo - i, 1));
    const ym = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    monthly.push({ ym, month: d.toLocaleDateString('en-US', { month: 'short' }), revenue: monthMap.get(ym) ?? 0 });
  }
  // Sales goal = your best calendar month in the trailing year; the gauge shows
  // how close the last 30 days are to beating that record.
  const last30Revenue = Number(last30Agg._sum.total ?? 0);
  const prev30Revenue = Number(prev30Agg._sum.total ?? 0);
  const bestMonthRevenue = Math.max(0, ...[...monthMap.values()], 0);
  const salesGoal = bestMonthRevenue || last30Revenue || 1;
  const salesGoalPct = Math.min(100, Math.round((last30Revenue / salesGoal) * 100));
  const growthRatePct = prev30Revenue > 0
    ? Math.round(((last30Revenue - prev30Revenue) / prev30Revenue) * 100)
    : (last30Revenue > 0 ? 100 : 0);
  const customerVolumeChangePct = newPrevMonth > 0
    ? Math.round(((newThisMonth - newPrevMonth) / newPrevMonth) * 100)
    : (newThisMonth > 0 ? 100 : 0);

  // --- orders-by-hour heatmap ---
  const heatmap = heatRaw.map((h) => ({ day: Number(h.wd), hour: Number(h.hr), count: Number(h.c) }));
  const heatmapMax = heatmap.reduce((m, c) => Math.max(m, c.count), 0);

  // --- review rating distribution ---
  const ratingMap = new Map<number, number>();
  for (const r of ratingRaw) ratingMap.set(Number(r.rating), Number(r.c));
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: ratingMap.get(stars) ?? 0 }));

  // --- recent orders / shipping list ---
  const recentOrders = recent.map((o) => {
    const addr = (o.shippingAddress ?? {}) as Record<string, unknown>;
    return {
      id: o.id,
      customer: o.user?.displayName || o.user?.email || o.email || 'Guest',
      country: typeof addr.country === 'string' ? addr.country : '—',
      total: Number(o.total),
      status: o.status,
      createdAt: o.createdAt,
    };
  });

  res.json({
    data: {
      availableProducts,
      pendingOrders,
      numberOfSales: totalOrders,
      totalSales: Number(revenueAgg._sum.total ?? 0),
      salesGoal,
      salesGoalPct,
      growthRatePct,
      customerVolumeChangePct,
      totalCustomers,
      monthly,
      heatmap,
      heatmapMax,
      reviews: { avg: reviewAgg._avg.rating ?? 0, total: reviewAgg._count, distribution },
      recentOrders,
    },
  });
});

/** POST /api/admin/maintenance/run — manually trigger abandoned-cart + low-stock jobs. */
export const adminRunMaintenance = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await runMaintenance();
  res.json({ data: summary });
});

// ---------------- Users ----------------

/** GET /api/admin/users */
export const adminListUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });
  res.json({ data: users });
});

const roleSchema = z.object({ role: z.enum(['CUSTOMER', 'ADMIN']) });

/** PATCH /api/admin/users/:id/role */
export const adminUpdateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = roleSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  if (id === req.user!.sub) throw new HttpError(400, 'You cannot change your own role');

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'User not found');
  const user = await prisma.user.update({
    where: { id },
    data: { role: parsed.data.role },
    select: { id: true, email: true, displayName: true, role: true },
  });
  res.json({ data: user });
});

/** DELETE /api/admin/users/:id */
export const adminDeleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (id === req.user!.sub) throw new HttpError(400, 'You cannot delete your own account');
  const existing = await prisma.user.findUnique({ where: { id }, include: { _count: { select: { orders: true } } } });
  if (!existing) throw new HttpError(404, 'User not found');
  if (existing._count.orders > 0) throw new HttpError(409, 'Cannot delete a user with existing orders');
  await prisma.user.delete({ where: { id } });
  res.json({ success: true });
});

// ---------------- Reviews moderation ----------------

/** GET /api/admin/reviews */
export const adminListReviews = asyncHandler(async (_req: Request, res: Response) => {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      product: { select: { name: true, slug: true } },
      user: { select: { email: true, displayName: true } },
    },
  });
  res.json({
    data: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      product: r.product?.name ?? '—',
      productSlug: r.product?.slug ?? null,
      author: r.user?.displayName ?? r.user?.email ?? 'Anonymous',
    })),
  });
});

/** DELETE /api/admin/reviews/:id — removes a review and recomputes the product rating. */
export const adminDeleteReview = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new HttpError(404, 'Review not found');

  await prisma.review.delete({ where: { id } });

  const agg = await prisma.review.aggregate({
    where: { productId: review.productId },
    _avg: { rating: true },
    _count: true,
  });
  await prisma.product.update({
    where: { id: review.productId },
    data: { ratingAvg: Number((agg._avg.rating ?? 0).toFixed(2)), reviewCount: agg._count },
  });

  res.json({ success: true });
});

// ---------------- Returns / refunds ----------------

/** GET /api/admin/returns — all customer return requests. */
export const adminListReturns = asyncHandler(async (_req: Request, res: Response) => {
  const returns = await prisma.returnRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      order: { select: { id: true, total: true, status: true, email: true } },
      user: { select: { email: true, displayName: true } },
    },
  });
  res.json({
    data: returns.map((r) => ({
      id: r.id,
      status: r.status,
      reason: r.reason,
      adminNote: r.adminNote,
      createdAt: r.createdAt,
      orderId: r.orderId,
      orderTotal: Number(r.order?.total ?? 0),
      orderStatus: r.order?.status ?? null,
      customer: r.user?.email ?? r.order?.email ?? '—',
    })),
  });
});

const returnStatusSchema = z.object({
  status: z.enum(['REQUESTED', 'APPROVED', 'REJECTED', 'RECEIVED', 'REFUNDED']),
  adminNote: z.string().max(1000).optional(),
});

/** PATCH /api/admin/returns/:id — move a return through its workflow. */
export const adminUpdateReturn = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = returnStatusSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);

  const existing = await prisma.returnRequest.findUnique({ where: { id }, include: { order: true } });
  if (!existing) throw new HttpError(404, 'Return request not found');

  const { status, adminNote } = parsed.data;
  const updated = await prisma.returnRequest.update({
    where: { id },
    data: { status, ...(adminNote !== undefined ? { adminNote } : {}) },
  });

  // Once refunded, flag the order and restore the items to inventory.
  if (status === 'REFUNDED' && existing.order.status !== 'REFUNDED') {
    const items = await prisma.orderItem.findMany({ where: { orderId: existing.orderId } });
    await prisma.$transaction([
      prisma.order.update({
        where: { id: existing.orderId },
        data: {
          status: 'REFUNDED',
          events: { create: { status: 'REFUNDED', note: 'Refund processed for return' } },
        },
      }),
      ...items.map((it) =>
        prisma.product.update({
          where: { id: it.productId },
          data: { stock: { increment: it.quantity }, inStock: true },
        })
      ),
    ]);
  }

  // Notify the customer of the new return status.
  const to = existing.order.email;
  if (to) void notifyReturnStatus({ to, orderId: existing.orderId, status, note: adminNote });

  res.json({ data: updated });
});
