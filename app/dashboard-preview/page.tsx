'use client';

// TEMPORARY visual-preview route (not auth-gated) used to screenshot the admin
// dashboard during design. Renders the real AdminShell + DashboardView with
// sample data. Delete this folder once the design is finalized.

import AdminShell from '@/components/admin/AdminShell';
import DashboardView from '@/components/admin/DashboardView';
import type { AdminDashboard } from '@/lib/hooks';

const heatmap: AdminDashboard['heatmap'] = [];
for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
        heatmap.push({ day, hour, count: ((day * 7 + hour * 5) % 11) * 30 + 20 });
    }
}

const SAMPLE: AdminDashboard = {
    availableProducts: 1980,
    pendingOrders: 980,
    numberOfSales: 1304,
    totalSales: 25100,
    salesGoal: 30000,
    salesGoalPct: 67,
    growthRatePct: 32,
    customerVolumeChangePct: 15,
    totalCustomers: 3526,
    monthly: [
        { ym: '2025-12', month: 'Jan', revenue: 18000 },
        { ym: '2026-01', month: 'Feb', revenue: 21000 },
        { ym: '2026-02', month: 'Mar', revenue: 16500 },
        { ym: '2026-03', month: 'Apr', revenue: 24000 },
        { ym: '2026-04', month: 'May', revenue: 30000 },
        { ym: '2026-05', month: 'Jun', revenue: 19500 },
        { ym: '2026-06', month: 'Jul', revenue: 22000 },
    ],
    heatmap,
    heatmapMax: 320,
    reviews: {
        avg: 4.1, total: 12500,
        distribution: [
            { stars: 5, count: 6800 }, { stars: 4, count: 3200 }, { stars: 3, count: 1500 },
            { stars: 2, count: 600 }, { stars: 1, count: 400 },
        ],
    },
    recentOrders: [
        { id: 605785, customer: 'Wade Warren', country: 'USA', total: 50, status: 'SHIPPED', createdAt: '2026-05-30T10:00:00Z' },
        { id: 8057825, customer: 'Aizan Ahmed', country: 'Canada', total: 70, status: 'PROCESSING', createdAt: '2026-05-29T10:00:00Z' },
        { id: 430112, customer: 'Ariyan Di', country: 'Bangladesh', total: 60, status: 'DELIVERED', createdAt: '2026-06-02T10:00:00Z' },
        { id: 330987, customer: 'Jerin Akter', country: 'UK', total: 90, status: 'PAID', createdAt: '2026-06-01T10:00:00Z' },
        { id: 220456, customer: 'Sara Khan', country: 'Germany', total: 120, status: 'PENDING', createdAt: '2026-05-28T10:00:00Z' },
    ],
};

export default function DashboardPreview() {
    return (
        <AdminShell pathname="/admin" today="Sun, 18 Nov" pendingOrders={6} userName="Admin User" onLogout={() => {}}>
            <DashboardView data={SAMPLE} />
        </AdminShell>
    );
}
