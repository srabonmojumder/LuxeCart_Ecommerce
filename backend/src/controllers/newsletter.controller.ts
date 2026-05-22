import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';

const subscribeSchema = z.object({ email: z.string().email() });

/** POST /api/newsletter — public; subscribe an email (idempotent). */
export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Please enter a valid email');
  const email = parsed.data.email.trim().toLowerCase();
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email },
    update: {},
  });
  res.status(201).json({ success: true });
});

// ---------------- Admin ----------------

export const adminListSubscribers = asyncHandler(async (_req: Request, res: Response) => {
  const subs = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ data: subs });
});

export const adminDeleteSubscriber = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.newsletterSubscriber.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'Subscriber not found');
  await prisma.newsletterSubscriber.delete({ where: { id } });
  res.json({ success: true });
});
