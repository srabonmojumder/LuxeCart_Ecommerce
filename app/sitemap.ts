import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface SlugProduct { slug?: string; id: number }
interface SlugCategory { slug: string }

async function fetchProducts(): Promise<SlugProduct[]> {
  try {
    const res = await fetch(`${API_URL}/products?limit=500`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []) as SlugProduct[];
  } catch {
    return [];
  }
}

async function fetchCategories(): Promise<SlugCategory[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []) as SlugCategory[];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);

  const productPages = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug ?? product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${baseUrl}/products?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
