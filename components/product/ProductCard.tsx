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

interface ProductCardProps {
    product: Product;
    onQuickView?: (product: Product) => void;
    variant?: 'default' | 'compact' | 'featured';
}

export default function ProductCard({ product, onQuickView, variant = 'default' }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

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
            <Link href={`/products/${product.id}`} className="block touch-manipulation">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-xl md:rounded-2xl mb-2.5 md:mb-3 group">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />

                    {/* Badges */}
                    <div className="absolute top-2 md:top-3 left-2 md:left-3 flex flex-col gap-1.5">
                        {product.discount && (
                            <span className="bg-hot text-white text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                                -{product.discount}%
                            </span>
                        )}
                        {product.rating >= 4.8 && (
                            <span className="bg-hot text-white text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                                HOT
                            </span>
                        )}
                    </div>

                    {/* Mobile Wishlist Button */}
                    <button
                        onClick={handleToggleWishlist}
                        className={`md:hidden absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${inWishlist ? 'bg-accent text-white' : 'bg-white/90 text-primary'}`}
                    >
                        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>

                    {/* Quick Action Overlay (Desktop) */}
                    <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-primary text-white py-2.5 rounded-lg font-bold text-xs tracking-wide shadow-xl hover:bg-black transition-colors"
                        >
                            ADD TO CART
                        </button>
                    </div>

                    {/* Secondary Actions (Desktop) */}
                    <div className="absolute top-3 right-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex flex-col gap-2">
                        <button
                            onClick={handleToggleWishlist}
                            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors ${inWishlist ? 'bg-accent text-white' : 'bg-white text-primary hover:bg-accent hover:text-white'}`}
                        >
                            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="space-y-0.5 md:space-y-1 px-0.5">
                    <h3 className="text-secondary text-xs md:text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="text-primary font-bold text-sm md:text-base">
                                ${discountedPrice.toFixed(2)}
                            </span>
                            {product.discount && (
                                <span className="text-gray-400 text-[10px] md:text-xs line-through">
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-400 fill-current" />
                            <span className="text-[10px] font-bold text-primary">{product.rating}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
