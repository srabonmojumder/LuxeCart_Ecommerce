import ProductDetailClient from './ProductDetailClient';
import { generateProductSchema } from '@/lib/seo';
import type { Product } from '@/store/useStore';
import { Metadata } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// `id` is the route param name but holds the product slug.
async function fetchProduct(slug: string): Promise<Product | null> {
    try {
        const res = await fetch(`${API_URL}/products/${slug}`, { cache: 'no-store' });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data as Product;
    } catch {
        return null;
    }
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
