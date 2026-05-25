'use client';

import { useState } from 'react';
import { MailWarning, X } from 'lucide-react';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

/** Shown on the account page when the signed-in user hasn't verified their email. */
export default function EmailVerifyBanner() {
    const user = useAuthStore((s) => s.user);
    const [sending, setSending] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    if (!user || user.emailVerified || dismissed) return null;

    const resend = async () => {
        setSending(true);
        try {
            await api.post('/auth/resend-verification', undefined, true);
            toast.success('Verification email sent — check your inbox');
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Could not send email');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-limited/10 border border-limited/30">
            <div className="flex items-center gap-3">
                <MailWarning className="w-6 h-6 text-limited shrink-0" />
                <p className="text-sm font-semibold text-primary dark:text-white">
                    Verify your email to secure your account. We sent a link to <b>{user.email}</b>.
                </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={resend}
                    disabled={sending}
                    className="px-5 py-2.5 rounded-xl bg-primary text-white dark:bg-accent text-xs font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-60"
                >
                    {sending ? 'Sending…' : 'Resend'}
                </button>
                <button onClick={() => setDismissed(true)} className="p-2 text-gray-400 hover:text-primary dark:hover:text-white" aria-label="Dismiss">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
