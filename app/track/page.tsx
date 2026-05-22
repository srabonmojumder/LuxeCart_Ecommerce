'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import type { Order } from '@/lib/hooks';
import OrderTrackingView from '@/components/order/OrderTrackingView';

export default function TrackPage() {
    const [orderNo, setOrderNo] = useState('');
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const lookup = async (rawId: string, em: string) => {
        const id = rawId.replace(/\D/g, ''); // accept "LC-0010", "0010", "10"
        if (!id || !em) return;
        setLoading(true);
        setError(null);
        setOrder(null);
        try {
            const res = await api.get<{ data: Order }>(`/orders/track?id=${encodeURIComponent(id)}&email=${encodeURIComponent(em)}`);
            setOrder(res.data);
        } catch (e) {
            setError(e instanceof ApiError ? e.message : 'Lookup failed');
        } finally {
            setLoading(false);
        }
    };

    // Auto-load when arriving from checkout: /track?order=ID&email=EMAIL
    useEffect(() => {
        const p = new URLSearchParams(window.location.search);
        const id = p.get('order');
        const em = p.get('email');
        if (id) setOrderNo(id);
        if (em) setEmail(em);
        if (id && em) lookup(id, em);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 pb-24 space-y-8">
            <header className="text-center space-y-2">
                <span className="text-accent font-black tracking-[0.3em] text-xs uppercase">Order Tracking</span>
                <h1 className="text-3xl md:text-5xl font-black text-primary dark:text-white tracking-tighter">Track Your Order</h1>
                <p className="text-secondary dark:text-gray-400">Enter your order number and the email you used at checkout.</p>
            </header>

            <form onSubmit={(e) => { e.preventDefault(); lookup(orderNo, email); }} className="bg-white dark:bg-slate-900 border border-primary/5 dark:border-slate-800 rounded-2xl p-6 grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Number</label>
                    <input value={orderNo} onChange={(e) => setOrderNo(e.target.value)} required placeholder="LC-0010"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white" />
                </div>
                <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-primary dark:bg-accent text-white px-5 py-3 rounded-xl font-bold text-sm disabled:opacity-60 h-[46px]">
                    <Search className="w-4 h-4" /> {loading ? 'Tracking…' : 'Track'}
                </button>
            </form>

            {error && <p className="text-center text-hot font-medium">{error}</p>}
            {order && <OrderTrackingView order={order} />}
        </div>
    );
}
