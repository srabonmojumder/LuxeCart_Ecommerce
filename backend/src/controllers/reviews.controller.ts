import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';

async function findProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
  if (!product) throw new HttpError(404, 'Product not found');
  return product;
}

/** Recompute and persist the denormalized rating aggregates for a product. */
async function recomputeAggregates(productId: number) {
  const agg = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true,
  });
  await prisma.product.update({
    where: { id: productId },
    data: {
      ratingAvg: Number((agg._avg.rating ?? 0).toFixed(2)),
      reviewCount: agg._count,
    },
  });
}

/** GET /api/products/:slug/reviews */
export const listReviews = asyncHandler(async (req: Request, res: Response) => {
  const product = await findProductBySlug(req.params.slug);
  const reviews = await prisma.review.findMany({
    where: { productId: product.id },
    include: { user: { select: { displayName: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({
    data: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      author: r.user.displayName ?? 'Anonymous',
      createdAt: r.createdAt,
    })),
  });
});

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

/** POST /api/products/:slug/reviews — one review per user (upsert). */
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const product = await findProductBySlug(req.params.slug);

  await prisma.review.upsert({
    where: { productId_userId: { productId: product.id, userId: req.user!.sub } },
    create: { productId: product.id, userId: req.user!.sub, ...parsed.data },
    update: parsed.data,
  });
  await recomputeAggregates(product.id);

  res.status(201).json({ success: true });
});
