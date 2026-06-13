import { Truck, Shield, RotateCcw, Zap, Gift, Lock, Award, Clock, type LucideIcon } from 'lucide-react';

/** Maps a content icon key → lucide icon. Used by the trust/features strip. */
export const iconByKey: Record<string, LucideIcon> = {
    truck: Truck,
    shield: Shield,
    returns: RotateCcw,
    zap: Zap,
    gift: Gift,
    lock: Lock,
    award: Award,
    clock: Clock,
};

/** Selectable icon keys (admin dropdown). */
export const FEATURE_ICON_KEYS = Object.keys(iconByKey);
