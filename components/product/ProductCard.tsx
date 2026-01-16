'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Eye, Zap, TrendingUp, Sparkles, Check, Package } from 'lucide-react';
import { Product } from '@/store/useStore';
import { useStore } from '@/store/useStore';
import { useCompareStore } from '@/store/useCompareStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface ProductCardProps {
    product: Product;
    onQuickView?: (product: Product) => void;
    variant?: 'default' | 'compact' | 'featured';
}

export default function ProductCard({ product, onQuickView, variant = 'default' }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [showAddedAnimation, setShowAddedAnimation] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    const addToCart = useStore((state) => state.addToCart);
    const addToWishlist = useStore((state) => state.addToWishlist);
    const removeFromWishlist = useStore((state) => state.removeFromWishlist);
    const isInWishlist = useStore((state) => state.isInWishlist);
    const addToCompare = useCompareStore((state) => state.addToCompare);
    const compareProducts = useCompareStore((state) => state.compareProducts);

    // Prevent hydration mismatch by only checking wishlist state after mount
    useEffect(() => {
        setHasMounted(true);
    }, []);

    const inWishlist = hasMounted && isInWishlist(product.id);
    const inCompare = compareProducts.some(p => p.id === product.id);

    // Deterministic stock calculation
    const stockLeft = useMemo(() => ((product.id * 7 + 13) % 50) + 10, [product.id]);

    const triggerConfetti = useCallback((x: number, y: number) => {
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { x, y },
            colors: ['#14b8a6', '#10b981', '#f97316', '#0d9488'],
            ticks: 100,
            gravity: 1.2,
            scalar: 0.8,
            shapes: ['star', 'circle'],
        });
    }, []);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Capture position before async operation
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        setIsAddingToCart(true);
        await new Promise(resolve => setTimeout(resolve, 300));

        addToCart(product);
        triggerConfetti(x, y);
        setIsAddingToCart(false);
        setShowAddedAnimation(true);

        toast.success('Added to cart!');

        setTimeout(() => setShowAddedAnimation(false), 2000);
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWishlist) {
            removeFromWishlist(product.id);
            toast.success('Removed from wishlist');
        } else {
            addToWishlist(product);
            toast.success('Added to wishlist!');
        }
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onQuickView) {
            onQuickView(product);
        }
    };

    const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

    // Deterministic badges
    const isNew = product.id % 3 === 0;
    const isHot = product.rating >= 4.7;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            whileHover={{ y: -4 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative group"
        >
            <Link href={`/products/${product.id}`} className="block">
                <div className={`
                    relative overflow-hidden h-full flex flex-col
                    bg-white dark:bg-slate-800
                    rounded-xl sm:rounded-2xl
                    border border-slate-100 dark:border-slate-700
                    hover:border-teal-300 dark:hover:border-teal-600
                    shadow-sm hover:shadow-xl hover:shadow-teal-500/10
                    transition-all duration-300
                    ${variant === 'featured' ? 'p-3 sm:p-4' : 'p-2 sm:p-3 md:p-4'}
                `}>
                    {/* Image Container */}
                    <div className={`
                        relative overflow-hidden
                        bg-slate-100 dark:bg-slate-700/50
                        rounded-lg sm:rounded-xl
                        aspect-[4/5] sm:aspect-square md:aspect-[4/5]
                    `}>
                        {/* Skeleton Loader */}
                        <AnimatePresence>
                            {!imageLoaded && (
                                <motion.div
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800"
                                >
                                    <div className="absolute inset-0 shimmer-effect" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Product Image */}
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className={`
                                object-cover
                                group-hover:scale-105
                                transition-transform duration-500 ease-out
                                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                            `}
                            onLoad={() => setImageLoaded(true)}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />

                        {/* Shine Effect */}
                        <motion.div
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: isHovered ? '200%' : '-100%', opacity: isHovered ? 0.2 : 0 }}
                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
                            style={{ width: '50%' }}
                        />

                        {/* Primary Badge */}
                        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-20">
                            {product.discount ? (
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold shadow-md flex items-center gap-0.5 sm:gap-1"
                                >
                                    <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" />
                                    -{product.discount}%
                                </motion.div>
                            ) : isNew ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold shadow-md flex items-center gap-0.5 sm:gap-1"
                                >
                                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    NEW
                                </motion.div>
                            ) : isHot ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold shadow-md flex items-center gap-0.5 sm:gap-1"
                                >
                                    <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    HOT
                                </motion.div>
                            ) : null}
                        </div>

                        {/* Out of Stock Badge */}
                        {!product.inStock && (
                            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center z-10">
                                <span className="bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                                    Out of Stock
                                </span>
                            </div>
                        )}

                        {/* Action Buttons - Side by Side */}
                        <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-20 flex flex-col items-center gap-1 sm:gap-1.5">
                            {/* Quick View Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleQuickView}
                                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-teal-500 hover:text-white flex items-center justify-center shadow-md backdrop-blur-sm transition-all duration-200"
                            >
                                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </motion.button>

                            {/* Wishlist Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleToggleWishlist}
                                className={`
                                    w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full
                                    flex items-center justify-center
                                    shadow-md backdrop-blur-sm
                                    transition-all duration-200
                                    ${inWishlist
                                        ? 'bg-rose-500 text-white'
                                        : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-rose-500 hover:text-white'
                                    }
                                `}
                            >
                                <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-current' : ''}`} />
                            </motion.button>
                        </div>

                        {/* Add to Cart Button - Desktop Hover */}
                        <AnimatePresence>
                            {isHovered && product.inStock && (
                                <motion.button
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 100, opacity: 0 }}
                                    transition={{ duration: 0.25, type: 'spring', stiffness: 400 }}
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart}
                                    className={`
                                        absolute bottom-0 left-0 right-0
                                        py-3 font-semibold
                                        hidden md:flex items-center justify-center gap-2
                                        z-20 rounded-b-xl
                                        transition-all duration-200
                                        ${showAddedAnimation
                                            ? 'bg-emerald-500'
                                            : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600'
                                        }
                                        text-white text-sm
                                    `}
                                >
                                    <AnimatePresence mode="wait">
                                        {isAddingToCart ? (
                                            <motion.div
                                                key="loading"
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0 }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                                            />
                                        ) : showAddedAnimation ? (
                                            <motion.div
                                                key="added"
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Check className="w-4 h-4" />
                                                Added!
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="add"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center gap-2"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                Add to Cart
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Mobile Add to Cart Button */}
                        {product.inStock && (
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                                className={`
                                    md:hidden absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 z-20
                                    w-8 h-8 sm:w-10 sm:h-10 rounded-full
                                    flex items-center justify-center
                                    shadow-lg backdrop-blur-sm
                                    transition-all duration-200
                                    ${showAddedAnimation
                                        ? 'bg-emerald-500'
                                        : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                                    }
                                    text-white
                                `}
                            >
                                {isAddingToCart ? (
                                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : showAddedAnimation ? (
                                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                                ) : (
                                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                )}
                            </motion.button>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col mt-2 sm:mt-3 px-0.5">
                        {/* Category */}
                        <p className="text-[9px] sm:text-[11px] text-teal-600 dark:text-teal-400 mb-0.5 sm:mb-1 font-semibold tracking-wide uppercase">
                            {product.category}
                        </p>

                        {/* Product Name */}
                        <h3 className="font-semibold text-slate-800 dark:text-white mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200 leading-snug text-xs sm:text-sm md:text-base">
                            {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${
                                            i < Math.floor(product.rating)
                                                ? 'text-amber-400 fill-current'
                                                : 'text-slate-200 dark:text-slate-600'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                                ({product.reviews})
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mt-auto">
                            {product.discount ? (
                                <div className="flex flex-col gap-0.5">
                                    <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                                        <span className="text-base sm:text-lg md:text-xl font-bold text-teal-600 dark:text-teal-400">
                                            ${discountedPrice.toFixed(2)}
                                        </span>
                                        <span className="text-[10px] sm:text-sm text-slate-400 line-through">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        Save ${(product.price - discountedPrice).toFixed(2)}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-base sm:text-lg md:text-xl font-bold text-slate-800 dark:text-white">
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Low Stock Indicator */}
                        {product.inStock && stockLeft < 15 && (
                            <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                <span className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 font-medium">
                                    Only {stockLeft} left
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
