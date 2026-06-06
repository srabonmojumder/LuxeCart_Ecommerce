'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface LegalPageLayoutProps {
    eyebrow: string;
    title: string;
    lastUpdated: string;
    children: React.ReactNode;
}

/**
 * Shared editorial layout for /privacy, /terms, /refund-policy, /shipping, /cookies.
 * Provides the page header, last-updated stamp, and consistent typography for
 * sections/paragraphs/lists so individual pages stay short and content-focused.
 */
export default function LegalPageLayout({ eyebrow, title, lastUpdated, children }: LegalPageLayoutProps) {
    return (
        <div className="bg-white dark:bg-ink-950 min-h-screen">
            {/* Header banner */}
            <section className="bg-gray-50 dark:bg-ink-900/40 border-b border-primary/5 dark:border-slate-800 py-14 md:py-20">
                <div className="max-w-3xl mx-auto px-4 md:px-8 text-center space-y-4">
                    <span className="inline-block text-accent font-medium tracking-[0.3em] text-[10px] md:text-xs uppercase">
                        {eyebrow}
                    </span>
                    <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-medium text-primary dark:text-white tracking-tight leading-[1.1]"
                    >
                        {title}
                    </motion.h1>
                    <p className="text-xs text-secondary dark:text-gray-400">
                        Last updated · <span className="font-bold text-primary dark:text-white">{lastUpdated}</span>
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs pt-1">
                        <Link href="/" className="text-secondary dark:text-gray-400 hover:text-accent transition-colors">Home</Link>
                        <span className="text-gray-300 dark:text-slate-600">/</span>
                        <span className="text-primary dark:text-white font-bold">{title}</span>
                    </div>
                </div>
            </section>

            {/* Body */}
            <article className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16 pb-24">
                <div className="space-y-10 text-[15px] md:text-[16px] leading-[1.85] text-secondary dark:text-gray-300 [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-primary [&_h2]:dark:text-white [&_h2]:mb-4 [&_h2]:mt-12 [&_h2:first-child]:mt-0 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:text-primary [&_h3]:dark:text-white [&_h3]:mb-3 [&_h3]:mt-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:list-disc [&_li]:leading-[1.7] [&_a]:text-accent [&_a]:underline [&_a]:hover:no-underline [&_strong]:text-primary [&_strong]:dark:text-white [&_strong]:font-bold">
                    {children}
                </div>
            </article>
        </div>
    );
}
