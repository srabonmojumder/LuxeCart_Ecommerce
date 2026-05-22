import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { serializeProduct } from '../serializers/product.js';

const productInclude = { category: true, tags: { include: { tag: true } } } as const;

async function getOrCreateCart(userId: number) {
  const existing = await prisma.cart.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.cart.create({ data: { userId } });
}

async function serializeCart(cartId: number) {
  const items = await prisma.cartItem.findMany({
    where: { cartId },
    include: { product: { include: productInclude } },
    orderBy: { id: 'asc' },
  });

  const data = items.map((item) => {
    const product = serializeProduct(item.product);
    return { ...product, quantity: item.quantity };
  });

  const totalItems = data.reduce((n, i) => n + i.quantity, 0);
  const totalPrice = data.reduce((sum, i) => {
    const unit = i.discount ? i.price * (1 - i.discount / 100) : i.price;
    return sum + unit * i.quantity;
  }, 0);

  return { items: data, totalItems, totalPrice: Number(totalPrice.toFixed(2)) };
}

/** GET /api/cart */
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await getOrCreateCart(req.user!.sub);
  res.json(await serializeCart(cart.id));
});

const addSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).default(1),
});

/** POST /api/cart — add (increments if already present) */
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const parsed = addSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const { productId, quantity } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new HttpError(404, 'Product not found');

  const cart = await getOrCreateCart(req.user!.sub);
  const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId, variantId: null } });
  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
  }

  res.status(201).json(await serializeCart(cart.id));
});

const updateSchema = z.object({ quantity: z.number().int().min(0) });

/** PATCH /api/cart/:productId — set absolute quantity (0 removes) */
export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const productId = Number(req.params.productId);
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);

  const cart = await getOrCreateCart(req.user!.sub);
  const item = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
  if (!item) throw new HttpError(404, 'Item not in cart');

  if (parsed.data.quantity === 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
  } else {
    await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: parsed.data.quantity } });
  }
  res.json(await serializeCart(cart.id));
});

/** DELETE /api/cart/:productId */
export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const productId = Number(req.params.productId);
  const cart = await getOrCreateCart(req.user!.sub);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
  res.json(await serializeCart(cart.id));
});

/** DELETE /api/cart */
export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await getOrCreateCart(req.user!.sub);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  res.json(await serializeCart(cart.id));
});

const mergeSchema = z.object({
  items: z.array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1) })),
});

/** POST /api/cart/merge — merge a guest (localStorage) cart on login */
export const mergeCart = asyncHandler(async (req: Request, res: Response) => {
  const parsed = mergeSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);

  const cart = await getOrCreateCart(req.user!.sub);
  const validIds = new Set(
    (await prisma.product.findMany({ where: { id: { in: parsed.data.items.map((i) => i.productId) } }, select: { id: true } })).map((p) => p.id)
  );

  for (const incoming of parsed.data.items) {
    if (!validIds.has(incoming.productId)) continue;
    const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId: incoming.productId, variantId: null } });
    if (existing) {
      await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + incoming.quantity } });
    } else {
      await prisma.cartItem.create({ data: { cartId: cart.id, productId: incoming.productId, quantity: incoming.quantity } });
    }
  }

  res.json(await serializeCart(cart.id));
});
