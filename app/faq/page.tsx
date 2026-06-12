'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    ChevronDown,
    Package,
    Truck,
    RotateCcw,
    CreditCard,
    User,
    HelpCircle,
    ArrowRight,
} from 'lucide-react';

interface FaqItem {
    q: string;
    a: string;
}
interface FaqSection {
    key: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    items: FaqItem[];
}

const sections: FaqSection[] = [
    {
        key: 'orders',
        title: 'Orders',
        icon: Package,
        items: [
            { q: 'How do I place an order?', a: 'Add items to your cart, head to checkout, enter your shipping address and payment details, and confirm. You\'ll receive an order confirmation email within minutes.' },
            { q: 'Can I edit or cancel my order after placing it?', a: 'You can cancel a PENDING order from "My Orders" in your account. Once it moves to PROCESSING or SHIPPED, contact support and we\'ll do our best — but cancellation isn\'t guaranteed.' },
            { q: 'How do I check my order status?', a: 'Sign in and visit "My Orders", or use the public Track Order page with your order number (LC-0001) and the email you used at checkout.' },
        ],
    },
    {
        key: 'shipping',
        title: 'Shipping',
        icon: Truck,
        items: [
            { q: 'How long does shipping take?', a: 'Standard delivery is 3–7 business days within most regions. Express options at checkout deliver in 1–3 business days. International orders can take 7–21 days depending on customs.' },
            { q: 'Do you ship internationally?', a: 'Yes — we ship to 100+ countries with tracked, insured carriers. International shipping rates are calculated at checkout.' },
            { q: 'Is there free shipping?', a: 'Free standard shipping applies above the free-shipping threshold shown in your cart. The threshold may vary by region.' },
            { q: 'How do I track my package?', a: 'Once your order ships, you\'ll get an email with a tracking number. You can also view the timeline on the order page or via /track.' },
        ],
    },
    {
        key: 'returns',
        title: 'Returns & Refunds',
        icon: RotateCcw,
        items: [
            { q: 'What is your return policy?', a: 'Most items can be returned within 30 days of delivery, unused and in original packaging. Some categories (e.g. earbuds, intimates) are final sale — check the product page.' },
            { q: 'How do I start a return?', a: 'Go to the order in "My Orders" and click "Request Return". We\'ll review and email return instructions within 1 business day.' },
            { q: 'When will I get my refund?', a: 'Once we receive and inspect your return, refunds are issued to the original payment method within 5–7 business days.' },
        ],
    },
    {
        key: 'payment',
        title: 'Payment',
        icon: CreditCard,
        items: [
            { q: 'What payment methods do you accept?', a: 'All major credit/debit cards via Stripe (Visa, Mastercard, Amex), plus Apple Pay and Google Pay where available.' },
            { q: 'Is my payment information secure?', a: 'Yes. We never store raw card data — everything is handled by Stripe, a PCI-DSS Level 1 certified payment processor.' },
            { q: 'Do you charge sales tax?', a: 'Sales tax is calculated at checkout based on your shipping address and applicable local laws.' },
        ],
    },
    {
        key: 'account',
        title: 'Account',
        icon: User,
        items: [
            { q: 'Do I need an account to shop?', a: 'No — guest checkout is available. But an account lets you track orders, save addresses, manage your wishlist, and re-order faster.' },
            { q: 'How do I reset my password?', a: 'Use the "Forgot password?" link on the sign-in page. We\'ll email a secure reset link valid for 1 hour.' },
            { q: 'How do I delete my account?', a: 'Email us via the Contact page and we\'ll process the deletion within 7 days, in line with privacy regulations.' },
        ],
    },
];

export default function FaqPage() {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return sections;
        return sections
            .map((s) => ({ ...s, items: s.items.filter((i) => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)) }))
            .filter((s) => s.items.length > 0);
    }, [query]);

    const totalMatches = filtered.reduce((n, s) => n + s.items.length, 0);

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16 pb-24 space-y-10">
            {/* Hero */}
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-3"
            >
                <span className="text-accent font-medium tracking-[0.3em] text-xs uppercase">Help Center</span>
                <h1 className="text-4xl md:text-6xl font-medium text-primary dark:text-white tracking-tight">
                    Frequently Asked
                </h1>
                <p className="text-secondary dark:text-gray-400 text-lg max-w-xl mx-auto">
                    Quick answers to the questions our customers ask most. Can&apos;t find what you need?{' '}
                    <Link href="/contact" className="text-accent font-bold hover:underline">Contact us</Link>.
                </p>
            </motion.header>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative max-w-xl mx-auto"
            >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search questions…"
                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-ink-900 border border-primary/10 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white"
                />
                {query && (
                    <p className="mt-2 text-xs text-gray-400 text-center">
                        {totalMatches === 0 ? 'No matches' : `${totalMatches} match${totalMatches === 1 ? '' : 'es'}`}
                    </p>
                )}
            </motion.div>

            {/* Sections */}
            {filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 space-y-4"
                >
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                    <p className="text-secondary dark:text-gray-400">
                        No questions match &ldquo;{query}&rdquo;. Try a different keyword, or{' '}
                        <Link href="/contact" className="text-accent font-bold hover:underline">ask us directly</Link>.
                    </p>
                </motion.div>
            ) : (
                <div className="space-y-10">
                    {filtered.map((section, sIdx) => (
                        <motion.section
                            key={section.key}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + sIdx * 0.05 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                                    <section.icon className="w-4 h-4" />
                                </div>
                                <h2 className="text-xl font-medium text-primary dark:text-white tracking-tight">
                                    {section.title}
                                </h2>
                            </div>

                            <div className="space-y-2">
                                {section.items.map((item, idx) => {
                                    const key = `${section.key}-${idx}`;
                                    const isOpen = open === key;
                                    return (
                                        <div
                                            key={key}
                                            className="bg-white dark:bg-ink-900 border border-primary/5 dark:border-slate-800 rounded-2xl overflow-hidden"
                                        >
                                            <button
                                                onClick={() => setOpen(isOpen ? null : key)}
                                                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-primary/[0.02] dark:hover:bg-slate-800/30 transition-colors"
                                                aria-expanded={isOpen}
                                            >
                                                <span className="font-bold text-primary dark:text-white text-sm md:text-base">
                                                    {item.q}
                                                </span>
                                                <ChevronDown
                                                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-accent' : ''}`}
                                                />
                                            </button>
                                            <AnimatePresence initial={false}>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-5 pb-5 pt-1 text-sm text-secondary dark:text-gray-400 leading-relaxed border-t border-primary/5 dark:border-slate-800">
                                                            <p className="pt-4">{item.a}</p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.section>
                    ))}
                </div>
            )}

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-primary dark:bg-accent text-white rounded-2xl p-8 md:p-10 text-center space-y-4"
            >
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight">Still need help?</h2>
                <p className="opacity-80 max-w-md mx-auto">Our support team replies within 24 hours on business days.</p>
                <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-white text-primary dark:text-accent px-6 py-3 rounded-xl font-medium uppercase tracking-widest text-xs hover:bg-white/90 transition-colors"
                >
                    Contact Support
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </motion.div>
        </div>
    );
}
