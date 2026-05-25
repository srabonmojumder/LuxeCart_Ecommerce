'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, XCircle, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api';
import type { Order } from '@/lib/hooks';

const RETURN_LABEL: Record<string, string> = {
    REQUESTED: 'Return requested — under review',
    APPROVED: 'Return approved — ship the item back',
    REJECTED: 'Return request was declined',
    RECEIVED: 'Return received — processing refund',
    REFUNDED: 'Refunded',
};

/** Customer actions for a single order: invoice, cancel, return. */
export default function OrderActions({ order, onChanged }: { order: Order; onChanged: () => void }) {
    const [busy, setBusy] = useState<null | 'cancel' | 'return'>(null);
    const [showCancel, setShowCancel] = useState(false);
    const [showReturn, setShowReturn] = useState(false);
    const [reason, setReason] = useState('');

    const openReturn = order.returns.find((r) => !['REJECTED', 'REFUNDED'].includes(r.status));
    const latestReturn = order.returns[0];
    const canReturn = order.status === 'DELIVERED' && !openReturn;

    const doCancel = async () => {
        setBusy('cancel');
        try {
            await api.post(`/orders/${order.id}/cancel`, { reason: reason || undefined }, true);
            toast.success('Order cancelled');
            setShowCancel(false);
            setReason('');
            onChanged();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Could not cancel order');
        } finally {
            setBusy(null);
        }
    };

    const doReturn = async () => {
        if (reason.trim().length < 5) return toast.error('Please describe the reason (min 5 chars)');
        setBusy('return');
        try {
            await api.post(`/orders/${order.id}/return`, { reason }, true);
            toast.success('Return request submitted');
            setShowReturn(false);
            setReason('');
            onChanged();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Could not submit return');
        } finally {
            setBusy(null);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-primary/5 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="font-black text-primary dark:text-white uppercase tracking-tight">Actions</h2>

            {/* Existing return status */}
            {latestReturn && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/5 border border-accent/20 text-sm font-semibold text-accent">
                    <RotateCcw className="w-4 h-4" /> {RETURN_LABEL[latestReturn.status] ?? latestReturn.status}
                    {latestReturn.adminNote && <span className="text-secondary dark:text-gray-400">— {latestReturn.adminNote}</span>}
                </div>
            )}

            <div className="flex flex-wrap gap-3">
                <Link
                    href={`/orders/${order.id}/invoice`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white dark:bg-slate-800 text-xs font-black uppercase tracking-widest hover:opacity-90"
                >
                    <FileText className="w-4 h-4" /> Invoice
                </Link>

                {order.canCancel && (
                    <button
                        onClick={() => { setShowCancel(true); setShowReturn(false); setReason(''); }}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-hot/40 text-hot text-xs font-black uppercase tracking-widest hover:bg-hot/5"
                    >
                        <XCircle className="w-4 h-4" /> Cancel order
                    </button>
                )}

                {canReturn && (
                    <button
                        onClick={() => { setShowReturn(true); setShowCancel(false); setReason(''); }}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-accent/40 text-accent text-xs font-black uppercase tracking-widest hover:bg-accent/5"
                    >
                        <RotateCcw className="w-4 h-4" /> Request return
                    </button>
                )}
            </div>

            {/* Cancel form */}
            {showCancel && (
                <div className="p-4 rounded-xl bg-hot/5 border border-hot/20 space-y-3">
                    <p className="text-sm font-semibold text-primary dark:text-white">Cancel this order? Stock will be released back.</p>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Reason (optional)"
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-primary/10 dark:border-slate-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-hot/40"
                    />
                    <div className="flex gap-2">
                        <button onClick={doCancel} disabled={busy === 'cancel'} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-hot text-white text-xs font-black uppercase tracking-widest disabled:opacity-60">
                            {busy === 'cancel' && <Loader2 className="w-4 h-4 animate-spin" />} Confirm cancel
                        </button>
                        <button onClick={() => setShowCancel(false)} className="px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-secondary dark:text-gray-400">Keep order</button>
                    </div>
                </div>
            )}

            {/* Return form */}
            {showReturn && (
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 space-y-3">
                    <p className="text-sm font-semibold text-primary dark:text-white">Tell us why you&apos;d like to return this order.</p>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g. wrong size, damaged on arrival…"
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-primary/10 dark:border-slate-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                    <div className="flex gap-2">
                        <button onClick={doReturn} disabled={busy === 'return'} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-xs font-black uppercase tracking-widest disabled:opacity-60">
                            {busy === 'return' && <Loader2 className="w-4 h-4 animate-spin" />} Submit request
                        </button>
                        <button onClick={() => setShowReturn(false)} className="px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-secondary dark:text-gray-400">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
