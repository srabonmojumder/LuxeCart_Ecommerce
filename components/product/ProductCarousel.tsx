'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import ProductCard from './ProductCard';
import { Product } from '@/store/useStore';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

interface ProductCarouselProps {
    products: Product[];
    title?: string;
    subtitle?: string;
    onQuickView?: (product: Product) => void;
    autoplay?: boolean;
    effect?: 'slide' | 'coverflow';
}

export default function ProductCarousel({
    products,
    title,
    subtitle,
    onQuickView,
    autoplay = false,
    effect = 'slide'
}: ProductCarouselProps) {
    return (
        <div className="relative">
            {/* Header */}
            {(title || subtitle) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8 text-center"
                >
                    {title && (
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p className="text-gray-600 dark:text-gray-400">
                            {subtitle}
                        </p>
                    )}
                </motion.div>
            )}

            {/* Custom Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 pointer-events-none">
                <div className="container mx-auto px-4 flex justify-between">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="swiper-button-prev-custom pointer-events-auto -ml-4 md:-ml-6 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-xl hidden md:flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 border border-gray-200 dark:border-gray-700"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="swiper-button-next-custom pointer-events-auto -mr-4 md:-mr-6 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-xl hidden md:flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 border border-gray-200 dark:border-gray-700"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </motion.button>
                </div>
            </div>

            {/* Swiper Carousel */}
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                spaceBetween={24}
                slidesPerView={1}
                navigation={{
                    prevEl: '.swiper-button-prev-custom',
                    nextEl: '.swiper-button-next-custom',
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                autoplay={autoplay ? {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                } : false}
                effect={effect}
                coverflowEffect={effect === 'coverflow' ? {
                    rotate: 30,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                } : undefined}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                    1280: {
                        slidesPerView: 4,
                    },
                }}
                className="!pb-14"
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id}>
                        <ProductCard
                            product={product}
                            onQuickView={onQuickView}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
