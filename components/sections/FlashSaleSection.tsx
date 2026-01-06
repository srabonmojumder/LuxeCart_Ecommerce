'use client';

import { motion } from 'framer-motion';
import Countdown from 'react-countdown';
import { Zap, Flame, TrendingUp, Sparkles } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/store/useStore';

interface FlashSaleSectionProps {
    products: Product[];
    endDate: Date;
    onQuickView: (product: Product) => void;
}

// Custom renderer for the countdown
const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
        return (
            <div className="text-white text-2xl font-bold">
                Flash Sale Has Ended!
            </div>
        );
    }

    const TimeBlock = ({ value, label }: { value: number; label: string }) => (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative group"
        >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />

            {/* Time box */}
            <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[100px] shadow-2xl border-2 border-white/20">
                <motion.div
                    key={value}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl md:text-5xl font-black bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent"
                >
                    {value.toString().padStart(2, '0')}
                </motion.div>
                <div className="text-xs md:text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">
                    {label}
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
            <TimeBlock value={days} label="Days" />
            <span className="text-white text-3xl font-bold animate-pulse">:</span>
            <TimeBlock value={hours} label="Hours" />
            <span className="text-white text-3xl font-bold animate-pulse">:</span>
            <TimeBlock value={minutes} label="Minutes" />
            <span className="text-white text-3xl font-bold animate-pulse">:</span>
            <TimeBlock value={seconds} label="Seconds" />
        </div>
    );
};

export default function FlashSaleSection({ products, endDate, onQuickView }: FlashSaleSectionProps) {
    return (
        <section className="relative py-20 overflow-hidden">
            {/* Dynamic gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600">
                {/* Animated gradient overlay */}
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        background: [
                            'linear-gradient(45deg, rgba(251, 146, 60, 0.3) 0%, rgba(239, 68, 68, 0.3) 50%, rgba(236, 72, 153, 0.3) 100%)',
                            'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(239, 68, 68, 0.3) 50%, rgba(251, 146, 60, 0.3) 100%)',
                            'linear-gradient(225deg, rgba(239, 68, 68, 0.3) 0%, rgba(251, 146, 60, 0.3) 50%, rgba(236, 72, 153, 0.3) 100%)',
                            'linear-gradient(315deg, rgba(251, 146, 60, 0.3) 0%, rgba(236, 72, 153, 0.3) 50%, rgba(239, 68, 68, 0.3) 100%)',
                        ],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Animated geometric patterns */}
            <div className="absolute inset-0 opacity-10">
                <motion.div
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full"
                    style={{
                        backgroundImage: `
                            repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,255,255,.2) 50px, rgba(255,255,255,.2) 100px),
                            repeating-linear-gradient(-45deg, transparent, transparent 50px, rgba(255,255,255,.1) 50px, rgba(255,255,255,.1) 100px)
                        `,
                        backgroundSize: '200% 200%',
                    }}
                />
            </div>

            {/* Floating particles effect */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    initial={{
                        x: Math.random() * 100 + '%',
                        y: Math.random() * 100 + '%',
                        opacity: Math.random() * 0.5 + 0.2,
                    }}
                    animate={{
                        y: ['-10%', '110%'],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: Math.random() * 3 + 3,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "linear",
                    }}
                />
            ))}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 mb-6"
                    >
                        {/* Animated icons */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-10 h-10 text-yellow-300 fill-yellow-300" />
                        </motion.div>

                        <h2 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl tracking-tight">
                            <span className="inline-flex items-center gap-3">
                                <Flame className="w-12 h-12 md:w-16 md:h-16 text-orange-300 fill-orange-300 animate-pulse" />
                                FLASH SALE
                                <Zap className="w-12 h-12 md:w-16 md:h-16 text-yellow-300 fill-yellow-300 animate-bounce" />
                            </span>
                        </h2>

                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <TrendingUp className="w-10 h-10 text-green-300" />
                        </motion.div>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/90 text-xl md:text-2xl font-bold mb-8 drop-shadow-lg"
                    >
                        🔥 Unbeatable Deals! Limited Time Only! 🔥
                    </motion.p>

                    {/* Countdown Timer */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mb-12"
                    >
                        <div className="inline-block">
                            <div className="text-white text-sm md:text-lg font-bold mb-4 uppercase tracking-wider">
                                ⏰ Sale Ends In ⏰
                            </div>
                            <Countdown date={endDate} renderer={renderer} />
                        </div>
                    </motion.div>

                    {/* Sale badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 px-8 py-4 rounded-full shadow-2xl"
                    >
                        <span className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">
                            UP TO 50% OFF
                        </span>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <Zap className="w-6 h-6 md:w-8 md:h-8 text-white fill-white" />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Products Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            whileHover={{ y: -10 }}
                        >
                            <div className="relative">
                                {/* Product spotlight effect */}
                                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl opacity-0 group-hover:opacity-50 blur-xl transition-opacity" />

                                <ProductCard
                                    product={product}
                                    onQuickView={onQuickView}
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <p className="text-white text-lg md:text-xl font-semibold">
                        ⚡ Hurry! Stocks are limited! ⚡
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
