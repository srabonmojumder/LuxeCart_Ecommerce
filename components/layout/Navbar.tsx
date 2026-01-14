'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Search, Menu, X, User, GitCompare, Bell } from 'lucide-react';
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
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const totalItems = getTotalItems();

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-xl'
                    : 'bg-white dark:bg-gray-900 shadow-md'
                    }`}
            >
                {/* Top Banner */}
                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white py-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 text-sm">
                        <Bell className="w-4 h-4" />
                        <span className="font-medium">Flash Sale! Get up to 50% OFF - Limited Time Only!</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-18">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 group">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent"
                            >
                                LuxeCart
                            </motion.div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-8">
                            <Link
                                href="/"
                                className="text-[15px] text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-semibold py-3 relative group"
                            >
                                Home
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-200" />
                            </Link>
                            <Link
                                href="/products"
                                className="text-[15px] text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-semibold py-3 relative group"
                            >
                                Products
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-200" />
                            </Link>
                            <Link
                                href="/categories"
                                className="text-[15px] text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-semibold py-3 relative group"
                            >
                                Categories
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-200" />
                            </Link>
                            <Link
                                href="/compare"
                                className="text-[15px] text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-semibold py-3 relative group"
                            >
                                Compare
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-200" />
                            </Link>
                            <Link
                                href="/about"
                                className="text-[15px] text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-semibold py-3 relative group"
                            >
                                About
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-200" />
                            </Link>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowSearch(true)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            </motion.button>

                            {/* Compare */}
                            <Link href="/compare" className="relative group hidden md:block">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <GitCompare className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors" />
                                    {mounted && compareProducts.length > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[11px] rounded-full w-[18px] h-[18px] flex items-center justify-center font-semibold"
                                        >
                                            {compareProducts.length}
                                        </motion.span>
                                    )}
                                </motion.div>
                            </Link>

                            {/* Wishlist */}
                            <Link href="/wishlist" className="relative group">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
                                    {mounted && wishlist.length > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[11px] rounded-full w-[18px] h-[18px] flex items-center justify-center font-semibold"
                                        >
                                            {wishlist.length}
                                        </motion.span>
                                    )}
                                </motion.div>
                            </Link>

                            {/* Cart */}
                            <Link href="/cart" className="relative group">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-purple-600 transition-colors" />
                                    {mounted && totalItems > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1.5 -right-1.5 bg-purple-600 text-white text-[11px] rounded-full w-[18px] h-[18px] flex items-center justify-center font-semibold"
                                        >
                                            {totalItems}
                                        </motion.span>
                                    )}
                                </motion.div>
                            </Link>

                            {/* Account */}
                            <Link href="/account" className="hidden md:block">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <User className="w-5 h-5 text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors" />
                                </motion.div>
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="lg:hidden text-gray-700 dark:text-gray-300 p-2"
                            >
                                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                            className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg"
                        >
                            <div className="px-4 py-4 space-y-3">
                                <Link
                                    href="/"
                                    onClick={() => setIsOpen(false)}
                                    className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium rounded-lg"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/products"
                                    onClick={() => setIsOpen(false)}
                                    className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium rounded-lg"
                                >
                                    Products
                                </Link>
                                <Link
                                    href="/categories"
                                    onClick={() => setIsOpen(false)}
                                    className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium rounded-lg"
                                >
                                    Categories
                                </Link>
                                <Link
                                    href="/compare"
                                    onClick={() => setIsOpen(false)}
                                    className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium rounded-lg"
                                >
                                    Compare Products
                                </Link>
                                <Link
                                    href="/about"
                                    onClick={() => setIsOpen(false)}
                                    className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium rounded-lg"
                                >
                                    About
                                </Link>
                                <Link
                                    href="/account"
                                    onClick={() => setIsOpen(false)}
                                    className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium rounded-lg"
                                >
                                    My Account
                                </Link>
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
