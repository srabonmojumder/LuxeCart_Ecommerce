/** @type {import('next').NextConfig} */
const nextConfig = {
    // NOTE: 'output: export' removed so pages render dynamically from the Node
    // API (SSR/ISR) with live products and SEO intact, instead of a static build.
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            // Locally-served uploaded product images (backend /uploads).
            { protocol: 'http', hostname: 'localhost' },
            { protocol: 'http', hostname: '127.0.0.1' },
        ],
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
        formats: ['image/webp', 'image/avif'],
    },
};

export default nextConfig;
