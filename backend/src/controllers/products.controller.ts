import type { Request, Response } from 'express';
import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { serializeProduct } from '../serializers/product.js';

const includeRelations = {
  category: true,
  tags: { include: { tag: true } },
  images: { orderBy: { position: 'asc' } },
} satisfies Prisma.ProductInclude;

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(500).default(12),
  category: z.string().optional(), // category slug
  q: z.string().optional(), // search term
  tag: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.coerce.boolean().optional(),
  sort: z
    .enum(['featured', 'price_asc', 'price_desc', 'rating', 'newest', 'name'])
    .default('featured'),
});

const orderByMap: Record<string, Prisma.ProductOrderByWithRelationInput> = {
  featured: { reviewCount: 'desc' },
  price_asc: { price: 'asc' },
  price_desc: { price: 'desc' },
  rating: { ratingAvg: 'desc' },
  newest: { createdAt: 'desc' },
  name: { name: 'asc' },
};

/** GET /api/products */
export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new HttpError(400, 'Invalid query parameters', parsed.error.flatten().fieldErrors);
  }
  const { page, limit, category, q, tag, featured, minPrice, maxPrice, inStock, sort } = parsed.data;

  const where: Prisma.ProductWhereInput = { isActive: true };
  if (category) where.category = { slug: category };
  if (inStock) where.inStock = true;
  if (featured) where.featured = true;
  if (tag) where.tags = { some: { tag: { name: tag } } };
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: includeRelations,
      orderBy: orderByMap[sort],
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  res.json({
    data: items.map(serializeProduct),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
});

const SOLD_STATUSES = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as const;

/** GET /api/products/bestsellers?limit=8 — most-sold products, backfilled with popular ones. */
export const getBestsellers = asyncHandler(async (req: Request, res: Response) => {
  const limit = Math.min(12, Math.max(1, Number(req.query.limit) || 8));

  // Rank by total quantity sold across non-cancelled orders.
  const grouped = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: { order: { status: { in: [...SOLD_STATUSES] } } },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: limit,
  });

  type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof includeRelations }>;
  const rankedIds = grouped.map((g) => g.productId);
  let products: ProductWithRelations[] = [];
  if (rankedIds.length) {
    const found = await prisma.product.findMany({
      where: { id: { in: rankedIds }, isActive: true },
      include: includeRelations,
    });
    const byId = new Map(found.map((p) => [p.id, p]));
    products = rankedIds.map((id) => byId.get(id)).filter(Boolean) as ProductWithRelations[];
  }

  // Backfill with popular active products if we don't have enough sales yet.
  if (products.length < limit) {
    const have = new Set(products.map((p) => p.id));
    const extra = await prisma.product.findMany({
      where: { isActive: true, id: { notIn: [...have] } },
      include: includeRelations,
      orderBy: [{ reviewCount: 'desc' }, { ratingAvg: 'desc' }],
      take: limit - products.length,
    });
    products = [...products, ...extra];
  }

  res.json({ data: products.map(serializeProduct) });
});

/** GET /api/products/:slug */
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: includeRelations,
  });
  if (!product) throw new HttpError(404, 'Product not found');
  res.json({ data: serializeProduct(product) });
});

/** GET /api/products/:slug/related */
export const getRelatedProducts = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = await prisma.product.findFirst({ where: { slug }, select: { id: true, categoryId: true } });
  if (!product) throw new HttpError(404, 'Product not found');

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
    include: includeRelations,
    take: 4,
    orderBy: { reviewCount: 'desc' },
  });
  res.json({ data: related.map(serializeProduct) });
});
