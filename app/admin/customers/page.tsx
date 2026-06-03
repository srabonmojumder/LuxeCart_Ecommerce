'use client';

import { Shield, ShieldOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminUsers } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';
import { usePagination } from '@/lib/usePagination';
import Pagination from '@/components/ui/Pagination';
import { TableSkeleton } from '@/components/ui/Skeleton';

const formatDate = (s: string) => {
    const d = new Date(s);
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
};

export default function AdminCustomersPage() {
    const me = useAuthStore((s) => s.user);
    const isAdmin = useAuthStore((s) => s.status === 'authenticated' && s.user?.role === 'ADMIN');
    const { users, isLoading, mutate } = useAdminUsers(isAdmin);
    const { page, setPage, totalPages, total, start, end, pageItems } = usePagination(users);

    const setRole = async (id: number, role: 'CUSTOMER' | 'ADMIN') => {
        try {
            await api.patch(`/admin/users/${id}/role`, { role }, true);
            toast.success(`Role updated to ${role}`);
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        }
    };

    const remove = async (id: number) => {
        if (!confirm('Delete this user?')) return;
        try {
            await api.del(`/admin/users/${id}`, true);
            toast.success('User deleted');
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tighter">Customers</h1>

            {isLoading ? <TableSkeleton rows={8} cols={6} /> : (
                <>
                <div className="overflow-x-auto rounded-2xl border border-primary/5 bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-primary/5 text-left">
                            <tr className="text-[10px] uppercase tracking-wider text-gray-400">
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Orders</th>
                                <th className="p-4">Joined</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {pageItems.map((u) => {
                                const self = u.id === me?.id;
                                return (
                                    <tr key={u.id} className="text-primary">
                                        <td className="p-4 font-semibold">{u.displayName ?? '—'}{self && <span className="ml-2 text-[10px] text-[#46AEE8]">(you)</span>}</td>
                                        <td className="p-4 text-gray-500">{u.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-[#46AEE8]/10 text-[#46AEE8]' : 'bg-gray-100 text-gray-500'}`}>{u.role}</span>
                                        </td>
                                        <td className="p-4">{u._count.orders}</td>
                                        <td className="p-4 text-gray-500">{formatDate(u.createdAt)}</td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                {!self && (u.role === 'CUSTOMER' ? (
                                                    <button onClick={() => setRole(u.id, 'ADMIN')} title="Make admin" className="p-2 rounded-lg hover:bg-[#46AEE8]/10 text-[#46AEE8]"><Shield className="w-4 h-4" /></button>
                                                ) : (
                                                    <button onClick={() => setRole(u.id, 'CUSTOMER')} title="Revoke admin" className="p-2 rounded-lg hover:bg-primary/10"><ShieldOff className="w-4 h-4" /></button>
                                                ))}
                                                {!self && u._count.orders === 0 && (
                                                    <button onClick={() => remove(u.id)} title="Delete" className="p-2 rounded-lg hover:bg-hot/10 text-hot"><Trash2 className="w-4 h-4" /></button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} start={start} end={end} />
                </>
            )}
        </div>
    );
}
