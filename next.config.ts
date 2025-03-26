import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.sarjfiyat.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.oto-jet.com.tr',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.mig-go.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.epsis.net',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
