'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, ChevronDown, Facebook, Instagram, Twitter, User, Heart, MapPin } from 'lucide-react';
import { useSettings } from '@/lib/hooks';

export default function TopUtilityBar() {
    const { settings } = useSettings();
    const phone = settings?.supportPhone || '+1 (234) 567-890';
    const email = settings?.supportEmail || 'support@luxecart.com';
    const promo = settings?.announcement || 'Free Shipping on orders $50+';
    const [currency, setCurrency] = useState('USD');
    const [language, setLanguage] = useState('English');
    const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

    const currencies = ['USD', 'EUR', 'GBP', 'CAD'];
    const languages = ['English', 'Spanish', 'French', 'German'];

    return (
        <div className="bg-ink-950 text-stone-300 text-xs py-2.5 tracking-wide border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Left - Contact Info */}
                    <div className="hidden md:flex items-center gap-4">
                        <a href={`tel:${phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{phone}</span>
                        </a>
                        <span className="w-px h-3 bg-slate-700" />
                        <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{email}</span>
                        </a>
                    </div>

                    {/* Center - Promo Text (mobile only) */}
                    <div className="md:hidden text-center flex-1">
                        <span className="text-accent-400 font-medium">{promo}</span>
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
                                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-ink-800 rounded-lg shadow-lg py-1 z-[60] min-w-[80px]">
                                    {currencies.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => {
                                                setCurrency(c);
                                                setShowCurrencyDropdown(false);
                                            }}
                                            className={`block w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 ${currency === c ? 'bg-accent/10 text-accent' : ''
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
                                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-ink-800 rounded-lg shadow-lg py-1 z-[60] min-w-[100px]">
                                    {languages.map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => {
                                                setLanguage(l);
                                                setShowLanguageDropdown(false);
                                            }}
                                            className={`block w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 ${language === l ? 'bg-accent/10 text-accent' : ''
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
                            <a href={settings?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                <Facebook className="w-3.5 h-3.5" />
                            </a>
                            <a href={settings?.instagram || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                <Instagram className="w-3.5 h-3.5" />
                            </a>
                            <a href={settings?.twitter || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
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
