'use client';

import { X, ShoppingCart, Heart, Star, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Product } from '@/store/useStore';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

interface QuickViewModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
    const addToCart = useStore((state) => state.addToCart);
    const addToWishlist = useStore((state) => state.addToWishlist);

    if (!product) return null;

    const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

    const handleAddToCart = () => {
        addToCart(product);
        toast.success('Added to cart!');
    };

    const handleAddToWishlist = () => {
        addToWishlist(product);
        toast.success('Added to wishlist!');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl z-50 px-4"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                            <div className="grid md:grid-cols-2 gap-6 p-6">
                                {/* Image */}
                                <div className="relative h-96 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden group">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {product.discount && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                                            -{product.discount}%
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full">
                                        <ZoomIn className="w-5 h-5" />
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex flex-col">
                                    <button
                                        onClick={onClose}
                                        className="self-end p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>

                                    <div className="flex-1">
                                        <p className="text-purple-600 dark:text-purple-400 font-medium mb-2">
                                            {product.category}
                                        </p>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                            {product.name}
                                        </h2>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                                ? 'text-yellow-400 fill-current'
                                                                : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                ({product.reviews} reviews)
                                            </span>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-center gap-3 mb-4">
                                            {product.discount ? (
                                                <>
                                                    <span className="text-3xl font-bold text-purple-600">
                                                        ${discountedPrice.toFixed(2)}
                                                    </span>
                                                    <span className="text-xl text-gray-400 line-through">
                                                        ${product.price.toFixed(2)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                                    ${product.price.toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                                            {product.description}
                                        </p>

                                        {/* Stock */}
                                        <div className="mb-6">
                                            {product.inStock ? (
                                                <span className="inline-flex items-center gap-2 text-green-600">
                                                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                                                    In Stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2 text-red-600">
                                                    <div className="w-2 h-2 bg-red-600 rounded-full" />
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleAddToCart}
                                                disabled={!product.inStock}
                                                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={handleAddToWishlist}
                                                className="p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
                                            >
                                                <Heart className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
