'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface NotifyModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    productImage?: string;
}

export default function BackInStockModal({ isOpen, onClose, productName, productImage }: NotifyModalProps) {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsLoading(false);
        setIsSubmitted(true);
        toast.success('You will be notified when this item is back in stock!');

        setTimeout(() => {
            onClose();
            setIsSubmitted(false);
            setEmail('');
        }, 2000);
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
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-4">
                                    <motion.div
                                        animate={{ rotate: [0, 15, -15, 0] }}
                                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                                        className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
                                    >
                                        <Bell className="w-8 h-8" />
                                    </motion.div>
                                    <div>
                                        <h2 className="text-xl font-bold">Notify Me</h2>
                                        <p className="text-white/80 text-sm">
                                            Get notified when back in stock
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <AnimatePresence mode="wait">
                                    {isSubmitted ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="text-center py-8"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                                className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
                                            >
                                                <CheckCircle className="w-10 h-10 text-green-500" />
                                            </motion.div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                You're on the list!
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                We'll notify you as soon as {productName} is available.
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key="form"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onSubmit={handleSubmit}
                                        >
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Enter your email to be notified when <span className="font-medium text-gray-900 dark:text-white">{productName}</span> is back in stock.
                                            </p>

                                            <div className="relative mb-4">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter your email"
                                                    required
                                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                                />
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {isLoading ? (
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        <Bell className="w-5 h-5" />
                                                        Notify Me
                                                    </>
                                                )}
                                            </motion.button>

                                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                                                We'll only send one email. No spam, promise!
                                            </p>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
