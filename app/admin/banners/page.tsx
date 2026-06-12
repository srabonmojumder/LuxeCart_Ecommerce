'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminBanners } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';
import { CardGridSkeleton } from '@/components/ui/Skeleton';

const field = 'w-full px-4 py-3 bg-gray-50 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#46AEE8] text-gray-900';

export default function AdminBannersPage() {
    const isAdmin = useAuthStore((s) => s.status === 'authenticated' && s.user?.role === 'ADMIN');
    const { banners, isLoading, mutate } = useAdminBanners(isAdmin);
    const [form, setForm] = useState({ title: '', subtitle: '', image: '', ctaText: '', ctaLink: '', position: '0' });
    const [saving, setSaving] = useState(false);

    const create = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/admin/banners', {
                title: form.title,
                subtitle: form.subtitle || null,
                image: form.image,
                ctaText: form.ctaText || null,
                ctaLink: form.ctaLink || null,
                position: Number(form.position) || 0,
            }, true);
            toast.success('Banner created');
            setForm({ title: '', subtitle: '', image: '', ctaText: '', ctaLink: '', position: '0' });
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        } finally {
            setSaving(false);
        }
    };

    const toggle = async (id: number, active: boolean) => {
        try { await api.patch(`/admin/banners/${id}`, { active: !active }, true); mutate(); }
        catch (err) { toast.error(err instanceof ApiError ? err.message : 'Failed'); }
    };
    const remove = async (id: number) => {
        if (!confirm('Delete this banner?')) return;
        try { await api.del(`/admin/banners/${id}`, true); toast.success('Deleted'); mutate(); }
        catch (err) { toast.error(err instanceof ApiError ? err.message : 'Failed'); }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tighter">Homepage Banners</h1>

            <form onSubmit={create} className="bg-white border border-primary/5 rounded-2xl p-5 grid sm:grid-cols-2 gap-3">
                <input className={field} placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <input className={field} placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
                <input className={`${field} sm:col-span-2`} placeholder="Image URL (e.g. /home_accessories_hero.png)" required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                <input className={field} placeholder="CTA text (e.g. Shop Now)" value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} />
                <input className={field} placeholder="CTA link (e.g. /products)" value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} />
                <input className={field} type="number" placeholder="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
                <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 bg-[#46AEE8] text-white px-4 py-3 rounded-xl font-bold text-sm disabled:opacity-60"><Plus className="w-4 h-4" /> Add Banner</button>
            </form>

            {isLoading ? <CardGridSkeleton count={4} className="grid sm:grid-cols-2 gap-4" /> : banners.length === 0 ? <p className="text-secondary">No banners yet.</p> : (
                <div className="grid sm:grid-cols-2 gap-4">
                    {banners.map((b) => (
                        <div key={b.id} className="bg-white border border-primary/5 rounded-2xl overflow-hidden">
                            <div className="relative h-32 bg-gray-100">
                                {b.image && <Image src={b.image} alt={b.title} fill className="object-cover" />}
                            </div>
                            <div className="p-4 flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="font-bold text-primary truncate">{b.title}</p>
                                    <p className="text-xs text-gray-400 truncate">{b.subtitle}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => toggle(b.id, b.active)} className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${b.active ? 'bg-new/10 text-new' : 'bg-gray-100 text-gray-400'}`}>{b.active ? 'Live' : 'Off'}</button>
                                    <button onClick={() => remove(b.id)} className="p-2 rounded-lg hover:bg-hot/10 text-hot"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
