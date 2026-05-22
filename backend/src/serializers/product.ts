import type { Prisma } from '@prisma/client';

// Product with the relations the API includes.
export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; tags: { include: { tag: true } } };
}>;

/**
 * Maps a DB product to the shape the current frontend Product interface expects,
 * so the Next.js app needs minimal changes when it switches to the API.
 */
export function serializeProduct(p: ProductWithRelations) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    image: p.image,
    category: p.category?.name ?? null,
    description: p.description,
    rating: p.ratingAvg,
    reviews: p.reviewCount,
    inStock: p.inStock,
    featured: p.featured,
    discount: p.discount || undefined,
    stock: p.stock,
    colors: (p.colors as string[] | null) ?? undefined,
    sizes: (p.sizes as string[] | null) ?? undefined,
    tags: p.tags?.map((t) => t.tag.name) ?? undefined,
  };
}
