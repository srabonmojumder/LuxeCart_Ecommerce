'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { mutate as globalMutate } from 'swr';
import { toast } from 'sonner';
import { useProductReviews } from '@/lib/hooks';
import { useAuthStore } from '@/store/useAuthStore';
import { api, ApiError } from '@/lib/api';

export default function ReviewSection({ slug }: { slug: string }) {
    const { reviews, isLoading, mutate } = useProductReviews(slug);
    const authStatus = useAuthStore((s) => s.status);
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/products/${slug}/reviews`, { rating, comment: comment || undefined }, true);
            toast.success('Review submitted!');
            setComment('');
            mutate();
            globalMutate(`/products/${slug}`); // refresh product rating aggregate
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Write a review */}
            {authStatus === 'authenticated' ? (
                <form onSubmit={submit} className="space-y-4 p-5 bg-slate-50 dark:bg-ink-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-white">Write a review</h4>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <button
                                key={n}
                                type="button"
                                onClick={() => setRating(n)}
                                onMouseEnter={() => setHover(n)}
                                onMouseLeave={() => setHover(0)}
                                className="p-0.5"
                                aria-label={`${n} star`}
                            >
                                <Star className={`w-6 h-6 transition-colors ${n <= (hover || rating) ? 'text-amber-400 fill-current' : 'text-slate-300 dark:text-slate-600'}`} />
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this product…"
                        rows={3}
                        className="w-full px-4 py-3 bg-white dark:bg-ink-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-900 dark:text-white"
                    />
                    <button type="submit" disabled={submitting} className="bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-2.5 rounded-xl disabled:opacity-60">
                        {submitting ? 'Submitting…' : 'Submit Review'}
                    </button>
                </form>
            ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    <a href="/account" className="text-accent-600 font-semibold hover:underline">Sign in</a> to write a review.
                </p>
            )}

            {/* Existing reviews */}
            {isLoading ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm">Loading reviews…</p>
            ) : reviews.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm">No reviews yet. Be the first!</p>
            ) : (
                <div className="space-y-5">
                    {reviews.map((r) => (
                        <div key={r.id} className="border-b border-slate-200 dark:border-slate-700 pb-5 last:border-0">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="font-semibold text-slate-900 dark:text-white">{r.author}</span>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-amber-400 fill-current' : 'text-slate-300 dark:text-slate-600'}`} />
                                    ))}
                                </div>
                            </div>
                            {r.comment && <p className="text-sm text-slate-600 dark:text-slate-400">{r.comment}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
