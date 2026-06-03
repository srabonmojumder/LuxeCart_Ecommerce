'use client';

import { useState } from 'react';
import { TrendingUp, ShoppingBag, DollarSign, BarChart3 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminAnalytics, useSettings, type AdminAnalytics } from '@/lib/hooks';
import { StatCardsSkeleton, ChartSkeleton, BarListSkeleton } from '@/components/ui/Skeleton';

const RANGES = [7, 30, 90] as const;

const STATUS_COLOR: Record<string, string> = {
    PENDING: '#f59e0b', PAID: '#10b981', PROCESSING: '#6366f1', SHIPPED: '#3b82f6',
    DELIVERED: '#22c55e', CANCELLED: '#ef4444', REFUNDED: '#a855f7',
};

/** Lightweight SVG area chart — no chart library needed. */
function AreaChart({ data, money }: { data: AdminAnalytics['series']; money: (n: number) => string }) {
    const W = 760, H = 220, P = 8;
    const max = Math.max(1, ...data.map((d) => d.revenue));
    const stepX = data.length > 1 ? (W - P * 2) / (data.length - 1) : 0;
    const y = (v: number) => H - P - (v / max) * (H - P * 2);
    const pts = data.map((d, i) => `${P + i * stepX},${y(d.revenue)}`);
    const line = pts.join(' ');
    const area = `${P},${H - P} ${line} ${P + (data.length - 1) * stepX},${H - P}`;
    const peak = data.reduce((m, d) => (d.revenue > m.revenue ? d : m), data[0] ?? { date: '', revenue: 0, orders: 0 });

    return (
        <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[640px] h-56">
                <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c026d3" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#c026d3" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polygon points={area} fill="url(#rev)" />
                <polyline points={line} fill="none" stroke="#c026d3" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                {peak.revenue > 0 && (
                    <text x={W / 2} y="16" textAnchor="middle" className="fill-current text-gray-400" fontSize="11">
                        Peak day: {money(peak.revenue)} ({peak.date})
                    </text>
                )}
            </svg>
        </div>
    );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof DollarSign; label: string; value: string }) {
    return (
        <div className="p-6 bg-white dark:bg-slate-900 border border-primary/5 dark:border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Icon className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-3xl font-black text-primary dark:text-white tracking-tighter">{value}</p>
        </div>
    );
}

export default function AdminAnalyticsPage() {
    const isAdmin = useAuthStore((s) => s.status === 'authenticated' && s.user?.role === 'ADMIN');
    const [days, setDays] = useState<(typeof RANGES)[number]>(30);
    const { analytics, isLoading } = useAdminAnalytics(isAdmin, days);
    const { settings } = useSettings();
    const cur = settings?.currencySymbol ?? '$';
    const money = (n: number) => `${cur}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

    const topMax = Math.max(1, ...(analytics?.topProducts.map((p) => p.revenue) ?? [1]));
    const statusTotal = (analytics?.statusBreakdown ?? []).reduce((s, x) => s + x.count, 0) || 1;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-primary dark:text-white tracking-tighter flex items-center gap-3">
                    <BarChart3 className="w-7 h-7 text-accent" /> Analytics
                </h1>
                <div className="flex gap-1 bg-white dark:bg-slate-900 border border-primary/10 dark:border-slate-800 rounded-xl p-1">
                    {RANGES.map((r) => (
                        <button
                            key={r}
                            onClick={() => setDays(r)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest ${days === r ? 'bg-primary text-white dark:bg-accent' : 'text-gray-400'}`}
                        >
                            {r}d
                        </button>
                    ))}
                </div>
            </div>

            {isLoading || !analytics ? (
                <>
                    <StatCardsSkeleton count={3} className="grid grid-cols-1 sm:grid-cols-3 gap-4" />
                    <ChartSkeleton />
                    <div className="grid lg:grid-cols-2 gap-4">
                        <BarListSkeleton rows={5} />
                        <BarListSkeleton rows={5} />
                    </div>
                </>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard icon={DollarSign} label={`Revenue (${days}d)`} value={money(analytics.totalRevenue)} />
                        <StatCard icon={ShoppingBag} label={`Orders (${days}d)`} value={String(analytics.totalOrders)} />
                        <StatCard icon={TrendingUp} label="Avg order value" value={money(analytics.avgOrderValue)} />
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-900 border border-primary/5 dark:border-slate-800 rounded-2xl">
                        <h2 className="font-black text-primary dark:text-white uppercase tracking-tight mb-4">Revenue trend</h2>
                        <AreaChart data={analytics.series} money={(n) => `${cur}${n.toFixed(0)}`} />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4">
                        {/* Top products */}
                        <div className="p-6 bg-white dark:bg-slate-900 border border-primary/5 dark:border-slate-800 rounded-2xl">
                            <h2 className="font-black text-primary dark:text-white uppercase tracking-tight mb-4">Top products</h2>
                            {analytics.topProducts.length === 0 ? (
                                <p className="text-sm text-gray-400">No sales in this period.</p>
                            ) : (
                                <div className="space-y-3">
                                    {analytics.topProducts.map((p) => (
                                        <div key={p.name}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-semibold text-primary dark:text-white truncate pr-2">{p.name}</span>
                                                <span className="text-gray-400 whitespace-nowrap">{money(p.revenue)} · {p.qty} sold</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-primary/5 dark:bg-slate-800 overflow-hidden">
                                                <div className="h-full rounded-full bg-accent" style={{ width: `${(p.revenue / topMax) * 100}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Status breakdown */}
                        <div className="p-6 bg-white dark:bg-slate-900 border border-primary/5 dark:border-slate-800 rounded-2xl">
                            <h2 className="font-black text-primary dark:text-white uppercase tracking-tight mb-4">Orders by status (all time)</h2>
                            <div className="space-y-3">
                                {analytics.statusBreakdown.map((s) => (
                                    <div key={s.status}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-semibold text-primary dark:text-white">{s.status}</span>
                                            <span className="text-gray-400">{s.count} ({Math.round((s.count / statusTotal) * 100)}%)</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-primary/5 dark:bg-slate-800 overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${(s.count / statusTotal) * 100}%`, background: STATUS_COLOR[s.status] ?? '#c026d3' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
