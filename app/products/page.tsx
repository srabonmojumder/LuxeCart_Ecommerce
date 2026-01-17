'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, X, Package, RotateCcw, Check, ArrowRight } from 'lucide-react';
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
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

    // Filter sidebar content - shared between desktop and mobile
    const FilterContent = () => (
        <div className="space-y-8 lg:space-y-12">
            {/* Categories Section */}
            <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 lg:mb-8">Collections</h4>
                <div className="flex flex-col gap-3 lg:gap-4">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`text-left text-sm font-black tracking-widest uppercase transition-all flex items-center justify-between group ${selectedCategory === cat ? 'text-primary' : 'text-gray-400 hover:text-primary'
                                }`}
                        >
                            {cat}
                            {selectedCategory === cat ? (
                                <motion.div layoutId="catActive" className="w-1.5 h-1.5 rounded-full bg-accent" />
                            ) : (
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range Section */}
            <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 lg:mb-8">Price Range</h4>
                <div className="space-y-4 lg:space-y-8">
                    <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between items-center px-4 lg:px-6 py-4 lg:py-5 bg-primary text-white rounded-2xl shadow-xl">
                        <span className="text-[10px] font-black tracking-widest uppercase opacity-60">Max Price</span>
                        <span className="text-xl lg:text-2xl font-black">${priceRange[1]}</span>
                    </div>
                </div>
            </div>

            {/* Quick Toggles */}
            <div className="space-y-4 lg:space-y-6">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 lg:mb-8">Refine</h4>
                <button
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className="flex items-center justify-between w-full group"
                >
                    <span className={`text-[10px] font-black tracking-widest uppercase transition-colors ${inStockOnly ? 'text-primary' : 'text-gray-400'}`}>In Stock Only</span>
                    <div className={`w-12 h-6 rounded-full transition-all duration-300 relative ${inStockOnly ? 'bg-primary' : 'bg-gray-100'}`}>
                        <motion.div
                            animate={{ x: inStockOnly ? 26 : 4 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                    </div>
                </button>
                <button
                    onClick={() => setOnSaleOnly(!onSaleOnly)}
                    className="flex items-center justify-between w-full group"
                >
                    <span className={`text-[10px] font-black tracking-widest uppercase transition-colors ${onSaleOnly ? 'text-primary' : 'text-gray-400'}`}>On Sale Items</span>
                    <div className={`w-12 h-6 rounded-full transition-all duration-300 relative ${onSaleOnly ? 'bg-accent' : 'bg-gray-100'}`}>
                        <motion.div
                            animate={{ x: onSaleOnly ? 26 : 4 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                    </div>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pb-28 md:pb-24">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 mb-6 md:mb-16 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-2xl"
                    >
                        <span className="inline-block text-accent font-black tracking-[0.3em] text-[10px] md:text-xs uppercase mb-2 md:mb-6">
                            Premium Collection
                        </span>
                        <h1 className="text-3xl md:text-7xl font-black text-primary dark:text-white leading-tight tracking-tighter">
                            All Products
                        </h1>
                        <p className="text-base md:text-lg text-secondary dark:text-gray-400 mt-3 md:mt-6 max-w-lg font-medium leading-relaxed hidden md:block">
                            Discover our full range of curated minimalist home accessories, designed to bring harmony to your living space.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-primary/5 dark:bg-slate-900 px-4 md:px-8 py-3 md:py-5 rounded-xl md:rounded-2xl border border-primary/5 dark:border-slate-800 flex items-center gap-3 md:gap-5 shadow-sm"
                    >
                        <div className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
                            <Package className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                        </div>
                        <div>
                            <span className="block text-[9px] md:text-[10px] font-black tracking-widest text-gray-400 uppercase">Total</span>
                            <span className="text-lg md:text-xl font-black text-primary dark:text-white uppercase">
                                {filteredProducts.length} Items
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Quick Filters - Horizontal Strip */}
            <section className="border-y border-primary/5 dark:border-slate-800 mb-4 md:mb-12 py-3 md:py-5 bg-primary/5 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <QuickFilters
                        onFilterChange={handleQuickFilter}
                        activeFilter={activeQuickFilter}
                    />
                </div>
            </section>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Mobile Filter & Sort Bar */}
                <div className="lg:hidden flex items-center gap-2.5 mb-5">
                    <button
                        onClick={() => setMobileFiltersOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-primary text-white rounded-lg font-bold text-sm touch-manipulation active:scale-[0.98] transition-transform"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {activeFiltersCount > 0 && (
                            <span className="bg-white text-primary text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>
                    <div className="flex-1 relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full appearance-none px-3 py-2.5 bg-gray-100 rounded-lg font-bold text-sm text-primary pr-9 touch-manipulation"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low</option>
                            <option value="price-high">Price: High</option>
                            <option value="rating">Top Rated</option>
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
                    {/* Filters Sidebar - Desktop Only */}
                    <aside className="hidden lg:block w-72 flex-shrink-0 space-y-16">
                        <div>
                            <div className="flex items-center justify-between mb-10 pb-4 border-b-2 border-primary dark:border-white">
                                <h3 className="text-sm font-black tracking-[0.2em] text-primary dark:text-white uppercase flex items-center gap-3">
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filter
                                </h3>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={resetFilters}
                                        className="text-[10px] font-black tracking-widest text-accent hover:text-primary transition-colors uppercase"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Products Section */}
                    <div className="flex-1">
                        {/* Sort Bar - Desktop Only */}
                        <div className="hidden lg:flex justify-between items-center mb-16 gap-10 bg-white dark:bg-slate-950">
                            <div className="w-full flex justify-start gap-10 border-b border-primary/5 dark:border-slate-800 pb-6">
                                {['featured', 'price-low', 'price-high', 'rating'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSortBy(s)}
                                        className={`text-[10px] font-black tracking-[0.3em] uppercase transition-all relative pb-4 whitespace-nowrap ${sortBy === s ? 'text-primary dark:text-white' : 'text-gray-400 hover:text-primary'
                                            }`}
                                    >
                                        {s.replace('-', ' ')}
                                        {sortBy === s && (
                                            <motion.div layoutId="sortActive" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary dark:bg-white" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Grid */}
                        {isLoading ? (
                            <ProductGridSkeleton count={12} />
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-5 md:gap-x-6 md:gap-y-12">
                                <AnimatePresence mode="popLayout">
                                    {filteredProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="text-center py-12 md:py-32 space-y-6 md:space-y-10 bg-primary/5 dark:bg-slate-900 rounded-2xl md:rounded-[3rem]">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto shadow-xl">
                                    <Package className="w-7 h-7 md:w-9 md:h-9 text-gray-300 dark:text-gray-600" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl md:text-3xl font-black text-primary dark:text-white tracking-tighter">No items found</h3>
                                    <p className="text-secondary dark:text-gray-400 text-sm md:text-base max-w-xs mx-auto font-medium px-4">Try adjusting your filters to discover something new.</p>
                                </div>
                                <button
                                    onClick={resetFilters}
                                    className="px-6 py-3 bg-primary text-white dark:bg-accent rounded-xl font-bold text-sm tracking-wide"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {mobileFiltersOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileFiltersOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                            className="lg:hidden fixed inset-y-0 left-0 w-[80%] max-w-xs bg-white z-50 flex flex-col shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                                <h2 className="text-base font-black text-primary uppercase tracking-wider flex items-center gap-2">
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filters
                                </h2>
                                <button
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Filter Content */}
                            <div className="flex-1 overflow-y-auto px-5 py-5">
                                <FilterContent />
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-4 border-t border-gray-100 space-y-2.5 pb-safe">
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={resetFilters}
                                        className="w-full py-2.5 text-center text-accent font-bold text-sm uppercase tracking-wider active:opacity-70"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                                <button
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="w-full py-3.5 bg-primary text-white font-bold text-sm uppercase tracking-wider rounded-xl active:scale-[0.98] transition-transform"
                                >
                                    Show {filteredProducts.length} Results
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
