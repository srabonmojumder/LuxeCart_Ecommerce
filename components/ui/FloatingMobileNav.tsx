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
            transition={{ delay: 0.3, duration: 0.25 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        >
            {/* Gradient fade effect above nav */}
            <div className="h-4 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" />

            {/* Main Navigation Bar */}
            <div className="bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-700/60 shadow-[0_-2px_16px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-around px-1 pt-1.5 pb-safe">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="relative flex flex-col items-center min-w-[56px] no-tap-highlight touch-manipulation"
                            >
                                <motion.div
                                    whileTap={{ scale: 0.92 }}
                                    className={`
                                        relative flex flex-col items-center gap-0.5 py-1.5 px-2.5 rounded-lg
                                        transition-colors duration-200
                                        ${isActive
                                            ? 'text-accent'
                                            : 'text-slate-500 dark:text-slate-400'
                                        }
                                    `}
                                >
                                    {/* Icon Container */}
                                    <div className="relative">
                                        <Icon
                                            className={`w-5 h-5 transition-transform duration-200 ${
                                                isActive ? 'scale-105' : ''
                                            }`}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />

                                        {/* Badge */}
                                        {item.badge && item.badge > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className={`
                                                    absolute -top-1 -right-1.5
                                                    bg-accent
                                                    text-white text-[9px] font-bold
                                                    rounded-full min-w-[16px] h-[16px]
                                                    flex items-center justify-center px-0.5
                                                    border-[1.5px] border-white dark:border-slate-900
                                                `}
                                            >
                                                {item.badge > 99 ? '99+' : item.badge}
                                            </motion.span>
                                        )}
                                    </div>

                                    {/* Label */}
                                    <span className={`
                                        text-[10px] font-semibold
                                        transition-colors duration-200
                                        ${isActive
                                            ? 'text-accent'
                                            : 'text-slate-500 dark:text-slate-400'
                                        }
                                    `}>
                                        {item.label}
                                    </span>

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="mobileNavIndicator"
                                            className="absolute -bottom-0.5 w-6 h-0.5 bg-accent rounded-full"
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
