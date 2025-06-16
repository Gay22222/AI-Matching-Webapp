/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        //appDir: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3001',
                pathname: '/uploads/**',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:3001/api/:path*",
            },
            {
                source: "/uploads/:path*",
                destination: "http://localhost:3001/uploads/:path*",
            },
        ];
    },
};

export default nextConfig;