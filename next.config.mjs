/** @type {import('next').NextConfig} */
const nextConfig = {
    // Fully static build → emits an `out/` directory of static HTML for
    // Firebase Hosting (no backend on this branch). trailingSlash makes each
    // route a folder with index.html, which Firebase serves on clean URLs.
    output: 'export',
    trailingSlash: true,
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
