'use client';

import { Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useSubscribers } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';
import { usePagination } from '@/lib/usePagination';
import Pagination from '@/components/ui/Pagination';

const formatDate = (s: string) => new Date(s).toLocaleDateString();

export default function AdminNewsletterPage() {
    const isAdmin = useAuthStore((s) => s.status === 'authenticated' && s.user?.role === 'ADMIN');
    const { subscribers, isLoading, mutate } = useSubscribers(isAdmin);
    const { page, setPage, totalPages, total, start, end, pageItems } = usePagination(subscribers);

    const remove = async (id: number) => {
        if (!confirm('Remove this subscriber?')) return;
        try { await api.del(`/admin/newsletter/${id}`, true); toast.success('Removed'); mutate(); }
        catch (err) { toast.error(err instanceof ApiError ? err.message : 'Failed'); }
    };

    const exportCsv = () => {
        const csv = ['email,subscribed_at', ...subscribers.map((s) => `${s.email},${s.createdAt}`)].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subscribers.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-primary dark:text-white tracking-tighter">Newsletter</h1>
                {subscribers.length > 0 && (
                    <button onClick={exportCsv} className="flex items-center gap-2 bg-primary dark:bg-accent text-white px-4 py-2.5 rounded-xl font-bold text-sm"><Download className="w-4 h-4" /> Export CSV</button>
                )}
            </div>

            {isLoading ? <p className="text-secondary dark:text-gray-400">Loading…</p> : subscribers.length === 0 ? <p className="text-secondary dark:text-gray-400">No subscribers yet.</p> : (
                <>
                <div className="overflow-x-auto rounded-2xl border border-primary/5 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <table className="w-full text-sm">
                        <thead className="bg-primary/5 dark:bg-slate-800/50 text-left">
                            <tr className="text-[10px] uppercase tracking-wider text-gray-400"><th className="p-4">Email</th><th className="p-4">Subscribed</th><th className="p-4 text-right">Action</th></tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5 dark:divide-slate-800">
                            {pageItems.map((s) => (
                                <tr key={s.id} className="text-primary dark:text-white">
                                    <td className="p-4 font-medium">{s.email}</td>
                                    <td className="p-4 text-gray-500 dark:text-gray-400">{formatDate(s.createdAt)}</td>
                                    <td className="p-4 text-right"><button onClick={() => remove(s.id)} className="p-2 rounded-lg hover:bg-hot/10 text-hot"><Trash2 className="w-4 h-4" /></button></td>
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
