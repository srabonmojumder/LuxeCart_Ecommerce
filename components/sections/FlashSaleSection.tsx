'use client';

import { motion } from 'framer-motion';
import Countdown from 'react-countdown';
import { Zap, Clock, ArrowRight, Flame } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/store/useStore';

interface FlashSaleSectionProps {
    products: Product[];
    endDate: Date;
    onQuickView: (product: Product) => void;
}

// Custom renderer for the countdown
const renderer = ({ days, hours, minutes, seconds, completed }: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
}) => {
    if (completed) {
        return (
            <div className="text-slate-600 dark:text-slate-400 text-lg font-semibold">
                Sale has ended. Check back for new deals!
            </div>
        );
    }

    const TimeBlock = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <motion.div
                key={value}
                initial={{ y: -5, opacity: 0.5 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-slate-800 rounded-xl px-3 py-2 md:px-5 md:py-3 shadow-md border border-slate-100 dark:border-slate-700 min-w-[52px] md:min-w-[72px]"
            >
                <span className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tabular-nums">
                    {value.toString().padStart(2, '0')}
                </span>
            </motion.div>
            <span className="text-[10px] md:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5 uppercase tracking-wider">
                {label}
            </span>
        </div>
    );

    return (
        <div className="flex items-start justify-center gap-2 md:gap-3">
            {days > 0 && (
                <>
                    <TimeBlock value={days} label="Days" />
                    <span className="text-2xl md:text-3xl font-bold text-orange-500 mt-2 md:mt-3">:</span>
                </>
            )}
            <TimeBlock value={hours} label="Hours" />
            <span className="text-2xl md:text-3xl font-bold text-orange-500 mt-2 md:mt-3">:</span>
            <TimeBlock value={minutes} label="Mins" />
            <span className="text-2xl md:text-3xl font-bold text-orange-500 mt-2 md:mt-3">:</span>
            <TimeBlock value={seconds} label="Secs" />
        </div>
    );
};

export default function FlashSaleSection({ products, endDate, onQuickView }: FlashSaleSectionProps) {
    return (
        <section className="py-12 md:py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-slate-900 dark:via-slate-900 dark:to-orange-950/30 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-50 dark:opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(251, 146, 60, 0.15) 1px, transparent 0)`,
                    backgroundSize: '32px 32px',
                }} />
            </div>

            {/* Animated Blobs */}
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 dark:bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2"
            />
            <motion.div
                animate={{
                    x: [0, -30, 0],
                    y: [0, 40, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200/30 dark:bg-amber-500/10 rounded-full blur-3xl translate-y-1/2"
            />

            <div className="section-container relative z-10">
                {/* Header */}
                <div className="text-center mb-10 md:mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg shadow-orange-500/25"
                    >
                        <Flame className="w-4 h-4" />
                        Limited Time Offer
                        <Zap className="w-4 h-4 fill-current" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
                    >
                        Flash Sale
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="text-slate-600 dark:text-slate-300 text-lg mb-8 max-w-xl mx-auto"
                    >
                        Grab these incredible deals before they're gone. Up to{' '}
                        <span className="font-bold text-orange-600 dark:text-orange-400">50% OFF</span>{' '}
                        on selected items!
                    </motion.p>

                    {/* Countdown Timer */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mb-10"
                    >
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Sale Ends In
                            </span>
                        </div>
                        <Countdown date={endDate} renderer={renderer} />
                    </motion.div>
                </div>

                {/* Products Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                >
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                        >
                            <ProductCard
                                product={product}
                                onQuickView={onQuickView}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-10 md:mt-14"
                >
                    <Link href="/products?filter=sale">
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg shadow-orange-500/25 transition-all"
                        >
                            View All Sale Items
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
