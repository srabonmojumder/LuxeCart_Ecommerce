'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ChevronRight, ShoppingBag, Heart, User, Search, Home, Grid, Tag, Mail } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const wishlist = useStore((state) => state.wishlist);
    const cart = useStore((state) => state.cart);

    const menuItems = [
        { label: 'Home', href: '/', icon: Home },
        { label: 'Products', href: '/products', icon: Grid },
        { label: 'Categories', href: '/categories', icon: Tag },
        { label: 'Wishlist Archive', href: '/wishlist', icon: Heart, badge: wishlist.length },
        { label: 'Shopping Cart', href: '/cart', icon: ShoppingBag, badge: cart.length },
        { label: 'Account', href: '/account', icon: User },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                    />

                    {/* Sidebar Panel */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 h-full w-[300px] sm:w-[400px] bg-white dark:bg-slate-950 z-[70] shadow-2xl overflow-y-auto"
                    >
                        <div className="p-8 h-full flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-12">
                                <Link href="/" onClick={onClose} className="text-3xl font-black tracking-tighter text-primary dark:text-white">
                                    LuxeCart
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-secondary dark:text-gray-400" />
                                </button>
                            </div>

                            {/* Menu Items */}
                            <nav className="space-y-2 flex-1">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={onClose}
                                        className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-900 transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-800"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-900 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors shadow-sm">
                                                <item.icon className="w-5 h-5 text-secondary dark:text-gray-400 group-hover:text-primary dark:group-hover:text-white" />
                                            </div>
                                            <span className="font-bold text-secondary dark:text-gray-300 group-hover:text-primary dark:group-hover:text-white tracking-wide">
                                                {item.label}
                                            </span>
                                        </div>
                                        {item.badge !== undefined && item.badge > 0 && (
                                            <span className="bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </nav>

                            {/* Search Footer */}
                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-900">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full bg-gray-50 dark:bg-slate-900 border-none rounded-xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 ring-primary/10 dark:ring-white/10 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
