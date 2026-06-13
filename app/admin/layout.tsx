'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminStats } from '@/lib/hooks';
import AdminShell from '@/components/admin/AdminShell';
import ConfirmProvider from '@/components/admin/ConfirmProvider';

const SKY = '#46AEE8';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, status, logout } = useAuthStore();
    const isAdmin = status === 'authenticated' && user?.role === 'ADMIN';
    const { stats } = useAdminStats(isAdmin);

    const [today, setToday] = useState('');
    useEffect(() => { setToday(new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })); }, []);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: SKY, borderTopColor: 'transparent' }} />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 text-center">
                <div className="space-y-4">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Admin access required</h1>
                    <p className="text-slate-500">Sign in with an admin account to manage the store.</p>
                    <Link href="/account" className="inline-block px-6 py-3 text-white rounded-xl font-bold text-sm" style={{ backgroundColor: SKY }}>Go to Sign In</Link>
                </div>
            </div>
        );
    }

    return (
        <ConfirmProvider>
            <AdminShell
                pathname={pathname}
                today={today}
                pendingOrders={stats?.pendingOrders}
                userName={user?.displayName || user?.email || 'Admin'}
                userPhoto={user?.photoURL}
                onLogout={async () => { await logout(); toast.success('Signed out'); }}
            >
                {children}
            </AdminShell>
        </ConfirmProvider>
    );
}
