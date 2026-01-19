import { Product } from '@/store/useStore';
import { Metadata } from 'next';

const SITE_NAME = 'LuxeCart';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxecart.com';
const SITE_DESCRIPTION = 'Premium e-commerce experience for modern home accessories. Minimalist design for a better living.';

/**
 * Generate Product JSON-LD structured data
 * For rich snippets in search results
 */
export function generateProductSchema(product: Product) {
  const finalPrice = product.discount
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price.toFixed(2);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: `${SITE_URL}${product.image}`,
    description: product.description,
    sku: `LUXE-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.id}`,
      priceCurrency: 'USD',
      price: finalPrice,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviews,
      bestRating: '5',
      worstRating: '1',
    },
    category: product.category,
  };
}

/**
 * Generate Organization JSON-LD structured data
 * For branding and contact information
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: SITE_DESCRIPTION,
    sameAs: [
      'https://facebook.com/luxecart',
      'https://twitter.com/luxecart',
      'https://instagram.com/luxecart',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@luxecart.com',
      availableLanguage: 'English',
    },
  };
}

/**
 * Generate WebSite JSON-LD structured data
 * For site-wide search functionality
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD structured data
 * For navigation context in search results
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.url}`,
    })),
  };
}

/**
 * Generate ItemList JSON-LD structured data
 * For product listings
 */
export function generateItemListSchema(products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        url: `${SITE_URL}/products/${product.id}`,
        image: `${SITE_URL}${product.image}`,
        offers: {
          '@type': 'Offer',
          price: product.discount
            ? (product.price * (1 - product.discount / 100)).toFixed(2)
            : product.price.toFixed(2),
          priceCurrency: 'USD',
        },
      },
    })),
  };
}

/**
 * Helper function to create consistent metadata
 */
export function createMetadata({
  title,
  description,
  path = '',
  image,
  type = 'website',
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const defaultImage = `${SITE_URL}/og-image.jpg`;
  const ogImage = image ? `${SITE_URL}${image}` : defaultImage;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    keywords: ['e-commerce', 'home decor', 'minimalist', 'modern', 'premium', 'shopping'],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@luxecart',
      creator: '@luxecart',
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    verification: {
      google: 'your-google-verification-code',
      // Add after setting up Google Search Console
    },
  };
}

/**
 * Helper to stringify JSON-LD data
 * Use this in a script tag: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: stringifyJsonLd(data) }} />
 */
export function stringifyJsonLd(data: object): string {
  return JSON.stringify(data);
}
