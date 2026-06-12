'use client';

import Image from 'next/image';
import { Check, Clock, CreditCard, Package, Truck, Home, XCircle, MapPin } from 'lucide-react';
import type { Order } from '@/lib/hooks';

const STEPS = [
    { key: 'PENDING', label: 'Placed', icon: Clock },
    { key: 'PAID', label: 'Paid', icon: CreditCard },
    { key: 'PROCESSING', label: 'Processing', icon: Package },
    { key: 'SHIPPED', label: 'Shipped', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: Home },
];

const fmt = (s: string) =>
    new Date(s).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function OrderTrackingView({ order }: { order: Order }) {
    const addr = order.shippingAddress as Record<string, string>;
    const cancelled = order.status === 'CANCELLED' || order.status === 'REFUNDED';
    const currentIndex = STEPS.findIndex((s) => s.key === order.status);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-3xl md:text-5xl font-medium text-primary dark:text-white tracking-tight">Order LC-{String(order.id).padStart(4, '0')}</h1>
                    <p className="text-sm text-secondary dark:text-gray-400 mt-1">Placed {fmt(order.createdAt)}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-widest ${cancelled ? 'bg-hot/10 text-hot' : 'bg-accent/10 text-accent'}`}>{order.status}</span>
            </div>

            {/* Stepper */}
            {cancelled ? (
                <div className="flex items-center gap-3 p-5 bg-hot/5 border border-hot/20 rounded-2xl text-hot">
                    <XCircle className="w-6 h-6" />
                    <span className="font-bold">This order was {order.status.toLowerCase()}.</span>
                </div>
            ) : (
                <div className="bg-white dark:bg-ink-900 border border-primary/5 dark:border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, i) => {
                            const Icon = step.icon;
                            const done = i <= currentIndex;
                            const isCurrent = i === currentIndex;
                            return (
                                <div key={step.key} className="flex-1 flex flex-col items-center relative">
                                    {i > 0 && <div className={`absolute right-1/2 top-5 h-0.5 w-full -z-0 ${i <= currentIndex ? 'bg-accent' : 'bg-gray-200 dark:bg-slate-700'}`} />}
                                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${done ? 'bg-accent text-white' : 'bg-gray-100 dark:bg-ink-800 text-gray-400'} ${isCurrent ? 'ring-4 ring-accent/20' : ''}`}>
                                        {done && !isCurrent ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <span className={`mt-2 text-[10px] md:text-xs font-bold text-center ${done ? 'text-primary dark:text-white' : 'text-gray-400'}`}>{step.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Tracking number */}
            {order.trackingNumber && (
                <div className="flex items-center gap-4 p-5 bg-primary/5 dark:bg-ink-900 rounded-2xl">
                    <Truck className="w-6 h-6 text-accent" />
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">Tracking {order.carrier ? `· ${order.carrier}` : ''}</p>
                        <p className="text-lg font-medium text-primary dark:text-white tracking-tight">{order.trackingNumber}</p>
                    </div>
                </div>
            )}

            {/* Timeline */}
            <div className="bg-white dark:bg-ink-900 border border-primary/5 dark:border-slate-800 rounded-2xl p-6">
                <h2 className="font-medium text-primary dark:text-white uppercase tracking-tight mb-4">History</h2>
                <ol className="space-y-4">
                    {[...order.events].reverse().map((e, i) => (
                        <li key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-accent' : 'bg-gray-300 dark:bg-slate-600'}`} />
                                {i < order.events.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-slate-700 my-1" />}
                            </div>
                            <div className="pb-2">
                                <p className="text-sm font-bold text-primary dark:text-white">{e.status}{e.note ? ` — ${e.note}` : ''}</p>
                                <p className="text-xs text-gray-400">{fmt(e.createdAt)}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>

            {/* Items + address + totals */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-ink-900 border border-primary/5 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                    <h2 className="font-medium text-primary dark:text-white uppercase tracking-tight">Items</h2>
                    {order.items.map((it) => (
                        <div key={it.productId} className="flex items-center gap-3">
                            {it.image && <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"><Image src={it.image} alt={it.name} fill className="object-cover" /></div>}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-primary dark:text-white truncate">{it.name}</p>
                                <p className="text-xs text-gray-400">Qty: {it.quantity}</p>
                            </div>
                            <span className="text-sm font-bold text-primary dark:text-white">${(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="pt-3 border-t border-primary/10 dark:border-slate-800 space-y-1.5 text-sm">
                        <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                        {order.discount > 0 && <div className="flex justify-between text-new"><span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span><span>−${order.discount.toFixed(2)}</span></div>}
                        <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span></div>
                        <div className="flex justify-between text-gray-500"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
                        <div className="flex justify-between font-medium text-primary dark:text-white text-lg pt-1.5 border-t border-primary/10 dark:border-slate-800"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-ink-900 border border-primary/5 dark:border-slate-800 rounded-2xl p-6">
                    <h2 className="font-medium text-primary dark:text-white uppercase tracking-tight mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> Shipping</h2>
                    <p className="text-sm text-secondary dark:text-gray-400 leading-relaxed">
                        {addr?.fullName}<br />
                        {addr?.line1}{addr?.line2 ? `, ${addr.line2}` : ''}<br />
                        {addr?.city}{addr?.state ? `, ${addr.state}` : ''} {addr?.postalCode}<br />
                        {addr?.country}{addr?.phone ? ` · ${addr.phone}` : ''}
                    </p>
                </div>
            </div>
        </div>
    );
}
