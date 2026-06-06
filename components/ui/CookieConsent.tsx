'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'luxecart-cookie-consent';
type Decision = 'accepted' | 'rejected';

/** Persistent cookie-consent banner — slides up on first visit, remembers choice. */
export default function CookieConsent() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Only run on client after mount (avoids SSR mismatch).
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) {
                // Small delay so it doesn't fight the page entrance animations.
                const t = setTimeout(() => setOpen(true), 1200);
                return () => clearTimeout(t);
            }
        } catch {
            // localStorage may be blocked — just don't show the banner.
        }
    }, []);

    const choose = (decision: Decision) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ decision, at: new Date().toISOString() }));
        } catch {
            /* ignore */
        }
        setOpen(false);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 60 }}
                    transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                    className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 lg:left-auto lg:right-6 lg:max-w-md z-[80]"
                    role="dialog"
                    aria-label="Cookie consent"
                >
                    <div className="bg-white dark:bg-ink-900 border border-primary/10 dark:border-slate-700 rounded-2xl shadow-2xl shadow-black/15 dark:shadow-black/40 p-5 md:p-6 relative">
                        <button
                            onClick={() => choose('rejected')}
                            aria-label="Dismiss"
                            className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:bg-primary/5 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                                <Cookie className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 pr-6">
                                <h3 className="font-medium text-primary dark:text-white tracking-tight text-base">
                                    We use cookies
                                </h3>
                                <p className="text-xs text-secondary dark:text-gray-400 mt-1 leading-relaxed">
                                    We use essential cookies to make the site work, plus optional ones to analyze
                                    traffic and improve your experience. See our{' '}
                                    <Link href="/cookies" className="text-accent font-bold hover:underline">Cookie Policy</Link>.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => choose('accepted')}
                                className="flex-1 min-w-[120px] bg-primary dark:bg-accent text-white px-4 py-2.5 rounded-xl font-medium uppercase tracking-widest text-[11px] hover:opacity-90 transition-opacity"
                            >
                                Accept All
                            </button>
                            <button
                                onClick={() => choose('rejected')}
                                className="flex-1 min-w-[120px] border border-primary/10 dark:border-slate-700 text-primary dark:text-white px-4 py-2.5 rounded-xl font-medium uppercase tracking-widest text-[11px] hover:bg-primary/5 dark:hover:bg-slate-800 transition-colors"
                            >
                                Essential Only
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
