'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ShareButtonProps {
    productName: string;
    productUrl: string;
}

export default function ShareButton({ productName, productUrl }: ShareButtonProps) {
    const [showMenu, setShowMenu] = useState(false);

    const shareOptions = [
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'hover:bg-blue-600',
            action: () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank');
            },
        },
        {
            name: 'Twitter',
            icon: Twitter,
            color: 'hover:bg-sky-500',
            action: () => {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(productName)}&url=${encodeURIComponent(productUrl)}`, '_blank');
            },
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            color: 'hover:bg-blue-700',
            action: () => {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`, '_blank');
            },
        },
        {
            name: 'Email',
            icon: Mail,
            color: 'hover:bg-gray-600',
            action: () => {
                window.location.href = `mailto:?subject=${encodeURIComponent(productName)}&body=${encodeURIComponent(productUrl)}`;
            },
        },
        {
            name: 'Copy Link',
            icon: LinkIcon,
            color: 'hover:bg-purple-600',
            action: () => {
                navigator.clipboard.writeText(productUrl);
                toast.success('Link copied to clipboard!');
                setShowMenu(false);
            },
        },
    ];

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMenu(!showMenu)}
                className="p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 hover:text-purple-500 transition-colors"
            >
                <Share2 className="w-6 h-6" />
            </motion.button>

            <AnimatePresence>
                {showMenu && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMenu(false)}
                            className="fixed inset-0 z-40"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-3 z-50 min-w-[200px]"
                        >
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
                                Share this product
                            </p>
                            <div className="space-y-1">
                                {shareOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <button
                                            key={option.name}
                                            onClick={option.action}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 ${option.color} hover:text-white transition-all`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="text-sm font-medium">{option.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
