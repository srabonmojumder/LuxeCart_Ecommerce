import ProductDetailClient from './ProductDetailClient';
import { generateProductSchema } from '@/lib/seo';
import type { Product } from '@/store/useStore';
import { products } from '@/data/products';
import { Metadata } from 'next';

// `id` is the route param name but holds the product slug (or numeric id).
// Static build: look the product up in the local catalog — no backend.
async function fetchProduct(key: string): Promise<Product | null> {
    return products.find((p) => p.slug === key || String(p.id) === key) ?? null;
}

// Pre-render a page for every product in the static catalog.
export function generateStaticParams() {
    return products.map((p) => ({ id: p.slug ?? String(p.id) }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const product = await fetchProduct(id);

    if (!product) {
        return { title: 'Product Not Found' };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxecart.com';
    const path = `/products/${product.slug ?? product.id}`;

    return {
        title: product.name,
        description: product.description,
        keywords: [
            product.category,
            product.name,
            ...(product.tags || []),
            'buy online',
            'shop',
            'e-commerce',
        ],
        openGraph: {
            type: 'website',
            title: product.name,
            description: product.description,
            url: path,
            images: [{ url: product.image, width: 800, height: 600, alt: product.name }],
            siteName: 'LuxeCart',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description,
            images: [product.image],
        },
        alternates: { canonical: `${siteUrl}${path}` },
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await fetchProduct(id);

    return (
        <>
            {product && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(generateProductSchema(product)) }}
                />
            )}
            <ProductDetailClient />
        </>
    );
}
