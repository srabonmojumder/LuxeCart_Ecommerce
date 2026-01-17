'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, Heart, Flame, Grid3X3 } from 'lucide-react';
import { useRef } from 'react';

interface QuickFilter {
    id: string;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    gradient: string;
    bgLight: string;
    bgDark: string;
}

interface QuickFiltersProps {
    onFilterChange?: (filterId: string) => void;
    activeFilter?: string;
}

export default function QuickFilters({ onFilterChange, activeFilter }: QuickFiltersProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const filters: QuickFilter[] = [
        {
            id: 'all',
            label: 'All Products',
            shortLabel: 'All',
            icon: <Grid3X3 className="w-3.5 h-3.5 md:w-4 md:h-4" />,
            gradient: 'from-violet-600 via-purple-600 to-indigo-600',
            bgLight: 'bg-violet-50',
            bgDark: 'dark:bg-violet-950/40',
        },
        {
            id: 'sale',
            label: 'Hot Deals',
            shortLabel: 'Deals',
            icon: <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />,
            gradient: 'from-red-500 via-orange-500 to-amber-500',
            bgLight: 'bg-red-50',
            bgDark: 'dark:bg-red-950/40',
        },
        {
            id: 'trending',
            label: 'Trending',
            shortLabel: 'Trending',
            icon: <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />,
            gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
            bgLight: 'bg-cyan-50',
            bgDark: 'dark:bg-cyan-950/40',
        },
        {
            id: 'new',
            label: 'New Arrivals',
            shortLabel: 'New',
            icon: <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />,
            gradient: 'from-emerald-500 via-green-500 to-teal-500',
            bgLight: 'bg-emerald-50',
            bgDark: 'dark:bg-emerald-950/40',
        },
        {
            id: 'popular',
            label: 'Best Sellers',
            shortLabel: 'Popular',
            icon: <Flame className="w-3.5 h-3.5 md:w-4 md:h-4" />,
            gradient: 'from-amber-500 via-yellow-500 to-orange-500',
            bgLight: 'bg-amber-50',
            bgDark: 'dark:bg-amber-950/40',
        },
        {
            id: 'wishlist',
            label: 'My Wishlist',
            shortLabel: 'Wishlist',
            icon: <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" />,
            gradient: 'from-pink-500 via-rose-500 to-red-500',
            bgLight: 'bg-pink-50',
            bgDark: 'dark:bg-pink-950/40',
        },
    ];

    const handleFilterClick = (filterId: string) => {
        onFilterChange?.(filterId);
    };

    return (
        <div className="relative">
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

            {/* Mobile: Horizontal scroll */}
            <div className="md:hidden relative -mx-4">
                {/* Left fade */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-primary/5 to-transparent z-10 pointer-events-none" />
                {/* Right fade */}
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-primary/5 to-transparent z-10 pointer-events-none" />
                <div
                    ref={scrollRef}
                    className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide py-1 px-4"
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, type: "spring", stiffness: 400 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
                relative flex items-center gap-1.5 md:gap-2 px-3.5 md:px-4 py-2.5 md:py-2.5 rounded-xl md:rounded-2xl
                font-semibold text-xs md:text-sm whitespace-nowrap flex-shrink-0
                transition-all duration-200 overflow-hidden touch-manipulation
                ${isActive
                    ? 'text-white shadow-lg'
                    : `${filter.bgLight} ${filter.bgDark} text-gray-700 dark:text-gray-200 shadow-sm`
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

            {/* Content */}
            <span className="relative z-10 flex items-center gap-1.5 md:gap-2">
                {/* Icon */}
                <span className={`
                    flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-lg
                    ${isActive
                        ? 'bg-white/20'
                        : `bg-gradient-to-br ${filter.gradient} text-white`
                    }
                    transition-all duration-200
                `}>
                    {filter.icon}
                </span>

                {/* Label */}
                <span className="relative">
                    {showFullLabel ? filter.label : filter.shortLabel}
                </span>
            </span>
        </motion.button>
    );
}
