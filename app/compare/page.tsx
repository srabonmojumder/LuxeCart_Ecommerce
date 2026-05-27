'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Check, Scale, ArrowRight } from 'lucide-react';
import { useCompareStore } from '@/store/useCompareStore';

export default function ComparePage() {
    const compareProducts = useCompareStore((state) => state.compareProducts);
    const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
    const clearCompare = useCompareStore((state) => state.clearCompare);

    if (compareProducts.length === 0) {
        return (
            <div className="max-w-2xl mx-auto px-4 md:px-8 py-16 md:py-24 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 border border-primary/5 dark:border-slate-800 rounded-3xl p-10 md:p-14 text-center space-y-5"
                >
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto">
                        <Scale className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-black text-primary dark:text-white tracking-tighter">
                            Nothing to Compare
                        </h1>
                        <p className="text-secondary dark:text-gray-400">
                            Add products from the shop to compare features side by side.
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 bg-primary dark:bg-accent text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-accent dark:hover:bg-accent-600 transition-colors"
                    >
                        Browse Products
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    const rows: { label: string; render: (p: (typeof compareProducts)[number]) => React.ReactNode }[] = [
        {
            label: 'Price',
            render: (p) => (
                <div className="text-xl font-black text-accent">${p.price.toFixed(2)}</div>
            ),
        },
        {
            label: 'Category',
            render: (p) => <span className="text-sm text-secondary dark:text-gray-400">{p.category}</span>,
        },
        {
            label: 'Rating',
            render: (p) => (
                <div className="flex items-center justify-center gap-1 text-sm">
                    <span className="font-bold text-amber-500">★ {p.rating}</span>
                    <span className="text-gray-400">/ 5</span>
                </div>
            ),
        },
        {
            label: 'Reviews',
            render: (p) => <span className="text-sm text-secondary dark:text-gray-400">{p.reviews}</span>,
        },
        {
            label: 'Availability',
            render: (p) => (
                p.inStock ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                        <Check className="w-3 h-3" /> In Stock
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-hot/10 text-hot text-[10px] font-black uppercase tracking-widest">
                        <X className="w-3 h-3" /> Out
                    </span>
                )
            ),
        },
        {
            label: 'Discount',
            render: (p) => (
                p.discount ? (
                    <span className="text-sm font-black text-hot">-{p.discount}%</span>
                ) : (
                    <span className="text-sm text-gray-400">—</span>
                )
            ),
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 pb-24 space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="space-y-1.5">
                    <span className="text-accent font-black tracking-[0.3em] text-xs uppercase">Compare</span>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-black text-primary dark:text-white tracking-tighter"
                    >
                        Side by Side
                    </motion.h1>
                    <p className="text-secondary dark:text-gray-400 text-sm">
                        {compareProducts.length} product{compareProducts.length === 1 ? '' : 's'} selected
                    </p>
                </div>
                <button
                    onClick={clearCompare}
                    className="px-4 py-2 rounded-xl bg-hot/10 text-hot text-xs font-black uppercase tracking-widest hover:bg-hot/20 transition-colors"
                >
                    Clear All
                </button>
            </div>

            {/* Comparison grid */}
            <div className="overflow-x-auto rounded-2xl border border-primary/5 dark:border-slate-800 bg-white dark:bg-slate-900">
                <table className="w-full">
                    {/* Product header */}
                    <thead className="bg-primary/5 dark:bg-slate-800/50">
                        <tr>
                            <th className="p-4 text-left text-[10px] uppercase tracking-widest text-gray-400 w-32">Feature</th>
                            {compareProducts.map((product) => (
                                <th key={product.id} className="p-4 min-w-[220px]">
                                    <div className="relative space-y-3">
                                        <button
                                            onClick={() => removeFromCompare(product.id)}
                                            className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-hot/10 text-hot hover:bg-hot hover:text-white flex items-center justify-center transition-colors z-10"
                                            aria-label={`Remove ${product.name}`}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-800">
                                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                                        </div>
                                        <Link
                                            href={`/products/${product.id}`}
                                            className="block font-bold text-primary dark:text-white hover:text-accent dark:hover:text-accent-400 transition-colors text-sm truncate"
                                        >
                                            {product.name}
                                        </Link>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Feature rows */}
                    <tbody className="divide-y divide-primary/5 dark:divide-slate-800">
                        {rows.map((row) => (
                            <tr key={row.label}>
                                <td className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 align-middle">
                                    {row.label}
                                </td>
                                {compareProducts.map((p) => (
                                    <td key={p.id} className="p-4 text-center align-middle">
                                        {row.render(p)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
