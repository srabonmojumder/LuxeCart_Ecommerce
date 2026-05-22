import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';

const profileSchema = z.object({
  displayName: z.string().min(1).max(80).optional(),
  photoURL: z.string().url().nullable().optional(),
});

/** PATCH /api/account/profile */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);

  const user = await prisma.user.update({
    where: { id: req.user!.sub },
    data: parsed.data,
  });
  res.json({ user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role, photoURL: user.photoURL } });
});

/** GET /api/account/addresses */
export const listAddresses = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await prisma.address.findMany({ where: { userId: req.user!.sub }, orderBy: { isDefault: 'desc' } });
  res.json({ data: addresses });
});

const addressSchema = z.object({
  fullName: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
});

/** POST /api/account/addresses */
export const createAddress = asyncHandler(async (req: Request, res: Response) => {
  const parsed = addressSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({ where: { userId: req.user!.sub }, data: { isDefault: false } });
  }
  const address = await prisma.address.create({ data: { ...parsed.data, userId: req.user!.sub } });
  res.status(201).json({ data: address });
});

/** PATCH /api/account/addresses/:id */
export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = addressSchema.partial().safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);

  const owned = await prisma.address.findFirst({ where: { id, userId: req.user!.sub } });
  if (!owned) throw new HttpError(404, 'Address not found');

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({ where: { userId: req.user!.sub }, data: { isDefault: false } });
  }
  const address = await prisma.address.update({ where: { id }, data: parsed.data });
  res.json({ data: address });
});

/** DELETE /api/account/addresses/:id */
export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const owned = await prisma.address.findFirst({ where: { id, userId: req.user!.sub } });
  if (!owned) throw new HttpError(404, 'Address not found');
  await prisma.address.delete({ where: { id } });
  res.json({ success: true });
});
