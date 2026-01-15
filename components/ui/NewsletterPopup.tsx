'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const hasSeenPopup = localStorage.getItem('newsletter-popup-seen');
        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 5000); // Show after 5 seconds

            return () => clearTimeout(timer);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            localStorage.setItem('newsletter-popup-seen', 'true');
            toast.success('Thanks for subscribing!');
            setIsOpen(false);
        }
    };

    const handleClose = () => {
        localStorage.setItem('newsletter-popup-seen', 'true');
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 px-4"
                    >
                        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />

                            {/* Close button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex items-center justify-center mb-6">
                                    <div className="bg-white/20 p-4 rounded-full">
                                        <Sparkles className="w-12 h-12" />
                                    </div>
                                </div>

                                <h2 className="text-3xl font-bold mb-3 text-center">
                                    Get 15% Off Your First Order!
                                </h2>
                                <p className="text-white/90 mb-6 text-center">
                                    Subscribe to our newsletter and receive exclusive deals, new arrival updates, and special promotions.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-white text-purple-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        Get My Discount
                                    </button>
                                </form>

                                <p className="text-xs text-white/70 text-center mt-4">
                                    No spam, unsubscribe anytime
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
