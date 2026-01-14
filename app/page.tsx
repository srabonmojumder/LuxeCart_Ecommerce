'use client';

import { useState, useEffect, useCallback } from 'react';
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
    ChevronRight,
    ChevronLeft,
    Quote
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

    // Testimonial slider state
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Handle slide navigation
    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        // Resume auto-play after 5 seconds
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    // Auto-play functionality for testimonials
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

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
            <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Modern Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Gradient Mesh */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent" />

                    {/* Animated Orbs */}
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px]"
                    />

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
                </div>

                <div className="relative section-container py-8 md:py-16">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center lg:text-left order-2 lg:order-1"
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 mb-4 md:mb-6 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 backdrop-blur-sm rounded-full border border-teal-500/30"
                            >
                                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-teal-400" />
                                <span className="text-teal-300 font-semibold text-xs md:text-sm">
                                    New Season Collection 2024
                                </span>
                            </motion.div>

                            {/* Headline */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                                Elevate Your
                                <span className="block bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                    Shopping Experience
                                </span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Discover premium products curated for modern living. Enjoy{' '}
                                <span className="font-semibold text-teal-400">free shipping</span> on orders over $50 and exclusive member rewards.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start mb-8 md:mb-10">
                                <Link href="/products" className="w-full sm:w-auto">
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 transition-all"
                                    >
                                        <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                                        Shop Now
                                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                                    </motion.button>
                                </Link>
                                <Link href="/categories" className="w-full sm:w-auto">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border-2 border-slate-600 hover:border-teal-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-white/5"
                                    >
                                        Explore Collections
                                    </motion.button>
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3 md:gap-6">
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
                                        className="text-center lg:text-left p-2 md:p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                                    >
                                        <div className="flex items-center gap-1 justify-center lg:justify-start">
                                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                                                {stat.value}
                                            </h3>
                                            {stat.icon && <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-amber-400 fill-current" />}
                                        </div>
                                        <p className="text-xs md:text-sm text-slate-400">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Hero Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative order-1 lg:order-2"
                        >
                            {/* Mobile Hero Image */}
                            <div className="lg:hidden relative w-full aspect-[4/3] max-w-md mx-auto">
                                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-teal-500/20">
                                    <Image
                                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
                                        alt="Premium Shopping"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                                </div>

                                {/* Mobile Floating Badge */}
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -bottom-4 right-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2"
                                >
                                    <span className="text-lg">🎁</span>
                                    <span className="font-bold">50% OFF</span>
                                </motion.div>
                            </div>

                            {/* Desktop Hero Image */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10 hidden lg:block"
                            >
                                <div className="relative w-full aspect-[4/5] max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-teal-500/20 border border-white/10">
                                    <Image
                                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
                                        alt="Premium Shopping"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                                </div>
                            </motion.div>

                            {/* Desktop Floating Cards */}
                            <motion.div
                                animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="hidden lg:flex absolute top-8 -left-8 bg-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-xl z-20 border border-white/20 items-center gap-3"
                            >
                                <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">Premium Quality</p>
                                    <p className="text-slate-300 text-xs">Certified Products</p>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -12, 0], x: [0, -5, 0] }}
                                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="hidden lg:flex absolute bottom-16 -right-4 bg-gradient-to-r from-orange-500 to-rose-500 p-4 rounded-2xl shadow-xl z-20 items-center gap-3"
                            >
                                <div className="text-3xl">🎁</div>
                                <div>
                                    <p className="text-white font-bold text-lg">50% OFF</p>
                                    <p className="text-white/80 text-xs">Limited Time Offer</p>
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

            {/* Testimonials Slider */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
                <div className="section-container">
                    <div className="text-center mb-10 md:mb-14">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 px-4 py-2 rounded-full mb-4">
                                <Star className="w-4 h-4 text-amber-500 fill-current" />
                                <span className="text-teal-700 dark:text-teal-300 font-semibold text-sm">
                                    Customer Reviews
                                </span>
                            </div>
                            <h2 className="text-h2 text-slate-900 dark:text-white mb-3">
                                Loved by Customers
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                                Join thousands of satisfied customers who trust us for their shopping needs
                            </p>
                        </motion.div>
                    </div>

                    {/* Slider Container */}
                    <div className="relative">
                        {/* Navigation Arrows */}
                        <button
                            onClick={() => {
                                prevSlide();
                                setIsAutoPlaying(false);
                                setTimeout(() => setIsAutoPlaying(true), 5000);
                            }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-10 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors group"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                        </button>
                        <button
                            onClick={() => {
                                nextSlide();
                                setIsAutoPlaying(false);
                                setTimeout(() => setIsAutoPlaying(true), 5000);
                            }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-10 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors group"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                        </button>

                        {/* Slider Track */}
                        <div className="overflow-hidden mx-4 md:mx-8">
                            <motion.div
                                className="flex"
                                animate={{ x: `-${currentSlide * 100}%` }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                {testimonials.map((testimonial) => (
                                    <div
                                        key={testimonial.id}
                                        className="w-full flex-shrink-0 px-2 md:px-4"
                                    >
                                        <div className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                                            {/* Quote decoration */}
                                            <div className="absolute top-4 right-4 md:top-6 md:right-6">
                                                <Quote className="w-8 h-8 md:w-12 md:h-12 text-teal-100 dark:text-teal-900/50 fill-current" />
                                            </div>

                                            {/* Rating */}
                                            <div className="flex gap-1 mb-4 md:mb-6">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 md:w-6 md:h-6 ${
                                                            i < testimonial.rating
                                                                ? 'text-amber-400 fill-current'
                                                                : 'text-slate-200 dark:text-slate-600'
                                                        }`}
                                                    />
                                                ))}
                                            </div>

                                            {/* Comment */}
                                            <p className="text-base md:text-lg lg:text-xl text-slate-700 dark:text-slate-200 leading-relaxed mb-6 md:mb-8 relative z-10">
                                                &ldquo;{testimonial.comment}&rdquo;
                                            </p>

                                            {/* Author */}
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden ring-4 ring-teal-100 dark:ring-teal-800/50">
                                                    <Image
                                                        src={testimonial.image}
                                                        alt={testimonial.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                                                        {testimonial.name}
                                                    </h4>
                                                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
                                                        {testimonial.role}
                                                    </p>
                                                </div>
                                                <div className="ml-auto hidden sm:block">
                                                    <div className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 rounded-full">
                                                        <span className="text-teal-700 dark:text-teal-400 text-sm font-medium">
                                                            Verified Buyer
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Dot Indicators */}
                        <div className="flex justify-center gap-2 mt-6 md:mt-8">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`transition-all duration-300 rounded-full ${
                                        currentSlide === index
                                            ? 'w-8 h-3 bg-gradient-to-r from-teal-500 to-emerald-500'
                                            : 'w-3 h-3 bg-slate-300 dark:bg-slate-600 hover:bg-teal-300 dark:hover:bg-teal-700'
                                    }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Auto-play indicator */}
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                                className="text-sm text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-2"
                            >
                                <span className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-teal-500 animate-pulse' : 'bg-slate-400'}`} />
                                {isAutoPlaying ? 'Auto-playing' : 'Paused'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
                </div>

                <div className="section-container relative z-10">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 px-4 py-2 rounded-full border border-teal-500/30 mb-6"
                            >
                                <Gift className="w-4 h-4 text-teal-400" />
                                <span className="text-teal-300 font-semibold text-sm">Exclusive Offer</span>
                            </motion.div>

                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                Get{' '}
                                <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                                    15% Off
                                </span>
                                <br />
                                Your First Order
                            </h2>

                            <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed max-w-md">
                                Join our community and unlock exclusive deals, early access to new arrivals, and insider-only discounts.
                            </p>

                            {/* Benefits */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {[
                                    { icon: Zap, text: 'Instant discount code' },
                                    { icon: Sparkles, text: 'Early access deals' },
                                    { icon: Gift, text: 'Birthday rewards' },
                                    { icon: Star, text: 'VIP member perks' },
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-4 h-4 text-teal-400" />
                                        </div>
                                        <span className="text-slate-300 text-sm">{item.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right - Subscription Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
                                {/* Discount Badge */}
                                <div className="flex justify-center mb-6">
                                    <motion.div
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="relative"
                                    >
                                        <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 rotate-3">
                                            <div className="text-center">
                                                <span className="text-3xl md:text-4xl font-bold text-white">15%</span>
                                                <span className="block text-white/90 text-xs font-medium">OFF</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-2">
                                    Subscribe & Save
                                </h3>
                                <p className="text-slate-400 text-center text-sm mb-6">
                                    Enter your email to receive your discount code
                                </p>

                                {/* Email Form */}
                                <div className="space-y-3">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Enter your email address"
                                            className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
                                    >
                                        Get My 15% Off
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                </div>

                                {/* Trust Indicators */}
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className="flex items-center justify-center gap-4 text-slate-400 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Shield className="w-3.5 h-3.5" />
                                            <span>No spam</span>
                                        </div>
                                        <div className="w-1 h-1 bg-slate-600 rounded-full" />
                                        <div className="flex items-center gap-1">
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            <span>Unsubscribe anytime</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
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
