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
  title: "Elektrikli Araç Şarj Kampanyaları",
  description: "Türkiye'deki elektrikli araç şarj istasyonlarının güncel kampanyaları, indirimleri ve fiyat karşılaştırmaları. En uygun şarj tarifelerini keşfedin.",
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
  keywords: ["elektrikli araç", "şarj", "kampanya", "indirim", "fiyat karşılaştırma", "togg", "bedava şarj", "epsis", "beeful", "trugo", "bedava şarj", "epsis", "beeful", "astor"],
  authors: [{ name: "Yasin Baran", url: "https://yasinbaran.com", }],
  creator: "Yasin Baran",
  publisher: "Yasin Baran",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://sarjkampanya.com",
    siteName: "Elektrikli Araç Şarj Kampanyaları",
    title: "Elektrikli Araç Şarj Kampanyaları",
    description: "Türkiye'deki elektrikli araç şarj istasyonlarının güncel kampanyaları, indirimleri ve fiyat karşılaştırmaları. En uygun şarj tarifelerini keşfedin.",
    images: [
      {
        url: "https://sarjkampanya.com/images/logo.svg",
        width: 512,
        height: 512,
        alt: "Elektrikli Araç Şarj Kampanyaları Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elektrikli Araç Şarj Kampanyaları",
    description: "Türkiye'deki elektrikli araç şarj istasyonlarının güncel kampanyaları, indirimleri ve fiyat karşılaştırmaları. En uygun şarj tarifelerini keşfedin.",
    images: ["https://sarjkampanya.com/images/logo.svg"],
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
  alternates: {
    canonical: "https://sarjkampanya.com",
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
        <meta name="keywords" content="elektrikli araç, şarj, kampanya, indirim, fiyat karşılaştırma, togg, bedava şarj, epsis, beeful, trugo, bedava şarj, epsis, beeful, astor" />
        <meta name="author" content="Yasin Baran" />
        <meta name="publisher" content="Yasin Baran" />
        <meta name="creator" content="Yasin Baran" />
        <meta name="robots" content="index, follow" />
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
        <Script id="structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Elektrikli Araç Şarj Kampanyaları",
              "alternateName": "Şarj Kampanya",
              "url": "https://sarjkampanya.com",
              "description": "Türkiye'deki elektrikli araç şarj istasyonlarının güncel kampanyaları, indirimleri ve fiyat karşılaştırmaları. En uygun şarj tarifelerini keşfedin.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://sarjkampanya.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "author": {
                "@type": "Person",
                "name": "Yasin Baran",
                "url": "https://yasinbaran.com"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Şarj Kampanya",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://sarjkampanya.com/images/logo.svg",
                  "width": "512",
                  "height": "512"
                }
              }
            }
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
