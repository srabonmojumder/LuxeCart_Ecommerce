'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminOrders, type AdminOrder } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';

const ORDER_STATUSES = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export default function AdminOrdersPage() {
    const isAdmin = useAuthStore((s) => s.status === 'authenticated' && s.user?.role === 'ADMIN');
    const { orders, isLoading, mutate } = useAdminOrders(isAdmin);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [managing, setManaging] = useState<AdminOrder | null>(null);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-black text-primary dark:text-white tracking-tighter">Orders</h1>

            {isLoading ? <p className="text-secondary dark:text-gray-400">Loading…</p>
                : orders.length === 0 ? <p className="text-secondary dark:text-gray-400">No orders yet.</p>
                    : (
                        <div className="space-y-3">
                            {orders.map((o) => (
                                <div key={o.id} className="bg-white dark:bg-slate-900 border border-primary/5 dark:border-slate-800 rounded-2xl overflow-hidden">
                                    <div className="flex items-center justify-between gap-3 p-4">
                                        <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="flex items-center gap-3 text-left min-w-0">
                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded === o.id ? 'rotate-180' : ''}`} />
                                            <div className="min-w-0">
                                                <span className="font-bold text-primary dark:text-white">LC-{String(o.id).padStart(4, '0')}</span>
                                                <span className="ml-3 text-sm text-gray-400 truncate">{o.user?.email ?? '—'}</span>
                                            </div>
                                        </button>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <span className="hidden sm:inline font-bold text-primary dark:text-white">${Number(o.total).toFixed(2)}</span>
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-accent/10 text-accent">{o.status}</span>
                                            <button onClick={() => setManaging(o)} className="px-3 py-1.5 bg-primary dark:bg-accent text-white rounded-lg text-xs font-bold">Manage</button>
                                        </div>
                                    </div>
                                    {expanded === o.id && (
                                        <div className="px-4 pb-4 pt-1 border-t border-primary/5 dark:border-slate-800 space-y-2">
                                            {(o.items ?? []).map((it) => (
                                                <div key={it.id} className="flex justify-between text-sm text-secondary dark:text-gray-400">
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

    const field = 'w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-primary dark:text-white uppercase tracking-tight">Manage LC-{String(order.id).padStart(4, '0')}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={save} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</label>
                        <select className={field} value={status} onChange={(e) => setStatus(e.target.value)}>
                            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
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
                    <button type="submit" disabled={saving} className="w-full bg-primary dark:bg-accent text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm disabled:opacity-60">
                        {saving ? 'Saving…' : 'Update Order'}
                    </button>
                </form>
            </div>
        </div>
    );
}
