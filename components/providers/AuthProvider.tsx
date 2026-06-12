'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

/** Restores the user session from the refresh cookie once on app load. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const loadSession = useAuthStore((s) => s.loadSession);

    useEffect(() => {
        loadSession();
    }, [loadSession]);

    return <>{children}</>;
}
