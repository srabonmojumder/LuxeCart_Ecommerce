'use client';

import { useState } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminOrders, type AdminOrder } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';
import Select from '@/components/ui/Select';
import { usePagination } from '@/lib/usePagination';
import Pagination from '@/components/ui/Pagination';
import { CardListSkeleton } from '@/components/ui/Skeleton';

const ORDER_STATUSES = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

const statusBadge = (s: string): string => ({
    PENDING: 'bg-amber-500/10 text-amber-600',
    PAID: 'bg-blue-500/10 text-blue-600',
    PROCESSING: 'bg-[#46AEE8]/10 text-[#46AEE8]',
    SHIPPED: 'bg-cyan-500/10 text-cyan-600',
    DELIVERED: 'bg-emerald-500/10 text-emerald-600',
    CANCELLED: 'bg-hot/10 text-hot',
    REFUNDED: 'bg-gray-200 text-gray-500',
}[s] ?? 'bg-[#46AEE8]/10 text-[#46AEE8]');

export default function AdminOrdersPage() {
    const isAdmin = useAuthStore((s) => s.status === 'authenticated' && s.user?.role === 'ADMIN');
    const { orders, isLoading, mutate } = useAdminOrders(isAdmin);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [managing, setManaging] = useState<AdminOrder | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const q = search.trim().toLowerCase();
    const filtered = orders.filter((o) => {
        if (statusFilter && o.status !== statusFilter) return false;
        if (!q) return true;
        const code = `lc-${String(o.id).padStart(4, '0')}`;
        return code.includes(q)
            || String(o.id).includes(q)
            || (o.user?.email ?? '').toLowerCase().includes(q)
            || (o.user?.displayName ?? '').toLowerCase().includes(q);
    });
    const { page, setPage, totalPages, total, start, end, pageItems } = usePagination(filtered);

    const counts: Record<string, number> = {};
    for (const o of orders) counts[o.status] = (counts[o.status] ?? 0) + 1;
    const tabs = [{ key: '', label: 'All', count: orders.length }, ...ORDER_STATUSES.map((s) => ({ key: s, label: s, count: counts[s] ?? 0 }))];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tighter">Orders</h1>

            {isLoading ? <CardListSkeleton rows={6} />
                : orders.length === 0 ? <p className="text-secondary">No orders yet.</p>
                    : (
                        <>
                            <div className="relative md:max-w-sm">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    placeholder="Search by order # or email…"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-primary/10 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#46AEE8] text-gray-900"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {tabs.map((t) => (
                                    <button
                                        key={t.key || 'all'}
                                        onClick={() => { setStatusFilter(t.key); setPage(1); }}
                                        className={`px-3 py-1.5 rounded-[5px] text-xs font-bold uppercase tracking-wider transition-colors ${statusFilter === t.key ? 'bg-[#46AEE8] text-white' : 'bg-white border border-primary/10 text-secondary hover:bg-primary/5'}`}
                                    >
                                        {t.label} <span className="opacity-60">{t.count}</span>
                                    </button>
                                ))}
                            </div>

                            {filtered.length === 0 ? (
                                <p className="text-secondary">No orders match your filters.</p>
                            ) : (
                                <>
                                    <div className="space-y-3">
                                        {pageItems.map((o) => (
                                            <div key={o.id} className="bg-white border border-primary/5 rounded-2xl overflow-hidden">
                                                <div className="flex items-center justify-between gap-3 p-4">
                                                    <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="flex items-center gap-3 text-left min-w-0">
                                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded === o.id ? 'rotate-180' : ''}`} />
                                                        <div className="min-w-0">
                                                            <span className="font-bold text-primary">LC-{String(o.id).padStart(4, '0')}</span>
                                                            <span className="ml-3 text-sm text-gray-400 truncate">{o.user?.email ?? '—'}</span>
                                                        </div>
                                                    </button>
                                                    <div className="flex items-center gap-3 flex-shrink-0">
                                                        <span className="hidden sm:inline font-bold text-primary">${Number(o.total).toFixed(2)}</span>
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusBadge(o.status)}`}>{o.status}</span>
                                                        <button onClick={() => setManaging(o)} className="px-3 py-1.5 bg-[#46AEE8] text-white rounded-lg text-xs font-bold">Manage</button>
                                                    </div>
                                                </div>
                                                {expanded === o.id && (
                                                    <div className="px-4 pb-4 pt-1 border-t border-primary/5 space-y-2">
                                                        {(o.items ?? []).map((it) => (
                                                            <div key={it.id} className="flex justify-between text-sm text-secondary">
                                                                <span className="truncate pr-2">{it.name} × {it.quantity}</span>
                                                            </div>
                                                        ))}
                                                        <p className="text-xs text-gray-400 pt-1">
                                                            Customer: {o.user?.displayName ?? o.user?.email ?? '—'}
                                                            {o.trackingNumber ? ` · Tracking: ${o.trackingNumber}${o.carrier ? ` (${o.carrier})` : ''}` : ''}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} start={start} end={end} />
                                </>
                            )}
                        </>
                    )}

            {managing && (
                <ManageModal order={managing} onClose={() => setManaging(null)} onSaved={() => { setManaging(null); mutate(); }} />
            )}
        </div>
    );
}

function ManageModal({ order, onClose, onSaved }: { order: AdminOrder; onClose: () => void; onSaved: () => void }) {
    const [status, setStatus] = useState(order.status);
    const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? '');
    const [carrier, setCarrier] = useState(order.carrier ?? '');
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch(`/admin/orders/${order.id}/status`, {
                status,
                note: note || undefined,
                trackingNumber: trackingNumber || undefined,
                carrier: carrier || undefined,
            }, true);
            toast.success('Order updated');
            onSaved();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        } finally {
            setSaving(false);
        }
    };

    const field = 'w-full px-4 py-3 bg-gray-50 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#46AEE8] text-gray-900';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-primary uppercase tracking-tight">Manage LC-{String(order.id).padStart(4, '0')}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={save} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</label>
                        <Select
                            className={field}
                            value={status}
                            onChange={setStatus}
                            options={ORDER_STATUSES.map((s) => ({ value: s, label: s }))}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tracking #</label>
                            <input className={field} value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="e.g. DHL12345" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Carrier</label>
                            <input className={field} value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="e.g. DHL" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Note (optional)</label>
                        <input className={field} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Shown on the customer's tracking timeline" />
                    </div>
                    <button type="submit" disabled={saving} className="w-full bg-[#46AEE8] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm disabled:opacity-60">
                        {saving ? 'Saving…' : 'Update Order'}
                    </button>
                </form>
            </div>
        </div>
    );
}
