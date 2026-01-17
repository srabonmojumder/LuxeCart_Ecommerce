import type { Config } from "tailwindcss";

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
            // Custom Colors - Ochaka Inspired
            colors: {
                primary: {
                    DEFAULT: '#000000',
                    50: '#f6f6f6',
                    100: '#e7e7e7',
                    200: '#d1d1d1',
                    300: '#b0b0b0',
                    400: '#888888',
                    500: '#6d6d6d',
                    600: '#5d5d5d',
                    700: '#4f4f4f',
                    800: '#454545',
                    900: '#3d3d3d',
                    950: '#000000',
                },
                accent: {
                    DEFAULT: '#685BC7',
                    50: '#f4f3fd',
                    100: '#eae8fb',
                    200: '#d6d3f8',
                    300: '#b9b2f2',
                    400: '#9389e8',
                    500: '#685bc7',
                    600: '#5d4daf',
                    700: '#4d4091',
                    800: '#423878',
                    900: '#393164',
                    950: '#211c3a',
                },
                secondary: {
                    DEFAULT: '#5F615E',
                    50: '#f7f7f7',
                    100: '#efefef',
                    200: '#dfdfdf',
                    300: '#c7c7c7',
                    400: '#a7a7a7',
                    500: '#5F615E',
                    600: '#4a4b49',
                    700: '#3b3c3b',
                    800: '#2d2e2d',
                    900: '#1f1f1f',
                },
                // Status Colors
                hot: '#FF3B30',
                new: '#34C759',
                limited: '#FF9500',
            },
            // Font Family
            fontFamily: {
                sans: ['Afacad', 'Inter', 'sans-serif'],
                display: ['Afacad', 'Inter', 'sans-serif'],
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
            // Ochaka-inspired shadows
            boxShadow: {
                'xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
                'soft': '0 2px 8px rgba(0, 0, 0, 0.05)',
                'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
                'strong': '0 8px 32px rgba(0, 0, 0, 0.12)',
                'xl': '0 16px 48px rgba(0, 0, 0, 0.16)',
                '2xl': '0 24px 64px rgba(0, 0, 0, 0.20)',
                'accent': '0 8px 32px rgba(167, 158, 242, 0.25)',
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
