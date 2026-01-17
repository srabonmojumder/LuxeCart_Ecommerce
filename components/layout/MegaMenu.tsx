'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ChevronRight, Sparkles, Zap, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '@/data/products';

interface MenuItem {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    featured?: boolean;
    submenu?: {
        title: string;
        links: { label: string; href: string; badge?: string }[];
    }[];
    promoImage?: string;
    promoTitle?: string;
    promoDiscount?: string;
}

const menuItems: MenuItem[] = [
    {
        label: 'All Categories',
        href: '/categories',
        icon: ChevronDown,
        submenu: [
            {
                title: 'Shop by Category',
                links: categories.map(cat => ({
                    label: cat.name,
                    href: `/products?category=${cat.name.toLowerCase()}`,
                })),
            },
            {
                title: 'Featured',
                links: [
                    { label: 'New Arrivals', href: '/products?filter=new', badge: 'New' },
                    { label: 'Best Sellers', href: '/products?filter=bestseller' },
                    { label: 'Flash Deals', href: '/products?filter=sale', badge: 'Hot' },
                    { label: 'Trending Now', href: '/products?filter=trending' },
                ],
            },
        ],
        promoImage: '/photo-1441986300917-64674bd600d8.webp',
        promoTitle: 'Summer Collection',
        promoDiscount: '50% OFF',
    },
    {
        label: 'Electronics',
        href: '/products?category=electronics',
        submenu: [
            {
                title: 'Computers',
                links: [
                    { label: 'Laptops', href: '/products?category=electronics&sub=laptops' },
                    { label: 'Desktops', href: '/products?category=electronics&sub=desktops' },
                    { label: 'Monitors', href: '/products?category=electronics&sub=monitors' },
                    { label: 'Accessories', href: '/products?category=electronics&sub=accessories' },
                ],
            },
            {
                title: 'Mobile',
                links: [
                    { label: 'Smartphones', href: '/products?category=electronics&sub=smartphones' },
                    { label: 'Tablets', href: '/products?category=electronics&sub=tablets' },
                    { label: 'Phone Cases', href: '/products?category=electronics&sub=cases' },
                    { label: 'Chargers', href: '/products?category=electronics&sub=chargers' },
                ],
            },
            {
                title: 'Audio',
                links: [
                    { label: 'Headphones', href: '/products?category=electronics&sub=headphones', badge: 'Popular' },
                    { label: 'Speakers', href: '/products?category=electronics&sub=speakers' },
                    { label: 'Earbuds', href: '/products?category=electronics&sub=earbuds' },
                ],
            },
        ],
        promoImage: '/photo-1505740420928-5e560c06d30e.webp',
        promoTitle: 'Tech Deals',
        promoDiscount: 'Up to 40% OFF',
    },
    {
        label: 'Fashion',
        href: '/products?category=fashion',
        submenu: [
            {
                title: 'Women',
                links: [
                    { label: 'Dresses', href: '/products?category=fashion&sub=dresses' },
                    { label: 'Tops', href: '/products?category=fashion&sub=tops' },
                    { label: 'Bottoms', href: '/products?category=fashion&sub=bottoms' },
                    { label: 'Accessories', href: '/products?category=fashion&sub=accessories' },
                ],
            },
            {
                title: 'Men',
                links: [
                    { label: 'Shirts', href: '/products?category=fashion&sub=shirts' },
                    { label: 'Pants', href: '/products?category=fashion&sub=pants' },
                    { label: 'Jackets', href: '/products?category=fashion&sub=jackets' },
                    { label: 'Shoes', href: '/products?category=fashion&sub=shoes' },
                ],
            },
        ],
        promoImage: '/photo-1445205170230-053b83016050.webp',
        promoTitle: 'New Season',
        promoDiscount: '30% OFF',
    },
    {
        label: 'Home & Living',
        href: '/products?category=home',
        submenu: [
            {
                title: 'Furniture',
                links: [
                    { label: 'Living Room', href: '/products?category=home&sub=living' },
                    { label: 'Bedroom', href: '/products?category=home&sub=bedroom' },
                    { label: 'Office', href: '/products?category=home&sub=office' },
                ],
            },
            {
                title: 'Decor',
                links: [
                    { label: 'Wall Art', href: '/products?category=home&sub=wallart' },
                    { label: 'Lighting', href: '/products?category=home&sub=lighting' },
                    { label: 'Plants', href: '/products?category=home&sub=plants', badge: 'New' },
                ],
            },
        ],
    },
    {
        label: 'Flash Sale',
        href: '/products?filter=sale',
        icon: Zap,
        featured: true,
    },
];

export default function MegaMenu() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    return (
        <nav className="hidden lg:block border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ul className="flex items-center gap-0">
                    {menuItems.map((item) => (
                        <li
                            key={item.label}
                            className="relative"
                            onMouseEnter={() => setActiveMenu(item.label)}
                            onMouseLeave={() => setActiveMenu(null)}
                        >
                            <Link
                                href={item.href}
                                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors ${
                                    item.featured
                                        ? 'text-orange-500 hover:text-orange-600'
                                        : 'text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
                                } ${activeMenu === item.label ? 'text-teal-600 dark:text-teal-400' : ''}`}
                            >
                                {item.icon && <item.icon className="w-4 h-4" />}
                                {item.label}
                                {item.featured && <Sparkles className="w-3 h-3" />}
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
                                                                        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors group"
                                                                    >
                                                                        <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                                                        {link.label}
                                                                        {link.badge && (
                                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                                                link.badge === 'New'
                                                                                    ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                                                                                    : link.badge === 'Hot'
                                                                                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
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
                                                            <p className="text-teal-400 text-xs font-bold">
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
