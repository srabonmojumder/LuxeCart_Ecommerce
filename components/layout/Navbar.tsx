'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Search, Menu, X, User, GitCompare, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useCompareStore } from '@/store/useCompareStore';
import { motion, AnimatePresence } from 'framer-motion';
import SearchModal from '@/components/search/SearchModal';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [mounted, setMounted] = useState(false);

    const cart = useStore((state) => state.cart);
    const wishlist = useStore((state) => state.wishlist);
    const getTotalItems = useStore((state) => state.getTotalItems);
    const compareProducts = useCompareStore((state) => state.compareProducts);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const totalItems = getTotalItems();

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/products', label: 'Products' },
        { href: '/categories', label: 'Categories' },
        { href: '/compare', label: 'Compare' },
        { href: '/about', label: 'About' },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg border-b border-slate-100 dark:border-slate-800'
                        : 'bg-white dark:bg-slate-900'
                }`}
            >
                {/* Promotional Banner */}
                <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 text-white py-2 px-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm font-medium">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        <span className="hidden sm:inline">New Season Sale!</span>
                        <span className="font-bold">Up to 50% OFF</span>
                        <span className="hidden sm:inline">- Free shipping on orders $50+</span>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 lg:h-18">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2"
                            >
                                {/* Logo Icon */}
                                <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                    <span className="text-white font-bold text-lg">L</span>
                                </div>
                                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                    LuxeCart
                                </span>
                            </motion.div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 group"
                                >
                                    {link.label}
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 group-hover:w-1/2 transition-all duration-200 rounded-full" />
                                </Link>
                            ))}
                        </div>

                        {/* Right Section - Actions */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Search Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowSearch(true)}
                                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            </motion.button>

                            {/* Compare - Desktop only */}
                            <Link href="/compare" className="relative hidden md:block">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    <GitCompare className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                    {mounted && compareProducts.length > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-1 right-1 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                                        >
                                            {compareProducts.length}
                                        </motion.span>
                                    )}
                                </motion.div>
                            </Link>

                            {/* Wishlist */}
                            <Link href="/wishlist" className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group"
                                >
                                    <Heart className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-rose-500 transition-colors" />
                                    {mounted && wishlist.length > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                                        >
                                            {wishlist.length > 9 ? '9+' : wishlist.length}
                                        </motion.span>
                                    )}
                                </motion.div>
                            </Link>

                            {/* Cart */}
                            <Link href="/cart" className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group"
                                >
                                    <ShoppingCart className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-teal-600 transition-colors" />
                                    {mounted && totalItems > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
                                        >
                                            {totalItems > 9 ? '9+' : totalItems}
                                        </motion.span>
                                    )}
                                </motion.div>
                            </Link>

                            {/* Account - Desktop only */}
                            <Link href="/account" className="hidden md:block">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                </motion.div>
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="lg:hidden p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors ml-1"
                                aria-label="Toggle menu"
                            >
                                <motion.div
                                    animate={{ rotate: isOpen ? 90 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isOpen ? (
                                        <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                    ) : (
                                        <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                    )}
                                </motion.div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden"
                        >
                            <div className="px-4 py-3 space-y-1">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 py-3 px-4 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400 font-medium rounded-xl transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Mobile-only Account Link */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: navLinks.length * 0.05 }}
                                >
                                    <Link
                                        href="/account"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 py-3 px-4 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400 font-medium rounded-xl transition-colors"
                                    >
                                        <User className="w-5 h-5" />
                                        My Account
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Search Modal */}
            <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
        </>
    );
}
