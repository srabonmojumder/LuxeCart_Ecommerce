'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Heart, Settings, LogOut, ArrowRight, ChevronRight, MapPin, CreditCard, Bell } from 'lucide-react';
import LoyaltyBadge from '@/components/loyalty/LoyaltyBadge';
import Link from 'next/link';

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState('orders');

    const tabs = [
        { id: 'orders', label: 'History', icon: Package },
        { id: 'profile', label: 'Identity', icon: User },
        { id: 'settings', label: 'Control', icon: Settings },
    ];

    const mockOrders = [
        { id: 'LC-982-FX', date: '2026-01-05', status: 'Delivered', total: 299.99, items: 3 },
        { id: 'LC-114-AQ', date: '2026-01-01', status: 'Shipped', total: 599.99, items: 2 },
        { id: 'LC-002-ZT', date: '2025-12-28', status: 'Processing', total: 159.99, items: 1 },
    ];

    return (
        <div className="pt-32 md:pt-40 pb-48 min-h-screen bg-white">
            <div className="max-w-[1440px] mx-auto px-4 md:px-12">

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
                    <div className="space-y-6">
                        <span className="text-accent font-black tracking-[0.4em] text-xs uppercase block">Personal Terminal</span>
                        <h1 className="text-6xl md:text-9xl font-black text-primary leading-[0.8] tracking-tighter">
                            Client <br />Dashboard.
                        </h1>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-24">

                    {/* Access Panel */}
                    <aside className="lg:col-span-4 space-y-12">
                        <LoyaltyBadge points={3500} />

                        <nav className="bg-primary/2 rounded-[3.5rem] border border-primary/5 p-10 space-y-4">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10">Navigation Matrix</h3>
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
                                                    : 'text-primary hover:bg-primary/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-6">
                                                <Icon className={`w-6 h-6 ${isActive ? 'text-accent' : 'text-primary'}`} />
                                                <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
                                            </div>
                                            {isActive ? (
                                                <motion.div layoutId="navDot" className="w-2 h-2 rounded-full bg-accent" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 opacity-10 group-hover:opacity-100 transition-opacity" />
                                            )}
                                        </button>
                                    );
                                })}
                                <div className="pt-8 mt-8 border-t border-primary/5">
                                    <button className="w-full flex items-center gap-6 p-6 rounded-2xl text-hot hover:bg-hot/5 transition-all group">
                                        <LogOut className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                        <span className="text-xs font-black uppercase tracking-widest">Terminate Session</span>
                                    </button>
                                </div>
                            </div>
                        </nav>
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
                                    <div className="flex items-center justify-between border-b-2 border-primary pb-8">
                                        <h2 className="text-4xl font-black text-primary tracking-tighter uppercase">Archived Sequences</h2>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{mockOrders.length} Records</span>
                                    </div>

                                    <div className="space-y-8">
                                        {mockOrders.map((order, i) => (
                                            <motion.div
                                                key={order.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="group p-10 bg-white border border-primary/5 rounded-[3rem] hover:shadow-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-8"
                                            >
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[10px] font-black text-accent uppercase tracking-widest underline underline-offset-4">{order.id}</span>
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(order.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <h3 className="text-3xl font-black text-primary tracking-tighter uppercase">Valuation: ${order.total.toFixed(2)}</h3>
                                                    <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{order.items} Units Processing</p>
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${order.status === 'Delivered' ? 'bg-new/5 border-new text-new' :
                                                            order.status === 'Shipped' ? 'bg-accent/5 border-accent text-accent' :
                                                                'bg-limited/5 border-limited text-limited'
                                                        }`}>
                                                        {order.status}
                                                    </div>
                                                    <button className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-accent transition-all shadow-xl group/btn">
                                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
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
                                    <div className="border-b-2 border-primary pb-8">
                                        <h2 className="text-4xl font-black text-primary tracking-tighter uppercase">Client Identity</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-12">
                                        {[
                                            { label: 'Display Identifier', value: 'JOHN DOE', icon: User },
                                            { label: 'Electronic Address', value: 'JOHN@LUXECART.COM', icon: Bell },
                                            { label: 'Contact Index', value: '+44 020 7946 0000', icon: Package },
                                            { label: 'Primary Residence', value: 'LONDON, UK', icon: MapPin }
                                        ].map((field, i) => (
                                            <div key={i} className="p-8 bg-primary/2 rounded-[2.5rem] border border-primary/5 space-y-4">
                                                <div className="flex items-center gap-4 text-accent">
                                                    <field.icon className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">{field.label}</span>
                                                </div>
                                                <p className="text-xl font-black text-primary tracking-tight">{field.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="btn-primary w-full md:w-auto px-16 h-20 text-xs">
                                        AUTHENTICATE & UPDATE
                                    </button>
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
                                    <div className="border-b-2 border-primary pb-8">
                                        <h2 className="text-4xl font-black text-primary tracking-tighter uppercase">System Control</h2>
                                    </div>
                                    <div className="space-y-8">
                                        {[
                                            { title: 'Information Dispatch', desc: 'Receive periodic archival updates and event notifications.', icon: Bell },
                                            { title: 'Metric Tracking', desc: 'Allow system to calibrate your experience based on navigation data.', icon: Settings },
                                            { title: 'Secure Vault', desc: 'Manage your biometric and transaction credentials.', icon: CreditCard }
                                        ].map((opt, i) => (
                                            <div key={i} className="flex items-center justify-between p-10 bg-white border border-primary/5 rounded-[3rem] hover:border-accent transition-all group">
                                                <div className="flex items-center gap-10">
                                                    <div className="w-16 h-16 rounded-2xl bg-primary/2 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all">
                                                        <opt.icon className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-black text-primary uppercase tracking-tight mb-2">{opt.title}</h3>
                                                        <p className="text-sm font-medium text-secondary max-w-sm">{opt.desc}</p>
                                                    </div>
                                                </div>
                                                <div className="w-16 h-8 bg-primary/5 rounded-full relative cursor-pointer border-2 border-primary/5">
                                                    <motion.div
                                                        animate={{ x: 36 }}
                                                        className="absolute top-1 left-1 w-5 h-5 bg-accent rounded-full shadow-lg"
                                                    />
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
