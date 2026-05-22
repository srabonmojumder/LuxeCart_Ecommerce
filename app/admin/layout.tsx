'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    Tag,
    ClipboardList,
    Users,
    Star,
    Ticket,
    Image as ImageIcon,
    Mail,
    Settings as SettingsIcon,
    Store,
    LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';

const nav = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: Tag },
    { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
    { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
    { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
    { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
    { href: '/admin/settings', label: 'Settings', icon: SettingsIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, status, logout } = useAuthStore();
    const isAdmin = status === 'authenticated' && user?.role === 'ADMIN';

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 text-center">
                <div className="space-y-4">
                    <h1 className="text-3xl font-black text-primary dark:text-white tracking-tighter">Admin access required</h1>
                    <p className="text-secondary dark:text-gray-400">Sign in with an admin account to manage the store.</p>
                    <Link href="/account" className="inline-block px-6 py-3 bg-primary dark:bg-accent text-white rounded-xl font-bold text-sm">Go to Sign In</Link>
                </div>
            </div>
        );
    }

    const handleLogout = async () => {
        await logout();
        toast.success('Signed out');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-slate-900 border-r border-primary/5 dark:border-slate-800 sticky top-0 h-screen">
                <div className="p-6 border-b border-primary/5 dark:border-slate-800">
                    <span className="text-accent font-black tracking-[0.3em] text-[10px] uppercase">Control Center</span>
                    <h2 className="text-2xl font-black text-primary dark:text-white tracking-tighter">LuxeCart</h2>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {nav.map((item) => {
                        const Icon = item.icon;
                        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${active
                                    ? 'bg-primary text-white dark:bg-accent'
                                    : 'text-primary/70 dark:text-gray-400 hover:bg-primary/5 dark:hover:bg-slate-800'}`}
                            >
                                <Icon className="w-5 h-5" /> {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-primary/5 dark:border-slate-800 space-y-1">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-primary/70 dark:text-gray-400 hover:bg-primary/5 dark:hover:bg-slate-800 transition-colors">
                        <Store className="w-5 h-5" /> Back to Store
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-hot hover:bg-hot/5 transition-colors">
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>
            </aside>

            {/* Mobile bottom nav (scrolls horizontally — many sections) */}
            <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-slate-900 border-t border-primary/5 dark:border-slate-800 flex gap-1 py-2 px-2 pb-safe overflow-x-auto no-scrollbar">
                {nav.map((item) => {
                    const Icon = item.icon;
                    const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                    return (
                        <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-bold flex-shrink-0 ${active ? 'text-accent' : 'text-gray-400'}`}>
                            <Icon className="w-5 h-5" /> {item.label}
                        </Link>
                    );
                })}
            </div>

            {/* Content */}
            <main className="flex-1 min-w-0 p-4 md:p-8 pb-24 md:pb-8">{children}</main>
        </div>
    );
}
