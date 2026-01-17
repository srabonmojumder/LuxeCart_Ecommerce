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
            <div className="pt-24 md:pt-[112px] min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center pb-24">
                <div className="text-center px-4 max-w-lg mx-auto">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-40 h-40 mx-auto mb-12 bg-primary/5 rounded-[3rem] flex items-center justify-center shadow-soft"
                    >
                        <ShoppingBag className="w-16 h-16 text-primary/20" />
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-black text-primary dark:text-white mb-6 tracking-tighter">
                        Your Cart is Empty
                    </h2>
                    <p className="text-secondary dark:text-gray-400 text-lg mb-10 font-medium">
                        Looks like you haven't added any items to your cart yet. Discover our curated collection.
                    </p>
                    <Link href="/products">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary"
                        >
                            Browse Products
                        </motion.button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-0 md:pt-0 min-h-screen bg-white dark:bg-slate-950 pb-32">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4 md:px-0">
                    <div className="max-w-2xl">
                        <span className="inline-block text-accent font-black tracking-[0.4em] text-xs uppercase mb-4">
                            Your Selection
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-primary dark:text-white leading-tight tracking-tighter">
                            Shopping Cart
                        </h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <p className="text-sm font-black tracking-widest text-primary dark:text-white uppercase">
                            {cart.length} {cart.length === 1 ? 'item' : 'items'}
                        </p>
                        <button
                            onClick={handleClearCart}
                            className="text-[10px] font-black tracking-widest text-accent uppercase hover:text-primary dark:hover:text-white transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear Cart
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16">
                    {/* Cart Items Area */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Free Shipping Progress - Clean Style */}
                        {totalPrice < 50 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-primary/5 rounded-[2rem] p-8 border border-primary/5"
                            >
                                <div className="flex items-center justify-between gap-4 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                            <Truck className="w-5 h-5 text-accent" />
                                        </div>
                                        <span className="text-sm font-black tracking-widest text-primary uppercase">
                                            Add <span className="text-accent">${(50 - totalPrice).toFixed(2)}</span> for FREE shipping
                                        </span>
                                    </div>
                                    <span className="text-xs font-black text-primary">{Math.round(freeShippingProgress)}%</span>
                                </div>
                                <div className="h-2.5 bg-white/50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${freeShippingProgress}%` }}
                                        transition={{ duration: 0.8, ease: 'circOut' }}
                                        className="h-full bg-accent rounded-full shadow-lg"
                                    />
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-8">
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
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group flex flex-row gap-4 sm:gap-8 pb-8 border-b border-primary/5 dark:border-white/5 last:border-0"
                                        >
                                            {/* Product Image */}
                                            <Link href={`/products/${item.id}`} className="flex-shrink-0">
                                                <div className="relative w-24 h-32 sm:w-40 sm:h-48 bg-primary/5 rounded-xl sm:rounded-[2rem] overflow-hidden">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>
                                            </Link>

                                            {/* Product Info */}
                                            <div className="flex-1 flex flex-col pt-1 sm:pt-2">
                                                <div className="flex justify-between items-start gap-2 sm:gap-4 mb-2 sm:mb-4">
                                                    <div>
                                                        <p className="text-[8px] sm:text-[10px] text-accent font-black uppercase tracking-[0.3em] mb-1 sm:mb-2">
                                                            {item.category}
                                                        </p>
                                                        <Link
                                                            href={`/products/${item.id}`}
                                                            className="text-lg sm:text-2xl font-black text-primary dark:text-white hover:text-accent transition-colors tracking-tight leading-tight line-clamp-2"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemove(item.id)}
                                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/5 dark:bg-white/5 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center dark:text-white flex-shrink-0"
                                                    >
                                                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    </button>
                                                </div>

                                                <div className="flex flex-wrap items-end justify-between mt-auto gap-4 pt-2 sm:pt-4">
                                                    {/* Quantity Controls - New Bold Style */}
                                                    <div className="flex items-center gap-3 sm:gap-6 bg-primary/5 dark:bg-white/5 px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                            className="text-primary dark:text-white hover:scale-125 transition-transform disabled:opacity-20"
                                                        >
                                                            <Minus className="w-3 h-3 sm:w-5 sm:h-5" />
                                                        </button>
                                                        <span className="text-base sm:text-xl font-black text-primary dark:text-white min-w-[1.5ch] text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="text-primary dark:text-white hover:scale-125 transition-transform"
                                                        >
                                                            <Plus className="w-3 h-3 sm:w-5 sm:h-5" />
                                                        </button>
                                                    </div>

                                                    {/* Price - Bold and Clean */}
                                                    <div className="text-right">
                                                        <div className="text-lg sm:text-2xl font-black text-primary dark:text-white">
                                                            ${(discountedPrice * item.quantity).toFixed(2)}
                                                        </div>
                                                        {item.discount && (
                                                            <div className="text-xs sm:text-sm text-gray-400 line-through font-bold">
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
                        </div>

                        {/* Continue Shopping */}
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-4 text-xs font-black tracking-widest text-primary dark:text-white uppercase hover:gap-6 transition-all"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary/5 dark:bg-white/5 flex items-center justify-center">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary - Premium Style */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-primary/5 dark:border-white/5 p-8 transition-all duration-500"
                        >
                            <h2 className="text-2xl font-black text-primary dark:text-white mb-10 tracking-tight">
                                Order Summary
                            </h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between items-center bg-primary/5 dark:bg-white/5 px-6 py-4 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <Tag className="w-4 h-4 text-accent" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Subtotal</span>
                                    </div>
                                    <span className="text-lg font-black text-primary dark:text-white">
                                        ${totalPrice.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center px-6">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Shipping</span>
                                    <span className={`text-sm font-black uppercase tracking-widest ${shipping === 0 ? 'text-accent' : 'text-primary dark:text-white'}`}>
                                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center px-6 pb-6 border-b border-primary/5 dark:border-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Tax</span>
                                    <span className="text-sm font-black text-primary dark:text-white">
                                        ${tax.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center px-6 pt-4">
                                    <span className="text-xl font-black text-primary dark:text-white tracking-tight">Total</span>
                                    <span className="text-3xl font-black text-primary dark:text-white tracking-tighter">
                                        ${finalTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <Link href="/checkout" className="block">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-primary w-full py-6 flex items-center justify-center gap-4 text-sm"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5 text-accent" />
                                </motion.button>
                            </Link>

                            <div className="mt-8 space-y-4 pt-8 border-t border-primary/5">
                                <div className="flex items-center gap-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                    <Shield className="w-4 h-4 text-accent" />
                                    <span>Encrypted Payment</span>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                    <Package className="w-4 h-4 text-accent" />
                                    <span>30-Day Easy Returns</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Mobile Checkout Bar - Styled Clean */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-primary/5 dark:border-white/5 px-6 py-4 pb-safe shadow-2xl">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Amount</p>
                        <p className="text-3xl font-black text-primary dark:text-white tracking-tighter">
                            ${finalTotal.toFixed(2)}
                        </p>
                    </div>
                    <Link href="/checkout" className="flex-1 max-w-[200px]">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary w-full py-4 text-xs"
                        >
                            Checkout
                        </motion.button>
                    </Link>
                </div>
            </div>
        </div >
    );
}
