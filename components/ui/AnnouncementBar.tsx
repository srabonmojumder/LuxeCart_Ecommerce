'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const announcements = [
        { id: 1, text: '🎉 New Year Sale! Get up to 50% OFF on selected items', color: 'bg-gradient-to-r from-purple-600 to-pink-600' },
        { id: 2, text: '🚚 Free Shipping on orders over $50 - Limited Time!', color: 'bg-gradient-to-r from-blue-600 to-cyan-600' },
        { id: 3, text: '⭐ Join our loyalty program and earn rewards on every purchase', color: 'bg-gradient-to-r from-green-600 to-emerald-600' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % announcements.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [announcements.length]);

    if (!isVisible) return null;

    return (
        <div className={`${announcements[currentIndex].color} text-white py-2 relative overflow-hidden`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <div className="w-6" /> {/* Spacer for centering */}

                <div className="flex-1 flex justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentIndex}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-sm font-medium text-center"
                        >
                            {announcements[currentIndex].text}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Progress Indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                <motion.div
                    key={currentIndex}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className="h-full bg-white"
                />
            </div>
        </div>
    );
}
