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
            // Custom Colors - Teal Primary + Orange Accent
            colors: {
                primary: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                    950: '#042f2e',
                },
                accent: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    950: '#431407',
                },
            },
            // Font Family
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
            // Custom spacing scale (8px base unit)
            spacing: {
                '3xs': '0.125rem',   // 2px
                '2xs': '0.25rem',    // 4px
                'xs': '0.5rem',      // 8px
                'sm': '0.75rem',     // 12px
                'md': '1rem',        // 16px
                'lg': '1.5rem',      // 24px
                'xl': '2rem',        // 32px
                '2xl': '3rem',       // 48px
                '3xl': '4rem',       // 64px
                '4xl': '6rem',       // 96px
                '5xl': '8rem',       // 128px
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
            // Enhanced shadows for premium feel
            boxShadow: {
                'xs': '0 1px 2px rgba(15, 23, 42, 0.04)',
                'soft': '0 2px 8px rgba(15, 23, 42, 0.06)',
                'medium': '0 4px 16px rgba(15, 23, 42, 0.08)',
                'strong': '0 8px 32px rgba(15, 23, 42, 0.12)',
                'xl': '0 16px 48px rgba(15, 23, 42, 0.16)',
                '2xl': '0 24px 64px rgba(15, 23, 42, 0.20)',
                'inner-soft': 'inset 0 2px 4px rgba(15, 23, 42, 0.06)',
                'glow': '0 0 40px rgba(20, 184, 166, 0.15)',
                'glow-lg': '0 0 60px rgba(20, 184, 166, 0.2)',
                'glow-accent': '0 0 40px rgba(249, 115, 22, 0.15)',
                'primary': '0 8px 32px rgba(20, 184, 166, 0.25)',
                'accent': '0 8px 32px rgba(249, 115, 22, 0.25)',
            },
            // Border radius
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            // Line height for better readability
            lineHeight: {
                'tight': '1.15',
                'snug': '1.3',
                'relaxed-more': '1.75',
                'loose-more': '2',
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
                    '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(20, 184, 166, 0)' },
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
