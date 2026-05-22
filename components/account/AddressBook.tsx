'use client';

import { useState } from 'react';
import { MapPin, Trash2, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAddresses } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';

const emptyForm = {
    fullName: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: '', phone: '', isDefault: false,
};

export default function AddressBook() {
    const { addresses, isLoading, mutate } = useAddresses(true);
    const [form, setForm] = useState(emptyForm);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const set = (k: keyof typeof emptyForm, v: string | boolean) => setForm({ ...form, [k]: v });

    const add = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/account/addresses', {
                ...form,
                line2: form.line2 || undefined,
                state: form.state || undefined,
                phone: form.phone || undefined,
            }, true);
            toast.success('Address saved');
            setForm(emptyForm);
            setShowForm(false);
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: number) => {
        try {
            await api.del(`/account/addresses/${id}`, true);
            toast.success('Address removed');
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        }
    };

    const makeDefault = async (id: number) => {
        try {
            await api.patch(`/account/addresses/${id}`, { isDefault: true }, true);
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        }
    };

    const field = 'w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white';

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b-2 border-primary dark:border-white pb-8">
                <h2 className="text-4xl font-black text-primary dark:text-white tracking-tighter uppercase">Address Book</h2>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-primary dark:bg-accent text-white px-4 py-2.5 rounded-xl font-bold text-sm">
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            {showForm && (
                <form onSubmit={add} className="grid md:grid-cols-2 gap-4 p-6 bg-primary/2 dark:bg-slate-900 rounded-3xl border border-primary/5 dark:border-slate-800">
                    <input className={`${field} md:col-span-2`} placeholder="Full name" required value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
                    <input className={`${field} md:col-span-2`} placeholder="Address line 1" required value={form.line1} onChange={(e) => set('line1', e.target.value)} />
                    <input className={`${field} md:col-span-2`} placeholder="Address line 2 (optional)" value={form.line2} onChange={(e) => set('line2', e.target.value)} />
                    <input className={field} placeholder="City" required value={form.city} onChange={(e) => set('city', e.target.value)} />
                    <input className={field} placeholder="State / Province" value={form.state} onChange={(e) => set('state', e.target.value)} />
                    <input className={field} placeholder="Postal code" required value={form.postalCode} onChange={(e) => set('postalCode', e.target.value)} />
                    <input className={field} placeholder="Country" required value={form.country} onChange={(e) => set('country', e.target.value)} />
                    <input className={`${field} md:col-span-2`} placeholder="Phone (optional)" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                    <label className="flex items-center gap-2 text-sm text-secondary dark:text-gray-400 md:col-span-2">
                        <input type="checkbox" checked={form.isDefault} onChange={(e) => set('isDefault', e.target.checked)} /> Set as default
                    </label>
                    <button type="submit" disabled={saving} className="md:col-span-2 bg-primary dark:bg-accent text-white py-3 rounded-xl font-bold uppercase tracking-wider text-sm disabled:opacity-60">
                        {saving ? 'Saving…' : 'Save Address'}
                    </button>
                </form>
            )}

            {isLoading ? (
                <p className="text-secondary dark:text-gray-400">Loading…</p>
            ) : addresses.length === 0 ? (
                <p className="text-secondary dark:text-gray-400">No saved addresses yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {addresses.map((a) => (
                        <div key={a.id} className="p-6 bg-white dark:bg-slate-900 border border-primary/5 dark:border-slate-800 rounded-3xl space-y-2 relative">
                            {a.isDefault && (
                                <span className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Default
                                </span>
                            )}
                            <div className="flex items-center gap-2 text-accent"><MapPin className="w-4 h-4" /><span className="font-bold text-primary dark:text-white">{a.fullName}</span></div>
                            <p className="text-sm text-secondary dark:text-gray-400">
                                {a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />
                                {a.city}{a.state ? `, ${a.state}` : ''} {a.postalCode}<br />
                                {a.country}{a.phone ? ` · ${a.phone}` : ''}
                            </p>
                            <div className="flex gap-4 pt-2">
                                {!a.isDefault && <button onClick={() => makeDefault(a.id)} className="text-xs font-bold text-accent hover:underline">Make default</button>}
                                <button onClick={() => remove(a.id)} className="text-xs font-bold text-hot hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3" /> Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
