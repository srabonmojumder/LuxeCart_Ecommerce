'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, Heart, Star, ShoppingBag, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface QuickFilter {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    action: () => void;
}

interface QuickFiltersProps {
    onFilterChange?: (filterId: string) => void;
    activeFilter?: string;
}

export default function QuickFilters({ onFilterChange, activeFilter }: QuickFiltersProps) {
    const [expanded, setExpanded] = useState(false);

    const filters: QuickFilter[] = [
        {
            id: 'all',
            label: 'All',
            icon: <ShoppingBag className="w-4 h-4" />,
            color: 'from-purple-500 to-pink-500',
            action: () => onFilterChange?.('all'),
        },
        {
            id: 'sale',
            label: 'On Sale',
            icon: <Zap className="w-4 h-4" />,
            color: 'from-red-500 to-orange-500',
            action: () => onFilterChange?.('sale'),
        },
        {
            id: 'trending',
            label: 'Trending',
            icon: <TrendingUp className="w-4 h-4" />,
            color: 'from-blue-500 to-cyan-500',
            action: () => onFilterChange?.('trending'),
        },
        {
            id: 'new',
            label: 'New Arrivals',
            icon: <Sparkles className="w-4 h-4" />,
            color: 'from-green-500 to-emerald-500',
            action: () => onFilterChange?.('new'),
        },
        {
            id: 'popular',
            label: 'Most Popular',
            icon: <Star className="w-4 h-4" />,
            color: 'from-yellow-500 to-amber-500',
            action: () => onFilterChange?.('popular'),
        },
        {
            id: 'wishlist',
            label: 'Wishlist',
            icon: <Heart className="w-4 h-4" />,
            color: 'from-pink-500 to-rose-500',
            action: () => onFilterChange?.('wishlist'),
        },
    ];

    const visibleFilters = expanded ? filters : filters.slice(0, 4);

    return (
        <div className="sticky top-20 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
                {/* Mobile Optimized Filters */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                    <AnimatePresence mode="popLayout">
                        {visibleFilters.map((filter, index) => (
                            <motion.button
                                key={filter.id}
                                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={filter.action}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-full
                                    text-sm font-medium whitespace-nowrap
                                    transition-all duration-300 flex-shrink-0
                                    ${activeFilter === filter.id
                                        ? `bg-gradient-to-r ${filter.color} text-white shadow-lg scale-105`
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }
                                `}
                            >
                                <span className={activeFilter === filter.id ? 'text-white' : ''}>
                                    {filter.icon}
                                </span>
                                {filter.label}
                                {activeFilter === filter.id && (
                                    <motion.span
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="ml-1"
                                    >
                                        <X className="w-3 h-3" />
                                    </motion.span>
                                )}
                            </motion.button>
                        ))}
                    </AnimatePresence>

                    {/* Expand/Collapse Button */}
                    {filters.length > 4 && (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-1 px-3 py-2.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium flex-shrink-0"
                        >
                            <Filter className="w-4 h-4" />
                            {expanded ? 'Less' : 'More'}
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
}
