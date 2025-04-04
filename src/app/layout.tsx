import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EV Şarj Kampanyaları",
  description: "Ramazan bayramı şarj kampanyaları. Trugo Togg Bedava Beeful 1₺ şarj kampanyası. Epsis bedava şarj.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Şarj Kampanya",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#ffffff",
  applicationName: "Şarj Kampanya",
  keywords: ["elektrikli araç", "şarj", "kampanya", "indirim", "fiyat karşılaştırma"],
  authors: [{ name: "EV Kampanyaları" }],
  creator: "EV Kampanyaları",
  publisher: "EV Kampanyaları",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://evkampanyalari.com",
    siteName: "EV Şarj Kampanyaları",
    title: "EV Şarj Kampanyaları",
    description: "Elektrikli araç şarj istasyonları kampanyalarını karşılaştırın ve en iyi fırsatları bulun.",
    images: [
      {
        url: "/images/logo.svg",
        width: 512,
        height: 512,
        alt: "EV Şarj Kampanyaları Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EV Şarj Kampanyaları",
    description: "Elektrikli araç şarj istasyonları kampanyalarını karşılaştırın ve en iyi fırsatları bulun.",
    images: ["/images/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
  alternates: {
    canonical: "https://evkampanyalari.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <meta name="google-adsense-account" content="ca-pub-2397496183137321" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon0.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon1.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Şarj Kampanya" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="application-name" content="Şarj Kampanya" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-494PE0HRE7" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-494PE0HRE7');
          `}
        </Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2397496183137321"
          crossOrigin="anonymous"
          id="google-adsense"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
