/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        //appDir: true,
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:3001/api/:path*", // Chuyển hướng API về backend
            },
        ];
    },
};

export default nextConfig;
