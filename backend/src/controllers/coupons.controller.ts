import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { evaluateCoupon } from '../lib/coupon.js';

const validateSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().min(0),
});

/** POST /api/coupons/validate — public; checks a code against a subtotal. */
export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const parsed = validateSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);

  const coupon = await prisma.coupon.findUnique({ where: { code: parsed.data.code.trim().toUpperCase() } });
  const result = evaluateCoupon(coupon, parsed.data.subtotal);
  res.json({
    valid: result.valid,
    discount: result.discount,
    message: result.message,
    code: coupon?.code ?? parsed.data.code.toUpperCase(),
  });
});

// ---------------- Admin CRUD ----------------

const couponSchema = z.object({
  code: z.string().min(1),
  type: z.enum(['PERCENT', 'FIXED']).default('PERCENT'),
  value: z.number().positive(),
  minSubtotal: z.number().min(0).default(0),
  active: z.boolean().default(true),
  expiresAt: z.string().datetime().nullable().optional(),
  maxUses: z.number().int().positive().nullable().optional(),
});

export const adminListCoupons = asyncHandler(async (_req: Request, res: Response) => {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({
    data: coupons.map((c) => ({
      ...c,
      value: Number(c.value),
      minSubtotal: Number(c.minSubtotal),
    })),
  });
});

export const adminCreateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const parsed = couponSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const { code, expiresAt, ...rest } = parsed.data;
  const coupon = await prisma.coupon.create({
    data: { ...rest, code: code.trim().toUpperCase(), expiresAt: expiresAt ? new Date(expiresAt) : null },
  });
  res.status(201).json({ data: coupon });
});

export const adminUpdateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = couponSchema.partial().safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'Coupon not found');
  const { code, expiresAt, ...rest } = parsed.data;
  const coupon = await prisma.coupon.update({
    where: { id },
    data: {
      ...rest,
      ...(code ? { code: code.trim().toUpperCase() } : {}),
      ...(expiresAt !== undefined ? { expiresAt: expiresAt ? new Date(expiresAt) : null } : {}),
    },
  });
  res.json({ data: coupon });
});

export const adminDeleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'Coupon not found');
  await prisma.coupon.delete({ where: { id } });
  res.json({ success: true });
});
