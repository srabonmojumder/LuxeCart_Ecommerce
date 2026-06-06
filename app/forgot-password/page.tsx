'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { api, ApiError } from '@/lib/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
        } catch (err) {
            // We still show the same neutral message to avoid leaking which emails exist.
            if (err instanceof ApiError && err.status === 400) {
                setSent(true);
            } else {
                setSent(true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
            <div className="max-w-md w-full bg-white dark:bg-ink-900 border border-primary/10 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-xl">
                {sent ? (
                    <div className="text-center space-y-4">
                        <CheckCircle2 className="w-14 h-14 text-new mx-auto" />
                        <h2 className="text-2xl font-medium text-primary dark:text-white uppercase tracking-tight">Check your inbox</h2>
                        <p className="text-sm text-secondary dark:text-gray-400">
                            If an account exists for <b>{email}</b>, we&apos;ve sent a link to reset your password. The link expires in 1 hour.
                        </p>
                        <Link href="/account" className="inline-flex items-center gap-2 text-accent font-bold text-sm hover:underline">
                            <ArrowLeft className="w-4 h-4" /> Back to sign in
                        </Link>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-medium text-primary dark:text-white uppercase tracking-tight mb-2">Forgot password</h2>
                        <p className="text-sm text-secondary dark:text-gray-400 mb-8">
                            Enter your email and we&apos;ll send you a link to reset it.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-ink-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white dark:bg-accent py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-black dark:hover:bg-accent/90 transition-colors disabled:opacity-60"
                            >
                                {loading ? 'Sending…' : 'Send reset link'}
                            </button>
                        </form>
                        <Link href="/account" className="mt-6 inline-flex items-center gap-2 text-accent font-bold text-sm hover:underline">
                            <ArrowLeft className="w-4 h-4" /> Back to sign in
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
