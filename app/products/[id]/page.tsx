import ProductDetailClient from './ProductDetailClient';
import { products } from '@/data/products';
import { generateProductSchema } from '@/lib/seo';
import { Metadata } from 'next';

export function generateStaticParams() {
    return products.map((product) => ({
        id: product.id.toString(),
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const product = products.find((p) => p.id.toString() === id);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    const finalPrice = product.discount
        ? (product.price * (1 - product.discount / 100)).toFixed(2)
        : product.price.toFixed(2);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxecart.com';

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
            url: `/products/${product.id}`,
            images: [
                {
                    url: product.image,
                    width: 800,
                    height: 600,
                    alt: product.name,
                },
            ],
            siteName: 'LuxeCart',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description,
            images: [product.image],
        },
        alternates: {
            canonical: `${siteUrl}/products/${product.id}`,
        },
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = products.find((p) => p.id.toString() === id);

    if (!product) {
        return <div>Product not found</div>;
    }

    const productSchema = generateProductSchema(product);

    return (
        <>
            {/* JSON-LD for Product Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            <ProductDetailClient />
        </>
    );
}
