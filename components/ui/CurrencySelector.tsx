'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
    { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
    { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 149.50 },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.35 },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.52 },
    { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', rate: 110 },
];

export default function CurrencySelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(currencies[0]);

    const handleSelect = (currency: typeof currencies[0]) => {
        setSelected(currency);
        setIsOpen(false);
        // In a real app, you'd update global currency state here
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <span className="font-medium text-sm">{selected.code}</span>
                <span className="text-gray-600 dark:text-gray-400">{selected.symbol}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                    >
                        <div className="p-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2">
                                Select Currency
                            </p>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {currencies.map((currency) => (
                                <button
                                    key={currency.code}
                                    onClick={() => handleSelect(currency)}
                                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors ${selected.code === currency.code
                                            ? 'bg-purple-100 dark:bg-purple-900/30'
                                            : ''
                                        }`}
                                >
                                    <div className="flex flex-col items-start">
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {currency.code}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {currency.name}
                                        </span>
                                    </div>
                                    <span className="text-lg font-bold text-purple-600">
                                        {currency.symbol}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
}
