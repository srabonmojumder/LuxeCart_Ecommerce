'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Youtube, href: '#', label: 'YouTube' },
    ];

    const quickLinks = [
        { label: 'All Products', href: '/products' },
        { label: 'Categories', href: '/categories' },
        { label: 'Special Deals', href: '/products?filter=sale' },
        { label: 'New Arrivals', href: '/products?filter=new' },
        { label: 'About Us', href: '/about' },
    ];

    const customerService = [
        { label: 'Contact Us', href: '/contact' },
        { label: 'Shipping Policy', href: '/shipping' },
        { label: 'Returns & Exchanges', href: '/returns' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Track Order', href: '/track-order' },
    ];

    return (
        <footer className="bg-slate-900 text-white">
            {/* Main Footer */}
            <div className="section-container py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">L</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                                LuxeCart
                            </span>
                        </Link>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            Your premium destination for quality products. Shop with confidence and enjoy the best online shopping experience.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <motion.a
                                    key={label}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={href}
                                    aria-label={label}
                                    className="w-10 h-10 bg-slate-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <Icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-5 text-white">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="text-slate-400 hover:text-teal-400 transition-colors inline-flex items-center group"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform">
                                            {label}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg font-semibold mb-5 text-white">Customer Service</h4>
                        <ul className="space-y-3">
                            {customerService.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="text-slate-400 hover:text-teal-400 transition-colors inline-flex items-center group"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform">
                                            {label}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-5 text-white">Contact Info</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-400">
                                    123 Shopping Street,<br />
                                    New York, NY 10001
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-teal-400 flex-shrink-0" />
                                <a
                                    href="tel:+1234567890"
                                    className="text-slate-400 hover:text-teal-400 transition-colors"
                                >
                                    +1 (234) 567-890
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-teal-400 flex-shrink-0" />
                                <a
                                    href="mailto:support@luxecart.com"
                                    className="text-slate-400 hover:text-teal-400 transition-colors"
                                >
                                    support@luxecart.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="border-t border-slate-800">
                <div className="section-container py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h4 className="text-lg font-semibold mb-1">
                                Subscribe to Our Newsletter
                            </h4>
                            <p className="text-slate-400 text-sm">
                                Get updates on new products and exclusive offers
                            </p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto max-w-md">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder:text-slate-500"
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-5 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl font-semibold hover:from-teal-600 hover:to-emerald-600 transition-all flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                <span className="hidden sm:inline">Subscribe</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="section-container py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">
                            © {currentYear} LuxeCart. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                            <Link
                                href="/privacy"
                                className="text-slate-500 hover:text-teal-400 transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-slate-500 hover:text-teal-400 transition-colors"
                            >
                                Terms of Service
                            </Link>
                            <Link
                                href="/cookies"
                                className="text-slate-500 hover:text-teal-400 transition-colors"
                            >
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
