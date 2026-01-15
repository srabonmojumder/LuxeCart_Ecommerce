'use client';

import { motion } from 'framer-motion';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { toast } from 'sonner';

export default function WishlistPage() {
    const wishlist = useStore((state) => state.wishlist);
    const removeFromWishlist = useStore((state) => state.removeFromWishlist);
    const addToCart = useStore((state) => state.addToCart);

    const handleAddAllToCart = () => {
        wishlist.forEach(product => addToCart(product));
        toast.success('All items added to cart!');
    };

    if (wishlist.length === 0) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                    >
                        <Heart className="w-32 h-32 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Your Wishlist is Empty
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Save your favorite items for later!
                    </p>
                    <Link href="/products">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary"
                        >
                            Browse Products
                        </motion.button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 sm:pb-12">
                <div className="flex justify-between items-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-gray-900 dark:text-white"
                    >
                        My Wishlist
                    </motion.h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddAllToCart}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Add All to Cart
                    </motion.button>
                </div>

                <div className="mb-4 text-gray-600 dark:text-gray-400">
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlist.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
