'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { ApiError } from '@/lib/api';
import GoogleSignInButton from './GoogleSignInButton';

export default function AuthForm() {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);

    const login = useAuthStore((s) => s.login);
    const register = useAuthStore((s) => s.register);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(email, password);
                toast.success('Welcome back!');
            } else {
                await register(email, password, displayName);
                toast.success('Account created!');
            }
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Something went wrong';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto w-full bg-white dark:bg-slate-900 border border-primary/10 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-xl">
            <h2 className="text-2xl font-black text-primary dark:text-white uppercase tracking-tight mb-2">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-sm text-secondary dark:text-gray-400 mb-8">
                {mode === 'login' ? 'Access your dashboard, orders, and wishlist.' : 'Join LuxeCart to track orders and save favorites.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            required
                            placeholder="Full name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white"
                        />
                    </div>
                )}
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="email"
                        required
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white"
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="Password (min 6 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white"
                    />
                </div>

                {mode === 'login' && (
                    <div className="text-right">
                        <Link href="/forgot-password" className="text-xs font-bold text-accent hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white dark:bg-accent py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-black dark:hover:bg-accent/90 transition-colors disabled:opacity-60"
                >
                    {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
            </form>

            <GoogleSignInButton />

            <p className="text-center text-sm text-secondary dark:text-gray-400 mt-6">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    className="font-bold text-accent hover:underline"
                >
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
            </p>
        </div>
    );
}
