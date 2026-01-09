'use client';

import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Search, X, TrendingUp, Clock, Tag } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { products } from '@/data/products';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/store/useStore';

export default function MobileSearchModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Load recent searches from localStorage
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.trim()) {
            const filtered = products.filter(
                (p) =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.category.toLowerCase().includes(query.toLowerCase()) ||
                    p.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            ).slice(0, 8);
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query]);

    const handleSearch = (searchQuery: string) => {
        if (searchQuery.trim()) {
            const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
            setRecentSearches(updated);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
        }
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.y > 100) {
            setIsOpen(false);
        }
    };

    const trendingSearches = ['Headphones', 'Smart Watch', 'Sneakers', 'Backpack'];

    return (
        <>
            {/* Trigger Button - Hidden on desktop, shown on mobile */}
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 right-16 z-40 bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>

            {/* Modal */}
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

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, y: '100%' }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: '100%' }}
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={{ top: 0, bottom: 0.3 }}
                            onDragEnd={handleDragEnd}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="md:hidden fixed inset-x-0 bottom-0 top-20 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
                        >
                            {/* Drag Handle */}
                            <div className="flex justify-center py-3">
                                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                            </div>

                            {/* Search Input */}
                            <div className="px-4 pb-4">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch(query);
                                            }
                                        }}
                                        placeholder="Search products..."
                                        className="w-full pl-12 pr-12 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    {query && (
                                        <motion.button
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setQuery('')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"
                                        >
                                            <X className="w-4 h-4" />
                                        </motion.button>
                                    )}
                                </div>
                            </div>

                            {/* Results/Suggestions */}
                            <div className="flex-1 overflow-y-auto px-4 pb-4">
                                {query ? (
                                    // Search Results
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                                            {results.length} Results
                                        </h3>
                                        <div className="space-y-2">
                                            {results.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.id}`}
                                                    onClick={() => {
                                                        handleSearch(query);
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                                                            <Image
                                                                src={product.image}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                                                {product.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {product.category}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className="font-bold text-purple-600">
                                                                ${product.price.toFixed(2)}
                                                            </span>
                                                            {product.discount && (
                                                                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                                                                    -{product.discount}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    // Recent & Trending Searches
                                    <div className="space-y-6">
                                        {/* Recent Searches */}
                                        {recentSearches.length > 0 && (
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        Recent Searches
                                                    </h3>
                                                    <button
                                                        onClick={clearRecentSearches}
                                                        className="text-xs text-purple-600 dark:text-purple-400 font-medium"
                                                    >
                                                        Clear All
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {recentSearches.map((search, index) => (
                                                        <motion.button
                                                            key={index}
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => {
                                                                setQuery(search);
                                                                handleSearch(search);
                                                            }}
                                                            className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium"
                                                        >
                                                            {search}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Trending Searches */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                                                <TrendingUp className="w-4 h-4" />
                                                Trending Searches
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {trendingSearches.map((search, index) => (
                                                    <motion.button
                                                        key={index}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            setQuery(search);
                                                            handleSearch(search);
                                                        }}
                                                        className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium"
                                                    >
                                                        {search}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Popular Categories */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                                                <Tag className="w-4 h-4" />
                                                Popular Categories
                                            </h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['Electronics', 'Fashion', 'Sports', 'Home'].map((category, index) => (
                                                    <Link
                                                        key={index}
                                                        href={`/products?category=${category.toLowerCase()}`}
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl text-center font-medium text-gray-900 dark:text-white"
                                                        >
                                                            {category}
                                                        </motion.div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
