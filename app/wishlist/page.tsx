'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, X, ArrowLeft, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { toast } from 'sonner';

export default function WishlistPage() {
    const wishlist = useStore((state) => state.wishlist);
    const addToCart = useStore((state) => state.addToCart);

    const handleAddAllToCart = () => {
        wishlist.forEach(product => addToCart(product));
        toast.success(`${wishlist.length} item(s) transferred to basket`);
    };

    if (wishlist.length === 0) {
        return (
            <div className="pt-32 min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
                <div className="text-center space-y-12 max-w-xl">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-48 h-48 mx-auto bg-primary/5 rounded-[4rem] flex items-center justify-center shadow-2xl overflow-hidden relative group"
                    >
                        <Heart className="w-16 h-16 text-primary group-hover:scale-125 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    <div className="space-y-6">
                        <h2 className="text-6xl md:text-8xl font-black text-primary dark:text-white tracking-tighter leading-[0.9]">
                            Infinite <br />Desire.
                        </h2>
                        <p className="text-xl text-secondary dark:text-gray-400 font-medium leading-relaxed">
                            Your personal gallery of interest is currently empty.
                            Curate your collection by exploring our archive.
                        </p>
                    </div>
                    <Link href="/products" className="btn-primary inline-flex">
                        Explore Archive
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 md:pt-40 pb-48 min-h-screen bg-white dark:bg-slate-950">
            <div className="max-w-[1440px] mx-auto px-4 md:px-12">

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
                    <div className="space-y-6">
                        <span className="text-accent font-black tracking-[0.4em] text-xs uppercase block">Private Curation</span>
                        <h1 className="text-6xl md:text-9xl font-black text-primary dark:text-white leading-[0.8] tracking-tighter">
                            Wishlist <br />Archive.
                        </h1>
                    </div>
                    <div className="flex items-center gap-10 bg-primary/2 dark:bg-white/5 px-10 py-6 rounded-[2.5rem] border border-primary/5 dark:border-white/5">
                        <div className="text-right">
                            <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase block mb-1">Items</span>
                            <span className="text-3xl font-black text-primary dark:text-white uppercase">{wishlist.length} Selection{wishlist.length !== 1 ? 's' : ''}</span>
                        </div>
                        <button
                            onClick={handleAddAllToCart}
                            className="h-16 px-10 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest hover:bg-accent hover:scale-105 transition-all shadow-xl flex items-center gap-4"
                        >
                            <Plus className="w-4 h-4" />
                            Transfer to Bag
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-24">
                    <AnimatePresence mode="popLayout">
                        {wishlist.map((product, index) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.6, delay: index * 0.05 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="mt-32 border-t-2 border-primary/5 dark:border-white/5 pt-12">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-6 text-[10px] font-black tracking-widest text-primary dark:text-white uppercase group"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-primary transition-all duration-500">
                            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </div>
                        Return to Store
                    </Link>
                </div>
            </div>
        </div>
    );
}
