'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminProducts, useCategories, type AdminProduct, type Category } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';

interface ProductFormState {
    id?: number;
    name: string;
    description: string;
    price: string;
    discount: string;
    image: string;
    stock: string;
    categoryId: string;
    tags: string;
    featured: boolean;
}

const emptyProduct: ProductFormState = {
    name: '', description: '', price: '', discount: '0', image: '', stock: '0', categoryId: '', tags: '', featured: false,
};

export default function AdminProductsPage() {
    const isAdmin = useAuthStore((s) => s.status === 'authenticated' && s.user?.role === 'ADMIN');
    const { products, isLoading, mutate } = useAdminProducts(isAdmin);
    const { categories } = useCategories();
    const [editing, setEditing] = useState<ProductFormState | null>(null);
    const [search, setSearch] = useState('');

    const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    const openNew = () => setEditing({ ...emptyProduct, categoryId: String(categories[0]?.id ?? '') });
    const openEdit = (p: AdminProduct) => setEditing({
        id: p.id,
        name: p.name,
        description: '',
        price: String(Number(p.price)),
        discount: String(p.discount),
        image: p.image,
        stock: String(p.stock),
        categoryId: String(p.category?.id ?? ''),
        tags: (p.tags ?? []).map((t) => t.tag.name).join(', '),
        featured: p.featured,
    });

    const remove = async (id: number) => {
        if (!confirm('Deactivate this product?')) return;
        try {
            await api.del(`/admin/products/${id}`, true);
            toast.success('Product deactivated');
            mutate();
        } catch (e) {
            toast.error(e instanceof ApiError ? e.message : 'Failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-primary dark:text-white tracking-tighter">Products</h1>
                <button onClick={openNew} className="flex items-center gap-2 bg-primary dark:bg-accent text-white px-4 py-2.5 rounded-xl font-bold text-sm">
                    <Plus className="w-4 h-4" /> New Product
                </button>
            </div>

            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full md:max-w-sm px-4 py-2.5 bg-white dark:bg-slate-900 border border-primary/10 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white"
            />

            {isLoading ? <p className="text-secondary dark:text-gray-400">Loading…</p> : (
                <div className="overflow-x-auto rounded-2xl border border-primary/5 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <table className="w-full text-sm">
                        <thead className="bg-primary/5 dark:bg-slate-800/50 text-left">
                            <tr className="text-[10px] uppercase tracking-wider text-gray-400">
                                <th className="p-4">Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Active</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5 dark:divide-slate-800">
                            {filtered.map((p) => (
                                <tr key={p.id} className="text-primary dark:text-white">
                                    <td className="p-4 font-semibold max-w-[220px] truncate">{p.name}</td>
                                    <td className="p-4 text-gray-500 dark:text-gray-400">{p.category?.name ?? '—'}</td>
                                    <td className="p-4">${Number(p.price).toFixed(2)}</td>
                                    <td className="p-4">{p.stock}</td>
                                    <td className="p-4">{p.isActive ? '✓' : '—'}</td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-slate-800"><Pencil className="w-4 h-4" /></button>
                                            <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-hot/10 text-hot"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editing && (
                <ProductModal
                    state={editing}
                    categories={categories}
                    onClose={() => setEditing(null)}
                    onSaved={() => { setEditing(null); mutate(); }}
                />
            )}
        </div>
    );
}

function ProductModal({ state, categories, onClose, onSaved }: {
    state: ProductFormState;
    categories: Category[];
    onClose: () => void;
    onSaved: () => void;
}) {
    const [form, setForm] = useState(state);
    const [saving, setSaving] = useState(false);
    const isEdit = !!form.id;
    const set = (k: keyof ProductFormState, v: string) => setForm({ ...form, [k]: v });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const payload: Record<string, unknown> = {
            name: form.name,
            description: form.description || form.name,
            price: Number(form.price),
            discount: Number(form.discount) || 0,
            image: form.image,
            stock: Number(form.stock) || 0,
            categoryId: Number(form.categoryId),
            tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
            featured: form.featured,
        };
        try {
            if (isEdit) await api.patch(`/admin/products/${form.id}`, payload, true);
            else await api.post('/admin/products', payload, true);
            toast.success(isEdit ? 'Product updated' : 'Product created');
            onSaved();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    const field = 'w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-primary dark:text-white uppercase tracking-tight">{isEdit ? 'Edit' : 'New'} Product</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    <input className={field} placeholder="Name" required value={form.name} onChange={(e) => set('name', e.target.value)} />
                    <textarea className={field} placeholder="Description" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                        <input className={field} type="number" step="0.01" placeholder="Price" required value={form.price} onChange={(e) => set('price', e.target.value)} />
                        <input className={field} type="number" placeholder="Discount %" value={form.discount} onChange={(e) => set('discount', e.target.value)} />
                        <input className={field} type="number" placeholder="Stock" value={form.stock} onChange={(e) => set('stock', e.target.value)} />
                        <select className={field} required value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
                            <option value="">Category…</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <input className={field} placeholder="Image URL (e.g. /photo-xxxx.webp)" required value={form.image} onChange={(e) => set('image', e.target.value)} />
                    <input className={field} placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => set('tags', e.target.value)} />
                    <label className="flex items-center gap-2.5 cursor-pointer py-1">
                        <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-accent" />
                        <span className="text-sm font-medium text-primary dark:text-white">Featured (show on homepage)</span>
                    </label>
                    <button type="submit" disabled={saving} className="w-full bg-primary dark:bg-accent text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm disabled:opacity-60">
                        {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
                    </button>
                </form>
            </div>
        </div>
    );
}
