'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag as TagIcon, BookOpen, ArrowRight } from 'lucide-react';
import { usePost } from '@/lib/hooks';
import { Skeleton } from '@/components/ui/Skeleton';

function formatLongDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogPostClient() {
    const params = useParams();
    const slug = params.slug as string;
    const { post, isLoading, error } = usePost(slug);

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-3/4" />
                <div className="flex gap-4">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-72 w-full rounded-2xl" />
                <div className="space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className={`h-4 ${i % 4 === 3 ? 'w-1/2' : 'w-full'}`} />)}
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4 text-center">
                <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-medium text-primary dark:text-white tracking-tight">Post not found</h1>
                    <Link href="/blog" className="inline-flex items-center gap-2 text-accent font-bold hover:underline">
                        <ArrowLeft className="w-4 h-4" /> Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <article className="bg-white dark:bg-ink-950 min-h-screen">
            {/* ---------- Editorial header ---------- */}
            <header className="bg-gray-50 dark:bg-ink-900/40 border-b border-primary/5 dark:border-slate-800 py-14 md:py-20">
                <div className="max-w-3xl mx-auto px-4 md:px-8 text-center space-y-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center justify-center gap-2 text-xs">
                        <Link href="/" className="text-secondary dark:text-gray-400 hover:text-accent transition-colors">Home</Link>
                        <span className="text-gray-300 dark:text-slate-600">/</span>
                        <Link href="/blog" className="text-secondary dark:text-gray-400 hover:text-accent transition-colors">Blog</Link>
                    </div>

                    {/* Tags above title (editorial pattern) */}
                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {post.tags.slice(0, 3).map((t) => (
                                <span key={t} className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
                                    #{t}
                                </span>
                            ))}
                        </div>
                    )}

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-medium text-primary dark:text-white tracking-tight leading-[1.1]"
                    >
                        {post.title}
                    </motion.h1>

                    {/* Author / date meta */}
                    <div className="flex items-center justify-center gap-x-5 gap-y-2 text-xs text-secondary dark:text-gray-400 flex-wrap pt-2">
                        <span className="inline-flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> {post.author}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-700" />
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> {formatLongDate(post.publishedAt)}
                        </span>
                    </div>
                </div>
            </header>

            {/* ---------- Hero image ---------- */}
            <div className="max-w-5xl mx-auto px-4 md:px-8 mt-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-gray-100 dark:bg-ink-800 shadow-xl"
                >
                    <Image src={post.image} alt={post.title} fill priority sizes="100vw" className="object-cover" />
                </motion.div>
            </div>

            {/* ---------- Body ---------- */}
            <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20">
                {/* Excerpt as lead paragraph */}
                {post.excerpt && (
                    <p className="text-xl md:text-2xl text-primary dark:text-gray-100 leading-[1.55] font-medium border-l-[3px] border-accent pl-6 mb-12">
                        {post.excerpt}
                    </p>
                )}

                {/* Body paragraphs — manual editorial typography (no prose plugin) */}
                <div className="space-y-6">
                    {post.content.split(/\n{2,}/).map((para, i) => (
                        <p
                            key={i}
                            className="text-[17px] md:text-[18px] leading-[1.85] text-secondary dark:text-gray-300 whitespace-pre-wrap"
                        >
                            {para}
                        </p>
                    ))}
                </div>

                {/* Tags footer */}
                {post.tags.length > 0 && (
                    <div className="mt-14 pt-8 border-t border-primary/10 dark:border-slate-800 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400 mr-2">Tagged</span>
                        {post.tags.map((t) => (
                            <Link
                                key={t}
                                href={`/blog?tag=${encodeURIComponent(t)}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-[10px] font-medium uppercase tracking-[0.15em] border border-primary/10 dark:border-slate-700 text-secondary dark:text-gray-400 hover:border-accent hover:text-accent transition-colors"
                            >
                                <TagIcon className="w-3 h-3" /> {t}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Author card */}
                <div className="mt-10 flex items-center gap-4 p-5 bg-gray-50 dark:bg-ink-900/40 border border-primary/5 dark:border-slate-800 rounded-2xl">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent-700 p-[2px] flex-shrink-0">
                        <div className="w-full h-full rounded-full bg-white dark:bg-ink-900 flex items-center justify-center text-accent font-medium">
                            {post.author.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">Written by</p>
                        <p className="font-medium text-primary dark:text-white text-lg tracking-tight">{post.author}</p>
                    </div>
                </div>
            </div>

            {/* ---------- CTA ---------- */}
            <section className="max-w-5xl mx-auto px-4 md:px-8 pb-24">
                <div className="bg-primary dark:bg-accent text-white rounded-3xl p-8 md:p-14 text-center space-y-5">
                    <h2 className="text-2xl md:text-4xl font-medium tracking-tight">Enjoyed this story?</h2>
                    <p className="opacity-80 max-w-md mx-auto">Read more from the blog or shop the curated collection that inspired it.</p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Link href="/blog" className="inline-flex items-center gap-2 bg-white text-primary dark:text-accent px-6 py-3 rounded-xl font-medium uppercase tracking-widest text-xs hover:bg-white/90 transition-colors">
                            More Posts <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link href="/products" className="border border-white/30 text-white px-6 py-3 rounded-xl font-medium uppercase tracking-widest text-xs hover:bg-white/10 transition-colors">
                            Shop Now
                        </Link>
                    </div>
                </div>
            </section>
        </article>
    );
}
