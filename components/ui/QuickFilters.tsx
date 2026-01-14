'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, Heart, ChevronRight, Flame, Grid3X3 } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

interface QuickFilter {
    id: string;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    gradient: string;
    bgLight: string;
    bgDark: string;
    emoji: string;
}

interface QuickFiltersProps {
    onFilterChange?: (filterId: string) => void;
    activeFilter?: string;
}

export default function QuickFilters({ onFilterChange, activeFilter }: QuickFiltersProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const filters: QuickFilter[] = [
        {
            id: 'all',
            label: 'All Products',
            shortLabel: 'All',
            icon: <Grid3X3 className="w-4 h-4" />,
            gradient: 'from-violet-600 via-purple-600 to-indigo-600',
            bgLight: 'bg-violet-50',
            bgDark: 'dark:bg-violet-950/40',
            emoji: '🛍️',
        },
        {
            id: 'sale',
            label: 'Hot Deals',
            shortLabel: 'Deals',
            icon: <Zap className="w-4 h-4" />,
            gradient: 'from-red-500 via-orange-500 to-amber-500',
            bgLight: 'bg-red-50',
            bgDark: 'dark:bg-red-950/40',
            emoji: '🔥',
        },
        {
            id: 'trending',
            label: 'Trending Now',
            shortLabel: 'Trending',
            icon: <TrendingUp className="w-4 h-4" />,
            gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
            bgLight: 'bg-cyan-50',
            bgDark: 'dark:bg-cyan-950/40',
            emoji: '📈',
        },
        {
            id: 'new',
            label: 'New Arrivals',
            shortLabel: 'New',
            icon: <Sparkles className="w-4 h-4" />,
            gradient: 'from-emerald-500 via-green-500 to-teal-500',
            bgLight: 'bg-emerald-50',
            bgDark: 'dark:bg-emerald-950/40',
            emoji: '✨',
        },
        {
            id: 'popular',
            label: 'Best Sellers',
            shortLabel: 'Popular',
            icon: <Flame className="w-4 h-4" />,
            gradient: 'from-amber-500 via-yellow-500 to-orange-500',
            bgLight: 'bg-amber-50',
            bgDark: 'dark:bg-amber-950/40',
            emoji: '⭐',
        },
        {
            id: 'wishlist',
            label: 'My Wishlist',
            shortLabel: 'Wishlist',
            icon: <Heart className="w-4 h-4" />,
            gradient: 'from-pink-500 via-rose-500 to-red-500',
            bgLight: 'bg-pink-50',
            bgDark: 'dark:bg-pink-950/40',
            emoji: '💖',
        },
    ];

    // Check scroll position
    useEffect(() => {
        const checkScroll = () => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
            }
        };
        checkScroll();
        scrollRef.current?.addEventListener('scroll', checkScroll);
        return () => scrollRef.current?.removeEventListener('scroll', checkScroll);
    }, []);

    const handleFilterClick = (filterId: string) => {
        onFilterChange?.(filterId);
    };

    return (
        <div className="relative mb-6">
            {/* Main Container with Glass Effect */}
            <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-200/30 dark:shadow-gray-950/30 overflow-hidden">
                {/* Decorative Gradient Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-pink-500 via-orange-500 to-cyan-500 opacity-80" />

                {/* Filter Pills Container */}
                <div className="p-3 md:p-4">
                    {/* Desktop: Show all filters in a row */}
                    <div className="hidden md:flex items-center justify-center gap-3 flex-wrap">
                        {filters.map((filter, index) => (
                            <FilterPill
                                key={filter.id}
                                filter={filter}
                                isActive={activeFilter === filter.id}
                                onClick={() => handleFilterClick(filter.id)}
                                index={index}
                                showFullLabel
                            />
                        ))}
                    </div>

                    {/* Mobile: Horizontal scroll with gradient fade */}
                    <div className="md:hidden relative">
                        <div
                            ref={scrollRef}
                            className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-1 py-1 -mx-1"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {filters.map((filter, index) => (
                                <FilterPill
                                    key={filter.id}
                                    filter={filter}
                                    isActive={activeFilter === filter.id}
                                    onClick={() => handleFilterClick(filter.id)}
                                    index={index}
                                    showFullLabel={false}
                                />
                            ))}
                        </div>

                        {/* Scroll Indicator */}
                        <AnimatePresence>
                            {canScrollRight && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none flex items-center justify-end"
                                    style={{
                                        background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.9))',
                                    }}
                                >
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center mr-1"
                                    >
                                        <ChevronRight className="w-4 h-4 text-gray-500" />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Active Filter Indicator Bar */}
                <AnimatePresence>
                    {activeFilter && activeFilter !== 'all' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                        >
                            <div className="px-4 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Active filter:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {filters.find(f => f.id === activeFilter)?.label}
                                    </span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleFilterClick('all')}
                                    className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 transition-colors"
                                >
                                    Clear Filter
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Separate Filter Pill Component for better organization
interface FilterPillProps {
    filter: QuickFilter;
    isActive: boolean;
    onClick: () => void;
    index: number;
    showFullLabel: boolean;
}

function FilterPill({ filter, isActive, onClick, index, showFullLabel }: FilterPillProps) {
    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
                relative flex items-center gap-2 px-4 py-2.5 rounded-2xl
                font-semibold text-sm whitespace-nowrap flex-shrink-0
                transition-all duration-300 overflow-hidden
                ${isActive
                    ? 'text-white shadow-lg'
                    : `${filter.bgLight} ${filter.bgDark} text-gray-700 dark:text-gray-200 hover:shadow-md`
                }
            `}
        >
            {/* Active Gradient Background */}
            {isActive && (
                <motion.div
                    layoutId="activeFilterBg"
                    className={`absolute inset-0 bg-gradient-to-r ${filter.gradient}`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
            )}

            {/* Shine Effect for Active */}
            {isActive && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
                />
            )}

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
                {/* Icon with background for inactive state */}
                <span className={`
                    flex items-center justify-center w-7 h-7 rounded-xl
                    ${isActive
                        ? 'bg-white/20'
                        : `bg-gradient-to-br ${filter.gradient} text-white shadow-sm`
                    }
                    transition-all duration-200
                `}>
                    {filter.icon}
                </span>

                {/* Label */}
                <span className="relative">
                    {showFullLabel ? filter.label : filter.shortLabel}
                </span>

                {/* Active dot indicator */}
                {isActive && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-white/80 ml-1"
                    />
                )}
            </span>
        </motion.button>
    );
}
