'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface VariantSelectorProps {
    type: 'size' | 'color';
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
}

export default function VariantSelector({ type, options, selected, onSelect }: VariantSelectorProps) {
    if (type === 'size') {
        return (
            <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                    {options.map((size) => (
                        <motion.button
                            key={size}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelect(size)}
                            className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${selected === size
                                    ? 'border-purple-600 bg-purple-600 text-white'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-400'
                                }`}
                        >
                            {size}
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Select Color
            </label>
            <div className="flex flex-wrap gap-3">
                {options.map((color) => {
                    const colorMap: { [key: string]: string } = {
                        'Black': 'bg-black',
                        'White': 'bg-white border-gray-300',
                        'Red': 'bg-red-500',
                        'Blue': 'bg-blue-500',
                        'Green': 'bg-green-500',
                        'Yellow': 'bg-yellow-400',
                        'Purple': 'bg-purple-500',
                        'Pink': 'bg-pink-500',
                        'Gray': 'bg-gray-500',
                        'Brown': 'bg-amber-700',
                    };

                    return (
                        <motion.button
                            key={color}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelect(color)}
                            className={`relative w-10 h-10 rounded-full ${colorMap[color] || 'bg-gray-400'} ${selected === color
                                    ? 'ring-2 ring-purple-600 ring-offset-2 dark:ring-offset-gray-800'
                                    : 'hover:ring-2 hover:ring-gray-300'
                                }`}
                            title={color}
                        >
                            {selected === color && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <Check className={`w-5 h-5 ${color === 'White' ? 'text-gray-800' : 'text-white'}`} />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Selected: <span className="font-medium">{selected}</span>
            </p>
        </div>
    );
}
