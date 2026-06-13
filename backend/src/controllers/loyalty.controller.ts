import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../middleware/error.js';
import { serializeLoyalty } from '../lib/loyalty.js';

/** GET /api/loyalty — the signed-in user's points balance + recent history. */
export const getMyLoyalty = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.sub;
  const account = await prisma.loyaltyAccount.findUnique({
    where: { userId },
    include: { transactions: { orderBy: { createdAt: 'desc' }, take: 20 } },
  });
  res.json({ data: serializeLoyalty(account) });
});
