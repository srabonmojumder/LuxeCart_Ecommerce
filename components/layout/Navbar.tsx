'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Search, Menu, X, User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import SearchModal from '@/components/search/SearchModal';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const wishlist = useStore((state) => state.wishlist);
    const getTotalItems = useStore((state) => state.getTotalItems);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const totalItems = getTotalItems();

    return (
        <>
            <header className={`transition-all duration-300 ${isScrolled ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm py-2' : 'bg-white dark:bg-slate-900 py-3 md:py-4'
                }`}>
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex justify-between items-center h-14 md:h-16">
                        {/* Left - Menu & Search */}
                        <div className="flex items-center gap-2 md:gap-4 flex-1">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <Menu className="w-6 h-6 text-primary dark:text-white" />
                            </button>
                            {/* Desktop Search Button */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="hidden md:flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-400 dark:text-gray-500 group"
                            >
                                <Search className="w-5 h-5 group-hover:text-primary dark:group-hover:text-white transition-colors" />
                                <span className="text-sm font-medium">Search</span>
                            </button>
                            {/* Mobile Search Button */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <Search className="w-5 h-5 text-primary dark:text-white" />
                            </button>
                        </div>

                        {/* Center - Logo */}
                        <div className="flex justify-center">
                            <Link href="/" className="text-2xl md:text-4xl font-black tracking-tighter text-primary dark:text-white">
                                LuxeCart
                            </Link>
                        </div>

                        {/* Right - Actions */}
                        <div className="flex items-center justify-end gap-2 md:gap-6 flex-1">
                            <Link href="/account" className="hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <User className="w-6 h-6 text-primary dark:text-white" />
                            </Link>
                            <Link href="/wishlist" className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors group">
                                <Heart className="w-6 h-6 text-primary dark:text-white group-hover:text-accent transition-colors" />
                                {mounted && wishlist.length > 0 && (
                                    <span className="absolute top-1 right-1 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {wishlist.length}
                                    </span>
                                )}
                            </Link>
                            <Link href="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors group">
                                <ShoppingCart className="w-6 h-6 text-primary dark:text-white group-hover:text-accent transition-colors" />
                                {mounted && totalItems > 0 && (
                                    <span className="absolute top-1 right-1 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
