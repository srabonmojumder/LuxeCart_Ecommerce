'use client';

import { useRef, useEffect, ElementType } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface RevealProps {
    children: React.ReactNode;
    /** Vertical travel distance in px (default 40). */
    y?: number;
    /** Delay before the reveal starts. */
    delay?: number;
    /** Per-child stagger (seconds). When set, direct children animate in sequence. */
    stagger?: number;
    duration?: number;
    as?: ElementType;
    className?: string;
    /** Viewport entry point (default 'top 85%'). */
    start?: string;
}

/**
 * GSAP ScrollTrigger reveal — fades + slides content up as it enters the viewport.
 * Use `stagger` to animate direct children in sequence (e.g. a grid or heading block).
 * Respects prefers-reduced-motion (renders content immediately, no animation).
 */
export default function Reveal({
    children,
    y = 40,
    delay = 0,
    stagger,
    duration = 0.9,
    as: Tag = 'div',
    className,
    start = 'top 85%',
}: RevealProps) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const targets: Element[] = stagger != null ? Array.from(el.children) : [el];

        const ctx = gsap.context(() => {
            gsap.set(targets, { opacity: 0, y });
            gsap.to(targets, {
                opacity: 1,
                y: 0,
                duration,
                delay,
                ease: 'power3.out',
                stagger: stagger ?? 0,
                scrollTrigger: {
                    trigger: el,
                    start,
                    once: true,
                },
            });
        }, el);

        return () => ctx.revert();
    }, [y, delay, stagger, duration, start]);

    return (
        <Tag ref={ref} className={className}>
            {children}
        </Tag>
    );
}
