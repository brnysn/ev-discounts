import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 2678400,
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['localhost', 'sarjkampanya.com'],
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
        hostname: 'www.inbrandadworks.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'mercurysarj.com.tr',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.mig-go.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'multiforce.com.tr',
        pathname: '/assets/img/**',
      },
      {
        protocol: 'https',
        hostname: 'www.epsis.net',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
        pathname: '/6800c6e81bb4128ed4c241ca/**',
      },
      {
        protocol: 'https',
        hostname: 'www.enerturk.com',
        pathname: '/application/themes/mediaclick/assets/img/**',
      },
      {
        protocol: 'https',
        hostname: 'www.voltrun.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
