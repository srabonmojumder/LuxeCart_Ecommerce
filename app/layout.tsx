import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

// Body / UI font — clean, warm, modern.
const sans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-sans",
    display: "swap",
});

// Display / headings font — soft, elegant editorial serif.
const display = Fraunces({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
    variable: "--font-display",
    display: "swap",
});
import ConditionalChrome from "@/components/layout/ConditionalChrome";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { generateOrganizationSchema } from "@/lib/seo";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://luxecart.com'),
    title: {
        default: 'LuxeCart - Premium Modern Home Accessories & Decor',
        template: '%s | LuxeCart',
    },
    description: "Premium e-commerce experience for modern home accessories. Discover minimalist designs, electronics, fashion, and more. Free shipping on orders over $50.",
    keywords: ["e-commerce", "home decor", "minimalist", "modern", "premium", "electronics", "fashion", "accessories", "online shopping"],
    authors: [{ name: "LuxeCart" }],
    creator: 'LuxeCart',
    publisher: 'LuxeCart',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        siteName: 'LuxeCart',
        title: 'LuxeCart - Premium Modern Home Accessories & Decor',
        description: 'Premium e-commerce experience for modern home accessories. Minimalist design for a better living.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'LuxeCart - Modern Home Accessories',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@luxecart',
        creator: '@luxecart',
        title: 'LuxeCart - Premium Modern Home Accessories',
        description: 'Premium e-commerce experience for modern home accessories.',
        images: ['/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const organizationSchema = generateOrganizationSchema();

    return (
        <html lang="en" className={`${sans.variable} ${display.variable} scroll-smooth`} suppressHydrationWarning>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
                <meta name="theme-color" content="#0A0A0A" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
            </head>
            <body suppressHydrationWarning className="antialiased bg-canvas dark:bg-ink-950 text-ink-700 dark:text-stone-300">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <ConditionalChrome>{children}</ConditionalChrome>
                        <Toaster position="top-right" richColors />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
