'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Globe, Truck, ArrowRight } from 'lucide-react';

export default function StoresPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16 pb-24 space-y-12">
            {/* Hero */}
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-3 max-w-2xl mx-auto"
            >
                <span className="text-accent font-medium tracking-[0.3em] text-xs uppercase">Locations</span>
                <h1 className="text-4xl md:text-6xl font-medium text-primary dark:text-white tracking-tight">
                    Find Us Online
                </h1>
                <p className="text-secondary dark:text-gray-400 text-lg">
                    LuxeCart is an online-first store — we ship worldwide, no physical retail locations yet.
                </p>
            </motion.header>

            {/* Feature cards */}
            <div className="grid md:grid-cols-3 gap-4">
                {[
                    { icon: Globe, title: 'Worldwide Shipping', desc: 'We deliver to 100+ countries with tracked, insured carriers.' },
                    { icon: Truck, title: 'Fast Dispatch', desc: 'Orders ship within 24 hours on business days from our hub.' },
                    { icon: MapPin, title: 'Retail · Coming Soon', desc: 'Flagship stores planned for NYC, London and Tokyo in 2027.' },
                ].map((card, i) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="bg-white dark:bg-ink-900 border border-primary/5 dark:border-slate-800 rounded-2xl p-6 space-y-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                            <card.icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-medium text-primary dark:text-white tracking-tight">{card.title}</h3>
                        <p className="text-sm text-secondary dark:text-gray-400">{card.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-primary dark:bg-accent text-white rounded-2xl p-8 md:p-12 text-center space-y-4"
            >
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight">Have a question about delivery?</h2>
                <p className="opacity-80 max-w-lg mx-auto">Our support team is ready to help with shipping estimates, customs, or returns.</p>
                <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-white text-primary dark:text-accent px-6 py-3 rounded-xl font-medium uppercase tracking-widest text-xs hover:bg-white/90 transition-colors"
                >
                    Contact Us
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </motion.div>
        </div>
    );
}
