'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminCoupons } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';
import Select from '@/components/ui/Select';
import { usePagination } from '@/lib/usePagination';
import Pagination from '@/components/ui/Pagination';
import { TableSkeleton } from '@/components/ui/Skeleton';

const field = 'w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white';

export default function AdminCouponsPage() {
    const isAdmin = useAuthStore((s) => s.status === 'authenticated' && s.user?.role === 'ADMIN');
    const { coupons, isLoading, mutate } = useAdminCoupons(isAdmin);
    const { page, setPage, totalPages, total, start, end, pageItems } = usePagination(coupons);
    const [form, setForm] = useState({ code: '', type: 'PERCENT', value: '', minSubtotal: '0', maxUses: '' });
    const [saving, setSaving] = useState(false);

    const create = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/admin/coupons', {
                code: form.code,
                type: form.type,
                value: Number(form.value),
                minSubtotal: Number(form.minSubtotal) || 0,
                maxUses: form.maxUses ? Number(form.maxUses) : null,
            }, true);
            toast.success('Coupon created');
            setForm({ code: '', type: 'PERCENT', value: '', minSubtotal: '0', maxUses: '' });
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        } finally {
            setSaving(false);
        }
    };

    const toggle = async (id: number, active: boolean) => {
        try { await api.patch(`/admin/coupons/${id}`, { active: !active }, true); mutate(); }
        catch (err) { toast.error(err instanceof ApiError ? err.message : 'Failed'); }
    };

    const remove = async (id: number) => {
        if (!confirm('Delete this coupon?')) return;
        try { await api.del(`/admin/coupons/${id}`, true); toast.success('Deleted'); mutate(); }
        catch (err) { toast.error(err instanceof ApiError ? err.message : 'Failed'); }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-black text-primary dark:text-white tracking-tighter">Coupons</h1>

            <form onSubmit={create} className="bg-white dark:bg-slate-900 border border-primary/5 dark:border-slate-800 rounded-2xl p-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                <input className={field} placeholder="CODE" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
                <Select
                    className={field}
                    value={form.type}
                    onChange={(v) => setForm({ ...form, type: v })}
                    options={[
                        { value: 'PERCENT', label: 'Percent %' },
                        { value: 'FIXED', label: 'Fixed $' },
                    ]}
                />
                <input className={field} type="number" step="0.01" placeholder="Value" required value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
                <input className={field} type="number" step="0.01" placeholder="Min subtotal" value={form.minSubtotal} onChange={(e) => setForm({ ...form, minSubtotal: e.target.value })} />
                <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 bg-primary dark:bg-accent text-white px-4 py-3 rounded-xl font-bold text-sm disabled:opacity-60"><Plus className="w-4 h-4" /> Add</button>
            </form>

            {isLoading ? <TableSkeleton rows={6} cols={6} /> : coupons.length === 0 ? <p className="text-secondary dark:text-gray-400">No coupons yet.</p> : (
                <>
                <div className="overflow-x-auto rounded-2xl border border-primary/5 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <table className="w-full text-sm">
                        <thead className="bg-primary/5 dark:bg-slate-800/50 text-left">
                            <tr className="text-[10px] uppercase tracking-wider text-gray-400">
                                <th className="p-4">Code</th><th className="p-4">Discount</th><th className="p-4">Min</th><th className="p-4">Used</th><th className="p-4">Active</th><th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5 dark:divide-slate-800">
                            {pageItems.map((c) => (
                                <tr key={c.id} className="text-primary dark:text-white">
                                    <td className="p-4 font-bold">{c.code}</td>
                                    <td className="p-4">{c.type === 'PERCENT' ? `${c.value}%` : `$${c.value}`}</td>
                                    <td className="p-4">${c.minSubtotal}</td>
                                    <td className="p-4">{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ''}</td>
                                    <td className="p-4">
                                        <button onClick={() => toggle(c.id, c.active)} className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${c.active ? 'bg-new/10 text-new' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>{c.active ? 'Active' : 'Off'}</button>
                                    </td>
                                    <td className="p-4 text-right"><button onClick={() => remove(c.id)} className="p-2 rounded-lg hover:bg-hot/10 text-hot"><Trash2 className="w-4 h-4" /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} start={start} end={end} />
                </>
            )}
        </div>
    );
}
