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
          destination: "http://localhost:5000/api/:path*", // Chuyển hướng API về backend
        },
      ];
    },
  };
  
  export default nextConfig;