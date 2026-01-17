'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Package, Mail, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
    const [orderNumber, setOrderNumber] = useState<string | null>(null);

    useEffect(() => {
        setOrderNumber(`LC-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Math.floor(Math.random() * 1000)}`);
    }, []);

    return (
        <div className="pt-32 min-h-screen bg-white flex items-center justify-center px-4">
            <div className="max-w-4xl mx-auto text-center space-y-16">

                {/* Status Hero */}
                <div className="space-y-10">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="w-32 h-32 mx-auto bg-accent rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-accent/40"
                    >
                        <CheckCircle className="w-16 h-16 text-white" />
                    </motion.div>

                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-6xl md:text-8xl font-black text-primary leading-[0.9] tracking-tighter"
                        >
                            Sequence <br />Complete.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-secondary max-w-xl mx-auto font-medium"
                        >
                            Your selection has been authorized and is now entering our logistics pipeline.
                            Thank you for your refined choice.
                        </motion.p>
                    </div>
                </div>

                {/* Infographics */}
                <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="p-10 bg-primary rounded-[3rem] text-white space-y-4 text-left shadow-2xl"
                    >
                        <Package className="w-10 h-10 text-accent mb-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Reference ID</span>
                        <p className="text-2xl font-black tracking-tighter">
                            {orderNumber || "PROCESS..."}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="p-10 bg-primary/2 rounded-[3rem] border-2 border-primary/5 text-primary space-y-4 text-left shadow-sm"
                    >
                        <Mail className="w-10 h-10 text-accent mb-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Notification</span>
                        <p className="text-lg font-black leading-tight">
                            Digital receipt and tracking index sent to your mail.
                        </p>
                    </motion.div>
                </div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-8"
                >
                    <Link href="/products" className="btn-primary flex items-center gap-4">
                        Explore Collection <ArrowRight className="w-5 h-5 text-accent" />
                    </Link>
                    <Link href="/account" className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-primary hover:gap-6 transition-all group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Account Dashboard.
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
