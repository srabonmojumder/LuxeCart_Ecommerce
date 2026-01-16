'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, X, Package, RotateCcw, Check } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import QuickFilters from '@/components/ui/QuickFilters';
import SortDropdown from '@/components/ui/SortDropdown';
import ProductGridSkeleton from '@/components/product/ProductGridSkeleton';
import { products } from '@/data/products';

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
    const [sortBy, setSortBy] = useState('featured');
    const [showFilters, setShowFilters] = useState(false);
    const [activeQuickFilter, setActiveQuickFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [onSaleOnly, setOnSaleOnly] = useState(false);

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const handleQuickFilter = (filterId: string) => {
        setActiveQuickFilter(filterId);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
    };

    const resetFilters = () => {
        setSelectedCategory('All');
        setPriceRange([0, 2000]);
        setInStockOnly(false);
        setOnSaleOnly(false);
    };

    // Filter products
    let filteredProducts = products.filter(product => {
        if (activeQuickFilter === 'sale' && !product.discount) return false;
        if (activeQuickFilter === 'trending' && product.rating < 4.7) return false;
        if (activeQuickFilter === 'new' && product.id % 3 !== 0) return false;
        if (activeQuickFilter === 'popular' && product.reviews < 300) return false;
        if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
        if (onSaleOnly && !product.discount) return false;
        return true;
    });

    // Sort products
    filteredProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'name': return a.name.localeCompare(b.name);
            case 'rating': return b.rating - a.rating;
            default: return 0;
        }
    });

    const activeFiltersCount = [
        selectedCategory !== 'All',
        priceRange[1] !== 2000,
        inStockOnly,
        onSaleOnly
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
            {/* Hero Header */}
            <div className="relative pt-20 sm:pt-24 pb-4 sm:pb-8 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-blue-500/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-4 sm:mb-8"
                    >
                        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent mb-2 sm:mb-4">
                            All Products
                        </h1>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 dark:border-gray-700/50"
                        >
                            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                {filteredProducts.length} products found
                            </span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 pb-16 sm:pb-20">
                {/* Quick Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <QuickFilters
                        onFilterChange={handleQuickFilter}
                        activeFilter={activeQuickFilter}
                    />
                </motion.div>

                {/* Controls Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-8"
                >
                    {/* Filter Toggle Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowFilters(!showFilters)}
                        className={`
                            flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base
                            transition-all duration-300 shadow-lg
                            ${showFilters
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                            }
                        `}
                    >
                        <div className={`
                            w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center
                            ${showFilters
                                ? 'bg-white/20'
                                : 'bg-gradient-to-br from-purple-500 to-pink-500'
                            }
                        `}>
                            <Filter className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${showFilters ? 'text-white' : 'text-white'}`} />
                        </div>
                        <span className="hidden xs:inline">Filters</span>
                        {activeFiltersCount > 0 && (
                            <span className={`
                                w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[10px] sm:text-xs font-bold flex items-center justify-center
                                ${showFilters
                                    ? 'bg-white text-purple-600'
                                    : 'bg-purple-500 text-white'
                                }
                            `}>
                                {activeFiltersCount}
                            </span>
                        )}
                    </motion.button>

                    {/* Sort Dropdown */}
                    <SortDropdown value={sortBy} onChange={setSortBy} />
                </motion.div>

                {/* Main Layout */}
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
                    {/* Sidebar Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <>
                                {/* Mobile Overlay */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowFilters(false)}
                                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                                />

                                {/* Filter Panel */}
                                <motion.aside
                                    initial={{ opacity: 0, x: -100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className={`
                                        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
                                        w-80 lg:w-72 flex-shrink-0
                                        bg-white dark:bg-gray-800 lg:bg-white/70 lg:dark:bg-gray-800/70
                                        lg:backdrop-blur-xl lg:rounded-3xl
                                        lg:border lg:border-gray-200/50 lg:dark:border-gray-700/50
                                        lg:shadow-xl overflow-hidden
                                    `}
                                >
                                    {/* Filter Header */}
                                    <div className="sticky top-0 bg-white dark:bg-gray-800 lg:bg-transparent p-5 border-b border-gray-200 dark:border-gray-700 lg:border-gray-200/50 lg:dark:border-gray-700/50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                                    <SlidersHorizontal className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
                                                    <p className="text-xs text-gray-500">{activeFiltersCount} active</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowFilters(false)}
                                                className="lg:hidden w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Filter Content */}
                                    <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-none">
                                        {/* Category Filter */}
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-purple-500" />
                                                Category
                                            </h4>
                                            <div className="space-y-2">
                                                {categories.map((category) => (
                                                    <motion.label
                                                        key={category}
                                                        whileHover={{ x: 4 }}
                                                        className={`
                                                            flex items-center gap-3 p-3 rounded-xl cursor-pointer
                                                            transition-all duration-200
                                                            ${selectedCategory === category
                                                                ? 'bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-500'
                                                                : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                                                            }
                                                        `}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="category"
                                                            value={category}
                                                            checked={selectedCategory === category}
                                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`
                                                            w-5 h-5 rounded-full border-2 flex items-center justify-center
                                                            ${selectedCategory === category
                                                                ? 'border-purple-500 bg-purple-500'
                                                                : 'border-gray-300 dark:border-gray-500'
                                                            }
                                                        `}>
                                                            {selectedCategory === category && (
                                                                <Check className="w-3 h-3 text-white" />
                                                            )}
                                                        </div>
                                                        <span className={`
                                                            text-sm font-medium
                                                            ${selectedCategory === category
                                                                ? 'text-purple-700 dark:text-purple-300'
                                                                : 'text-gray-700 dark:text-gray-300'
                                                            }
                                                        `}>
                                                            {category}
                                                        </span>
                                                    </motion.label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price Range */}
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                Price Range
                                            </h4>
                                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="2000"
                                                    step="50"
                                                    value={priceRange[1]}
                                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                                />
                                                <div className="flex justify-between mt-3">
                                                    <span className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
                                                        ${priceRange[0]}
                                                    </span>
                                                    <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-semibold text-white shadow-sm">
                                                        ${priceRange[1]}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Toggle Filters */}
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                                Quick Options
                                            </h4>

                                            {/* In Stock Toggle */}
                                            <motion.label
                                                whileHover={{ x: 4 }}
                                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer"
                                            >
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">In Stock Only</span>
                                                <div className={`
                                                    relative w-12 h-7 rounded-full transition-colors duration-200
                                                    ${inStockOnly ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}
                                                `}>
                                                    <input
                                                        type="checkbox"
                                                        checked={inStockOnly}
                                                        onChange={(e) => setInStockOnly(e.target.checked)}
                                                        className="sr-only"
                                                    />
                                                    <motion.div
                                                        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                                                        animate={{ left: inStockOnly ? '26px' : '4px' }}
                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    />
                                                </div>
                                            </motion.label>

                                            {/* On Sale Toggle */}
                                            <motion.label
                                                whileHover={{ x: 4 }}
                                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer"
                                            >
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">On Sale</span>
                                                <div className={`
                                                    relative w-12 h-7 rounded-full transition-colors duration-200
                                                    ${onSaleOnly ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}
                                                `}>
                                                    <input
                                                        type="checkbox"
                                                        checked={onSaleOnly}
                                                        onChange={(e) => setOnSaleOnly(e.target.checked)}
                                                        className="sr-only"
                                                    />
                                                    <motion.div
                                                        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                                                        animate={{ left: onSaleOnly ? '26px' : '4px' }}
                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    />
                                                </div>
                                            </motion.label>
                                        </div>
                                    </div>

                                    {/* Filter Footer */}
                                    <div className="sticky bottom-0 p-5 bg-white dark:bg-gray-800 lg:bg-white/90 lg:dark:bg-gray-800/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={resetFilters}
                                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Reset All Filters
                                        </motion.button>
                                    </div>
                                </motion.aside>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Products Grid */}
                    <motion.div
                        layout
                        className="flex-1 min-w-0"
                    >
                        {isLoading ? (
                            <ProductGridSkeleton count={12} />
                        ) : filteredProducts.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4"
                            >
                                <AnimatePresence mode="popLayout">
                                    {filteredProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: index * 0.03 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center py-12 sm:py-20 text-center px-4"
                            >
                                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 sm:mb-6">
                                    <Package className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    No products found
                                </h3>
                                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-md">
                                    Try adjusting your filters or search criteria to find what you're looking for.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={resetFilters}
                                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg text-sm sm:text-base"
                                >
                                    Clear All Filters
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
