'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Search, Menu, X, User, GitCompare, Sparkles, Home, Package, LayoutGrid, Scale, Info } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useCompareStore } from '@/store/useCompareStore';
import { motion, AnimatePresence } from 'framer-motion';
import SearchModal from '@/components/search/SearchModal';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [mounted, setMounted] = useState(false);

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
        { href: '/', label: 'Home', icon: Home },
        { href: '/products', label: 'Products', icon: Package },
        { href: '/categories', label: 'Categories', icon: LayoutGrid },
        { href: '/compare', label: 'Compare', icon: Scale },
        { href: '/about', label: 'About', icon: Info },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-200/50 dark:border-slate-700/50'
                        : 'bg-white dark:bg-slate-900'
                }`}
            >
                {/* Promotional Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-2 px-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                        <span className="hidden sm:inline text-slate-300">New Season Sale!</span>
                        <span className="font-bold text-teal-400">Up to 50% OFF</span>
                        <span className="hidden md:inline text-slate-300">• Free shipping on orders $50+</span>
                        <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 md:h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2"
                            >
                                {/* Logo Icon */}
                                <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:shadow-lg group-hover:shadow-teal-500/30 transition-shadow">
                                    <span className="text-white font-bold text-base md:text-lg">L</span>
                                </div>
                                <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                    LuxeCart
                                </span>
                            </motion.div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center">
                            <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 rounded-full p-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="relative px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Section - Actions */}
                        <div className="flex items-center gap-0.5 sm:gap-1">
                            {/* Search Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowSearch(true)}
                                className="p-2 md:p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            </motion.button>

                            {/* Compare - Desktop only */}
                            <Link href="/compare" className="relative hidden md:block">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <GitCompare className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                    {mounted && compareProducts.length > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900"
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
                                    className="p-2 md:p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group"
                                >
                                    <Heart className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-rose-500 transition-colors" />
                                    {mounted && wishlist.length > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900"
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
                                    className="p-2 md:p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group"
                                >
                                    <ShoppingCart className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-teal-600 transition-colors" />
                                    {mounted && totalItems > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900"
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
                                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                </motion.div>
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors ml-0.5"
                                aria-label="Toggle menu"
                            >
                                <AnimatePresence mode="wait">
                                    {isOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
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
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden"
                        >
                            <div className="px-4 py-4 space-y-1">
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
                                            className="flex items-center gap-3 py-3 px-4 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 dark:hover:from-teal-900/20 dark:hover:to-emerald-900/20 hover:text-teal-600 dark:hover:text-teal-400 font-medium rounded-xl transition-all"
                                        >
                                            <link.icon className="w-5 h-5" />
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Divider */}
                                <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

                                {/* Mobile-only Account Link */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: navLinks.length * 0.05 }}
                                >
                                    <Link
                                        href="/account"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 py-3 px-4 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 dark:hover:from-teal-900/20 dark:hover:to-emerald-900/20 hover:text-teal-600 dark:hover:text-teal-400 font-medium rounded-xl transition-all"
                                    >
                                        <User className="w-5 h-5" />
                                        My Account
                                    </Link>
                                </motion.div>

                                {/* Mobile Compare Link */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (navLinks.length + 1) * 0.05 }}
                                >
                                    <Link
                                        href="/compare"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-between py-3 px-4 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 dark:hover:from-teal-900/20 dark:hover:to-emerald-900/20 hover:text-teal-600 dark:hover:text-teal-400 font-medium rounded-xl transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <GitCompare className="w-5 h-5" />
                                            Compare Products
                                        </div>
                                        {mounted && compareProducts.length > 0 && (
                                            <span className="w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                {compareProducts.length}
                                            </span>
                                        )}
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
