'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';
import LoyaltyBadge from '@/components/loyalty/LoyaltyBadge';

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState('orders');

    const tabs = [
        { id: 'orders', label: 'My Orders', icon: Package },
        { id: 'wishlist', label: 'Wishlist', icon: Heart },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const mockOrders = [
        {
            id: 'LUX-ABC123',
            date: '2026-01-05',
            status: 'Delivered',
            total: 299.99,
            items: 3,
        },
        {
            id: 'LUX-DEF456',
            date: '2026-01-01',
            status: 'Shipped',
            total: 599.99,
            items: 2,
        },
        {
            id: 'LUX-GHI789',
            date: '2025-12-28',
            status: 'Processing',
            total: 159.99,
            items: 1,
        },
    ];

    return (
        <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-gray-900 dark:text-white mb-8"
                >
                    My Account
                </motion.h1>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Loyalty Badge */}
                        <LoyaltyBadge points={3500} />

                        {/* Navigation */}
                        <div className="card space-y-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                            ? 'bg-purple-600 text-white'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'orders' && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Order History
                                </h2>
                                {mockOrders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="card"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Order #{order.id}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(order.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Delivered'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : order.status === 'Shipped'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {order.items} items
                                                </p>
                                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                    ${order.total.toFixed(2)}
                                                </p>
                                            </div>
                                            <button className="btn-outline">View Details</button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="card">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Profile Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Full Name
                                        </label>
                                        <input type="text" className="input-field" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="input-field"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            className="input-field"
                                            placeholder="+1 (234) 567-890"
                                        />
                                    </div>
                                    <button className="btn-primary">Save Changes</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    My Wishlist
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    View your wishlist items in the{' '}
                                    <a href="/wishlist" className="text-primary-600 hover:underline">
                                        Wishlist page
                                    </a>
                                    .
                                </p>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="card">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Settings
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                Email Notifications
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Receive updates about your orders and promotions
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
