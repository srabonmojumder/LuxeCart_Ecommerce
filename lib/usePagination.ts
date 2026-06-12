'use client';

import { useState } from 'react';

/** Default rows shown per table page across the admin. */
export const PAGE_SIZE = 10;

/**
 * Client-side pagination for a list. Returns the current page slice plus the
 * metadata a <Pagination> control needs. The returned `page` is always clamped
 * to a valid range, so shrinking the list (e.g. after a search) never leaves
 * you on an empty page.
 */
export function usePagination<T>(items: T[], pageSize: number = PAGE_SIZE) {
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const current = Math.min(Math.max(1, page), totalPages);
    const start = (current - 1) * pageSize;
    const end = Math.min(start + pageSize, items.length);

    return {
        page: current,
        setPage,
        totalPages,
        total: items.length,
        start,
        end,
        pageItems: items.slice(start, end),
    };
}
