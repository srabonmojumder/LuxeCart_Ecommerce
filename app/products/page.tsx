'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import QuickFilters from '@/components/ui/QuickFilters';
import ProductGridSkeleton from '@/components/product/ProductGridSkeleton';
import { products } from '@/data/products';

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
    const [sortBy, setSortBy] = useState('featured');
    const [showFilters, setShowFilters] = useState(false);
    const [activeQuickFilter, setActiveQuickFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(false);

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    // Quick filter handler
    const handleQuickFilter = (filterId: string) => {
        setActiveQuickFilter(filterId);
        setIsLoading(true);

        // Simulate loading
        setTimeout(() => setIsLoading(false), 500);
    };

    // Filter products
    let filteredProducts = products.filter(product => {
        // Quick filters
        if (activeQuickFilter === 'sale' && !product.discount) return false;
        if (activeQuickFilter === 'trending' && product.rating < 4.7) return false;
        if (activeQuickFilter === 'new' && product.id % 3 !== 0) return false; // Deterministic
        if (activeQuickFilter === 'popular' && product.reviews < 300) return false;

        // Category filter
        if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;

        // Price filter
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

        return true;
    });

    // Sort products
    filteredProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });

    return (
        <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        All Products
                    </motion.h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Showing {filteredProducts.length} products
                    </p>
                </div>

                {/* Quick Filters - Mobile Optimized */}
                <QuickFilters
                    onFilterChange={handleQuickFilter}
                    activeFilter={activeQuickFilter}
                />

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    {/* Mobile Filter Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                    >
                        <Filter className="w-5 h-5" />
                        Filters
                    </button>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <label className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                            Sort by:
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input-field py-2"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name: A to Z</option>
                            <option value="rating">Rating: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar Filters */}
                    <motion.aside
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className={`${showFilters ? 'fixed inset-0 z-50 bg-white dark:bg-gray-800 p-6' : 'hidden'
                            } md:block md:relative md:w-64 flex-shrink-0`}
                    >
                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setShowFilters(false)}
                            className="md:hidden absolute top-4 right-4"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5" />
                                Filters
                            </h3>

                            {/* Category Filter */}
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Category</h4>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <label key={category} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={category}
                                                checked={selectedCategory === category}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-gray-700 dark:text-gray-300">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Price Range</h4>
                                <div className="space-y-4">
                                    <div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="2000"
                                            step="50"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            className="w-full accent-primary-600"
                                        />
                                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                                            <span>${priceRange[0]}</span>
                                            <span>${priceRange[1]}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* In Stock Filter */}
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">In Stock Only</span>
                                </label>
                            </div>

                            {/* On Sale Filter */}
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">On Sale</span>
                                </label>
                            </div>

                            {/* Reset Filters */}
                            <button
                                onClick={() => {
                                    setSelectedCategory('All');
                                    setPriceRange([0, 2000]);
                                }}
                                className="w-full py-2 text-primary-600 dark:text-primary-400 font-medium hover:underline"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </motion.aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {isLoading ? (
                            <ProductGridSkeleton count={12} />
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-2xl text-gray-500 dark:text-gray-400">No products found</p>
                                <p className="text-gray-400 dark:text-gray-500 mt-2">
                                    Try adjusting your filters
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
