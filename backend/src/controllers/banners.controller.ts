import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';

/** GET /api/banners — public; active banners ordered by position. */
export const listBanners = asyncHandler(async (_req: Request, res: Response) => {
  const banners = await prisma.banner.findMany({ where: { active: true }, orderBy: { position: 'asc' } });
  res.json({ data: banners });
});

const bannerSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().nullable().optional(),
  image: z.string().min(1),
  ctaText: z.string().nullable().optional(),
  ctaLink: z.string().nullable().optional(),
  active: z.boolean().default(true),
  position: z.number().int().default(0),
});

export const adminListBanners = asyncHandler(async (_req: Request, res: Response) => {
  const banners = await prisma.banner.findMany({ orderBy: { position: 'asc' } });
  res.json({ data: banners });
});

export const adminCreateBanner = asyncHandler(async (req: Request, res: Response) => {
  const parsed = bannerSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const banner = await prisma.banner.create({ data: parsed.data });
  res.status(201).json({ data: banner });
});

export const adminUpdateBanner = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = bannerSchema.partial().safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'Banner not found');
  const banner = await prisma.banner.update({ where: { id }, data: parsed.data });
  res.json({ data: banner });
});

export const adminDeleteBanner = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'Banner not found');
  await prisma.banner.delete({ where: { id } });
  res.json({ success: true });
});
