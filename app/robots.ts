import { MetadataRoute } from 'next';

// Required for `output: export` — emit a single static robots.txt.
export const dynamic = 'force-static';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxecart.com';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                // Keep private / transactional pages out of the index.
                disallow: [
                    '/api/',
                    '/admin',
                    '/account',
                    '/checkout',
                    '/cart',
                    '/wishlist',
                    '/compare',
                    '/payment/',
                    '/order-success',
                    '/orders/',
                    '/reset-password',
                    '/verify-email',
                ],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
