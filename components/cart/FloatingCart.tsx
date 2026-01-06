'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function FloatingCart() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const cart = useStore((state) => state.cart);
    const removeFromCart = useStore((state) => state.removeFromCart);
    const updateQuantity = useStore((state) => state.updateQuantity);
    const getTotalPrice = useStore((state) => state.getTotalPrice);
    const getTotalItems = useStore((state) => state.getTotalItems);

    useEffect(() => {
        setMounted(true);
    }, []);

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    if (!mounted || totalItems === 0) return null;

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all"
            >
                <ShoppingCart className="w-6 h-6" />
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-[40px] -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white"
                >
                    {totalItems}
                </motion.span>
            </motion.button>

            {/* Mini Cart Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        />

                        {/* Cart Panel */}
                        <motion.div
                            initial={{ x: 400 }}
                            animate={{ x: 0 }}
                            exit={{ x: 400 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-pink-600">
                                <div className="flex justify-between items-center text-white">
                                    <h3 className="text-xl font-bold">Shopping Cart ({totalItems})</h3>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {cart.map((item) => {
                                    const price = item.discount
                                        ? item.price * (1 - item.discount / 100)
                                        : item.price;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                        >
                                            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                                    {item.name}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {item.category}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-sm font-medium w-6 text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-purple-600">
                                                            ${(price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Total:
                                    </span>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        ${totalPrice.toFixed(2)}
                                    </span>
                                </div>

                                <Link href="/cart" onClick={() => setIsOpen(false)}>
                                    <button className="w-full btn-primary flex items-center justify-center gap-2 mb-3">
                                        View Cart
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </Link>

                                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                                    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all">
                                        Checkout Now
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
