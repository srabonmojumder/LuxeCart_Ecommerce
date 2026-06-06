'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Slide {
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

const fallbackSlides: Slide[] = [
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
        bgColor: 'from-accent-900 via-accent-800 to-accent-950',
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
        bgColor: 'from-slate-950 via-accent-900 to-slate-950',
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
        bgColor: 'from-accent-950 via-accent-800 to-accent-900',
    },
];

interface HeroCarouselProps {
    /** Pass dynamic banners (mapped to Slide). If empty/undefined, demo slides show. */
    slides?: Slide[];
}

export default function HeroCarousel({ slides: slidesProp }: HeroCarouselProps = {}) {
    const slides = useMemo(
        () => (slidesProp && slidesProp.length > 0 ? slidesProp : fallbackSlides),
        [slidesProp]
    );
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [direction, setDirection] = useState(0);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

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
        <section className="relative h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-accent/10">
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
                    className={`absolute inset-0 bg-gradient-to-br ${slide.bgColor}`}
                >
                    {/* Background Image Overlay (subtle) */}
                    <div className="absolute inset-0 opacity-15">
                        <Image
                            src={slide.image}
                            alt=""
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Decorative glow orbs */}
                    <div className="absolute -top-32 -left-20 w-96 h-96 bg-accent/40 rounded-full blur-[120px]" />
                    <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-accent/25 rounded-full blur-[120px]" />

                    {/* Subtle dot pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                    />
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
                            {/* Badge — refined glass pill */}
                            {slide.badge && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] font-medium uppercase tracking-[0.2em] rounded-full mb-5"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-300 animate-pulse" />
                                    {slide.badge}
                                </motion.span>
                            )}

                            {/* Subtitle (brand accent) */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="text-accent-300 font-medium tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-3"
                            >
                                {slide.subtitle}
                            </motion.p>

                            {/* Title — premium editorial */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white mb-5 leading-[1.05]"
                            >
                                {slide.title}
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="text-white/70 text-sm sm:text-base md:text-lg max-w-lg mx-auto lg:mx-0 mb-7 leading-relaxed"
                            >
                                {slide.description}
                            </motion.p>

                            {/* Price block */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-end gap-4 justify-center lg:justify-start mb-7"
                            >
                                <span className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white tabular-nums leading-none">
                                    ${slide.salePrice.toFixed(2)}
                                </span>
                                <span className="text-lg sm:text-xl text-white/40 line-through font-bold tabular-nums">
                                    ${slide.originalPrice.toFixed(2)}
                                </span>
                                <span className="px-2.5 py-1 bg-hot text-white text-[10px] font-medium uppercase tracking-widest rounded-md">
                                    −{slide.discount}%
                                </span>
                            </motion.div>

                            {/* CTA — white pill on dark bg = premium */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                <Link href={slide.link}>
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary hover:bg-accent hover:text-white font-medium uppercase tracking-widest text-xs rounded-2xl shadow-2xl transition-colors"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
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
                                {/* Accent glow */}
                                <div className="absolute inset-0 bg-accent/30 rounded-full blur-3xl" />

                                {/* Main Image — float */}
                                <motion.div
                                    animate={{ y: [0, -12, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
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

                                {/* Discount Stamp — clean, no gaudy rotation */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -12 }}
                                    animate={{ scale: 1, rotate: -8 }}
                                    transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                                    className="absolute top-4 right-4 w-20 h-20 bg-white text-primary rounded-2xl flex flex-col items-center justify-center shadow-2xl ring-1 ring-black/5"
                                >
                                    <span className="text-2xl font-medium tracking-tight leading-none">{slide.discount}%</span>
                                    <span className="text-[9px] font-medium tracking-[0.2em] text-accent mt-0.5">OFF</span>
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

            {/* Dot Navigation — accent active */}
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${
                            currentSlide === index
                                ? 'w-8 h-2 bg-accent-300'
                                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Progress Bar — accent gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <motion.div
                    key={currentSlide}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 6, ease: 'linear' }}
                    className="h-full bg-gradient-to-r from-accent-300 via-accent to-accent-300"
                />
            </div>
        </section>
    );
}
