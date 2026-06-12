'use client';

import { Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminReviews } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';
import { CardListSkeleton } from '@/components/ui/Skeleton';

export default function AdminReviewsPage() {
    const isAdmin = useAuthStore((s) => s.status === 'authenticated' && s.user?.role === 'ADMIN');
    const { reviews, isLoading, mutate } = useAdminReviews(isAdmin);

    const remove = async (id: number) => {
        if (!confirm('Delete this review?')) return;
        try {
            await api.del(`/admin/reviews/${id}`, true);
            toast.success('Review deleted');
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tighter">Reviews</h1>

            {isLoading ? <CardListSkeleton rows={6} />
                : reviews.length === 0 ? <p className="text-secondary">No reviews yet.</p>
                    : (
                        <div className="space-y-3">
                            {reviews.map((r) => (
                                <div key={r.id} className="flex items-start justify-between gap-4 p-5 bg-white border border-primary/5 rounded-2xl">
                                    <div className="min-w-0 space-y-1.5">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-amber-400 fill-current' : 'text-slate-300'}`} />
                                                ))}
                                            </div>
                                            <span className="text-sm font-bold text-primary">{r.product}</span>
                                            <span className="text-xs text-gray-400">by {r.author}</span>
                                        </div>
                                        {r.comment && <p className="text-sm text-secondary">{r.comment}</p>}
                                    </div>
                                    <button onClick={() => remove(r.id)} className="p-2 rounded-lg hover:bg-hot/10 text-hot flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    )}
        </div>
    );
}
