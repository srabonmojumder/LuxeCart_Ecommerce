'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    /** Total item count, for the "Showing X–Y of Z" label. */
    total: number;
    /** 0-based index of the first item on the page. */
    start: number;
    /** Exclusive index of the last item on the page. */
    end: number;
}

/** Builds a compact page list with ellipses, e.g. [1, '…', 4, 5, 6, '…', 12]. */
function pageList(page: number, total: number): (number | '…')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '…')[] = [1];
    const left = Math.max(2, page - 1);
    const right = Math.min(total - 1, page + 1);
    if (left > 2) pages.push('…');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < total - 1) pages.push('…');
    pages.push(total);
    return pages;
}

const navBtn =
    'inline-flex items-center justify-center w-9 h-9 rounded-[5px] border border-primary/10 dark:border-slate-700 text-primary dark:text-white hover:bg-primary/5 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors';

export default function Pagination({ page, totalPages, onPageChange, total, start, end }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
                Showing <b className="text-primary dark:text-white">{start + 1}–{end}</b> of {total}
            </p>

            <div className="flex items-center gap-1">
                <button onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page" className={navBtn}>
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {pageList(page, totalPages).map((p, i) =>
                    p === '…' ? (
                        <span key={`gap-${i}`} className="px-1.5 text-gray-400 select-none">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            aria-current={p === page}
                            className={`inline-flex items-center justify-center w-9 h-9 rounded-[5px] text-sm font-bold transition-colors ${
                                p === page
                                    ? 'bg-primary dark:bg-accent text-white'
                                    : 'border border-primary/10 dark:border-slate-700 text-primary dark:text-white hover:bg-primary/5 dark:hover:bg-slate-800'
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page" className={navBtn}>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
