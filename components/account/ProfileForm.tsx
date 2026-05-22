'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { api, ApiError } from '@/lib/api';

export default function ProfileForm() {
    const user = useAuthStore((s) => s.user);
    const refreshUser = useAuthStore((s) => s.refreshUser);
    const [displayName, setDisplayName] = useState(user?.displayName ?? '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL ?? '');
    const [saving, setSaving] = useState(false);

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch('/account/profile', {
                displayName,
                photoURL: photoURL || null,
            }, true);
            await refreshUser();
            toast.success('Profile updated');
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const field = 'w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white disabled:opacity-60';

    return (
        <form onSubmit={save} className="grid md:grid-cols-2 gap-6 max-w-2xl">
            <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Display Name</label>
                <input className={field} value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
            </div>
            <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Email (read-only)</label>
                <input className={field} value={user?.email ?? ''} disabled />
            </div>
            <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Photo URL (optional)</label>
                <input className={field} value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} placeholder="https://…" />
            </div>
            <button type="submit" disabled={saving} className="md:col-span-2 w-full md:w-auto px-12 py-4 bg-primary text-white dark:bg-accent rounded-xl font-bold uppercase tracking-widest text-xs disabled:opacity-60">
                {saving ? 'Saving…' : 'Update Profile'}
            </button>
        </form>
    );
}
