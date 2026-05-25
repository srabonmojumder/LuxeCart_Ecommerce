'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api';

function ResetPasswordInner() {
    const params = useSearchParams();
    const router = useRouter();
    const token = params.get('token') ?? '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) return toast.error('Passwords do not match');
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, password });
            setDone(true);
            toast.success('Password updated — please sign in');
            setTimeout(() => router.push('/account'), 1800);
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Could not reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-primary/10 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-xl">
                {!token ? (
                    <div className="text-center space-y-4">
                        <AlertTriangle className="w-14 h-14 text-hot mx-auto" />
                        <h2 className="text-2xl font-black text-primary dark:text-white uppercase tracking-tight">Invalid link</h2>
                        <p className="text-sm text-secondary dark:text-gray-400">This reset link is missing its token. Request a new one.</p>
                        <Link href="/forgot-password" className="text-accent font-bold text-sm hover:underline">Request a new link</Link>
                    </div>
                ) : done ? (
                    <div className="text-center space-y-4">
                        <CheckCircle2 className="w-14 h-14 text-new mx-auto" />
                        <h2 className="text-2xl font-black text-primary dark:text-white uppercase tracking-tight">All set!</h2>
                        <p className="text-sm text-secondary dark:text-gray-400">Your password has been updated. Redirecting to sign in…</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-black text-primary dark:text-white uppercase tracking-tight mb-2">Reset password</h2>
                        <p className="text-sm text-secondary dark:text-gray-400 mb-8">Choose a new password for your account.</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    placeholder="New password (min 6 chars)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    placeholder="Confirm new password"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white dark:bg-accent py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-black dark:hover:bg-accent/90 transition-colors disabled:opacity-60"
                            >
                                {loading ? 'Updating…' : 'Update password'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>}>
            <ResetPasswordInner />
        </Suspense>
    );
}
