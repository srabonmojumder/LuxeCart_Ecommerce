import type { Prisma } from '@prisma/client';

// Product with the relations the API includes.
// `images` is optional so the serializer also works for callers that don't
// include the gallery relation (cart, wishlist) — they fall back to `image`.
export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; tags: { include: { tag: true } } };
}> & { images?: { url: string; position: number }[] };

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
    images: p.images?.length
      ? [...p.images].sort((a, b) => a.position - b.position).map((i) => i.url)
      : (p.image ? [p.image] : []),
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
