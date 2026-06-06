'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Settings, LogOut, ChevronRight, CreditCard, Bell, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import LoyaltyBadge from '@/components/loyalty/LoyaltyBadge';
import AuthForm from '@/components/auth/AuthForm';
import AddressBook from '@/components/account/AddressBook';
import ProfileForm from '@/components/account/ProfileForm';
import SecurityForm from '@/components/account/SecurityForm';
import EmailVerifyBanner from '@/components/account/EmailVerifyBanner';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore, type Product } from '@/store/useStore';
import { useOrders, type Order } from '@/lib/hooks';
import { Skeleton } from '@/components/ui/Skeleton';
import { toast } from 'sonner';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

const statusStyles = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'DELIVERED' || s === 'PAID') return 'bg-new/5 border-new text-new';
    if (s === 'SHIPPED' || s === 'PROCESSING') return 'bg-accent/5 border-accent text-accent';
    if (s === 'CANCELLED' || s === 'REFUNDED') return 'bg-hot/5 border-hot text-hot';
    return 'bg-limited/5 border-limited text-limited';
};

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState('orders');
    const { user, status, logout } = useAuthStore();
    const isAuthed = status === 'authenticated';
    const { orders, isLoading: ordersLoading } = useOrders(isAuthed);
    const addToCart = useStore((s) => s.addToCart);

    /** Re-add every item from a past order to the cart (skips items missing image/slug). */
    const orderAgain = (order: Order) => {
        let added = 0;
        for (const item of order.items) {
            const product: Product = {
                id: item.productId,
                name: item.name,
                slug: item.slug ?? undefined,
                price: item.price,
                image: item.image ?? '/home_accessories_hero.png',
                category: '',
                description: '',
                rating: 0,
                reviews: 0,
                inStock: true,
            };
            for (let i = 0; i < item.quantity; i++) {
                addToCart(product);
                added++;
            }
        }
        toast.success(added === 0 ? 'Nothing to re-add' : `${added} item${added === 1 ? '' : 's'} added to your cart`);
    };

    const tabs = [
        { id: 'orders', label: 'History', icon: Package },
        { id: 'addresses', label: 'Addresses', icon: Home },
        { id: 'profile', label: 'Identity', icon: User },
        { id: 'settings', label: 'Control', icon: Settings },
    ];

    const handleLogout = async () => {
        await logout();
        toast.success('Signed out');
    };

    if (status === 'loading') {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthed) {
        return (
            <div className="pt-10 pb-48 bg-white dark:bg-ink-950">
                <div className="max-w-[1440px] mx-auto px-4 md:px-12">
                    <header className="text-center mb-12 space-y-4">
                        <span className="text-accent font-medium tracking-[0.4em] text-xs uppercase block">Personal Terminal</span>
                        <h1 className="text-5xl md:text-7xl font-medium text-primary dark:text-white leading-[0.85] tracking-tight">
                            Client Access
                        </h1>
                    </header>
                    <AuthForm />
                </div>
            </div>
        );
    }

    return (
        <div className="pt-5 md:pt-5 pb-48 bg-white dark:bg-ink-950">
            <div className="max-w-[1440px] mx-auto px-4 md:px-12">

                <EmailVerifyBanner />

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-8">
                    <div className="space-y-6">
                        <span className="text-accent font-medium tracking-[0.4em] text-xs uppercase block">Personal Terminal</span>
                        <h1 className="text-6xl md:text-9xl font-medium text-primary dark:text-white leading-[0.8] tracking-tight">
                            Welcome,<br />{(user?.displayName || 'Client').split(' ')[0]}.
                        </h1>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-24">

                    {/* Access Panel */}
                    <aside className="lg:col-span-4 space-y-12">
                        <LoyaltyBadge points={3500} />

                        <nav className="bg-primary/2 dark:bg-ink-900 rounded-[3.5rem] border border-primary/5 dark:border-slate-800 p-10 space-y-4">
                            <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.4em] mb-10">Navigation Matrix</h3>
                            <div className="space-y-4">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full group flex items-center justify-between p-6 rounded-2xl transition-all duration-500 ${isActive
                                                    ? 'bg-primary text-white shadow-2xl scale-105'
                                                    : 'text-primary dark:text-white hover:bg-primary/5 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <div className="flex items-center gap-6">
                                                <Icon className={`w-6 h-6 ${isActive ? 'text-accent' : 'text-primary dark:text-white'}`} />
                                                <span className="text-xs font-medium uppercase tracking-widest">{tab.label}</span>
                                            </div>
                                            {isActive ? (
                                                <motion.div layoutId="navDot" className="w-2 h-2 rounded-full bg-accent" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 opacity-10 group-hover:opacity-100 transition-opacity" />
                                            )}
                                        </button>
                                    );
                                })}
                                <div className="pt-8 mt-8 border-t border-primary/5 dark:border-slate-800">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-6 p-6 rounded-2xl text-hot hover:bg-hot/5 transition-all group"
                                    >
                                        <LogOut className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                        <span className="text-xs font-medium uppercase tracking-widest">Terminate Session</span>
                                    </button>
                                </div>
                            </div>
                        </nav>

                        {user?.role === 'ADMIN' && (
                            <Link
                                href="/admin"
                                className="flex items-center justify-center gap-3 p-6 rounded-[2rem] bg-primary text-white dark:bg-accent font-medium uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
                            >
                                <Shield className="w-5 h-5" />
                                Admin Dashboard
                            </Link>
                        )}
                    </aside>

                    {/* Data Display */}
                    <main className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {activeTab === 'orders' && (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-12"
                                >
                                    <div className="flex items-center justify-between border-b-2 border-primary dark:border-white pb-8">
                                        <h2 className="text-4xl font-medium text-primary dark:text-white tracking-tight uppercase">Order History</h2>
                                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{orders.length} Records</span>
                                    </div>

                                    {ordersLoading ? (
                                        <div className="space-y-8">
                                            {Array.from({ length: 3 }).map((_, i) => (
                                                <div key={i} className="p-10 bg-white dark:bg-ink-900 border border-primary/5 dark:border-slate-800 rounded-[3rem] flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                    <div className="space-y-4 flex-1">
                                                        <Skeleton className="h-3 w-32" />
                                                        <Skeleton className="h-8 w-48" />
                                                        <Skeleton className="h-3 w-24" />
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <Skeleton className="h-9 w-24 rounded-full" />
                                                        <Skeleton className="h-9 w-32 rounded-full" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <p className="text-secondary dark:text-gray-400 font-medium">No orders yet. Start shopping to see them here.</p>
                                    ) : (
                                        <div className="space-y-8">
                                            {orders.map((order, i) => (
                                                <motion.div
                                                    key={order.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="group p-10 bg-white dark:bg-ink-900 border border-primary/5 dark:border-slate-800 rounded-[3rem] hover:shadow-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-8"
                                                >
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-[10px] font-medium text-accent uppercase tracking-widest underline underline-offset-4">LC-{String(order.id).padStart(4, '0')}</span>
                                                            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{formatDate(order.createdAt)}</span>
                                                        </div>
                                                        <h3 className="text-3xl font-medium text-primary dark:text-white tracking-tight uppercase">Total: ${order.total.toFixed(2)}</h3>
                                                        <p className="text-[10px] font-medium text-secondary dark:text-gray-400 uppercase tracking-[0.2em]">{order.items.reduce((n, it) => n + it.quantity, 0)} Units</p>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <div className={`px-4 py-2 rounded-full text-[10px] font-medium uppercase tracking-widest border-2 ${statusStyles(order.status)}`}>
                                                            {order.status}
                                                        </div>
                                                        <button
                                                            onClick={() => orderAgain(order)}
                                                            title="Re-add all items to cart"
                                                            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-primary/15 dark:border-slate-700 text-primary dark:text-white text-[10px] font-medium uppercase tracking-widest hover:bg-primary/5 dark:hover:bg-slate-800 transition-colors"
                                                        >
                                                            <RefreshCw className="w-3 h-3" /> Order Again
                                                        </button>
                                                        <Link
                                                            href={`/orders/${order.id}`}
                                                            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white dark:bg-accent text-[10px] font-medium uppercase tracking-widest hover:opacity-90"
                                                        >
                                                            Track <ChevronRight className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'addresses' && (
                                <motion.div
                                    key="addresses"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <AddressBook />
                                </motion.div>
                            )}

                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-16"
                                >
                                    <div className="border-b-2 border-primary dark:border-white pb-8">
                                        <h2 className="text-4xl font-medium text-primary dark:text-white tracking-tight uppercase">Client Identity</h2>
                                    </div>
                                    <ProfileForm />
                                </motion.div>
                            )}

                            {activeTab === 'settings' && (
                                <motion.div
                                    key="settings"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-16"
                                >
                                    <div className="border-b-2 border-primary dark:border-white pb-8">
                                        <h2 className="text-4xl font-medium text-primary dark:text-white tracking-tight uppercase">System Control</h2>
                                    </div>
                                    <SecurityForm />
                                    <div className="space-y-8">
                                        {[
                                            { title: 'Information Dispatch', desc: 'Receive periodic archival updates and event notifications.', icon: Bell },
                                            { title: 'Metric Tracking', desc: 'Allow system to calibrate your experience based on navigation data.', icon: Settings },
                                            { title: 'Secure Vault', desc: 'Manage your biometric and transaction credentials.', icon: CreditCard },
                                        ].map((opt, i) => (
                                            <div key={i} className="flex items-center justify-between p-10 bg-white dark:bg-ink-900 border border-primary/5 dark:border-slate-800 rounded-[3rem] hover:border-accent transition-all group">
                                                <div className="flex items-center gap-10">
                                                    <div className="w-16 h-16 rounded-2xl bg-primary/2 dark:bg-ink-800 flex items-center justify-center text-primary dark:text-white group-hover:bg-accent group-hover:text-white transition-all">
                                                        <opt.icon className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-medium text-primary dark:text-white uppercase tracking-tight mb-2">{opt.title}</h3>
                                                        <p className="text-sm font-medium text-secondary dark:text-gray-400 max-w-sm">{opt.desc}</p>
                                                    </div>
                                                </div>
                                                <div className="w-16 h-8 bg-primary/5 dark:bg-ink-800 rounded-full relative cursor-pointer border-2 border-primary/5 dark:border-slate-700">
                                                    <motion.div animate={{ x: 36 }} className="absolute top-1 left-1 w-5 h-5 bg-accent rounded-full shadow-lg" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
}
