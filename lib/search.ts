import Fuse from 'fuse.js';
import { products } from '@/data/products';
import { Product } from '@/store/useStore';

// Fuse.js configuration for fuzzy search
const fuseOptions = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'category', weight: 0.2 },
    { name: 'tags', weight: 0.1 },
  ],
  threshold: 0.3, // Lower = more strict (0 = exact, 1 = match anything)
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
  useExtendedSearch: true,
};

// Initialize Fuse instance
const fuse = new Fuse(products, fuseOptions);

/**
 * Search products with fuzzy matching
 * Handles typos and partial matches
 */
export function searchProducts(query: string): Product[] {
  if (!query || query.trim().length === 0) {
    return products;
  }

  const results = fuse.search(query);
  return results.map((result) => result.item);
}

/**
 * Search with advanced filters
 */
export interface SearchFilters {
  categories?: string[];
  priceRange?: [number, number];
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
}

export function searchWithFilters(query: string, filters: SearchFilters = {}): Product[] {
  let results = query ? searchProducts(query) : products;

  // Apply category filter
  if (filters.categories && filters.categories.length > 0) {
    results = results.filter((p) => filters.categories!.includes(p.category));
  }

  // Apply price range filter
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    results = results.filter((p) => {
      const price = p.discount ? p.price * (1 - p.discount / 100) : p.price;
      return price >= min && price <= max;
    });
  }

  // Apply rating filter
  if (filters.rating) {
    results = results.filter((p) => p.rating >= filters.rating!);
  }

  // Apply in-stock filter
  if (filters.inStock) {
    results = results.filter((p) => p.inStock);
  }

  // Apply on-sale filter
  if (filters.onSale) {
    results = results.filter((p) => p.discount && p.discount > 0);
  }

  return results;
}

/**
 * Get autocomplete suggestions
 */
export function getSuggestions(query: string, limit = 5): string[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const results = fuse.search(query, { limit });
  return results.map((result) => result.item.name);
}

/**
 * Search by category
 */
export function searchByCategory(category: string): Product[] {
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

/**
 * Sort products
 */
export type SortOption =
  | 'featured'
  | 'price-low-high'
  | 'price-high-low'
  | 'rating'
  | 'name-asc'
  | 'name-desc'
  | 'newest';

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-low-high':
      return sorted.sort((a, b) => {
        const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return priceA - priceB;
      });

    case 'price-high-low':
      return sorted.sort((a, b) => {
        const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return priceB - priceA;
      });

    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);

    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    case 'newest':
      // Assuming higher ID means newer
      return sorted.sort((a, b) => b.id - a.id);

    case 'featured':
    default:
      // Return as-is or sort by some featured logic
      return sorted;
  }
}

/**
 * Get related products (same category, excluding current product)
 */
export function getRelatedProducts(productId: number, limit = 4): Product[] {
  const product = products.find((p) => p.id === productId);
  if (!product) return [];

  return products
    .filter((p) => p.id !== productId && p.category === product.category)
    .slice(0, limit);
}

/**
 * Get popular products (by rating and reviews)
 */
export function getPopularProducts(limit = 8): Product[] {
  return [...products]
    .sort((a, b) => {
      // Sort by rating first, then by number of reviews
      const scoreA = a.rating * Math.log(a.reviews + 1);
      const scoreB = b.rating * Math.log(b.reviews + 1);
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

/**
 * Get products on sale
 */
export function getOnSaleProducts(limit?: number): Product[] {
  const onSale = products.filter((p) => p.discount && p.discount > 0);
  return limit ? onSale.slice(0, limit) : onSale;
}

/**
 * Filter by price range
 */
export function filterByPriceRange(min: number, max: number): Product[] {
  return products.filter((p) => {
    const price = p.discount ? p.price * (1 - p.discount / 100) : p.price;
    return price >= min && price <= max;
  });
}
