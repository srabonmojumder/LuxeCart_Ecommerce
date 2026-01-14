'use client';

import { motion } from 'framer-motion';
import { Home, Grid3X3, Heart, ShoppingBag, User } from 'lucide-react';
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
            label: 'Shop',
            icon: Grid3X3,
            href: '/products',
            badge: null,
        },
        {
            label: 'Wishlist',
            icon: Heart,
            href: '/wishlist',
            badge: wishlistCount || null,
            badgeColor: 'bg-rose-500',
        },
        {
            label: 'Cart',
            icon: ShoppingBag,
            href: '/cart',
            badge: cartCount || null,
            badgeColor: 'bg-gradient-to-r from-teal-500 to-emerald-500',
        },
        {
            label: 'Account',
            icon: User,
            href: '/account',
            badge: null,
        },
    ];

    return (
        <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        >
            {/* Gradient fade effect above nav */}
            <div className="h-6 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" />

            {/* Main Navigation Bar */}
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-around px-2 pt-2 pb-safe">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href ||
                            (item.href === '/products' && pathname.startsWith('/products'));

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="relative flex flex-col items-center min-w-[60px] no-tap-highlight touch-manipulation"
                            >
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className={`
                                        relative flex flex-col items-center gap-1 py-2 px-3 rounded-xl
                                        transition-colors duration-200
                                        ${isActive
                                            ? 'text-teal-600 dark:text-teal-400'
                                            : 'text-slate-500 dark:text-slate-400'
                                        }
                                    `}
                                >
                                    {/* Icon Container */}
                                    <div className="relative">
                                        <Icon
                                            className={`w-6 h-6 transition-transform duration-200 ${
                                                isActive ? 'scale-110' : ''
                                            }`}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />

                                        {/* Badge */}
                                        {item.badge && item.badge > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className={`
                                                    absolute -top-1.5 -right-1.5
                                                    ${item.badgeColor || 'bg-teal-500'}
                                                    text-white text-[10px] font-bold
                                                    rounded-full min-w-[18px] h-[18px]
                                                    flex items-center justify-center px-1
                                                    border-2 border-white dark:border-slate-900
                                                    shadow-sm
                                                `}
                                            >
                                                {item.badge > 99 ? '99+' : item.badge}
                                            </motion.span>
                                        )}
                                    </div>

                                    {/* Label */}
                                    <span className={`
                                        text-[10px] font-medium
                                        transition-colors duration-200
                                        ${isActive
                                            ? 'text-teal-600 dark:text-teal-400'
                                            : 'text-slate-500 dark:text-slate-400'
                                        }
                                    `}>
                                        {item.label}
                                    </span>

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="mobileNavIndicator"
                                            className="absolute -bottom-1 w-8 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                                            transition={{
                                                type: 'spring',
                                                stiffness: 500,
                                                damping: 35,
                                            }}
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>

                {/* Safe area spacer for iPhone */}
                <div className="h-safe-area-inset-bottom bg-white dark:bg-slate-900" />
            </div>
        </motion.nav>
    );
}
