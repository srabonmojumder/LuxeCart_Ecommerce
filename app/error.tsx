'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Home, AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Surface the error for monitoring; replace with your logger if added.
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-[80vh] flex items-center justify-center px-6 py-24 bg-canvas dark:bg-ink-950">
            <div className="max-w-xl w-full text-center">
                <span className="mx-auto mb-7 flex w-16 h-16 items-center justify-center rounded-3xl bg-hot/10 text-hot">
                    <AlertTriangle className="w-8 h-8" />
                </span>
                <h1 className="text-2xl md:text-4xl font-medium text-primary dark:text-white tracking-tight">
                    Something went wrong.
                </h1>
                <p className="mt-4 text-secondary dark:text-gray-400 leading-relaxed">
                    An unexpected error occurred while loading this page. You can try again, or head back home.
                </p>
                {error?.digest && (
                    <p className="mt-3 text-[11px] text-secondary/60 dark:text-gray-600 font-mono">
                        Ref: {error.digest}
                    </p>
                )}

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2.5 bg-primary dark:bg-accent text-white px-7 py-4 rounded-2xl font-medium text-sm tracking-[0.08em] uppercase hover:bg-black dark:hover:bg-accent-600 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                    >
                        <RotateCcw className="w-4 h-4" /> Try Again
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2.5 border border-primary/15 dark:border-white/15 text-primary dark:text-white px-7 py-4 rounded-2xl font-medium text-sm tracking-[0.08em] uppercase hover:border-accent hover:text-accent transition-all"
                    >
                        <Home className="w-4 h-4" /> Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
