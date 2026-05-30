import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';

// ------- helpers -------

/** Slug from a title: lowercase, alphanum + hyphens. */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90) || `post-${Date.now()}`;
}

/** Ensure a slug is unique by suffixing -2, -3, … when needed. */
async function uniqueSlug(base: string, ignoreId?: number): Promise<string> {
  let slug = base;
  let n = 2;
  while (true) {
    const found = await prisma.post.findUnique({ where: { slug } });
    if (!found || found.id === ignoreId) return slug;
    slug = `${base}-${n++}`;
  }
}

const tagsSchema = z.array(z.string().trim().min(1).max(40)).max(20).optional().nullable();

const postSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().optional(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(1),
  image: z.string().min(1),
  author: z.string().max(80).optional(),
  tags: tagsSchema,
  published: z.boolean().optional(),
  publishedAt: z.string().datetime().optional(),
});

function serialize(p: Awaited<ReturnType<typeof prisma.post.findFirst>>) {
  if (!p) return null;
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    image: p.image,
    author: p.author,
    tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
    published: p.published,
    publishedAt: p.publishedAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

// ------- public -------

/** GET /api/blog?page=1&limit=12&q=&tag= — published posts. */
export const listPosts = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const tag = typeof req.query.tag === 'string' ? req.query.tag.trim() : '';

  const where: import('@prisma/client').Prisma.PostWhereInput = { published: true };
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { excerpt: { contains: q } },
      { content: { contains: q } },
    ];
  }

  // Fetch all matching posts then filter by tag in JS (JSON `array_contains`
  // requires raw SQL on MySQL — and the dataset is small for blogs).
  const all = await prisma.post.findMany({ where, orderBy: { publishedAt: 'desc' } });
  const tagFiltered = tag
    ? all.filter((p) => Array.isArray(p.tags) && (p.tags as string[]).map((t) => t.toLowerCase()).includes(tag.toLowerCase()))
    : all;

  const total = tagFiltered.length;
  const slice = tagFiltered.slice((page - 1) * limit, page * limit);

  // Light list payload (no full content body to keep it small).
  res.json({
    data: slice.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      image: p.image,
      author: p.author,
      tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
      publishedAt: p.publishedAt,
    })),
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  });
});

/** GET /api/blog/meta — sidebar helpers: recent posts, archive months, tags. */
export const getBlogMeta = asyncHandler(async (_req: Request, res: Response) => {
  const all = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: { id: true, slug: true, title: true, image: true, publishedAt: true, tags: true },
  });

  const recent = all.slice(0, 5).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    image: p.image,
    publishedAt: p.publishedAt,
  }));

  // Archive: posts grouped by "Month YYYY"
  const archiveMap = new Map<string, { month: string; year: number; posts: { slug: string; title: string }[] }>();
  for (const p of all) {
    const d = new Date(p.publishedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const month = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const entry = archiveMap.get(key) ?? { month, year: d.getFullYear(), posts: [] };
    entry.posts.push({ slug: p.slug, title: p.title });
    archiveMap.set(key, entry);
  }
  const archive = [...archiveMap.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([, v]) => v);

  // Tag counts
  const tagCounts = new Map<string, number>();
  for (const p of all) {
    if (Array.isArray(p.tags)) {
      for (const t of p.tags as string[]) {
        const k = t.toLowerCase();
        tagCounts.set(k, (tagCounts.get(k) ?? 0) + 1);
      }
    }
  }
  const tags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  res.json({ data: { recent, archive, tags } });
});

/** GET /api/blog/:slug — single published post. */
export const getPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await prisma.post.findUnique({ where: { slug: req.params.slug } });
  if (!post || !post.published) throw new HttpError(404, 'Post not found');
  res.json({ data: serialize(post) });
});

// ------- admin -------

export const adminListPosts = asyncHandler(async (_req: Request, res: Response) => {
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: 'desc' } });
  res.json({ data: posts.map(serialize) });
});

export const adminCreatePost = asyncHandler(async (req: Request, res: Response) => {
  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const d = parsed.data;
  const base = slugify(d.slug || d.title);
  const slug = await uniqueSlug(base);
  const post = await prisma.post.create({
    data: {
      slug,
      title: d.title,
      excerpt: d.excerpt ?? null,
      content: d.content,
      image: d.image,
      author: d.author ?? 'Admin',
      tags: d.tags ?? [],
      published: d.published ?? true,
      publishedAt: d.publishedAt ? new Date(d.publishedAt) : new Date(),
    },
  });
  res.status(201).json({ data: serialize(post) });
});

export const adminUpdatePost = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = postSchema.partial().safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'Post not found');

  const d = parsed.data;
  let slug = existing.slug;
  if (d.slug && d.slug !== existing.slug) {
    slug = await uniqueSlug(slugify(d.slug), id);
  } else if (d.title && d.title !== existing.title && !d.slug) {
    // Only auto-rename slug when title changes AND caller didn't pin a slug.
    slug = await uniqueSlug(slugify(d.title), id);
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      slug,
      title: d.title ?? existing.title,
      excerpt: d.excerpt === undefined ? existing.excerpt : d.excerpt,
      content: d.content ?? existing.content,
      image: d.image ?? existing.image,
      author: d.author ?? existing.author,
      tags: d.tags === undefined ? existing.tags ?? [] : d.tags ?? [],
      published: d.published ?? existing.published,
      publishedAt: d.publishedAt ? new Date(d.publishedAt) : existing.publishedAt,
    },
  });
  res.json({ data: serialize(post) });
});

export const adminDeletePost = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'Post not found');
  await prisma.post.delete({ where: { id } });
  res.json({ success: true });
});
