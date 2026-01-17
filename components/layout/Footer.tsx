import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-primary text-white pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
                    {/* Brand Info */}
                    <div className="col-span-2 md:col-span-1">
                        <h4 className="text-3xl font-black tracking-tighter mb-8">LuxeCart</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
                            Premium home accessories for the modern minimalist. Elevate your living space with our curated collection of decor, lighting, and essentials.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all border border-white/10">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all border border-white/10">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all border border-white/10">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h5 className="font-bold mb-8 text-xs tracking-[0.2em] uppercase">Collections</h5>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link href="/products?category=decor" className="hover:text-accent transition-colors">Home Decor</Link></li>
                            <li><Link href="/products?category=furniture" className="hover:text-accent transition-colors">Modern Furniture</Link></li>
                            <li><Link href="/products?category=lighting" className="hover:text-accent transition-colors">Lighting</Link></li>
                            <li><Link href="/products?category=kitchen" className="hover:text-accent transition-colors">Kitchenware</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h5 className="font-bold mb-8 text-xs tracking-[0.2em] uppercase">Support</h5>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-span-2 md:col-span-1">
                        <h5 className="font-bold mb-8 text-xs tracking-[0.2em] uppercase">Newsletter</h5>
                        <p className="text-gray-400 text-sm mb-6">Stay updated with our latest collections and exclusive offers.</p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-accent transition-colors"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-white hover:text-primary transition-all">
                                SUBSCRIBE
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-gray-500 font-medium">
                        © 2026 LuxeCart. All Rights Reserved.
                    </p>
                    <div className="flex gap-8 text-[10px] text-gray-500 font-bold tracking-widest uppercase">
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
