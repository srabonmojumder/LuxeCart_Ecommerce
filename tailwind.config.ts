import type { Config } from "tailwindcss";

// Warm near-black "ink" ramp — replaces cold black for a softer, luxe feel.
const ink = {
    DEFAULT: '#14110E',
    50: '#f6f5f3',
    100: '#e9e7e2',
    200: '#d4d0c8',
    300: '#b3ada1',
    400: '#8a8478',
    500: '#6b655a',
    600: '#524d44',
    700: '#3d3a33',
    800: '#2a2722',
    900: '#1a1714',
    950: '#0f0d0b',
};

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        screens: {
            'xs': '375px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
        extend: {
            // Luxury Editorial palette — warm ink, muted antique gold, ivory canvas
            colors: {
                // primary === warm ink (used everywhere as the dark/foreground tone)
                primary: ink,
                ink,
                // Muted antique gold — refined, never garish
                accent: {
                    DEFAULT: '#B89B5E',
                    50: '#fbf9f3',
                    100: '#f5eedd',
                    200: '#eadbb6',
                    300: '#dcc289',
                    400: '#cdaa6c',
                    500: '#b89b5e',
                    600: '#9e8049',
                    700: '#7e633a',
                    800: '#5e4b2f',
                    900: '#443728',
                    950: '#271f15',
                },
                // Warm taupe-stone for secondary text / muted UI
                secondary: {
                    DEFAULT: '#6F685C',
                    50: '#f7f6f3',
                    100: '#edeae4',
                    200: '#dcd7cc',
                    300: '#c3bcab',
                    400: '#a39a86',
                    500: '#6f685c',
                    600: '#574f44',
                    700: '#433d35',
                    800: '#2f2b25',
                    900: '#1f1c18',
                },
                // Editorial surfaces
                canvas: '#F6F4EF',   // warm ivory page background
                ivory: '#FBFAF6',    // lighter card / panel
                // Refined, muted status colors
                hot: '#B23A2E',
                new: '#5C7A57',
                limited: '#B8862E',
            },
            // Font Family — Fraunces (serif display) + Plus Jakarta Sans (clean UI sans),
            // injected via next/font CSS variables in app/layout.tsx.
            fontFamily: {
                sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
                serif: ['var(--font-display)', 'Georgia', 'serif'],
                display: ['var(--font-display)', 'Georgia', 'serif'],
            },
            // Custom spacing scale (8px base unit)
            spacing: {
                'tk-3xs': '0.125rem',   // 2px
                'tk-2xs': '0.25rem',    // 4px
                'tk-xs': '0.5rem',      // 8px
                'tk-sm': '0.75rem',     // 12px
                'tk-md': '1rem',        // 16px
                'tk-lg': '1.5rem',      // 24px
                'tk-xl': '2rem',        // 32px
                'tk-2xl': '3rem',       // 48px
                'tk-3xl': '4rem',       // 64px
                'tk-4xl': '6rem',       // 96px
                'tk-5xl': '8rem',       // 128px
                '18': '4.5rem',      // 72px - for navbar
                '22': '5.5rem',      // 88px
                'safe': 'env(safe-area-inset-bottom)',
            },
            // Enhanced scale for subtle hover effects
            scale: {
                '98': '0.98',
                '102': '1.02',
                '103': '1.03',
            },
            // Soft, warm editorial shadows (warm-tinted blacks)
            boxShadow: {
                'xs': '0 1px 2px rgba(28, 22, 14, 0.04)',
                'soft': '0 2px 12px rgba(28, 22, 14, 0.05)',
                'medium': '0 6px 24px rgba(28, 22, 14, 0.07)',
                'strong': '0 12px 40px rgba(28, 22, 14, 0.10)',
                'xl': '0 20px 56px rgba(28, 22, 14, 0.12)',
                '2xl': '0 28px 72px rgba(28, 22, 14, 0.16)',
                'premium': '0 32px 64px -12px rgba(28, 22, 14, 0.14), 0 12px 28px -8px rgba(28, 22, 14, 0.05)',
                'accent': '0 12px 36px rgba(184, 155, 94, 0.25)',
            },
            // Border radius
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            // Animation
            animation: {
                'float': 'float 4s ease-in-out infinite',
                'float-slow': 'float-slow 6s ease-in-out infinite',
                'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
                'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
                'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                'fade-in': 'fade-in 0.3s ease-out',
                'scale-in': 'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                'shimmer': 'shimmer 2s infinite',
                'gradient': 'gradient-x 3s ease infinite',
                'spotlight': 'spotlight 3s ease-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                'float-slow': {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(2deg)' },
                },
                'pulse-soft': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                'pulse-ring': {
                    '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(20, 184, 166, 0.7)' },
                    '70%': { transform: 'scale(1)', boxShadow: '0 0 0 12px rgba(20, 184, 166, 0)' },
                    '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(167, 158, 242, 0)' },
                },
                'bounce-subtle': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
                'slide-up': {
                    from: { transform: 'translateY(100%)', opacity: '0' },
                    to: { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                'scale-in': {
                    from: { transform: 'scale(0.9)', opacity: '0' },
                    to: { transform: 'scale(1)', opacity: '1' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                'gradient-x': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                spotlight: {
                    '0%': { opacity: '0', transform: 'translate(-50%, -50%) scale(0.5)' },
                    '50%': { opacity: '0.15' },
                    '100%': { opacity: '0', transform: 'translate(-50%, -50%) scale(2)' },
                },
            },
            // Backdrop blur
            backdropBlur: {
                xs: '2px',
            },
            // Z-index scale
            zIndex: {
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100',
            },
            // Aspect ratios
            aspectRatio: {
                'product': '3/4',
                'product-wide': '4/3',
                'hero': '16/9',
            },
            // Transition timing functions
            transitionTimingFunction: {
                'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
            // Transition duration
            transitionDuration: {
                '250': '250ms',
                '350': '350ms',
                '400': '400ms',
            },
        },
    },
    plugins: [],
};

export default config;
