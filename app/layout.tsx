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
    title: "LuxeCart - Premium E-Commerce Store",
    description: "Discover amazing products with the best shopping experience. Modern, fast, and secure e-commerce platform.",
    keywords: ["e-commerce", "shopping", "online store", "products", "fashion", "electronics"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
            </head>
            <body className="antialiased">
                <Navbar />
                <main className="min-h-screen">
                    {children}
                </main>
                <Footer />

                {/* Floating Components */}
                <FloatingCart />
                <LiveChat />
                <FloatingActionButton />

                {/* Mobile-Only Components */}
                <FloatingMobileNav />
                <MobileSearchModal />
                <MobileComparisonSheet />

                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 4000,
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </body>
        </html>
    );
}
