'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ChevronRight, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '@/lib/hooks';

// Fallback shown before live categories load (and if the API is unreachable).
const fallbackCategoryLinks = [
    { label: 'Electronics', href: '/products?category=electronics' },
    { label: 'Fashion', href: '/products?category=fashion' },
    { label: 'Sports', href: '/products?category=sports' },
    { label: 'Home', href: '/products?category=home' },
    { label: 'Beauty', href: '/products?category=beauty' },
    { label: 'Kitchen', href: '/products?category=kitchen' },
    { label: 'Gaming', href: '/products?category=gaming' },
];

interface MenuItem {
    label: string;
    href: string;
    submenu?: {
        title: string;
        links: { label: string; href: string; badge?: string }[];
    }[];
    promoImage?: string;
    promoTitle?: string;
    promoDiscount?: string;
}

export default function MegaMenu() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const { categories } = useCategories();

    // Inject live categories into Shop's "Top Categories" section.
    const items: MenuItem[] = useMemo(() => {
        const topCategoryLinks = categories.length
            ? categories.slice(0, 7).map((c) => ({ label: c.name, href: `/products?category=${c.slug}` }))
            : fallbackCategoryLinks;

        return [
            { label: 'Home', href: '/' },
            {
                label: 'Shop',
                href: '/products',
                submenu: [
                    {
                        title: 'Browse',
                        links: [
                            { label: 'All Products', href: '/products' },
                            { label: 'New Arrivals', href: '/products?filter=new', badge: 'New' },
                            { label: 'Best Sellers', href: '/products?filter=bestseller' },
                            { label: 'On Sale', href: '/products?filter=sale', badge: 'Hot' },
                            { label: 'Trending Now', href: '/products?filter=trending' },
                        ],
                    },
                    {
                        title: 'Top Categories',
                        links: topCategoryLinks,
                    },
                ],
                promoImage: '/photo-1505740420928-5e560c06d30e.webp',
                promoTitle: 'Tech Deals',
                promoDiscount: 'Up to 40% OFF',
            },
            { label: 'Categories', href: '/categories' },
            { label: 'Blog', href: '/blog' },
            {
                label: 'Pages',
                href: '/about',
                submenu: [
                    {
                        title: 'Company',
                        links: [
                            { label: 'About Us', href: '/about' },
                            { label: 'Contact', href: '/contact' },
                            { label: 'Stores', href: '/stores' },
                        ],
                    },
                    {
                        title: 'Help & Support',
                        links: [
                            { label: 'Track Order', href: '/track' },
                            { label: 'FAQ', href: '/faq' },
                            { label: 'My Account', href: '/account' },
                            { label: 'Wishlist', href: '/wishlist' },
                        ],
                    },
                ],
                promoImage: '/photo-1441986300917-64674bd600d8.webp',
                promoTitle: 'Customer Support',
                promoDiscount: 'Here 24/7',
            },
        ];
    }, [categories]);

    return (
        <nav className="hidden lg:block border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <ul className="flex items-center gap-0">
                    {items.map((item) => (
                        <li
                            key={item.label}
                            className="relative"
                            onMouseEnter={() => setActiveMenu(item.label)}
                            onMouseLeave={() => setActiveMenu(null)}
                        >
                            <Link
                                href={item.href}
                                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors text-slate-700 dark:text-slate-300 hover:text-accent dark:hover:text-accent-400 ${activeMenu === item.label ? 'text-accent dark:text-accent-400' : ''}`}
                            >
                                {item.label}
                                {item.submenu && (
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === item.label ? 'rotate-180' : ''}`}
                                    />
                                )}
                            </Link>

                            {/* Mega Menu Dropdown */}
                            <AnimatePresence>
                                {activeMenu === item.label && item.submenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute left-0 top-full w-[600px] bg-white dark:bg-slate-900 rounded-b-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50"
                                    >
                                        <div className="flex">
                                            {/* Menu Links */}
                                            <div className="flex-1 grid grid-cols-2 gap-6 p-6">
                                                {item.submenu.map((section) => (
                                                    <div key={section.title}>
                                                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                                            {section.title}
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {section.links.map((link) => (
                                                                <li key={link.label}>
                                                                    <Link
                                                                        href={link.href}
                                                                        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent-400 transition-colors group"
                                                                    >
                                                                        <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                                                        {link.label}
                                                                        {link.badge && (
                                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${link.badge === 'New'
                                                                                ? 'bg-accent/10 dark:bg-accent/20 text-accent'
                                                                                : link.badge === 'Hot'
                                                                                    ? 'bg-hot/10 dark:bg-hot/20 text-hot'
                                                                                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                                                                }`}>
                                                                                {link.badge}
                                                                            </span>
                                                                        )}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Promo Banner */}
                                            {item.promoImage && (
                                                <div className="w-48 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-br-xl">
                                                    <div className="relative h-full rounded-lg overflow-hidden">
                                                        <Image
                                                            src={item.promoImage}
                                                            alt={item.promoTitle || 'Promo'}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                                        <div className="absolute bottom-3 left-3 right-3">
                                                            <p className="text-white text-sm font-semibold mb-1">
                                                                {item.promoTitle}
                                                            </p>
                                                            <p className="text-accent-400 text-xs font-bold">
                                                                {item.promoDiscount}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </li>
                    ))}

                    {/* Special Offers Link */}
                    <li className="ml-auto">
                        <Link
                            href="/products?filter=sale"
                            className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors"
                        >
                            <Tag className="w-4 h-4" />
                            Special Offers
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
