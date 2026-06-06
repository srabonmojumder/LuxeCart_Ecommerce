'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { useRecentlyViewedStore } from '@/store/useRecentlyViewedStore';

interface RecentlyViewedSectionProps {
    /** Exclude a product id (e.g. on the current product detail page). */
    excludeId?: number;
    /** Override the section heading. */
    title?: string;
}

/** Renders the user's recently-viewed products if any exist (else nothing). */
export default function RecentlyViewedSection({ excludeId, title = 'Recently Viewed' }: RecentlyViewedSectionProps) {
    // Avoid hydration mismatch — the store is persisted in localStorage.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const recent = useRecentlyViewedStore((s) => s.recentProducts);
    const clear = useRecentlyViewedStore((s) => s.clearRecentlyViewed);

    const items = (excludeId != null ? recent.filter((p) => p.id !== excludeId) : recent).slice(0, 8);

    if (!mounted || items.length === 0) return null;

    return (
        <section className="py-12 md:py-20 bg-gray-50 dark:bg-ink-900/40">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-wrap items-end justify-between gap-3 mb-10">
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-2 text-accent font-medium tracking-[0.3em] text-[10px] md:text-xs uppercase">
                            <Clock className="w-3.5 h-3.5" /> Picked up where you left off
                        </span>
                        <h2 className="text-3xl md:text-5xl font-medium text-primary dark:text-white tracking-tight">{title}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={clear}
                            className="text-[10px] font-medium uppercase tracking-widest text-secondary dark:text-gray-400 hover:text-hot transition-colors"
                        >
                            Clear
                        </button>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-accent hover:gap-2 transition-all"
                        >
                            Shop All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                    {items.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
