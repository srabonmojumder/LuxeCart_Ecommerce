'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus, Tag as TagIcon, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useCategories } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';
import { CardListSkeleton } from '@/components/ui/Skeleton';
import { useConfirm } from '@/components/admin/ConfirmProvider';

const SKY = '#46AEE8';
const input = 'w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46AEE8] text-slate-800';

export default function AdminCategoriesPage() {
    const { categories, isLoading, mutate } = useCategories();
    const [name, setName] = useState('');
    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');

    const add = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);
        try {
            await api.post('/admin/categories', { name }, true);
            toast.success('Category created');
            setName('');
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        } finally {
            setAdding(false);
        }
    };

    const saveEdit = async (id: number) => {
        try {
            await api.patch(`/admin/categories/${id}`, { name: editName }, true);
            toast.success('Category updated');
            setEditingId(null);
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        }
    };

    const confirm = useConfirm();

    const remove = async (id: number) => {
        if (!(await confirm('Delete this category? (must have no products)'))) return;
        try {
            await api.del(`/admin/categories/${id}`, true);
            toast.success('Category deleted');
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        }
    };

    return (
        <div className="space-y-5">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Categories</h1>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 md:p-6 space-y-5">
                {/* add form */}
                <form onSubmit={add} className="flex flex-col sm:flex-row gap-3">
                    <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="New category name" className={input} />
                    <button disabled={adding} className="flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-60 shrink-0" style={{ backgroundColor: SKY }}>
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </form>

                {/* list */}
                {isLoading ? <CardListSkeleton rows={6} /> : categories.length === 0 ? (
                    <p className="text-sm text-slate-400 py-6 text-center">No categories yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {categories.map((c) => (
                            <div key={c.id} className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl">
                                {editingId === c.id ? (
                                    <>
                                        <input value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus
                                            className="flex-1 px-3 py-2 bg-white border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#46AEE8] text-slate-800" />
                                        <button onClick={() => saveEdit(c.id)} title="Save" className="w-9 h-9 flex items-center justify-center text-white rounded-lg shrink-0" style={{ backgroundColor: SKY }}><Check className="w-4 h-4" /></button>
                                        <button onClick={() => setEditingId(null)} title="Cancel" className="w-9 h-9 flex items-center justify-center text-slate-400 hover:bg-slate-200/60 rounded-lg shrink-0"><X className="w-4 h-4" /></button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${SKY}1a`, color: SKY }}><TagIcon className="w-4 h-4" /></span>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-800 truncate">{c.name}</p>
                                                <p className="text-xs text-slate-400">{c.count} products</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5 shrink-0">
                                            <button onClick={() => { setEditingId(c.id); setEditName(c.name); }} title="Edit" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-200/60 text-slate-500"><Pencil className="w-4 h-4" /></button>
                                            <button onClick={() => remove(c.id)} title="Delete" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-rose-50 text-rose-500"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
