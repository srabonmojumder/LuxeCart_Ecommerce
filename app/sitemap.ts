import { products } from '@/data/products';
import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxecart.com';

  // Static pages with their priorities
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

  // Dynamic product pages
  const productPages = products.map(product => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages];
}
