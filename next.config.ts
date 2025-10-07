import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
  },
  // Убеждаемся, что статические файлы обслуживаются правильно
  trailingSlash: false,
  assetPrefix: '',
};

export default nextConfig;
