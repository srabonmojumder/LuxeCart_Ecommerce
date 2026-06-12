'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminReturns, type AdminReturn } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';
import Select from '@/components/ui/Select';
import { CardListSkeleton } from '@/components/ui/Skeleton';

const STATUSES: AdminReturn['status'][] = ['REQUESTED', 'APPROVED', 'REJECTED', 'RECEIVED', 'REFUNDED'];

const badge = (s: string) => {
    if (s === 'REFUNDED' || s === 'APPROVED') return 'bg-emerald-500/10 text-emerald-600';
    if (s === 'REJECTED') return 'bg-hot/10 text-hot';
    if (s === 'RECEIVED') return 'bg-[#46AEE8]/10 text-[#46AEE8]';
    return 'bg-amber-500/10 text-amber-600';
};

function ReturnRow({ r, onChanged }: { r: AdminReturn; onChanged: () => void }) {
    const [status, setStatus] = useState<AdminReturn['status']>(r.status);
    const [note, setNote] = useState(r.adminNote ?? '');
    const [saving, setSaving] = useState(false);

    const save = async () => {
        setSaving(true);
        try {
            await api.patch(`/admin/returns/${r.id}`, { status, adminNote: note || undefined }, true);
            toast.success('Return updated');
            onChanged();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-5 bg-white border border-primary/5 rounded-2xl space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Link href={`/admin/orders`} className="text-sm font-black text-primary">LC-{String(r.orderId).padStart(4, '0')}</Link>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${badge(r.status)}`}>{r.status}</span>
                        <span className="text-xs text-gray-400">{r.customer}</span>
                    </div>
                    <p className="text-sm text-secondary"><b>Reason:</b> {r.reason}</p>
                    <p className="text-xs text-gray-400">Order total: ${r.orderTotal.toFixed(2)} · {new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                <Select
                    value={status}
                    onChange={(v) => setStatus(v as AdminReturn['status'])}
                    options={STATUSES.map((s) => ({ value: s, label: s }))}
                    className="px-3 py-2 rounded-[5px] bg-gray-50 border border-primary/10 text-sm font-bold text-primary min-w-[150px]"
                />
                <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Note to customer (optional)"
                    className="flex-1 px-3 py-2 rounded-[5px] bg-gray-50 border border-primary/10 text-sm text-gray-900"
                />
                <button onClick={save} disabled={saving} className="px-5 py-2 rounded-lg bg-[#46AEE8] text-white text-xs font-black uppercase tracking-widest disabled:opacity-60">
                    {saving ? 'Saving…' : 'Update'}
                </button>
            </div>
        </div>
    );
}

export default function AdminReturnsPage() {
    const isAdmin = useAuthStore((s) => s.status === 'authenticated' && s.user?.role === 'ADMIN');
    const { returns, isLoading, mutate } = useAdminReturns(isAdmin);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tighter flex items-center gap-3">
                <RotateCcw className="w-7 h-7 text-[#46AEE8]" /> Returns &amp; Refunds
            </h1>

            {isLoading ? <CardListSkeleton rows={5} />
                : returns.length === 0 ? <p className="text-secondary">No return requests yet.</p>
                    : <div className="space-y-3">{returns.map((r) => <ReturnRow key={r.id} r={r} onChanged={mutate} />)}</div>}
        </div>
    );
}
