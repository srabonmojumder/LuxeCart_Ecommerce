'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ColorSelectorProps {
    colors: string[];
    selectedColor: string;
    onColorSelect: (color: string) => void;
}

export function ColorSelector({ colors, selectedColor, onColorSelect }: ColorSelectorProps) {
    // Get color name from hex (simple mapping for common colors)
    const getColorName = (hex: string): string => {
        const colorMap: { [key: string]: string } = {
            '#000000': 'Black',
            '#FFFFFF': 'White',
            '#FF0000': 'Red',
            '#0000FF': 'Blue',
            '#00FF00': 'Green',
            '#FFD700': 'Gold',
            '#C0C0C0': 'Silver',
            '#808080': 'Gray',
            '#4A5568': 'Charcoal',
            '#8B4513': 'Brown',
            '#D2691E': 'Tan',
            '#FF69B4': 'Pink',
            '#9370DB': 'Purple',
            '#20B2AA': 'Teal',
            '#FF6B6B': 'Coral',
            '#87CEEB': 'Sky Blue',
            '#228B22': 'Forest Green',
            '#8B0000': 'Dark Red',
            '#F5DEB3': 'Wheat',
            '#F5F5DC': 'Beige',
            '#FFC0CB': 'Light Pink',
        };
        return colorMap[hex.toUpperCase()] || 'Custom';
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Color: <span className="text-gray-900 dark:text-white">{getColorName(selectedColor)}</span>
                </span>
            </div>
            <div className="flex flex-wrap gap-3">
                {colors.map((color) => {
                    const isSelected = color === selectedColor;
                    const isLight = ['#FFFFFF', '#F5F5DC', '#FFC0CB', '#F5DEB3', '#87CEEB', '#FFD700', '#C0C0C0'].includes(color.toUpperCase());

                    return (
                        <motion.button
                            key={color}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onColorSelect(color)}
                            className={`
                                relative w-10 h-10 rounded-full transition-all duration-300
                                ${isSelected ? 'ring-2 ring-offset-2 ring-accent-500 dark:ring-offset-gray-800' : 'ring-1 ring-gray-200 dark:ring-gray-600 hover:ring-2 hover:ring-accent-300'}
                            `}
                            style={{ backgroundColor: color }}
                            title={getColorName(color)}
                        >
                            {isSelected && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`absolute inset-0 flex items-center justify-center ${isLight ? 'text-gray-800' : 'text-white'}`}
                                >
                                    <Check className="w-5 h-5" strokeWidth={3} />
                                </motion.span>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

interface SizeSelectorProps {
    sizes: string[];
    selectedSize: string;
    onSizeSelect: (size: string) => void;
    outOfStockSizes?: string[];
}

export function SizeSelector({ sizes, selectedSize, onSizeSelect, outOfStockSizes = [] }: SizeSelectorProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Size: <span className="text-gray-900 dark:text-white">{selectedSize || 'Select a size'}</span>
                </span>
                <button className="text-sm text-accent-600 hover:text-accent-700 font-medium">
                    Size Guide
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                    const isSelected = size === selectedSize;
                    const isOutOfStock = outOfStockSizes.includes(size);

                    return (
                        <motion.button
                            key={size}
                            whileHover={!isOutOfStock ? { scale: 1.05 } : {}}
                            whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
                            onClick={() => !isOutOfStock && onSizeSelect(size)}
                            disabled={isOutOfStock}
                            className={`
                                relative min-w-[3rem] px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300
                                ${isSelected
                                    ? 'bg-gradient-to-r from-accent-600 to-pink-600 text-white shadow-lg'
                                    : isOutOfStock
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed line-through'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                                }
                            `}
                        >
                            {size}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    max?: number;
    min?: number;
}

export function QuantitySelector({ quantity, onQuantityChange, max = 99, min = 1 }: QuantitySelectorProps) {
    const decrease = () => {
        if (quantity > min) {
            onQuantityChange(quantity - 1);
        }
    };

    const increase = () => {
        if (quantity < max) {
            onQuantityChange(quantity + 1);
        }
    };

    return (
        <div className="space-y-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity
            </span>
            <div className="flex items-center">
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={decrease}
                        disabled={quantity <= min}
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <span className="text-xl font-medium">−</span>
                    </motion.button>

                    <motion.span
                        key={quantity}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-12 text-center text-lg font-semibold text-gray-900 dark:text-white"
                    >
                        {quantity}
                    </motion.span>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={increase}
                        disabled={quantity >= max}
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <span className="text-xl font-medium">+</span>
                    </motion.button>
                </div>

                {max && (
                    <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                        {max} available
                    </span>
                )}
            </div>
        </div>
    );
}
