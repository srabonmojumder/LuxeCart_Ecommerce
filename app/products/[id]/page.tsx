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
import StickyMobileBar from '@/components/product/StickyMobileBar';
import { toast } from 'sonner';

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
        <div className="pt-[104px] md:pt-[112px] pb-36 md:pb-8 min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8 lg:py-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-4 md:mb-8 overflow-x-auto">
                    <Link href="/" className="hover:text-teal-600 whitespace-nowrap">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-teal-600 whitespace-nowrap">Products</Link>
                    <span>/</span>
                    <span className="text-slate-900 dark:text-white truncate max-w-[150px] md:max-w-none">{product.name}</span>
                </nav>

                {/* Product Detail */}
                <div className="grid lg:grid-cols-2 gap-4 xs:gap-6 md:gap-8 lg:gap-12 mb-8 md:mb-16">
                    {/* Product Images - Unique Gallery Design */}
                    <div className="w-full">
                        {/* Desktop Layout: Vertical Thumbnails + Main Image */}
                        <div className="hidden md:flex gap-4">
                            {/* Vertical Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex flex-col gap-3 w-20 lg:w-24">
                                    {images.map((img, idx) => (
                                        <motion.button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                                                selectedImage === idx
                                                    ? 'ring-2 ring-teal-500 shadow-lg shadow-teal-500/30'
                                                    : 'opacity-60 hover:opacity-100 grayscale hover:grayscale-0'
                                            }`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`View ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="96px"
                                            />
                                            {selectedImage === idx && (
                                                <div className="absolute inset-0 border-2 border-teal-500 rounded-xl" />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            )}

                            {/* Main Image - Desktop */}
                            <div className="flex-1 relative">
                                <motion.div
                                    key={selectedImage}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 group cursor-zoom-in"
                                >
                                    <Image
                                        src={images[selectedImage]}
                                        alt={`${product.name}`}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        priority
                                        sizes="50vw"
                                    />

                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Image counter */}
                                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
                                        {selectedImage + 1} / {images.length}
                                    </div>
                                </motion.div>

                                {/* Discount Badge - Desktop */}
                                {product.discount && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <motion.span
                                            initial={{ rotate: -12 }}
                                            animate={{ rotate: [-12, -8, -12] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="inline-block bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 text-white px-4 py-2 rounded-xl text-lg font-black shadow-xl shadow-rose-500/30"
                                        >
                                            -{product.discount}% OFF
                                        </motion.span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile/Tablet Layout */}
                        <div className="md:hidden">
                            {/* Main Image Container - Mobile */}
                            <div className="relative mb-3">
                                <motion.div
                                    key={selectedImage}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-lg"
                                >
                                    <Image
                                        src={images[selectedImage]}
                                        alt={`${product.name}`}
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="100vw"
                                    />

                                    {/* Top gradient for better badge visibility */}
                                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />

                                    {/* Discount Badge - Mobile */}
                                    {product.discount && (
                                        <div className="absolute top-3 left-3 z-10">
                                            <span className="inline-flex items-center gap-1 bg-rose-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg">
                                                <span className="text-rose-200">SALE</span>
                                                <span className="bg-white/20 px-1.5 py-0.5 rounded">-{product.discount}%</span>
                                            </span>
                                        </div>
                                    )}

                                    {/* Image counter pill - Mobile */}
                                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                                        {selectedImage + 1} / {images.length}
                                    </div>

                                    {/* Bottom gradient */}
                                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

                                    {/* Product name overlay on image */}
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <p className="text-white/80 text-xs font-medium truncate">{product.category}</p>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Horizontal Thumbnails - Mobile */}
                            {images.length > 1 && (
                                <div className="flex gap-2 px-1 overflow-x-auto pb-1 scrollbar-hide">
                                    {images.map((img, idx) => (
                                        <motion.button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            whileTap={{ scale: 0.95 }}
                                            className={`relative mt-3 flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-200 ${
                                                selectedImage === idx
                                                    ? 'ring-2 ring-teal-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 shadow-md'
                                                    : 'opacity-50 hover:opacity-80'
                                            }`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`View ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                            {selectedImage === idx && (
                                                <div className="absolute inset-0 bg-teal-500/10" />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            )}

                            {/* Progress dots indicator */}
                            {images.length > 1 && (
                                <div className="flex justify-center gap-1.5 mt-3">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                selectedImage === idx
                                                    ? 'w-6 bg-teal-500'
                                                    : 'w-1.5 bg-slate-300 dark:bg-slate-600'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-3 xs:space-y-4 md:space-y-6"
                    >
                        <div>
                            <p className="text-teal-600 dark:text-teal-400 font-medium text-xs xs:text-sm mb-0.5 xs:mb-1 md:mb-2">
                                {product.category}
                            </p>
                            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 xs:mb-3 md:mb-4">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 md:gap-4 mb-2 xs:mb-3 md:mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 md:w-5 md:h-5 ${i < Math.floor(product.rating)
                                                ? 'text-amber-400 fill-current'
                                                : 'text-slate-300 dark:text-slate-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                                    {product.rating} ({product.reviews} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex flex-wrap items-baseline gap-1.5 xs:gap-2 md:gap-4 mb-3 xs:mb-4 md:mb-6">
                                {product.discount ? (
                                    <>
                                        <span className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-teal-600">
                                            ${discountedPrice.toFixed(2)}
                                        </span>
                                        <span className="text-sm xs:text-lg md:text-2xl text-slate-400 line-through">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 xs:px-2 py-0.5 rounded-full">
                                            Save ${(product.price - discountedPrice).toFixed(2)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                                        ${product.price.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            <p className="hidden xs:block text-sm md:text-base text-slate-600 dark:text-slate-400 mb-3 xs:mb-4 md:mb-6 leading-relaxed line-clamp-2 xs:line-clamp-3 sm:line-clamp-none">
                                {product.description}
                            </p>

                            {/* Stock Status */}
                            <div className="mb-2 xs:mb-4 md:mb-6">
                                {product.inStock ? (
                                    <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm md:text-base">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium text-sm md:text-base">
                                        <div className="w-2 h-2 bg-rose-500 rounded-full" />
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div>
                            <label className="block text-xs xs:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 xs:mb-2">
                                Quantity
                            </label>
                            <div className="flex items-center gap-1.5 xs:gap-2 md:gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-1.5 xs:p-2 md:p-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-lg xs:rounded-xl hover:border-teal-500 hover:text-teal-600 transition-colors text-slate-600 dark:text-slate-300"
                                >
                                    <Minus className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                                <span className="text-base xs:text-lg md:text-xl font-semibold w-8 xs:w-10 md:w-12 text-center text-slate-900 dark:text-white">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-1.5 xs:p-2 md:p-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-lg xs:rounded-xl hover:border-teal-500 hover:text-teal-600 transition-colors text-slate-600 dark:text-slate-300"
                                >
                                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-1.5 xs:gap-2 md:gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                                className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-2.5 xs:py-3 md:py-4 px-3 xs:px-4 md:px-6 rounded-xl flex items-center justify-center gap-1.5 xs:gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20 transition-all text-sm xs:text-base"
                            >
                                <ShoppingCart className="w-4 h-4 xs:w-5 xs:h-5" />
                                <span className="hidden xs:inline">Add to Cart</span>
                                <span className="xs:hidden">Add</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleToggleWishlist}
                                className={`p-2.5 xs:p-3 md:p-4 rounded-xl border-2 transition-all flex-shrink-0 ${inWishlist
                                    ? 'bg-rose-500 border-rose-500 text-white'
                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-500 hover:text-rose-500'
                                    }`}
                            >
                                <Heart className={`w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6 ${inWishlist ? 'fill-current' : ''}`} />
                            </motion.button>

                            <button className="hidden xs:flex p-2.5 xs:p-3 md:p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-500 hover:text-teal-600 transition-all flex-shrink-0">
                                <Share2 className="w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6" />
                            </button>
                        </div>

                        {/* Features - Hidden on very small screens */}
                        <div className="hidden xs:grid grid-cols-3 gap-1.5 xs:gap-2 md:gap-4 pt-3 xs:pt-4 md:pt-6 border-t border-slate-200 dark:border-slate-700">
                            <div className="text-center p-1.5 xs:p-2 md:p-3 rounded-lg xs:rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                <Truck className="w-5 h-5 xs:w-6 xs:h-6 md:w-8 md:h-8 mx-auto mb-0.5 xs:mb-1 md:mb-2 text-teal-600" />
                                <p className="text-[10px] xs:text-xs md:text-sm font-medium text-slate-900 dark:text-white leading-tight">Free Ship</p>
                                <p className="text-[9px] xs:text-[10px] md:text-xs text-slate-500 dark:text-slate-400 hidden xs:block">On $50+</p>
                            </div>
                            <div className="text-center p-1.5 xs:p-2 md:p-3 rounded-lg xs:rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                <Shield className="w-5 h-5 xs:w-6 xs:h-6 md:w-8 md:h-8 mx-auto mb-0.5 xs:mb-1 md:mb-2 text-teal-600" />
                                <p className="text-[10px] xs:text-xs md:text-sm font-medium text-slate-900 dark:text-white leading-tight">Secure</p>
                                <p className="text-[9px] xs:text-[10px] md:text-xs text-slate-500 dark:text-slate-400 hidden xs:block">Protected</p>
                            </div>
                            <div className="text-center p-1.5 xs:p-2 md:p-3 rounded-lg xs:rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                <RotateCcw className="w-5 h-5 xs:w-6 xs:h-6 md:w-8 md:h-8 mx-auto mb-0.5 xs:mb-1 md:mb-2 text-teal-600" />
                                <p className="text-[10px] xs:text-xs md:text-sm font-medium text-slate-900 dark:text-white leading-tight">Returns</p>
                                <p className="text-[9px] xs:text-[10px] md:text-xs text-slate-500 dark:text-slate-400 hidden xs:block">30-day</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="mb-12 md:mb-16">
                    <div className="border-b border-slate-200 dark:border-slate-700 mb-4 md:mb-6 overflow-x-auto">
                        <div className="flex gap-4 md:gap-8 min-w-max">
                            {['description', 'specifications', 'reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 md:pb-4 font-medium capitalize transition-colors whitespace-nowrap text-sm md:text-base ${activeTab === tab
                                        ? 'text-teal-600 border-b-2 border-teal-600'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-teal-600'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-700">
                        {activeTab === 'description' && (
                            <div>
                                <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4">
                                    Product Description
                                </h3>
                                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}
                        {activeTab === 'specifications' && (
                            <div>
                                <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4">
                                    Specifications
                                </h3>
                                <ul className="space-y-2 text-xs xs:text-sm md:text-base text-slate-600 dark:text-slate-400">
                                    <li className="flex justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                                        <span className="font-medium flex-shrink-0">Category:</span>
                                        <span className="text-right truncate">{product.category}</span>
                                    </li>
                                    <li className="flex justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                                        <span className="font-medium flex-shrink-0">SKU:</span>
                                        <span className="text-right">LUX{product.id.toString().padStart(6, '0')}</span>
                                    </li>
                                    <li className="flex justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                                        <span className="font-medium flex-shrink-0">Availability:</span>
                                        <span className="text-right">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div>
                                <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4">
                                    Customer Reviews ({product.reviews})
                                </h3>
                                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                                    Average Rating: {product.rating} / 5.0
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-4 md:mb-8">
                            Related Products
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                            {relatedProducts.map((relProduct) => (
                                <ProductCard key={relProduct.id} product={relProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Sticky Mobile Bar */}
            <StickyMobileBar product={product} />
        </div>
    );
}
