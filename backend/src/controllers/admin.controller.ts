import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { slugify } from '../utils/slug.js';
import { notifyOrderStatus } from '../lib/notify.js';

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
