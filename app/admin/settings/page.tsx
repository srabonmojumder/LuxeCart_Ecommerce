'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useSettings, type Settings } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';

const field = 'w-full px-4 py-3 bg-white dark:bg-slate-900 border border-primary/10 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white';
const label = 'text-[10px] font-black uppercase tracking-widest text-gray-400';

export default function AdminSettingsPage() {
    const { settings, mutate } = useSettings();
    const [form, setForm] = useState<Settings | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (settings && !form) setForm(settings);
    }, [settings, form]);

    if (!form) return <p className="text-secondary dark:text-gray-400">Loading…</p>;

    const set = (k: keyof Settings, v: string | number) => setForm({ ...form, [k]: v });

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/admin/settings', {
                storeName: form.storeName,
                supportEmail: form.supportEmail,
                supportPhone: form.supportPhone,
                address: form.address,
                facebook: form.facebook,
                instagram: form.instagram,
                twitter: form.twitter,
                announcement: form.announcement,
                freeShippingThreshold: Number(form.freeShippingThreshold),
                shippingFlat: Number(form.shippingFlat),
                taxRate: Number(form.taxRate),
                currencyCode: form.currencyCode,
                currencySymbol: form.currencySymbol,
            }, true);
            toast.success('Settings saved');
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-black text-primary dark:text-white tracking-tighter">Store Settings</h1>
            <form onSubmit={save} className="space-y-5">
                <div className="space-y-1.5"><label className={label}>Store Name</label><input className={field} value={form.storeName} onChange={(e) => set('storeName', e.target.value)} /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5"><label className={label}>Support Email</label><input className={field} value={form.supportEmail} onChange={(e) => set('supportEmail', e.target.value)} /></div>
                    <div className="space-y-1.5"><label className={label}>Support Phone</label><input className={field} value={form.supportPhone} onChange={(e) => set('supportPhone', e.target.value)} /></div>
                </div>
                <div className="space-y-1.5"><label className={label}>Address</label><input className={field} value={form.address ?? ''} onChange={(e) => set('address', e.target.value)} /></div>
                <div className="space-y-1.5"><label className={label}>Announcement Bar Text</label><input className={field} value={form.announcement ?? ''} onChange={(e) => set('announcement', e.target.value)} placeholder="e.g. Free shipping on orders $50+" /></div>
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5"><label className={label}>Facebook URL</label><input className={field} value={form.facebook ?? ''} onChange={(e) => set('facebook', e.target.value)} /></div>
                    <div className="space-y-1.5"><label className={label}>Instagram URL</label><input className={field} value={form.instagram ?? ''} onChange={(e) => set('instagram', e.target.value)} /></div>
                    <div className="space-y-1.5"><label className={label}>Twitter URL</label><input className={field} value={form.twitter ?? ''} onChange={(e) => set('twitter', e.target.value)} /></div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5"><label className={label}>Free Shipping ≥</label><input type="number" step="0.01" className={field} value={form.freeShippingThreshold} onChange={(e) => set('freeShippingThreshold', e.target.value)} /></div>
                    <div className="space-y-1.5"><label className={label}>Flat Shipping</label><input type="number" step="0.01" className={field} value={form.shippingFlat} onChange={(e) => set('shippingFlat', e.target.value)} /></div>
                    <div className="space-y-1.5"><label className={label}>Tax Rate (0–1)</label><input type="number" step="0.01" className={field} value={form.taxRate} onChange={(e) => set('taxRate', e.target.value)} /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5"><label className={label}>Currency Code</label><input className={field} value={form.currencyCode} onChange={(e) => set('currencyCode', e.target.value)} /></div>
                    <div className="space-y-1.5"><label className={label}>Currency Symbol</label><input className={field} value={form.currencySymbol} onChange={(e) => set('currencySymbol', e.target.value)} /></div>
                </div>
                <button type="submit" disabled={saving} className="px-10 py-3.5 bg-primary dark:bg-accent text-white rounded-xl font-bold uppercase tracking-wider text-sm disabled:opacity-60">
                    {saving ? 'Saving…' : 'Save Settings'}
                </button>
            </form>
        </div>
    );
}
