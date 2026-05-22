import type { Request, Response } from 'express';
import type { Product } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { isStripeConfigured } from '../lib/stripe.js';
import { notifyOrderPlaced } from '../lib/notify.js';
import { getSettings } from '../lib/settings.js';
import { evaluateCoupon } from '../lib/coupon.js';

const addressShape = z.object({
  fullName: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().optional(),
});

const createSchema = z.object({
  addressId: z.number().int().positive().optional(),
  shippingAddress: addressShape.optional(),
  email: z.string().email().optional(), // required for guest checkout
  couponCode: z.string().optional(),
  items: z
    .array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1) }))
    .optional(), // guest cart (logged-in users use their server cart)
});

const orderInclude = {
  items: { include: { product: true } },
  payment: true,
  events: { orderBy: { createdAt: 'asc' } },
} as const;

function serializeOrder(order: any) {
  return {
    id: order.id,
    status: order.status,
    subtotal: Number(order.subtotal),
    discount: Number(order.discount ?? 0),
    couponCode: order.couponCode ?? null,
    shipping: Number(order.shipping),
    tax: Number(order.tax),
    total: Number(order.total),
    shippingAddress: order.shippingAddress,
    trackingNumber: order.trackingNumber ?? null,
    carrier: order.carrier ?? null,
    createdAt: order.createdAt,
    payment: order.payment
      ? { status: order.payment.status, provider: order.payment.provider }
      : null,
    events: (order.events ?? []).map((e: any) => ({
      status: e.status,
      note: e.note,
      createdAt: e.createdAt,
    })),
    items: (order.items ?? []).map((it: any) => ({
      productId: it.productId,
      name: it.name,
      price: Number(it.price),
      quantity: it.quantity,
      image: it.product?.image ?? null,
      slug: it.product?.slug ?? null,
    })),
  };
}

