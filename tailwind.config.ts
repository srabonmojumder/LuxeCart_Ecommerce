import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
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
            },
            // Enhanced scale for subtle hover effects
            scale: {
                '102': '1.02',
            },
            // Enhanced shadows for premium feel
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.05)',
                'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
                'strong': '0 8px 32px rgba(0, 0, 0, 0.12)',
                'purple': '0 8px 32px rgba(168, 85, 247, 0.15)',
            },
            // Line height for better readability
            lineHeight: {
                'relaxed-more': '1.75',
                'loose-more': '2',
            },
        },
    },
    plugins: [],
};

export default config;
