'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, Share2, Minus, Plus } from 'lucide-react';
import { products } from '@/data/products';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/product/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
    const params = useParams();
    const productId = parseInt(params.id as string);
    const product = products.find(p => p.id === productId);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    const addToCart = useStore((state) => state.addToCart);
    const addToWishlist = useStore((state) => state.addToWishlist);
    const removeFromWishlist = useStore((state) => state.removeFromWishlist);
    const isInWishlist = useStore((state) => state.isInWishlist);

    if (!product) {
        return (
            <div className="pt-20 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Product Not Found
                    </h1>
                    <Link href="/products" className="text-primary-600 hover:underline">
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const inWishlist = isInWishlist(product.id);
    const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        toast.success(`Added ${quantity} item(s) to cart!`);
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

    // Mock images (in real app, product would have multiple images)
    const images = [product.image, product.image, product.image];

    return (
        <div className="pt-20 pb-24 md:pb-0 min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
                    <Link href="/" className="hover:text-primary-600">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-primary-600">Products</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white">{product.name}</span>
                </nav>

                {/* Product Detail */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Images */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative h-96 md:h-[500px] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden"
                        >
                            <Image
                                src={images[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                            {product.discount && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                                    -{product.discount}%
                                </div>
                            )}
                        </motion.div>
                        <div className="grid grid-cols-3 gap-4">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                                        ? 'border-primary-600'
                                        : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                >
                                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                                {product.category}
                            </p>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300 dark:text-gray-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-600 dark:text-gray-400">
                                    {product.rating} ({product.reviews} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-4 mb-6">
                                {product.discount ? (
                                    <>
                                        <span className="text-4xl font-bold text-primary-600">
                                            ${discountedPrice.toFixed(2)}
                                        </span>
                                        <span className="text-2xl text-gray-400 line-through">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                        ${product.price.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {product.description}
                            </p>

                            {/* Stock Status */}
                            <div className="mb-6">
                                {product.inStock ? (
                                    <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                                        <div className="w-2 h-2 bg-green-600 rounded-full" />
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 font-medium">
                                        <div className="w-2 h-2 bg-red-600 rounded-full" />
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Quantity
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-600 transition-colors"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="text-xl font-semibold w-12 text-center text-gray-900 dark:text-white">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-600 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleToggleWishlist}
                                className={`p-3 rounded-lg border-2 transition-colors ${inWishlist
                                    ? 'bg-red-500 border-red-500 text-white'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-red-500 hover:text-red-500'
                                    }`}
                            >
                                <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                            </motion.button>

                            <button className="p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-primary-600 transition-colors">
                                <Share2 className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-center">
                                <Truck className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Free Shipping</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">On orders $50+</p>
                            </div>
                            <div className="text-center">
                                <Shield className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Secure Payment</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">100% protected</p>
                            </div>
                            <div className="text-center">
                                <RotateCcw className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Easy Returns</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">30-day policy</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="mb-16">
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                        <div className="flex gap-8">
                            {['description', 'specifications', 'reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 font-medium capitalize transition-colors ${activeTab === tab
                                        ? 'text-primary-600 border-b-2 border-primary-600'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        {activeTab === 'description' && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    Product Description
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}
                        {activeTab === 'specifications' && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    Specifications
                                </h3>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                    <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                                        <span className="font-medium">Category:</span>
                                        <span>{product.category}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                                        <span className="font-medium">SKU:</span>
                                        <span>LUX{product.id.toString().padStart(6, '0')}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                                        <span className="font-medium">Availability:</span>
                                        <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    Customer Reviews ({product.reviews})
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Average Rating: {product.rating} / 5.0
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            Related Products
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 md:hidden z-50 flex items-center justify-between gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] safe-area-bottom">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Price</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${(discountedPrice * quantity).toFixed(2)}
                    </span>
                </div>
                <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
                >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
