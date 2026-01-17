import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone, Send } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-t border-slate-200/50 dark:border-slate-800/50">
            {/* Gradient Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent opacity-60"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                    {/* Brand Info - Takes more space */}
                    <div className="lg:col-span-4">
                        <div className="mb-8">
                            <h4 className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-r from-primary via-accent to-primary dark:from-accent dark:via-purple-400 dark:to-accent bg-clip-text text-transparent mb-4">
                                LuxeCart
                            </h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
                                Premium home accessories for the modern minimalist. Elevate your living space with our curated collection of decor, lighting, and essentials.
                            </p>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3 mb-8">
                            <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <MapPin className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                                <span>123 Design Street, Creative City, CC 12345</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                                <span>hello@luxecart.com</span>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="group w-11 h-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center hover:from-accent hover:to-accent/80 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-110 border border-slate-200 dark:border-slate-700"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors" />
                            </a>
                            <a
                                href="#"
                                className="group w-11 h-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center hover:from-accent hover:to-accent/80 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-110 border border-slate-200 dark:border-slate-700"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors" />
                            </a>
                            <a
                                href="#"
                                className="group w-11 h-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center hover:from-accent hover:to-accent/80 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-110 border border-slate-200 dark:border-slate-700"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors" />
                            </a>
                            <a
                                href="#"
                                className="group w-11 h-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center hover:from-accent hover:to-accent/80 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-110 border border-slate-200 dark:border-slate-700"
                                aria-label="YouTube"
                            >
                                <Youtube className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2">
                        <h5 className="font-black text-primary dark:text-white mb-6 text-sm tracking-wider uppercase">
                            Collections
                        </h5>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/products?category=decor"
                                    className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-accent transition-colors"></span>
                                    Home Decor
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products?category=furniture"
                                    className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-accent transition-colors"></span>
                                    Modern Furniture
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products?category=lighting"
                                    className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-accent transition-colors"></span>
                                    Lighting
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products?category=kitchen"
                                    className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-accent transition-colors"></span>
                                    Kitchenware
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products?category=outdoor"
                                    className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-accent transition-colors"></span>
                                    Outdoor
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="lg:col-span-2">
                        <h5 className="font-black text-primary dark:text-white mb-6 text-sm tracking-wider uppercase">
                            Support
                        </h5>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-accent transition-colors"></span>
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-accent transition-colors"></span>
                                    Shipping & Returns
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-accent transition-colors"></span>
                                    Track Order
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-accent transition-colors"></span>
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-accent transition-colors"></span>
                                    Size Guide
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="lg:col-span-2">
                        <h5 className="font-black text-primary dark:text-white mb-6 text-sm tracking-wider uppercase">
                            Company
                        </h5>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-accent transition-colors"></span>
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-accent transition-colors"></span>
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-accent transition-colors"></span>
                                    Press
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-accent transition-colors"></span>
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-accent transition-colors"></span>
                                    Sustainability
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:col-span-2">
                        <h5 className="font-black text-primary dark:text-white mb-6 text-sm tracking-wider uppercase">
                            Newsletter
                        </h5>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                            Subscribe to get special offers, free giveaways, and updates.
                        </p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 pr-12 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                            />
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-accent to-accent/80 text-white p-2.5 rounded-lg hover:from-accent/90 hover:to-accent transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                                aria-label="Subscribe"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Secure
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                No Spam
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                            <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                                © 2026 LuxeCart. All Rights Reserved.
                            </p>
                            <div className="flex gap-6 text-xs text-slate-500 dark:text-slate-500 font-semibold">
                                <Link href="#" className="hover:text-accent transition-colors">Terms</Link>
                                <Link href="#" className="hover:text-accent transition-colors">Privacy</Link>
                                <Link href="#" className="hover:text-accent transition-colors">Cookies</Link>
                                <Link href="#" className="hover:text-accent transition-colors">Accessibility</Link>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 dark:text-slate-500 font-semibold">We Accept:</span>
                            <div className="flex gap-2">
                                <div className="w-10 h-7 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">VISA</span>
                                </div>
                                <div className="w-10 h-7 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">MC</span>
                                </div>
                                <div className="w-10 h-7 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">AMEX</span>
                                </div>
                                <div className="w-10 h-7 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">PP</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
