'use client';

import Link from 'next/link';
import {
    Package, CreditCard, BarChart3, Clock, Rocket, Users2, Star, ArrowUpRight, MoreHorizontal, ChevronsUpDown,
} from 'lucide-react';
import { type AdminDashboard } from '@/lib/hooks';

/* The dashboard uses the reference's sky-blue accent (admin dashboard only). */
const SKY = '#46AEE8';
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FLAGS: Record<string, string> = {
    USA: '🇺🇸', 'United States': '🇺🇸', Bangladesh: '🇧🇩', UK: '🇬🇧', 'United Kingdom': '🇬🇧',
    Canada: '🇨🇦', Australia: '🇦🇺', Germany: '🇩🇪', UAE: '🇦🇪', Singapore: '🇸🇬', India: '🇮🇳',
};

const compact = (n: number) => {
    const a = Math.abs(n);
    if (a >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
    if (a >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
    return `$${n.toFixed(0)}`;
};
// Round computed floats so SSR and client serialize them identically
// (avoids hydration mismatches from last-digit floating-point differences).
const r2 = (n: number) => Math.round(n * 100) / 100;
const initials = (name: string) =>
    (name || '?').replace(/@.*/, '').split(/[.\s_-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?';
const ago = (iso: string) => {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    return d <= 0 ? 'Today' : d === 1 ? '1 day ago' : `${d} days ago`;
};
const fmtHour = (h: number) => (h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`);
const statusStyles = (s: string) => {
    const u = s.toUpperCase();
    if (u === 'DELIVERED' || u === 'PAID') return 'text-emerald-600';
    if (u === 'SHIPPED' || u === 'PROCESSING') return 'text-[#46AEE8]';
    if (u === 'CANCELLED' || u === 'REFUNDED') return 'text-rose-500';
    return 'text-amber-500';
};

const card = 'bg-white rounded-3xl';

/* --------------------------- stat tile --------------------------- */
function StatTile({ icon: Icon, label, value, unit }: { icon: typeof Package; label: string; value: string; unit: string }) {
    return (
        <div className={`${card} p-5 md:p-6 flex items-center gap-4`}>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.4rem] flex items-center justify-center shrink-0" style={{ backgroundColor: SKY }}>
                <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-400">{label}</p>
                <p className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-baseline gap-2 truncate">
                    {value}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${SKY}1f`, color: SKY }}>{unit}</span>
                </p>
            </div>
        </div>
    );
}

/* ---------------------- segmented goal gauge --------------------- */
function SegmentedGauge({ pct }: { pct: number }) {
    const N = 40;
    const filled = Math.round((Math.max(0, Math.min(100, pct)) / 100) * N);
    const cx = 100, cy = 100, ri = 66, ro = 96;
    return (
        <div className="relative w-full max-w-[300px] mx-auto">
            <svg viewBox="0 0 200 116" className="w-full">
                {Array.from({ length: N }).map((_, i) => {
                    const ang = (180 - (i / (N - 1)) * 180) * (Math.PI / 180);
                    const x1 = r2(cx + ri * Math.cos(ang)), y1 = r2(cy - ri * Math.sin(ang));
                    const x2 = r2(cx + ro * Math.cos(ang)), y2 = r2(cy - ro * Math.sin(ang));
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={5} strokeLinecap="round"
                        stroke={i < filled ? SKY : '#e2e8f0'} className={i < filled ? '' : ''} />;
                })}
            </svg>
            <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">{pct}%</span>
                <span className="text-xs font-semibold text-slate-400">Sales Goal</span>
            </div>
        </div>
    );
}

/* ------------------------- growth ring -------------------------- */
function GrowthRing({ pct }: { pct: number }) {
    const fill = Math.max(0, Math.min(100, Math.abs(pct)));
    return (
        <div className="relative w-24 h-24 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="13" className="stroke-slate-100" />
                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="13" strokeLinecap="round" stroke={SKY}
                    pathLength={100} strokeDasharray="100" strokeDashoffset={100 - fill}
                    className="transition-[stroke-dashoffset] duration-700" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-slate-800">{pct >= 0 ? '+' : ''}{pct}%</span>
                <span className="text-[9px] font-semibold text-slate-400">Growth rate</span>
            </div>
        </div>
    );
}

/* ------------------------ monthly bars -------------------------- */
function MonthlyBars({ data }: { data: AdminDashboard['monthly'] }) {
    const max = Math.max(1, ...data.map((d) => d.revenue));
    const peak = data.reduce((m, d) => (d.revenue > m.revenue ? d : m), data[0] ?? { month: '', revenue: 0, ym: '' });
    return (
        <div>
            {/* bars — each column is h-full so the bar's height % has a reference */}
            <div className="flex items-end gap-2 md:gap-3 h-36">
                {data.map((d, i) => {
                    const h = r2(Math.min(92, Math.max(4, (d.revenue / max) * 100)));
                    const isPeak = d.ym === peak.ym && peak.revenue > 0;
                    return (
                        <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-1.5">
                            {isPeak && <span className="text-[9px] font-black text-white px-1.5 py-0.5 rounded-md shrink-0" style={{ backgroundColor: SKY }}>{compact(d.revenue)}</span>}
                            <div className="w-full rounded-full" style={{ height: `${h}%`, minHeight: 8, backgroundColor: isPeak ? SKY : `${SKY}33` }} title={compact(d.revenue)} />
                        </div>
                    );
                })}
            </div>
            {/* month labels */}
            <div className="flex gap-2 md:gap-3 mt-2">
                {data.map((d, i) => <span key={i} className="flex-1 text-center text-[10px] font-bold text-slate-400">{d.month}</span>)}
            </div>
        </div>
    );
}

/* --------------------------- heatmap ---------------------------- */
function Heatmap({ cells, max }: { cells: AdminDashboard['heatmap']; max: number }) {
    const byKey = new Map(cells.map((c) => [`${c.day}-${c.hour}`, c.count]));
    // Show the 8 busiest hours (compact) instead of every hour.
    const totalsByHour = new Map<number, number>();
    for (const c of cells) totalsByHour.set(c.hour, (totalsByHour.get(c.hour) ?? 0) + c.count);
    const ranked = [...totalsByHour.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([h]) => h);
    const hours = (ranked.length ? ranked : [9, 10, 11, 12, 13, 14, 15, 16]).sort((a, b) => a - b);
    const safeMax = Math.max(1, max);
    return (
        <div className="grid grid-cols-[34px_repeat(7,1fr)] gap-1.5">
            <div />
            {DAYS.map((d) => <div key={d} className="text-[10px] font-bold text-slate-400 text-center">{d}</div>)}
            {hours.map((h) => (
                <div key={h} className="contents">
                    <div className="text-[10px] font-bold text-slate-400 flex items-center justify-end pr-1">{fmtHour(h)}</div>
                    {DAYS.map((_, day) => {
                        const c = byKey.get(`${day}-${h}`) ?? 0;
                        const intensity = c ? 0.2 + 0.8 * (c / safeMax) : 0;
                        return <div key={day} className="h-6 md:h-7 rounded-md bg-slate-100"
                            style={c ? { backgroundColor: `rgba(70,174,232,${intensity.toFixed(2)})` } : undefined}
                            title={c ? `${c} orders` : ''} />;
                    })}
                </div>
            ))}
        </div>
    );
}

/* ============================ main view ============================ */
export default function DashboardView({ data: d }: { data: AdminDashboard }) {
    const reviewTotal = Math.max(1, d.reviews.total);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
            {/* ============================ LEFT ============================ */}
            <div className="lg:col-span-2 space-y-4 md:space-y-5">
                {/* stat tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                    <StatTile icon={Package} label="Available Products" value={d.availableProducts.toLocaleString('en-US')} unit="Items" />
                    <StatTile icon={CreditCard} label="Pending Orders" value={d.pendingOrders.toLocaleString('en-US')} unit="Orders" />
                </div>

                {/* shipping / recent orders table */}
                <div className={`${card} overflow-hidden`}>
                    <div className="flex items-center justify-between p-5 md:p-6 pb-3">
                        <h2 className="text-lg font-black text-slate-800">Shipping Product List</h2>
                        <Link href="/admin/orders" className="text-xs font-bold hover:underline" style={{ color: SKY }}>View all</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[560px]">
                            <thead>
                                <tr className="text-slate-400 text-left border-y border-slate-100">
                                    {['Tracking ID', 'Destination', 'Customer', 'Date', 'Cost', 'Status'].map((h, i) => (
                                        <th key={h} className={`py-3 font-semibold ${i === 0 ? 'pl-5 md:pl-6' : ''} ${i === 5 ? 'pr-5 md:pr-6' : ''}`}>
                                            <span className="inline-flex items-center gap-1">{h}<ChevronsUpDown className="w-3 h-3 opacity-50" /></span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {d.recentOrders.map((o) => (
                                    <tr key={o.id} className="border-b border-slate-50 last:border-0">
                                        <td className="py-3.5 pl-5 md:pl-6 font-bold text-slate-700 whitespace-nowrap">#TD{String(o.id).padStart(6, '0')}</td>
                                        <td className="py-3.5 whitespace-nowrap"><span className="mr-1.5">{FLAGS[o.country] ?? '🌍'}</span><span className="text-slate-500">{o.country}</span></td>
                                        <td className="py-3.5">
                                            <span className="inline-flex items-center gap-2 min-w-0">
                                                <span className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0" style={{ backgroundColor: SKY }}>{initials(o.customer)}</span>
                                                <span className="text-slate-600 truncate max-w-[120px]">{o.customer}</span>
                                            </span>
                                        </td>
                                        <td className="py-3.5 text-slate-500 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                                        <td className="py-3.5 font-semibold text-slate-700 whitespace-nowrap">${o.total.toFixed(2)}</td>
                                        <td className={`py-3.5 pr-5 md:pr-6 font-semibold whitespace-nowrap ${statusStyles(o.status)}`}>{o.status}</td>
                                    </tr>
                                ))}
                                {d.recentOrders.length === 0 && (
                                    <tr><td colSpan={6} className="py-8 text-center text-slate-400">No orders yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* product analytics */}
                <div className={`${card} p-5 md:p-6`}>
                    <div className="flex items-center gap-2 mb-5">
                        <BarChart3 className="w-5 h-5" style={{ color: SKY }} />
                        <h2 className="text-lg font-black text-slate-800">Product Analytics</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 items-start">
                        {/* heatmap */}
                        <div className="bg-slate-50 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-3"><Clock className="w-4 h-4 text-slate-400" /><h3 className="text-sm font-bold text-slate-700">Orders by hour</h3></div>
                            <Heatmap cells={d.heatmap} max={d.heatmapMax} />
                        </div>
                        {/* right mini cards */}
                        <div className="grid grid-cols-2 gap-4 md:gap-5 content-start">
                            <div className="bg-slate-50 rounded-2xl p-4 flex flex-col">
                                <div className="flex items-center gap-2 mb-2"><Rocket className="w-4 h-4 text-slate-400" /><h3 className="text-sm font-bold text-slate-700">Growth</h3></div>
                                <div className="flex-1 flex items-center justify-center"><GrowthRing pct={d.growthRatePct} /></div>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-4 flex flex-col">
                                <div className="flex items-center gap-2 mb-2"><Users2 className="w-4 h-4 text-slate-400" /><h3 className="text-sm font-bold text-slate-700">Total Customer</h3></div>
                                <p className="text-3xl font-black text-slate-800 tracking-tight">{d.totalCustomers.toLocaleString('en-US')}</p>
                                <Link href="/admin/customers" className="mt-auto text-xs font-bold hover:underline" style={{ color: SKY }}>View Details →</Link>
                            </div>
                            <div className="col-span-2 bg-slate-50 rounded-2xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-bold text-slate-700">Total Sales</h3>
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: SKY }}>Monthly</span>
                                </div>
                                <MonthlyBars data={d.monthly} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============================ RIGHT ============================ */}
            <div className="space-y-4 md:space-y-5">
                {/* sales overview */}
                <div className={`${card} p-5 md:p-6`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-black text-slate-800 flex items-center gap-2"><BarChart3 className="w-4 h-4" style={{ color: SKY }} /> Sales Overview</h2>
                        <MoreHorizontal className="w-4 h-4 text-slate-300" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-1">
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-slate-400">Number of Sales</span>
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 inline-flex items-center"><ArrowUpRight className="w-2.5 h-2.5" />{d.growthRatePct}%</span>
                            </div>
                            <p className="text-2xl font-black text-slate-800 tracking-tight">{d.numberOfSales.toLocaleString('en-US')}</p>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400">Total Sales</span>
                            <p className="text-2xl font-black text-slate-800 tracking-tight">{compact(d.totalSales)}</p>
                        </div>
                    </div>
                    <SegmentedGauge pct={d.salesGoalPct} />
                    <div className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-slate-50 px-3 py-2.5">
                        <span className="text-xs font-medium text-slate-500">Your customer volume has {d.customerVolumeChangePct >= 0 ? 'increased' : 'decreased'}</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white inline-flex items-center" style={{ backgroundColor: SKY }}><ArrowUpRight className="w-2.5 h-2.5" />{Math.abs(d.customerVolumeChangePct)}%</span>
                    </div>
                </div>

                {/* recent sales */}
                <div className={`${card} p-5 md:p-6`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-black text-slate-800">Recent Sales</h2>
                        <Link href="/admin/orders" className="text-xs font-bold hover:underline" style={{ color: SKY }}>See all</Link>
                    </div>
                    <div className="space-y-4">
                        {d.recentOrders.slice(0, 4).map((o) => (
                            <div key={o.id} className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0" style={{ backgroundColor: SKY }}>{initials(o.customer)}</span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-slate-700 truncate">{o.customer}</p>
                                    <p className="text-[11px] text-slate-400">{ago(o.createdAt)}</p>
                                </div>
                                <span className="text-sm font-black text-emerald-600 whitespace-nowrap">+ ${o.total.toFixed(2)}</span>
                            </div>
                        ))}
                        {d.recentOrders.length === 0 && <p className="text-sm text-slate-400">No sales yet.</p>}
                    </div>
                </div>

                {/* review rating */}
                <div className={`${card} p-5 md:p-6`}>
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-slate-400">Review Rating</h3>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-black text-slate-800 tracking-tight">{d.reviews.avg.toFixed(1)}</span>
                        <span className="text-sm font-semibold text-slate-400 mb-1.5">/ 5 · {d.reviews.total.toLocaleString('en-US')} reviews</span>
                    </div>
                    <div className="space-y-2">
                        {d.reviews.distribution.map((r) => (
                            <div key={r.stars} className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 w-8 flex items-center gap-0.5">{r.stars}<Star className="w-3 h-3 text-amber-400 fill-amber-400" /></span>
                                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${r2((r.count / reviewTotal) * 100)}%`, backgroundColor: SKY }} />
                                </div>
                                <span className="text-[11px] font-semibold text-slate-400 w-12 text-right">{r.count.toLocaleString('en-US')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
