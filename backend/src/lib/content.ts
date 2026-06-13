import { prisma } from './prisma.js';

/**
 * The full editable content tree for the storefront. Every string here is the
 * factory default; admins override any subset under /admin/content and the
 * stored JSON is deep-merged over these defaults.
 */
export const DEFAULT_CONTENT = {
  homepage: {
    hero: {
      // Shown only when there are no active banners.
      subtitle: 'New Collection 2026',
      title: 'Timeless pieces for modern living',
      ctaText: 'Explore the Collection',
      ctaLink: '/products',
    },
    bestSellers: { title: 'Our Best Sellers', subtitle: 'Shop the most loved items this season.' },
    numbers: { eyebrow: 'Trusted Worldwide', title: 'The Numbers Speak' },
    collections: { eyebrow: 'Curated For You', title: 'Shop by Collection' },
    newArrivals: { eyebrow: 'Just Landed', title: 'New Arrivals' },
    testimonials: { eyebrow: 'Loved by Customers', title: 'What People Say' },
    promo: {
      eyebrow: 'Limited Offer',
      fallbackTitle: 'Minimalist Design Deal',
      fallbackText: 'Experience the perfect blend of form and function — exclusive mid-season pricing on our most-loved pieces.',
    },
    newsletter: {
      title: 'Stay Inspired',
      subtitle: 'Join our community and get exclusive early access to our new drops, styling tips, and 15% off your first order.',
    },
  },
  // Trust strip. icon = one of: truck | shield | returns | zap | gift | lock | award | clock.
  // For the first card, an empty desc falls back to the live free-shipping threshold.
  features: [
    { icon: 'truck', title: 'Free Shipping', desc: '' },
    { icon: 'shield', title: 'Secure Payment', desc: 'Verified checkout' },
    { icon: 'returns', title: 'Easy Returns', desc: '30 day returns' },
    { icon: 'zap', title: 'Fast Delivery', desc: 'Across the globe' },
  ],
  promo: {
    flashSaleHours: 36,
    dealHours: 48,
    megaMenu: {
      tech: { image: '/photo-1505740420928-5e560c06d30e.webp', title: 'Tech Deals', discount: 'Up to 40% OFF' },
      support: { image: '/photo-1441986300917-64674bd600d8.webp', title: 'Customer Support', discount: 'Here 24/7' },
    },
  },
  footer: {
    tagline: 'Curated minimalist home accessories, designed to bring harmony to your living space.',
  },
  pages: {
    about: {
      title: 'About Us',
      body: 'We craft timeless, minimalist pieces designed to bring harmony to modern living.',
    },
  },
};

export type SiteContentData = typeof DEFAULT_CONTENT;

/** Recursively merge `override` onto `base` (arrays are replaced wholesale). */
function deepMerge<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }
  if (base && typeof base === 'object') {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    const ov = (override && typeof override === 'object' ? override : {}) as Record<string, unknown>;
    for (const key of Object.keys(out)) {
      if (key in ov) out[key] = deepMerge(out[key], ov[key]);
    }
    return out as T;
  }
  // Primitive: take the override when it's a non-undefined/non-null value.
  return (override === undefined || override === null ? base : override) as T;
}

/** Returns the merged content tree (stored overrides on top of defaults). */
export async function getContent(): Promise<SiteContentData> {
  const row = await prisma.siteContent.findUnique({ where: { id: 1 } });
  return deepMerge(DEFAULT_CONTENT, row?.data);
}

/** Persist a (possibly partial) content tree, merged over what's stored. */
export async function saveContent(patch: unknown): Promise<SiteContentData> {
  const current = await getContent();
  const merged = deepMerge(current, patch);
  await prisma.siteContent.upsert({
    where: { id: 1 },
    create: { id: 1, data: merged as object },
    update: { data: merged as object },
  });
  return merged;
}
