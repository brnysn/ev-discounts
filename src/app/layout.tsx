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
  description: "Ramazan bayramına özel elektrikli araç şarj kampanyaları. Beeful 1₺ şarj kampanyası. Epsis bedava şarj.",
  icons: {
    icon: '/images/logo.svg',
    apple: '/images/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <meta name="google-adsense-account" content="ca-pub-2397496183137321" />
        <link rel="icon" href="/images/logo.svg" type="image/svg+xml" />
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
