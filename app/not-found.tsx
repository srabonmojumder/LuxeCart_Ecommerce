import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="min-h-[80vh] flex items-center justify-center px-6 py-24 bg-canvas dark:bg-ink-950">
            <div className="max-w-xl w-full text-center">
                <p className="font-display text-[7rem] md:text-[10rem] leading-none font-medium tracking-tighter bg-gradient-to-b from-primary to-accent dark:from-white dark:to-accent bg-clip-text text-transparent select-none">
                    404
                </p>
                <h1 className="mt-2 text-2xl md:text-4xl font-medium text-primary dark:text-white tracking-tight">
                    This page wandered off.
                </h1>
                <p className="mt-4 text-secondary dark:text-gray-400 leading-relaxed">
                    The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back to shopping.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2.5 bg-primary dark:bg-accent text-white px-7 py-4 rounded-2xl font-medium text-sm tracking-[0.08em] uppercase hover:bg-black dark:hover:bg-accent-600 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                    >
                        <Home className="w-4 h-4" /> Back to Home
                    </Link>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2.5 border border-primary/15 dark:border-white/15 text-primary dark:text-white px-7 py-4 rounded-2xl font-medium text-sm tracking-[0.08em] uppercase hover:border-accent hover:text-accent transition-all"
                    >
                        <Search className="w-4 h-4" /> Browse Products
                    </Link>
                </div>

                <Link
                    href="/contact"
                    className="mt-8 inline-flex items-center gap-1.5 text-xs text-secondary dark:text-gray-500 hover:text-accent transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Need help? Contact us
                </Link>
            </div>
        </main>
    );
}
