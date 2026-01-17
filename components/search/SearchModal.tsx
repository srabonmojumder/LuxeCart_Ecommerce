'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Search as SearchIcon, TrendingUp, Clock, Tag, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import { Product } from '@/store/useStore';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const desktopInputRef = useRef<HTMLInputElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);

    const trendingSearches = ['Headphones', 'Smart Watch', 'Sneakers', 'Backpack'];
    const popularCategories = [
        { name: 'Electronics', icon: '📱' },
        { name: 'Fashion', icon: '👗' },
        { name: 'Sports', icon: '⚽' },
        { name: 'Home', icon: '🏠' }
    ];

    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            // Focus the appropriate input based on screen size
            const isMobile = window.innerWidth < 768;
            setTimeout(() => {
                if (isMobile && mobileInputRef.current) {
                    mobileInputRef.current.focus();
                } else if (desktopInputRef.current) {
                    desktopInputRef.current.focus();
                }
            }, 150);
        }
        if (!isOpen) {
            setQuery('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.length > 0) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered.slice(0, 8));
        } else {
            setResults([]);
        }
    }, [query]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

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

    const handleProductClick = () => {
        handleSearch(query);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Desktop Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="hidden md:block fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                            {/* Search Input */}
                            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                                <div className="relative">
                                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        ref={desktopInputRef}
                                        type="text"
                                        placeholder="Search products, categories..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && query) handleSearch(query);
                                            if (e.key === 'Escape') onClose();
                                        }}
                                        className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white text-base"
                                    />
                                    <button
                                        onClick={onClose}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="max-h-[60vh] overflow-y-auto">
                                {query.length > 0 ? (
                                    results.length > 0 ? (
                                        <div className="p-3">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">
                                                {results.length} Results
                                            </p>
                                            {results.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.id}`}
                                                    onClick={handleProductClick}
                                                >
                                                    <motion.div
                                                        whileHover={{ backgroundColor: 'rgba(104, 91, 199, 0.08)' }}
                                                        className="flex gap-4 p-3 rounded-2xl cursor-pointer transition-colors"
                                                    >
                                                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                                                            <Image
                                                                src={product.image}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                                                {product.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {product.category}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-sm font-bold text-accent">
                                                                    ${product.discount
                                                                        ? (product.price * (1 - product.discount / 100)).toFixed(2)
                                                                        : product.price.toFixed(2)}
                                                                </span>
                                                                {product.discount && (
                                                                    <span className="text-xs text-gray-400 line-through">
                                                                        ${product.price.toFixed(2)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-amber-400">
                                                            <Star className="w-4 h-4 fill-current" />
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{product.rating}</span>
                                                        </div>
                                                    </motion.div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-12 text-center">
                                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <SearchIcon className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400">No products found for "{query}"</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="p-5 space-y-6">
                                        {/* Recent Searches */}
                                        {recentSearches.length > 0 && (
                                            <div>
                                                <div className="flex items-center justify-between mb-3 px-1">
                                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        Recent Searches
                                                    </h3>
                                                    <button
                                                        onClick={clearRecentSearches}
                                                        className="text-xs text-accent font-medium hover:underline"
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {recentSearches.map((search, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setQuery(search)}
                                                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-accent/10 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium transition-colors"
                                                        >
                                                            {search}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Trending */}
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3 px-1">
                                                <TrendingUp className="w-4 h-4" />
                                                Trending Searches
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {trendingSearches.map((search, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setQuery(search)}
                                                        className="px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium hover:shadow-md transition-all"
                                                    >
                                                        {search}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Categories */}
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3 px-1">
                                                <Tag className="w-4 h-4" />
                                                Popular Categories
                                            </h3>
                                            <div className="grid grid-cols-4 gap-2">
                                                {popularCategories.map((category, index) => (
                                                    <Link
                                                        key={index}
                                                        href={`/products?category=${category.name.toLowerCase()}`}
                                                        onClick={onClose}
                                                        className="p-3 bg-gradient-to-br from-accent/5 to-accent/10 dark:from-accent/10 dark:to-accent/20 rounded-xl text-center font-medium text-gray-900 dark:text-white hover:shadow-md hover:scale-105 transition-all text-sm flex flex-col items-center gap-1.5"
                                                    >
                                                        <span className="text-xl">{category.icon}</span>
                                                        <span>{category.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Mobile Full Screen */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                        className="md:hidden fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col"
                    >
                        {/* Header with Search Input */}
                        <div className="flex-shrink-0 px-4 pt-3 pb-3 border-b border-gray-100 dark:border-gray-800 safe-area-top">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onClose}
                                    className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                                <div className="relative flex-1">
                                    <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        ref={mobileInputRef}
                                        type="text"
                                        placeholder="Search products..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="w-full pl-11 pr-10 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white text-base"
                                    />
                                    {query && (
                                        <button
                                            onClick={() => setQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-gray-300 dark:bg-gray-600 rounded-full"
                                        >
                                            <X className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Results/Suggestions */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 pb-safe">
                            {query ? (
                                results.length > 0 ? (
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                            {results.length} Results
                                        </p>
                                        <div className="space-y-2">
                                            {results.map((product, index) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.id}`}
                                                    onClick={handleProductClick}
                                                >
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
                                                    >
                                                        <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                                            <Image
                                                                src={product.image}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                                                {product.name}
                                                            </h4>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                                {product.category}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span className="font-bold text-accent text-sm">
                                                                ${product.discount
                                                                    ? (product.price * (1 - product.discount / 100)).toFixed(2)
                                                                    : product.price.toFixed(2)}
                                                            </span>
                                                            {product.discount && (
                                                                <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full font-medium">
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
                                    <div className="py-16 text-center">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <SearchIcon className="w-7 h-7 text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">No products found for "{query}"</p>
                                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Try a different search term</p>
                                    </div>
                                )
                            ) : (
                                <div className="space-y-5">
                                    {/* Recent Searches */}
                                    {recentSearches.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-2.5">
                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Recent
                                                </h3>
                                                <button
                                                    onClick={clearRecentSearches}
                                                    className="text-xs text-accent font-medium px-2 py-1 -mr-2 active:opacity-70"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {recentSearches.map((search, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setQuery(search)}
                                                        className="px-3.5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium active:scale-95 transition-transform"
                                                    >
                                                        {search}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Trending */}
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2.5">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            Trending
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {trendingSearches.map((search, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setQuery(search)}
                                                    className="px-3.5 py-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium active:scale-95 transition-transform border border-orange-100 dark:border-orange-800/30"
                                                >
                                                    {search}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Categories */}
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2.5">
                                            <Tag className="w-3.5 h-3.5" />
                                            Categories
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            {popularCategories.map((category, index) => (
                                                <Link
                                                    key={index}
                                                    href={`/products?category=${category.name.toLowerCase()}`}
                                                    onClick={onClose}
                                                >
                                                    <motion.div
                                                        whileTap={{ scale: 0.97 }}
                                                        className="p-4 bg-gradient-to-br from-accent/5 to-accent/10 dark:from-accent/10 dark:to-accent/20 rounded-xl text-center font-medium text-gray-900 dark:text-white flex flex-col items-center gap-1.5 border border-accent/10"
                                                    >
                                                        <span className="text-2xl">{category.icon}</span>
                                                        <span className="text-sm">{category.name}</span>
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
    );
}
