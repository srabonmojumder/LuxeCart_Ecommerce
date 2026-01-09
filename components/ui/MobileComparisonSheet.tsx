'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Check, Minus } from 'lucide-react';
import { Product } from '@/store/useStore';
import { useCompareStore } from '@/store/useCompareStore';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function MobileComparisonSheet() {
    const [isOpen, setIsOpen] = useState(false);
    const compareProducts = useCompareStore((state) => state.compareProducts);
    const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
    const clearCompare = useCompareStore((state) => state.clearCompare);

    if (compareProducts.length === 0) return null;

    const comparisonRows = [
        { label: 'Image', key: 'image', type: 'image' },
        { label: 'Name', key: 'name', type: 'text' },
        { label: 'Price', key: 'price', type: 'price' },
        { label: 'Rating', key: 'rating', type: 'rating' },
        { label: 'Reviews', key: 'reviews', type: 'number' },
        { label: 'Category', key: 'category', type: 'text' },
        { label: 'In Stock', key: 'inStock', type: 'boolean' },
    ];

    return (
        <>
            {/* Floating Compare Button */}
            <motion.button
                initial={{ scale: 0, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 100 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed bottom-20 right-4 z-40 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center gap-2"
            >
                <span className="font-semibold">Compare</span>
                <span className="bg-white text-blue-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {compareProducts.length}
                </span>
            </motion.button>

            {/* Comparison Sheet */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />

                        {/* Sheet Content */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="md:hidden fixed inset-x-0 bottom-0 top-20 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                                <div>
                                    <h3 className="text-xl font-bold">Product Comparison</h3>
                                    <p className="text-sm text-white/80">{compareProducts.length} products</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={clearCompare}
                                        className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Comparison Table */}
                            <div className="flex-1 overflow-auto">
                                <div className="min-w-full inline-block">
                                    <table className="w-full">
                                        <tbody>
                                            {comparisonRows.map((row, rowIndex) => (
                                                <tr
                                                    key={row.key}
                                                    className={rowIndex % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
                                                >
                                                    {/* Row Label */}
                                                    <td className="sticky left-0 bg-white dark:bg-gray-900 p-4 font-semibold text-sm border-r border-gray-200 dark:border-gray-800 min-w-[100px] z-10">
                                                        {row.label}
                                                    </td>

                                                    {/* Product Values */}
                                                    {compareProducts.map((product, productIndex) => (
                                                        <td
                                                            key={product.id}
                                                            className="p-4 text-center min-w-[150px] relative"
                                                        >
                                                            {row.type === 'image' && (
                                                                <div className="relative w-24 h-24 mx-auto rounded-lg overflow-hidden">
                                                                    <Image
                                                                        src={product.image}
                                                                        alt={product.name}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                    <button
                                                                        onClick={() => removeFromCompare(product.id)}
                                                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {row.type === 'text' && (
                                                                <span className="text-gray-900 dark:text-white font-medium">
                                                                    {product[row.key as keyof Product] as string}
                                                                </span>
                                                            )}
                                                            {row.type === 'price' && (
                                                                <div className="space-y-1">
                                                                    <span className="text-lg font-bold text-purple-600">
                                                                        ${product.price.toFixed(2)}
                                                                    </span>
                                                                    {product.discount && (
                                                                        <div className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full inline-block">
                                                                            -{product.discount}% OFF
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                            {row.type === 'rating' && (
                                                                <div className="flex items-center justify-center gap-1">
                                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                                    <span className="font-bold text-gray-900 dark:text-white">
                                                                        {product.rating}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {row.type === 'number' && (
                                                                <span className="text-gray-600 dark:text-gray-400">
                                                                    {product[row.key as keyof Product]}
                                                                </span>
                                                            )}
                                                            {row.type === 'boolean' && (
                                                                <div className="flex justify-center">
                                                                    {product.inStock ? (
                                                                        <Check className="w-5 h-5 text-green-500" />
                                                                    ) : (
                                                                        <Minus className="w-5 h-5 text-red-500" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                <div className="grid grid-cols-2 gap-3">
                                    {compareProducts.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.id}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg truncate"
                                            >
                                                View {product.name}
                                            </motion.button>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
