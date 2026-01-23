'use client';

import { motion } from 'framer-motion';
import { Gift, Star, TrendingUp, Crown, Shield } from 'lucide-react';

interface LoyaltyBadgeProps {
    points: number;
}

export default function LoyaltyBadge({ points }: LoyaltyBadgeProps) {
    const getTier = (points: number) => {
        if (points >= 10000) return { name: 'Obsidian', icon: Crown, color: 'bg-black', textColor: 'text-white' };
        if (points >= 5000) return { name: 'Indigo', icon: Star, color: 'bg-accent', textColor: 'text-white' };
        if (points >= 1000) return { name: 'Graphite', icon: Shield, color: 'bg-secondary', textColor: 'text-white' };
        return { name: 'Quartz', icon: Gift, color: 'bg-primary/10', textColor: 'text-primary' };
    };

    const tier = getTier(points);
    const TierIcon = tier.icon;

    const nextTier = points < 1000 ? 1000 : points < 5000 ? 5000 : points < 10000 ? 10000 : null;
    const progress = nextTier ? ((points % nextTier) / nextTier) * 100 : 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-primary/5  relative overflow-hidden group"
        >
            <div className="relative z-10 flex items-center justify-between mb-10">
                <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl ${tier.color} ${tier.textColor} flex items-center justify-center shadow-xl`}>
                        <TierIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-primary tracking-tighter uppercase leading-none mb-1">
                            {tier.name}
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">
                            Level Status
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-black text-primary tracking-tighter">
                        {points.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-black text-accent tracking-widest uppercase">
                        Units Accum
                    </p>
                </div>
            </div>

            {nextTier && (
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-400">Progression Index</span>
                        <span className="text-sm font-black text-primary">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1 bg-primary/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className={`h-full ${tier.name === 'Quartz' ? 'bg-accent' : tier.color}`}
                        />
                    </div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center">
                        {(nextTier - points).toLocaleString()} Units for Next Elevation
                    </p>
                </div>
            )}

            <div className="mt-8 pt-8 border-t border-primary/5">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6">
                    Active Privileges:
                </h4>
                <ul className="space-y-3">
                    {[
                        `${tier.name === 'Obsidian' ? '25%' : tier.name === 'Indigo' ? '15%' : tier.name === 'Graphite' ? '10%' : '5%'} Archival Deduction`,
                        `Complimentary Logistics ${tier.name === 'Quartz' ? '($50+)' : ''}`,
                        tier.name !== 'Quartz' ? 'Priority Notification' : 'Standard Access'
                    ].map((benefit, i) => (
                        <li key={i} className="flex items-center gap-4 group/item">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent group-hover/item:scale-150 transition-transform" />
                            <span className="text-xs font-black text-secondary tracking-tight uppercase">{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Background Accent */}
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    );
}
