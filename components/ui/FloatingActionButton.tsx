'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle,
    ArrowUp,
    X,
    Heart,
    Share2,
    ShoppingCart,
    Sparkles,
    Gift
} from 'lucide-react';
import { useStore } from '@/store/useStore';

interface FloatingAction {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    color: string;
    badge?: number;
}

export default function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [showPromo, setShowPromo] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const cartItemsFromStore = useStore((state) => state.getTotalItems());
    const wishlistItemsFromStore = useStore((state) => state.wishlist.length);

    // Prevent hydration mismatch by only showing store values after mount
    const cartItems = hasMounted ? cartItemsFromStore : 0;
    const wishlistItems = hasMounted ? wishlistItemsFromStore : 0;

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Show promo after 10 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPromo(true);
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const actions: FloatingAction[] = [
        {
            icon: <ShoppingCart className="w-5 h-5" />,
            label: 'Cart',
            onClick: () => window.location.href = '/cart',
            color: 'from-purple-500 to-pink-500',
            badge: cartItems > 0 ? cartItems : undefined
        },
        {
            icon: <Heart className="w-5 h-5" />,
            label: 'Wishlist',
            onClick: () => window.location.href = '/wishlist',
            color: 'from-red-500 to-pink-500',
            badge: wishlistItems > 0 ? wishlistItems : undefined
        },
        {
            icon: <MessageCircle className="w-5 h-5" />,
            label: 'Chat',
            onClick: () => console.log('Open chat'),
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: <Share2 className="w-5 h-5" />,
            label: 'Share',
            onClick: () => {
                if (navigator.share) {
                    navigator.share({
                        title: 'LuxeCart',
                        text: 'Check out this amazing store!',
                        url: window.location.href
                    });
                }
            },
            color: 'from-green-500 to-emerald-500'
        }
    ];

    return (
        <>
            {/* Promo Badge */}
            <AnimatePresence>
                {showPromo && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed bottom-36 right-6 z-40"
                    >
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-2xl shadow-xl max-w-xs"
                        >
                            <button
                                onClick={() => setShowPromo(false)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-white text-gray-600 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <Gift className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Special Offer!</p>
                                    <p className="text-xs text-white/80">Get 20% off your first order</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scroll to top button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={scrollToTop}
                        className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 border border-gray-200 dark:border-gray-700"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* FAB Container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
                {/* Action Items */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-3"
                        >
                            {actions.map((action, index) => (
                                <motion.button
                                    key={action.label}
                                    initial={{ opacity: 0, x: 50, scale: 0.5 }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        scale: 1,
                                        transition: { delay: index * 0.05 }
                                    }}
                                    exit={{
                                        opacity: 0,
                                        x: 50,
                                        scale: 0.5,
                                        transition: { delay: (actions.length - index) * 0.05 }
                                    }}
                                    whileHover={{ scale: 1.1, x: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={action.onClick}
                                    className="relative flex items-center gap-3 group"
                                >
                                    {/* Label */}
                                    <span className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                                        {action.label}
                                    </span>

                                    {/* Button */}
                                    <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${action.color} text-white flex items-center justify-center shadow-lg`}>
                                        {action.icon}

                                        {/* Badge */}
                                        {action.badge && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                                            >
                                                {action.badge > 9 ? '9+' : action.badge}
                                            </motion.span>
                                        )}
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main FAB Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        relative w-14 h-14 rounded-full 
                        bg-gradient-to-br from-purple-600 to-pink-600 
                        text-white 
                        flex items-center justify-center 
                        shadow-2xl
                        transition-all duration-300
                        ${isOpen ? 'rotate-45' : 'rotate-0'}
                    `}
                >
                    <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Sparkles className="w-6 h-6" />
                        )}
                    </motion.div>

                    {/* Pulse animation */}
                    {!isOpen && (
                        <motion.span
                            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-purple-600"
                        />
                    )}

                    {/* Total badge */}
                    {!isOpen && (cartItems + wishlistItems) > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
                        >
                            {cartItems + wishlistItems > 99 ? '99+' : cartItems + wishlistItems}
                        </motion.span>
                    )}
                </motion.button>
            </div>
        </>
    );
}
