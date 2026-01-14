'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowRight,
    ShoppingBag,
    Shield,
    Truck,
    Headphones,
    Star,
    Zap,
    TrendingUp,
    Clock,
    Sparkles,
    Gift,
    CreditCard,
    RotateCcw,
    Award,
    ChevronRight
} from 'lucide-react';
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
    const trendingProducts = products.filter(p => p.rating >= 4.5).slice(0, 4);

    // Flash sale ends in 24 hours
    const flashSaleEndDate = new Date();
    flashSaleEndDate.setHours(flashSaleEndDate.getHours() + 24);

    const handleQuickView = (product: Product) => {
        setQuickViewProduct(product);
        setShowQuickView(true);
    };

    const features = [
        {
            icon: Truck,
            title: 'Free Shipping',
            description: 'On orders over $50',
            gradient: 'from-teal-500 to-emerald-500'
        },
        {
            icon: Shield,
            title: 'Secure Payment',
            description: '100% protected',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: RotateCcw,
            title: 'Easy Returns',
            description: '30-day policy',
            gradient: 'from-orange-500 to-amber-500'
        },
        {
            icon: Headphones,
            title: '24/7 Support',
            description: 'Always here to help',
            gradient: 'from-rose-500 to-pink-500'
        },
    ];

    return (
        <div className="pt-[104px] md:pt-[112px] pb-24 md:pb-0">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 50, 0],
                            y: [0, -30, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-200/30 dark:bg-teal-500/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            x: [0, -50, 0],
                            y: [0, 30, 0],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-emerald-200/30 dark:bg-emerald-500/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ y: [0, -40, 0], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 w-80 h-80 bg-orange-200/20 dark:bg-orange-500/5 rounded-full blur-3xl"
                    />
                </div>

                <div className="relative section-container py-12 md:py-20">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center lg:text-left"
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 backdrop-blur-sm rounded-full border border-teal-200 dark:border-teal-800"
                            >
                                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                <span className="text-teal-700 dark:text-teal-300 font-semibold text-sm">
                                    New Season Collection 2024
                                </span>
                            </motion.div>

                            {/* Headline */}
                            <h1 className="text-display text-slate-900 dark:text-white mb-6">
                                Elevate Your
                                <span className="block text-gradient bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent animate-gradient">
                                    Shopping Experience
                                </span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Discover premium products curated for modern living. Enjoy{' '}
                                <span className="font-semibold text-teal-600 dark:text-teal-400">free shipping</span> on orders over $50 and exclusive member rewards.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                                <Link href="/products">
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-primary flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 w-full sm:w-auto"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        Shop Now
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </Link>
                                <Link href="/categories">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-outline flex items-center justify-center gap-2 w-full sm:w-auto"
                                    >
                                        Explore Collections
                                    </motion.button>
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 md:gap-8">
                                {[
                                    { value: '10K+', label: 'Products' },
                                    { value: '50K+', label: 'Customers' },
                                    { value: '4.9', label: 'Rating', icon: Star },
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className="text-center lg:text-left"
                                    >
                                        <div className="flex items-center gap-1 justify-center lg:justify-start">
                                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                                {stat.value}
                                            </h3>
                                            {stat.icon && <stat.icon className="w-5 h-5 text-amber-400 fill-current" />}
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Hero Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10"
                            >
                                <div className="relative w-full aspect-[4/5] max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20">
                                    <Image
                                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
                                        alt="Premium Shopping"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                                </div>
                            </motion.div>

                            {/* Floating Cards */}
                            <motion.div
                                animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-8 -left-8 glass-dark p-4 rounded-2xl shadow-xl z-20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                                        <Award className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Premium Quality</p>
                                        <p className="text-slate-300 text-xs">Certified Products</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -12, 0], x: [0, -5, 0] }}
                                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-16 -right-4 glass-dark p-4 rounded-2xl shadow-xl z-20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">🎁</div>
                                    <div>
                                        <p className="text-white font-bold text-lg">50% OFF</p>
                                        <p className="text-slate-300 text-xs">Limited Time Offer</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Strip */}
            <section className="py-6 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
                <div className="section-container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-3 p-3"
                            >
                                <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
                                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm md:text-base">
                                        {feature.title}
                                    </h4>
                                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Flash Sale Section */}
            {flashSaleProducts.length > 0 && (
                <FlashSaleSection
                    products={flashSaleProducts}
                    endDate={flashSaleEndDate}
                    onQuickView={handleQuickView}
                />
            )}

            {/* Categories Section */}
            <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900">
                <div className="section-container">
                    <div className="flex items-end justify-between mb-8 md:mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-h2 text-slate-900 dark:text-white mb-2">
                                Shop by Category
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                Explore our curated collections
                            </p>
                        </motion.div>
                        <Link
                            href="/categories"
                            className="hidden md:flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium hover:gap-2 transition-all"
                        >
                            View All
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Link href={`/products?category=${category.name.toLowerCase()}`}>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="relative h-48 md:h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                                    >
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-slate-200 flex items-center gap-1">
                                                {category.count} Products
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </p>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile View All */}
                    <div className="mt-6 text-center md:hidden">
                        <Link href="/categories" className="btn-outline inline-flex items-center gap-2">
                            View All Categories
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16 md:py-20 bg-white dark:bg-slate-800">
                <div className="section-container">
                    <div className="flex items-end justify-between mb-8 md:mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 px-3 py-1.5 rounded-full mb-3">
                                <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                <span className="text-teal-700 dark:text-teal-300 font-semibold text-sm">
                                    Trending
                                </span>
                            </div>
                            <h2 className="text-h2 text-slate-900 dark:text-white mb-2">
                                Featured Products
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                Our handpicked selection of premium items
                            </p>
                        </motion.div>
                        <Link
                            href="/products"
                            className="hidden md:flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium hover:gap-2 transition-all"
                        >
                            View All
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
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
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                View All Products
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recently Viewed */}
            {recentProducts.length > 0 && (
                <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
                    <div className="section-container">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            <h2 className="text-h3 text-slate-900 dark:text-white">
                                Recently Viewed
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {recentProducts.slice(0, 5).map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onQuickView={handleQuickView}
                                    variant="compact"
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials */}
            <section className="py-16 md:py-20 bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                <div className="section-container">
                    <div className="text-center mb-10 md:mb-14">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-h2 text-slate-900 dark:text-white mb-3">
                                Loved by Customers
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                                Join thousands of satisfied customers who trust us for their shopping needs
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="card h-full border-teal-100 dark:border-teal-800/50">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-teal-100 dark:ring-teal-800">
                                            <Image
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white">
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                                        ))}
                                    </div>

                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                        "{testimonial.comment}"
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-600 relative overflow-hidden">
                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="section-container relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        <Gift className="w-12 h-12 text-white/80 mx-auto mb-4" />
                        <h2 className="text-h2 text-white mb-4">
                            Get 15% Off Your First Order
                        </h2>
                        <p className="text-lg text-white/90 mb-8">
                            Subscribe to our newsletter for exclusive deals, new arrivals, and insider-only discounts.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-5 py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg text-slate-900 placeholder:text-slate-400"
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                            >
                                Subscribe
                            </motion.button>
                        </div>
                        <p className="text-sm text-white/70 mt-4">
                            No spam, unsubscribe anytime. Read our Privacy Policy.
                        </p>
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
