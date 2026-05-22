import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { serializeProduct } from '../serializers/product.js';

const productInclude = { category: true, tags: { include: { tag: true } } } as const;

async function serializeWishlist(userId: number) {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    include: { product: { include: productInclude } },
    orderBy: { id: 'desc' },
  });
  return { items: items.map((i) => serializeProduct(i.product)) };
}

/** GET /api/wishlist */
export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  res.json(await serializeWishlist(req.user!.sub));
});

const addSchema = z.object({ productId: z.number().int().positive() });

/** POST /api/wishlist */
export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const parsed = addSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const { productId } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new HttpError(404, 'Product not found');

  await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: req.user!.sub, productId } },
    create: { userId: req.user!.sub, productId },
    update: {},
  });
  res.status(201).json(await serializeWishlist(req.user!.sub));
});

/** DELETE /api/wishlist/:productId */
export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const productId = Number(req.params.productId);
  await prisma.wishlistItem.deleteMany({ where: { userId: req.user!.sub, productId } });
  res.json(await serializeWishlist(req.user!.sub));
});
