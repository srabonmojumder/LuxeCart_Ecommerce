'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Eye, Zap, TrendingUp, Sparkles, Check, GitCompare } from 'lucide-react';
import { Product } from '@/store/useStore';
import { useStore } from '@/store/useStore';
import { useCompareStore } from '@/store/useCompareStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import QuickViewModal from '@/components/product/QuickViewModal';

interface ProductCardProps {
    product: Product;
    onQuickView?: (product: Product) => void;
    variant?: 'default' | 'compact' | 'featured';
}

export default function ProductCard({ product, onQuickView, variant = 'default' }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [quickViewOpen, setQuickViewOpen] = useState(false);

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Parent-controlled override stays supported (e.g. FlashSaleSection),
        // but in the common case we manage the modal locally.
        if (onQuickView) onQuickView(product);
        else setQuickViewOpen(true);
    };

    const addToCart = useStore((state) => state.addToCart);
    const addToWishlist = useStore((state) => state.addToWishlist);
    const removeFromWishlist = useStore((state) => state.removeFromWishlist);
    const isInWishlist = useStore((state) => state.isInWishlist);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const inWishlist = hasMounted && isInWishlist(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        toast.success('Added to cart!');
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

    const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group block"
        >
            <Link href={`/products/${product.slug ?? product.id}`} className="block touch-manipulation">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#efece5] dark:bg-ink-900 rounded-xl md:rounded-2xl mb-3.5 group">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className={`object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-[1.04]' : 'scale-100'}`}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />

                    {/* Badges — quiet, editorial */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.discount ? (
                            <span className="bg-primary text-white text-[10px] font-medium tracking-[0.1em] px-2.5 py-1 rounded-full">
                                −{product.discount}%
                            </span>
                        ) : null}
                        {product.rating >= 4.8 && (
                            <span className="bg-ivory/95 text-primary text-[10px] font-medium tracking-[0.14em] uppercase px-2.5 py-1 rounded-full backdrop-blur-sm">
                                Bestseller
                            </span>
                        )}
                    </div>

                    {/* Mobile Wishlist Button */}
                    <button
                        onClick={handleToggleWishlist}
                        className={`md:hidden absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${inWishlist ? 'bg-accent text-white' : 'bg-white/90 dark:bg-ink-900/90 text-primary dark:text-white'}`}
                    >
                        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>

                    {/* Quick Action Overlay (Desktop) */}
                    <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-primary/95 dark:bg-white text-white dark:text-primary py-3 rounded-full font-medium text-xs tracking-[0.12em] uppercase shadow-medium hover:bg-ink-950 dark:hover:bg-gray-100 backdrop-blur-sm transition-colors"
                        >
                            Add to Bag
                        </button>
                    </div>

                    {/* Secondary Actions (Desktop) */}
                    <div className="absolute top-3 right-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex flex-col gap-2">
                        <button
                            onClick={handleQuickView}
                            aria-label="Quick view"
                            className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors bg-white dark:bg-ink-800 text-primary dark:text-white hover:bg-accent hover:text-white"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleToggleWishlist}
                            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors ${inWishlist ? 'bg-accent text-white' : 'bg-white dark:bg-ink-800 text-primary dark:text-white hover:bg-accent hover:text-white'}`}
                        >
                            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="space-y-1.5 px-0.5">
                    <h3 className="font-display text-[15px] md:text-base font-medium text-primary dark:text-white line-clamp-1 group-hover:text-accent-700 dark:group-hover:text-accent-300 transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                            <span className="text-primary dark:text-white font-sans font-medium text-sm md:text-[15px] tabular-nums">
                                ${discountedPrice.toFixed(2)}
                            </span>
                            {product.discount && (
                                <span className="text-secondary/60 dark:text-gray-500 text-xs line-through tabular-nums">
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-accent fill-current" />
                            <span className="text-[11px] font-sans font-medium text-secondary dark:text-gray-400 tabular-nums">{product.rating}</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Local quick-view modal (parent override via `onQuickView` skips this) */}
            {!onQuickView && (
                <QuickViewModal product={product} isOpen={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
            )}
        </motion.div>
    );
}
