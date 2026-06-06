'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useMotionValue } from 'framer-motion';

interface AnimatedCounterProps {
    value: number | string;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
    decimals?: number;
}

export default function AnimatedCounter({
    value,
    duration = 2,
    prefix = '',
    suffix = '',
    className = '',
    decimals = 0
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [displayValue, setDisplayValue] = useState('0');

    // Extract numeric value from string (e.g., "10K+" -> 10000)
    const getNumericValue = (val: number | string): number => {
        if (typeof val === 'number') return val;
        const numMatch = val.match(/[\d.]+/);
        if (!numMatch) return 0;
        let num = parseFloat(numMatch[0]);
        if (val.toLowerCase().includes('k')) num *= 1000;
        if (val.toLowerCase().includes('m')) num *= 1000000;
        return num;
    };

    // Format back to original format
    const formatValue = (num: number, original: number | string): string => {
        if (typeof original === 'string') {
            if (original.toLowerCase().includes('k')) {
                return (num / 1000).toFixed(decimals) + 'K';
            }
            if (original.toLowerCase().includes('m')) {
                return (num / 1000000).toFixed(decimals) + 'M';
            }
            if (original.includes('+')) {
                return Math.round(num).toLocaleString() + '+';
            }
        }
        return decimals > 0 ? num.toFixed(decimals) : Math.round(num).toLocaleString();
    };

    useEffect(() => {
        if (!isInView) return;

        const numericValue = getNumericValue(value);
        const startTime = Date.now();
        const endTime = startTime + duration * 1000;

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / (duration * 1000), 1);

            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = numericValue * easeProgress;

            setDisplayValue(formatValue(currentValue, value));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, value, duration, decimals]);

    return (
        <motion.span
            ref={ref}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, type: 'spring' }}
            className={className}
        >
            {prefix}{displayValue}{suffix}
        </motion.span>
    );
}

// Animated stat card component
interface StatCardProps {
    value: number | string;
    label: string;
    icon?: React.ReactNode;
    prefix?: string;
    suffix?: string;
    trend?: number;
    trendLabel?: string;
}

export function AnimatedStatCard({
    value,
    label,
    icon,
    prefix,
    suffix,
    trend,
    trendLabel
}: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-50/50 to-pink-50/50 dark:from-accent-900/10 dark:to-pink-900/10" />

            <div className="relative z-10">
                {icon && (
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent-500 to-pink-500 rounded-xl text-white shadow-lg">
                        {icon}
                    </div>
                )}

                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-600 to-pink-600 bg-clip-text text-transparent mb-1">
                    <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
                </div>

                <p className="text-gray-600 dark:text-gray-400 font-medium">{label}</p>

                {trend !== undefined && (
                    <div className={`mt-2 flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <span>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
                        {trendLabel && <span className="text-gray-400">{trendLabel}</span>}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
