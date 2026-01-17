'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    ChevronRight,
    ChevronLeft,
    ArrowRight,
    Star,
    Truck,
    Shield,
    RotateCcw,
    Zap
} from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/products';

const categories = [
    { name: 'Decor', image: '/category_decor.png' },
    { name: 'Kitchen', image: '/category_kitchen.png' },
    { name: 'Furniture', image: '/photo-1592078615290-033ee584e267.webp' },
    { name: 'Lighting', image: '/category_lighting.png' },
    { name: 'Textiles', image: '/category_textiles.png' },
    { name: 'Plants', image: '/category_plants.png' },
];

export default function Home() {
    const [activeTab, setActiveTab] = useState('Hot');
    const homeProducts = products.filter(p => ['home', 'kitchen', 'decor', 'furniture'].includes(p.category.toLowerCase())).slice(0, 8);

    const features = [
        { icon: Truck, title: 'Free Shipping', desc: 'Orders over $75' },
        { icon: Shield, title: 'Secure Payment', desc: 'Verified security' },
        { icon: RotateCcw, title: 'Easy Returns', desc: '30 day returns' },
        { icon: Zap, title: 'Fast Delivery', desc: 'Across the globe' },
    ];

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[500px] max-h-[800px] bg-gray-100 dark:bg-slate-900 overflow-hidden mx-4 md:mx-8 rounded-[2rem] md:rounded-[3rem]">
                <Image
                    src="/home_accessories_hero.png"
                    alt="LuxeCart Collection"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/15" />
                <div className="absolute inset-0 flex items-center justify-start p-8 md:p-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-2xl"
                    >
                        <span className="inline-block text-white font-bold tracking-[0.3em] text-xs md:text-sm mb-6 uppercase">
                            New Collection 2026
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-white leading-tight mb-8 tracking-tighter">
                            Modern <br />Minimal
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-lg leading-relaxed font-medium">
                            Elevate your living experience with our curated collection of premium home accessories designed for the modern lifestyle.
                        </p>
                        <Link href="/products" className="inline-flex items-center gap-3 bg-white text-primary px-10 py-5 rounded-2xl font-black text-sm tracking-widest hover:bg-accent hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl uppercase">
                            Explore Now <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Category Navigation */}
            <section className="py-12 md:py-20 overflow-x-auto no-scrollbar scroll-smooth">
                <div className="max-w-7xl mx-auto px-4 flex gap-8 md:gap-16 justify-start md:justify-center min-w-max">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Link href={`/products?category=${cat.name.toLowerCase()}`} className="flex flex-col items-center gap-4 group">
                                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-gray-50 dark:border-slate-800 shadow-sm group-hover:shadow-xl group-hover:border-accent transition-all duration-500 relative bg-gray-50 dark:bg-slate-800">
                                    <Image src={cat.image} alt={cat.name} fill sizes="112px" className="object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                                </div>
                                <span className="text-xs md:text-sm font-black tracking-widest uppercase text-primary dark:text-white group-hover:text-accent transition-colors">{cat.name}</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features Strip */}
            <section className="py-8 border-y border-gray-100 mb-12">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="flex items-center gap-4 group justify-center md:justify-start">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                                <f.icon className="w-6 h-6 dark:text-gray-300" />
                            </div>
                            <div className="hidden sm:block">
                                <h4 className="font-bold text-sm text-primary dark:text-white">{f.title}</h4>
                                <p className="text-xs text-secondary dark:text-gray-400">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Best Sellers */}
            <section className="py-12 md:py-24 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-6xl font-black text-primary dark:text-white tracking-tighter mb-4">Our Best Sellers</h2>
                            <p className="text-secondary dark:text-gray-400 text-lg">Shop the most loved items this season.</p>
                        </div>
                        <div className="flex gap-8 border-b border-gray-100">
                            {['Hot', 'New', 'Sale'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-sm font-black tracking-widest uppercase transition-all relative ${activeTab === tab ? 'text-primary dark:text-white' : 'text-gray-400'
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div layoutId="activeTabHome" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary dark:bg-white" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                        {homeProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <Link href="/products" className="inline-flex items-center gap-3 text-primary dark:text-white font-black tracking-[0.2em] text-sm group uppercase">
                            Shop All Products
                            <div className="w-10 h-10 rounded-full border border-primary dark:border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Promo Section */}
            <section className="py-16 md:py-24 bg-accent/5 mx-4 md:mx-8 rounded-[2rem] md:rounded-[3rem]">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
                        <Image
                            src="/photo-1513506003901-1e6a229e2d15.webp"
                            alt="Modern Decor"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute top-8 left-8">
                            <span className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-black tracking-widest uppercase shadow-lg">Save 50%</span>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <span className="text-accent font-black tracking-[0.4em] text-xs uppercase">LIMITED OFFER</span>
                            <h2 className="text-4xl md:text-7xl font-black text-primary dark:text-white tracking-tighter leading-tight">
                                Minimalist <br />Design Deal
                            </h2>
                        </div>
                        <p className="text-secondary dark:text-gray-400 text-xl leading-relaxed font-medium">
                            Experience the perfect blend of form and function. Our sculptural vase collection is now available at an exclusive mid-season price.
                        </p>
                        <div className="flex gap-6 items-center">
                            <div className="flex flex-col">
                                <span className="text-gray-400 text-sm font-bold line-through">$89.00</span>
                                <span className="text-4xl md:text-5xl font-black text-primary dark:text-white">$45.00</span>
                            </div>
                            <div className="h-16 w-[1px] bg-gray-200 dark:bg-slate-700 hidden sm:block" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-secondary font-black tracking-widest uppercase mb-2">Offer ends in</span>
                                <div className="flex gap-4">
                                    {['12', '45', '08'].map((val, i) => (
                                        <div key={i} className="flex flex-col items-center">
                                            <span className="text-2xl font-black text-accent">{val}</span>
                                            <span className="text-[8px] font-bold text-gray-400 uppercase">{i === 0 ? 'Hrs' : i === 1 ? 'Min' : 'Sec'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Link href="/products" className="inline-flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-2xl font-black text-sm tracking-[0.2em] hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-xl uppercase">
                            Shop The Deal <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-24 md:py-40">
                <div className="max-w-4xl mx-auto px-4 text-center space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-7xl font-black text-primary dark:text-white tracking-tighter">Stay Inspired</h2>
                        <p className="text-secondary dark:text-gray-400 text-lg px-8">Join our community and get exclusive early access to our new drops, styling tips, and 15% off your first order.</p>
                    </div>
                    <div className="max-w-md mx-auto relative group">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 rounded-2xl px-8 py-5 text-sm focus:outline-none focus:border-accent transition-all pl-8 pr-32 dark:text-white"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-8 py-3 rounded-xl text-xs font-black tracking-widest hover:bg-accent transition-all uppercase">
                            Join
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
