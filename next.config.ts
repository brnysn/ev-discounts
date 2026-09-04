import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  transpilePackages: ["leaflet", "leaflet.markercluster", "@animated-color-icons/lucide-react"],
  async redirects() {
    return [
      {
        source: "/harita",
        destination: "/sarj-haritasi",
        permanent: true,
      },
    ]
  },
  async headers() {
    const logoCache = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ]
    return [
      { source: "/images/chargers/:path*", headers: logoCache },
      { source: "/images/companies/:path*", headers: logoCache },
    ]
  },
  images: {
    minimumCacheTTL: 2678400,
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['localhost', 'sarjkampanya.com'],
  },
};

export default nextConfig;
