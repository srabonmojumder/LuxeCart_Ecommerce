import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../middleware/error.js';

/** GET /api/stats — public storefront stats for the homepage counters. */
export const getPublicStats = asyncHandler(async (_req: Request, res: Response) => {
  const [products, customers, orders, ratingAgg] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.count(),
    prisma.review.aggregate({ _avg: { rating: true }, _count: true }),
  ]);

  res.json({
    data: {
      products,
      customers,
      orders,
      avgRating: Number((ratingAgg._avg.rating ?? 5).toFixed(1)),
      reviewCount: ratingAgg._count,
    },
  });
});

/** GET /api/testimonials?limit=8 — recent positive reviews across products. */
export const getTestimonials = asyncHandler(async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 8, 20);
  const reviews = await prisma.review.findMany({
    where: { rating: { gte: 4 }, comment: { not: null } },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: { select: { displayName: true, photoURL: true } },
      product: { select: { name: true, slug: true, image: true } },
    },
  });

  res.json({
    data: reviews
      .filter((r) => (r.comment ?? '').trim().length > 0)
      .map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        author: r.user.displayName ?? 'Verified Buyer',
        avatar: r.user.photoURL ?? null,
        product: r.product.name,
        productSlug: r.product.slug,
        productImage: r.product.image,
        createdAt: r.createdAt,
      })),
  });
});
