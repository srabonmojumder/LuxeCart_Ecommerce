'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useOrder } from '@/lib/hooks';

export default function OrderSuccessPage() {
    const [orderId, setOrderId] = useState<string | null>(null);
    const { order } = useOrder(orderId);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setOrderId(params.get('order'));
    }, []);

    const reference = order
        ? `LC-${String(order.id).padStart(4, '0')}`
        : orderId
            ? `LC-${orderId.padStart(4, '0')}`
            : 'PROCESS…';

    return (
        <div className="pt-0 min-h-screen bg-white dark:bg-ink-950 flex items-center justify-center px-4 py-12">
            <div className="max-w-4xl w-full mx-auto text-center space-y-16">

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
                            className="text-6xl md:text-8xl font-medium text-primary dark:text-white leading-[0.9] tracking-tight"
                        >
                            Sequence <br />Complete.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-secondary dark:text-gray-400 max-w-xl mx-auto font-medium"
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
                        className="p-10 bg-primary dark:bg-white/5 rounded-[3rem] text-white space-y-4 text-left shadow-2xl dark:border dark:border-white/10"
                    >
                        <Package className="w-10 h-10 text-accent mb-4" />
                        <span className="text-[10px] font-medium uppercase tracking-widest text-white/40 block">Reference ID</span>
                        <p className="text-2xl font-medium tracking-tight text-white">{reference}</p>
                        {order && (
                            <span className="inline-block text-[10px] font-medium uppercase tracking-widest text-accent">{order.status}</span>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="p-10 bg-primary/2 dark:bg-white/5 rounded-[3rem] border-2 border-primary/5 dark:border-white/10 text-primary dark:text-white space-y-4 text-left shadow-sm"
                    >
                        <Mail className="w-10 h-10 text-accent mb-4" />
                        <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400 block">Notification</span>
                        <p className="text-lg font-medium leading-tight">Digital receipt and tracking index sent to your mail.</p>
                    </motion.div>
                </div>

                {/* Real order summary */}
                {order && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="max-w-2xl mx-auto text-left p-8 bg-gray-50 dark:bg-ink-900/50 rounded-[2rem] border border-primary/5 dark:border-slate-800 space-y-5"
                    >
                        <h2 className="text-sm font-medium uppercase tracking-widest text-gray-400">Order Summary</h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.productId} className="flex items-center gap-4">
                                    {item.image && (
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-primary dark:text-white truncate">{item.name}</p>
                                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-sm font-bold text-primary dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-primary/10 dark:border-slate-800 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                            {order.discount > 0 && <div className="flex justify-between text-new"><span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span><span>−${order.discount.toFixed(2)}</span></div>}
                            <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span></div>
                            <div className="flex justify-between text-gray-500"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
                            <div className="flex justify-between pt-2 border-t border-primary/10 dark:border-slate-800 font-medium text-primary dark:text-white text-lg">
                                <span>Total</span><span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-8"
                >
                    {orderId && (
                        <Link href={`/orders/${orderId}`} className="btn-primary flex items-center gap-4">
                            Track Order <Package className="w-5 h-5 text-accent" />
                        </Link>
                    )}
                    <Link href="/products" className="flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-primary dark:text-white hover:gap-6 transition-all group">
                        Explore Collection <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/account" className="flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-primary dark:text-white hover:gap-6 transition-all group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Account Dashboard.
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
