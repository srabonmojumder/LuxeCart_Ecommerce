'use client';

import { motion } from 'framer-motion';
import { Shield, Truck, RefreshCcw, Award, CreditCard, Headphones, Lock, Timer } from 'lucide-react';

interface TrustBadge {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const badges: TrustBadge[] = [
    {
        icon: <Shield className="w-6 h-6" />,
        title: '100% Secure',
        description: 'SSL encrypted checkout',
    },
    {
        icon: <Truck className="w-6 h-6" />,
        title: 'Free Shipping',
        description: 'On orders over $50',
    },
    {
        icon: <RefreshCcw className="w-6 h-6" />,
        title: 'Easy Returns',
        description: '30-day return policy',
    },
    {
        icon: <Award className="w-6 h-6" />,
        title: 'Quality Guaranteed',
        description: 'Authentic products only',
    },
];

export default function TrustBadges() {
    return (
        <section className="py-12 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-y border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {badges.map((badge, index) => (
                        <motion.div
                            key={badge.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <motion.div
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                                className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-500 to-pink-500 flex items-center justify-center text-white shadow-lg mb-3 group-hover:shadow-xl transition-shadow"
                            >
                                {badge.icon}
                            </motion.div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {badge.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {badge.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Payment methods section
export function PaymentMethods() {
    const methods = [
        { name: 'Visa', icon: <CreditCard className="w-8 h-8" /> },
        { name: 'Mastercard', icon: <CreditCard className="w-8 h-8" /> },
        { name: 'PayPal', icon: <CreditCard className="w-8 h-8" /> },
        { name: 'Apple Pay', icon: <CreditCard className="w-8 h-8" /> },
    ];

    return (
        <div className="flex items-center justify-center gap-4 py-4">
            {methods.map((method) => (
                <motion.div
                    key={method.name}
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400"
                    title={method.name}
                >
                    {method.icon}
                </motion.div>
            ))}
        </div>
    );
}

// Security badges
export function SecurityBadges() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-6 py-4 px-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800"
        >
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Lock className="w-5 h-5" />
                <span className="text-sm font-medium">SSL Secured</span>
            </div>
            <div className="w-px h-6 bg-green-200 dark:bg-green-700" />
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">PCI Compliant</span>
            </div>
            <div className="w-px h-6 bg-green-200 dark:bg-green-700" />
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">Money-back Guarantee</span>
            </div>
        </motion.div>
    );
}

// Urgency banner
export function UrgencyBanner({ itemsLeft, viewersCount }: { itemsLeft: number; viewersCount: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-center gap-4 py-3 px-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl text-sm"
        >
            <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 animate-pulse" />
                <span className="font-medium">Limited Time Offer!</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Only {itemsLeft} left in stock
                </span>
                <span className="flex items-center gap-1">
                    <Headphones className="w-4 h-4" />
                    {viewersCount} people viewing now
                </span>
            </div>
        </motion.div>
    );
}
