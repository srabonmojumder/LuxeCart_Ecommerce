import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'sonner';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TopUtilityBar from "@/components/layout/TopUtilityBar";
import MegaMenu from "@/components/layout/MegaMenu";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
    title: "LuxeCart - Modern Home Accessories",
    description: "Premium e-commerce experience for modern home accessories. Minimalist design for a better living.",
    keywords: ["e-commerce", "home decor", "minimalist", "modern", "premium"],
    authors: [{ name: "LuxeCart" }],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
                <meta name="theme-color" content="#000000" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
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
                    <Toaster position="top-right" richColors />
                </ThemeProvider>
            </body>
        </html>
    );
}
