'use client';

import { Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import { useBestsellers } from '@/lib/hooks';
import type { Product } from '@/store/useStore';

/**
 * "You may also like" — best-selling products. Optionally hide some ids
 * (e.g. items already in the cart) and cap how many show.
 */
export default function RecommendedProducts({
    title = 'You may also like',
    excludeIds = [],
    limit = 4,
}: {
    title?: string;
    excludeIds?: number[];
    limit?: number;
}) {
    const { products, isLoading } = useBestsellers(limit + excludeIds.length);
    if (isLoading) return null;

    const exclude = new Set(excludeIds);
    const list: Product[] = products.filter((p) => !exclude.has(p.id)).slice(0, limit);
    if (list.length === 0) return null;

    return (
        <section className="mt-20 px-4 md:px-0">
            <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2 className="text-2xl md:text-3xl font-black text-primary dark:text-white tracking-tighter">{title}</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {list.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </section>
    );
}
