'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/data/products';

export default function CategoriesPage() {
    return (
        <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Shop by Category
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Explore our curated collections
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Link href={`/products?category=${category.name.toLowerCase()}`}>
                                <div className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                                        <p className="text-gray-200 mb-4">{category.count} Products</p>
                                        <div className="flex items-center gap-2 text-white group-hover:gap-4 transition-all">
                                            <span>Shop Now</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Featured Category Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 relative h-96 rounded-3xl overflow-hidden"
                >
                    <Image
                        src="/photo-1607082348824-0a96f2a4b9da.webp"
                        alt="Special Offers"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />

                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-2xl mx-auto px-8 text-center text-white">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                Exclusive Deals Just for You
                            </h2>
                            <p className="text-xl mb-8 text-gray-200">
                                Get up to 50% off on selected items from all categories
                            </p>
                            <Link href="/products">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-primary inline-flex items-center gap-2"
                                >
                                    Shop All Deals
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
