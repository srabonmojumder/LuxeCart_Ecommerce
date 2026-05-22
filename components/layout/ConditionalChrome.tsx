'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TopUtilityBar from '@/components/layout/TopUtilityBar';
import MegaMenu from '@/components/layout/MegaMenu';
import FloatingMobileNav from '@/components/ui/FloatingMobileNav';

/**
 * Renders the storefront chrome (navbar, mega menu, footer, mobile nav) around
 * the page — except on /admin routes, which have their own dashboard layout.
 */
export default function ConditionalChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <main className="relative">{children}</main>;
    }

    return (
        <>
            <TopUtilityBar />
            <div className="sticky top-0 z-50">
                <Navbar />
                <MegaMenu />
            </div>
            <main className="relative my-5">{children}</main>
            <Footer />
            <FloatingMobileNav />
        </>
    );
}
