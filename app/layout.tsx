import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCart from "@/components/cart/FloatingCart";
import LiveChat from "@/components/chat/LiveChat";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import FloatingMobileNav from "@/components/ui/FloatingMobileNav";
import MobileSearchModal from "@/components/search/MobileSearchModal";
import MobileComparisonSheet from "@/components/ui/MobileComparisonSheet";

export const metadata: Metadata = {
    title: "LuxeCart - Premium E-Commerce Experience",
    description: "Discover amazing products with the best shopping experience. Modern, fast, and secure e-commerce platform with premium products curated for you.",
    keywords: ["e-commerce", "shopping", "online store", "products", "fashion", "electronics", "premium"],
    authors: [{ name: "LuxeCart" }],
    creator: "LuxeCart",
    openGraph: {
        type: "website",
        locale: "en_US",
        title: "LuxeCart - Premium E-Commerce Experience",
        description: "Discover amazing products with the best shopping experience.",
        siteName: "LuxeCart",
    },
    twitter: {
        card: "summary_large_image",
        title: "LuxeCart - Premium E-Commerce Experience",
        description: "Discover amazing products with the best shopping experience.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
                <meta name="theme-color" content="#14b8a6" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            </head>
            <body className="antialiased bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {/* Main Navigation */}
                <Navbar />

                {/* Main Content */}
                <main className="min-h-screen">
                    {children}
                </main>

                {/* Footer - Hidden on mobile for bottom nav space */}
                <div className="hidden md:block">
                    <Footer />
                </div>

                {/* Floating Components - Desktop */}
                <div className="hidden md:block">
                    <FloatingCart />
                    <LiveChat />
                    <FloatingActionButton />
                </div>

                {/* Mobile-Only Components */}
                <FloatingMobileNav />
                <MobileSearchModal />
                <MobileComparisonSheet />

                {/* Toast Notifications */}
                <Toaster
                    position="top-center"
                    gutter={12}
                    containerStyle={{ top: 120 }}
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#ffffff',
                            color: '#0f172a',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
                            fontWeight: 500,
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#14b8a6',
                                secondary: '#fff',
                            },
                            style: {
                                border: '1px solid #ccfbf1',
                            },
                        },
                        error: {
                            duration: 4000,
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                            style: {
                                border: '1px solid #fecaca',
                            },
                        },
                    }}
                />
            </body>
        </html>
    );
}
