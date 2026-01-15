'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Truck, Shield, Tag, ChevronRight, Package } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

export default function CartPage() {
    const cart = useStore((state) => state.cart);
    const removeFromCart = useStore((state) => state.removeFromCart);
    const updateQuantity = useStore((state) => state.updateQuantity);
    const getTotalPrice = useStore((state) => state.getTotalPrice);
    const clearCart = useStore((state) => state.clearCart);

    const totalPrice = getTotalPrice();
    const shipping = totalPrice > 50 ? 0 : 10;
    const tax = totalPrice * 0.1;
    const finalTotal = totalPrice + shipping + tax;
    const freeShippingProgress = Math.min((totalPrice / 50) * 100, 100);

    const handleRemove = (id: number) => {
        removeFromCart(id);
        toast.success('Item removed from cart');
    };

    const handleClearCart = () => {
        clearCart();
        toast.success('Cart cleared');
    };

    // Empty Cart State
    if (cart.length === 0) {
        return (
            <div className="pt-[104px] md:pt-[112px] min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center pb-24 md:pb-0">
                <div className="text-center px-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="w-32 h-32 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center"
                    >
                        <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                        Your Cart is Empty
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                        Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
                    </p>
                    <Link href="/products">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Start Shopping
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-[104px] md:pt-[112px] min-h-screen bg-slate-50 dark:bg-slate-900 pb-48 md:pb-12">
            <div className="section-container py-6 md:py-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1"
                        >
                            Shopping Cart
                        </motion.h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>
                    <button
                        onClick={handleClearCart}
                        className="text-sm text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 self-start sm:self-center"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear Cart
                    </button>
                </div>

                {/* Free Shipping Progress */}
                {totalPrice < 50 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-xl p-4 mb-6 border border-teal-100 dark:border-teal-800"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Truck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Add <span className="font-bold text-teal-600 dark:text-teal-400">${(50 - totalPrice).toFixed(2)}</span> more for FREE shipping!
                            </span>
                        </div>
                        <div className="h-2 bg-white dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${freeShippingProgress}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                            />
                        </div>
                    </motion.div>
                )}

                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item, index) => {
                                const discountedPrice = item.discount
                                    ? item.price * (1 - item.discount / 100)
                                    : item.price;

                                return (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="card-minimal flex flex-col sm:flex-row gap-4"
                                    >
                                        {/* Product Image */}
                                        <Link href={`/products/${item.id}`} className="flex-shrink-0">
                                            <div className="relative w-full sm:w-28 h-28 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover hover:scale-105 transition-transform"
                                                />
                                                {item.discount && (
                                                    <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                        -{item.discount}%
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        {/* Product Info */}
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between gap-2 mb-1">
                                                <div className="flex-1">
                                                    <p className="text-xs text-teal-600 dark:text-teal-400 font-medium uppercase tracking-wide mb-0.5">
                                                        {item.category}
                                                    </p>
                                                    <Link
                                                        href={`/products/${item.id}`}
                                                        className="font-semibold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors line-clamp-2"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    className="text-slate-400 hover:text-rose-500 transition-colors p-1 -mt-1 -mr-1"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-end justify-between mt-auto pt-3">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-10 text-center font-semibold text-slate-900 dark:text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-slate-600 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                        ${(discountedPrice * item.quantity).toFixed(2)}
                                                    </div>
                                                    {item.discount && (
                                                        <div className="text-sm text-slate-400 line-through">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {/* Continue Shopping Link */}
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium hover:gap-3 transition-all mt-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary - Desktop */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="card sticky top-32"
                        >
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                                Order Summary
                            </h2>

                            {/* Promo Code */}
                            <div className="flex gap-2 mb-6">
                                <input
                                    type="text"
                                    placeholder="Promo code"
                                    className="input-field flex-1 text-sm"
                                />
                                <button className="btn-outline px-4 text-sm">
                                    Apply
                                </button>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        ${totalPrice.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Shipping</span>
                                    <span className={`font-medium ${shipping === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Tax (10%)</span>
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        ${tax.toFixed(2)}
                                    </span>
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                                            Total
                                        </span>
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                                            ${finalTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Link href="/checkout" className="block">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="btn-primary w-full flex items-center justify-center gap-2 mb-4"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>

                            {/* Trust Badges */}
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                    <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                    <span>Secure checkout with SSL encryption</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                    <Package className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                    <span>Easy 30-day returns policy</span>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                                    We accept
                                </p>
                                <div className="flex gap-2">
                                    {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((method) => (
                                        <div
                                            key={method}
                                            className="bg-slate-100 dark:bg-slate-700 px-2.5 py-1.5 rounded text-xs font-medium text-slate-600 dark:text-slate-300"
                                        >
                                            {method}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Checkout Bar */}
            <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <div className="px-4 py-4">
                    {/* Order Summary */}
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                                ${finalTotal.toFixed(2)}
                            </p>
                        </div>
                        <div className="text-right">
                            {shipping === 0 && (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                                    <Truck className="w-3 h-3" />
                                    Free Shipping
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <Link href="/checkout" className="block">
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            Checkout
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </div>
                <div className="h-safe-area-inset-bottom bg-white dark:bg-slate-900" />
            </div>
        </div>
    );
}
