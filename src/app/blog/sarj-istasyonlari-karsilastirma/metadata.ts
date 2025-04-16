import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Şarj İstasyonları Karşılaştırma | Fiyat ve Hizmet Analizi | Sarj Kampanya",
  description: "Türkiye'deki tüm elektrikli araç şarj istasyonlarının fiyat, hız ve hizmet karşılaştırması. En uygun şarj noktasını keşfedin.",
  keywords: ["şarj istasyonu karşılaştırma", "elektrikli araç şarj fiyatları", "hızlı şarj istasyonları", "ZES", "Eşarj", "Sharz", "Voltrun", "Trugo", "Beeful", "şarj istasyonu ağları", "DC şarj", "AC şarj"],
  openGraph: {
    title: "Şarj İstasyonları Karşılaştırma | Fiyat ve Hizmet Analizi",
    description: "Türkiye'deki tüm elektrikli araç şarj istasyonlarının fiyat, hız ve hizmet karşılaştırması. En uygun şarj noktasını keşfedin.",
    url: "https://sarjkampanya.com/blog/sarj-istasyonlari-karsilastirma",
    type: "article",
    publishedTime: "2025-04-13",
    authors: ["Yasin Baran"],
    images: [
      {
        url: "/images/istasyon-karsilastirma.webp",
        width: 1200,
        height: 630,
        alt: "Şarj İstasyonları Karşılaştırma",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Şarj İstasyonları Karşılaştırma | Fiyat ve Hizmet Analizi",
    description: "Türkiye'deki tüm elektrikli araç şarj istasyonlarının fiyat, hız ve hizmet karşılaştırması. En uygun şarj noktasını keşfedin.",
    images: ["/images/istasyon-karsilastirma.webp"],
  },
  alternates: {
    canonical: "https://sarjkampanya.com/blog/sarj-istasyonlari-karsilastirma",
  },
}; 