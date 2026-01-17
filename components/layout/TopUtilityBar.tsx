'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, ChevronDown, Facebook, Instagram, Twitter, User, Heart, MapPin } from 'lucide-react';

export default function TopUtilityBar() {
    const [currency, setCurrency] = useState('USD');
    const [language, setLanguage] = useState('English');
    const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

    const currencies = ['USD', 'EUR', 'GBP', 'CAD'];
    const languages = ['English', 'Spanish', 'French', 'German'];

    return (
        <div className="bg-slate-900 text-slate-300 text-xs py-2 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Left - Contact Info */}
                    <div className="hidden md:flex items-center gap-4">
                        <a href="tel:+1234567890" className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <Phone className="w-3.5 h-3.5" />
                            <span>+1 (234) 567-890</span>
                        </a>
                        <span className="w-px h-3 bg-slate-700" />
                        <a href="mailto:support@luxecart.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <Mail className="w-3.5 h-3.5" />
                            <span>support@luxecart.com</span>
                        </a>
                    </div>

                    {/* Center - Promo Text (mobile only) */}
                    <div className="md:hidden text-center flex-1">
                        <span className="text-teal-400 font-medium">Free Shipping on orders $50+</span>
                    </div>

                    {/* Right - Actions */}
                    <div className="flex items-center gap-3">
                        {/* Store Locator - Desktop */}
                        <Link href="/stores" className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Store Locator</span>
                        </Link>

                        <span className="hidden lg:block w-px h-3 bg-slate-700" />

                        {/* Currency Selector */}
                        <div className="relative hidden sm:block">
                            <button
                                onClick={() => {
                                    setShowCurrencyDropdown(!showCurrencyDropdown);
                                    setShowLanguageDropdown(false);
                                }}
                                className="flex items-center gap-1 hover:text-white transition-colors"
                            >
                                <span>{currency}</span>
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            {showCurrencyDropdown && (
                                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-1 z-50 min-w-[80px]">
                                    {currencies.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => {
                                                setCurrency(c);
                                                setShowCurrencyDropdown(false);
                                            }}
                                            className={`block w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 ${
                                                currency === c ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : ''
                                            }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Language Selector */}
                        <div className="relative hidden sm:block">
                            <button
                                onClick={() => {
                                    setShowLanguageDropdown(!showLanguageDropdown);
                                    setShowCurrencyDropdown(false);
                                }}
                                className="flex items-center gap-1 hover:text-white transition-colors"
                            >
                                <span>{language}</span>
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            {showLanguageDropdown && (
                                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-1 z-50 min-w-[100px]">
                                    {languages.map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => {
                                                setLanguage(l);
                                                setShowLanguageDropdown(false);
                                            }}
                                            className={`block w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 ${
                                                language === l ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : ''
                                            }`}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <span className="hidden sm:block w-px h-3 bg-slate-700" />

                        {/* Social Links */}
                        <div className="hidden md:flex items-center gap-2">
                            <a href="#" className="hover:text-white transition-colors">
                                <Facebook className="w-3.5 h-3.5" />
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <Instagram className="w-3.5 h-3.5" />
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <Twitter className="w-3.5 h-3.5" />
                            </a>
                        </div>

                        <span className="hidden md:block w-px h-3 bg-slate-700" />

                        {/* Wishlist */}
                        <Link href="/wishlist" className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors">
                            <Heart className="w-3.5 h-3.5" />
                            <span className="hidden lg:inline">Wishlist</span>
                        </Link>

                        {/* Login/Register */}
                        <Link href="/account" className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <User className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Login / Register</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
