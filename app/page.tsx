'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Shield, Truck, Headphones, Star, Zap, TrendingUp, Clock } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import QuickViewModal from '@/components/product/QuickViewModal';
import FlashSaleSection from '@/components/sections/FlashSaleSection';
import NewsletterPopup from '@/components/ui/NewsletterPopup';
import { products, categories, testimonials } from '@/data/products';
import { Product } from '@/store/useStore';
import { useRecentlyViewedStore } from '@/store/useRecentlyViewedStore';

export default function Home() {
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [showQuickView, setShowQuickView] = useState(false);
    const recentProducts = useRecentlyViewedStore((state) => state.recentProducts);

    const featuredProducts = products.slice(0, 8);
    const flashSaleProducts = products.filter(p => p.discount && p.discount >= 15).slice(0, 4);

    // Flash sale ends in 24 hours
    const flashSaleEndDate = new Date();
    flashSaleEndDate.setHours(flashSaleEndDate.getHours() + 24);

    const handleQuickView = (product: Product) => {
        setQuickViewProduct(product);
        setShowQuickView(true);
    };

    return (
        <div className="pt-24 md:pt-26 pb-20 md:pb-0">{/* Added bottom padding for mobile nav */}
            {/* Hero Section with Parallax Effect */}
            <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                            x: [0, 100, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute top-1/4 -left-20 w-64 h-64 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [90, 0, 90],
                            x: [0, -100, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-200/30 dark:bg-pink-500/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            y: [0, 50, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl"
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-full border border-purple-200 dark:border-purple-800"
                            >
                                <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400" />
                                <span className="text-purple-600 dark:text-purple-400 font-semibold">Flash Sale - Limited Time!</span>
                            </motion.div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                Discover Your
                                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                                    Perfect Style
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
                                Shop the latest trends with exclusive deals. Premium quality products delivered right to your doorstep with <span className="font-bold text-purple-600">free shipping</span> on orders over $50!
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/products">
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn-primary group flex items-center justify-center gap-2 shadow-xl"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        Shop Now
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </Link>
                                <Link href="/categories">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn-outline flex items-center justify-center gap-2"
                                    >
                                        Browse Categories
                                    </motion.button>
                                </Link>
                            </div>

                            {/* Stats with Animation */}
                            <div className="grid grid-cols-3 gap-6 mt-12">
                                {[
                                    { value: '10K+', label: 'Products' },
                                    { value: '50K+', label: 'Happy Customers' },
                                    { value: '4.9', label: 'Rating' },
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                    >
                                        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            {stat.value}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Hero Image with Enhanced Animations */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative hidden lg:block"
                        >
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10"
                            >
                                <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
                                        alt="Shopping"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />
                                </div>
                            </motion.div>

                            {/* Floating Cards with Enhanced Design */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute top-10 -left-10 glass-dark p-4 rounded-2xl shadow-2xl border border-white/20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-2xl">
                                        ✓
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">Order Confirmed</p>
                                        <p className="text-gray-300 text-sm">Just now</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                                className="absolute bottom-10 -right-10 glass-dark p-4 rounded-2xl shadow-2xl border border-white/20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">🎉</div>
                                    <div>
                                        <p className="text-white font-semibold text-lg">50% OFF</p>
                                        <p className="text-gray-300 text-sm">Limited Offer</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Flash Sale Section with Countdown */}
            {flashSaleProducts.length > 0 && (
                <FlashSaleSection
                    products={flashSaleProducts}
                    endDate={flashSaleEndDate}
                    onQuickView={handleQuickView}
                />
            )}

            {/* Features Section with Icons Animation */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Truck, title: 'Free Shipping', description: 'On orders over $50', color: 'from-blue-500 to-cyan-500' },
                            { icon: Shield, title: 'Secure Payment', description: '100% secure transactions', color: 'from-green-500 to-emerald-500' },
                            { icon: Headphones, title: '24/7 Support', description: 'Dedicated customer service', color: 'from-purple-500 to-pink-500' },
                            { icon: ShoppingBag, title: 'Easy Returns', description: '30-day return policy', color: 'from-orange-500 to-red-500' },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                className="text-center group"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-4 shadow-lg group-hover:shadow-2xl`}
                                >
                                    <feature.icon className="w-8 h-8 text-white" />
                                </motion.div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                        >
                            Shop by Category
                        </motion.h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Explore our wide range of premium products
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <Link href={`/products?category=${category.name.toLowerCase()}`}>
                                    <div className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                        <div className="absolute bottom-6 left-6 text-white">
                                            <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                                            <p className="text-sm text-gray-200 flex items-center gap-1">
                                                {category.count} Products
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-20 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full mb-4">
                                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <span className="text-purple-600 dark:text-purple-400 font-semibold">Trending Now</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                Featured Products
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Discover our handpicked selection of premium products
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
                        {featuredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onQuickView={handleQuickView}
                            />
                        ))}
                    </div>

                    <div className="text-center">
                        <Link href="/products">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                View All Products
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recently Viewed Section */}
            {recentProducts.length > 0 && (
                <section className="py-16 bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <Clock className="w-6 h-6 text-purple-600" />
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Recently Viewed
                                </h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                            {recentProducts.slice(0, 5).map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onQuickView={handleQuickView}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials Section */}
            <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                        >
                            What Our Customers Say
                        </motion.h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Join thousands of satisfied customers worldwide
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className="card border border-purple-200 dark:border-purple-800"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-purple-100 dark:ring-purple-900">
                                        <Image
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex mb-3">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 italic">
                                    "{testimonial.comment}"
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Start Shopping?
                        </h2>
                        <p className="text-xl text-white/90 mb-8">
                            Join our community and get exclusive offers delivered to your inbox
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg text-lg"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg text-lg"
                            >
                                Subscribe
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Quick View Modal */}
            <QuickViewModal
                product={quickViewProduct}
                isOpen={showQuickView}
                onClose={() => setShowQuickView(false)}
            />

            {/* Newsletter Popup */}
            <NewsletterPopup />
        </div>
    );
}
