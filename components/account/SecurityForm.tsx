'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api';

/** Change-password card for the account settings tab. */
export default function SecurityForm() {
    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (next !== confirm) return toast.error('New passwords do not match');
        setLoading(true);
        try {
            await api.post('/auth/change-password', { currentPassword: current || undefined, newPassword: next }, true);
            toast.success('Password updated');
            setCurrent('');
            setNext('');
            setConfirm('');
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Could not update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 bg-white dark:bg-ink-900 border border-primary/5 dark:border-slate-800 rounded-[3rem]">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 dark:bg-ink-800 flex items-center justify-center text-primary dark:text-white">
                    <Lock className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-medium text-primary dark:text-white uppercase tracking-tight">Password</h3>
                    <p className="text-sm text-secondary dark:text-gray-400">Update the password used to sign in.</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <input
                    type="password"
                    placeholder="Current password (leave blank if none)"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-ink-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white"
                />
                <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="New password (min 6 chars)"
                    value={next}
                    onChange={(e) => setNext(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-ink-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white"
                />
                <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Confirm new password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-ink-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white dark:bg-accent px-8 py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-black dark:hover:bg-accent/90 transition-colors disabled:opacity-60"
                >
                    {loading ? 'Saving…' : 'Update password'}
                </button>
            </form>
        </div>
    );
}
