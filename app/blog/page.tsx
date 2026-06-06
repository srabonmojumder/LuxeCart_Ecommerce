'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Tag as TagIcon, BookOpen } from 'lucide-react';
import { usePosts, useBlogMeta } from '@/lib/hooks';
import Pagination from '@/components/ui/Pagination';

const PAGE_SIZE = 9;

function formatDay(iso: string) {
    return new Date(iso).getDate().toString().padStart(2, '0');
}
function formatMonth(iso: string) {
    return new Date(iso).toLocaleString('en-US', { month: 'short' });
}
function formatDate(iso: string) {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, '0');
    const mon = d.toLocaleString('en-US', { month: 'short' });
    const yr = d.getFullYear();
    return `${day} ${mon} ${yr}`;
}
function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function BlogPage() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [activeTag, setActiveTag] = useState('');

    const { posts, pagination, isLoading } = usePosts({ page, limit: PAGE_SIZE, q: search, tag: activeTag });
    const { meta } = useBlogMeta();

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput.trim());
        setPage(1);
    };

    const pickTag = (tag: string) => {
        setActiveTag(activeTag === tag ? '' : tag);
        setPage(1);
    };

    const start = pagination ? (pagination.page - 1) * pagination.limit : 0;
    const end = pagination ? Math.min(start + pagination.limit, pagination.total) : 0;

    return (
        <div className="bg-white dark:bg-ink-950 min-h-screen">
            {/* ---------- Page Header Banner ---------- */}
            <section className="bg-gray-50 dark:bg-ink-900/40 border-b border-primary/5 dark:border-slate-800 py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-5">
                    <span className="inline-block text-accent font-medium tracking-[0.3em] text-[10px] md:text-xs uppercase">
                        Latest Stories
                    </span>
                    <h1 className="text-5xl md:text-7xl font-medium text-primary dark:text-white tracking-tight leading-none">
                        Blog
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-sm pt-1">
                        <Link href="/" className="text-secondary dark:text-gray-400 hover:text-accent transition-colors">Home</Link>
                        <span className="text-gray-300 dark:text-slate-600">/</span>
                        <span className="text-primary dark:text-white font-bold">Blog</span>
                    </div>
                </div>
            </section>

            {/* ---------- Body ---------- */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
                <div className="grid lg:grid-cols-[260px_1fr] gap-12 md:gap-16">

                    {/* ---------- Sidebar ---------- */}
                    <aside className="space-y-12 lg:sticky lg:top-24 lg:self-start order-2 lg:order-1">
                        {/* Search */}
                        <form onSubmit={onSearch} className="space-y-2">
                            <div className="relative">
                                <input
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search our store"
                                    className="w-full pl-4 pr-12 py-3 bg-white dark:bg-ink-900 border border-primary/10 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-accent dark:text-white transition-colors"
                                />
                                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-md bg-primary dark:bg-accent text-white flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Search">
                                    <Search className="w-4 h-4" />
                                </button>
                            </div>
                            {(search || activeTag) && (
                                <button
                                    type="button"
                                    onClick={() => { setSearchInput(''); setSearch(''); setActiveTag(''); setPage(1); }}
                                    className="text-[10px] font-medium tracking-widest uppercase text-accent hover:underline"
                                >
                                    Clear filters
                                </button>
                            )}
                        </form>

                        {/* Recent Posts */}
                        {meta?.recent && meta.recent.length > 0 && (
                            <SidebarBlock title="Recent Posts">
                                <ul className="space-y-5">
                                    {meta.recent.map((p) => (
                                        <li key={p.id}>
                                            <Link href={`/blog/${p.slug}`} className="flex gap-3 group">
                                                <div className="relative w-[70px] h-[70px] rounded-md overflow-hidden bg-gray-100 dark:bg-ink-800 flex-shrink-0">
                                                    <Image src={p.image} alt={p.title} fill sizes="70px" className="object-cover" />
                                                </div>
                                                <div className="min-w-0 flex-1 pt-0.5">
                                                    <h4 className="text-[13px] font-medium text-primary dark:text-white line-clamp-3 leading-snug group-hover:text-accent transition-colors">{p.title}</h4>
                                                    <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-2">
                                                        <span>{formatDate(p.publishedAt)}</span>
                                                        <span className="text-gray-200 dark:text-slate-700">|</span>
                                                        <span>{formatTime(p.publishedAt)}</span>
                                                    </p>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </SidebarBlock>
                        )}

                        {/* Archive */}
                        {meta?.archive && meta.archive.length > 0 && (
                            <SidebarBlock title="Archive">
                                <div className="space-y-6">
                                    {meta.archive.map((entry) => (
                                        <div key={entry.month}>
                                            <h4 className="text-[11px] font-medium uppercase tracking-[0.15em] text-primary dark:text-white mb-3">{entry.month}</h4>
                                            <ul className="space-y-2">
                                                {entry.posts.map((p) => (
                                                    <li key={p.slug}>
                                                        <Link href={`/blog/${p.slug}`} className="text-[13px] text-secondary dark:text-gray-400 hover:text-accent transition-colors leading-snug block">
                                                            {p.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </SidebarBlock>
                        )}

                        {/* Tags */}
                        {meta?.tags && meta.tags.length > 0 && (
                            <SidebarBlock title="Tags">
                                <div className="flex flex-wrap gap-2">
                                    {meta.tags.map((t) => (
                                        <button
                                            key={t.name}
                                            onClick={() => pickTag(t.name)}
                                            className={`px-3 py-1.5 rounded-md text-[10px] font-medium uppercase tracking-[0.15em] border transition-colors ${activeTag === t.name
                                                ? 'bg-primary dark:bg-accent text-white border-primary dark:border-accent'
                                                : 'bg-white dark:bg-ink-900 text-secondary dark:text-gray-400 border-primary/10 dark:border-slate-700 hover:border-accent hover:text-accent'}`}
                                        >
                                            {t.name}
                                        </button>
                                    ))}
                                </div>
                            </SidebarBlock>
                        )}
                    </aside>

                    {/* ---------- Main grid ---------- */}
                    <main className="order-1 lg:order-2 space-y-10">
                        {/* Active filter chips */}
                        {(search || activeTag) && (
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-secondary dark:text-gray-400 font-medium">Filtering by:</span>
                                {search && (
                                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-bold">&ldquo;{search}&rdquo;</span>
                                )}
                                {activeTag && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent font-bold">
                                        <TagIcon className="w-3 h-3" /> {activeTag}
                                    </span>
                                )}
                                <span className="text-gray-400">· {pagination?.total ?? 0} result{(pagination?.total ?? 0) === 1 ? '' : 's'}</span>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="aspect-square rounded-2xl bg-gray-100 dark:bg-ink-800 animate-pulse" />
                                ))}
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-20 space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <p className="text-secondary dark:text-gray-400">
                                    {search || activeTag ? 'No posts match your filters.' : 'No posts yet — check back soon.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {posts.map((post, i) => (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: (i % 6) * 0.05 }}
                                            viewport={{ once: true }}
                                        >
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="group relative block aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-ink-800"
                                            >
                                                {/* Image (clean by default, subtle zoom on hover) */}
                                                <Image
                                                    src={post.image}
                                                    alt={post.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                />

                                                {/* Hover-only meta overlay (slides in from bottom) */}
                                                <div className="absolute inset-0 flex flex-col justify-between p-6 text-white bg-gradient-to-t from-accent via-accent/85 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    {/* Date top-center */}
                                                    <div className="flex flex-col items-center text-center pt-2 translate-y-[-8px] group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                                        <span className="text-3xl font-medium leading-none tracking-tight">{formatDay(post.publishedAt)}</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">{formatMonth(post.publishedAt)}</span>
                                                    </div>
                                                    {/* Meta bottom */}
                                                    <div className="space-y-2 translate-y-[8px] group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">By {post.author}</p>
                                                        <h3 className="font-medium text-base leading-tight line-clamp-2">{post.title}</h3>
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest pt-1">
                                                            Read More <ArrowRight className="w-3 h-3" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {pagination && pagination.totalPages > 1 && (
                                    <Pagination
                                        page={pagination.page}
                                        totalPages={pagination.totalPages}
                                        onPageChange={setPage}
                                        total={pagination.total}
                                        start={start}
                                        end={end}
                                    />
                                )}
                            </>
                        )}
                    </main>
                </div>
            </section>
        </div>
    );
}

/** Sidebar block: small bold uppercase title with a short accent underline. */
function SidebarBlock({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-primary dark:text-white">
                {title}
            </h3>
            <div className="w-8 h-0.5 bg-accent mt-2 mb-6" />
            {children}
        </div>
    );
}
