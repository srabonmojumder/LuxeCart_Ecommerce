'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Share2, AlertCircle, Check } from 'lucide-react';
import { Product, useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface StickyMobileBarProps {
    product: Product;
}

export default function StickyMobileBar({ product }: StickyMobileBarProps) {
    const [visible, setVisible] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const addToCart = useStore((state) => state.addToCart);
    const addToWishlist = useStore((state) => state.addToWishlist);
    const removeFromWishlist = useStore((state) => state.removeFromWishlist);
    const isInWishlist = useStore((state) => state.isInWishlist);

    const inWishlist = isInWishlist(product.id);

    useEffect(() => {
        const handleScroll = () => {
            // Show bar when scrolled down 300px
            setVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAddToCart = async () => {
        if (!product.inStock) return;

        setIsAdding(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        addToCart(product);

        // Confetti from bottom center
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.9, x: 0.5 },
            colors: ['#a855f7', '#ec4899', '#3b82f6'],
        });

        setIsAdding(false);
        setAdded(true);

        toast.success('Added to cart!');

        setTimeout(() => setAdded(false), 2000);
    };

    const handleToggleWishlist = () => {
        if (inWishlist) {
            removeFromWishlist(product.id);
            toast.success('Removed from wishlist');
        } else {
            addToWishlist(product);
            toast.success('Added to wishlist!');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out ${product.name}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="md:hidden fixed bottom-[85px] left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 shadow-2xl rounded-t-2xl"
                >
                    {/* Out of stock banner */}
                    {!product.inStock && (
                        <div className="bg-red-500 text-white text-center py-1.5 text-sm font-medium flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Out of Stock
                        </div>
                    )}

                    <div className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Price Section */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-1.5 sm:gap-2">
                                    <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        ${discountedPrice.toFixed(2)}
                                    </span>
                                    {product.discount && (
                                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                {product.inStock && (
                                    <p className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        In Stock
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                                {/* Wishlist Button */}
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleToggleWishlist}
                                    className={`p-2.5 sm:p-3 rounded-xl transition-all ${inWishlist
                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${inWishlist ? 'fill-current' : ''}`} />
                                </motion.button>

                                {/* Share Button - Hidden on very small screens */}
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleShare}
                                    className="hidden xs:flex p-2.5 sm:p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all"
                                >
                                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>

                                {/* Add to Cart Button */}
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock || isAdding}
                                    className={`
                                        flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-semibold
                                        transition-all duration-300 shadow-lg justify-center text-sm sm:text-base
                                        ${!product.inStock
                                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                            : added
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white active:scale-95'
                                        }
                                    `}
                                >
                                    <AnimatePresence mode="wait">
                                        {isAdding ? (
                                            <motion.div
                                                key="loading"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                                            />
                                        ) : added ? (
                                            <motion.div
                                                key="added"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="flex items-center gap-1.5"
                                            >
                                                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="hidden xs:inline">Added!</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="add"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-1.5"
                                            >
                                                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="hidden xs:inline">Add to Cart</span>
                                                <span className="xs:hidden">Add</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </div>
                        </div>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}
