import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: '*.local',
      },
      {
        protocol: 'http',
        hostname: 'real-estate-store.local',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // In development, allow unoptimized images to bypass private IP restrictions
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
