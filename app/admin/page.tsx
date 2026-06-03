'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useAdminDashboard } from '@/lib/hooks';
import { Skeleton } from '@/components/ui/Skeleton';
import DashboardView from '@/components/admin/DashboardView';

export default function AdminDashboard() {
    const isAdmin = useAuthStore((s) => s.status === 'authenticated' && s.user?.role === 'ADMIN');
    const { dashboard, isLoading } = useAdminDashboard(isAdmin);

    if (isLoading || !dashboard) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
                <div className="lg:col-span-2 space-y-4 md:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                        <Skeleton className="h-28 rounded-3xl" /><Skeleton className="h-28 rounded-3xl" />
                    </div>
                    <Skeleton className="h-64 rounded-3xl" />
                    <Skeleton className="h-80 rounded-3xl" />
                </div>
                <div className="space-y-4 md:space-y-5">
                    <Skeleton className="h-72 rounded-3xl" /><Skeleton className="h-48 rounded-3xl" /><Skeleton className="h-48 rounded-3xl" />
                </div>
            </div>
        );
    }

    return <DashboardView data={dashboard} />;
}
