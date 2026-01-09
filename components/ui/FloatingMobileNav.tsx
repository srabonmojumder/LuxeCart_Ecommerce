'use client';

import { motion } from 'framer-motion';
import { Home, ShoppingBag, Heart, User, Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function FloatingMobileNav() {
    const pathname = usePathname();
    const cart = useStore((state) => state.cart);
    const wishlist = useStore((state) => state.wishlist);

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = wishlist.length;

    const navItems = [
        {
            label: 'Home',
            icon: Home,
            href: '/',
            badge: null,
        },
        {
            label: 'Trending',
            icon: TrendingUp,
            href: '/products',
            badge: null,
        },
        {
            label: 'Search',
            icon: Search,
            href: '/products',
            badge: null,
            isSpecial: true,
        },
        {
            label: 'Wishlist',
            icon: Heart,
            href: '/wishlist',
            badge: wishlistCount || null,
        },
        {
            label: 'Cart',
            icon: ShoppingBag,
            href: '/cart',
            badge: cartCount || null,
        },
    ];

    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 shadow-2xl"
        >
            <div className="flex items-center justify-around px-2 py-3 pb-safe">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    const isSpecial = item.isSpecial;

                    return (
                        <Link key={item.label} href={item.href} className="relative flex flex-col items-center">
                            {/* Special Center Button */}
                            {isSpecial ? (
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute -top-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-2xl shadow-2xl"
                                >
                                    <Icon className="w-6 h-6" />
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 0, 0.5],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl -z-10"
                                    />
                                </motion.div>
                            ) : (
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${isActive
                                            ? 'text-purple-600 dark:text-purple-400'
                                            : 'text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    <div className="relative">
                                        <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />

                                        {/* Badge */}
                                        {item.badge && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white dark:border-gray-900"
                                            >
                                                {item.badge > 9 ? '9+' : item.badge}
                                            </motion.span>
                                        )}

                                        {/* Active Indicator */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-600 dark:bg-purple-400 rounded-full"
                                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </div>

                                    <span
                                        className={`text-[10px] font-medium ${isActive ? 'text-purple-600 dark:text-purple-400' : ''
                                            }`}
                                    >
                                        {item.label}
                                    </span>
                                </motion.button>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Safe area for iPhone */}
            <div className="h-safe-area-inset-bottom bg-white dark:bg-gray-900" />
        </motion.nav>
    );
}
