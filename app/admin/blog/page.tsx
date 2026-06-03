'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminPosts, type BlogPost } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';
import ImageUpload from '@/components/admin/ImageUpload';
import Select from '@/components/ui/Select';
import { usePagination } from '@/lib/usePagination';
import Pagination from '@/components/ui/Pagination';
import { TableSkeleton } from '@/components/ui/Skeleton';

const field = 'w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white';
const label = 'text-[10px] font-black uppercase tracking-widest text-gray-400';

interface PostFormState {
    id?: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    tags: string;
    published: string; // 'true' | 'false' for the Select component
}

const emptyPost: PostFormState = {
    title: '', slug: '', excerpt: '', content: '', image: '', author: 'Admin', tags: '', published: 'true',
};

const formatDate = (s: string) => new Date(s).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

export default function AdminBlogPage() {
    const isAdmin = useAuthStore((s) => s.status === 'authenticated' && s.user?.role === 'ADMIN');
    const { posts, isLoading, mutate } = useAdminPosts(isAdmin);
    const [editing, setEditing] = useState<PostFormState | null>(null);
    const [search, setSearch] = useState('');

    const filtered = posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    const { page, setPage, totalPages, total, start, end, pageItems } = usePagination(filtered);

    const openNew = () => setEditing(emptyPost);
    const openEdit = (p: BlogPost) => setEditing({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt ?? '',
        content: p.content,
        image: p.image,
        author: p.author,
        tags: (p.tags ?? []).join(', '),
        published: p.published ? 'true' : 'false',
    });

    const togglePublish = async (p: BlogPost) => {
        try {
            await api.patch(`/admin/blog/${p.id}`, { published: !p.published }, true);
            toast.success(p.published ? 'Hidden from blog' : 'Published');
            mutate();
        } catch (e) {
            toast.error(e instanceof ApiError ? e.message : 'Failed');
        }
    };

    const remove = async (id: number) => {
        if (!confirm('Delete this post permanently?')) return;
        try {
            await api.del(`/admin/blog/${id}`, true);
            toast.success('Post deleted');
            mutate();
        } catch (e) {
            toast.error(e instanceof ApiError ? e.message : 'Failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-primary dark:text-white tracking-tighter">Blog Posts</h1>
                <button onClick={openNew} className="flex items-center gap-2 bg-primary dark:bg-accent text-white px-4 py-2.5 rounded-xl font-bold text-sm">
                    <Plus className="w-4 h-4" /> New Post
                </button>
            </div>

            <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search posts…"
                className="w-full md:max-w-sm px-4 py-2.5 bg-white dark:bg-slate-900 border border-primary/10 dark:border-slate-800 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white"
            />

            {isLoading ? <TableSkeleton rows={6} cols={6} /> : filtered.length === 0 ? (
                <p className="text-secondary dark:text-gray-400">{search ? 'No posts match.' : 'No posts yet — click "New Post" to write your first.'}</p>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-2xl border border-primary/5 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <table className="w-full text-sm">
                            <thead className="bg-primary/5 dark:bg-slate-800/50 text-left">
                                <tr className="text-[10px] uppercase tracking-wider text-gray-400">
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Author</th>
                                    <th className="p-4">Published</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5 dark:divide-slate-800">
                                {pageItems.map((p) => (
                                    <tr key={p.id} className="text-primary dark:text-white">
                                        <td className="p-4 font-semibold max-w-[320px] truncate">{p.title}</td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400">{p.author}</td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400">{formatDate(p.publishedAt)}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => togglePublish(p)}
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.published ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}
                                            >
                                                {p.published ? 'Live' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => togglePublish(p)} className="p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-slate-800" title={p.published ? 'Unpublish' : 'Publish'}>
                                                    {p.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-slate-800"><Pencil className="w-4 h-4" /></button>
                                                <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-hot/10 text-hot"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} start={start} end={end} />
                </>
            )}

            {editing && (
                <PostModal
                    state={editing}
                    onClose={() => setEditing(null)}
                    onSaved={() => { setEditing(null); mutate(); }}
                />
            )}
        </div>
    );
}

function PostModal({ state, onClose, onSaved }: {
    state: PostFormState;
    onClose: () => void;
    onSaved: () => void;
}) {
    const [form, setForm] = useState(state);
    const [saving, setSaving] = useState(false);
    const isEdit = !!form.id;
    const set = (k: keyof PostFormState, v: string) => setForm({ ...form, [k]: v });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.image) {
            toast.error('Please add a featured image');
            return;
        }
        setSaving(true);
        const payload: Record<string, unknown> = {
            title: form.title,
            slug: form.slug || undefined,
            excerpt: form.excerpt || null,
            content: form.content,
            image: form.image,
            author: form.author || 'Admin',
            tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
            published: form.published === 'true',
        };
        try {
            if (isEdit) await api.patch(`/admin/blog/${form.id}`, payload, true);
            else await api.post('/admin/blog', payload, true);
            toast.success(isEdit ? 'Post updated' : 'Post published');
            onSaved();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-primary dark:text-white uppercase tracking-tight">{isEdit ? 'Edit' : 'New'} Post</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className={label}>Title</label>
                        <input className={field} required value={form.title} onChange={(e) => set('title', e.target.value)} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className={label}>Slug (optional — auto from title)</label>
                            <input className={field} value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="my-post-slug" />
                        </div>
                        <div className="space-y-1.5">
                            <label className={label}>Author</label>
                            <input className={field} value={form.author} onChange={(e) => set('author', e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className={label}>Excerpt (short summary)</label>
                        <textarea className={field} rows={2} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="One or two sentences shown in listings." />
                    </div>

                    <div className="space-y-1.5">
                        <label className={label}>Content</label>
                        <textarea className={field} rows={10} required value={form.content} onChange={(e) => set('content', e.target.value)} placeholder="Write the post… (blank line for paragraph break)" />
                    </div>

                    <div className="space-y-1.5">
                        <label className={label}>Featured Image</label>
                        <ImageUpload value={form.image} onChange={(url) => set('image', url)} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className={label}>Tags (comma separated)</label>
                            <input className={field} value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="design, tips, news" />
                        </div>
                        <div className="space-y-1.5">
                            <label className={label}>Status</label>
                            <Select
                                className={field}
                                value={form.published}
                                onChange={(v) => set('published', v)}
                                options={[
                                    { value: 'true', label: 'Published (live on blog)' },
                                    { value: 'false', label: 'Draft (hidden)' },
                                ]}
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={saving} className="w-full bg-primary dark:bg-accent text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm disabled:opacity-60">
                        {saving ? 'Saving…' : isEdit ? 'Update Post' : 'Publish Post'}
                    </button>
                </form>
            </div>
        </div>
    );
}
