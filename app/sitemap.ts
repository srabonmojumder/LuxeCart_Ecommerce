import { MetadataRoute } from 'next';
import { products } from '@/data/products';

// Static build: derive sitemap entries from the local catalog — no backend.
const categorySlugs = Array.from(new Set(products.map((p) => p.category))).map((name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
);

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxecart.com';

  const staticPages = [
    { route: '', priority: 1.0, changeFrequency: 'daily' as const },
    { route: '/products', priority: 0.9, changeFrequency: 'daily' as const },
    { route: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { route: '/categories', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/cart', priority: 0.5, changeFrequency: 'always' as const },
    { route: '/wishlist', priority: 0.5, changeFrequency: 'always' as const },
    { route: '/compare', priority: 0.5, changeFrequency: 'always' as const },
  ].map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const productPages = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug ?? product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const categoryPages = categorySlugs.map((slug) => ({
    url: `${baseUrl}/products?category=${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
