'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard, BarChart3, Package, Tag, ClipboardList, RotateCcw, Users, Star,
    Ticket, Image as ImageIcon, BookOpen, Mail, Settings as SettingsIcon, Store, LogOut,
    Search, Bell, Droplet, X, Menu, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';

const SKY = '#46AEE8';

const nav = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: Tag },
    { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { href: '/admin/returns', label: 'Returns', icon: RotateCcw },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
    { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
    { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
    { href: '/admin/blog', label: 'Blog', icon: BookOpen },
    { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
    { href: '/admin/settings', label: 'Settings', icon: SettingsIcon },
];

const tabs = [
    { href: '/admin', label: 'Dashboard Overview', exact: true },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/customers', label: 'Customers' },
];

const initials = (s: string) =>
    (s || 'A').replace(/@.*/, '').split(/[.\s_-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'A';

const isActive = (pathname: string, item: { href: string; exact?: boolean }) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

interface Props {
    pathname: string;
    today: string;
    pendingOrders?: number;
    userName: string;
    userPhoto?: string | null;
    onLogout: () => void;
    children: React.ReactNode;
}

export default function AdminShell({ pathname, today, pendingOrders, userName, userPhoto, onLogout, children }: Props) {
    const [collapsed, setCollapsed] = useState(true);   // desktop icon-rail vs labelled
    const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer

    // Restore the desktop collapse preference.
    useEffect(() => {
        const saved = localStorage.getItem('admin:sidebarCollapsed');
        if (saved != null) setCollapsed(saved === '1');
    }, []);
    const toggleCollapsed = () => setCollapsed((c) => { localStorage.setItem('admin:sidebarCollapsed', c ? '0' : '1'); return !c; });

    // Close the mobile drawer whenever the route changes.
    useEffect(() => { setMobileOpen(false); }, [pathname]);

    const navLink = (item: typeof nav[number], opts: { showLabel: boolean; onClick?: () => void }) => {
        const Icon = item.icon;
        const active = isActive(pathname, item);
        return (
            <Link key={item.href} href={item.href} title={item.label} onClick={opts.onClick}
                className={`flex items-center rounded-2xl transition-colors h-11 shrink-0 ${opts.showLabel ? 'gap-3 px-3 w-full' : 'justify-center w-11'} ${active ? 'text-white shadow-md' : 'bg-white text-slate-400 hover:text-slate-600'}`}
                style={active ? { backgroundColor: SKY } : undefined}>
                <Icon className="w-5 h-5 shrink-0" />
                {opts.showLabel && <span className="text-sm font-bold truncate">{item.label}</span>}
            </Link>
        );
    };

    return (
        <div className="admin-scope h-dvh bg-[#e8eaed] p-2 sm:p-3 md:p-4 overflow-hidden">
            <div className="mx-auto max-w-[1640px] h-full flex flex-col bg-[#f3f5f7] rounded-[1.5rem] md:rounded-[2rem] shadow-sm overflow-hidden">

                {/* ============================ TOP BAR (fixed) ============================ */}
                <header className="shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-3 md:py-4">
                    {/* menu toggles */}
                    <button onClick={() => setMobileOpen(true)} aria-label="Open menu"
                        className="md:hidden w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <Menu className="w-5 h-5" />
                    </button>
                    <button onClick={toggleCollapsed} aria-label="Toggle sidebar"
                        className="hidden md:flex w-10 h-10 rounded-full bg-white border border-slate-100 items-center justify-center text-slate-600 hover:text-slate-800 shrink-0">
                        {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                    </button>

                    {/* Brand */}
                    <Link href="/admin" className="flex items-center gap-2.5 shrink-0">
                        <span className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: SKY }}>
                            <Droplet className="w-5 h-5 text-white fill-white" />
                        </span>
                        <span className="text-xl font-black text-slate-800 tracking-tight hidden sm:block">LuxeCart</span>
                    </Link>

                    {/* Tabs */}
                    <nav className="hidden lg:flex items-center gap-1 ml-2">
                        {tabs.map((t) => {
                            const active = isActive(pathname, t);
                            return (
                                <Link key={t.href} href={t.href}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${active ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                                    {t.label}
                                    {active && <X className="w-3.5 h-3.5 opacity-40" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Search */}
                    <div className="hidden md:block flex-1 max-w-md mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input placeholder="Start searching here..."
                                className="w-full rounded-full bg-white border border-slate-100 pl-11 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none" />
                        </div>
                    </div>

                    {/* Right cluster */}
                    <div className="flex items-center gap-2 ml-auto md:ml-0 shrink-0">
                        <div className="hidden sm:flex items-center gap-2 bg-white rounded-full pl-3 pr-2 py-1.5 border border-slate-100">
                            <Bell className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">{today || ' '}</span>
                            {!!pendingOrders && (
                                <span className="min-w-5 h-5 px-1.5 rounded-full text-white text-[10px] font-black flex items-center justify-center" style={{ backgroundColor: SKY }}>
                                    {pendingOrders > 99 ? '99+' : pendingOrders}
                                </span>
                            )}
                        </div>
                        <Link href="/admin/settings" className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700">
                            <SettingsIcon className="w-5 h-5" />
                        </Link>
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 flex items-center justify-center text-white font-black text-sm shrink-0" style={{ backgroundColor: SKY, borderColor: '#ffffff' }}>
                            {userPhoto
                                ? <img src={userPhoto} alt="" className="w-full h-full object-cover" />
                                : initials(userName)}
                        </div>
                    </div>
                </header>

                {/* ============== SIDEBAR RAIL (fixed) + SCROLLABLE CONTENT ============== */}
                <div className="flex gap-1 sm:gap-6 px-2 sm:px-3 md:px-4 pb-3 md:pb-4 flex-1 min-h-0">
                    {/* desktop rail (collapsible). Nav scrolls; Back-to-store + Logout stay pinned. */}
                    <aside className={`hidden md:flex flex-col shrink-0 transition-[width] duration-300 ${collapsed ? 'w-[60px]' : 'w-[210px]'}`}>
                        {/* scrollable nav */}
                        <div className={`flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-1.5 ${collapsed ? 'items-center' : 'items-stretch'}`}>
                            {nav.map((item) => navLink(item, { showLabel: !collapsed }))}
                        </div>
                        {/* pinned bottom actions */}
                        <div className={`shrink-0 mt-2 pt-2 border-t border-slate-200/70 flex flex-col gap-1.5 ${collapsed ? 'items-center' : 'items-stretch'}`}>
                            <Link href="/" title="Back to store" className={`flex items-center rounded-2xl transition-colors h-11 shrink-0 bg-white text-slate-400 hover:text-slate-600 ${collapsed ? 'justify-center w-11' : 'gap-3 px-3 w-full'}`}>
                                <Store className="w-5 h-5 shrink-0" />{!collapsed && <span className="text-sm font-bold">Back to store</span>}
                            </Link>
                            <button onClick={onLogout} title="Logout" className={`flex items-center rounded-2xl transition-colors h-11 shrink-0 bg-white text-rose-500 hover:bg-rose-50 ${collapsed ? 'justify-center w-11' : 'gap-3 px-3 w-full'}`}>
                                <LogOut className="w-5 h-5 shrink-0" />{!collapsed && <span className="text-sm font-bold">Logout</span>}
                            </button>
                        </div>
                    </aside>

                    {/* content (only this scrolls) */}
                    <main className="flex-1 min-w-0 overflow-y-auto pb-2">{children}</main>
                </div>
            </div>

            {/* ====================== MOBILE DRAWER ====================== */}
            <div className={`md:hidden fixed inset-0 z-50 ${mobileOpen ? '' : 'pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setMobileOpen(false)} />
                <aside className={`absolute left-0 top-0 bottom-0 w-72 max-w-[80vw] bg-white shadow-2xl p-4 flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <span className="flex items-center gap-2.5">
                            <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: SKY }}><Droplet className="w-4 h-4 text-white fill-white" /></span>
                            <span className="text-lg font-black text-slate-800">LuxeCart</span>
                        </span>
                        <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><X className="w-5 h-5" /></button>
                    </div>
                    <nav className="flex-1 overflow-y-auto space-y-1.5">
                        {nav.map((item) => navLink(item, { showLabel: true, onClick: () => setMobileOpen(false) }))}
                    </nav>
                    <div className="pt-3 space-y-1.5 border-t border-slate-100 mt-2">
                        <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 h-11 rounded-2xl bg-white text-slate-500 hover:bg-slate-50 text-sm font-bold">
                            <Store className="w-5 h-5" /> Back to store
                        </Link>
                        <button onClick={() => { setMobileOpen(false); onLogout(); }} className="w-full flex items-center gap-3 px-3 h-11 rounded-2xl text-rose-500 hover:bg-rose-50 text-sm font-bold">
                            <LogOut className="w-5 h-5" /> Logout
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
