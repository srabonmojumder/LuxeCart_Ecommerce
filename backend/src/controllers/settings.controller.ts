import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { getSettings, serializeSettings } from '../lib/settings.js';

/** GET /api/settings — public store settings. */
export const getPublicSettings = asyncHandler(async (_req: Request, res: Response) => {
  const s = await getSettings();
  res.json({ data: serializeSettings(s) });
});

const updateSchema = z
  .object({
    storeName: z.string().min(1),
    supportEmail: z.string().email(),
    supportPhone: z.string().min(1),
    address: z.string().nullable(),
    facebook: z.string().nullable(),
    instagram: z.string().nullable(),
    twitter: z.string().nullable(),
    announcement: z.string().nullable(),
    freeShippingThreshold: z.number().min(0),
    shippingFlat: z.number().min(0),
    taxRate: z.number().min(0).max(1),
    currencyCode: z.string().min(1),
    currencySymbol: z.string().min(1),
  })
  .partial();

/** PUT /api/admin/settings */
export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  await getSettings(); // ensure the row exists
  const s = await prisma.setting.update({ where: { id: 1 }, data: parsed.data });
  res.json({ data: serializeSettings(s) });
});
