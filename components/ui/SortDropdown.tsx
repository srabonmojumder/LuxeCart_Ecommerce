'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    Sparkles,
    TrendingDown,
    TrendingUp,
    Type,
    Star,
    Check
} from 'lucide-react';

interface SortOption {
    value: string;
    label: string;
    icon: React.ReactNode;
    gradient: string;
}

interface SortDropdownProps {
    value: string;
    onChange: (value: string) => void;
}

const sortOptions: SortOption[] = [
    {
        value: 'featured',
        label: 'Featured',
        icon: <Sparkles className="w-4 h-4" />,
        gradient: 'from-violet-500 to-purple-600',
    },
    {
        value: 'price-low',
        label: 'Price: Low to High',
        icon: <TrendingUp className="w-4 h-4" />,
        gradient: 'from-emerald-500 to-teal-600',
    },
    {
        value: 'price-high',
        label: 'Price: High to Low',
        icon: <TrendingDown className="w-4 h-4" />,
        gradient: 'from-rose-500 to-pink-600',
    },
    {
        value: 'name',
        label: 'Name: A to Z',
        icon: <Type className="w-4 h-4" />,
        gradient: 'from-blue-500 to-cyan-600',
    },
    {
        value: 'rating',
        label: 'Top Rated',
        icon: <Star className="w-4 h-4" />,
        gradient: 'from-amber-500 to-orange-600',
    },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = sortOptions.find(opt => opt.value === value) || sortOptions[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative z-40">
            {/* Trigger Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.98 }}
                className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-2xl
                    bg-white dark:bg-gray-800
                    border-2 border-gray-200 dark:border-gray-700
                    hover:border-purple-400 dark:hover:border-purple-500
                    shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50
                    transition-all duration-300 min-w-[220px]
                    ${isOpen ? 'border-purple-500 dark:border-purple-400 ring-4 ring-purple-500/20' : ''}
                `}
            >
                {/* Animated Icon Container */}
                <motion.div
                    className={`
                        flex items-center justify-center w-9 h-9 rounded-xl
                        bg-gradient-to-br ${selectedOption.gradient}
                        shadow-lg
                    `}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <span className="text-white">{selectedOption.icon}</span>
                </motion.div>

                {/* Label */}
                <div className="flex flex-col items-start flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">
                        Sort by
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedOption.label}
                    </span>
                </div>

                {/* Chevron */}
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>

                {/* Animated border glow */}
                {isOpen && (
                    <motion.div
                        layoutId="glow"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-gray-300/50 dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                        {/* Decorative gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />

                        <div className="space-y-1 pt-1">
                            {sortOptions.map((option, index) => (
                                <motion.button
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ x: 4 }}
                                    className={`
                                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                                        transition-all duration-200
                                        ${value === option.value
                                            ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                        }
                                    `}
                                >
                                    {/* Icon */}
                                    <div className={`
                                        flex items-center justify-center w-8 h-8 rounded-lg
                                        ${value === option.value
                                            ? `bg-gradient-to-br ${option.gradient} text-white shadow-md`
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                        }
                                        transition-all duration-200
                                    `}>
                                        {option.icon}
                                    </div>

                                    {/* Label */}
                                    <span className={`
                                        flex-1 text-left text-sm font-medium
                                        ${value === option.value
                                            ? 'text-gray-900 dark:text-white'
                                            : 'text-gray-600 dark:text-gray-300'
                                        }
                                    `}>
                                        {option.label}
                                    </span>

                                    {/* Checkmark */}
                                    {value === option.value && (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            className={`
                                                flex items-center justify-center w-6 h-6 rounded-full
                                                bg-gradient-to-br ${option.gradient} text-white
                                            `}
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
