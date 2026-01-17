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
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group block"
        >
            <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-2xl mb-4 group">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                        onLoad={() => setImageLoaded(true)}
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.discount && (
                            <span className="bg-hot text-white text-[10px] font-bold px-2 py-1 rounded">
                                -{product.discount}%
                            </span>
                        )}
                        {product.rating >= 4.8 && (
                            <span className="bg-hot text-white text-[10px] font-bold px-2 py-1 rounded">
                                HOT
                            </span>
                        )}
                    </div>

                    {/* Quick Action Overlay (Desktop) */}
                    <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm tracking-wide shadow-xl hover:bg-black transition-colors"
                        >
                            ADD TO CART
                        </button>
                    </div>

                    {/* Secondary Actions (Desktop) */}
                    <div className="absolute top-4 right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex flex-col gap-2">
                        <button
                            onClick={handleToggleWishlist}
                            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${inWishlist ? 'bg-accent text-white' : 'bg-white text-primary hover:bg-accent hover:text-white'}`}
                        >
                            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="space-y-1 px-1">
                    <h3 className="text-secondary text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-primary font-bold">
                                ${discountedPrice.toFixed(2)}
                            </span>
                            {product.discount && (
                                <span className="text-gray-400 text-xs line-through">
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
