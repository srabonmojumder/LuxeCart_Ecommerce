// Storefront mirror of the backend content defaults — used as the instant
// fallback before /content loads. The API returns the merged tree, so
// components can read fields directly off `useContent().content`.

export interface FeatureItem {
    icon: string; // truck | shield | returns | zap | gift | lock | award | clock
    title: string;
    desc: string;
}

export interface SiteContent {
    homepage: {
        hero: { subtitle: string; title: string; ctaText: string; ctaLink: string };
        bestSellers: { title: string; subtitle: string };
        numbers: { eyebrow: string; title: string };
        collections: { eyebrow: string; title: string };
        newArrivals: { eyebrow: string; title: string };
        testimonials: { eyebrow: string; title: string };
        promo: { eyebrow: string; fallbackTitle: string; fallbackText: string };
        newsletter: { title: string; subtitle: string };
    };
    features: FeatureItem[];
    promo: {
        flashSaleHours: number;
        dealHours: number;
        megaMenu: {
            tech: { image: string; title: string; discount: string };
            support: { image: string; title: string; discount: string };
        };
    };
    footer: { tagline: string };
    pages: { about: { title: string; body: string } };
}

export const defaultContent: SiteContent = {
    homepage: {
        hero: {
            subtitle: 'New Collection 2026',
            title: 'Timeless pieces for modern living',
            ctaText: 'Explore the Collection',
            ctaLink: '/products',
        },
        bestSellers: { title: 'Our Best Sellers', subtitle: 'Shop the most loved items this season.' },
        numbers: { eyebrow: 'Trusted Worldwide', title: 'The Numbers Speak' },
        collections: { eyebrow: 'Curated For You', title: 'Shop by Collection' },
        newArrivals: { eyebrow: 'Just Landed', title: 'New Arrivals' },
        testimonials: { eyebrow: 'Loved by Customers', title: 'What People Say' },
        promo: {
            eyebrow: 'Limited Offer',
            fallbackTitle: 'Minimalist Design Deal',
            fallbackText: 'Experience the perfect blend of form and function — exclusive mid-season pricing on our most-loved pieces.',
        },
        newsletter: {
            title: 'Stay Inspired',
            subtitle: 'Join our community and get exclusive early access to our new drops, styling tips, and 15% off your first order.',
        },
    },
    features: [
        { icon: 'truck', title: 'Free Shipping', desc: '' },
        { icon: 'shield', title: 'Secure Payment', desc: 'Verified checkout' },
        { icon: 'returns', title: 'Easy Returns', desc: '30 day returns' },
        { icon: 'zap', title: 'Fast Delivery', desc: 'Across the globe' },
    ],
    promo: {
        flashSaleHours: 36,
        dealHours: 48,
        megaMenu: {
            tech: { image: '/photo-1505740420928-5e560c06d30e.webp', title: 'Tech Deals', discount: 'Up to 40% OFF' },
            support: { image: '/photo-1441986300917-64674bd600d8.webp', title: 'Customer Support', discount: 'Here 24/7' },
        },
    },
    footer: { tagline: 'Curated minimalist home accessories, designed to bring harmony to your living space.' },
    pages: { about: { title: 'About Us', body: 'We craft timeless, minimalist pieces designed to bring harmony to modern living.' } },
};
