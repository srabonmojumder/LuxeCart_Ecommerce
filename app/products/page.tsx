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
        <div className="min-h-screen bg-white pt-24 md:pt-32 pb-24">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 mb-20 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-2xl"
                    >
                        <span className="inline-block text-accent font-black tracking-[0.4em] text-xs uppercase mb-6">
                            Premium Collection
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-primary leading-tight tracking-tighter">
                            All Products
                        </h1>
                        <p className="text-lg md:text-xl text-secondary mt-8 max-w-lg font-medium leading-relaxed">
                            Discover our full range of curated minimalist home accessories, designed to bring harmony to your living space.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-primary/5 px-10 py-6 rounded-[2rem] border border-primary/5 flex items-center gap-6 shadow-sm"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                            <Package className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1">Total Collection</span>
                            <span className="text-2xl font-black text-primary uppercase">
                                {filteredProducts.length} Items
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Quick Filters - Horizontal Strip */}
            <section className="border-y border-primary/5 mb-16 py-6 bg-primary/5 overflow-x-auto no-scrollbar scroll-smooth">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-8">
                    <h3 className="text-[10px] font-black tracking-widest text-gray-400 uppercase whitespace-nowrap">Shop By:</h3>
                    <QuickFilters
                        onFilterChange={handleQuickFilter}
                        activeFilter={activeQuickFilter}
                    />
                </div>
            </section>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-20">

                    {/* Filters Sidebar - Clean and Bold */}
                    <aside className="w-full lg:w-72 flex-shrink-0 space-y-16">
                        <div className="lg:block">
                            <div className="flex items-center justify-between mb-10 pb-4 border-b-2 border-primary">
                                <h3 className="text-sm font-black tracking-[0.2em] text-primary uppercase flex items-center gap-3">
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

                            <div className="space-y-12">
                                {/* Categories Section */}
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Collections</h4>
                                    <div className="flex flex-col gap-4">
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
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Price Range</h4>
                                    <div className="space-y-8">
                                        <input
                                            type="range"
                                            min="0"
                                            max="2000"
                                            step="50"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-primary"
                                        />
                                        <div className="flex justify-between items-center px-6 py-5 bg-primary text-white rounded-2xl shadow-xl">
                                            <span className="text-[10px] font-black tracking-widest uppercase opacity-60">Max Price</span>
                                            <span className="text-2xl font-black">${priceRange[1]}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Toggles */}
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Refine</h4>
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
                        </div>
                    </aside>

                    {/* Products Section */}
                    <div className="flex-1">
                        {/* Sort & Info Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-10 bg-white">
                            <div className="w-full flex justify-center sm:justify-start gap-10 border-b border-primary/5 pb-6 overflow-x-auto no-scrollbar">
                                {['featured', 'price-low', 'price-high', 'rating'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSortBy(s)}
                                        className={`text-[10px] font-black tracking-[0.3em] uppercase transition-all relative pb-4 whitespace-nowrap ${sortBy === s ? 'text-primary' : 'text-gray-400 hover:text-primary'
                                            }`}
                                    >
                                        {s.replace('-', ' ')}
                                        {sortBy === s && (
                                            <motion.div layoutId="sortActive" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Grid */}
                        {isLoading ? (
                            <ProductGridSkeleton count={12} />
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-20">
                                <AnimatePresence mode="popLayout">
                                    {filteredProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.5, delay: index * 0.05 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="text-center py-40 space-y-12 bg-primary/5 rounded-[4rem]">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
                                    <Package className="w-10 h-10 text-gray-200" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-black text-primary tracking-tighter">No items found</h3>
                                    <p className="text-secondary text-lg max-w-sm mx-auto font-medium">Try adjusting your filters to discover something new.</p>
                                </div>
                                <button
                                    onClick={resetFilters}
                                    className="btn-primary"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
