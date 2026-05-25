import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import multer from 'multer';
import { HttpError } from '../middleware/error.js';

// Resolve <backend>/uploads regardless of where the process is started from.
export const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  },
});

/** multer middleware: a single image field named "file", max 5 MB, images only. */
export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) cb(null, true);
    else cb(new HttpError(400, 'Only image files are allowed (jpg, png, webp, gif, avif)'));
  },
}).single('file');

/** POST /api/admin/uploads — returns the public URL of the stored image. */
export function handleUpload(req: Request, res: Response) {
  if (!req.file) throw new HttpError(400, 'No file uploaded');
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({ url });
}
