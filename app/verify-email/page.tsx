'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

function VerifyEmailInner() {
    const params = useSearchParams();
    const token = params.get('token') ?? '';
    const refreshUser = useAuthStore((s) => s.refreshUser);
    const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
    const ran = useRef(false);

    useEffect(() => {
        if (ran.current) return; // guard against double-run in dev StrictMode
        ran.current = true;
        if (!token) {
            setState('error');
            return;
        }
        api.post('/auth/verify-email', { token })
            .then(async () => {
                setState('ok');
                await refreshUser();
            })
            .catch(() => setState('error'));
    }, [token, refreshUser]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-primary/10 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-xl text-center space-y-4">
                {state === 'loading' && (
                    <>
                        <Loader2 className="w-14 h-14 text-accent mx-auto animate-spin" />
                        <h2 className="text-2xl font-black text-primary dark:text-white uppercase tracking-tight">Verifying…</h2>
                    </>
                )}
                {state === 'ok' && (
                    <>
                        <CheckCircle2 className="w-14 h-14 text-new mx-auto" />
                        <h2 className="text-2xl font-black text-primary dark:text-white uppercase tracking-tight">Email verified!</h2>
                        <p className="text-sm text-secondary dark:text-gray-400">Your email is confirmed. You&apos;re all set.</p>
                        <Link href="/account" className="inline-block px-6 py-3 bg-primary dark:bg-accent text-white rounded-xl font-bold text-sm">Go to account</Link>
                    </>
                )}
                {state === 'error' && (
                    <>
                        <AlertTriangle className="w-14 h-14 text-hot mx-auto" />
                        <h2 className="text-2xl font-black text-primary dark:text-white uppercase tracking-tight">Link expired</h2>
                        <p className="text-sm text-secondary dark:text-gray-400">This verification link is invalid or has expired. Sign in and request a new one from your account.</p>
                        <Link href="/account" className="text-accent font-bold text-sm hover:underline">Go to account</Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>}>
            <VerifyEmailInner />
        </Suspense>
    );
}
