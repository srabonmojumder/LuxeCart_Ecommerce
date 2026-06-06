'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
    endDate: Date;
}

export default function CountdownTimer({ endDate }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = endDate.getTime() - new Date().getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <motion.div
                key={value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-700 rounded-lg px-4 py-3 min-w-[70px] shadow-lg"
            >
                <div className="text-3xl font-bold text-accent-600 dark:text-accent-400">
                    {value.toString().padStart(2, '0')}
                </div>
            </motion.div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 uppercase">
                {label}
            </div>
        </div>
    );

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <Timer className="w-6 h-6 animate-pulse" />
                <span className="font-semibold">Flash Sale Ends In:</span>
            </div>
            <div className="flex gap-3">
                <TimeUnit value={timeLeft.days} label="Days" />
                <TimeUnit value={timeLeft.hours} label="Hours" />
                <TimeUnit value={timeLeft.minutes} label="Mins" />
                <TimeUnit value={timeLeft.seconds} label="Secs" />
            </div>
        </div>
    );
}
