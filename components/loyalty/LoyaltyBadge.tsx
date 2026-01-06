'use client';

import { motion } from 'framer-motion';
import { Gift, Star, TrendingUp, Crown } from 'lucide-react';

interface LoyaltyBadgeProps {
    points: number;
}

export default function LoyaltyBadge({ points }: LoyaltyBadgeProps) {
    const getTier = (points: number) => {
        if (points >= 10000) return { name: 'Diamond', icon: Crown, color: 'from-purple-600 to-pink-600', textColor: 'text-purple-600' };
        if (points >= 5000) return { name: 'Gold', icon: Star, color: 'from-yellow-500 to-orange-500', textColor: 'text-yellow-600' };
        if (points >= 1000) return { name: 'Silver', icon: TrendingUp, color: 'from-gray-400 to-gray-500', textColor: 'text-gray-600' };
        return { name: 'Bronze', icon: Gift, color: 'from-amber-600 to-amber-700', textColor: 'text-amber-600' };
    };

    const tier = getTier(points);
    const TierIcon = tier.icon;

    const nextTier = points < 1000 ? 1000 : points < 5000 ? 5000 : points < 10000 ? 10000 : null;
    const progress = nextTier ? ((points % nextTier) / nextTier) * 100 : 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border border-gray-200 dark:border-gray-700"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center shadow-lg`}>
                        <TierIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {tier.name} Member
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {points.toLocaleString()} points
                        </p>
                    </div>
                </div>
            </div>

            {nextTier && (
                <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Progress to next tier</span>
                        <span className="font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full bg-gradient-to-r ${tier.color}`}
                        />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {(nextTier - points).toLocaleString()} points until next tier
                    </p>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Your Benefits:
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                        {tier.name === 'Diamond' ? '25%' : tier.name === 'Gold' ? '15%' : tier.name === 'Silver' ? '10%' : '5%'} off all orders
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                        Free shipping {tier.name === 'Bronze' ? 'on orders $50+' : 'on all orders'}
                    </li>
                    {tier.name !== 'Bronze' && (
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                            Early access to sales
                        </li>
                    )}
                </ul>
            </div>
        </motion.div>
    );
}