/** POST /api/orders — create an order from the user's cart. */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const userId = req.user?.sub ?? null;
  const email = req.user?.email ?? parsed.data.email;
  if (!email) throw new HttpError(400, 'An email is required to place an order');

  // Resolve shipping address (saved address only applies to logged-in users).
  let shippingAddress: Record<string, unknown> | null = null;
  if (parsed.data.addressId && userId) {
    const addr = await prisma.address.findFirst({ where: { id: parsed.data.addressId, userId } });
    if (!addr) throw new HttpError(404, 'Address not found');
    shippingAddress = addr as unknown as Record<string, unknown>;
  } else if (parsed.data.shippingAddress) {
    shippingAddress = parsed.data.shippingAddress;
  } else {
    throw new HttpError(400, 'A shipping address is required');
  }

  // Build line items: logged-in users use their server cart; guests send items in the body.
  let lineItems: { product: Product; quantity: number }[] = [];
  let serverCartId: number | null = null;

  if (userId) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0) throw new HttpError(400, 'Your cart is empty');
    serverCartId = cart.id;
    lineItems = cart.items.map((i) => ({ product: i.product, quantity: i.quantity }));
  } else {
    const items = parsed.data.items;
    if (!items || items.length === 0) throw new HttpError(400, 'Your cart is empty');
    const products = await prisma.product.findMany({ where: { id: { in: items.map((i) => i.productId) } } });
    const byId = new Map(products.map((p) => [p.id, p]));
    for (const it of items) {
      const product = byId.get(it.productId);
      if (!product) throw new HttpError(404, `Product ${it.productId} not found`);
      lineItems.push({ product, quantity: it.quantity });
    }
  }

  // Validate stock.
  for (const li of lineItems) {
    if (li.product.stock < li.quantity) {
      throw new HttpError(409, `Insufficient stock for "${li.product.name}"`, {
        productId: li.product.id,
        available: li.product.stock,
      });
    }
  }

  // Compute totals (respecting per-product discount).
  const subtotal = lineItems.reduce((sum, li) => {
    const base = Number(li.product.price);
    const unit = li.product.discount ? base * (1 - li.product.discount / 100) : base;
    return sum + unit * li.quantity;
  }, 0);

  // Store-wide shipping/tax config (admin-managed).
  const settings = await getSettings();
  const freeShippingThreshold = Number(settings.freeShippingThreshold);
  const shippingFlat = Number(settings.shippingFlat);
  const taxRate = settings.taxRate;

  // Coupon (validated server-side; never trust a client-sent discount).
  let discount = 0;
  let appliedCoupon: { id: number; code: string } | null = null;
  if (parsed.data.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: parsed.data.couponCode.trim().toUpperCase() },
    });
    const result = evaluateCoupon(coupon, subtotal);
    if (!result.valid) throw new HttpError(400, result.message);
    discount = result.discount;
    appliedCoupon = { id: coupon!.id, code: coupon!.code };
  }

  const taxable = Math.max(0, subtotal - discount);
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingFlat;
  const tax = +(taxable * taxRate).toFixed(2);
  const total = +(taxable + shipping + tax).toFixed(2);

  // Without Stripe keys we simulate a successful payment so the flow completes.
  const mockPaid = !isStripeConfigured;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        email,
        status: mockPaid ? 'PAID' : 'PENDING',
        subtotal,
        discount,
        couponCode: appliedCoupon?.code ?? null,
        shipping,
        tax,
        total,
        shippingAddress: shippingAddress as object,
        items: {
          create: lineItems.map((li) => {
            const base = Number(li.product.price);
            const unit = li.product.discount ? base * (1 - li.product.discount / 100) : base;
            return {
              productId: li.product.id,
              name: li.product.name,
              price: +unit.toFixed(2),
              quantity: li.quantity,
            };
          }),
        },
        payment: {
          create: {
            provider: mockPaid ? 'mock' : 'stripe',
            status: mockPaid ? 'succeeded' : 'pending',
            amount: total,
          },
        },
        events: {
          create: [
            { status: 'PENDING', note: 'Order placed' },
            ...(mockPaid ? [{ status: 'PAID' as const, note: 'Payment confirmed' }] : []),
          ],
        },
      },
      include: orderInclude,
    });

    // Decrement stock.
    for (const li of lineItems) {
      await tx.product.update({
        where: { id: li.product.id },
        data: {
          stock: { decrement: li.quantity },
          inStock: li.product.stock - li.quantity > 0,
        },
      });
    }

    // Count coupon usage.
    if (appliedCoupon) {
      await tx.coupon.update({ where: { id: appliedCoupon.id }, data: { usedCount: { increment: 1 } } });
    }

    // Empty the server cart (logged-in users only).
    if (serverCartId) await tx.cartItem.deleteMany({ where: { cartId: serverCartId } });
    return created;
  });

  // Notify the customer (email + SMS); fire-and-forget so it never blocks checkout.
  const sa = order.shippingAddress as Record<string, string> | null;
  void notifyOrderPlaced({
    to: email,
    phone: sa?.phone ?? null,
    name: sa?.fullName ?? null,
    orderId: order.id,
    total: Number(order.total),
    items: order.items.map((it) => ({ name: it.name, quantity: it.quantity })),
  });

  res.status(201).json({ data: serializeOrder(order) });
});

/** GET /api/orders — list the current user's orders. */
export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.sub },
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  });
  res.json({ data: orders.map(serializeOrder) });
});

/** GET /api/orders/:id */
export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const order = await prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });
  if (!order || (order.userId !== req.user!.sub && req.user!.role !== 'ADMIN')) {
    throw new HttpError(404, 'Order not found');
  }
  res.json({ data: serializeOrder(order) });
});

const trackSchema = z.object({
  id: z.coerce.number().int().positive(),
  email: z.string().email(),
});

/** GET /api/orders/track?id=&email= — public guest order lookup (no auth). */
export const trackOrder = asyncHandler(async (req: Request, res: Response) => {
  const parsed = trackSchema.safeParse(req.query);
  if (!parsed.success) throw new HttpError(400, 'A valid order number and email are required');

  const order = await prisma.order.findUnique({ where: { id: parsed.data.id }, include: orderInclude });
  const emailLc = parsed.data.email.trim().toLowerCase();
  const orderEmail = (order?.email ?? '').toLowerCase();
  let userEmail = '';
  if (order?.userId) {
    const u = await prisma.user.findUnique({ where: { id: order.userId }, select: { email: true } });
    userEmail = (u?.email ?? '').toLowerCase();
  }

  if (!order || (orderEmail !== emailLc && userEmail !== emailLc)) {
    throw new HttpError(404, 'No order found with that number and email');
  }
  res.json({ data: serializeOrder(order) });
});
