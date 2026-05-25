'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { ApiError } from '@/lib/api';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GIS_SRC = 'https://accounts.google.com/gsi/client';

// Minimal shape of the Google Identity Services API we use.
interface GoogleAccountsId {
    initialize: (opts: { client_id: string; callback: (r: { credential: string }) => void }) => void;
    renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
}
declare global {
    interface Window {
        google?: { accounts: { id: GoogleAccountsId } };
    }
}

function loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (window.google?.accounts?.id) return resolve();
        const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`);
        if (existing) {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject());
            return;
        }
        const s = document.createElement('script');
        s.src = GIS_SRC;
        s.async = true;
        s.defer = true;
        s.onload = () => resolve();
        s.onerror = () => reject();
        document.head.appendChild(s);
    });
}

/** "Sign in with Google" button. Renders nothing when NEXT_PUBLIC_GOOGLE_CLIENT_ID is unset. */
export default function GoogleSignInButton({ onSuccess }: { onSuccess?: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const googleLogin = useAuthStore((s) => s.googleLogin);

    useEffect(() => {
        if (!CLIENT_ID || !ref.current) return;
        let cancelled = false;

        loadScript()
            .then(() => {
                if (cancelled || !ref.current || !window.google) return;
                window.google.accounts.id.initialize({
                    client_id: CLIENT_ID,
                    callback: async (response) => {
                        try {
                            await googleLogin(response.credential);
                            toast.success('Welcome!');
                            onSuccess?.();
                        } catch (err) {
                            toast.error(err instanceof ApiError ? err.message : 'Google sign-in failed');
                        }
                    },
                });
                window.google.accounts.id.renderButton(ref.current, {
                    theme: 'outline',
                    size: 'large',
                    width: 320,
                    text: 'continue_with',
                    shape: 'pill',
                });
            })
            .catch(() => {
                /* GIS script blocked or offline — silently skip */
            });

        return () => {
            cancelled = true;
        };
    }, [googleLogin, onSuccess]);

    if (!CLIENT_ID) return null;

    return (
        <div className="mt-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-primary/10 dark:bg-slate-700" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">or</span>
                <div className="h-px flex-1 bg-primary/10 dark:bg-slate-700" />
            </div>
            <div ref={ref} className="flex justify-center" />
        </div>
    );
}
