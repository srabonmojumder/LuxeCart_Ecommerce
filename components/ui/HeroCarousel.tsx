'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    originalPrice: number;
    salePrice: number;
    discount: number;
    image: string;
    badge?: string;
    cta: string;
    link: string;
    bgColor: string;
}

const slides: Slide[] = [
    {
        id: 1,
        title: "Don't Miss The Opportunity",
        subtitle: 'Premium Electronics',
        description: 'Discover our latest collection of premium gadgets and accessories with exclusive discounts.',
        originalPrice: 299.99,
        salePrice: 149.99,
        discount: 50,
        image: '/photo-1505740420928-5e560c06d30e.webp',
        badge: 'Hot Deal',
        cta: 'Shop Now',
        link: '/products?category=electronics',
        bgColor: 'from-slate-900 via-slate-800 to-slate-900',
    },
    {
        id: 2,
        title: 'New Season Collection',
        subtitle: 'Fashion & Style',
        description: 'Explore trending fashion items curated just for you. Premium quality at unbeatable prices.',
        originalPrice: 199.99,
        salePrice: 99.99,
        discount: 50,
        image: '/photo-1441986300917-64674bd600d8.webp',
        badge: 'New Arrival',
        cta: 'Explore Collection',
        link: '/products?category=fashion',
        bgColor: 'from-teal-900 via-teal-800 to-emerald-900',
    },
    {
        id: 3,
        title: 'Home & Living Sale',
        subtitle: 'Transform Your Space',
        description: 'Beautiful furniture and decor pieces to make your house feel like home.',
        originalPrice: 499.99,
        salePrice: 299.99,
        discount: 40,
        image: '/photo-1555041469-a586c61ea9bc.webp',
        badge: 'Limited Time',
        cta: 'View Deals',
        link: '/products?category=home',
        bgColor: 'from-amber-900 via-orange-800 to-rose-900',
    },
];

export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [direction, setDirection] = useState(0);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, []);

    const goToSlide = (index: number) => {
        setDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 8000);
    };

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(nextSlide, 6000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    const slide = slides[currentSlide];

    return (
        <section className="relative h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] overflow-hidden">
            {/* Background */}
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor}`}
                >
                    {/* Background Image Overlay */}
                    <div className="absolute inset-0 opacity-20">
                        <Image
                            src={slide.image}
                            alt=""
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-full grid lg:grid-cols-2 gap-8 items-center py-8 lg:py-12">
                    {/* Text Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`content-${currentSlide}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="text-center lg:text-left z-10"
                        >
                            {/* Badge */}
                            {slide.badge && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="inline-block px-4 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full mb-4"
                                >
                                    {slide.badge}
                                </motion.span>
                            )}

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="text-teal-400 font-medium text-sm sm:text-base mb-2"
                            >
                                {slide.subtitle}
                            </motion.p>

                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                            >
                                {slide.title}
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="text-slate-300 text-sm sm:text-base md:text-lg max-w-lg mx-auto lg:mx-0 mb-6"
                            >
                                {slide.description}
                            </motion.p>

                            {/* Price */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-4 justify-center lg:justify-start mb-6"
                            >
                                <span className="text-3xl sm:text-4xl font-bold text-white">
                                    ${slide.salePrice.toFixed(2)}
                                </span>
                                <span className="text-lg sm:text-xl text-slate-400 line-through">
                                    ${slide.originalPrice.toFixed(2)}
                                </span>
                                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                                    -{slide.discount}%
                                </span>
                            </motion.div>

                            {/* CTA Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                <Link href={slide.link}>
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/30 transition-all"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        {slide.cta}
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Product Image */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`image-${currentSlide}`}
                            initial={{ opacity: 0, scale: 0.9, x: 50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: -50 }}
                            transition={{ duration: 0.4 }}
                            className="hidden lg:block relative z-10"
                        >
                            <div className="relative w-full aspect-square max-w-lg mx-auto">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-3xl" />

                                {/* Main Image */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    className="relative w-full h-full"
                                >
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        priority
                                    />
                                </motion.div>

                                {/* Discount Badge */}
                                <motion.div
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg"
                                >
                                    <div className="text-center">
                                        <span className="text-xl font-bold text-white">{slide.discount}%</span>
                                        <span className="block text-[10px] text-white/90">OFF</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={() => {
                    prevSlide();
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 8000);
                }}
                className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all group"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
                onClick={() => {
                    nextSlide();
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 8000);
                }}
                className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all group"
                aria-label="Next slide"
            >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Dot Navigation */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${
                            currentSlide === index
                                ? 'w-8 h-2 bg-teal-500'
                                : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <motion.div
                    key={currentSlide}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 6, ease: 'linear' }}
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500"
                />
            </div>
        </section>
    );
}
