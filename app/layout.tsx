import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'sonner';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TopUtilityBar from "@/components/layout/TopUtilityBar";
import MegaMenu from "@/components/layout/MegaMenu";
import FloatingMobileNav from "@/components/ui/FloatingMobileNav";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
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
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
                <meta name="theme-color" content="#000000" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
            </head>
            <body suppressHydrationWarning className="antialiased bg-white dark:bg-slate-950 text-secondary dark:text-gray-400">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <TopUtilityBar />
                    <div className="sticky top-0 z-50">
                        <Navbar />
                        <MegaMenu />
                    </div>
                    <main className="relative my-5">
                        {children}
                    </main>
                    <Footer />
                    <FloatingMobileNav />
                    <Toaster position="top-right" richColors />
                </ThemeProvider>
            </body>
        </html>
    );
}
