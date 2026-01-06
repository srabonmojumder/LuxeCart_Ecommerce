'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Eye, GitCompare, Zap, TrendingUp, Sparkles, Check, Package } from 'lucide-react';
import { Product } from '@/store/useStore';
import { useStore } from '@/store/useStore';
import { useCompareStore } from '@/store/useCompareStore';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import toast from 'react-hot-toast';
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

    const addToCart = useStore((state) => state.addToCart);
    const addToWishlist = useStore((state) => state.addToWishlist);
    const removeFromWishlist = useStore((state) => state.removeFromWishlist);
    const isInWishlist = useStore((state) => state.isInWishlist);
    const addToCompare = useCompareStore((state) => state.addToCompare);
    const compareProducts = useCompareStore((state) => state.compareProducts);

    const inWishlist = isInWishlist(product.id);
    const inCompare = compareProducts.some(p => p.id === product.id);

    // 3D tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [8, -8]);
    const rotateY = useTransform(x, [-100, 100], [-8, 8]);
    const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
    const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

    // Deterministic stock calculation (avoids hydration mismatch)
    const stockLeft = useMemo(() => ((product.id * 7 + 13) % 50) + 10, [product.id]);
    const stockPercentage = useMemo(() => ((product.id * 17 + 11) % 40) + 60, [product.id]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (variant !== 'featured') return;
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    const triggerConfetti = useCallback((e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 50,
            spread: 60,
            origin: { x, y },
            colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981'],
            ticks: 100,
            gravity: 1.2,
            scalar: 0.8,
            shapes: ['star', 'circle'],
        });
    }, []);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsAddingToCart(true);

        // Simulate a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300));

        addToCart(product);
        triggerConfetti(e);
        setIsAddingToCart(false);
        setShowAddedAnimation(true);

        toast.success(
            <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Added to cart!</span>
            </div>,
            {
                icon: '🛒',
                style: {
                    borderRadius: '12px',
                    background: '#fff',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                },
            }
        );

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
            toast.success('Added to wishlist!', {
                icon: '❤️',
            });
        }
    };

    const handleAddToCompare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (compareProducts.length >= 4) {
            toast.error('You can only compare up to 4 products');
            return;
        }
        addToCompare(product);
        toast.success('Added to comparison!');
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

    // Deterministic badges (no random)
    const isNew = product.id % 3 === 0;
    const isHot = product.rating >= 4.7;
    const isBestSeller = product.reviews > 300;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
                perspective: 1000,
                rotateX: variant === 'featured' ? springRotateX : 0,
                rotateY: variant === 'featured' ? springRotateY : 0,
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={handleMouseLeave}
            onMouseMove={handleMouseMove}
            className="relative"
        >
            <Link href={`/products/${product.id}`} className="group block">
                <div className={`
                    relative overflow-hidden h-full flex flex-col
                    bg-white dark:bg-gray-800/50 
                    rounded-2xl
                    border border-gray-100 dark:border-gray-700/50
                    hover:border-purple-400/50 dark:hover:border-purple-500/50
                    shadow-lg hover:shadow-2xl hover:shadow-purple-500/10
                    backdrop-blur-sm
                    transition-all duration-500
                    ${variant === 'featured' ? 'p-2' : 'p-3'}
                `}>
                    {/* Gradient overlay on hover */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none rounded-2xl z-0"
                    />

                    {/* Image Container */}
                    <div className={`
                        relative overflow-hidden 
                        bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 
                        rounded-xl
                        ${variant === 'compact' ? 'h-48' : 'h-64'}
                    `}>
                        {/* Image Skeleton */}
                        <AnimatePresence>
                            {!imageLoaded && (
                                <motion.div
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className={`
                                object-cover 
                                group-hover:scale-110 
                                transition-transform duration-700 ease-out
                                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                            `}
                            onLoad={() => setImageLoaded(true)}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />

                        {/* Shine effect on hover */}
                        <motion.div
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: isHovered ? '200%' : '-100%', opacity: isHovered ? 0.3 : 0 }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
                            style={{ width: '50%' }}
                        />

                        {/* Badges Container */}
                        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                            {product.discount && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-sm"
                                >
                                    <Zap className="w-3.5 h-3.5 fill-white" />
                                    -{product.discount}%
                                </motion.div>
                            )}
                            {isNew && (
                                <motion.div
                                    initial={{ scale: 0, x: -20 }}
                                    animate={{ scale: 1, x: 0 }}
                                    transition={{ delay: 0.1, type: 'spring' }}
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    NEW
                                </motion.div>
                            )}
                            {isHot && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.15, type: 'spring' }}
                                    className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
                                >
                                    <TrendingUp className="w-3 h-3" />
                                    HOT
                                </motion.div>
                            )}
                            {isBestSeller && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
                                >
                                    <Package className="w-3 h-3" />
                                    BESTSELLER
                                </motion.div>
                            )}
                        </div>

                        {/* Stock Badge */}
                        {!product.inStock && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-3 right-3 bg-gray-900/90 text-white px-3 py-1.5 rounded-full text-sm font-semibold z-20 backdrop-blur-sm"
                            >
                                Out of Stock
                            </motion.div>
                        )}

                        {/* Mobile Wishlist Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleToggleWishlist}
                            className="md:hidden absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 shadow-lg backdrop-blur-sm border border-gray-100 dark:border-gray-700"
                        >
                            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                        </motion.button>

                        {/* Quick Actions - Appear on hover (Desktop) */}
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="hidden md:flex absolute top-3 right-3 flex-col gap-2 z-20"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleToggleWishlist}
                                        className={`
                                            p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg 
                                            ${inWishlist
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white/95 dark:bg-gray-800/95 text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white'
                                            }
                                        `}
                                    >
                                        <Heart className={`w-4 h-4 transition-transform ${inWishlist ? 'fill-current scale-110' : ''}`} />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.15, rotate: -5 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleQuickView}
                                        className="p-2.5 rounded-full bg-white/95 dark:bg-gray-800/95 text-gray-700 dark:text-gray-200 hover:bg-purple-600 hover:text-white backdrop-blur-md transition-all shadow-lg"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleAddToCompare}
                                        disabled={inCompare}
                                        className={`
                                            p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg 
                                            ${inCompare
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white/95 dark:bg-gray-800/95 text-gray-700 dark:text-gray-200 hover:bg-blue-600 hover:text-white'
                                            }
                                        `}
                                    >
                                        <GitCompare className="w-4 h-4" />
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Add to Cart Button - Slides up on hover */}
                        <AnimatePresence>
                            {isHovered && product.inStock && (
                                <motion.button
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 100, opacity: 0 }}
                                    transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart}
                                    className={`
                                        absolute bottom-0 left-0 right-0 
                                        py-3.5 font-semibold 
                                        hidden md:flex items-center justify-center gap-2 
                                        shadow-lg z-20
                                        transition-all duration-300
                                        ${showAddedAnimation
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                        }
                                        text-white
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
                                                exit={{ opacity: 0, scale: 0 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Check className="w-5 h-5" />
                                                Added!
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="add"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center gap-2"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                                Quick Add
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col mt-4 px-1 relative z-10">
                        {/* Category */}
                        <motion.p
                            className="text-sm text-purple-600 dark:text-purple-400 mb-1 font-medium tracking-wide uppercase"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {product.category}
                        </motion.p>

                        {/* Product Name */}
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 leading-tight text-base">
                            {product.name}
                        </h3>

                        {/* Rating with micro-animation */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Star
                                            className={`w-3.5 h-3.5 ${i < Math.floor(product.rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300 dark:text-gray-600'
                                                }`}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {product.rating} ({product.reviews})
                            </span>
                        </div>

                        {/* Price with animation */}
                        {/* Price with Mobile Action */}
                        <div className="flex items-center justify-between mt-auto gap-2">
                            <div className="flex flex-col gap-0.5">
                                {product.discount ? (
                                    <>
                                        <div className="flex items-baseline gap-2">
                                            <motion.span
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                                            >
                                                ${discountedPrice.toFixed(2)}
                                            </motion.span>
                                            <span className="text-sm text-gray-400 line-through decoration-2">
                                                ${product.price.toFixed(2)}
                                            </span>
                                        </div>
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="text-[10px] font-semibold text-green-500 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full w-fit"
                                        >
                                            Save ${(product.price - discountedPrice).toFixed(2)}
                                        </motion.span>
                                    </>
                                ) : (
                                    <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                        ${product.price.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            {/* Mobile Add to Cart Button */}
                            {product.inStock && (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart}
                                    className={`
                                        md:hidden flex items-center justify-center
                                        w-10 h-10 rounded-full
                                        bg-purple-600 text-white
                                        shadow-lg shadow-purple-500/30
                                        ${isAddingToCart ? 'opacity-80' : ''}
                                    `}
                                >
                                    {isAddingToCart ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : showAddedAnimation ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <ShoppingCart className="w-5 h-5" />
                                    )}
                                </motion.button>
                            )}
                        </div>

                        {/* Stock Progress Bar */}
                        {product.inStock && (
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                                    <span className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        In Stock
                                    </span>
                                    <span className="font-medium">{stockLeft} left</span>
                                </div>
                                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${stockPercentage}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                                        className={`h-full rounded-full ${stockPercentage > 70
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                            : stockPercentage > 30
                                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                                : 'bg-gradient-to-r from-red-500 to-pink-500'
                                            }`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
