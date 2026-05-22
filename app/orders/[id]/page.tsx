'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useOrder } from '@/lib/hooks';
import { useAuthStore } from '@/store/useAuthStore';
import OrderTrackingView from '@/components/order/OrderTrackingView';

export default function OrderTrackingPage() {
    const params = useParams();
    const id = params.id as string;
    const authStatus = useAuthStore((s) => s.status);
    const { order, isLoading, error } = useOrder(authStatus === 'authenticated' ? id : null);

    if (authStatus === 'loading' || (authStatus === 'authenticated' && isLoading)) {
        return <div className="min-h-[50vh] flex items-center justify-center"><div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;
    }

    if (authStatus === 'guest') {
        return (
            <div className="min-h-[50vh] flex items-center justify-center px-4 text-center">
                <div className="space-y-4">
                    <h1 className="text-2xl font-black text-primary dark:text-white tracking-tighter">Track your order</h1>
                    <p className="text-secondary dark:text-gray-400">Sign in, or track a guest order with your order number &amp; email.</p>
                    <div className="flex gap-3 justify-center">
                        <Link href="/account" className="px-6 py-3 bg-primary dark:bg-accent text-white rounded-xl font-bold text-sm">Sign In</Link>
                        <Link href="/track" className="px-6 py-3 border border-primary/20 dark:border-slate-700 rounded-xl font-bold text-sm text-primary dark:text-white">Guest Tracking</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center px-4 text-center">
                <div className="space-y-3">
                    <h1 className="text-2xl font-black text-primary dark:text-white tracking-tighter">Order not found</h1>
                    <Link href="/account" className="text-accent font-bold hover:underline">Back to your orders</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 pb-24">
            <Link href="/account" className="text-[10px] font-black tracking-widest text-accent uppercase hover:underline">← Your Orders</Link>
            <div className="mt-3"><OrderTrackingView order={order} /></div>
        </div>
    );
}
