import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';

/** GET /api/categories */
export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  res.json({
    data: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image,
      description: c.description,
      gradient: c.gradient,
      // Prefer the live product count, fall back to the seeded display count.
      count: c._count.products || c.count,
    })),
  });
});

/** GET /api/categories/:slug */
export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await prisma.category.findUnique({
    where: { slug: req.params.slug },
    include: { _count: { select: { products: true } } },
  });
  if (!category) throw new HttpError(404, 'Category not found');

  res.json({
    data: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
      description: category.description,
      gradient: category.gradient,
      count: category._count.products || category.count,
    },
  });
});
