'use client';

import Link from 'next/link';
import { DollarSign, Package, ShoppingBag, Users, AlertTriangle, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminStats } from '@/lib/hooks';

const statusStyles = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'DELIVERED' || s === 'PAID') return 'bg-new/10 text-new';
    if (s === 'SHIPPED' || s === 'PROCESSING') return 'bg-accent/10 text-accent';
    if (s === 'CANCELLED' || s === 'REFUNDED') return 'bg-hot/10 text-hot';
    return 'bg-limited/10 text-limited';
};

export default function AdminDashboard() {
    const isAdmin = useAuthStore((s) => s.status === 'authenticated' && s.user?.role === 'ADMIN');
    const { stats, isLoading } = useAdminStats(isAdmin);

    const cards = [
        { label: 'Revenue', value: stats ? `$${stats.revenue.toFixed(2)}` : '—', icon: DollarSign, tint: 'text-emerald-500 bg-emerald-500/10' },
        { label: 'Orders', value: stats?.orders ?? '—', icon: ShoppingBag, tint: 'text-accent bg-accent/10' },
        { label: 'Products', value: stats ? `${stats.activeProducts}/${stats.products}` : '—', icon: Package, tint: 'text-violet-500 bg-violet-500/10' },
        { label: 'Customers', value: stats?.users ?? '—', icon: Users, tint: 'text-amber-500 bg-amber-500/10' },
    ];

    return (
        <div className="space-y-8">
            <header>
                <span className="text-accent font-black tracking-[0.3em] text-xs uppercase">Overview</span>
                <h1 className="text-3xl md:text-5xl font-black text-primary dark:text-white tracking-tighter mt-1">Dashboard</h1>
            </header>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((c) => {
                    const Icon = c.icon;
                    return (
                        <div key={c.label} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 dark:border-slate-800">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${c.tint}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <p className="text-2xl md:text-3xl font-black text-primary dark:text-white">{isLoading ? '…' : c.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{c.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent orders */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-black text-primary dark:text-white uppercase tracking-tight flex items-center gap-2"><Clock className="w-4 h-4" /> Recent Orders</h2>
                        <Link href="/admin/orders" className="text-xs font-bold text-accent hover:underline">View all</Link>
                    </div>
                    {!stats || stats.recentOrders.length === 0 ? (
                        <p className="text-sm text-secondary dark:text-gray-400">No orders yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentOrders.map((o) => (
                                <div key={o.id} className="flex items-center justify-between text-sm">
                                    <div className="min-w-0">
                                        <span className="font-bold text-primary dark:text-white">LC-{String(o.id).padStart(4, '0')}</span>
                                        <span className="ml-3 text-gray-400 truncate">{o.customer}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyles(o.status)}`}>{o.status}</span>
                                        <span className="font-bold text-primary dark:text-white w-20 text-right">${o.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Low stock */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 dark:border-slate-800 p-6">
                    <h2 className="font-black text-primary dark:text-white uppercase tracking-tight flex items-center gap-2 mb-4"><AlertTriangle className="w-4 h-4 text-amber-500" /> Low Stock</h2>
                    {!stats || stats.lowStock.length === 0 ? (
                        <p className="text-sm text-secondary dark:text-gray-400">Everything is well stocked. 🎉</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.lowStock.map((p) => (
                                <div key={p.id} className="flex items-center justify-between text-sm">
                                    <span className="text-primary dark:text-white truncate pr-2">{p.name}</span>
                                    <span className="font-black text-amber-500 flex-shrink-0">{p.stock} left</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
