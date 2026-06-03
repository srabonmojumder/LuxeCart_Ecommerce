'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCategories } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';
import { CardListSkeleton } from '@/components/ui/Skeleton';

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

    const remove = async (id: number) => {
        if (!confirm('Delete this category? (must have no products)')) return;
        try {
            await api.del(`/admin/categories/${id}`, true);
            toast.success('Category deleted');
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-black text-primary dark:text-white tracking-tighter">Categories</h1>

            <form onSubmit={add} className="flex gap-3">
                <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="New category name"
                    className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-primary/10 dark:border-slate-800 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white" />
                <button disabled={adding} className="bg-primary dark:bg-accent text-white px-5 py-3 rounded-xl font-bold text-sm disabled:opacity-60">Add</button>
            </form>

            {isLoading ? <CardListSkeleton rows={6} /> : (
                <ul className="space-y-3">
                    {categories.map((c) => (
                        <li key={c.id} className="flex items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-primary/5 dark:border-slate-800 rounded-xl">
                            {editingId === c.id ? (
                                <>
                                    <input value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus
                                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-800 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white" />
                                    <button onClick={() => saveEdit(c.id)} className="px-3 py-2 bg-primary dark:bg-accent text-white rounded-lg text-xs font-bold">Save</button>
                                    <button onClick={() => setEditingId(null)} className="px-3 py-2 text-gray-400 text-xs font-bold">Cancel</button>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <span className="font-semibold text-primary dark:text-white">{c.name}</span>
                                        <span className="ml-3 text-xs text-gray-400">{c.count} products</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingId(c.id); setEditName(c.name); }} className="p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-slate-800"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => remove(c.id)} className="p-2 rounded-lg hover:bg-hot/10 text-hot"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
