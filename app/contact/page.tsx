'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Send, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useSettings } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';

const field =
    'w-full px-4 py-3 bg-gray-50 dark:bg-ink-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white placeholder:text-gray-400';
const label = 'text-[10px] font-medium uppercase tracking-widest text-gray-400';

export default function ContactPage() {
    const { settings } = useSettings();
    const phone = settings?.supportPhone || '+1 (234) 567-890';
    const email = settings?.supportEmail || 'support@luxecart.com';
    const address = settings?.address || '123 Commerce Street, New York, NY 10001';

    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);

    const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            await api.post('/contact', form);
            toast.success("Thanks! We'll get back to you within 24 hours.");
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 pb-24 space-y-12">
            {/* Hero */}
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-3 max-w-2xl mx-auto"
            >
                <span className="text-accent font-medium tracking-[0.3em] text-xs uppercase">Contact</span>
                <h1 className="text-4xl md:text-6xl font-medium text-primary dark:text-white tracking-tight">
                    Get In Touch
                </h1>
                <p className="text-secondary dark:text-gray-400 text-lg">
                    Got a question, an order issue, or just want to say hi? We&apos;d love to hear from you.
                </p>
            </motion.header>

            {/* Form + Info */}
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
                {/* Form */}
                <motion.section
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-ink-900 border border-primary/5 dark:border-slate-800 rounded-2xl p-6 md:p-8"
                >
                    <h2 className="text-2xl font-medium text-primary dark:text-white tracking-tight mb-6">
                        Send us a message
                    </h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className={label}>Your Name</label>
                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) => set('name', e.target.value)}
                                    placeholder="Jane Doe"
                                    className={field}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className={label}>Email</label>
                                <input
                                    required
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => set('email', e.target.value)}
                                    placeholder="you@example.com"
                                    className={field}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={label}>Subject</label>
                            <input
                                required
                                value={form.subject}
                                onChange={(e) => set('subject', e.target.value)}
                                placeholder="How can we help?"
                                className={field}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className={label}>Message</label>
                            <textarea
                                required
                                rows={6}
                                value={form.message}
                                onChange={(e) => set('message', e.target.value)}
                                placeholder="Tell us more…"
                                className={`${field} resize-none`}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={sending}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary dark:bg-accent text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm disabled:opacity-60 hover:bg-accent dark:hover:bg-accent-600 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            {sending ? 'Sending…' : 'Send Message'}
                        </button>
                    </form>
                </motion.section>

                {/* Info card */}
                <motion.aside
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <div className="bg-primary dark:bg-accent text-white rounded-2xl p-6 md:p-8 space-y-5">
                        <h2 className="text-2xl font-medium tracking-tight">Reach us directly</h2>

                        <a href={`tel:${phone}`} className="flex items-start gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0">
                                <Phone className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-medium uppercase tracking-widest opacity-60">Phone</p>
                                <p className="font-bold">{phone}</p>
                            </div>
                        </a>

                        <a href={`mailto:${email}`} className="flex items-start gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0">
                                <Mail className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-medium uppercase tracking-widest opacity-60">Email</p>
                                <p className="font-bold break-all">{email}</p>
                            </div>
                        </a>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-medium uppercase tracking-widest opacity-60">Address</p>
                                <p className="font-bold">{address}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-medium uppercase tracking-widest opacity-60">Hours</p>
                                <p className="font-bold">Mon – Fri · 9am – 6pm</p>
                            </div>
                        </div>

                        {(settings?.facebook || settings?.instagram || settings?.twitter) && (
                            <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                                {settings?.facebook && (
                                    <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                        <Facebook className="w-4 h-4" />
                                    </a>
                                )}
                                {settings?.instagram && (
                                    <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                        <Instagram className="w-4 h-4" />
                                    </a>
                                )}
                                {settings?.twitter && (
                                    <a href={settings.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                        <Twitter className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-ink-900 border border-primary/5 dark:border-slate-800 rounded-2xl p-6">
                        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-2">Order help?</p>
                        <p className="text-sm text-secondary dark:text-gray-400 mb-3">
                            Tracking an order or starting a return? Skip the form and use our self-service tools.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <a href="/track" className="px-4 py-2 rounded-xl bg-accent/10 text-accent text-xs font-medium uppercase tracking-widest hover:bg-accent/20 transition-colors">Track Order</a>
                            <a href="/account" className="px-4 py-2 rounded-xl bg-primary/5 dark:bg-ink-800 text-primary dark:text-white text-xs font-medium uppercase tracking-widest hover:bg-primary/10 dark:hover:bg-slate-700 transition-colors">My Orders</a>
                        </div>
                    </div>
                </motion.aside>
            </div>
        </div>
    );
}
