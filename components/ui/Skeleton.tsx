'use client';

/**
 * Reusable skeleton-loader kit.
 *
 * All pieces share one shimmering `Skeleton` block (same shimmer used by the
 * storefront product skeletons) so loading states look consistent everywhere —
 * tables, card lists, dashboards, charts. Drop the matching shape into a page's
 * `isLoading` branch instead of a "Loading…" string.
 */

/** Base shimmering block. Size/shape it with `className` (h-*, w-*, rounded-*). */
export function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`relative overflow-hidden bg-gray-200 dark:bg-slate-800 rounded ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-shimmer" />
        </div>
    );
}

/** Table placeholder matching the admin list tables (header + N rows × M cells). */
export function TableSkeleton({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-primary/5 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-sm">
                <thead className="bg-primary/5 dark:bg-slate-800/50 text-left">
                    <tr>
                        {Array.from({ length: cols }).map((_, i) => (
                            <th key={i} className="p-4"><Skeleton className="h-3 w-16" /></th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-primary/5 dark:divide-slate-800">
                    {Array.from({ length: rows }).map((_, r) => (
                        <tr key={r}>
                            {Array.from({ length: cols }).map((_, c) => (
                                <td key={c} className="p-4">
                                    <Skeleton className={`h-4 ${c === 0 ? 'w-32' : c === cols - 1 ? 'w-12 ml-auto' : 'w-20'}`} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/** Stacked rounded-card placeholders (orders, reviews, categories, returns). */
export function CardListSkeleton({ rows = 6 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-primary/5 dark:border-slate-800 rounded-2xl">
                    <div className="min-w-0 flex-1 space-y-2.5">
                        <Skeleton className="h-4 w-40 max-w-[60%]" />
                        <Skeleton className="h-3 w-2/3" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-lg shrink-0" />
                </div>
            ))}
        </div>
    );
}

/** Grid of image-topped cards (banners, category/blog grids). */
export function CardGridSkeleton({ count = 6, className = 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4' }: { count?: number; className?: string }) {
    return (
        <div className={className}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-primary/5 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <Skeleton className="h-40 w-full rounded-none" />
                    <div className="p-4 space-y-2.5">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/** Dashboard / analytics stat cards. */
export function StatCardsSkeleton({ count = 4, className = 'grid grid-cols-2 lg:grid-cols-4 gap-4' }: { count?: number; className?: string }) {
    return (
        <div className={className}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 dark:border-slate-800">
                    <Skeleton className="w-10 h-10 rounded-xl mb-4" />
                    <Skeleton className="h-7 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                </div>
            ))}
        </div>
    );
}

/** Card with a title + tall chart-shaped block. */
export function ChartSkeleton({ height = 'h-56' }: { height?: string }) {
    return (
        <div className="p-6 bg-white dark:bg-slate-900 border border-primary/5 dark:border-slate-800 rounded-2xl">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className={`w-full ${height} rounded-xl`} />
        </div>
    );
}

/** Form placeholder: a header, labelled input rows, and a submit button. */
export function FormSkeleton({ fields = 8 }: { fields?: number }) {
    return (
        <div className="space-y-5 max-w-2xl">
            <Skeleton className="h-8 w-48" />
            <div className="grid sm:grid-cols-2 gap-4">
                {Array.from({ length: fields }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-11 w-full rounded-[5px]" />
                    </div>
                ))}
            </div>
            <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
    );
}

/** Card with a title + N labelled progress-bar rows (analytics breakdowns). */
export function BarListSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="p-6 bg-white dark:bg-slate-900 border border-primary/5 dark:border-slate-800 rounded-2xl">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="space-y-3">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                        <div className="flex justify-between">
                            <Skeleton className="h-3 w-1/3" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
