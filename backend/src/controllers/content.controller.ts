import type { Request, Response } from 'express';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { getContent, saveContent } from '../lib/content.js';

/** GET /api/content — public; the merged site content tree. */
export const getSiteContent = asyncHandler(async (_req: Request, res: Response) => {
  res.json({ data: await getContent() });
});

/** PATCH /api/admin/content — admin; deep-merge a (partial) content tree. */
export const updateSiteContent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body || typeof req.body !== 'object') throw new HttpError(400, 'Invalid content payload');
  res.json({ data: await saveContent(req.body) });
});
