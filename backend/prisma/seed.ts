import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { uniqueSlug } from '../src/utils/slug.js';

const prisma = new PrismaClient();
const __dirname = dirname(fileURLToPath(import.meta.url));

interface RawCategory {
  id: number;
  name: string;
  image?: string;
  count?: number;
  description?: string;
  gradient?: string;
}

interface RawProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  discount?: number;
  stock?: number;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
}

async function loadJson<T>(file: string): Promise<T> {
  const raw = await readFile(join(__dirname, 'data', file), 'utf8');
  return JSON.parse(raw) as T;
}

async function main() {
  const categories = await loadJson<RawCategory[]>('categories.json');
  const products = await loadJson<RawProduct[]>('products.json');

  console.log('Clearing existing catalog data...');
  // Order matters because of foreign keys.
  await prisma.productTag.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();

  // --- Categories ---
  console.log(`Seeding ${categories.length} categories...`);
  const catSlugs = new Set<string>();
  const categoryIdByName = new Map<string, number>();

  for (const c of categories) {
    const created = await prisma.category.create({
      data: {
        name: c.name,
        slug: uniqueSlug(c.name, catSlugs),
        image: c.image ?? null,
        description: c.description ?? null,
        gradient: c.gradient ?? null,
        count: c.count ?? 0,
      },
    });
    categoryIdByName.set(c.name, created.id);
  }

  // --- Tags (collect unique) ---
  const tagNames = new Set<string>();
  for (const p of products) (p.tags ?? []).forEach((t) => tagNames.add(t));
  console.log(`Seeding ${tagNames.size} tags...`);
  const tagIdByName = new Map<string, number>();
  for (const name of tagNames) {
    const tag = await prisma.tag.create({ data: { name } });
    tagIdByName.set(name, tag.id);
  }

  // --- Products ---
  console.log(`Seeding ${products.length} products...`);
  const productSlugs = new Set<string>();

  for (const p of products) {
    // Ensure the category exists even if it wasn't in categories.json.
    let categoryId = categoryIdByName.get(p.category);
    if (!categoryId) {
      const created = await prisma.category.create({
        data: { name: p.category, slug: uniqueSlug(p.category, catSlugs) },
      });
      categoryId = created.id;
      categoryIdByName.set(p.category, categoryId);
    }

    await prisma.product.create({
      data: {
        name: p.name,
        slug: uniqueSlug(p.name, productSlugs),
        description: p.description,
        price: p.price,
        discount: p.discount ?? 0,
        image: p.image,
        stock: p.stock ?? 0,
        inStock: p.inStock,
        ratingAvg: p.rating ?? 0,
        reviewCount: p.reviews ?? 0,
        colors: p.colors ?? undefined,
        sizes: p.sizes ?? undefined,
        categoryId,
        images: {
          create: [{ url: p.image, alt: p.name, position: 0 }],
        },
        tags: {
          create: (p.tags ?? []).map((t) => ({
            tag: { connect: { id: tagIdByName.get(t)! } },
          })),
        },
      },
    });
  }

  // --- Admin user (idempotent) --- use a real, deliverable email so admin
  // order notifications don't bounce. Configure via ADMIN_EMAIL / ADMIN_PASSWORD.
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@luxecart.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      displayName: 'LuxeCart Admin',
      role: 'ADMIN',
      cart: { create: {} },
    },
  });
  console.log(`Admin user ready: ${adminEmail}`);

  const [catCount, prodCount, tagCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.tag.count(),
  ]);
  console.log(`✓ Seed complete: ${catCount} categories, ${prodCount} products, ${tagCount} tags.`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
