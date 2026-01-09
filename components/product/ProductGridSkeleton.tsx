'use client';

import { motion } from 'framer-motion';
import { Loader2, Package } from 'lucide-react';

export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 p-2 md:p-3"
                >
                    {/* Image Skeleton */}
                    <div className="relative aspect-[3/4] md:aspect-[4/5] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-2xl overflow-hidden">
                        <div className="absolute inset-0">
                            <motion.div
                                animate={{
                                    x: ['-100%', '100%'],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
                            />
                        </div>

                        {/* Centered Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                animate={{
                                    rotate: 360,
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            >
                                <Package className="w-8 h-8 md:w-12 md:h-12 text-gray-300 dark:text-gray-600" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="mt-3 px-1 space-y-2">
                        {/* Category */}
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />

                        {/* Title */}
                        <div className="space-y-1.5">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                                ))}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                        </div>

                        {/* Progress bar */}
                        <div className="pt-2">
                            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

// Inline Product Card Skeleton (for single loading)
export function MobileProductSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-lg">
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse relative overflow-hidden">
                <motion.div
                    animate={{ x: ['−100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
            </div>
            <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
            </div>
        </div>
    );
}

// Full Page Skeleton with Header
export function PageSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4 animate-pulse" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 animate-pulse" />
                </div>

                {/* Products Grid */}
                <ProductGridSkeleton />
            </div>

            {/* Loading Indicator */}
            <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-gray-200 dark:border-gray-700">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                <span className="font-medium text-gray-900 dark:text-white">Loading products...</span>
            </div>
        </div>
    );
}
